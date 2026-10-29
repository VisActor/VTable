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
    const summary = { status: 'passed', environment: {}, cases: [{ id: 'one' }], baselineResult: { finalized: true, errors: [], tests: [baseline] }, currentResult: { finalized: true, errors: [], tests: [current] } };
    await saveReport(dir, summary);
    let result = JSON.parse(await fs.readFile(path.join(dir, 'summary.json')));
    assert.equal(result.cases[0].status, 'new_baseline');
    assert.equal(result.status, 'diff');
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
    let result = { finalized: true, status: 'error', errors: [], tests: [{ id: 'one', status: 'error', code: 'INTERACTION_ASSERTION_FAILED' }] };
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
