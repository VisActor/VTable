import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/** 固定键顺序；派发摘要绑定完整输入，不依赖作者提供的展示标题。 */
export function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}

/** 默认分支只确认受理身份；候选源码、构建及测试由无凭据隔离侧执行。 */
export function dispatchReceipt(text, expectedDigest, policy, env) {
  if (typeof text !== 'string' || Buffer.byteLength(text) > 4096) throw new Error('派发输入超限');
  const request = JSON.parse(text);
  const keys = ['schemaVersion', 'kind', 'requestId', 'repository', 'pullRequest', 'headSha', 'baseSha', 'controlCommit', 'policyDigest', 'dependencyDigest'];
  const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
  const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
  if (!request || Array.isArray(request) || Object.keys(request).sort().join() !== keys.sort().join() ||
      request.schemaVersion !== 1 || request.kind !== 'ci_request' || !hash(request.requestId) ||
      request.repository !== policy.repository || !Number.isSafeInteger(request.pullRequest) || request.pullRequest < 1 ||
      ![request.headSha, request.baseSha, request.controlCommit].every(sha) || ![request.policyDigest, request.dependencyDigest, expectedDigest].every(hash)) throw new Error('派发身份非法');
  const requestDigest = createHash('sha256').update(JSON.stringify(canonical(request))).digest('hex');
  if (requestDigest !== expectedDigest || env.GITHUB_EVENT_NAME !== 'workflow_dispatch' ||
      env.GITHUB_REPOSITORY !== policy.repository || env.GITHUB_REF !== 'refs/heads/' + policy.baseRef ||
      env.GITHUB_SHA !== request.controlCommit || env.GITHUB_RUN_ATTEMPT !== '1' || !/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID ?? '')) throw new Error('派发不是当前可信默认分支的首次运行');
  return { schemaVersion: 1, kind: 'ci_dispatch_receipt', requestDigest, request, workflowRunId: env.GITHUB_RUN_ID,
    controlCommit: env.GITHUB_SHA, testsExecuted: false };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const policy = JSON.parse(await fs.readFile(new URL('../config/flow-ci.json', import.meta.url), 'utf8'));
  console.log(JSON.stringify(dispatchReceipt(process.env.FLOW_CI_REQUEST, process.env.FLOW_CI_REQUEST_DIGEST, policy, process.env)));
}
