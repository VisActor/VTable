import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import { createRuntime, serve, fault, digest, atomicJson, fileManifest } from './runtime.mjs';
import { git, workingTree, resolveBaseline, build, baselineBuild, official } from './build.mjs';
import { saveReport } from '../../__tests__/visual/report.mjs';

/** 验证元数据和可执行契约，只导入实际使用的清单目录。 */
export async function loadCases(suite, caseId) {
  try {
    // 列举也检查全部目录，导入前拒绝父目录和辅助资源中的符号链接。
    if ((await fs.lstat(path.join(suite, 'cases'))).isSymbolicLink()) throw new Error('cases 不能为符号链接');
    await fileManifest(path.join(suite, 'cases'));
    const { cases, loadCase } = await import(pathToFileURL(path.join(suite, 'cases/index.mjs')));
    if (!Array.isArray(cases) || !cases.length) throw new Error('用例清单为空');
    const ids = new Set();
    for (const item of cases) {
      if (!/^[a-z][a-z0-9-]*$/.test(item.id) || ids.has(item.id)) throw new Error(`非法或重复 ID：${item.id}`);
      ids.add(item.id);
      if (
        !item.purpose ||
        (item.sourceExample !== undefined && (typeof item.sourceExample !== 'string' || !item.sourceExample.trim())) ||
        !Array.isArray(item.bundles) || !item.bundles.length || item.bundles.some(name => !['vtable', 'editors', 'gantt', 'plugins', 'sheet', 'vchart'].includes(name)) || new Set(item.bundles).size !== item.bundles.length ||
        typeof item.file !== 'string' ||
        !/^\.\/([a-z][a-z0-9-]*\/)*[a-z][a-z0-9-]*\.mjs$/.test(item.file)
      )
        throw new Error(`非法用例元数据：${item.id}`);
      const file = path.join(suite, 'cases', item.file);
      if ((await fs.lstat(file)).isSymbolicLink()) throw new Error(`用例不能为符号链接：${item.id}`);
      const module = await loadCase(item);
      if (
        typeof module?.mount !== 'function' ||
        typeof module.verify !== 'function' ||
        (module.exercise !== undefined && typeof module.exercise !== 'function')
      )
        throw new Error(`非法用例导出：${item.id}`);
    }
    return selectCases(cases, { case: caseId });
  } catch (error) {
    throw fault('CASE_MANIFEST_INVALID', error.message, error);
  }
}
/** 从已验证的冻结清单选择准确范围；目录按层级匹配，不自动扩大或发现文件。 */
export function selectCases(cases, options = {}) {
  if (options.case !== undefined && options.dir !== undefined) throw fault('INVALID_ARGUMENT', '--dir 与 --case 互斥');
  if (options.dir !== undefined && !/^[a-z][a-z0-9-]*(\/[a-z][a-z0-9-]*)*$/.test(options.dir))
    throw fault('INVALID_ARGUMENT', '非法用例目录');
  const selected = cases.filter(item =>
    options.case !== undefined
      ? item.id === options.case
      : options.dir !== undefined
      ? item.file.startsWith(`./${options.dir}/`)
      : true
  );
  if (!selected.length) throw fault('CASE_MANIFEST_INVALID', `没有匹配用例：${options.dir ?? options.case ?? '全部'}`);
  return selected;
}
/** 延迟加载 Playwright，确保帮助和列举不依赖浏览器安装。 */
export function playwright(root) {
  try {
    return createRequire(path.join(root, 'packages/vtable/package.json'))('@playwright/test');
  } catch (error) {
    throw fault('PREFLIGHT_FAILED', '缺少 Playwright，请先执行 Rush install', error);
  }
}
/** 检查本机依赖及浏览器实际启动能力，不下载、不修改依赖。 */
export async function preflight(root, runtime) {
  if (Number(process.versions.node.split('.')[0]) !== 22 || !['darwin', 'linux'].includes(process.platform))
    throw fault('PREFLIGHT_FAILED', '需要 Node.js 22 和 macOS/Linux');
  try {
    git(root, ['--version']);
    for (const folder of ['tools/bundler', 'packages/vtable']) {
      const require = createRequire(path.join(root, folder, 'package.json'));
      for (const dependency of folder === 'tools/bundler'
        ? ['typescript']
        : ['@internal/bundler/package.json', '@visactor/vutils'])
        require.resolve(dependency);
    }
    playwright(root);
    await runtime.run(
      process.execPath,
      [
        '-e',
        'const {chromium}=require(process.argv[1]);(async()=>{const browser=await chromium.launch();await browser.close();})().catch(e=>{console.error(e);process.exitCode=2;});',
        createRequire(path.join(root, 'packages/vtable/package.json')).resolve('@playwright/test')
      ],
      root,
      path.join(root, '.vtable-visual/preflight.log'),
      { code: 'PREFLIGHT_FAILED', timeoutMs: 30000 }
    );
    return {
      playwright: createRequire(path.join(root, 'packages/vtable/package.json'))('@playwright/test/package.json')
        .version
    };
  } catch (error) {
    throw fault(
      runtime.interrupted ? 'RUN_INTERRUPTED' : 'PREFLIGHT_FAILED',
      `环境未就绪：${error.message}。依赖使用 Rush install；浏览器使用 Playwright install chromium。`,
      error
    );
  }
}
/** 精确校验结果集合，而非仅以数量相等视为完整。 */
export function validateResults(result, ids) {
  const found = result.tests?.map(item => item.id) ?? [];
  if (found.length !== ids.length || new Set(found).size !== found.length || found.some(id => !ids.includes(id)))
    throw fault('RESULT_SET_MISMATCH', '阶段结果与选中用例集合不一致');
}
/** 运行冻结套件的一个阶段，保留已落盘的原始结果供失败汇总。 */
export async function executePhase(root, runDir, phase, url, ids, runtime) {
  const require = createRequire(path.join(root, 'packages/vtable/package.json'));
  await fs.rm(path.join(runDir, `${phase}-result.json`), { force: true });
  const code = await runtime.run(
    process.execPath,
    [require.resolve('@playwright/test/cli'), 'test', '--config', path.join(runDir, 'suite/playwright.config.mjs')],
    root,
    path.join(runDir, `${phase}.log`),
    {
      allowFailure: true,
      code: 'EXECUTION_FAILED',
      env: { VISUAL_RUN_DIR: runDir, VISUAL_BASE_URL: url, VISUAL_PHASE: phase, VISUAL_CASE_IDS: JSON.stringify(ids) }
    }
  );
  let result;
  try {
    result = JSON.parse(await fs.readFile(path.join(runDir, `${phase}-result.json`), 'utf8'));
  } catch (error) {
    throw fault('RESULT_SET_MISMATCH', `${phase} 缺少有效阶段结果`, error);
  }
  validateResults(result, ids);
  if (!result.finalized || result.status === 'error' || (code !== 0 && !(code === 1 && result.status === 'diff')))
    throw fault('EXECUTION_FAILED', `${phase} 阶段执行失败，请查看 ${phase}-result.json 和 ${phase}.log`);
  return result;
}
/** 持有锁的运行才能释放锁，避免误删另一次运行。 */
export async function acquireLock(output, owner) {
  const lock = path.join(output, 'running.lock');
  try {
    await fs.mkdir(lock);
  } catch (error) {
    if (error.code === 'EEXIST') throw fault('RUN_LOCKED', `存在运行锁：${lock}；检查 owner.json 后再处理陈旧锁`);
    throw error;
  }
  try {
    await atomicJson(path.join(lock, 'owner.json'), owner);
  } catch (error) {
    await fs.rm(lock, { recursive: true, force: true });
    throw error;
  }
  return async () => {
    // 只有身份相同才能清理，陈旧或未知锁不自动接管。
    const current = JSON.parse(await fs.readFile(path.join(lock, 'owner.json'), 'utf8'));
    if (current.runId !== owner.runId) throw fault('CLEANUP_FAILED', '运行锁所有权已改变');
    await fs.rm(lock, { recursive: true, force: true });
  };
}
/** 编排一次完整对比；所有准备失败和清理失败尽可能进入统一报告。 */
export async function runVisual(root, options) {
  const runtime = createRuntime();
  const detach = runtime.listenSignals();
  const output = path.join(root, '.vtable-visual');
  const runId = `${Date.now()}-${randomUUID().slice(0, 8)}`;
  const runDir = path.join(output, 'runs', runId);
  const report = {
    runId,
    finalized: false,
    status: 'error',
    startedAt: new Date().toISOString(),
    request: options,
    environment: { node: process.version, platform: process.platform, arch: process.arch },
    timings: {},
    cases: [],
    issues: [],
    stage: 'preparation'
  };
  const started = performance.now();
  let releaseLock;
  async function timed(name, action) {
    // 失败阶段也记录耗时，便于诊断冷启动和中断。
    const start = performance.now();
    try {
      return await action();
    } finally {
      report.timings[name] = Math.round(performance.now() - start);
    }
  }
  try {
    await fs.mkdir(runDir, { recursive: true });
    console.log(`运行目录：${runDir}`);
    await atomicJson(path.join(runDir, 'summary.json'), {
      ...report,
      schemaVersion: 1,
      complete: false,
      issues: [{ code: 'RUN_INCOMPLETE', message: '运行尚未完成' }]
    });
    releaseLock = await acquireLock(output, { runId, pid: process.pid, startedAt: report.startedAt, runDir });
    const suite = path.join(runDir, 'suite');
    const source = path.join(root, 'packages/vtable/__tests__/visual');
    await fileManifest(source);
    await fs.cp(source, suite, { recursive: true });
    report.frozenFiles = await fileManifest(suite);
    report.suiteDigest = digest(JSON.stringify(report.frozenFiles));
    const { settings } = await import(pathToFileURL(path.join(suite, 'settings.mjs')));
    report.comparison = settings.comparison;
    report.environment = {
      ...report.environment,
      viewport: settings.viewport,
      deviceScaleFactor: settings.deviceScaleFactor,
      locale: settings.locale,
      timezoneId: settings.timezoneId,
      fontFamily: settings.fontFamily
    };
    const allCases = await loadCases(suite);
    const selected = selectCases(allCases, options);
    report.selection = {
      mode: options.dir !== undefined ? 'directory' : options.case !== undefined ? 'case' : 'all',
      value: options.dir ?? options.case ?? null,
      selectedIds: selected.map(item => item.id),
      selectedCount: selected.length,
      totalCount: allCases.length
    };
    console.log(`测试范围：${report.selection.value ?? '全部本地用例'}；选中 ${selected.length} / ${allCases.length}`);
    const names = ['vtable', 'editors', 'gantt', 'plugins', 'sheet', 'vchart'].filter(name => name === 'vtable' || selected.some(item => item.bundles.includes(name)));
    if (!names.includes('vtable')) names.unshift('vtable');
    report.cases = selected.map(({ id, purpose, file, sourceExample, bundles }) => ({
      id,
      purpose,
      sourceExample,
      bundles,
      source: {
        path: `packages/vtable/__tests__/visual/cases/${file.slice(2)}`,
        line: 1,
        frozenPath: `suite/cases/${file.slice(2)}`
      }
    }));
    report.environment = { ...report.environment, ...(await timed('preflightMs', () => preflight(root, runtime))) };
    await fs.symlink(path.join(root, 'packages/vtable/node_modules'), path.join(runDir, 'node_modules'), 'dir');
    runtime.defer(() => fs.rm(path.join(runDir, 'node_modules'), { force: true }));
    report.local = await workingTree(root);
    report.stage = 'fetch';
    const log = path.join(runDir, 'build.log');
    const sha = options['self-compare']
      ? report.local.head
      : await timed('fetchMs', () => resolveBaseline(root, options.baseline, runtime, log));
    report.baseline = {
      repository: options['self-compare'] ? 'working-tree' : official,
      requestedRef: options.baseline ?? (options['self-compare'] ? 'working-tree' : 'refs/heads/develop'),
      sha,
      cacheHit: false
    };
    report.stage = 'localBuild';
    console.log('构建当前工作区…');
    await timed('localBuildMs', () => build(root, runDir, 'current', names, runtime, log));
    const after = await workingTree(root);
    if (after.head !== report.local.head || after.digest !== report.local.digest)
      throw fault('WORKSPACE_CHANGED', '构建期间工作区或 HEAD 发生变化，请重跑');
    report.stage = 'baselineBuild';
    if (options['self-compare'])
      for (const name of names) await fs.copyFile(path.join(runDir, `current-${name}.js`), path.join(runDir, `baseline-${name}.js`));
    else await timed('baselineBuildMs', () => baselineBuild(root, runDir, sha, names, runtime, report, timed));
    report.bundles = Object.fromEntries(await Promise.all(names.map(async name => [name, {
      baseline: digest(await fs.readFile(path.join(runDir, `baseline-${name}.js`))),
      current: digest(await fs.readFile(path.join(runDir, `current-${name}.js`)))
    }])));
    const { server, url } = await serve(runDir);
    runtime.defer(async () => {
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
    });
    const ids = selected.map(item => item.id);
    for (const phase of ['baseline', 'current']) {
      report.stage = phase;
      console.log(`${phase} 截图…`);
      report[`${phase}Result`] = await timed(`${phase}ScreenshotsMs`, () =>
        executePhase(root, runDir, phase, url, ids, runtime)
      );
    }
    report.status = report.currentResult.status;
  } catch (error) {
    report.status = 'error';
    const errorCode = error.visualError
      ? error.code
      : report.stage.endsWith('Build')
      ? 'BUILD_FAILED'
      : 'EXECUTION_FAILED';
    report.issues.push({
      phase: report.stage,
      stage: report.stage,
      category: 'execution',
      code: errorCode,
      message: error.stack ?? String(error)
    });
    console.error(`${errorCode}: ${error.message}`);
  } finally {
    const cleanup = await timed('cleanupMs', () => runtime.cleanup());
    report.issues.push(...cleanup.map(issue => ({ ...issue, phase: 'cleanup', category: 'execution' })));
    if (runtime.interrupted)
      report.issues.push({
        phase: report.stage,
        category: 'execution',
        code: 'RUN_INTERRUPTED',
        message: '运行已中断'
      });
    if (releaseLock) {
      try {
        await releaseLock();
      } catch (error) {
        report.issues.push({ phase: 'cleanup', category: 'execution', code: 'CLEANUP_FAILED', message: String(error) });
      }
    }
    detach();
    report.finalized = true;
    report.timings.totalMs = Math.round(performance.now() - started);
  }
  try {
    const final = await saveReport(runDir, report);
    console.log(`结果：${final.status}\n报告：${path.join(runDir, 'index.html')}`);
    return final.status === 'passed' ? 0 : final.status === 'diff' ? 1 : 2;
  } catch (error) {
    console.error(`REPORT_FAILED: ${error.message}；原始证据：${runDir}`);
    try {
      let evidence = report;
      try {
        evidence = JSON.parse(await fs.readFile(path.join(runDir, 'summary.json'), 'utf8'));
      } catch {}
      await atomicJson(path.join(runDir, 'summary.json'), {
        ...evidence,
        finalized: true,
        schemaVersion: 1,
        status: 'error',
        issues: [
          ...(evidence.issues ?? []),
          { phase: 'report', category: 'execution', code: 'REPORT_FAILED', message: String(error) }
        ]
      });
    } catch {}
    try {
      await fs.rm(path.join(runDir, 'index.html'), { force: true });
    } catch {}
    try {
      await fs.writeFile(
        path.join(runDir, 'agent-summary.md'),
        '# 报告生成失败\n\n状态：error；code：REPORT_FAILED。请读取 summary.json 和阶段日志。\n'
      );
    } catch {}
    return 2;
  }
}
