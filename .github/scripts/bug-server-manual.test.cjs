const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtemp, readFile, rm, mkdir, writeFile, symlink, realpath } = require('node:fs/promises');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const { execFileSync } = require('node:child_process');
const { context, run } = require('./bug-server-manual.cjs');

const taskId = '10000000-0000-4000-8000-000000000001';
const env = { GITHUB_REPOSITORY: 'VisActor/VChart', GITHUB_RUN_ID: '99', TASK_ID: taskId, BUG_SERVER_TOKEN: 'test-project-token', GH_TOKEN: 'test-github-token' };

test('控制脚本拒绝任意仓库、入口、任务编号和 run ID', () => {
  for (const patch of [{ GITHUB_REPOSITORY: 'evil/VChart' }, { TASK_ID: `${taskId}\nreused=true` },
    { GITHUB_RUN_ID: '0' }, { BUG_SERVER_TOKEN: '' }, { BUG_SERVER_HOST: 'https://evil.example' }]) assert.throws(() => context({ ...env, ...patch }));
});

test('BOE 控制请求只发送到固定 BOE 地址，保留任务与服务 token 校验', async t => {
  const previousFetch = global.fetch;
  t.after(() => { global.fetch = previousFetch; });
  global.fetch = async (url, options) => {
    assert.equal(url, 'https://g20b7465b2.gf-boe.bytedance.net/api/ci/trigger');
    assert.equal(options.redirect, 'error');
    assert.equal(options.body.get('token'), 'test-project-token');
    assert.equal(options.body.get('workflowRunId'), '123');
    return new Response(JSON.stringify({ code: 0, data: {} }));
  };
  await run('complete', { ...env, TASK_ID: undefined, REPORTED_RUN_ID: '123', BUG_SERVER_HOST: 'https://g20b7465b2.gf-boe.bytedance.net' });
  for (const host of ['http://g20b7465b2.gf-boe.bytedance.net', 'https://g20b7465b2.gf-boe.bytedance.net.evil.example', 'https://g20b7465b2.gf-boe.bytedance.net/redirect']) {
    assert.throws(() => context({ ...env, BUG_SERVER_HOST: host }));
  }
});

test('prepare 使用服务端冻结 SHA，下载复用失败会退回构建', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'bugserver-control-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const previousFetch = global.fetch;
  t.after(() => { global.fetch = previousFetch; });
  global.fetch = async (url, options) => {
    if (new URL(url).origin === 'https://api.github.com') return new Response('{}', { status: 404 });
    assert.equal(options.body.get('triggerType'), 'manual-info');
    assert.equal(options.body.get('manualTaskId'), taskId);
    assert.equal(options.body.get('workflowRunId'), '99');
    assert.equal(options.body.get('fileUrl'), null);
    return new Response(JSON.stringify({ code: 0, data: { headSha: 'a'.repeat(40), headRepository: 'contributor/VChart', artifact: { id: 77 } } }));
  };
  await run('prepare', { ...env, RUNNER_TEMP: directory, GITHUB_OUTPUT: join(directory, 'outputs') });
  assert.equal(await readFile(join(directory, 'outputs'), 'utf8'), `head_sha=${'a'.repeat(40)}\nhead_repository=contributor/VChart\nreused=false\n`);
});

