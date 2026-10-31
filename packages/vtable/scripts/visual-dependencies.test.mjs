import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import {
  assertOfflineConfiguration,
  assertOfflineDependencyConfiguration,
  offlineDependencies,
  baselineBuild
} from './visual/build.mjs';

// 真实提交与独立快照覆盖文件集合差异；构建仅由可观察的小夹具代替。
async function configurationFixture(run) {
  const directory = await fs.mkdtemp(path.join(tmpdir(), 'vtable-config-parity-'));
  const root = path.join(directory, 'source'),
    snapshot = path.join(directory, 'baseline');
  const previous = process.env.VISUAL_BASELINE_DEPENDENCIES;
  delete process.env.VISUAL_BASELINE_DEPENDENCIES;
  const git = args =>
    execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
      cwd: root,
      encoding: 'utf8',
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'fixture',
        GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
        GIT_COMMITTER_NAME: 'fixture',
        GIT_COMMITTER_EMAIL: 'fixture@example.invalid'
      }
    }).trim();
  try {
    await fs.mkdir(path.join(root, 'common/config/rush'), { recursive: true });
    await fs.mkdir(path.join(root, 'packages/vtable'), { recursive: true });
    for (const [name, content] of Object.entries({
      '.gitignore': '/.vtable-visual/\n/common/temp/\n**/node_modules/\n',
      'rush.json': '{}',
      'common/config/rush/pnpm-lock.yaml': 'base',
      'common/config/rush/shared.json': '{}',
      'packages/vtable/package.json': '{}',
      'source.ts': 'base'
    }))
      await fs.writeFile(path.join(root, name), content);
    git(['init', '--quiet']);
    git(['add', '.']);
    git(['commit', '--quiet', '-m', 'baseline']);
    const sha = git(['rev-parse', 'HEAD']);
    await fs.cp(root, snapshot, { recursive: true });
    await fs.mkdir(path.join(root, 'common/temp'), { recursive: true });
    const commit = () => {
      git(['add', '.']);
      git(['commit', '--quiet', '-m', 'candidate']);
      assert.equal(git(['status', '--porcelain']), '');
    };
    await run({ directory, root, snapshot, sha, git, commit });
  } finally {
    if (previous === undefined) delete process.env.VISUAL_BASELINE_DEPENDENCIES;
    else process.env.VISUAL_BASELINE_DEPENDENCIES = previous;
    await fs.rm(directory, { recursive: true, force: true });
  }
}

// 已提交的新增、删除、改名和内容变化不能通过仅拒绝脏配置的检查替代。
test('共享依赖拒绝候选已提交的配置集合或内容变化', async t => {
  for (const scenario of [
    { name: '新增 Rush 配置', file: 'common/config/rush/pnpm-config.json' },
    { name: '新增根清单', file: 'package.json' },
    { name: '新增项目清单含空格换行', file: 'packages/new project\nname/package.json' },
    { name: '修改已有配置', file: 'common/config/rush/shared.json' },
    { name: '修改锁文件', file: 'common/config/rush/pnpm-lock.yaml' },
    { name: '删除配置', file: 'common/config/rush/shared.json', action: 'delete' },
    { name: '改名配置', file: 'common/config/rush/shared.json', action: 'rename' },
    { name: '清单移出配置路径', file: 'packages/vtable/package.json', action: 'rename' }
  ])
    await t.test(scenario.name, () =>
      configurationFixture(async ({ root, snapshot, sha, git, commit }) => {
        const file = path.join(root, scenario.file);
        if (scenario.action === 'delete') await fs.unlink(file);
        else if (scenario.action === 'rename') git(['mv', scenario.file, 'renamed-source.txt']);
        else {
          await fs.mkdir(path.dirname(file), { recursive: true });
          await fs.writeFile(file, '{"candidate":true}');
        }
        commit();
        assert.doesNotThrow(() => assertOfflineDependencyConfiguration(root));
        await assert.rejects(assertOfflineConfiguration(root, sha), { code: 'DEPENDENCIES_CHANGED' });
        assert.equal(await assertOfflineConfiguration(root, sha, snapshot), await fs.realpath(snapshot));
      })
    );
});

