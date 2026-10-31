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
    await fs.rm(path.join(snapshot, '.git'), { recursive: true });
    await fs.mkdir(path.join(snapshot, 'common/temp'), { recursive: true });
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

// 独立快照不带 Git 元数据，也不能夹带冻结提交之外的源码配置。
test('独立快照拒绝额外配置并保留目录边界', async t => {
  for (const file of [
    'common/config/rush/pnpm-config.json',
    'common/config/rush/.npmrc',
    'common/config/rush/space\nname.json',
    'common/config/rush/dist/extra.json',
    'common/config/rush/node_modules/extra.json',
    'package.json',
    'packages/new project\nname/package.json',
    'tools/extra/package.json',
    'packages/vtable/src/build/package.json'
  ])
    await t.test(JSON.stringify(file), () =>
      configurationFixture(async ({ root, snapshot, sha }) => {
        await fs.mkdir(path.dirname(path.join(snapshot, file)), { recursive: true });
        await fs.writeFile(path.join(snapshot, file), '{}');
        await fs.writeFile(path.join(snapshot, '.gitignore'), '**/*\n');
        await assert.rejects(assertOfflineConfiguration(root, sha, snapshot), { code: 'DEPENDENCIES_CHANGED' });
      })
    );
  for (const mode of ['outside-directory', 'internal-package-alias', 'directory-cycle', 'internal-rush-alias'])
    await t.test(mode, () =>
      configurationFixture(async ({ directory, root, snapshot, sha }) => {
        const alias = path.join(snapshot, 'packages/alias');
        if (mode === 'outside-directory') {
          const outside = path.join(directory, 'outside');
          await fs.mkdir(outside);
          await fs.writeFile(path.join(outside, 'package.json'), '{}');
          await fs.symlink(outside, alias, 'dir');
        } else if (mode === 'internal-package-alias') await fs.symlink('vtable', alias, 'dir');
        else if (mode === 'directory-cycle') await fs.symlink('..', alias, 'dir');
        else {
          await fs.rename(path.join(snapshot, 'common/config/rush'), path.join(snapshot, 'config-store'));
          await fs.symlink('../../config-store', path.join(snapshot, 'common/config/rush'), 'dir');
          await fs.writeFile(path.join(snapshot, 'config-store/extra.json'), '{}');
        }
        await assert.rejects(assertOfflineConfiguration(root, sha, snapshot), { code: 'DEPENDENCIES_CHANGED' });
      })
    );
  await t.test('缺失配置', () =>
    configurationFixture(async ({ root, snapshot, sha }) => {
      await fs.unlink(path.join(snapshot, 'common/config/rush/shared.json'));
      await assert.rejects(assertOfflineConfiguration(root, sha, snapshot), { code: 'DEPENDENCIES_CHANGED' });
    })
  );
});

// 安装产物不属于源码配置，可信提交实际跟踪的同名目录仍必须检查。
test('无 Git 快照允许安装产物，仍核对已跟踪的构建同名目录', async () =>
  configurationFixture(async ({ directory, root, snapshot, sha, git, commit }) => {
    await assert.rejects(fs.stat(path.join(snapshot, '.git')), { code: 'ENOENT' });
    for (const file of [
      'node_modules/a/package.json',
      'packages/vtable/node_modules/b/package.json',
      'common/temp/install-run/tool/package.json',
      'common/autoinstallers/lint/node_modules/c/package.json',
      '.git/cache/package.json',
      '.vtable-visual/run/package.json',
      'packages/vtable/.rush/temp/package.json',
      ...['build', 'dist', 'es', 'cjs', 'lib', 'output', 'coverage'].map(name => `packages/vtable/${name}/package.json`)
    ]) {
      await fs.mkdir(path.dirname(path.join(snapshot, file)), { recursive: true });
      await fs.writeFile(path.join(snapshot, file), '{}');
    }
    const outside = path.join(directory, 'installed');
    await fs.mkdir(outside);
    await fs.symlink(outside, path.join(snapshot, 'packages/vtable/node_modules/linked'), 'dir');
    assert.equal(await assertOfflineConfiguration(root, sha, snapshot), await fs.realpath(snapshot));
    await fs.mkdir(path.join(root, 'packages/vtable/dist/template'), { recursive: true });
    await fs.writeFile(path.join(root, 'packages/vtable/dist/template/package.json'), '{}');
    await fs.writeFile(path.join(root, 'common/config/rush/frozen\n配置.json'), '{}');
    await fs.writeFile(path.join(root, 'package.json'), '{}');
    commit();
    const next = path.join(directory, 'tracked-output');
    await fs.cp(root, next, { recursive: true });
    await fs.rm(path.join(next, '.git'), { recursive: true });
    const nextSha = git(['rev-parse', 'HEAD']);
    assert.equal(await assertOfflineConfiguration(root, nextSha, next), await fs.realpath(next));
    await fs.mkdir(path.join(next, 'packages/vtable/dist/extra'));
    await fs.writeFile(path.join(next, 'packages/vtable/dist/extra/package.json'), '{}');
    await assert.rejects(assertOfflineConfiguration(root, nextSha, next), { code: 'DEPENDENCIES_CHANGED' });
  }));