test('submit 把可执行 JS 只当作上传数据，沿用 SCM/截图链路并保留差异结论', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'bugserver-control-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const archive = join(directory, 'bundle.zip');
  const content = 'throw new Error("THIS_BUNDLE_MUST_NEVER_EXECUTE");';
  execFileSync('python3', ['-c', 'import sys, zipfile\nwith zipfile.ZipFile(sys.argv[1], "w") as f: f.writestr("index.js", sys.argv[2])', archive, content]);
  const bytes = await readFile(archive);
  const previousFetch = global.fetch;
  t.after(() => { global.fetch = previousFetch; });
  const operations = [];
  global.fetch = async (url, options) => {
    const address = String(url);
    if (new URL(address).origin === 'https://api.github.com') {
      assert.equal(options.headers.Authorization, 'Bearer test-github-token');
      assert.equal(options.redirect, 'manual');
      return new Response(null, { status: 302, headers: { location: 'https://artifact.example/signed.zip' } });
    }
    if (new URL(address).origin === 'https://artifact.example') {
      assert.equal(options.headers, undefined); // 签名 URL 请求不能携带 GitHub token。
      return new Response(bytes);
    }
    assert.equal(options.redirect, 'error');
    const form = options.body, type = form.get('triggerType');
    operations.push(type);
    assert.equal(form.get('token'), 'test-project-token');
    let data;
    if (type === 'manual-artifact') data = { artifact: { id: 77 } };
    if (type === 'upload-file') { assert.equal(await form.get('bundleFile').text(), content); data = { fileUrl: 'https://tos.example/bundle.js' }; }
    if (type === 'scm-build') { assert.equal(form.get('fileUrl'), null); data = { scmVersion: '42' }; }
    if (type === 'scm-version-info') data = { status: 'build_ok' };
    if (type === 'photo-test') data = { bundleId: 'aaaaaaaaaaaaaaaaaaaaaaaa', taskAmount: 1 };
    if (type === 'photo-result') data = { status: 'ok', outcome: 'differences' };
    if (type === 'manual-finish') data = { outcome: 'differences' };
    assert.ok(data, `Unexpected operation ${type}`);
    return new Response(JSON.stringify({ code: 0, data }));
  };
  assert.equal(await run('submit', env), 1);
  assert.deepEqual(operations, ['manual-artifact', 'upload-file', 'scm-build', 'scm-version-info', 'photo-test', 'photo-result', 'manual-finish']);
  assert.ok(!operations.includes('performance-test'));
});

test('独立完成回报只提供源 run ID，不从事件 payload 猜测被测 SHA 或结果', async t => {
  const previousFetch = global.fetch;
  t.after(() => { global.fetch = previousFetch; });
  global.fetch = async (_url, options) => {
    assert.equal(options.body.get('workflowRunId'), '123');
    assert.equal(options.body.get('manualTaskId'), null);
    assert.equal(options.body.get('outcome'), null);
    return new Response(JSON.stringify({ code: 0, data: { outcome: 'cancelled' } }));
  };
  assert.equal(await run('complete', { ...env, TASK_ID: undefined, REPORTED_RUN_ID: '123' }), 0);
});

test('可信上传前检查拒绝文件及父目录符号链接、空文件和超限文件', async t => {
  const directory = await realpath(await mkdtemp(join(tmpdir(), 'bugserver-upload-test-')));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const workflow = await readFile(join(__dirname, __dirname.endsWith('github-manual-pr') ? 'VTable-bug-server-manual.yml' : '../workflows/bug-server-manual.yml'), 'utf8');
  const match = workflow.match(/- name: Verify bundle before upload\n\s+run: \|\n([\s\S]*?)\n\s+- uses:/);
  assert.ok(match, 'Trusted bundle verifier is required');
  const script = match[1].replace(/^ {10}/gm, '');
  const folder = join(directory, 'tools/bugserver-trigger/dist'), bundle = join(folder, 'index.js');
  await mkdir(folder, { recursive: true });
  const verify = () => execFileSync('bash', ['-e', '-c', script], { env: { ...process.env, GITHUB_WORKSPACE: directory }, stdio: 'pipe' });
  await writeFile(bundle, 'valid bundle'); verify();
  await writeFile(bundle, ''); assert.throws(verify);
  execFileSync('python3', ['-c', 'import sys\nwith open(sys.argv[1], "wb") as f: f.truncate(64 * 1024 * 1024 + 1)', bundle]);
  assert.throws(verify);
  await rm(bundle); await writeFile(join(directory, 'private.txt'), 'must not upload');
  await symlink(join(directory, 'private.txt'), bundle); assert.throws(verify);
  await rm(folder, { recursive: true }); await mkdir(join(directory, 'outside'));
  await writeFile(join(directory, 'outside/index.js'), 'must not upload');
  await symlink(join(directory, 'outside'), folder); assert.throws(verify);
});
