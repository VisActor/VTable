import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseOptions } from './visual-test.mjs';
import { loadCases, selectCases } from './visual/runner.mjs';
import { resolveBaseline, offlineDependencies, baselineBuild } from './visual/build.mjs';
import fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import autoColumnWidth from '../__tests__/visual/cases/interaction/double-click-auto-column-width.mjs';

/** 复现 Linux 字体测量为 263px 时仍保留收缩断言，双击无响应必须失败。 */
test('双击列宽用例在较宽字体下有效且拒绝无响应', async () => {
  const previousWindow = globalThis.window, previousDocument = globalThis.document;
  let width, pointer = 0, dragging = false, responds = true;
  globalThis.window = { __visualTable: { getCellRect: () => ({ bounds: { x1: 250, x2: 250 + width, y1: 0, y2: 40 } }) } };
  globalThis.document = { getElementById: () => ({ getBoundingClientRect: () => ({ x: 0, y: 0 }) }) };
  const page = { evaluate: fn => fn(), mouse: {
    async move(x) { if (dragging) width += x - pointer; pointer = x; },
    async down() { dragging = true; }, async up() { dragging = false; },
    async dblclick() { if (responds) width = 263; }
  } };
  try {
    width = 150; await autoColumnWidth.exercise(page); await autoColumnWidth.verify(page);
    assert.equal(window.__draggedColumnWidth, 390); assert.equal(width, 263);
    width = 150; responds = false; await autoColumnWidth.exercise(page);
    await assert.rejects(() => autoColumnWidth.verify(page), /双击自动列宽未生效/);
  } finally {
    if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  }
});

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
    await fs.writeFile(path.join(root, 'common/config/rush/pnpm-config.json'), '{"useWorkspaces":true}\n');
    await fs.writeFile(path.join(root, 'package.json'), '{}\n');
    await fs.writeFile(path.join(root, '.gitignore'), 'node_modules/\n.vtable-visual/\n');
    for (const name of ['vtable', 'vtable-gantt']) {
      await fs.mkdir(path.join(root, 'packages', name), { recursive: true });
      await fs.writeFile(path.join(root, 'packages', name, 'package.json'), '{}\n');
    }
    await fs.writeFile(path.join(root, 'packages/vtable/version.txt'), 'baseline');
    await fs.mkdir(path.join(root, 'packages/vtable-gantt/node_modules/@visactor'), { recursive: true });
    await fs.symlink('../../../vtable', path.join(root, 'packages/vtable-gantt/node_modules/@visactor/vtable'), 'dir');
    git(['init', '--quiet']); git(['add', '.']); git(['-c', 'core.hooksPath=/dev/null', 'commit', '--quiet', '-m', 'fixture']);
    const sha = git(['rev-parse', 'HEAD']);
    await fs.writeFile(path.join(root, 'packages/vtable/version.txt'), 'current');
    await fs.mkdir(path.join(worktree, 'packages/vtable'), { recursive: true });
    await fs.writeFile(path.join(worktree, 'packages/vtable/version.txt'), 'baseline');
    const runtime = { offline: true, run: () => assert.fail('离线模式不能启动 fetch') };
    assert.equal(await resolveBaseline(root, sha, runtime, ''), sha);
    await assert.rejects(() => resolveBaseline(root, undefined, runtime, ''), /基线/);
    await offlineDependencies(root, worktree, sha);
    assert.equal(await fs.realpath(path.join(worktree, 'common/temp')), await fs.realpath(path.join(root, 'common/temp')));
    assert.equal(await fs.readFile(path.join(worktree, 'packages/vtable-gantt/node_modules/@visactor/vtable/version.txt'), 'utf8'), 'baseline');
    // 空产物缓存只验证命中顺序，不启动构建或浏览器。
    const runDir = path.join(root, '.vtable-visual/test-run'); await fs.mkdir(runDir, { recursive: true });
    const cachedReport = { baseline: {} }, cacheRuntime = { offline: true, defer() {}, async run(command, args, _cwd, _log, options) {
      if (command === 'git' && args[0] === 'worktree') await fs.mkdir(args[3], { recursive: true });
      if (command === process.execPath) assert.equal(options.env.NODE_OPTIONS, '--max-old-space-size=2048');
      return 0;
    } };
    await baselineBuild(root, runDir, sha, [], cacheRuntime, cachedReport, (_name, action) => action());
    await baselineBuild(root, runDir, sha, [], cacheRuntime, cachedReport, (_name, action) => action());
    assert.equal(cachedReport.baseline.cacheHit, true);
    await fs.writeFile(path.join(root, 'common/config/rush/pnpm-config.json'), '{"useWorkspaces":false}\n');
    await assert.rejects(() => baselineBuild(root, runDir, sha, [], cacheRuntime, cachedReport, (_name, action) => action()), /依赖配置不同/);
    await fs.writeFile(path.join(root, 'common/config/rush/pnpm-config.json'), '{"useWorkspaces":true}\n');
    await fs.writeFile(path.join(root, 'common/config/rush/pnpm-lock.yaml'), 'changed\n');
    await assert.rejects(() => offlineDependencies(root, worktree, sha), /依赖配置不同/);
    await assert.rejects(() => baselineBuild(root, runDir, sha, [], cacheRuntime, cachedReport, (_name, action) => action()), /依赖配置不同/);
  } finally { await fs.rm(root, { recursive: true, force: true }); await fs.rm(worktree, { recursive: true, force: true }); }
});
