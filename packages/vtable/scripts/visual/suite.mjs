import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { createRuntime, digest, fault, atomicJson, fileManifest, freezeSuite } from './runtime.mjs';
import { git, workingTree, build, bundleFiles } from './build.mjs';
import { loadCases, acquireLock } from './runner.mjs';

const product = 'vtable';
const repository = 'VisActor/VTable';
const productKey = 'VTable';
const resourceFiles = Object.fromEntries(
  Object.entries(bundleFiles).map(([name, [folder]]) => [name, [`current-${name}.js`, `${folder}/package.json`]])
);

/** 规范化 JSON 对象键；有语义顺序的数组由清单构造方排序。 */
export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    if (![Object.prototype, null].includes(Object.getPrototypeOf(value)))
      throw fault('CASE_MANIFEST_INVALID', '清单对象必须是 JSON 数据');
    return `{${Object.keys(value)
      .sort()
      .map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`;
  }
  if (
    value === null ||
    ['string', 'boolean'].includes(typeof value) ||
    (typeof value === 'number' && Number.isFinite(value))
  )
    return JSON.stringify(value);
  throw fault('CASE_MANIFEST_INVALID', '清单只能包含 JSON 数据');
}

/** 用已安装的 TypeScript 解析真实导入，拒绝缺文件、越界和未声明的动态依赖。 */
async function importGraph(root, directory, files) {
  const ts = createRequire(path.join(root, 'tools/bundler/package.json'))('typescript');
  const known = new Set(files.map(file => file.path)),
    graph = new Map();
  for (const file of files.filter(file => /\.(m?js|html)$/.test(file.path) && file.path.startsWith('suite/'))) {
    const content = await fs.readFile(path.join(directory, file.path), 'utf8');
    const scripts = file.path.endsWith('.html')
      ? [...content.matchAll(/<script\b[^>]*type=["']module["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1])
      : [content];
    const dependencies = new Set();
    function add(specifier, browser) {
      // Node 与 Playwright 仅由公共运行器使用，用例必须能在浏览器直接导入。
      if (specifier.startsWith('node:') || specifier === '@playwright/test') {
        if (file.path.startsWith('suite/cases/'))
          throw fault('CASE_MANIFEST_INVALID', `用例不能导入运行时依赖：${file.path}`);
        return;
      }
      if ((!specifier.startsWith('.') && !specifier.startsWith('/suite/')) || /[\\?#]/.test(specifier))
        throw fault('CASE_MANIFEST_INVALID', `未声明的导入：${file.path} → ${specifier}`);
      const dependency = path.posix.normalize(
        specifier.startsWith('/suite/')
          ? specifier.slice(1)
          : path.posix.join(browser ? 'suite' : path.posix.dirname(file.path), specifier)
      );
      if (!dependency.startsWith('suite/') || !known.has(dependency))
        throw fault('CASE_MANIFEST_INVALID', `缺失或越界依赖：${file.path} → ${specifier}`);
      dependencies.add(dependency);
    }
    function visit(node, browser = false) {
      // 清单的唯一动态导入由 loadCases 校验全部 item.file，其余导入须有字面路径。
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ['evaluate', 'evaluateHandle', 'waitForFunction'].includes(node.expression.name.text)
      ) {
        // Playwright 序列化回调在 page.html 执行，导入相对于页面而非 Node 用例文件。
        ts.forEachChild(node, child => visit(child, browser || child === node.arguments[0]));
        return;
      }
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        if (node.moduleSpecifier) add(node.moduleSpecifier.text, browser);
      } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        const argument = node.arguments[0];
        if (argument && ts.isStringLiteralLike(argument)) add(argument.text, browser);
        else if (
          argument &&
          ts.isPropertyAccessExpression(argument) &&
          argument.name.text === 'href' &&
          ts.isNewExpression(argument.expression) &&
          argument.expression.expression.getText() === 'URL' &&
          argument.expression.arguments?.length === 2 &&
          ts.isStringLiteralLike(argument.expression.arguments[0]) &&
          argument.expression.arguments[1].getText() === (browser ? 'location.href' : 'import.meta.url')
        )
          add(argument.expression.arguments[0].text, browser);
        else if (
          !(
            file.path === 'suite/cases/index.mjs' &&
            argument &&
            ts.isNewExpression(argument) &&
            argument.expression.getText() === 'URL' &&
            argument.arguments?.length === 2 &&
            ts.isPropertyAccessExpression(argument.arguments[0]) &&
            argument.arguments[0].name.text === 'file' &&
            ts.isIdentifier(argument.arguments[0].expression) &&
            argument.arguments[1].getText() === 'import.meta.url'
          )
        )
          throw fault('CASE_MANIFEST_INVALID', `无法冻结动态导入：${file.path}`);
      } else if (
        ts.isNewExpression(node) &&
        node.expression.getText() === 'URL' &&
        node.arguments?.[0] &&
        ts.isStringLiteralLike(node.arguments[0])
      ) {
        add(node.arguments[0].text, browser);
      }
      ts.forEachChild(node, child => visit(child, browser));
    }
    for (const script of scripts) {
      const source = ts.createSourceFile(file.path, script, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
      if (source.parseDiagnostics.length) throw fault('CASE_MANIFEST_INVALID', `套件语法错误：${file.path}`);
      visit(source);
    }
    graph.set(file.path, [...dependencies].sort());
  }
  return graph;
}

/** 收集入口及所有相对导入，不用未声明的本机文件补齐套件。 */
function dependencyPaths(graph, entries) {
  const found = new Set();
  function visit(entry) {
    // 循环导入只记录一次，摘要仍包含循环中的全部文件。
    if (found.has(entry)) return;
    found.add(entry);
    for (const dependency of graph.get(entry) ?? []) visit(dependency);
  }
  for (const entry of entries) visit(entry);
  return [...found].sort();
}

/** 描述已经冻结且已构建的套件；不下载资源、不更新任何标准图。 */
export async function createSuiteManifest(root, directory, source) {
  const suite = path.join(directory, 'suite');
  const suiteFiles = (await fileManifest(suite)).map(file => ({ ...file, path: `suite/${file.path}` }));
  const graph = await importGraph(root, directory, suiteFiles);
  const cases = await loadCases(suite);
  const modules = new Set();
  for (const item of cases) {
    if (modules.has(item.file)) throw fault('CASE_MANIFEST_INVALID', `多个 ID 使用同一模块：${item.file}`);
    modules.add(item.file);
  }
  const names = ['vtable', 'editors', 'gantt', 'plugins', 'sheet', 'vchart'].filter(
    name => name === 'vtable' || cases.some(item => item.bundles.includes(name))
  );
  const inputs = path.join(directory, 'inputs');
  await fs.mkdir(inputs, { recursive: true });
  await fs.copyFile(path.join(root, 'common/config/rush/pnpm-lock.yaml'), path.join(inputs, 'pnpm-lock.yaml'));
  const lockDigest = digest(await fs.readFile(path.join(inputs, 'pnpm-lock.yaml')));
  const resources = [];
  for (const name of names) {
    const [relative, packageFile] =
      name === 'vchart'
        ? [
            'current-vchart.js',
            createRequire(path.join(root, 'packages/vtable/package.json')).resolve('@visactor/vchart/package.json')
          ]
        : resourceFiles[name];
    if (!(await fs.lstat(path.join(directory, relative))).isFile())
      throw fault('CASE_MANIFEST_INVALID', `产物必须是普通文件：${relative}`);
    const bytes = await fs.readFile(path.join(directory, relative));
    if (!bytes.length) throw fault('CASE_MANIFEST_INVALID', `产物为空：${relative}`);
    const packageBytes = await fs.readFile(path.resolve(root, packageFile));
    const pkg = JSON.parse(packageBytes);
    if (typeof pkg.name !== 'string' || typeof pkg.version !== 'string')
      throw fault('CASE_MANIFEST_INVALID', `包身份不完整：${name}`);
    await fs.writeFile(path.join(inputs, `${name}.package.json`), packageBytes);
    resources.push({
      resourceId: name,
      path: relative,
      digest: digest(bytes),
      size: bytes.length,
      packageName: pkg.name,
      packageVersion: pkg.version,
      lockDigest
    });
  }
  resources.sort((a, b) => (a.resourceId < b.resourceId ? -1 : a.resourceId > b.resourceId ? 1 : 0));
  const inputFiles = (await fileManifest(inputs)).map(file => ({ ...file, path: `inputs/${file.path}` }));
  const files = [
    ...suiteFiles,
    ...inputFiles,
    ...resources.map(({ path, digest, size }) => ({ path, digest, size }))
  ].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  const byPath = new Map(files.map(file => [file.path, file]));
  const shared = dependencyPaths(graph, [
    'suite/visual.spec.mjs',
    'suite/playwright.config.mjs',
    'suite/reporter.mjs',
    'suite/page.html',
    'suite/settings.mjs'
  ]);
  for (const file of shared) if (!byPath.has(file)) throw fault('CASE_MANIFEST_INVALID', `缺少公共运行器：${file}`);
  const { settings } = await import(pathToFileURL(path.join(suite, 'settings.mjs')));
  const manifest = {
    schemaVersion: 1,
    contractVersion: '1.0',
    kind: 'suite_manifest',
    repository,
    productKey,
    sourceCommit: source.head,
    sourceDigest: digest(canonicalJson({ head: source.head, worktreeDigest: source.digest })),
    engine: 'playwright',
    adapterVersion: '1.0.0',
    files,
    cases: [],
    resources,
    environmentRequirements: {
      nodeMajor: 22,
      playwrightVersion: createRequire(path.join(root, `packages/${product}/package.json`))(
        '@playwright/test/package.json'
      ).version,
      browserName: 'chromium',
      settings
    }
  };
  for (const item of [...cases].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))) {
    const modulePath = `suite/cases/${item.file.slice(2)}`;
    const text = await fs.readFile(path.join(directory, modulePath), 'utf8');
    const provenance = [...text.matchAll(/^\s*(?:\*|\/\/)\s*BugServer case IDs:\s*([^\r\n]+)/gm)].flatMap(match =>
      match[1].split(',').map(id => id.trim())
    );
    if (provenance.some(id => !/^[a-f0-9]{24}$/.test(id)) || new Set(provenance).size !== provenance.length)
      throw fault('CASE_MANIFEST_INVALID', `BugServer 来源 ID 非法：${item.id}`);
    const definition = {
      caseId: item.id,
      modulePath,
      purpose: item.purpose,
      screenshots: [{ screenshotId: 'final' }],
      provenance: { bugserverCaseIds: provenance.sort(), sourceExample: item.sourceExample ?? null },
      resourceIds: names.filter(name => name === 'vtable' || item.bundles.includes(name))
    };
    const dependencies = [...new Set([...shared, ...dependencyPaths(graph, [modulePath])])]
      .sort()
      .map(file => byPath.get(file));
    manifest.cases.push({
      ...definition,
      caseDigest: digest(
        canonicalJson({
          definition,
          dependencies,
          resources: resources.filter(resource => definition.resourceIds.includes(resource.resourceId))
        })
      )
    });
  }
  manifest.bundleDigest = digest(canonicalJson(resources));
  manifest.filesDigest = digest(canonicalJson(files));
  manifest.suiteDigest = digest(canonicalJson(manifest));
  return manifest;
}

