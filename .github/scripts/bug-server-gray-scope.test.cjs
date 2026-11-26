const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const source = fs.readFileSync(path.join(__dirname, '../workflows/bug-server.yml'), 'utf8');
const gate = /  gray-scope:\n([\s\S]*?)\n  build:/.exec(source)?.[1];
assert(gate, '缺少独立交接 job');
assert.match(gate, /permissions: \{\}/);
assert.doesNotMatch(gate, /uses:|checkout/);
assert.match(source, /  build:\n    needs: gray-scope\n    if: (?:>-\n      )?needs.gray-scope.outputs.skip != 'true'/);
const script = /        run: \|\n([\s\S]*)/.exec(gate)[1].replace(/^          /gm, '');
const repository = 'VisActor/VTable';
const original = { EVENT_NAME:'pull_request', HEAD_REF:'fix/normal', HEAD_REPOSITORY:repository, BASE_REPOSITORY:repository,
  BASE_REF:'develop', REPOSITORY:repository, HEAD_REPOSITORY_ID:'123', BASE_REPOSITORY_ID:'123', CREATED_AT:'2026-10-29T08:00:01Z', INTERNAL_SINCE:'' };
const cutoff = String(Date.parse('2026-10-29T08:00:00Z'));

// 直接执行 workflow 的真实 Bash/Python，临时输出在每次调用后回收。
function runGate(env) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'photo-ci-handoff-'));
  try {
    const output = path.join(directory,'output'); fs.writeFileSync(output,'');
    const result = spawnSync('/bin/bash',['--noprofile','--norc','-e','-c',script],{encoding:'utf8',timeout:10000,env:{PATH:'/usr/bin:/bin',...original,...env,GITHUB_OUTPUT:output}});
    return { status:result.status, output:fs.readFileSync(output,'utf8'), stderr:result.stderr };
  } finally { fs.rmSync(directory,{recursive:true,force:true}); }
}

test('仅新内部 PR 交接；起点未配置、历史、fork、push 和人工入口保持旧流程', () => {
  for (const [env,skip] of [
    [{},false], [{INTERNAL_SINCE:cutoff},true],
    ...['main','dev/test','Develop',''].map(BASE_REF => [{INTERNAL_SINCE:cutoff,BASE_REF},false]),
    [{INTERNAL_SINCE:cutoff,CREATED_AT:'2026-10-29T08:00:00Z'},false],
    [{INTERNAL_SINCE:cutoff,CREATED_AT:'2026-10-29T07:59:59Z'},false],
    [{INTERNAL_SINCE:cutoff,DRAFT:'true'},true],
    [{INTERNAL_SINCE:cutoff,HEAD_REPOSITORY:'contributor/repo'},false],
    [{INTERNAL_SINCE:cutoff,HEAD_REPOSITORY:repository.toUpperCase()},false],
    [{INTERNAL_SINCE:cutoff,BASE_REPOSITORY:'contributor/repo'},false],
    [{INTERNAL_SINCE:cutoff,REPOSITORY:'contributor/repo'},false],
    [{INTERNAL_SINCE:'invalid',EVENT_NAME:'push'},false],
    [{INTERNAL_SINCE:'invalid',EVENT_NAME:'workflow_dispatch'},false],
    [{HEAD_REF:'codex/workflow-cn-acceptance-20261028'},true],
    [{HEAD_REF:'Codex/workflow-cn-acceptance-20261028'},false],
    [{HEAD_REF:'CODEX/WORKFLOW-CN-ACCEPTANCE-20261028'},false],
    [{HEAD_REF:'codex/workflow-cn-acceptance-20261028',HEAD_REPOSITORY:'contributor/repo'},false],
    [{EVENT_NAME:'push',HEAD_REF:'codex/workflow-cn-acceptance-20261028'},false],
  ]) {
    const result=runGate(env); assert.equal(result.status,0,result.stderr); assert.equal(result.output,`skip=${skip}\n`);
  }
});

test('已配置内部交接却元数据或起点非法时停止旧构建，避免重复派发', () => {
  for (const env of [
    {INTERNAL_SINCE:'invalid'}, {INTERNAL_SINCE:'0'}, {INTERNAL_SINCE:'8640000000000001'},
    {INTERNAL_SINCE:'1e12'}, {INTERNAL_SINCE:'1793257200000;echo injected'},
    {HEAD_REPOSITORY_ID:'124'}, {BASE_REPOSITORY_ID:'0',HEAD_REPOSITORY_ID:'0'},
    {CREATED_AT:''}, {CREATED_AT:'2026-02-30T08:00:00Z'}, {CREATED_AT:'2026-10-29T08:00:01'},
    {CREATED_AT:'2026-10-29T08:00:01+00:00'},
  ]) { const result=runGate({INTERNAL_SINCE:cutoff,...env}); assert.notEqual(result.status,0); assert.equal(result.output,''); }
});

test('外部灰度仅交接指定源仓、目标和起点以后的 PR', () => {
  const fork = { HEAD_REPOSITORY: 'contributor/VTable', BASE_REPOSITORY_ID: '649609017',
    HEAD_REPOSITORY_ID: '42', FORK_SOURCE_ID: '42', FORK_SINCE: cutoff };
  for (const [change, expected] of [[{},true], [{FORK_SINCE:''},false], [{FORK_SOURCE_ID:'99'},false],
    [{BASE_REF:'main'},false], [{BASE_REPOSITORY_ID:'123'},false], [{CREATED_AT:'2026-10-29T08:00:00Z'},false]]) {
    const result = runGate({...fork, ...change});
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.output, `skip=${expected}\n`);
  }
});

test('受信派发先核对 PR 源仓、打开状态、工作流 SHA 和候选 SHA', () => {
  const yaml = fs.readFileSync(path.join(__dirname, '../workflows/fork-unit.yml'), 'utf8');
  const verify = /      - name: Verify frozen pull request[\s\S]*?        run: \|\n([\s\S]*?)\n      - name: Checkout/.exec(yaml)[1].replace(/^          /gm, '');
  const head = 'a'.repeat(40), base = 'b'.repeat(40);
  const row = { state: 'open', draft: false, base: { repo: { id: 649609017 }, ref: 'develop', sha: base },
    head: { repo: { fork: true, id: 42 }, sha: head } };
  const env = { PATH: process.env.PATH, REQUEST: '42ac59f4-d228-4d63-a793-385e1002414e', PR:'27',
    SOURCE:'42', HEAD_SHA:head, BASE_SHA:base, GITHUB_SHA:base };
  for (const [input, overrides, ok] of [[row,{},true], [row,{SOURCE:'43'},false], [row,{GITHUB_SHA:head},false],
    [{...row,draft:true},{},false], [{...row,state:'closed'},{},false], [row,{HEAD_SHA:base},false]]) {
    const result = spawnSync('bash', ['-e', '-c', 'gh() { cat; }\n' + verify], { env:{...env,...overrides}, input:JSON.stringify(input) });
    assert.equal(result.status === 0, ok, String(result.stderr));
  }
});
