import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSuiteManifest, compareSuiteCases, canonicalJson, exportSuite } from './visual/suite.mjs';
import { digest, freezeSuite } from './visual/runtime.mjs';
import { parseOptions } from './visual-test.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const product = 'vtable';
const source = { head: 'a'.repeat(40), digest: 'b'.repeat(64), dirty: true };

/** 只在独立忽略目录构造输入，不修改真实用例或正式基准。 */
async function fixture(
  t,
  items = [
    { id: 'example', purpose: '验证依赖摘要', file: './table/example.mjs' },
    { id: 'neighbor', purpose: '验证未变用例', file: './table/neighbor.mjs' }
  ]
) {
  items = items.map(item => ({
    ...item,
    bundles: item.id === 'neighbor' ? ['vtable'] : ['vtable', 'editors', 'gantt', 'plugins', 'sheet', 'vchart']
  }));
  const parent = path.join(root, `.${product}-visual`);
  await fs.mkdir(parent, { recursive: true });
  const directory = await fs.mkdtemp(path.join(parent, 'suite-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await fs.mkdir(path.join(directory, 'suite/cases/table'), { recursive: true });
  await fs.writeFile(
    path.join(directory, 'suite/cases/index.mjs'),
    `export const cases = ${JSON.stringify(
      items
    )};\nexport async function loadCase(item) { return (await import(new URL(item.file, import.meta.url))).default; }\n`
  );
  await fs.writeFile(path.join(directory, 'suite/helpers.mjs'), 'export const value = 1;\n');
  for (const item of items)
    if (item.file.startsWith('./table/'))
      await fs.writeFile(
        path.join(directory, 'suite/cases', item.file),
        "import { value } from '../../helpers.mjs';\nexport default { mount() { return { value }; }, async verify() {} };\n"
      );
  for (const file of ['visual.spec.mjs', 'playwright.config.mjs', 'reporter.mjs'])
    await fs.writeFile(path.join(directory, 'suite', file), "import './cases/index.mjs';\nimport './settings.mjs';\n");
  await fs.writeFile(
    path.join(directory, 'suite/page.html'),
    '<script type="module">import "./cases/index.mjs";</script>'
  );
  await fs.writeFile(
    path.join(directory, 'suite/settings.mjs'),
    'export const settings = { viewport: {width: 1000, height: 800}, comparison: {threshold: 0.1, maxDiffPixels: 0} };'
  );
  for (const name of ['vtable', 'editors', 'gantt', 'plugins', 'sheet', 'vchart'])
    await fs.writeFile(path.join(directory, `current-${name}.js`), `var Fixture_${name} = {};\n`);
  return directory;
}

test('same frozen bytes produce identical manifests regardless of output directory', async t => {
  const a = await fixture(t),
    b = await fixture(t);
  const first = await createSuiteManifest(root, a, source),
    second = await createSuiteManifest(root, b, source);
  assert.deepEqual(first, second);
  assert.equal(first.schemaVersion, 1);
  assert.equal(first.contractVersion, '1.0');
  assert.equal(first.sourceCommit, source.head);
  assert.match(first.suiteDigest, /^[a-f0-9]{64}$/);
  assert.equal(
    first.suiteDigest,
    digest(canonicalJson(Object.fromEntries(Object.entries(first).filter(([key]) => key !== 'suiteDigest'))))
  );
  assert.equal(new Set(first.files.map(file => file.path)).size, first.files.length);
  for (const file of first.files) {
    const bytes = await fs.readFile(path.join(a, file.path));
    assert.equal(file.digest, digest(bytes));
    assert.equal(file.size, bytes.length);
    assert.ok(!path.isAbsolute(file.path) && !file.path.split('/').includes('..'));
  }
  assert.deepEqual(compareSuiteCases(first, second), { add: [], update: [], archive: [] });
});

test('case, shared helper and artifact changes invalidate their recorded identities', async t => {
  const directory = await fixture(t),
    first = await createSuiteManifest(root, directory, source);
  await fs.appendFile(path.join(directory, 'suite/cases/table/example.mjs'), '\n// 独立用例输入改变。\n');
  const one = await createSuiteManifest(root, directory, source);
  assert.deepEqual(compareSuiteCases(first, one), { add: [], update: ['example'], archive: [] });
  await fs.writeFile(path.join(directory, 'suite/helpers.mjs'), 'export const value = 2;\n');
  const shared = await createSuiteManifest(root, directory, source);
  assert.deepEqual(compareSuiteCases(one, shared).update, ['example', 'neighbor']);
  const artifact = 'current-vtable.js';
  await fs.appendFile(path.join(directory, artifact), '// 新构建\n');
  const changed = await createSuiteManifest(root, directory, source);
  assert.notEqual(changed.bundleDigest, shared.bundleDigest);
  assert.notEqual(changed.suiteDigest, shared.suiteDigest);
  assert.deepEqual(compareSuiteCases(shared, changed).update, ['example', 'neighbor']);
});

test('stable IDs distinguish additions and archives, while corrupted snapshots fail', async t => {
  const a = await fixture(t),
    b = await fixture(t, [
      { id: 'example', purpose: '验证依赖摘要', file: './table/example.mjs' },
      { id: 'new-case', purpose: '验证新增', file: './table/new-case.mjs' }
    ]);
  const first = await createSuiteManifest(root, a, source),
    second = await createSuiteManifest(root, b, source);
  const changes = compareSuiteCases(first, second);
  assert.deepEqual(changes.add, ['new-case']);
  assert.deepEqual(changes.archive, ['neighbor']);
  assert.deepEqual(compareSuiteCases(null, first).add, ['example', 'neighbor']);
  assert.throws(() => compareSuiteCases({ ...first, repository: 'Other/Repo' }, second), {
    code: 'CASE_MANIFEST_INVALID'
  });
  const corrupt = structuredClone(first);
  corrupt.cases[0].purpose = '被篡改';
  assert.throws(() => compareSuiteCases(corrupt, second), { code: 'CASE_MANIFEST_INVALID' });
});

test('JavaScript helpers include their transitive imports in case identities', async t => {
  // 浏览器辅助文件可用 .js，嵌套依赖变化必须使受影响用例失效。
  const directory = await fixture(t);
  await fs.appendFile(path.join(directory, 'suite/helpers.mjs'), "import './transitive.js';\n");
  await fs.writeFile(path.join(directory, 'suite/transitive.js'), "export { marker } from './nested.mjs';\n");
  await fs.writeFile(path.join(directory, 'suite/nested.mjs'), 'export const marker = 1;\n');
  const first = await createSuiteManifest(root, directory, source);
  await fs.writeFile(path.join(directory, 'suite/nested.mjs'), 'export const marker = 2;\n');
  const second = await createSuiteManifest(root, directory, source);
  assert.deepEqual(compareSuiteCases(first, second).update, ['example', 'neighbor']);
});


test('missing resources, imports, duplicate IDs, ambiguous modules and path escapes fail', async t => {
  const missing = await fixture(t);
  await fs.rm(path.join(missing, 'current-vtable.js'));
  await assert.rejects(createSuiteManifest(root, missing, source));
  for (const specifier of [
    './missing.mjs',
    '../../../../secret.mjs',
    '/etc/passwd',
    '/suite/../../secret.mjs',
    'node:fs'
  ]) {
    const directory = await fixture(t);
    await fs.appendFile(
      path.join(directory, 'suite/cases/table/example.mjs'),
      `\nasync function extra() { await import(${JSON.stringify(specifier)}); }\n`
    );
    await assert.rejects(createSuiteManifest(root, directory, source), { code: 'CASE_MANIFEST_INVALID' });
  }
  for (const items of [
    [
      { id: 'example', purpose: 'a', file: './table/example.mjs' },
      { id: 'example', purpose: 'b', file: './table/neighbor.mjs' }
    ],
    [
      { id: 'example', purpose: 'a', file: './table/example.mjs' },
      { id: 'neighbor', purpose: 'b', file: './table/example.mjs' }
    ],
    [{ id: 'example', purpose: 'a', file: '../outside.mjs' }]
  ]) {
    const directory = await fixture(t, items);
    await assert.rejects(createSuiteManifest(root, directory, source), { code: 'CASE_MANIFEST_INVALID' });
  }
  const link = await fixture(t);
  await fs.symlink(path.join(link, 'suite/helpers.mjs'), path.join(link, 'suite/escaped.mjs'));
  await assert.rejects(createSuiteManifest(root, link, source), { code: 'CASE_MANIFEST_INVALID' });
  const resourceLink = await fixture(t);
  await fs.rm(path.join(resourceLink, 'current-vtable.js'));
  await fs.symlink(path.join(resourceLink, 'suite/helpers.mjs'), path.join(resourceLink, 'current-vtable.js'));
  await assert.rejects(createSuiteManifest(root, resourceLink, source), { code: 'CASE_MANIFEST_INVALID' });
});

test('freeze rejects symlink roots, and export never overwrites an existing directory', async t => {
  const directory = await fixture(t),
    target = `${directory}-copy`,
    link = `${directory}-link`;
  t.after(() => Promise.all([fs.rm(target, { recursive: true, force: true }), fs.rm(link, { force: true })]));
  const frozen = await freezeSuite(path.join(directory, 'suite'), target);
  assert.ok(frozen.every(file => Number.isInteger(file.size)));
  await fs.symlink(path.join(directory, 'suite'), link);
  await assert.rejects(freezeSuite(link, `${target}-outside`), { code: 'CASE_MANIFEST_INVALID' });
  const sentinel = path.join(directory, 'keep.txt');
  await fs.writeFile(sentinel, 'keep');
  await assert.rejects(exportSuite(root, directory), { code: 'EEXIST' });
  assert.equal(await fs.readFile(sentinel, 'utf8'), 'keep');
  await assert.rejects(fs.access(path.join(root, `.${product}-visual/running.lock`)));
});

test('suite export options remain separate from local case, directory and baseline modes', () => {
  assert.equal(parseOptions(['--export-suite', '.vtable-visual/export'])['export-suite'], '.vtable-visual/export');
  assert.equal(parseOptions(['--export-suite', 'out', '--previous-suite', 'old.json'])['previous-suite'], 'old.json');
  for (const args of [
    ['--export-suite', ''],
    ['--previous-suite', 'old.json'],
    ['--export-suite', 'out', '--previous-suite', ''],
    ['--export-suite', 'out', '--case', 'example'],
    ['--export-suite', 'out', '--dir', 'charts'],
    ['--export-suite', 'out', '--list'],
    ['--export-suite', 'out', '--check'],
    ['--export-suite', 'out', '--baseline', 'a'.repeat(40)],
    ['--export-suite', 'out', '--self-compare'],
    ['--export-suite', 'out', '--export-suite', 'other']
  ])
    assert.throws(() => parseOptions(args), { code: 'INVALID_ARGUMENT' });
  assert.equal(parseOptions(['--dir', 'table']).dir, 'table');
  assert.equal(parseOptions(['--case', 'list-basic']).case, 'list-basic');
});

test('extension and locked VChart bundles carry their actual package identity', async t => {
  // 依赖产物改变时不能复用此前的套件或单例身份。
  const directory = await fixture(t),
    first = await createSuiteManifest(root, directory, source);
  assert.deepEqual(
    first.resources.map(resource => resource.resourceId),
    ['editors', 'gantt', 'plugins', 'sheet', 'vchart', 'vtable']
  );
  const require = (await import('node:module')).createRequire(path.join(root, 'packages/vtable/package.json'));
  assert.equal(
    first.resources.find(resource => resource.resourceId === 'vchart').packageVersion,
    require('@visactor/vchart/package.json').version
  );
  for (const name of ['editors', 'vchart']) {
    await fs.appendFile(path.join(directory, `current-${name}.js`), '// 依赖产物更新\n');
    const next = await createSuiteManifest(root, directory, source);
    assert.notEqual(next.bundleDigest, first.bundleDigest);
    assert.notEqual(
      next.cases.find(item => item.caseId === 'example').caseDigest,
      first.cases.find(item => item.caseId === 'example').caseDigest
    );
    assert.equal(
      next.cases.find(item => item.caseId === 'neighbor').caseDigest,
      first.cases.find(item => item.caseId === 'neighbor').caseDigest
    );
  }
});

test('browser imports use the existing /suite namespace without host path fallback', async t => {
  const directory = await fixture(t);
  await fs.appendFile(
    path.join(directory, 'suite/cases/table/example.mjs'),
    '\nasync function browserImport(page) { await page.evaluate(async () => { await import("./helpers.mjs"); await import(new URL("./helpers.mjs", location.href).href); }); return import("/suite/helpers.mjs"); }\n'
  );
  const manifest = await createSuiteManifest(root, directory, source);
  assert.equal(manifest.cases.length, 2);
  assert.ok(manifest.files.some(file => file.path === 'suite/helpers.mjs'));
});

test('failed preparation retains diagnostics and removes the consumable manifest', async t => {
  // 使用缺少产品目录的独立输入，失败必须可追溯且不能生成可注册清单。
  const directory = await fixture(t),
    destination = path.join(directory, '.vtable-visual/export');
  await assert.rejects(exportSuite(directory, destination));
  const failure = JSON.parse(await fs.readFile(path.join(destination, 'export-failure.json'), 'utf8'));
  assert.equal(failure.status, 'failed');
  assert.ok(failure.error.message);
  await assert.rejects(fs.access(path.join(destination, 'suite-manifest.json')));
  await assert.rejects(fs.access(path.join(directory, '.vtable-visual/running.lock')));
});
