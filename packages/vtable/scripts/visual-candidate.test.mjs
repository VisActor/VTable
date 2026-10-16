import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { canonicalJson, createSuiteManifest } from './visual/suite.mjs';
import { validateRunRequest, projectRunResult, runCandidate } from './visual/candidate.mjs';
import { workingTree, outputDirectory } from './visual/build.mjs';
import * as builds from './visual/build.mjs';
import { digest, fileManifest, freezeSuite } from './visual/runtime.mjs';
import { parseOptions } from './visual-test.mjs';
import { cases } from '../__tests__/visual/cases/index.mjs';

const product = 'vtable';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const packageDir = path.join(root, 'packages', product);
const basic = product === 'vchart' ? 'bar-stack' : 'list-basic';
const representatives =
  product === 'vchart'
    ? [basic, 'datazoom-drag']
    : [
        basic,
        'list-select-cell',
        'gantt-taskbar-relative-rect',
        'sheet-add-columns',
        'plugin-filter-hide-reorder',
        'pivot-chart-box-plot',
        'edit-complete-input'
      ];
const require = createRequire(path.join(packageDir, 'package.json'));
const testRequire = createRequire(require.resolve('@playwright/test/package.json'));
const playwrightRequire = createRequire(testRequire.resolve('playwright/package.json'));
const { PNG } = require(path.join(
  path.dirname(playwrightRequire.resolve('playwright-core/package.json')),
  'lib/utilsBundle.js'
));

/** 按正式契约重算请求键，测试故障不能借用旧的选择或输入摘要。 */
function bind(request) {
  request.selection.digest = digest(canonicalJson(request.selection.items));
  request.executionKey = digest(
    canonicalJson({
      identity: request.identity,
      engines: request.engines,
      selectionDigest: request.selection.digest,
      rerunSequence: request.rerunSequence
    })
  );
  return request;
}

