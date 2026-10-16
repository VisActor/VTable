import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { canonicalJson, compareSuiteCases } from './suite.mjs';
import { createRuntime, fault, digest, atomicJson, fileManifest, freezeSuite, serve } from './runtime.mjs';
import { loadCases, preflight, executePhase, acquireLock } from './runner.mjs';
import { outputDirectory } from './build.mjs';
import { saveRunReport } from '../../__tests__/visual/report.mjs';

const product = 'vtable',
  repository = 'VisActor/VTable',
  productKey = 'VTable';
const statuses = ['matched', 'different', 'no_baseline', 'assertion_failed', 'execution_error', 'skipped', 'cancelled'];
const sha = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const commit = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const id = value => typeof value === 'string' && /^[a-z][a-z0-9-]*$/.test(value);
const text = value =>
  typeof value === 'string' && value.trim() && value.length <= 200 && !/[\u0000-\u001f]/.test(value);

/** 冻结输入只接受相对 POSIX 路径，路径身份不做静默归一化。 */
function relativePath(value) {
  if (
    typeof value !== 'string' ||
    /[\\:%?#]/.test(value) ||
    value.split('/').some(part => !part || part === '.' || part === '..')
  )
    throw fault('INVALID_ARTIFACT', '非法冻结文件路径');
  return value;
}

/** 读取普通文件并校验实际字节，不跟随目录或文件中的符号链接。 */
async function readFile(directory, relative, expected = null) {
  const base = await fs.realpath(directory),
    file = path.join(base, relativePath(relative));
  if (!(await fs.lstat(directory)).isDirectory() || (await fs.realpath(file)) !== file)
    throw fault('INVALID_ARTIFACT', '输入必须是普通目录和普通文件');
  const stat = await fs.lstat(file);
  if (!stat.isFile() || stat.size > 64 * 1024 * 1024) throw fault('INVALID_ARTIFACT', '文件类型或大小不符');
  const bytes = await fs.readFile(file);
  if (
    expected &&
    (!sha(expected.digest) ||
      digest(bytes) !== expected.digest ||
      (expected.size !== undefined && (!Number.isSafeInteger(expected.size) || expected.size !== bytes.length)))
  )
    throw fault('INVALID_ARTIFACT', '冻结文件摘要或大小不符：' + relative);
  return bytes;
}

/** 使用当前锁定 Playwright 的同一 PNG 解码器，避免另装图像依赖。 */
function pngReader(root) {
  const require = createRequire(path.join(root, 'packages', product, 'package.json'));
  const test = createRequire(require.resolve('@playwright/test/package.json'));
  const playwright = createRequire(test.resolve('playwright/package.json'));
  const { PNG } = require(path.join(
    path.dirname(playwright.resolve('playwright-core/package.json')),
    'lib/utilsBundle.js'
  ));
  return bytes => {
    if (
      bytes.length < 24 ||
      bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' ||
      !bytes.readUInt32BE(16) ||
      !bytes.readUInt32BE(20) ||
      bytes.readUInt32BE(16) * bytes.readUInt32BE(20) > 16 * 1024 * 1024
    )
      throw fault('INVALID_ARTIFACT', 'PNG 类型或尺寸不符');
    try {
      const image = PNG.sync.read(bytes);
      return { width: image.width, height: image.height };
    } catch (error) {
      throw fault('INVALID_ARTIFACT', 'PNG 解码失败', error);
    }
  };
}

/** 校验单个 Playwright 请求及执行键，原始身份由可信准备方提供。 */
export function validateRunRequest(request) {
  const identity = request?.identity,
    subject = identity?.subject,
    items = request?.selection?.items;
  if (
    request?.schemaVersion !== 1 ||
    request.contractVersion !== '1.0' ||
    request.kind !== 'run_request' ||
    !text(request.requestId) ||
    !Number.isSafeInteger(request.generation) ||
    request.generation < 1 ||
    identity?.repository !== repository ||
    identity.productKey !== productKey ||
    identity.baseRef !== 'develop' ||
    !(identity.pullRequest === null || (Number.isSafeInteger(identity.pullRequest) && identity.pullRequest > 0)) ||
    ![identity.headSha, identity.baseSha, identity.controlCommit, subject?.testedCommit].every(commit) ||
    ![subject?.sourceDigest, identity.bundleDigest, identity.suiteDigests?.playwright, identity.policyDigest].every(
      sha
    ) ||
    identity.suiteDigests?.photo !== null ||
    identity.environmentIds?.photo !== null ||
    !text(identity.environmentIds?.playwright) ||
    !(identity.assetRevision === null || text(identity.assetRevision)) ||
    !['pr_head', 'pr_merge', 'merged_commit', 'local_workspace'].includes(subject?.kind) ||
    !Array.isArray(subject.mergeParents) ||
    subject.mergeParents.some(value => !commit(value)) ||
    !['full', 'targeted'].includes(request.selection?.mode) ||
    !Array.isArray(items) ||
    !items.length ||
    items.length > 10000 ||
    !Array.isArray(request.engines) ||
    canonicalJson(request.engines) !== '["playwright"]' ||
    !Array.isArray(request.inputArtifacts) ||
    request.inputArtifacts.some(
      item =>
        !text(item?.artifactId) ||
        !sha(item?.digest) ||
        !text(item?.mediaType) ||
        !['public', 'restricted'].includes(item?.visibility)
    )
  )
    throw fault('RUN_REQUEST_INVALID', '运行请求身份、类型或选择集不符');
  const keys = items.map(item => {
    if (item.engine !== 'playwright' || !id(item.caseId) || item.screenshotId !== 'final')
      throw fault('RUN_REQUEST_INVALID', '首期仅支持已登记 Playwright case 的 final 截图');
    return item.caseId;
  });
  if (
    new Set(keys).size !== keys.length ||
    digest(canonicalJson(items)) !== request.selection.digest ||
    new Set(request.inputArtifacts.map(item => item.artifactId)).size !== request.inputArtifacts.length
  )
    throw fault('RUN_REQUEST_INVALID', '重复选择或选择摘要不符');
  const sequence = request.rerunSequence ?? 0;
  if (
    !Number.isSafeInteger(sequence) ||
    sequence < 0 ||
    request.executionKey !==
      digest(
        canonicalJson({
          identity,
          engines: ['playwright'],
          selectionDigest: request.selection.digest,
          rerunSequence: sequence
        })
      )
  )
    throw fault('RUN_REQUEST_INVALID', '执行键或重跑序号不符');
  if (
    (subject.kind === 'pr_head' && (subject.testedCommit !== identity.headSha || subject.mergeParents.length)) ||
    (subject.kind === 'pr_merge' &&
      canonicalJson(subject.mergeParents) !== canonicalJson([identity.baseSha, identity.headSha])) ||
    (subject.kind === 'local_workspace' && typeof subject.dirty !== 'boolean')
  )
    throw fault('RUN_REQUEST_INVALID', '被测提交、父提交或工作区状态不符');
  return request;
}

/** 按清单重新核对全部文件，校验完成前不导入候选模块。 */
async function verifySuite(directory, request) {
  const manifest = JSON.parse(await readFile(directory, 'suite-manifest.json'));
  compareSuiteCases(manifest, manifest);
  if (
    manifest.engine !== 'playwright' ||
    manifest.adapterVersion !== '1.1.0' ||
    typeof manifest.sourceDirty !== 'boolean' ||
    !Array.isArray(manifest.sourceParents) ||
    manifest.sourceParents.some(value => !commit(value)) ||
    manifest.sourceCommit !== request.identity.subject.testedCommit ||
    manifest.sourceDigest !== request.identity.subject.sourceDigest ||
    manifest.suiteDigest !== request.identity.suiteDigests.playwright ||
    manifest.bundleDigest !== request.identity.bundleDigest ||
    (request.identity.subject.kind !== 'local_workspace' && manifest.sourceDirty) ||
    (request.identity.subject.kind === 'local_workspace' && manifest.sourceDirty !== request.identity.subject.dirty) ||
    (request.identity.subject.kind === 'pr_merge' &&
      canonicalJson(manifest.sourceParents) !== canonicalJson(request.identity.subject.mergeParents))
  )
    throw fault('RUN_INPUT_MISMATCH', '冻结源码、适配器能力或请求身份不符');
  if (
    !Array.isArray(manifest.files) ||
    !manifest.files.length ||
    manifest.files.length > 20000 ||
    new Set(manifest.files.map(file => file.path)).size !== manifest.files.length ||
    digest(canonicalJson(manifest.files)) !== manifest.filesDigest ||
    !Array.isArray(manifest.resources) ||
    !manifest.resources.length ||
    new Set(manifest.resources.map(resource => resource.resourceId)).size !== manifest.resources.length ||
    digest(canonicalJson(manifest.resources)) !== manifest.bundleDigest
  )
    throw fault('CASE_MANIFEST_INVALID', '文件或资源集合不完整');
  for (const file of manifest.files) await readFile(directory, file.path, file);
  if (
    canonicalJson(await fileManifest(path.join(directory, 'suite'))) !==
    canonicalJson(
      manifest.files.filter(file => file.path.startsWith('suite/')).map(file => ({ ...file, path: file.path.slice(6) }))
    )
  )
    throw fault('INVALID_ARTIFACT', '套件目录含有清单未声明的文件');
  const allowed = product === 'vchart' ? ['vchart'] : ['vtable', 'editors', 'gantt', 'plugins', 'sheet', 'vchart'];
  if (!manifest.resources.some(resource => resource.resourceId === product))
    throw fault('CASE_MANIFEST_INVALID', '缺少核心产品资源');
  for (const resource of manifest.resources) {
    const expectedPath = product === 'vchart' ? 'current.js' : 'current-' + resource.resourceId + '.js';
    const file = manifest.files.find(file => file.path === resource.path);
    if (
      !allowed.includes(resource.resourceId) ||
      resource.path !== expectedPath ||
      !file ||
      file.digest !== resource.digest ||
      file.size !== resource.size
    )
      throw fault('CASE_MANIFEST_INVALID', '资源路径或文件身份不符');
  }
  for (const item of manifest.cases) {
    relativePath(item.modulePath);
    if (
      !item.modulePath.startsWith('suite/cases/') ||
      !manifest.files.some(file => file.path === item.modulePath) ||
      canonicalJson(item.screenshots) !== '[{"screenshotId":"final"}]' ||
      !Array.isArray(item.resourceIds) ||
      item.resourceIds.some(name => !manifest.resources.some(resource => resource.resourceId === name))
    )
      throw fault('CASE_MANIFEST_INVALID', '用例模块、截图或资源声明不符');
  }
  const ids = request.selection.items.map(item => item.caseId);
  if (
    ids.some(id => !manifest.cases.some(item => item.caseId === id)) ||
    (request.selection.mode === 'full' && ids.length !== manifest.cases.length)
  )
    throw fault('RESULT_SET_MISMATCH', '请求选择与完整冻结清单不符');
  return manifest;
}

/** 基准只读导入，明确缺基准仍执行候选断言，不自动建立标准图。 */
async function prepareBaselines(directory, request, runDir, png) {
  const bytes = await readFile(directory, 'baseline-manifest.json'),
    manifest = JSON.parse(bytes);
  const reference = request.inputArtifacts.find(item => item.artifactId === manifest.artifactId);
  if (
    manifest.schemaVersion !== 1 ||
    manifest.contractVersion !== '1.0' ||
    manifest.kind !== 'baseline_manifest' ||
    manifest.repository !== repository ||
    manifest.productKey !== productKey ||
    !reference ||
    reference.mediaType !== 'application/json' ||
    reference.digest !== digest(bytes) ||
    manifest.environmentId !== request.identity.environmentIds.playwright ||
    manifest.assetRevision !== request.identity.assetRevision ||
    !Array.isArray(manifest.entries) ||
    manifest.entries.length > 10000
  )
    throw fault('RUN_INPUT_MISMATCH', '基准版本、环境或请求引用不符');
  const entries = new Map();
  for (const entry of manifest.entries) {
    if (
      !id(entry.caseId) ||
      entry.screenshotId !== 'final' ||
      typeof entry.baselineExpected !== 'boolean' ||
      entries.has(entry.caseId) ||
      !((entry.path === null && entry.digest === null) || (typeof entry.path === 'string' && sha(entry.digest))) ||
      (!entry.baselineExpected && entry.path !== null)
    )
      throw fault('INVALID_ARTIFACT', '基准条目重复或声明不符');
    if (entry.path !== null) relativePath(entry.path);
    entries.set(entry.caseId, entry);
  }
  await fs.mkdir(path.join(runDir, 'snapshots'));
  const selected = [],
    artifacts = [];
  for (const item of request.selection.items) {
    const entry = entries.get(item.caseId);
    if (!entry) throw fault('RESULT_SET_MISMATCH', '基准集合必须逐项声明选中截图，包括缺失项');
    const prepared = { ...entry, actualDigest: null, image: null };
    if (entry.path !== null) {
      try {
        const image = await readFile(directory, entry.path, entry);
        png(image);
        const relative = 'snapshots/' + item.caseId + '.png';
        await fs.writeFile(path.join(runDir, relative), image, { mode: 0o444 });
        prepared.actualDigest = digest(image);
        prepared.image = relative;
        artifacts.push({
          artifactId: item.caseId + '/final/baseline',
          caseId: item.caseId,
          screenshotId: 'final',
          role: 'baseline',
          path: relative,
          digest: prepared.actualDigest,
          size: image.length,
          mediaType: 'image/png',
          visibility: 'restricted'
        });
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
    selected.push(prepared);
  }
  return { manifest, selected, artifacts };
}

/** 把真实阶段状态投影成七类协议结果，未执行检查与缺图不补成通过。 */
export async function projectRunResult(runDir, request, manifest, baselines, phase, { png, interrupted = false } = {}) {
  const rows = [],
    artifacts = [...(baselines?.artifacts ?? [])],
    found = phase?.tests ?? [],
    seen = new Set();
  if (
    !Array.isArray(found) ||
    (phase &&
      (!Array.isArray(phase.errors) ||
        found.some(
          item =>
            !id(item.id) ||
            !['passed', 'diff', 'error', 'not_run'].includes(item.status) ||
            !Array.isArray(item.attachments) ||
            !Array.isArray(item.errors) ||
            !Number.isFinite(item.durationMs) ||
            item.durationMs < 0
        )))
  )
    throw fault('RESULT_SET_MISMATCH', '阶段结果结构不符');
  const ids = request.selection.items.map(item => item.caseId);
  let complete = phase?.finalized === true && !phase.errors?.length && found.length === ids.length;
  for (const item of found) {
    if (!ids.includes(item.id) || seen.has(item.id)) complete = false;
    seen.add(item.id);
  }
  const nativeStatus = found.some(item => ['error', 'not_run'].includes(item.status))
    ? 'error'
    : found.some(item => item.status === 'diff')
    ? 'diff'
    : 'passed';
  if (
    ![0, 1].includes(phase?.exitCode) ||
    phase?.status !== nativeStatus ||
    phase?.exitCode !== (nativeStatus === 'passed' ? 0 : 1)
  )
    complete = false;
  for (const selected of request.selection.items) {
    const item = found.find(item => item.id === selected.caseId),
      definition = manifest?.cases.find(item => item.caseId === selected.caseId);
    const baseline = baselines?.selected.find(item => item.caseId === selected.caseId);
    const row = {
      engine: 'playwright',
      caseId: selected.caseId,
      screenshotId: selected.screenshotId,
      caseDigest: definition?.caseDigest ?? null,
      assertions: item?.checks?.assertions ?? 'not_run',
      drawing: item?.checks?.drawing ?? 'not_run',
      stability: item?.checks?.stability ?? 'not_run',
      baselineExpected: baseline?.baselineExpected ?? true,
      baselineDigest: baseline?.actualDigest ?? null,
      currentDigest: null,
      diffDigest: null,
      status: 'execution_error',
      error: null,
      durationMs: item?.durationMs ?? 0,
      images: { baseline: baseline?.image ?? null, current: null, diff: null }
    };
    try {
      const passed = ['assertions', 'drawing', 'stability'].every(name => row[name] === 'passed');
      if (item) {
        for (const [role, name] of [
          ['current', 'rendered'],
          ['diff', selected.caseId + '-diff.png']
        ]) {
          const attachment = item.attachments?.find(file => file.name === name);
          if (!attachment) continue;
          const bytes = await readFile(runDir, attachment.path);
          png(bytes);
          row[role === 'current' ? 'currentDigest' : 'diffDigest'] = digest(bytes);
          row.images[role] = attachment.path;
          artifacts.push({
            artifactId: selected.caseId + '/final/' + role,
            caseId: selected.caseId,
            screenshotId: 'final',
            role: role === 'current' && passed ? 'candidate' : role,
            path: attachment.path,
            digest: digest(bytes),
            size: bytes.length,
            mediaType: 'image/png',
            visibility: 'restricted'
          });
        }
      }
      if (!item) {
        complete = false;
        row.status = interrupted ? 'cancelled' : 'execution_error';
        row.error = { code: interrupted ? 'RUN_INTERRUPTED' : 'RESULT_SET_MISMATCH', message: '选中截图没有阶段结果' };
      } else if (item.status === 'not_run') {
        complete = false;
        row.status = interrupted ? 'cancelled' : 'skipped';
        row.error = { code: 'RUN_INCOMPLETE', message: '用例未执行' };
      } else if (item.baselineMissing && passed && row.currentDigest) {
        row.status = 'no_baseline';
        if (row.baselineExpected)
          row.error = { code: 'MISSING_BASELINE', message: '既有用例应有基准，但指定图片不存在' };
      } else if (
        ['passed', 'diff'].includes(item.status) &&
        passed &&
        row.currentDigest &&
        row.baselineDigest &&
        (item.status !== 'diff' || row.diffDigest)
      )
        row.status = item.status === 'passed' ? 'matched' : 'different';
      else if (
        item.status === 'error' &&
        ['CASE_ASSERTION_FAILED', 'INTERACTION_ASSERTION_FAILED'].includes(item.code)
      ) {
        row.status = 'assertion_failed';
        row.error = { code: item.code, message: item.errors.join('\n') };
      } else {
        row.error = { code: item.code ?? 'MISSING_ARTIFACT', message: item.errors?.join('\n') || '缺少检查或截图证据' };
        if (['passed', 'diff'].includes(item.status)) complete = false;
      }
    } catch (error) {
      complete = false;
      row.error = { code: error.code ?? 'INVALID_ARTIFACT', message: error.message };
    }
    rows.push(row);
  }
  const counts = Object.fromEntries(statuses.map(status => [status, rows.filter(row => row.status === status).length]));
  const rawOutcome =
    !complete || counts.skipped || counts.cancelled
      ? 'incomplete'
      : counts.assertion_failed || counts.execution_error || counts.no_baseline
      ? 'failed'
      : counts.different
      ? 'differences'
      : 'passed';
  return {
    cases: rows,
    artifacts,
    counts,
    complete,
    rawOutcome,
    workerExitCode: rawOutcome === 'passed' ? 0 : rawOutcome === 'differences' ? 1 : 2
  };
}

/** 执行冻结候选与指定只读基准；所有标准图只被复制，禁止重新采集或写回。 */
export async function runCandidate(root, options) {
  const requestFile = path.resolve(root, options['run-request']);
  const request = validateRunRequest(JSON.parse(await fs.readFile(requestFile, 'utf8')));
  const directory = path.resolve(root, options['run-suite']),
    baselineDirectory = path.resolve(root, options['baseline-set']);
  const runId = randomUUID(),
    runDir = await outputDirectory(
      root,
      options.output ?? path.join(root, '.' + product + '-visual/runs', Date.now() + '-' + runId.slice(0, 8)),
      [directory, baselineDirectory]
    );
  const runtime = createRuntime(),
    detach = runtime.listenSignals();
  let owned = false,
    releaseLock,
    manifest,
    baselines,
    phase,
    primary,
    renderer,
    png,
    cleanup;
  const result = {
    schemaVersion: 1,
    contractVersion: '1.0',
    kind: 'run_result',
    runId,
    executionKey: request.executionKey,
    generation: request.generation,
    identity: request.identity,
    lifecycle: 'running',
    complete: false,
    rawOutcome: 'incomplete',
    plannedSelectionDigest: request.selection.digest,
    plannedCount: request.selection.items.length,
    cases: [],
    counts: Object.fromEntries(statuses.map(status => [status, 0])),
    attempts: [],
    startedAt: new Date().toISOString(),
    finishedAt: null,
    workerExitCode: 2,
    artifacts: [],
    error: null,
    limitations: ['执行器不访问 GitHub 或服务凭据；可信控制器另行核验完整 worker 环境、权限与当前远端版本。']
  };
  try {
    await fs.mkdir(path.join(root, '.' + product + '-visual'), { recursive: true });
    releaseLock = await acquireLock(path.join(root, '.' + product + '-visual'), {
      runId,
      pid: process.pid,
      runDir,
      startedAt: result.startedAt
    });
    await fs.mkdir(path.dirname(runDir), { recursive: true });
    await fs.mkdir(runDir);
    owned = true;
    await atomicJson(path.join(runDir, 'run-result.json'), result);
    png = pngReader(root);
    const suiteBefore = await fileManifest(directory),
      baselinesBefore = await fileManifest(baselineDirectory);
    manifest = await verifySuite(directory, request);
    await freezeSuite(path.join(directory, 'suite'), path.join(runDir, 'suite'));
    for (const resource of manifest.resources)
      await fs.copyFile(path.join(directory, resource.path), path.join(runDir, resource.path));
    for (const resource of manifest.resources) await readFile(runDir, resource.path, resource);
    const loaded = await loadCases(path.join(runDir, 'suite'));
    if (
      loaded.length !== manifest.cases.length ||
      loaded.some(
        item =>
          !manifest.cases.some(
            row =>
              row.caseId === item.id &&
              row.modulePath === 'suite/cases/' + item.file.slice(2) &&
              row.purpose === item.purpose
          )
      )
    )
      throw fault('CASE_MANIFEST_INVALID', '发现的用例与冻结清单不符');
    const { settings } = await import(pathToFileURL(path.join(runDir, 'suite/settings.mjs')));
    const engine = await preflight(root, runtime, { buildDependencies: false });
    renderer = {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      playwright: engine.playwright,
      browser: engine.browser,
      settings
    };
    if (
      manifest.environmentRequirements.nodeMajor !== 22 ||
      manifest.environmentRequirements.playwrightVersion !== engine.playwright ||
      canonicalJson(manifest.environmentRequirements.settings) !== canonicalJson(settings)
    )
      throw fault('ENVIRONMENT_MISMATCH', '实际 Node、Playwright 或截图设置与套件要求不符');
    baselines = await prepareBaselines(baselineDirectory, request, runDir, png);
    if (
      baselines.selected.some(item => item.actualDigest) &&
      canonicalJson(baselines.manifest.renderer) !== canonicalJson(renderer)
    )
      throw fault('ENVIRONMENT_MISMATCH', '指定基准与当前实际截图环境不符');
    await fs.symlink(path.join(root, 'packages', product, 'node_modules'), path.join(runDir, 'node_modules'), 'dir');
    runtime.defer(() => fs.rm(path.join(runDir, 'node_modules'), { force: true }));
    const snapshotsBefore = await fileManifest(path.join(runDir, 'snapshots'));
    const { server, url } = await serve(runDir);
    runtime.defer(async () => {
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
    });
    phase = await executePhase(
      root,
      runDir,
      'current',
      url,
      request.selection.items.map(item => item.caseId),
      runtime,
      {
        collectFailures: true,
        env: {
          VISUAL_EXTERNAL_BASELINE: '1',
          VISUAL_BASELINE_EXPECTATIONS: JSON.stringify(
            Object.fromEntries(baselines.selected.map(item => [item.caseId, item.baselineExpected]))
          )
        }
      }
    );
    const suiteAfter = await fileManifest(path.join(runDir, 'suite'));
    for (const resource of manifest.resources) await readFile(runDir, resource.path, resource);
    if (
      canonicalJson(suiteAfter) !==
        canonicalJson(
          manifest.files
            .filter(file => file.path.startsWith('suite/'))
            .map(file => ({ ...file, path: file.path.slice(6) }))
        ) ||
      canonicalJson(await fileManifest(path.join(runDir, 'snapshots'))) !== canonicalJson(snapshotsBefore) ||
      canonicalJson(await fileManifest(directory)) !== canonicalJson(suiteBefore) ||
      canonicalJson(await fileManifest(baselineDirectory)) !== canonicalJson(baselinesBefore)
    )
      throw fault('RUN_INPUT_CHANGED', '运行改变了冻结套件或只读基准');
    if (phase.browser !== renderer.browser) throw fault('ENVIRONMENT_MISMATCH', '实际测试浏览器版本与预检不符');
  } catch (error) {
    primary = error;
    result.error = { code: error.code ?? 'EXECUTION_FAILED', message: error.message };
  } finally {
    cleanup = await runtime.cleanup();
    if (releaseLock) {
      try {
        await releaseLock();
      } catch (error) {
        cleanup.push({ code: 'CLEANUP_FAILED', message: error.message });
      }
    }
    detach();
    if (cleanup.length || runtime.interrupted) {
      result.complete = false;
      result.rawOutcome = runtime.interrupted ? 'incomplete' : 'failed';
      result.workerExitCode = 2;
      result.error = {
        code: runtime.interrupted ? 'RUN_INTERRUPTED' : 'CLEANUP_FAILED',
        message: JSON.stringify(cleanup)
      };
    }
    result.finishedAt = new Date().toISOString();
    result.lifecycle = runtime.interrupted ? 'cancelled' : primary || cleanup.length ? 'failed' : 'completed';
    result.renderer = renderer ?? null;
  }
  if (!owned) throw primary;
  try {
    Object.assign(
      result,
      await projectRunResult(runDir, request, manifest, baselines, phase, { png, interrupted: runtime.interrupted })
    );
  } catch (error) {
    // 非法阶段数据只能保留为失败证据，不能取它的子集继续判通过。
    primary = error;
    Object.assign(
      result,
      await projectRunResult(runDir, request, manifest, baselines, null, { png, interrupted: runtime.interrupted })
    );
    result.error = { code: error.code ?? 'RESULT_SET_MISMATCH', message: error.message };
  }
  if (primary || cleanup.length || runtime.interrupted) {
    result.complete = false;
    result.rawOutcome = runtime.interrupted ? 'incomplete' : 'failed';
    result.workerExitCode = 2;
    result.lifecycle = runtime.interrupted ? 'cancelled' : 'failed';
    if (primary)
      for (const row of result.cases) {
        row.status = 'execution_error';
        row.error = result.error;
      }
    result.counts = Object.fromEntries(
      statuses.map(status => [status, result.cases.filter(row => row.status === status).length])
    );
    for (const item of result.artifacts) if (item.role === 'candidate') item.role = 'current';
  } else result.lifecycle = result.complete ? 'completed' : 'failed';
  result.attempts = [
    {
      attempt: 1,
      status: result.lifecycle,
      workerExitCode: result.workerExitCode,
      runnerExitCode: phase?.exitCode ?? null,
      error: result.error
    }
  ];
  try {
    await atomicJson(path.join(runDir, 'run-result.json'), result);
    await saveRunReport(runDir, result, { manifest, request, renderer, options, root });
  } catch (error) {
    result.complete = false;
    result.rawOutcome = 'failed';
    result.lifecycle = 'failed';
    result.workerExitCode = 2;
    result.error = { code: 'REPORT_FAILED', message: error.message };
    result.attempts[0] = { ...result.attempts[0], status: 'failed', workerExitCode: 2, error: result.error };
    await atomicJson(path.join(runDir, 'run-result.json'), result);
    for (const file of ['summary.json', 'agent-summary.md', 'index.html'])
      await fs.rm(path.join(runDir, file), { force: true });
  }
  console.log(
    JSON.stringify({
      runId,
      runDir,
      resultPath: path.join(runDir, 'run-result.json'),
      complete: result.complete,
      rawOutcome: result.rawOutcome,
      workerExitCode: result.workerExitCode
    })
  );
  return result.workerExitCode;
}
