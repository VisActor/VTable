import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import { canonical, dispatchReceipt } from './flow-ci-dispatch.mjs';

const policy = JSON.parse(await fs.readFile(new URL('../config/flow-ci.json', import.meta.url), 'utf8'));
const request = { schemaVersion: 1, kind: 'ci_request', requestId: 'a'.repeat(64), repository: policy.repository, pullRequest: 1,
  headSha: 'b'.repeat(40), baseSha: 'c'.repeat(40), controlCommit: 'd'.repeat(40), policyDigest: 'e'.repeat(64), dependencyDigest: 'f'.repeat(64) };
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const env = { GITHUB_EVENT_NAME: 'workflow_dispatch', GITHUB_REPOSITORY: policy.repository, GITHUB_REF: 'refs/heads/develop',
  GITHUB_SHA: request.controlCommit, GITHUB_RUN_ATTEMPT: '1', GITHUB_RUN_ID: '123' };

test('仅受理固定默认分支和精确输入，不宣称执行了测试', () => {
  const result = dispatchReceipt(JSON.stringify(request), hash(request), policy, env);
  assert.equal(result.testsExecuted, false); assert.equal(result.requestDigest, hash(request));
  assert.equal(result.workflowRunId, '123'); assert.deepEqual(result.request, request);
});

for (const change of [{ GITHUB_EVENT_NAME: 'pull_request_target' }, { GITHUB_EVENT_NAME: 'pull_request' },
  { GITHUB_REF: 'refs/pull/1/merge' }, { GITHUB_REF: 'refs/heads/untrusted' }, { GITHUB_REPOSITORY: 'fork/repository' },
  { GITHUB_SHA: '0'.repeat(40) }, { GITHUB_RUN_ATTEMPT: '2' }, { GITHUB_RUN_ID: '0' }]) test('拒绝不可信运行上下文 ' + JSON.stringify(change), () => {
  assert.throws(() => dispatchReceipt(JSON.stringify(request), hash(request), policy, { ...env, ...change }));
});

for (const change of [{ pullRequest: 0 }, { repository: 'fork/repository' }, { headSha: 'main' }, { extra: true },
  { policyDigest: null }, { dependencyDigest: 'x' }, { kind: 'test_result' }]) test('拒绝未绑定输入 ' + JSON.stringify(change), () => {
  const value = { ...request, ...change }; assert.throws(() => dispatchReceipt(JSON.stringify(value), hash(value), policy, env));
});

test('摘要变化和超限输入不能复用受理记录', () => {
  assert.throws(() => dispatchReceipt(JSON.stringify({ ...request, headSha: '0'.repeat(40) }), hash(request), policy, env));
  assert.throws(() => dispatchReceipt(' '.repeat(4097), hash(request), policy, env));
});


test('固定单测清单覆盖当前所有产品包，不因默认分支新增包而漏测', async () => {
  const root = new URL('../../packages/', import.meta.url); const expected = [];
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    try { const pkg = JSON.parse(await fs.readFile(new URL(name + '/package.json', root), 'utf8')); if (pkg.scripts?.test) expected.push(name); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  assert.deepEqual([...policy.unitPackages].sort(), expected.sort());
});
