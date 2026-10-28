const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { runInNewContext } = require('node:vm');

// 直接核对真实 workflow 表达式，专用分支不能让 fork 同名分支扩大跳过范围。
test('旧 BugServer CI 仅对本仓灰度准备 PR 暂停', () => {
  const source = fs.readFileSync(path.join(__dirname, '../workflows/bug-server.yml'), 'utf8');
  const clause = /    if: (?:>-\n([\s\S]*?)(?=    runs-on:)|([^\n]+))/.exec(source);
  assert(clause, '缺少明确的 CI 触发条件');
  const expression = (clause[1] || clause[2]).trim();
  const check = (event, branch, repository) => runInNewContext(expression, { github: {
    event_name: event, head_ref: branch, repository: 'VisActor/VTable',
    event: { pull_request: { head: { repo: { full_name: repository } } } }
  } }, { timeout: 1000 });
  assert.equal(check('pull_request', 'codex/workflow-gray-readiness-20261028', 'VisActor/VTable'), false);
  assert.equal(check('pull_request', 'fix/real-change', 'VisActor/VTable'), true);
  assert.equal(check('pull_request', 'codex/workflow-gray-readiness-20261028', 'contributor/VTable'), true);
  assert.equal(check('pull_request', 'fix/real-change', 'contributor/VTable'), true);
  assert.equal(check('push', '', 'VisActor/VTable'), true);
  assert.equal(check('workflow_dispatch', '', 'VisActor/VTable'), true);
});
