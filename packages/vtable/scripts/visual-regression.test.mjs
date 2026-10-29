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
