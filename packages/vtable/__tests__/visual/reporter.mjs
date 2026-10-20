import fs from 'node:fs';
import path from 'node:path';
import { stripVTControlCharacters } from 'node:util';

/** 每个完成用例即保存证据，不依赖进程正常结束才落盘。 */
export default class VisualReporter {
  tests = [];
  errors = [];
  onError(error) {
    // 记录 worker 等运行级错误，并保留已完成用例。
    this.errors.push(stripVTControlCharacters(error.message ?? String(error)));
    this.persist(false);
  }
  onTestEnd(test, result) {
    // diff 标记仅由截图适配层在确认原生比较证据完整后添加。
    const difference = result.attachments.some(item => item.name === 'visual-difference');
    const stage = test.annotations.find(item => item.type === 'stage')?.description ?? 'setup';
    const category =
      result.status === 'timedOut'
        ? 'timeout'
        : test.annotations.find(item => item.type === 'failure-category')?.description || stage;
    const codes = {
      resource: 'RESOURCE_FAILED',
      render: 'RENDER_FAILED',
      interaction: 'INTERACTION_ASSERTION_FAILED',
      verify: 'CASE_ASSERTION_FAILED',
      screenshot: 'SCREENSHOT_FAILED',
      comparison: 'COMPARISON_FAILED',
      timeout: 'TIMEOUT',
      missing_artifact: 'MISSING_ARTIFACT',
      setup: 'PREFLIGHT_FAILED'
    };
    this.browser = test.annotations.find(item => item.type === 'browser')?.description ?? this.browser;
    this.tests.push({
      id: test.title,
      status:
        result.status === 'passed'
          ? 'passed'
          : result.status === 'skipped'
          ? 'not_run'
          : result.status === 'failed' && difference
          ? 'diff'
          : 'error',
      stage,
      category,
      code:
        result.status === 'passed'
          ? null
          : result.status === 'skipped'
          ? 'RUN_INCOMPLETE'
          : difference
          ? 'VISUAL_DIFFERENCE'
          : codes[category] ?? 'EXECUTION_FAILED',
      durationMs: result.duration,
      errors: result.errors.map(error => stripVTControlCharacters(error.message ?? String(error))),
      attachments: result.attachments
        .filter(item => item.path)
        .map(item => ({
          name: item.name,
          contentType: item.contentType,
          path: path.relative(process.env.VISUAL_RUN_DIR, item.path).split(path.sep).join('/')
        }))
    });
    this.persist(false);
  }
  persist(finalized, endedStatus) {
    // 原子替换阶段结果；未终结的阶段始终不宣称完整成功。
    const status =
      !finalized ||
      this.errors.length ||
      !this.tests.length ||
      this.tests.some(test => ['error', 'not_run'].includes(test.status)) ||
      ['interrupted', 'timedout'].includes(endedStatus)
        ? 'error'
        : this.tests.some(test => test.status === 'diff')
        ? 'diff'
        : 'passed';
    const file = path.join(process.env.VISUAL_RUN_DIR, `${process.env.VISUAL_PHASE}-result.json`);
    const temporary = `${file}.tmp`;
    fs.writeFileSync(
      temporary,
      JSON.stringify({ finalized, status, browser: this.browser, tests: this.tests, errors: this.errors }, null, 2)
    );
    fs.renameSync(temporary, file);
  }
  onEnd(result) {
    // 最终更新状态，保留每个用例独立写入的原始诊断。
    this.persist(true, result.status);
  }
}