// 实际候选入口须在预检前拒绝额外配置，而非依赖后续缺工具产生错误。
test('候选入口在浏览器预检前拒绝快照额外配置', async () =>
  configurationFixture(async ({ root, snapshot, sha }) => {
    const previous = process.env.VISUAL_HEAD_DEPENDENCIES;
    try {
      const suite = path.join(root, 'packages/vtable/__tests__/visual');
      await fs.mkdir(path.join(suite, 'cases'), { recursive: true });
      for (const file of [
        'settings.mjs',
        'playwright.config.mjs',
        'visual.spec.mjs',
        'reporter.mjs',
        'assertions.mjs',
        'page.html'
      ])
        await fs.copyFile(new URL(`../__tests__/visual/${file}`, import.meta.url), path.join(suite, file));
      await fs.writeFile(
        path.join(suite, 'cases/index.mjs'),
        "export const cases=[{id:'one',purpose:'快照配置集合',file:'./one.mjs',bundles:['vtable']}];export async function loadCase(){return(await import('./one.mjs')).default;}"
      );
      await fs.writeFile(path.join(suite, 'cases/one.mjs'), 'export default {mount(){},async verify(){}};');
      await fs.writeFile(path.join(snapshot, 'common/config/rush/extra.json'), '{}');
      process.env.VISUAL_HEAD_DEPENDENCIES = snapshot;
      const { runVisual } = await import('./visual/runner.mjs');
      assert.equal(await runVisual(root, { offline: true, baseline: sha }), 2);
      const runs = path.join(root, '.vtable-visual/runs');
      const result = JSON.parse(await fs.readFile(path.join(runs, (await fs.readdir(runs))[0], 'summary.json')));
      assert(result.issues.some(issue => issue.code === 'DEPENDENCIES_CHANGED'));
      assert(result.cases.every(item => item.status === 'not_run'));
      assert.equal(result.complete, false);
    } finally {
      if (previous === undefined) delete process.env.VISUAL_HEAD_DEPENDENCIES;
      else process.env.VISUAL_HEAD_DEPENDENCIES = previous;
    }
  }));

// 额外配置也须阻断独立快照的缓存命中与链接创建。
test('独立快照缓存命中不能绕过配置集合校验', async () =>
  configurationFixture(async ({ directory, root, snapshot, sha }) => {
    process.env.VISUAL_BASELINE_DEPENDENCIES = snapshot;
    const run = path.join(root, '.vtable-visual/independent-cache');
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
    const build = () => baselineBuild(root, run, sha, [], runtime, report, timed);
    try {
      await build();
      await build();
      assert.equal(report.baseline.cacheHit, true);
      await fs.writeFile(path.join(snapshot, 'common/config/rush/extra.json'), '{}');
      await assert.rejects(build(), { code: 'DEPENDENCIES_CHANGED' });
      const destination = path.join(directory, 'independent-untouched');
      await assert.rejects(offlineDependencies(root, destination, sha), { code: 'DEPENDENCIES_CHANGED' });
      await assert.rejects(fs.stat(destination), { code: 'ENOENT' });
    } finally {
      for (const cleanup of cleanups.reverse()) await cleanup();
    }
  }));