/** 冻结真实用例和已构建产物；所有故障注入仅发生在独立测试目录。 */
async function fixture(t) {
  const parent = path.join(root, '.' + product + '-visual');
  await fs.mkdir(parent, { recursive: true });
  const directory = await fs.mkdtemp(path.join(parent, 'candidate-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const input = path.join(directory, 'input'),
    baselines = path.join(directory, 'baselines');
  await fs.mkdir(input);
  await fs.mkdir(baselines);
  await freezeSuite(path.join(packageDir, '__tests__/visual'), path.join(input, 'suite'));
  const metadata = representatives.map(id => {
    const item = cases.find(item => item.id === id);
    assert.ok(item, '代表性用例必须真实登记：' + id);
    return item;
  });
  const basicFile = cases.find(item => item.id === basic).file;
  await fs.mkdir(path.join(input, 'suite/cases/workflow'));
  for (const name of ['assertion', 'blank']) {
    metadata.push({
      id: 'workflow-' + name,
      purpose: '运行器故障注入：' + name,
      file: './workflow/' + name + '.mjs',
      ...(product === 'vtable' ? { bundles: ['vtable'] } : {})
    });
    const action =
      name === 'assertion'
        ? `async verify() { throw new Error('有意触发语义断言失败'); }`
        : `async exercise(page) { await page.evaluate(() => { for (const canvas of document.querySelectorAll('canvas')) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); }); }`;
    await fs.writeFile(
      path.join(input, 'suite/cases/workflow', name + '.mjs'),
      `import basic from ${JSON.stringify(
        '../' + basicFile.slice(2)
      )};\n// 独立故障注入，检查断言失败和交互后空白不会被标绿。\nexport default { ...basic, ${action} };\n`
    );
  }
  await fs.writeFile(
    path.join(input, 'suite/cases/index.mjs'),
    `export const cases = ${JSON.stringify(
      metadata
    )};\n/** 加载显式测试清单，不读取正式基准。 */\nexport async function loadCase(item) { return (await import(new URL(item.file, import.meta.url))).default; }\n`
  );
  if (product === 'vchart') await fs.copyFile(path.join(packageDir, 'build/index.js'), path.join(input, 'current.js'));
  else {
    for (const [name, [folder, file]] of Object.entries(builds.bundleFiles))
      await fs.copyFile(path.join(root, folder, file), path.join(input, 'current-' + name + '.js'));
    const vchartRoot = path.dirname(require.resolve('@visactor/vchart/package.json'));
    await fs.copyFile(path.join(vchartRoot, 'build/index.min.js'), path.join(input, 'current-vchart.js'));
  }
  const manifest = await createSuiteManifest(root, input, await workingTree(root));
  await fs.writeFile(path.join(input, 'suite-manifest.json'), JSON.stringify(manifest));
  const baseline = {
    schemaVersion: 1,
    contractVersion: '1.0',
    kind: 'baseline_manifest',
    artifactId: 'fixture-baselines',
    repository: manifest.repository,
    productKey: manifest.productKey,
    environmentId: 'local-test-fixture',
    assetRevision: null,
    renderer: null,
    entries: metadata.map(item => ({
      caseId: item.id,
      screenshotId: 'final',
      baselineExpected: false,
      path: null,
      digest: null
    }))
  };
  const request = {
    schemaVersion: 1,
    contractVersion: '1.0',
    kind: 'run_request',
    requestId: 'fixture-request',
    generation: 1,
    identity: {
      repository: manifest.repository,
      productKey: manifest.productKey,
      pullRequest: null,
      headSha: manifest.sourceCommit,
      baseRef: 'develop',
      baseSha: manifest.sourceCommit,
      controlCommit: manifest.sourceCommit,
      subject: {
        kind: 'local_workspace',
        testedCommit: manifest.sourceCommit,
        mergeParents: [],
        sourceDigest: manifest.sourceDigest,
        dirty: manifest.sourceDirty
      },
      bundleDigest: manifest.bundleDigest,
      suiteDigests: { photo: null, playwright: manifest.suiteDigest },
      environmentIds: { photo: null, playwright: baseline.environmentId },
      assetRevision: null,
      policyDigest: digest('local auxiliary fixture only')
    },
    engines: ['playwright'],
    selection: { mode: 'targeted', items: [] },
    inputArtifacts: [],
    rerunSequence: 0
  };
  let sequence = 0;
  async function run(
    ids = representatives,
    { baselineValue = baseline, requestValue = request, inputValue = input } = {}
  ) {
    // 每次运行都有新输出目录；原始基准只作为带摘要的只读输入。
    const bytes = Buffer.from(JSON.stringify(baselineValue));
    await fs.writeFile(path.join(baselines, 'baseline-manifest.json'), bytes);
    const value = structuredClone(requestValue);
    value.selection.items = ids.map(caseId => ({ engine: 'playwright', caseId, screenshotId: 'final' }));
    value.inputArtifacts = [
      {
        artifactId: baselineValue.artifactId,
        digest: digest(bytes),
        mediaType: 'application/json',
        visibility: 'restricted'
      }
    ];
    bind(value);
    const requestFile = path.join(directory, 'request.json');
    await fs.writeFile(requestFile, JSON.stringify(value));
    const output = path.join(directory, 'run-' + ++sequence);
    const inputsBefore = [await fileManifest(inputValue), await fileManifest(baselines)];
    const code = await runCandidate(root, {
      'run-suite': inputValue,
      'run-request': requestFile,
      'baseline-set': baselines,
      output
    });
    const result = JSON.parse(await fs.readFile(path.join(output, 'run-result.json'), 'utf8'));
    assert.equal(code, result.workerExitCode);
    assert.deepEqual([await fileManifest(inputValue), await fileManifest(baselines)], inputsBefore);
    await assert.rejects(fs.access(path.join(output, 'node_modules')));
    await assert.rejects(fs.access(path.join(parent, 'running.lock')));
    return { result, output, request: value, code };
  }
  return { directory, input, baselines, baseline, request, manifest, run };
}

test('candidate CLI requires an exact mode and leaves existing local modes available', () => {
  const args = ['--run-suite', 'suite', '--run-request', 'request.json', '--baseline-set', 'baselines'];
  assert.equal(parseOptions(args)['run-suite'], 'suite');
  for (const bad of [
    args.slice(0, 2),
    [...args, '--case', basic],
    [...args, '--dir', 'table'],
    [...args, '--self-compare'],
    [...args, '--baseline', 'a'.repeat(40)],
    [...args, '--check'],
    [...args, '--list'],
    [...args, '--export-suite', 'out'],
    [...args, '--run-suite', 'other'],
    ['--output', 'out'],
    [...args, '--output', '']
  ])
    assert.throws(() => parseOptions(bad), { code: 'INVALID_ARGUMENT' });
  assert.equal(Object.keys(parseOptions([])).length, 0);
  assert.equal(parseOptions(['--self-compare'])['self-compare'], true);
});

test('request branch and artifact metadata remain required even with a fresh execution key', () => {
  // 独立检查必需字段，避免所有非法输入仅因陈旧执行键而被拒绝。
  const request = bind({
    schemaVersion: 1,
    contractVersion: '1.0',
    kind: 'run_request',
    requestId: 'contract-example',
    generation: 1,
    identity: {
      repository: product === 'vchart' ? 'VisActor/VChart' : 'VisActor/VTable',
      productKey: product === 'vchart' ? 'chartspace4' : 'VTable',
      pullRequest: null,
      headSha: 'a'.repeat(40),
      baseRef: 'develop',
      baseSha: 'b'.repeat(40),
      controlCommit: 'c'.repeat(40),
      subject: { kind: 'pr_head', testedCommit: 'a'.repeat(40), mergeParents: [], sourceDigest: 'd'.repeat(64) },
      bundleDigest: 'e'.repeat(64),
      suiteDigests: { photo: null, playwright: 'f'.repeat(64) },
      environmentIds: { photo: null, playwright: 'fixture-only' },
      assetRevision: null,
      policyDigest: 'a'.repeat(64)
    },
    engines: ['playwright'],
    selection: { mode: 'full', items: [{ engine: 'playwright', caseId: 'example', screenshotId: 'final' }] },
    inputArtifacts: [
      { artifactId: 'fixture', digest: 'b'.repeat(64), mediaType: 'application/json', visibility: 'restricted' }
    ],
    rerunSequence: 0
  });
  assert.equal(validateRunRequest(request), request);
  for (const alter of [
    value => delete value.identity.baseRef,
    value => (value.identity.baseRef = 'main'),
    value => delete value.inputArtifacts[0].mediaType,
    value => delete value.inputArtifacts[0].visibility,
    value => (value.inputArtifacts[0].visibility = 'unknown'),
    value => (value.identity.subject.testedCommit = 'b'.repeat(40))
  ]) {
    const bad = structuredClone(request);
    alter(bad);
    bind(bad);
    assert.throws(() => validateRunRequest(bad), { code: 'RUN_REQUEST_INVALID' });
  }
});

test(
  'real candidate execution preserves checks, read-only baselines, differences and failure evidence',
  { timeout: 240000 },
  async t => {
    const f = await fixture(t);
    let initial, matching, capturedBaseline;
    await t.test('first baselines produce checked candidates without a comparison pass', async () => {
      initial = await f.run();
      assert.equal(initial.result.complete, true);
      assert.equal(initial.result.rawOutcome, 'failed');
      assert.equal(initial.code, 2);
      assert.equal(initial.result.counts.no_baseline, representatives.length);
      for (const row of initial.result.cases) {
        assert.equal(row.error, null);
        assert.equal(row.baselineExpected, false);
        assert.deepEqual([row.assertions, row.drawing, row.stability], ['passed', 'passed', 'passed']);
        assert.ok(row.currentDigest);
        assert.equal(row.images.baseline, null);
      }
      assert.equal(initial.result.artifacts.filter(item => item.role === 'candidate').length, representatives.length);
      assert.match(await fs.readFile(path.join(initial.output, 'agent-summary.md'), 'utf8'), /no_baseline|无首次基准/);
    });
    await t.test('the same frozen inputs compare against specified pictures', async () => {
      capturedBaseline = structuredClone(f.baseline);
      capturedBaseline.renderer = initial.result.renderer;
      for (const row of initial.result.cases) {
        const relative = row.caseId + '.png',
          bytes = await fs.readFile(path.join(initial.output, row.images.current));
        await fs.writeFile(path.join(f.baselines, relative), bytes);
        Object.assign(
          capturedBaseline.entries.find(item => item.caseId === row.caseId),
          { baselineExpected: true, path: relative, digest: digest(bytes) }
        );
      }
      matching = await f.run(representatives, { baselineValue: capturedBaseline });
      assert.equal(matching.code, 0);
      assert.equal(matching.result.rawOutcome, 'passed');
      assert.equal(matching.result.complete, true);
      assert.equal(matching.result.counts.matched, representatives.length);
    });
    await t.test('unexpected missing baseline remains distinct from first initialization', async () => {
      const value = structuredClone(f.baseline);
      value.entries.find(item => item.caseId === basic).baselineExpected = true;
      const run = await f.run([basic], { baselineValue: value });
      assert.equal(run.result.complete, true);
      assert.equal(run.code, 2);
      assert.equal(run.result.cases[0].status, 'no_baseline');
      assert.equal(run.result.cases[0].error.code, 'MISSING_BASELINE');
    });
    await t.test('blank drawing and semantic assertion failures cannot publish candidates', async () => {
      const run = await f.run(['workflow-blank', 'workflow-assertion']);
      assert.equal(run.code, 2);
      assert.equal(run.result.complete, true);
      assert.equal(run.result.counts.assertion_failed, 1);
      assert.equal(run.result.counts.execution_error, 1);
      assert.equal(run.result.cases.find(item => item.caseId === 'workflow-blank').drawing, 'failed');
      assert.equal(run.result.cases.find(item => item.caseId === 'workflow-assertion').assertions, 'failed');
      assert.equal(run.result.artifacts.filter(item => item.role === 'candidate').length, 0);
    });
    await t.test('native dimension differences retain all three real images and an offline report', async () => {
      const row = initial.result.cases.find(item => item.caseId === basic),
        bytes = await fs.readFile(path.join(initial.output, row.images.current));
      const original = PNG.sync.read(bytes),
        changed = new PNG({ width: original.width + 10, height: original.height });
      changed.data.fill(255);
      PNG.bitblt(original, changed, 0, 0, original.width, original.height, 0, 0);
      const altered = PNG.sync.write(changed),
        value = structuredClone(capturedBaseline);
      await fs.writeFile(path.join(f.baselines, 'changed.png'), altered);
      Object.assign(
        value.entries.find(item => item.caseId === basic),
        { path: 'changed.png', digest: digest(altered) }
      );
      const run = await f.run([basic], { baselineValue: value });
      assert.equal(run.code, 1);
      assert.equal(run.result.rawOutcome, 'differences');
      assert.equal(run.result.complete, true);
      assert.equal(run.result.cases[0].status, 'different');
      assert.ok(run.result.cases[0].diffDigest);
      const browser = await require('@playwright/test').chromium.launch();
      try {
        const page = await browser.newPage();
        await page.goto('file://' + path.join(run.output, 'index.html'));
        assert.equal(await page.locator('article img').count(), 3);
        assert.equal(
          await page
            .locator('article img')
            .evaluateAll(images => images.every(item => item.complete && item.naturalWidth > 0)),
          true
        );
      } finally {
        await browser.close();
      }
    });
    await t.test('invalid frozen bytes, complete selections and baseline environments fail explicitly', async () => {
      const clone = path.join(f.directory, 'tampered');
      await fs.cp(f.input, clone, { recursive: true });
      await fs.appendFile(path.join(clone, 'suite/page.html'), '<!-- tampered -->');
      const changed = await f.run([basic], { inputValue: clone });
      assert.equal(changed.result.error.code, 'INVALID_ARTIFACT');
      assert.equal(changed.result.complete, false);
      const fullRequest = structuredClone(f.request);
      fullRequest.selection.mode = 'full';
      const full = await f.run([basic], { requestValue: fullRequest });
      assert.equal(full.result.error.code, 'RESULT_SET_MISMATCH');
      const badEnvironment = structuredClone(capturedBaseline);
      badEnvironment.renderer.browser = 'different';
      const env = await f.run([basic], { baselineValue: badEnvironment });
      assert.equal(env.result.error.code, 'ENVIRONMENT_MISMATCH');
      assert.equal(env.result.complete, false);
      const corrupted = structuredClone(capturedBaseline),
        entry = corrupted.entries.find(item => item.caseId === basic);
      const bytes = await fs.readFile(path.join(f.baselines, entry.path));
      bytes[bytes.length - 1] ^= 255;
      await fs.writeFile(path.join(f.baselines, 'corrupt.png'), bytes);
      Object.assign(entry, { path: 'corrupt.png', digest: digest(bytes) });
      const png = await f.run([basic], { baselineValue: corrupted });
      assert.equal(png.result.error.code, 'INVALID_ARTIFACT');
      assert.equal(png.code, 2);
    });
    await t.test(
      'missing images, unfinished/duplicate/extra rows, bad exit codes and skipped work never pass',
      async () => {
        const native = JSON.parse(await fs.readFile(path.join(matching.output, 'current-result.json'), 'utf8'));
        const baselines = {
          selected: matching.result.cases.map(row => ({
            ...row,
            actualDigest: row.baselineDigest,
            image: row.images.baseline
          })),
          artifacts: []
        };
        const phase = { ...native, exitCode: 0 };
        const project = (value, png = bytes => PNG.sync.read(bytes)) =>
          projectRunResult(matching.output, matching.request, f.manifest, baselines, value, { png });
        assert.equal((await project(phase)).rawOutcome, 'passed');
        for (const alter of [
          value => (value.finalized = false),
          value => (value.finalized = 'true'),
          value => (value.exitCode = 1),
          value => (value.status = 'diff'),
          value => value.tests.pop(),
          value => value.tests.push(value.tests[0]),
          value => (value.tests[0].id = 'unknown'),
          value => (value.tests[0].attachments = []),
          value => (value.tests[0].checks.stability = 'not_run'),
          value => {
            value.tests[0].status = 'not_run';
            value.status = 'error';
            value.exitCode = 1;
          },
          value => (value.tests[0].attachments.find(item => item.name === 'rendered').path = '../../outside.png')
        ]) {
          const changed = structuredClone(phase);
          alter(changed);
          const result = await project(changed);
          assert.equal(result.complete, false);
          assert.equal(result.workerExitCode, 2);
        }
        const invalidPng = await project(phase, () => {
          throw new Error('corrupt PNG');
        });
        assert.equal(invalidPng.complete, false);
        assert.equal(invalidPng.counts.execution_error, representatives.length);
        const cancelled = await projectRunResult(matching.output, matching.request, f.manifest, baselines, null, {
          interrupted: true
        });
        assert.equal(cancelled.counts.cancelled, representatives.length);
        assert.equal(cancelled.complete, false);
        await assert.rejects(project({ ...phase, tests: 'invalid' }), { code: 'RESULT_SET_MISMATCH' });
      }
    );
    await t.test('request identity and output ownership reject aliases, duplicates and stale keys', async () => {
      const good = matching.request;
      assert.equal(validateRunRequest(good), good);
      for (const alter of [
        value => (value.identity.headSha = 'short'),
        value => (value.identity.environmentIds.photo = 'unexpected'),
        value => value.selection.items.push(value.selection.items[0]),
        value => (value.identity.subject.kind = 'pr_head'),
        value => value.engines.push('photo'),
        value => (value.generation = 0),
        value => (value.executionKey = 'a'.repeat(64))
      ]) {
        const bad = structuredClone(good);
        alter(bad);
        assert.throws(() => validateRunRequest(bad));
      }
      const sentinel = path.join(matching.output, 'keep.txt');
      await fs.writeFile(sentinel, 'keep');
      await assert.rejects(
        runCandidate(root, {
          'run-suite': f.input,
          'run-request': path.join(f.directory, 'request.json'),
          'baseline-set': f.baselines,
          output: matching.output
        }),
        { code: 'EEXIST' }
      );
      assert.equal(await fs.readFile(sentinel, 'utf8'), 'keep');
      const alias = path.join(f.directory, 'alias');
      await fs.symlink(f.input, alias, 'dir');
      await assert.rejects(outputDirectory(root, path.join(alias, 'nested'), [f.input]), { code: 'INVALID_ARGUMENT' });
      await assert.rejects(outputDirectory(root, path.join(root, 'packages', product, 'candidate-generated')), {
        code: 'INVALID_ARGUMENT'
      });
      await assert.rejects(fs.access(path.join(root, '.' + product + '-visual/running.lock')));
    });
  }
);
