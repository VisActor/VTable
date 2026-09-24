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
  await runtime.run('git', ['fetch', '--no-tags', official, sha || 'refs/heads/develop'], root, log, { code: 'BASELINE_FETCH_FAILED' });
  const resolved = git(root, ['rev-parse', 'FETCH_HEAD^{commit}']);
  if (sha && resolved !== sha.toLowerCase()) throw fault('BASELINE_FETCH_FAILED', '基线 SHA 与请求不一致');
  return resolved;
}
/** 构建所选包及其工作区依赖，并仅复制本轮产物到隔离运行目录。 */
export async function build(root, runDir, phase, names, runtime, log) {
  const rushx = path.join(root, 'common/scripts/install-run-rushx.js');
  // Gantt 的 bundler.config 从 bundler 工具包解析 Rollup 插件。
  const env = { ...buildEnv, NODE_PATH: path.join(root, 'tools/bundler/node_modules') };
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
  const log = path.join(runDir, 'build.log');
  const key = digest(JSON.stringify({
    sha, names, lock: git(root, ['show', `${sha}:common/config/rush/pnpm-lock.yaml`]),
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
  await timed('baselineInstallMs', () => runtime.run(process.execPath, ['common/scripts/install-run-rush.js', 'install', '--ignore-hooks'], worktree, log, { code: 'BUILD_FAILED', env: { NODE_ENV: 'development' } }));
  await timed('baselineCompileMs', () => build(worktree, runDir, 'baseline', names, runtime, log));
  await publishCache(cache, key, new Map(await Promise.all(names.map(async name => [name, await fs.readFile(path.join(runDir, `baseline-${name}.js`))]))));
}