/** 按稳定所有权键识别新增、修改和归档，不使用历史 Photo ID 匹配。 */
export function compareSuiteCases(previous, current) {
  function checked(manifest) {
    // 读取旧快照也校验摘要和命名空间，损坏数据不能生成同步计划。
    const { suiteDigest, ...content } = manifest;
    if (
      manifest.kind !== 'suite_manifest' ||
      manifest.schemaVersion !== 1 ||
      manifest.contractVersion !== '1.0' ||
      manifest.repository !== repository ||
      manifest.productKey !== productKey ||
      !Array.isArray(manifest.cases) ||
      !manifest.cases.length ||
      digest(canonicalJson(content)) !== suiteDigest
    )
      throw fault('CASE_MANIFEST_INVALID', '旧套件版本、来源或摘要不符');
    const map = new Map();
    for (const item of manifest.cases) {
      if (
        typeof item.caseId !== 'string' ||
        !/^[a-z][a-z0-9-]*$/.test(item.caseId) ||
        !/^[a-f0-9]{64}$/.test(item.caseDigest) ||
        map.has(item.caseId)
      )
        throw fault('CASE_MANIFEST_INVALID', '套件 ID 或 caseDigest 非法');
      map.set(item.caseId, item.caseDigest);
    }
    return map;
  }
  const before = previous ? checked(previous) : new Map(),
    after = checked(current);
  return {
    add: [...after.keys()].filter(id => !before.has(id)).sort(),
    update: [...after.keys()].filter(id => before.has(id) && before.get(id) !== after.get(id)).sort(),
    archive: [...before.keys()].filter(id => !after.has(id)).sort()
  };
}

