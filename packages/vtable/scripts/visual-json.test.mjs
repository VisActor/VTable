import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parseOptions } from './visual-test.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const packageDir = path.join(root, 'packages/vtable');

test('JSON output belongs only to the local comparison command', () => {
  // 机器输出不能与已有导出、候选、列举或单独环境预检协议混用。
  assert.equal(parseOptions(['--json', '--self-compare']).json, true);
  for (const args of [
    ['--json', '--list'],
    ['--json', '--check'],
    ['--json', '--export-suite', '/tmp/suite'],
    ['--json', '--run-suite', '/tmp/suite']
  ])
    assert.throws(() => parseOptions(args), { code: 'INVALID_ARGUMENT' });
});

test('native JSON preserves preparation failure, source snapshots and cleanup', async () => {
  // 使用独立 Git 工作区故意缺少依赖；设置模块改动模拟检查期间的源码变化。
  const dir = await fs.mkdtemp(path.join(root, '.vtable-visual/json-contract-'));
  try {
    for (const mutate of [false, true]) {
      const workspace = path.join(dir, mutate ? 'changed' : 'unchanged');
      const suite = path.join(workspace, 'packages/vtable/__tests__/visual');
      await fs.cp(path.join(packageDir, '__tests__/visual'), suite, { recursive: true });
      await fs.writeFile(path.join(workspace, '.gitignore'), '.vtable-visual/\n');
      const marker = path.join(workspace, 'source.txt');
      await fs.writeFile(marker, 'original source\n');
      if (mutate)
        await fs.appendFile(
          path.join(suite, 'settings.mjs'),
          `\nimport fs from 'node:fs/promises'; await fs.writeFile(${JSON.stringify(
            marker
          )}, 'changed during check\\n');\n`
        );
      for (const args of [
        ['init', '--quiet'],
        ['add', '.'],
        [
          '-c',
          'core.hooksPath=/dev/null',
          '-c',
          'user.name=Fixture',
          '-c',
          'user.email=fixture@example.invalid',
          'commit',
          '--quiet',
          '--no-gpg-sign',
          '-m',
          'fixture'
        ]
      ]) {
        const setup = spawnSync('git', args, { cwd: workspace, encoding: 'utf8' });
        assert.equal(setup.status, 0, setup.stderr);
      }
      const script = `import {runVisual} from ${JSON.stringify(
        pathToFileURL(path.join(packageDir, 'scripts/visual/runner.mjs')).href
      )}; process.exitCode = await runVisual(${JSON.stringify(
        workspace
      )}, {json:true, 'self-compare':true, case:'list-basic'});`;
      const execution = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
        encoding: 'utf8',
        timeout: 60000,
        maxBuffer: 16 * 1024 * 1024
      });
      assert.equal(execution.status, 2, execution.stderr);
      const result = JSON.parse(execution.stdout);
      assert.equal(result.schemaVersion, 1);
      assert.equal(result.kind, 'local_visual_result');
      assert.equal(result.exitCode, execution.status);
      assert.equal(result.status, 'error');
      assert.equal(result.complete, false);
      assert.equal(result.selection.selectedCount, 1);
      assert.deepEqual(result.selection.selectedIds, ['list-basic']);
      assert.equal(result.counts.not_run, 1);
      assert.match(result.source.before.head, /^[a-f0-9]{40}$/);
      assert.match(result.source.after.digest, /^[a-f0-9]{64}$/);
      assert.equal(result.source.before.digest !== result.source.after.digest, mutate);
      const summary = JSON.parse(await fs.readFile(result.report.summary, 'utf8'));
      assert.equal(summary.finalized, true);
      assert.deepEqual(summary.selection, result.selection);
      assert.ok(summary.issues.some(issue => issue.code === 'PREFLIGHT_FAILED'));
      assert.equal(
        summary.issues.some(issue => issue.code === 'WORKSPACE_CHANGED'),
        mutate
      );
      assert.match(execution.stderr, /运行目录/);
      await assert.rejects(fs.access(path.join(workspace, '.vtable-visual/running.lock')));
    }
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});
