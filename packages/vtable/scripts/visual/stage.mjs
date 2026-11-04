import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { createRuntime, fileManifest, digest, atomicJson, serve, fault } from './runtime.mjs';
import { build, workingTree, official } from './build.mjs';
import { loadCases, executePhase, validateResults } from './runner.mjs';
import { saveReport } from '../../__tests__/visual/report.mjs';

const product = 'vtable';
const suitePath = `packages/${product}/__tests__/visual`;
const sha = /^[a-f0-9]{40}$/;

/** 阶段产物绑定完整输入；中间构建或截图不能作为比较完成证据。 */
export function stageIdentity(request) {
  if (request.schemaVersion !== 1 || !['build', 'capture', 'compare'].includes(request.stage) ||
      request.identity?.repository !== (product === 'vtable' ? 'VisActor/VTable' : 'VisActor/VChart') ||
      !sha.test(request.identity.headSha) || !sha.test(request.identity.baseSha) ||
      !/^[a-f0-9]{64}$/.test(request.suiteDigest ?? '') || !/^[a-f0-9]{64}$/.test(request.environmentDigest ?? '') ||
      (!['baseline', 'current'].includes(request.side) && request.stage !== 'compare') || request.stage === 'compare' && request.side !== null ||
      !['baseline', 'current'].every(side => /^[a-f0-9]{64}$/.test(request.dependencyDigests?.[side] ?? ''))) throw fault('STAGE_IDENTITY_INVALID', '阶段输入身份不符');
  return { identity: request.identity, suiteDigest: request.suiteDigest, environmentDigest: request.environmentDigest, dependencyDigests: request.dependencyDigests };
}

/** 读取阶段文件前验证完整清单和摘要，不跟随输入目录中的符号链接。 */
export async function readStage(directory, request, stage, side) {
  const manifest = JSON.parse(await fs.readFile(path.join(directory, 'stage.json'), 'utf8'));
  if (manifest.schemaVersion !== 1 || manifest.stage !== stage || manifest.side !== side ||
      manifest.admissionEvidence !== false || !isDeepStrictEqual(manifest.binding, stageIdentity(request)))
    throw fault('STAGE_IDENTITY_INVALID', '阶段产物不属于本次冻结输入');
  const files = (await fileManifest(directory)).filter(file => file.path !== 'stage.json');
  if (JSON.stringify(files) !== JSON.stringify(manifest.files)) throw fault('STAGE_ARTIFACT_INVALID', '阶段文件缺失、增加或摘要变化');
  if (![0, 2].includes(manifest.code) || !Array.isArray(manifest.issues))
    throw fault('STAGE_ARTIFACT_INVALID', '阶段执行码或问题记录无效');
  // 失败构建不可使用；采集失败继续交给compare保留逐例证据和最终错误。
  if (stage === 'build' && (manifest.code !== 0 || manifest.issues.length))
    throw fault('EXECUTION_FAILED', '构建阶段未成功结束');
  return manifest;
}

/** 比较阶段只消费两侧正常结束的结果，普通基线错误仍使整个检查失败。 */
export function captureError(result, side) {
  if (!result || result.finalized !== true || !['passed', 'failed'].includes(result.endedStatus) || result.errors?.length) return true;
  if (result.status === 'passed' && result.endedStatus === 'passed') return false;
  return !(side === 'baseline' && result.status === 'error' && result.endedStatus === 'failed' && result.tests.some(item => item.status === 'error') && result.tests.every(item => item.status === 'passed' || item.status === 'error' && item.businessAssertion === true && ['INTERACTION_ASSERTION_FAILED', 'CASE_ASSERTION_FAILED'].includes(item.code)));
}

/** 复制冻结head套件；独立capture基础设施不改变业务用例、断言或像素策略。 */
async function freezeSuite(request, output) {
  const source = path.join(request.suiteRoot, suitePath);
  const files = await fileManifest(source);
  if (digest(JSON.stringify(files)) !== request.suiteDigest) throw fault('STAGE_IDENTITY_INVALID', '冻结套件摘要不符');
  await fs.cp(source, path.join(output, 'suite'), { recursive: true });
  const infrastructure = request.infrastructureRoot ?? request.suiteRoot;
  // 旧版本适配只替换显式阶段基础设施，cases和assertions仍来自原冻结head。
  for (const name of ['capture.spec.mjs', 'compare.spec.mjs'])
    await fs.copyFile(path.join(infrastructure, suitePath, name), path.join(output, 'suite', name));
  const cases = await loadCases(path.join(output, 'suite'));
  const declaration = JSON.parse(await fs.readFile(path.join(infrastructure, suitePath, 'cases/manifest.json'), 'utf8'));
  if (declaration.schemaVersion !== 1 || declaration.indexDigest !== digest(await fs.readFile(path.join(source, 'cases/index.mjs'))) || JSON.stringify(declaration.ids) !== JSON.stringify(cases.map(item => item.id)))
    throw fault('CASE_MANIFEST_INVALID', '静态全量用例清单与冻结输入不一致');
  await fs.symlink(path.join(request.sourceRoot, `packages/${product}/node_modules`), path.join(output, 'node_modules'), 'dir');
  return cases;
}

