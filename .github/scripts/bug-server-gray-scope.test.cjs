const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// 执行 workflow 的真实 Bash 校验，不用 JavaScript 模拟 Actions 的字符串语义。
test('旧 BugServer CI 只跳过本仓指定分支，大小写变体和 fork 不扩大范围', () => {
  const source = fs.readFileSync(path.join(__dirname, '../workflows/bug-server.yml'), 'utf8');
  const gate = /  gray-scope:\n([\s\S]*?)\n  build:/.exec(source)?.[1];
  assert(gate, '缺少独立分支核验 job');
  assert.match(gate, /permissions: \{\}/);
  assert.doesNotMatch(gate, /uses:|checkout/);
  assert.match(source, /  build:\n    needs: gray-scope\n    if: (?:>-\n      )?needs.gray-scope.outputs.skip != 'true'/);
  const run = /        run: \|\n([\s\S]*)/.exec(gate)?.[1];
  assert(run, '缺少真实核验脚本');
  const script = run.replace(/^          /gm, '');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'bug-server-gray-'));
  try {
    const check = (event, branch, repository) => {
      const output = path.join(directory, 'output'); fs.writeFileSync(output, '');
      const result = spawnSync('/bin/bash', ['--noprofile','--norc','-e','-c',script], {encoding:'utf8',env:{PATH:'/usr/bin:/bin',GITHUB_OUTPUT:output,EVENT_NAME:event,HEAD_REF:branch,HEAD_REPOSITORY:repository,REPOSITORY:'VisActor/VTable'}});
      assert.equal(result.status, 0, result.stderr);
      return fs.readFileSync(output, 'utf8');
    };
    assert.equal(check('pull_request','codex/workflow-gray-readiness-20261028','VisActor/VTable'),'skip=true\n');
    for (const branch of ['Codex/workflow-gray-readiness-20261028','codex/Workflow-gray-readiness-20261028','fix/real-change'])
      assert.equal(check('pull_request',branch,'VisActor/VTable'),'skip=false\n');
    assert.equal(check('pull_request','codex/workflow-gray-readiness-20261028','contributor/VTable'),'skip=false\n');
    assert.equal(check('push','','VisActor/VTable'),'skip=false\n');
    assert.equal(check('workflow_dispatch','','VisActor/VTable'),'skip=false\n');
  } finally { fs.rmSync(directory,{recursive:true,force:true}); }
});