/** 导出当前工作区的完整套件和新构建；仅成功目录可作为平台输入。 */
export async function exportSuite(root, destination, previous = null) {
  if (Number(process.versions.node.split('.')[0]) !== 22 || !['darwin', 'linux'].includes(process.platform))
    throw fault('PREFLIGHT_FAILED', '需要 Node.js 22 和 macOS/Linux');
  destination = path.resolve(root, destination);
  if (destination === root || destination.startsWith(`${root}${path.sep}`)) {
    try {
      git(root, ['check-ignore', '--no-index', destination]);
    } catch {
      throw fault('INVALID_ARGUMENT', '导出目录须位于工作区外或 Git 忽略目录');
    }
  }
  const runtime = createRuntime(),
    detach = runtime.listenSignals();
  let owned = false,
    result,
    primary;
  try {
    const output = path.join(root, `.${product}-visual`);
    await fs.mkdir(output, { recursive: true });
    runtime.defer(
      await acquireLock(output, {
        runId: `suite-${randomUUID()}`,
        pid: process.pid,
        startedAt: new Date().toISOString(),
        runDir: destination
      })
    );
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.mkdir(destination);
    owned = true;
    const source = await workingTree(root);
    const frozen = await freezeSuite(
      path.join(root, `packages/${product}/__tests__/visual`),
      path.join(destination, 'suite')
    );
    // 导入前完成路径检查；平台必须把这一步和后续发现放在隔离 worker。
    await importGraph(
      root,
      destination,
      (await fileManifest(path.join(destination, 'suite'))).map(file => ({ ...file, path: `suite/${file.path}` }))
    );
    const cases = await loadCases(path.join(destination, 'suite'));
    const names = ['vtable', 'editors', 'gantt', 'plugins', 'sheet', 'vchart'].filter(
      name => name === 'vtable' || cases.some(item => item.bundles.includes(name))
    );
    await build(root, destination, 'current', names, runtime, path.join(destination, 'build.log'));
    const manifest = await createSuiteManifest(root, destination, source);
    const frozenAfter = manifest.files
      .filter(file => file.path.startsWith('suite/'))
      .map(file => ({ ...file, path: file.path.slice(6) }));
    if (canonicalJson(frozen) !== canonicalJson(frozenAfter))
      throw fault('WORKSPACE_CHANGED', '用例发现或构建修改了冻结套件');
    const after = await workingTree(root);
    if (source.head !== after.head || source.digest !== after.digest)
      throw fault('WORKSPACE_CHANGED', '导出期间工作区发生变化');
    const changes = compareSuiteCases(previous, manifest);
    await atomicJson(path.join(destination, 'suite-manifest.json'), manifest);
    result = {
      directory: destination,
      manifestPath: path.join(destination, 'suite-manifest.json'),
      suiteDigest: manifest.suiteDigest,
      bundleDigest: manifest.bundleDigest,
      changes
    };
  } catch (error) {
    primary = error;
  }
  const cleanup = await runtime.cleanup();
  detach();
  if ((!result || cleanup.length) && owned) {
    // 失败日志是排查依据，保留目录但移除可被消费的成功清单。
    await fs.rm(path.join(destination, 'suite-manifest.json'), { force: true });
    await atomicJson(path.join(destination, 'export-failure.json'), {
      schemaVersion: 1,
      status: 'failed',
      error: primary
        ? { code: primary.visualError ? primary.code : 'EXECUTION_FAILED', message: primary.message }
        : null,
      cleanup
    });
  }
  if (cleanup.length) throw fault('CLEANUP_FAILED', JSON.stringify({ primary: primary?.message ?? null, cleanup }));
  if (primary) throw primary;
  return result;
}
