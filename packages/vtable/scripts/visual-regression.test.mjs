import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { saveReport } from '../__tests__/visual/report.mjs';

// 业务断言失败可作为待调查证据；当前失败、基础设施失败及普通缺图绝不变成通过。
test('修复报告保留旧版失败并严格区分执行错误', async () => {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'visual-regression-'));
  try {
    await fs.writeFile(path.join(dir, 'current.png'), 'fixture');
    const baseline = { id: 'one', status: 'error', code: 'INTERACTION_ASSERTION_FAILED', category: 'interaction', errors: ['漏洞复现'], attachments: [] };
    const current = { id: 'one', status: 'passed', errors: [], attachments: [{ name: 'rendered', path: 'current.png' }] };
    const summary = { status: 'passed', environment: {}, cases: [{ id: 'one' }], baselineResult: { finalized: true, endedStatus: 'failed', errors: [], tests: [baseline] }, currentResult: { finalized: true, endedStatus: 'passed', errors: [], tests: [current] } };
    await saveReport(dir, summary);
    let result = JSON.parse(await fs.readFile(path.join(dir, 'summary.json')));
    assert.equal(result.cases[0].status, 'new_baseline');
    assert.equal(result.status, 'diff');
    assert.match(await fs.readFile(path.join(dir, 'index.html'), 'utf8'), /待确认项不代表比较通过/);
    assert.match(await fs.readFile(path.join(dir, 'agent-summary.md'), 'utf8'), /完整执行：true/);
    assert.equal(result.cases[0].errors[0].message, '漏洞复现');
    for (const code of ['TIMEOUT', 'RESOURCE_FAILED', 'MISSING_ARTIFACT']) {
      await saveReport(dir, { ...summary, baselineResult: { ...summary.baselineResult, tests: [{ ...baseline, code }] } });
      result = JSON.parse(await fs.readFile(path.join(dir, 'summary.json')));
      assert.equal(result.status, 'error');
    }
    await saveReport(dir, { ...summary, currentResult: { ...summary.currentResult, tests: [{ ...current, status: 'error', errors: ['当前失败'] }] } });
    result = JSON.parse(await fs.readFile(path.join(dir, 'summary.json')));
    assert.equal(result.status, 'error');
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

// 使用假的 CLI 启动结果验证真实阶段适配器，不依赖浏览器或网络。
test('仅完整旧版业务断言失败允许继续，当前失败和基础设施错误仍抛出', async () => {
  const { executePhase } = await import('./visual/runner.mjs');
  const root = await fs.mkdtemp(path.join(tmpdir(), 'visual-phase-'));
  try {
    const cli = path.join(root, 'packages/vtable/node_modules/@playwright/test');
    await fs.mkdir(cli, { recursive: true });
    await fs.writeFile(path.join(cli, 'package.json'), JSON.stringify({ exports: { './cli': './cli.js' } }));
    await fs.writeFile(path.join(cli, 'cli.js'), '');
    let result = { finalized: true, endedStatus: 'failed', status: 'error', errors: [], tests: [{ id: 'one', status: 'error', code: 'INTERACTION_ASSERTION_FAILED' }] };
    const runtime = { async run(_command, _args, _cwd, _log, options) { await fs.writeFile(path.join(root, `${options.env.VISUAL_PHASE}-result.json`), JSON.stringify(result)); return 1; } };
    assert.equal((await executePhase(root, root, 'baseline', '', ['one'], runtime)).status, 'error');
    await assert.rejects(() => executePhase(root, root, 'current', '', ['one'], runtime));
    for (const code of ['TIMEOUT', 'RESOURCE_FAILED', 'MISSING_ARTIFACT']) {
      result.tests[0].code = code;
      await assert.rejects(() => executePhase(root, root, 'baseline', '', ['one'], runtime));
    }
    result.tests[0].code = 'CASE_ASSERTION_FAILED'; result.finalized = false;
    await assert.rejects(() => executePhase(root, root, 'baseline', '', ['one'], runtime));
    result.finalized = true; result.errors = ['worker crashed'];
    await assert.rejects(() => executePhase(root, root, 'baseline', '', ['one'], runtime));
    result.errors = []; result.tests[0].id = 'other';
    await assert.rejects(() => executePhase(root, root, 'baseline', '', ['one'], runtime), /集合/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});

// 独立基线依赖必须逐文件匹配基线提交，不能用当前版的锁文件代替。
test('不同锁文件分别准备，错配和目录越界拒绝', async () => {
  const { execFileSync } = await import('node:child_process');
  const { offlineDependencies } = await import('./visual/build.mjs');
  const root = await fs.mkdtemp(path.join(tmpdir(), 'visual-deps-'));
  const previous = process.env.VISUAL_BASELINE_DEPENDENCIES;
  const previousCwd = process.cwd();
  const source = path.join(root, 'source'), base = path.join(root, 'base'), deps = path.join(root, 'deps');
  const git = args => execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], { cwd: source, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 'fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' } }).trim();
  try {
    await fs.mkdir(path.join(source, 'common/config/rush'), { recursive: true });
    await fs.writeFile(path.join(source, 'rush.json'), '{}\n');
    await fs.mkdir(path.join(source, 'packages/vtable'), { recursive: true });
    await fs.writeFile(path.join(source, 'packages/vtable/package.json'), '{}\n');
    await fs.writeFile(path.join(source, 'common/config/rush/pnpm-lock.yaml'), 'base\n');
    git(['init', '-q']); git(['add', '.']); git(['commit', '-qm', 'base']);
    const sha = git(['rev-parse', 'HEAD']);
    await fs.cp(source, deps, { recursive: true, filter: file => !file.includes('/.git') });
    await fs.mkdir(path.join(deps, 'common/temp'));
    await fs.mkdir(path.join(deps, 'packages/vtable/node_modules'), { recursive: true });
    await fs.writeFile(path.join(deps, 'packages/vtable/node_modules/snapshot.txt'), 'baseline dependencies');
    await fs.writeFile(path.join(source, 'common/config/rush/pnpm-lock.yaml'), 'head\n');
    git(['add', '.']); git(['commit', '-qm', 'head']); git(['worktree', 'add', '--detach', base, sha]);
    await fs.symlink(deps, path.join(root, 'deps-alias'), 'dir');
    process.chdir(root);
    for (const [name, directory] of [['absolute', deps], ['relative', 'deps'], ['alias', 'deps-alias']]) {
      const worktree = name === 'absolute' ? base : path.join(root, `base-${name}`);
      if (worktree !== base) git(['worktree', 'add', '--detach', worktree, sha]);
      process.env.VISUAL_BASELINE_DEPENDENCIES = directory;
      await offlineDependencies(source, worktree, sha);
      assert.equal(await fs.readlink(path.join(worktree, 'common/temp')), await fs.realpath(path.join(deps, 'common/temp')));
      assert.equal(await fs.realpath(path.join(worktree, 'common/temp')), await fs.realpath(path.join(deps, 'common/temp')));
      assert.equal(await fs.readFile(path.join(worktree, 'packages/vtable/node_modules/snapshot.txt'), 'utf8'), 'baseline dependencies');
    }
    process.env.VISUAL_BASELINE_DEPENDENCIES = deps;
    await fs.writeFile(path.join(deps, 'rush.json'), '{"changed":true}');
    await assert.rejects(() => offlineDependencies(source, base, sha), /配置不同/);
    await fs.unlink(path.join(deps, 'rush.json'));
    await fs.symlink(path.join(source, 'rush.json'), path.join(deps, 'rush.json'));
    await assert.rejects(() => offlineDependencies(source, base, sha), /配置不同/);
  } finally {
    if (previous === undefined) delete process.env.VISUAL_BASELINE_DEPENDENCIES; else process.env.VISUAL_BASELINE_DEPENDENCIES = previous;
    process.chdir(previousCwd);
    await fs.rm(root, { recursive: true, force: true });
  }
});

