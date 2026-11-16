const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { basename, join } = require('node:path');
const { main, verifyPak } = require('./release-managed.cjs');
const expected = require('./release-packages.json');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

// CI 契约测试可回读这次真实产物，常规回归用本地无依赖 tarball。
test('只使用原包，npm 响应丢失后跳过已确认的版本', async t => {
  const root = mkdtempSync(join(tmpdir(), 'release-managed-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const out = join(root, 'artifacts'), source = join(root, 'source');
  mkdirSync(source);
  const original = process.env.RELEASE_INTEGRATION_ARTIFACTS;
  let manifest;
  if (original) {
    cpSync(original, out, { recursive: true });
    manifest = JSON.parse(readFileSync(join(out, 'manifest.json')));
  } else {
    mkdirSync(out);
    mkdirSync(join(source, 'package'));
    const version = '0.0.0-alpha.543';
    const packages = expected.map(({ name }) => {
      writeFileSync(join(source, 'package/package.json'), JSON.stringify({ name, version }));
      const file = name.slice(1).replace('/', '-') + '.tgz';
      execFileSync('tar', ['-czf', join(out, file), 'package'], { cwd: source });
      const bytes = readFileSync(join(out, file));
      return { name, version, file, sha256: sha(bytes), integrity: 'sha512-' + createHash('sha512').update(bytes).digest('base64'), dependencies: {} };
    });
    manifest = { schema: 1, repository: 'VisActor/VTable', releaseId: '7744ea28-ae15-4433-8e51-51eca9a31217',
      sourceSha: 'a'.repeat(40), releaseSha: 'b'.repeat(40), workflowSha: 'c'.repeat(40), runId: 543001, runAttempt: 1, version, packages };
    writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest));
  }
  const manifestDigest = verifyPak(manifest, out);
  const { schema, repository, releaseId, sourceSha, releaseSha, workflowSha, runId, runAttempt, version, packages } = manifest;
  const binding = { schema, releaseId, sourceSha, releaseSha, runId, runAttempt, manifestDigest, gateDigest: 'd'.repeat(64), baselineDigest: 'e'.repeat(64) };
  const issuedAt = Date.now();
  const check = { name: 'visactor-release-permit', head_sha: releaseSha, status: 'completed', conclusion: 'success',
    app: { id: 42 }, external_id: sha(JSON.stringify(binding)), output: { summary: JSON.stringify({ ...binding, appId: 42, issuedAt, expiresAt: issuedAt + 300000 }) } };
  const env = { SOURCE_DIR: source, ARTIFACT_DIR: out, RELEASE_ID: releaseId, SOURCE_SHA: sourceSha, WORKFLOW_SHA: workflowSha,
    GITHUB_REPOSITORY: repository, GITHUB_RUN_ID: String(runId), GITHUB_RUN_ATTEMPT: String(runAttempt), RELEASE_VERSION: version,
    RELEASE_BRANCH: 'refs/heads/bot-release/' + version, ENABLE_MANAGED_PUBLISH: 'true', PERMIT_APP_ID: '42', GH_TOKEN: 'fixture' };
  const registry = new Map(), posted = [];
  const record = p => registry.set(p.name, { name: p.name, version: p.version, dist: { integrity: p.integrity } });
  record(packages[0]);
  let lost = true, attempt = runAttempt;
  const options = { phase: 'publish', env,
    execute(command, args, options) {
      if (command === 'tar') return execFileSync(command, args, options);
      assert.equal(command, 'npm');
      assert.deepEqual(args.slice(2), ['--ignore-scripts','--access','public','--registry=https://registry.npmjs.org','--tag','alpha']);
      const pkg = packages.find(p => p.file === basename(args[1]));
      assert.equal(sha(readFileSync(args[1])), pkg.sha256);
      assert.equal(registry.has(pkg.name), false);
      posted.push(pkg.name);
      record(pkg);
      if (lost) { lost = false; throw new Error('失去 npm 受理响应'); }
      return '';
    },
    async fetchAPI(address, options) {
      const url = new URL(address);
      if (url.origin === 'https://registry.npmjs.org') {
        assert.equal(options.headers, undefined);
        const pkg = registry.get(decodeURIComponent(url.pathname.split('/')[1]));
        return pkg ? Response.json(pkg) : new Response(null, { status: 404 });
      }
      assert.equal(url.origin, 'https://api.github.com');
      return Response.json(address.includes('check-runs?') ? { total_count: 1, check_runs: [check] } : { run_attempt: attempt, status: 'in_progress' });
    }
  };
  await assert.rejects(main({ ...options, env: { ...env, ENABLE_MANAGED_PUBLISH: 'false' } }), /未启用/);
  await assert.rejects(main(options), /失去 npm 受理响应/);
  assert.equal(posted.length, 1);
  assert.equal(await main(options), manifestDigest);
  assert.deepEqual(posted, packages.slice(1).map(p => p.name));
  assert.equal(registry.size, expected.length);
  const first = packages[0];
  registry.set(first.name, { ...registry.get(first.name), dist: { integrity: 'wrong' } });
  await assert.rejects(main(options), /字节冲突/);
  attempt++;
  await assert.rejects(main(options), /原 CI 尝试已变化/);
  const archive = join(out, first.file);
  const tampered = readFileSync(archive);
  // 修改 gzip 时间戳，让归档仍可读，直接验证字节摘要拒绝。
  tampered[4] ^= 1;
  writeFileSync(archive, tampered);
  assert.throws(() => verifyPak(manifest, out), /包证据不符/);
  if (original) t.diagnostic(JSON.stringify({ manifestDigest, verifiedPackages: expected.length, simulatedAccepted: posted.length,
    simulatedDuplicates: posted.length - new Set(posted).size, realNpmWrites: 0 }));
});
