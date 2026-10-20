import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseOptions } from './visual-test.mjs';
import { loadCases, selectCases } from './visual/runner.mjs';
import { resolveBaseline, offlineDependencies } from './visual/build.mjs';
import fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

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

/** 离线入口不得回退联网；不同锁文件不能借用已有依赖获得通过。 */
test('离线基线使用固定提交和同锁依赖', async () => {
  assert.throws(() => parseOptions(['--offline']), /需要/);
  assert.equal(parseOptions(['--offline', '--baseline', 'a'.repeat(40)]).offline, true);
  const root = await fs.mkdtemp(path.join(tmpdir(), 'vtable-offline-'));
  const worktree = await fs.mkdtemp(path.join(tmpdir(), 'vtable-offline-base-'));
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 'test', GIT_AUTHOR_EMAIL: 'test@example.invalid', GIT_COMMITTER_NAME: 'test', GIT_COMMITTER_EMAIL: 'test@example.invalid' } }).trim();
  try {
    await fs.mkdir(path.join(root, 'common/config/rush'), { recursive: true });
    await fs.mkdir(path.join(root, 'common/temp'), { recursive: true });
    await fs.writeFile(path.join(root, 'common/config/rush/pnpm-lock.yaml'), 'lockfileVersion: 5.4\n');
    await fs.writeFile(path.join(root, 'rush.json'), '{}\n');
    await fs.writeFile(path.join(root, 'package.json'), '{}\n');
    git(['init', '--quiet']); git(['add', '.']); git(['-c', 'core.hooksPath=/dev/null', 'commit', '--quiet', '-m', 'fixture']);
    const sha = git(['rev-parse', 'HEAD']);
    const runtime = { offline: true, run: () => assert.fail('离线模式不能启动 fetch') };
    assert.equal(await resolveBaseline(root, sha, runtime, ''), sha);
    await assert.rejects(() => resolveBaseline(root, undefined, runtime, ''), /基线/);
    await offlineDependencies(root, worktree, sha);
    assert.equal(await fs.realpath(path.join(worktree, 'common/temp')), await fs.realpath(path.join(root, 'common/temp')));
    await fs.writeFile(path.join(root, 'common/config/rush/pnpm-lock.yaml'), 'changed\n');
    await assert.rejects(() => offlineDependencies(root, worktree, sha), /依赖配置不同/);
  } finally { await fs.rm(root, { recursive: true, force: true }); await fs.rm(worktree, { recursive: true, force: true }); }
});
