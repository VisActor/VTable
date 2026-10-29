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
  REPOSITORY:repository, HEAD_REPOSITORY_ID:'123', BASE_REPOSITORY_ID:'123', CREATED_AT:'2026-10-29T08:00:01Z', INTERNAL_SINCE:'' };
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
