import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileManifest, digest, atomicJson } from './visual/runtime.mjs';
import { stageIdentity, captureError, readStage, runStage } from './visual/stage.mjs';
import { parseOptions } from './visual-test.mjs';
const request = { schemaVersion: 1, stage: 'build', side: 'baseline', identity: { repository: 'VisActor/VTable', headSha: 'a'.repeat(40), baseSha: 'b'.repeat(40) }, suiteDigest: 'c'.repeat(64), environmentDigest: 'd'.repeat(64), dependencyDigests: { baseline: 'e'.repeat(64), current: 'f'.repeat(64) } };
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

test('静态全量清单绑定实际元数据及完整ID集合，宿主无需执行模块', async () => {
 const source = new URL('../__tests__/visual/cases/index.mjs', import.meta.url), file = new URL('../__tests__/visual/cases/manifest.json', import.meta.url);
 const manifest = JSON.parse(await fs.readFile(file, 'utf8')), { cases } = await import(source);
 assert.equal(manifest.indexDigest, createHash('sha256').update(await fs.readFile(source)).digest('hex')); assert.deepEqual(manifest.ids, cases.map(item => item.id));
});

// 使用完整身份和真实文件摘要，复现上游退出失败及JSON键顺序变化。
test('阶段交接按对象值绑定身份，失败构建不得被采集消费', async () => {
 const dir = await fs.mkdtemp(path.join(tmpdir(), 'visual-stage-input-'));
 try {
  const binding = stageIdentity(request);
  await atomicJson(path.join(dir, 'stage.json'), { schemaVersion: 1, stage: 'build', side: 'baseline', admissionEvidence: false, binding, code: 0, issues: [], files: [] });
  const reordered = { ...request, identity: { baseSha: request.identity.baseSha, headSha: request.identity.headSha, repository: request.identity.repository }, dependencyDigests: { current: request.dependencyDigests.current, baseline: request.dependencyDigests.baseline } };
  await readStage(dir, reordered, 'build', 'baseline');
  await assert.rejects(() => readStage(dir, { ...request, identity: { ...request.identity, headSha: '9'.repeat(40) } }, 'build', 'baseline'), { code: 'STAGE_IDENTITY_INVALID' });
  for (const failed of [{ code: 2, issues: [] }, { code: 0, issues: [{ code: 'CLEANUP_FAILED', message: 'cleanup failed' }] }]) {
   const manifest = JSON.parse(await fs.readFile(path.join(dir, 'stage.json')));
   await atomicJson(path.join(dir, 'stage.json'), { ...manifest, ...failed });
   await assert.rejects(() => readStage(dir, request, 'build', 'baseline'), { code: 'EXECUTION_FAILED' });
  }
 } finally { await fs.rm(dir, { recursive: true, force: true }); }
});

