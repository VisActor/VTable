const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { mkdirSync, readdirSync, readFileSync, writeFileSync } = require('node:fs');
const { isAbsolute, join, relative } = require('node:path');
const expected = require('./release-packages.json');
const sha = /^[a-f0-9]{40}$/;
const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-alpha\.(0|[1-9]\d*))?$/;
const registry = 'https://registry.npmjs.org';
const digest = (data, algorithm = 'sha256', encoding = 'hex') => createHash(algorithm).update(data).digest(encoding);
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const ordered = obj => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));

// 从压缩包直接回读 npm 元数据和原字节，不解包到源码工作区。
function packageEvidence(file, name, version, execute = execFileSync) {
  const path = file.path;
  const bytes = readFileSync(path);
  const metadata = JSON.parse(execute('tar', ['-xOf', path, 'package/package.json'], { maxBuffer: 1024 ** 2 }));
  if (metadata.name !== name || metadata.version !== version) throw new Error('包名或版本不符：' + name);
  const dependencies = {};
  for (const group of [metadata.dependencies, metadata.optionalDependencies, metadata.peerDependencies]) {
    for (const [dependency, range] of Object.entries(group ?? {})) {
      if (range.startsWith('workspace:') || (expected.some(item => item.name === dependency) && range !== version) ||
          (Object.hasOwn(dependencies, dependency) && dependencies[dependency] !== range)) {
        throw new Error('打包依赖不符：' + name + ' / ' + dependency);
      }
      dependencies[dependency] = range;
    }
  }
  return { name, version, file: file.name, sha256: digest(bytes), integrity: 'sha512-' + digest(bytes, 'sha512', 'base64'), dependencies: ordered(dependencies) };
}

// 校验完整包集合和每个归档的内容；摘要的字段顺序与 Bot 一致。
function verifyPak(manifest, out, execute = execFileSync) {
  const { schema, repository, releaseId, sourceSha, releaseSha, workflowSha, runId, runAttempt, version, packages } = manifest;
  const filenames = Array.isArray(packages) ? packages.map(pkg => pkg.file).sort() : [];
  if (schema !== 1 || repository !== 'VisActor/VTable' || !sha.test(releaseSha) || !sha.test(sourceSha) || !sha.test(workflowSha) ||
      !/^[a-f0-9-]{36}$/.test(releaseId) || !Number.isSafeInteger(runId) || runId < 1 || runAttempt !== 1 || !versionPattern.test(version) ||
      filenames.length !== expected.length || new Set(filenames).size !== expected.length ||
      JSON.stringify(readdirSync(out).filter(name => name.endsWith('.tgz')).sort()) !== JSON.stringify(filenames)) throw new Error('发布清单不完整');
  const verified = expected.map(({ name }) => {
    const pkg = packages.find(item => item.name === name);
    if (!pkg || !/^[a-z0-9._-]+\.tgz$/.test(pkg.file)) throw new Error('包集合不符');
    const evidence = packageEvidence({ path: join(out, pkg.file), name: pkg.file }, name, version, execute);
    if (pkg.version !== version || pkg.sha256 !== evidence.sha256 || pkg.integrity !== evidence.integrity ||
        JSON.stringify(ordered(pkg.dependencies)) !== JSON.stringify(evidence.dependencies)) throw new Error('包证据不符：' + name);
    return evidence;
  });
  const canonical = { schema, repository, releaseId, sourceSha, releaseSha, workflowSha, runId, runAttempt, version, packages: verified };
  return digest(JSON.stringify(canonical));
}

