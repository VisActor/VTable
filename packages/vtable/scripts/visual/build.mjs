import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { digest, atomicJson, fault } from './runtime.mjs';

export const official = 'https://github.com/VisActor/VTable.git';
export const bundleFiles = {
  vtable: ['packages/vtable', 'dist/vtable.js'],
  editors: ['packages/vtable-editors', 'dist/vtable-editors.js'],
  gantt: ['packages/vtable-gantt', 'dist/vtable-gantt.js'],
  plugins: ['packages/vtable-plugins', 'dist/vtable-plugins.js'],
  sheet: ['packages/vtable-sheet', 'dist/vtable-sheet.js']
};
const buildEnv = { NODE_ENV: 'production', BUNDLE_ANALYZE: '', NODE_OPTIONS: '--max-old-space-size=10240' };

/** 查询指定仓库，不修改分支、索引或远端配置。 */
export function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
}
/** 记录提交、已跟踪差异和未跟踪文件，构建期变更会使运行失败。 */
export async function workingTree(root) {
  const status = git(root, ['status', '--short']);
  const patch = execFileSync('git', ['diff', 'HEAD', '--binary', '--full-index'], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  const files = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' })
    .split('\0').filter(Boolean).sort();
  const untracked = [];
  for (const file of files) {
    const full = path.join(root, file);
    const stat = await fs.lstat(full);
    untracked.push([file, digest(stat.isSymbolicLink() ? await fs.readlink(full) : await fs.readFile(full))]);
  }
  return { head: git(root, ['rev-parse', 'HEAD']), dirty: Boolean(status), status, digest: digest(Buffer.concat([patch, Buffer.from(JSON.stringify(untracked))])) };
}
/** 每次从官方仓库解析本轮 develop 或指定提交，不使用 fork 的 origin。 */
export async function resolveBaseline(root, sha, runtime, log) {
  if (runtime.offline) {
    // 自动化宿主已从官方仓库准备固定提交；隔离执行期间不再访问网络。
    if (!/^[a-f0-9]{40}$/i.test(sha ?? '') || git(root, ['rev-parse', `${sha}^{commit}`]) !== sha.toLowerCase())
      throw fault('BASELINE_FETCH_FAILED', '离线基线提交缺失或不符');
    return sha.toLowerCase();
  }
  await runtime.run('git', ['fetch', '--no-tags', official, sha || 'refs/heads/develop'], root, log, { code: 'BASELINE_FETCH_FAILED' });
  const resolved = git(root, ['rev-parse', 'FETCH_HEAD^{commit}']);
  if (sha && resolved !== sha.toLowerCase()) throw fault('BASELINE_FETCH_FAILED', '基线 SHA 与请求不一致');
  return resolved;
}
/** 核对依赖配置并返回规范目录；缓存命中也不跳过校验。 */
async function assertOfflineConfiguration(root, sha) {
  const directory = await fs.realpath(process.env.VISUAL_BASELINE_DEPENDENCIES ?? root);
  if (process.env.VISUAL_BASELINE_DEPENDENCIES) {
    const files = git(root, ['ls-tree', '-r', '--name-only', sha]).split('\n').filter(file => file === 'rush.json' || file === 'package.json' || file.endsWith('/package.json') || file.startsWith('common/config/rush/'));
    for (const file of files) {
      const resolved = await fs.realpath(path.join(directory, file));
      if (!resolved.startsWith(directory + path.sep) || !(await fs.readFile(resolved)).equals(execFileSync('git', ['show', `${sha}:${file}`], { cwd: root, maxBuffer: 64 * 1024 * 1024 }))) throw fault('DEPENDENCIES_CHANGED', '基线独立依赖配置不同');
    }
    return directory;
  }
  if (git(root, ['diff', sha, '--', 'common/config/rush', 'rush.json']) ||
    git(root, ['ls-files', '--others', '--exclude-standard', '--', 'common/config/rush']))
    throw fault('DEPENDENCIES_CHANGED', '两侧依赖配置不同，需要分别准备后再运行');
  return directory;
}
/** 共用第三方存储，复制项目链接以保持每侧工作区包解析到各自源码。 */
export async function offlineDependencies(root, worktree, sha) {
  // 校验、链接和复制共用同一绝对 realpath，相对快照路径不随链接所在目录重新解释。
  const directory = await assertOfflineConfiguration(root, sha);
  await fs.mkdir(path.join(worktree, 'common'), { recursive: true });
  await fs.symlink(path.join(directory, 'common/temp'), path.join(worktree, 'common/temp'), 'dir');
  const packages = git(process.env.VISUAL_BASELINE_DEPENDENCIES ? worktree : directory, ['ls-files', '--', 'packages/**/package.json', 'tools/**/package.json', 'share/**/package.json']).split('\n').filter(Boolean);
  for (const file of ['package.json', ...packages]) {
    const relative = path.join(path.dirname(file), 'node_modules');
    if (await fs.stat(path.join(directory, relative)).catch(error => error.code === 'ENOENT' ? null : Promise.reject(error))) {
      await fs.mkdir(path.dirname(path.join(worktree, relative)), { recursive: true });
      await fs.cp(await fs.realpath(path.join(directory, relative)), path.join(worktree, relative), { recursive: true, verbatimSymlinks: true });
    }
  }
}
/** 构建所选包及其工作区依赖，并仅复制本轮产物到隔离运行目录。 */
export async function build(root, runDir, phase, names, runtime, log) {
  const rushx = path.join(root, 'common/scripts/install-run-rushx.js');
  // Gantt 的 bundler.config 从 bundler 工具包解析 Rollup 插件。
  // 离线宿主使用 3 GiB 硬预算，提前回收堆内对象并给运行库及工作区留出空间。
  const env = { ...buildEnv, ...(runtime.offline ? { NODE_OPTIONS: '--max-old-space-size=2048' } : {}), NODE_PATH: path.join(root, 'tools/bundler/node_modules') };
  await runtime.run(process.execPath, [rushx, 'build'], path.join(root, 'tools/bundler'), log, { code: 'BUILD_FAILED', env });
  const bundle = path.join(root, 'tools/bundler/bin/index.js');
  const need = new Set(names);
  const esPackages = ['vtable-editors', 'vtable'];
  if (['gantt', 'plugins', 'sheet'].some(name => need.has(name))) esPackages.push('vtable-gantt');
  if (['plugins', 'sheet'].some(name => need.has(name))) esPackages.push('vtable-plugins');
  for (const name of esPackages)
    await runtime.run(process.execPath, [bundle, '-f', 'es', '--ignorePostTasks'], path.join(root, 'packages', name), log, { code: 'BUILD_FAILED', env });
  for (const name of names) {
    const destination = path.join(runDir, `${phase}-${name}.js`);
    if (name === 'vchart') {
      const require = (await import('node:module')).createRequire(path.join(root, 'packages/vtable/package.json'));
      const packageRoot = path.dirname(require.resolve('@visactor/vchart/package.json'));
      const source = path.join(packageRoot, 'build/index.min.js');
      if (!(await fs.stat(source)).size) throw fault('BUILD_FAILED', '缺少 VChart 本地产物');
      await fs.copyFile(source, destination);
      continue;
    }
    const [folder, relative] = bundleFiles[name] ?? [];
    if (!folder) throw fault('BUILD_FAILED', `未知构建包：${name}`);
    const output = path.join(folder, relative);
    if (git(root, ['ls-files', '--', output])) throw fault('BUILD_FAILED', `构建目标被 Git 跟踪：${output}`);
    try { git(root, ['check-ignore', '--no-index', output]); }
    catch { throw fault('BUILD_FAILED', `构建目标未忽略：${output}`); }
    await fs.rm(path.join(root, output), { force: true });
    await runtime.run(process.execPath, [bundle, '-f', 'umd', '--minify=false', '--ignorePostTasks'], path.join(root, folder), log, { code: 'BUILD_FAILED', env });
    if (!(await fs.stat(path.join(root, output))).size) throw fault('BUILD_FAILED', `没有生成有效产物：${output}`);
    await fs.copyFile(path.join(root, output), destination);
  }
}
/** 逐文件校验缓存摘要；坏缓存只导致重新构建。 */
async function readCache(cache, key, names) {
  try {
    const metadata = JSON.parse(await fs.readFile(path.join(cache, 'metadata.json'), 'utf8'));
    if (metadata.key !== key) return null;
    const files = new Map();
    for (const name of names) {
      const bytes = await fs.readFile(path.join(cache, `${name}.js`));
      if (!bytes.length || digest(bytes) !== metadata.files?.[name]) return null;
      files.set(name, bytes);
    }
    return files;
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) return null;
    throw error;
  }
}
/** 成功构建后原子发布完整缓存，不用半份产物覆盖既有缓存。 */
async function publishCache(cache, key, files) {
  const temporary = await fs.mkdtemp(`${cache}-next-`);
  const old = `${cache}-previous`;
  try {
    const hashes = {};
    for (const [name, bytes] of files) {
      await fs.writeFile(path.join(temporary, `${name}.js`), bytes);
      hashes[name] = digest(bytes);
    }
    await atomicJson(path.join(temporary, 'metadata.json'), { key, files: hashes });
    await fs.rm(old, { recursive: true, force: true });
    try { await fs.rename(cache, old); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    try { await fs.rename(temporary, cache); }
    catch (error) { try { await fs.rename(old, cache); } catch {} throw error; }
    await fs.rm(old, { recursive: true, force: true });
  } finally { await fs.rm(temporary, { recursive: true, force: true }); }
}
/** 按 SHA、锁文件、环境、包集合和构建配方缓存最近一次官方产物。 */
export async function baselineBuild(root, runDir, sha, names, runtime, report, timed) {
  if (runtime.offline) await assertOfflineConfiguration(root, sha);
  const log = path.join(runDir, 'build.log');
  const key = digest(JSON.stringify({
    sha, names, lock: git(root, ['show', `${sha}:common/config/rush/pnpm-lock.yaml`]),
    dependencyConfig: git(root, ['rev-parse', `${sha}:common/config/rush`]),
    node: process.version, platform: process.platform, arch: process.arch,
    recipe: digest(await fs.readFile(fileURLToPath(import.meta.url))), buildEnv,
    tools: git(root, ['show', `${sha}:rush.json`])
  }));
  const cache = path.join(root, '.vtable-visual/baseline-cache');
  const cached = await readCache(cache, key, names);
  if (cached) {
    for (const [name, bytes] of cached) await fs.writeFile(path.join(runDir, `baseline-${name}.js`), bytes);
    report.baseline.cacheHit = true;
    return;
  }
  const worktree = path.join(runDir, 'worktree');
  runtime.defer(async () => {
    if (await fs.stat(worktree).catch(error => error.code === 'ENOENT' ? null : Promise.reject(error)))
      execFileSync('git', ['worktree', 'remove', '--force', worktree], { cwd: root, stdio: 'pipe', timeout: 60000 });
  });
  await runtime.run('git', ['worktree', 'add', '--detach', worktree, sha], root, log, { code: 'BUILD_FAILED' });
  await timed('baselineInstallMs', () => runtime.offline ? offlineDependencies(root, worktree, sha) : runtime.run(process.execPath, ['common/scripts/install-run-rush.js', 'install', '--ignore-hooks'], worktree, log, { code: 'BUILD_FAILED', env: { NODE_ENV: 'development' } }));
  await timed('baselineCompileMs', () => build(worktree, runDir, 'baseline', names, runtime, log));
  await publishCache(cache, key, new Map(await Promise.all(names.map(async name => [name, await fs.readFile(path.join(runDir, `baseline-${name}.js`))]))));
}