/** 无网络执行一个阶段；SDK源码、套件和输出目录分别由调用方隔离。 */
export async function runStage(request) {
  const binding = stageIdentity(request), output = path.resolve(request.output), started = performance.now();
  await fs.mkdir(output, { recursive: true });
  if ((await fs.readdir(output)).length) throw fault('STAGE_OUTPUT_NOT_EMPTY', '阶段输出目录必须为空');
  const runtime = createRuntime({ offline: true }), detach = runtime.listenSignals();
  let result, issues = [], code = 0, local, cases;
  try {
    local = await workingTree(request.sourceRoot);
    const expected = request.stage === 'build' && request.side === 'baseline' ? request.identity.baseSha : request.identity.headSha;
    if (local.head !== expected || local.dirty) throw fault('WORKSPACE_CHANGED', '阶段SDK源码不是精确冻结提交');
    cases = await freezeSuite(request, output);
    const ids = cases.map(item => item.id);
    if (request.stage === 'build') {
      if (product === 'vtable') {
        const names = ['vtable', 'editors', 'gantt', 'plugins', 'sheet', 'vchart'].filter(name => name === 'vtable' || cases.some(item => item.bundles.includes(name)));
        await build(request.sourceRoot, output, request.side, names, runtime, path.join(output, 'build.log'));
      } else await build(request.sourceRoot, path.join(output, `${request.side}.js`), runtime, path.join(output, 'build.log'));
      if (request.side === 'current' && request.photoMode !== 'manual') {
        for (const folder of ['tools/bundler/output', ...['vtable','vtable-editors','vtable-gantt','vtable-plugins','vutils-extension'].map(name => `packages/${name}/es`)]) {
          const full = path.join(request.sourceRoot, folder);
          if (await fs.stat(full).catch(error => { if (error.code === 'ENOENT') return null; throw error; })) {
            await fs.mkdir(path.dirname(path.join(output, 'photo-workspace', folder)), { recursive: true });
            await fs.cp(full, path.join(output, 'photo-workspace', folder), { recursive: true });
          }
        }
      }
    } else if (request.stage === 'capture') {
      const buildManifest = await readStage(request.inputs.build, request, 'build', request.side);
      for (const file of buildManifest.files.filter(file => file.path.endsWith('.js') && !file.path.includes('/')))
        await fs.copyFile(path.join(request.inputs.build, file.path), path.join(output, file.path));
      const config = await fs.readFile(path.join(output, 'suite/playwright.config.mjs'), 'utf8');
      await fs.writeFile(path.join(output, 'suite/playwright.config.mjs'), config.replace("testMatch: 'visual.spec.mjs'", "testMatch: 'capture.spec.mjs'"));
      const { server, url } = await serve(output);
      runtime.defer(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });
      try { result = await executePhase(request.sourceRoot, output, request.side, url, ids, runtime); }
      catch (error) { code = 2; issues.push({ code: error.code ?? 'EXECUTION_FAILED', message: error.message }); }
      result ??= JSON.parse(await fs.readFile(path.join(output, `${request.side}-result.json`), 'utf8'));
      validateResults(result, ids);
      if (captureError(result, request.side)) code = 2;
    } else {
      const phaseResults = {}, manifests = {};
      for (const side of ['baseline', 'current']) {
        manifests[side] = await readStage(request.inputs[side], request, 'capture', side);
        phaseResults[side] = JSON.parse(await fs.readFile(path.join(request.inputs[side], `${side}-result.json`), 'utf8'));
        validateResults(phaseResults[side], ids);
        if (manifests[side].code !== 0 || manifests[side].issues.length || captureError(phaseResults[side], side)) issues.push({ phase: side, category: 'execution', code: 'EXECUTION_FAILED', message: `${side}截图阶段存在原始执行错误` });
        await fs.cp(request.inputs[side], path.join(output, side), { recursive: true, filter: file => !file.endsWith('/node_modules') });
        phaseResults[side].tests = phaseResults[side].tests.map(item => ({ ...item, attachments: (item.attachments ?? []).map(file => ({ ...file, path: `${side}/${file.path}` })) }));
      }
      const eligible = ids.filter(id => ['baseline', 'current'].every(side => phaseResults[side].tests.find(item => item.id === id)?.status === 'passed'));
      await fs.mkdir(path.join(output, 'snapshots'));
      for (const id of eligible) {
        const item = phaseResults.baseline.tests.find(item => item.id === id);
        await fs.copyFile(path.join(output, item.attachments.find(file => file.name === 'rendered').path), path.join(output, 'snapshots', `${id}.png`));
      }
      await atomicJson(path.join(output, 'capture-current.json'), phaseResults.current);
      if (eligible.length) {
        const config = await fs.readFile(path.join(output, 'suite/playwright.config.mjs'), 'utf8');
        await fs.writeFile(path.join(output, 'suite/playwright.config.mjs'), config.replace("testMatch: 'visual.spec.mjs'", "testMatch: 'compare.spec.mjs'"));
        let compared;
        try {
          // 复用原执行器核对退出码、reporter终态和业务分类，不以逐例通过掩盖进程失败。
          compared = await executePhase(request.sourceRoot, output, 'current', '', eligible, runtime);
        } catch (error) {
          issues.push({ phase: 'compare', category: 'execution', code: error.code ?? 'EXECUTION_FAILED', message: error.message });
          compared = JSON.parse(await fs.readFile(path.join(output, 'current-result.json'), 'utf8'));
          validateResults(compared, eligible);
        }
        for (const item of compared.tests) {
          const previous = phaseResults.current.tests.find(test => test.id === item.id);
          Object.assign(previous, item, { attachments: [...previous.attachments, ...item.attachments], durationMs: previous.durationMs + item.durationMs });
        }
      }
      const current = phaseResults.current;
      current.status = current.tests.some(item => item.status === 'error') ? 'error' : current.tests.some(item => item.status === 'diff') ? 'diff' : 'passed';
      // 业务new_baseline沿用capture的原始正常终态，比较差异本身不伪装截图失败。
      current.endedStatus = current.status === 'passed' ? 'passed' : 'failed';
      const { settings } = await import(pathToFileURL(path.join(output, 'suite/settings.mjs')));
      const final = await saveReport(output, {
        runId: request.runId, finalized: true, status: issues.length ? 'error' : current.status, issues,
        startedAt: request.startedAt, request: { baseline: request.identity.baseSha, offline: true },
        local, localAfter: await workingTree(request.sourceRoot), baseline: { sha: request.identity.baseSha, repository: official, cacheHit: false },
        selection: { mode: 'all', value: null, selectedIds: ids, selectedCount: ids.length, totalCount: ids.length },
        cases: cases.map(({ id, purpose, file, sourceExample }) => ({ id, purpose, sourceExample, source: { path: `${suitePath}/cases/${file.slice(2)}`, line: 1, frozenPath: `suite/cases/${file.slice(2)}` } })),
        comparison: settings.comparison, suiteDigest: request.suiteDigest, environment: { node: process.version, platform: process.platform, arch: process.arch },
        baselineResult: phaseResults.baseline, currentResult: current, timings: { totalMs: Math.round(performance.now() - started) },
        executionDiagnostics: { mode: 'dual-staged', captures: Object.fromEntries(Object.entries(manifests).map(([side, manifest]) => [side, { code: manifest.code, issues: manifest.issues }])) }
      });
      code = final.status === 'passed' ? 0 : final.status === 'diff' ? 1 : 2;
    }
    const after = await workingTree(request.sourceRoot);
    if (local.head !== after.head || local.digest !== after.digest) throw fault('WORKSPACE_CHANGED', '执行期间源码变化');
  } finally {
    const cleanup = await runtime.cleanup(); detach();
    if (cleanup.length) { issues.push(...cleanup); code = 2; }
    await fs.rm(path.join(output, 'node_modules'), { force: true });
    // 不搬运整份JS SDK和suite重复副本；构建阶段保留SDK，采集阶段只需原始结果和图片。
    if (request.stage !== 'build') for (const entry of await fs.readdir(output))
      if (/^(baseline|current)(-[a-z-]+)?\.js$/.test(entry)) await fs.rm(path.join(output, entry));
    if (request.stage !== 'compare') await fs.rm(path.join(output, 'suite'), { recursive: true, force: true });
  }
  const files = await fileManifest(output);
  const manifest = { schemaVersion: 1, stage: request.stage, side: request.stage === 'compare' ? null : request.side, admissionEvidence: false, binding, code, issues, ids: cases.map(item => item.id), durationMs: Math.round(performance.now() - started), files };
  await atomicJson(path.join(output, 'stage.json'), manifest);
  return manifest;
}