// 使用真实 reporter、阶段入口和汇总验证阶段终态，CLI 退出码由夹具控制，不启动浏览器。
test('阶段超时、中断及退出码异常不能被已完成用例或旧版断言掩盖', async t => {
  const { default: Reporter } = await import('../__tests__/visual/reporter.mjs');
  const { executePhase } = await import('./visual/runner.mjs');
  const scenarios = [
    { name: '正常通过', phase: 'baseline', endedStatus: 'passed', kind: 'passed', exitCode: 0 },
    { name: '正常旧版业务失败', phase: 'baseline', endedStatus: 'failed', kind: 'assertion', exitCode: 1 },
    { name: '正常截图差异', phase: 'current', endedStatus: 'failed', kind: 'diff', exitCode: 1 },
    ...['baseline', 'current'].flatMap(phase => [
      ...['timedout', 'interrupted'].flatMap(endedStatus =>
        ['passed', 'assertion'].map(kind => ({
          name: `${phase} ${kind} ${endedStatus}`,
          phase,
          endedStatus,
          kind,
          exitCode: 1,
          rejected: true
        }))
      ),
      { name: `${phase} 缺少原始结束状态`, phase, kind: 'passed', exitCode: 0, rejected: true },
      { name: `${phase} 未知结束状态`, phase, endedStatus: 'unknown', kind: 'passed', exitCode: 0, rejected: true },
      { name: `${phase} 通过却非零退出`, phase, endedStatus: 'passed', kind: 'passed', exitCode: 1, rejected: true }
    ]),
    {
      name: '业务失败却零退出',
      phase: 'baseline',
      endedStatus: 'failed',
      kind: 'assertion',
      exitCode: 0,
      rejected: true
    },
    {
      name: '业务失败且进程异常退出',
      phase: 'baseline',
      endedStatus: 'failed',
      kind: 'assertion',
      exitCode: 2,
      rejected: true
    },
    { name: '当前业务失败', phase: 'current', endedStatus: 'failed', kind: 'assertion', exitCode: 1, rejected: true }
  ];
  for (const scenario of scenarios)
    await t.test(scenario.name, async () => {
      const dir = await fs.mkdtemp(path.join(tmpdir(), 'visual-ended-status-'));
      const previousRun = process.env.VISUAL_RUN_DIR,
        previousPhase = process.env.VISUAL_PHASE;
      try {
        const cli = path.join(dir, 'packages/vtable/node_modules/@playwright/test');
        await fs.mkdir(cli, { recursive: true });
        await fs.writeFile(path.join(cli, 'package.json'), JSON.stringify({ exports: { './cli': './cli.js' } }));
        await fs.writeFile(path.join(cli, 'cli.js'), '');
        const runtime = {
          async run(_command, _args, _cwd, _log, { env }) {
            // 经过真实 reporter 落盘，确保丢失终态或保留失败证据的回归能被检测到。
            process.env.VISUAL_RUN_DIR = dir;
            process.env.VISUAL_PHASE = env.VISUAL_PHASE;
            const reporter = new Reporter(),
              selected = env.VISUAL_PHASE === scenario.phase;
            for (const id of ['one', 'two']) {
              const kind = selected && id === 'one' ? scenario.kind : 'passed';
              const image = path.join(dir, `${env.VISUAL_PHASE}-${id}.png`);
              await fs.writeFile(image, 'image fixture');
              const attachments = kind === 'assertion' ? [] : [{ name: 'rendered', path: image }];
              if (kind === 'diff')
                attachments.push({ name: 'visual-difference' }, { name: 'rendered-diff.png', path: image });
              reporter.onTestEnd(
                { title: id, annotations: [{ type: 'stage', description: 'verify' }] },
                {
                  status: kind === 'passed' ? 'passed' : 'failed',
                  duration: 1,
                  attachments,
                  errors:
                    kind === 'passed' ? [] : [{ message: kind === 'assertion' ? '旧版业务断言失败证据' : '视觉差异' }]
                }
              );
            }
            reporter.onEnd({ status: selected ? scenario.endedStatus : 'passed' });
            return selected ? scenario.exitCode : 0;
          }
        };
        const phases = {},
          raw = {};
        let rejected = false;
        for (const phase of ['baseline', 'current']) {
          try {
            phases[phase] = await executePhase(dir, dir, phase, '', ['one', 'two'], runtime);
          } catch (error) {
            assert.equal(phase, scenario.phase);
            assert.equal(error.code, 'EXECUTION_FAILED');
            rejected = true;
            phases[phase] = JSON.parse(await fs.readFile(path.join(dir, `${phase}-result.json`), 'utf8'));
          }
          raw[phase] = await fs.readFile(path.join(dir, `${phase}-result.json`), 'utf8');
        }
        assert.equal(rejected, scenario.rejected === true);
        assert.equal(phases[scenario.phase].endedStatus, scenario.endedStatus);
        const summary = {
          status: rejected ? 'error' : 'passed',
          environment: {},
          cases: [{ id: 'one' }, { id: 'two' }],
          baselineResult: phases.baseline,
          currentResult: phases.current
        };
        const report = await saveReport(dir, summary);
        assert.equal(report.status, rejected ? 'error' : scenario.kind === 'passed' ? 'passed' : 'diff');
        if (!rejected && scenario.kind === 'assertion') {
          assert.equal(report.cases[0].status, 'new_baseline');
          assert.equal(report.cases[0].errors[0].message, '旧版业务断言失败证据');
          assert.equal(report.complete, true);
        }
        if (!['passed', 'failed'].includes(scenario.endedStatus)) {
          // 即使调用方误传成功状态，汇总也不能把异常阶段解释为完整通过。
          const standalone = await saveReport(dir, { ...summary, status: 'passed' });
          assert.equal(standalone.status, 'error');
          assert.equal(standalone.complete, false);
          assert.ok(standalone.issues.some(issue => issue.phase === scenario.phase && issue.code === 'RUN_INCOMPLETE'));
          assert.notEqual(standalone.cases[0].status, 'new_baseline');
        }
        for (const phase of ['baseline', 'current'])
          assert.equal(await fs.readFile(path.join(dir, `${phase}-result.json`), 'utf8'), raw[phase]);
      } finally {
        if (previousRun === undefined) delete process.env.VISUAL_RUN_DIR;
        else process.env.VISUAL_RUN_DIR = previousRun;
        if (previousPhase === undefined) delete process.env.VISUAL_PHASE;
        else process.env.VISUAL_PHASE = previousPhase;
        await fs.rm(dir, { recursive: true, force: true });
      }
    });
});