// 通过显式路径、相对路径或符号链接重用当前目录，也必须检查双侧差异。
test('工作区快照别名不能绕过配置集合检查', async t => {
  for (const mode of ['absolute', 'relative', 'symlink', 'environment'])
    await t.test(mode, () =>
      configurationFixture(async ({ directory, root, sha, commit }) => {
        await fs.writeFile(path.join(root, 'common/config/rush/new.json'), '{}');
        commit();
        const alias = path.join(directory, 'alias');
        await fs.symlink(root, alias, 'dir');
        let snapshot = mode === 'relative' ? path.relative(process.cwd(), root) : mode === 'absolute' ? root : alias;
        if (mode === 'environment') {
          process.env.VISUAL_BASELINE_DEPENDENCIES = alias;
          snapshot = undefined;
        }
        await assert.rejects(assertOfflineConfiguration(root, sha, snapshot), { code: 'DEPENDENCIES_CHANGED' });
      })
    );
});

// 共享配置相同而源码不同仍可执行；独立基线快照继续允许真正的双侧配置差异。
test('配置相同保留源码修改和独立基线快照的合法路径', async () =>
  configurationFixture(async ({ root, snapshot, sha, commit }) => {
    assert.equal(await assertOfflineConfiguration(root, sha), await fs.realpath(root));
    await fs.writeFile(path.join(root, 'source.ts'), 'candidate');
    commit();
    assert.equal(await assertOfflineConfiguration(root, sha), await fs.realpath(root));
    await fs.writeFile(path.join(root, 'source.ts'), 'uncommitted source');
    assert.doesNotThrow(() => assertOfflineDependencyConfiguration(root));
    assert.equal(await assertOfflineConfiguration(root, sha), await fs.realpath(root));
    await fs.writeFile(path.join(root, 'common/config/rush/new.json'), '{}');
    await assert.rejects(assertOfflineConfiguration(root, sha), { code: 'DEPENDENCIES_CHANGED' });
    commit();
    process.env.VISUAL_BASELINE_DEPENDENCIES = snapshot;
    assert.equal(await assertOfflineConfiguration(root, sha), await fs.realpath(snapshot));
  }));

// 先真实生成并命中缓存，再引入已提交新增配置，校验必须先于缓存读取与链接创建。
test('缓存命中和依赖链接入口仍拒绝已提交的新增配置', async () =>
  configurationFixture(async ({ directory, root, sha, commit }) => {
    const run = path.join(root, '.vtable-visual/run');
    await fs.mkdir(run, { recursive: true });
    const cleanups = [],
      runtime = {
        offline: true,
        defer(action) {
          cleanups.push(action);
        },
        async run(command, args) {
          if (command === 'git')
            execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], { cwd: root, stdio: 'pipe' });
          else assert.equal(command, process.execPath);
          return 0;
        }
      };
    const timed = (_name, action) => action(),
      report = { baseline: {} };
    // 本夹具只验证编排顺序，不运行产品构建或浏览器。
    const build = () => baselineBuild(root, run, sha, [], runtime, report, timed);
    try {
      await build();
      await build();
      assert.equal(report.baseline.cacheHit, true);
      await fs.writeFile(path.join(root, 'common/config/rush/new.json'), '{}');
      commit();
      await assert.rejects(build(), { code: 'DEPENDENCIES_CHANGED' });
      const destination = path.join(directory, 'untouched');
      await assert.rejects(offlineDependencies(root, destination, sha), { code: 'DEPENDENCIES_CHANGED' });
      await assert.rejects(fs.stat(destination), { code: 'ENOENT' });
    } finally {
      for (const cleanup of cleanups.reverse()) await cleanup();
    }
  }));
