import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { createRuntime, fault } from './visual/runtime.mjs';
import { loadCases, preflight, runVisual } from './visual/runner.mjs';

/** 解析公共命令；帮助不加载 Playwright，非法选项仍明确报错。 */
export function parseOptions(args) {
  let values, tokens;
  try {
    ({ values, tokens } = parseArgs({
      args,
      tokens: true,
      options: {
        baseline: { type: 'string' },
        case: { type: 'string' },
        dir: { type: 'string' },
        'self-compare': { type: 'boolean' },
        list: { type: 'boolean' },
        check: { type: 'boolean' },
        help: { type: 'boolean' }
      }
    }));
  } catch (error) {
    throw fault('INVALID_ARGUMENT', error.message, error);
  }
  if (values.help) return values;
  if (tokens.filter(token => token.kind === 'option' && token.name === 'dir').length > 1)
    throw fault('INVALID_ARGUMENT', '--dir 只能指定一次');
  if (values.dir !== undefined && !/^[a-z][a-z0-9-]*(\/[a-z][a-z0-9-]*)*$/.test(values.dir))
    throw fault('INVALID_ARGUMENT', '--dir 需要 cases 内的相对目录，例如 table/cells');
  if (values.dir !== undefined && values.case !== undefined) throw fault('INVALID_ARGUMENT', '--dir 与 --case 互斥');
  if (
    (values.list || values.check) &&
    ((values.list && values.check) ||
      values.baseline !== undefined ||
      values.case !== undefined ||
      values.dir !== undefined ||
      values['self-compare'])
  )
    throw fault('INVALID_ARGUMENT', '--list/--check 必须独立使用');
  if (values.baseline !== undefined && !/^[a-f0-9]{40}$/i.test(values.baseline))
    throw fault('INVALID_ARGUMENT', '--baseline 需要完整 40 位 SHA');
  if (values.baseline && values['self-compare']) throw fault('INVALID_ARGUMENT', '--baseline 与 --self-compare 互斥');
  if (values.case !== undefined && !/^[a-z][a-z0-9-]*$/.test(values.case))
    throw fault('INVALID_ARGUMENT', '--case 需要有效用例 ID');
  return values;
}
/** 入口只管理参数、预检模式和运行生命周期。 */
async function main() {
  const options = parseOptions(process.argv.slice(2));
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  if (options.help) {
    console.log(
      'node packages/vtable/scripts/visual-test.mjs [--baseline <40位SHA> | --self-compare] [--dir <目录> | --case <id>]\n默认运行全部本地用例；--dir 递归运行 cases 内的一个目录（例如 table/cells）。\n--list 列举用例；--check 本机环境检查；--help 帮助\n默认：官方 VisActor/VTable develop。退出码：0 通过，1 视觉差异，2 执行错误。'
    );
    return;
  }
  if (options.list || options.check) {
    const cases = await loadCases(path.join(root, 'packages/vtable/__tests__/visual'));
    if (options.list) {
      console.log(
        cases.map(item => `${item.id}\t${item.purpose}\t${item.file}\t${item.sourceExample ?? ''}`).join('\n')
      );
      return;
    }
    await fs.mkdir(path.join(root, '.vtable-visual'), { recursive: true });
    const runtime = createRuntime();
    const detach = runtime.listenSignals();
    try {
      console.log(JSON.stringify({ status: 'passed', ...(await preflight(root, runtime)), cases: cases.length }));
    } finally {
      const errors = await runtime.cleanup();
      detach();
      if (errors.length) throw fault('CLEANUP_FAILED', JSON.stringify(errors));
    }
    return;
  }
  process.exitCode = await runVisual(root, options);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch(error => {
    console.error(`${error.code ?? 'EXECUTION_FAILED'}: ${error.message}`);
    process.exitCode = 2;
  });