// 启动真实子进程写reporter结果，覆盖runStage到最终报告；不依赖浏览器或SDK构建。
test('比较汇总保留上游失败并核对进程终态，只有真实差异和基线业务失败可继续', async t => {
 const dir = await fs.mkdtemp(path.join(tmpdir(), 'visual-stage-report-'));
 const source = path.join(dir, 'source'), suite = path.join(source, 'packages/vtable/__tests__/visual');
 const cli = path.join(source, 'packages/vtable/node_modules/@playwright/test');
 const git = args => execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], { cwd: source, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 'fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' } }).trim();
 try {
  await fs.mkdir(path.join(suite, 'cases'), { recursive: true });
  await fs.writeFile(path.join(source, '.gitignore'), 'node_modules/\n');
  const index = "export const cases = [{ id: 'one', purpose: 'fixture', file: './one.mjs', bundles: ['vtable'] }]; export const loadCase = () => import('./one.mjs');";
  await fs.writeFile(path.join(suite, 'cases/index.mjs'), index);
  await fs.writeFile(path.join(suite, 'cases/one.mjs'), 'export function mount() {} export function createSpec() {} export function verify() {}');
  await atomicJson(path.join(suite, 'cases/manifest.json'), { schemaVersion: 1, indexDigest: digest(index), ids: ['one'] });
  await fs.writeFile(path.join(suite, 'settings.mjs'), 'export const settings = { comparison: { threshold: 0.1, maxDiffPixels: 0 } };');
  await fs.writeFile(path.join(suite, 'playwright.config.mjs'), "export default { testMatch: 'visual.spec.mjs' };");
  for (const name of ['capture.spec.mjs', 'compare.spec.mjs']) await fs.writeFile(path.join(suite, name), '');
  git(['init', '-q']); git(['add', '.']); git(['commit', '-qm', 'fixture']);
  const commit = git(['rev-parse', 'HEAD']);
  await fs.mkdir(cli, { recursive: true });
  await atomicJson(path.join(cli, 'package.json'), { exports: { './cli': './cli.cjs' } });
  const input = { ...request, stage: 'compare', side: null, identity: { ...request.identity, headSha: commit, baseSha: commit }, sourceRoot: source, suiteRoot: source, suiteDigest: digest(JSON.stringify(await fileManifest(suite))), inputs: { baseline: path.join(dir, 'baseline'), current: path.join(dir, 'current') } };
  const passed = { finalized: true, endedStatus: 'passed', status: 'passed', errors: [], tests: [{ id: 'one', status: 'passed', errors: [], durationMs: 1, attachments: [{ name: 'rendered', path: 'one.png' }] }] };
  const business = { ...passed, endedStatus: 'failed', status: 'error', tests: [{ id: 'one', status: 'error', businessAssertion: true, code: 'CASE_ASSERTION_FAILED', errors: ['business assertion'], attachments: [], durationMs: 1 }] };
  const scenarios = [
   { name: 'normal', expected: 'passed' },
   { name: 'baseline-cleanup', side: 'baseline', stageCode: 2, issues: [{ code: 'CLEANUP_FAILED', message: 'cleanup failed' }], expected: 'error' },
   { name: 'current-process', side: 'current', stageCode: 2, expected: 'error' },
   { name: 'issues-with-zero-code', side: 'current', issues: [{ code: 'CLEANUP_FAILED', message: 'cleanup failed' }], expected: 'error' },
   { name: 'compare-failed-passed-tests', exit: 1, endedStatus: 'failed', expected: 'error' },
   { name: 'compare-exit-two', exit: 2, expected: 'error' },
   { name: 'compare-zero-failed', endedStatus: 'failed', expected: 'error' },
   { name: 'compare-claimed-diff', exit: 1, endedStatus: 'failed', reportedStatus: 'diff', expected: 'error' },
   { name: 'compare-hidden-diff', status: 'diff', reportedStatus: 'passed', expected: 'error' },
   { name: 'compare-diff', exit: 1, endedStatus: 'failed', status: 'diff', expected: 'diff' },
   { name: 'baseline-business', businessSide: 'baseline', expected: 'diff', caseStatus: 'new_baseline' },
   { name: 'current-business', businessSide: 'current', side: 'current', stageCode: 2, expected: 'error' },
   { name: 'baseline-runtime', businessSide: 'baseline', side: 'baseline', stageCode: 2, ordinary: true, expected: 'error' }
  ];
  for (const scenario of scenarios) await t.test(scenario.name, async () => {
   for (const side of ['baseline', 'current']) {
    const directory = input.inputs[side]; await fs.mkdir(directory, { recursive: true });
    const result = structuredClone(scenario.businessSide === side ? business : passed);
    if (scenario.ordinary && scenario.businessSide === side) result.tests[0].code = 'RENDER_FAILED';
    await fs.writeFile(path.join(directory, 'one.png'), 'fixture');
    await atomicJson(path.join(directory, side + '-result.json'), result);
    const files = (await fileManifest(directory)).filter(file => file.path !== 'stage.json');
    await atomicJson(path.join(directory, 'stage.json'), { schemaVersion: 1, stage: 'capture', side, admissionEvidence: false, binding: stageIdentity(input), code: scenario.side === side ? scenario.stageCode ?? 0 : 0, issues: scenario.side === side ? scenario.issues ?? [] : [], files });
   }
   const compared = { ...passed, endedStatus: scenario.endedStatus ?? 'passed', status: scenario.reportedStatus ?? scenario.status ?? 'passed', tests: [{ ...passed.tests[0], status: scenario.status ?? 'passed', attachments: scenario.status === 'diff' ? [{ name: 'one-diff.png', path: 'diff.png' }] : [] }] };
   await fs.writeFile(path.join(cli, 'cli.cjs'), `const fs = require('node:fs'), path = require('node:path'); fs.writeFileSync(path.join(process.env.VISUAL_RUN_DIR, 'current-result.json'), ${JSON.stringify(JSON.stringify(compared))}); fs.writeFileSync(path.join(process.env.VISUAL_RUN_DIR, 'diff.png'), 'fixture'); process.exitCode = ${scenario.exit ?? 0};`);
   const output = path.join(dir, scenario.name);
   const manifest = await runStage({ ...input, output });
   const summary = JSON.parse(await fs.readFile(path.join(output, 'summary.json')));
   assert.equal(summary.status, scenario.expected);
   assert.equal(manifest.code, scenario.expected === 'passed' ? 0 : scenario.expected === 'diff' ? 1 : 2);
   if (scenario.caseStatus) assert.equal(summary.cases[0].status, scenario.caseStatus);
   if (scenario.expected === 'error') assert(summary.issues.some(issue => issue.code === 'EXECUTION_FAILED'));
  });
 } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
