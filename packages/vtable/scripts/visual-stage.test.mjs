import test from 'node:test';
import assert from 'node:assert/strict';
import { stageIdentity, captureError } from './visual/stage.mjs';
import { parseOptions } from './visual-test.mjs';
const request = { schemaVersion: 1, stage: 'build', side: 'baseline', identity: { repository: 'VisActor/VTable', headSha: 'a'.repeat(40), baseSha: 'b'.repeat(40) }, suiteDigest: 'c'.repeat(64), environmentDigest: 'd'.repeat(64) };
test('阶段CLI独立使用，旧完整命令保持兼容', () => {
 assert.equal(parseOptions(['--phase','build','--request','input.json']).phase, 'build');
 assert.equal(parseOptions(['--baseline','a'.repeat(40),'--offline']).offline, true);
 for (const args of [['--phase','build'],['--phase','unknown','--request','a'],['--phase','build','--request','a','--offline']]) assert.throws(() => parseOptions(args));
});
test('阶段身份拒绝跨仓、短SHA和缺失环境摘要', () => {
 stageIdentity(request);
 for (const value of [{ ...request, identity: { ...request.identity, repository: 'other/repo' } }, { ...request, environmentDigest: '' }, { ...request, side: 'unknown' }]) assert.throws(() => stageIdentity(value));
});
test('只有基线显式业务断言失败可继续，普通异常及当前失败保留失败', () => {
 const business = { finalized: true, endedStatus: 'failed', status: 'error', errors: [], tests: [{ status: 'error', businessAssertion: true, code: 'CASE_ASSERTION_FAILED' }] };
 assert.equal(captureError(business, 'baseline'), false);
 assert.equal(captureError(business, 'current'), true);
 assert.equal(captureError({ ...business, tests: [{ status: 'error', code: 'RENDER_FAILED' }] }, 'baseline'), true);
 assert.equal(captureError({ ...business, finalized: false }, 'baseline'), true);
});