// 原源码的版本脚本和 Rush 构建复用原锁；受信脚本位于独立检出。
async function main({ phase = process.argv[2], env = process.env, execute = execFileSync, fetchAPI = fetch, wait = ms => new Promise(resolve => setTimeout(resolve, ms)) } = {}) {
  const root = env.SOURCE_DIR, out = env.ARTIFACT_DIR;
  const context = { schema: 1, repository: 'VisActor/VTable', releaseId: env.RELEASE_ID, sourceSha: env.SOURCE_SHA,
    workflowSha: env.WORKFLOW_SHA, runId: Number(env.GITHUB_RUN_ID), runAttempt: Number(env.GITHUB_RUN_ATTEMPT), version: env.RELEASE_VERSION };
  if (!root || !out || !isAbsolute(root) || !isAbsolute(out) || !relative(root,out).startsWith('../') ||
      env.GITHUB_REPOSITORY !== context.repository || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(context.releaseId) ||
      !sha.test(context.sourceSha) || !sha.test(context.workflowSha) || !Number.isSafeInteger(context.runId) || context.runId < 1 ||
      context.runAttempt !== 1 || !versionPattern.test(context.version) || env.RELEASE_BRANCH !== 'refs/heads/bot-release/' + context.version) throw new Error('发布任务上下文不符');
  const run = (command, args, options = {}) => execute(command, args, { cwd: root, encoding: 'utf8', stdio: 'pipe', ...options });
  if (phase === 'prepare') {
    if (run('git', ['rev-parse', 'HEAD']).trim() !== context.sourceSha || run('git', ['status', '--porcelain']).trim()) throw new Error('冻结源码身份不符或工作区有改动');
    const projects = json(join(root, 'rush.json')).projects;
    const published = projects.filter(p => p.shouldPublish).map(p => ({ name: p.packageName, folder: p.projectFolder })).sort((a, b) => a.name.localeCompare(b.name));
    if (JSON.stringify(published) !== JSON.stringify(expected)) throw new Error('冻结源码的包全集漂移');
    const [base, prerelease] = context.version.split('-');
    run('node', ['common/scripts/apply-release-version.js', prerelease ?? 'none', base], { stdio: 'inherit' });
    const names = new Set(expected.map(p => p.name));
    for (const pkg of expected) {
      const file = join(root, pkg.folder, 'package.json'), data = json(file);
      for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies'])
        for (const name of Object.keys(data[field] ?? {})) if (names.has(name)) data[field][name] = 'workspace:' + context.version;
      writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
    }
    run('node', ['common/scripts/install-run-rush.js', 'update'], { stdio: 'inherit' });
    run('git', ['add', '--', ...projects.map(p => p.projectFolder + '/package.json'), 'common/config/rush/version-policies.json', 'common/config/rush/pnpm-lock.yaml', 'common/config/rush/repo-state.json']);
    run('git', ['-c', 'user.name=visactor-release-bot', '-c', 'user.email=release@users.noreply.github.com', '-c', 'core.hooksPath=/dev/null', 'commit', '-m', 'Prepare ' + context.version + ' [skip ci]']);
    const releaseSha = run('git', ['rev-parse', 'HEAD']).trim();
    run('node', ['common/scripts/install-run-rush.js', 'build', ...expected.flatMap(p => ['--to', p.name])], { stdio: 'inherit' });
    mkdirSync(out, { mode: 0o700 });
    const packages = expected.map(({ name, folder }) => {
      const file = name.slice(1).replace('/', '-') + '-' + context.version + '.tgz';
      run('pnpm', ['pack', '--pack-destination', out], { cwd: join(root, folder), stdio: 'inherit' });
      return packageEvidence({ path: join(out, file), name: file }, name, context.version, execute);
    });
    if (run('git', ['status', '--porcelain']).trim()) throw new Error('打包过程修改了冻结源码元数据');
    const manifest = { ...context, releaseSha, packages };
    const manifestDigest = verifyPak(manifest, out, execute);
    writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { mode: 0o600 });
    // 用命名 HEAD 保留准备提交，冻结源提交作为 bundle 的先决对象。
    run('git', ['bundle', 'create', join(out, 'prepared.bundle'), 'HEAD', '^' + context.sourceSha]);
    return manifestDigest;
  }
  if (!['register', 'publish'].includes(phase)) throw new Error('未知发布阶段');
  if (!context.version.includes('-alpha.')) throw new Error('受管发包当前只开放 Alpha');
  const manifest = json(join(out, 'manifest.json'));
  if (Object.entries(context).some(([key, value]) => manifest[key] !== value)) throw new Error('原包清单与 CI 尝试不符');
  const manifestDigest = verifyPak(manifest, out, execute);
  if (env.ENABLE_MANAGED_PUBLISH !== 'true') throw new Error('尚未启用受管发布写入口');
  if (phase === 'register') {
    run('git', ['-c', 'core.hooksPath=/dev/null', 'fetch', '--no-tags', 'origin', context.sourceSha]);
    run('git', ['bundle', 'verify', join(out, 'prepared.bundle')]);
    run('git', ['-c', 'core.hooksPath=/dev/null', 'fetch', '--no-tags', join(out, 'prepared.bundle'), 'HEAD']);
    if (run('git', ['rev-parse', 'FETCH_HEAD']).trim() !== manifest.releaseSha || run('git', ['rev-parse', manifest.releaseSha + '^']).trim() !== context.sourceSha) throw new Error('准备提交来源不符');
    run('git', ['-c', 'core.hooksPath=/dev/null', 'push', 'origin', manifest.releaseSha + ':refs/heads/bot-prepared/' + context.releaseId]);
    return manifestDigest;
  }
  const appId = Number(env.PERMIT_APP_ID);
  if (!Number.isSafeInteger(appId) || appId < 1 || !env.GH_TOKEN) throw new Error('缺少受管许可身份');
  const readGitHub = async route => {
    const response = await fetchAPI('https://api.github.com/repos/VisActor/VTable/' + route, {
      redirect: 'error', signal: AbortSignal.timeout(15000), headers: { Authorization: 'Bearer ' + env.GH_TOKEN, Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) throw new Error('GitHub 许可回读失败');
    return response.json();
  };
  const deadline = Date.now() + 25 * 60 * 1000;
  let permit;
  while (Date.now() < deadline) {
    const runInfo = await readGitHub('actions/runs/' + manifest.runId);
    if (runInfo.run_attempt !== manifest.runAttempt || runInfo.status !== 'in_progress') throw new Error('原 CI 尝试已变化');
    const checks = await readGitHub('commits/' + manifest.releaseSha + '/check-runs?check_name=visactor-release-permit&filter=all&per_page=100');
    if (!Array.isArray(checks.check_runs) || checks.total_count !== checks.check_runs.length) throw new Error('许可列表不完整');
    const valid = checks.check_runs.map(check => checkedPermit(check, context, manifest, manifestDigest, appId)).filter(Boolean);
    if (valid.length > 1) throw new Error('存在多个有效许可');
    if (valid.length === 1) { permit = valid[0]; break; }
    await wait(15000);
  }
  if (!permit) throw new Error('等待原许可超时');
  // 回读公开 registry 的精确版本，冲突或无法确认时停止后续包。
  const published = async pkg => {
    const url = registry + '/' + encodeURIComponent(pkg.name) + '/' + encodeURIComponent(pkg.version);
    const response = await fetchAPI(url, { redirect: 'error', signal: AbortSignal.timeout(15000), headers: { 'cache-control': 'no-cache' } });
    if (response.ok) {
      const entry = await response.json();
      if (entry.name !== pkg.name || entry.version !== pkg.version || entry.dist?.integrity !== pkg.integrity) throw new Error('npm 版本字节冲突：' + pkg.name);
      return true;
    }
    await response.body?.cancel();
    if (response.status !== 404) throw new Error('npm 读回失败：' + pkg.name);
    return false;
  };
  // npm 未返回时先等待精确版本可见，只有连续未找到才用相同包补一次。
  const publishMissing = async pkg => {
    if (await published(pkg)) return;
    const path = join(out, pkg.file);
    for (let attempt = 0; attempt < 2; attempt++) {
      if (Date.now() >= permit.expiresAt) throw new Error('原发包许可已过期');
      if (digest(readFileSync(path)) !== pkg.sha256) throw new Error('原包字节变化');
      let publishFailed = false;
      try {
        run('npm', ['publish', path, '--ignore-scripts', '--access', 'public', '--registry=' + registry, '--tag', 'alpha', '--fetch-retries=0', '--fetch-timeout=30000'], { stdio: 'inherit', timeout: 60000 });
      } catch { publishFailed = true; }
      for (const delay of [0, 2000, 6000]) {
        if (delay) await wait(delay);
        if (await published(pkg)) return;
      }
      if (!publishFailed) break;
    }
    throw new Error('npm 发布结果未确认：' + pkg.name);
  };
  for (const pkg of manifest.packages) await publishMissing(pkg);
  return manifestDigest;
}

// 许可只有在预期 App、任务、run/attempt 与原包摘要全部匹配时可用。
function checkedPermit(check, context, manifest, manifestDigest, appId) {
  if (check.app?.id !== appId || check.name !== 'visactor-release-permit' || check.head_sha !== manifest.releaseSha ||
      check.status !== 'completed' || check.conclusion !== 'success') return null;
  let permit;
  try { permit = JSON.parse(check.output.summary); } catch { return null; }
  const { schema, releaseId, sourceSha, releaseSha, runId, runAttempt, manifestDigest: recorded, gateDigest, baselineDigest } = permit ?? {};
  if (schema !== 1 || releaseId !== context.releaseId || sourceSha !== context.sourceSha || releaseSha !== manifest.releaseSha ||
      runId !== context.runId || runAttempt !== context.runAttempt || recorded !== manifestDigest || permit.appId !== appId ||
      ![gateDigest, baselineDigest].every(value => /^[a-f0-9]{64}$/.test(value)) || !Number.isSafeInteger(permit.issuedAt) ||
      permit.issuedAt > Date.now() || permit.expiresAt !== permit.issuedAt + 300000 || permit.expiresAt <= Date.now()) return null;
  const binding = { schema, releaseId, sourceSha, releaseSha, runId, runAttempt, manifestDigest: recorded, gateDigest, baselineDigest };
  return check.external_id === digest(JSON.stringify(binding)) ? permit : null;
}

module.exports = { main, verifyPak };
if (require.main === module) main().then(value => console.log(value), error => { console.error(error.message); process.exitCode = 1; });
