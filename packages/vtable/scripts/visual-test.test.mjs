import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseOptions } from './visual-test.mjs';
import { loadCases, selectCases } from './visual/runner.mjs';

/** 用最小契约检查拦住无效范围、重复 ID 和缺失来源模块。 */
test('视觉用例清单与范围选择', async () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const cases = await loadCases(path.join(root, '__tests__/visual'));
  assert.ok(cases.length >= 2);
  assert.equal(new Set(cases.map(item => item.id)).size, cases.length);
  assert.ok(selectCases(cases, { dir: 'pivot' }).every(item => item.file.startsWith('./pivot/')));
  assert.deepEqual(selectCases(cases, { case: 'list-basic' }).map(item => item.id), ['list-basic']);
  assert.throws(() => parseOptions(['--dir', '../pivot']), /--dir/);
  assert.throws(() => parseOptions(['--dir', 'pivot', '--case', 'list-basic']), /互斥/);
  assert.throws(() => selectCases(cases, { dir: 'missing' }), /没有匹配用例/);
});
