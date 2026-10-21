import fs from 'node:fs/promises';
import path from 'node:path';

/** 转义报告中的动态文本，同时用于 HTML 内容和属性。 */
function escape(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** 复现参数以单引号包裹，避免目录或报告文字被 shell 解释。 */
function quote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

/** 人与 Agent 共用范围说明；未选用例不被描述为已通过。 */
function selectionDescription(report) {
  const selection = report.selection;
  if (!selection) return `范围未记录；本次记录 ${report.cases.length} 个用例`;
  const label =
    selection.mode === 'all'
      ? '全部本地用例'
      : `${selection.mode === 'directory' ? '目录' : '单用例'} ${selection.value}`;
  return `${label}；选中 ${selection.selectedCount} / ${selection.totalCount}；其余 ${
    selection.totalCount - selection.selectedCount
  } 个未执行`;
}

/** 将已存在的运行内文件转换为可搬迁的相对路径，拒绝越界引用。 */
async function artifact(runDir, relative) {
  if (!relative || path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) return null;
  try {
    return (await fs.stat(path.join(runDir, relative))).isFile() ? relative : null;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

/** 汇合两阶段结果；缺少图片或未完成比较不能被解释为通过。 */
export async function saveReport(runDir, summary) {
  const phases = {};
  const reportStarted = performance.now();
  const issues = [...(summary.issues ?? [])];
  const selection = summary.selection;
  if (
    selection &&
    (!['all', 'directory', 'case'].includes(selection.mode) ||
      !Number.isSafeInteger(selection.totalCount) ||
      selection.totalCount < summary.cases.length ||
      selection.selectedCount !== summary.cases.length ||
      !Array.isArray(selection.selectedIds) ||
      selection.selectedIds.length !== summary.cases.length ||
      new Set(selection.selectedIds).size !== summary.cases.length ||
      summary.cases.some(item => !selection.selectedIds.includes(item.id)) ||
      (selection.mode === 'all' && (selection.value !== null || selection.totalCount !== selection.selectedCount)) ||
      (selection.mode !== 'all' && typeof selection.value !== 'string') ||
      (selection.mode === 'case' && (selection.selectedCount !== 1 || selection.selectedIds[0] !== selection.value)))
  )
    issues.push({
      phase: 'report',
      category: 'execution',
      code: 'RESULT_SET_MISMATCH',
      message: '报告范围与选中用例集合不一致'
    });
  for (const phase of ['baseline', 'current']) {
    phases[phase] = summary[`${phase}Result`];
    if (!phases[phase]) {
      try {
        phases[phase] = JSON.parse(await fs.readFile(path.join(runDir, `${phase}-result.json`), 'utf8'));
      } catch (error) {
        if (error.code !== 'ENOENT')
          issues.push({ phase, category: 'report', code: 'REPORT_FAILED', message: String(error) });
      }
    }
    for (const message of phases[phase]?.errors ?? [])
      issues.push({ phase, category: 'execution', code: 'EXECUTION_FAILED', message });
  }
  if (summary.error)
    issues.push({ phase: summary.stage ?? 'preparation', category: 'execution', message: summary.error });
  if (summary.cleanupError) issues.push({ phase: 'cleanup', category: 'execution', message: summary.cleanupError });
  for (const [phase, result] of Object.entries(phases)) {
    if (!result) continue;
    const expected = summary.cases.map(item => item.id);
    const actual = result.tests.map(item => item.id);
    if (
      actual.length !== expected.length ||
      new Set(actual).size !== actual.length ||
      actual.some(id => !expected.includes(id))
    )
      issues.push({ phase, category: 'execution', code: 'RESULT_SET_MISMATCH', message: '阶段结果与选择集不一致' });
    if (result.finalized === false)
      issues.push({ phase, category: 'execution', code: 'RUN_INCOMPLETE', message: '阶段异常结束，保留已完成用例' });
  }
  // 预检失败时尚未解析基线，复现仍应保留用户请求的 SHA 或自比较模式。
  const baselineSha = summary.baseline?.sha ?? summary.request?.baseline;
  const baselineArg =
    summary.baseline?.repository === 'working-tree' || summary.request?.['self-compare']
      ? '--self-compare'
      : baselineSha
      ? `--baseline ${baselineSha}`
      : '';
  const cases = [];
  for (const item of summary.cases) {
    const baseline = phases.baseline?.tests.find(test => test.id === item.id);
    const current = phases.current?.tests.find(test => test.id === item.id);
    const errors = [];
    const images = { baseline: null, current: null, diff: null };
    for (const [phase, result] of [
      ['baseline', baseline],
      ['current', current]
    ]) {
      for (const message of result?.errors ?? []) {
        errors.push({
          phase,
          stage: result.stage ?? 'execution',
          category: result.status === 'diff' ? 'visual_difference' : result.category ?? 'execution',
          code: result.code ?? (result.status === 'diff' ? 'VISUAL_DIFFERENCE' : 'EXECUTION_FAILED'),
          message
        });
      }
      images[phase] = await artifact(runDir, result?.attachments?.find(file => file.name === 'rendered')?.path);
      if (['passed', 'diff'].includes(result?.status) && !images[phase]) {
        errors.push({
          phase,
          stage: 'report',
          category: 'missing_artifact',
          code: 'MISSING_ARTIFACT',
          message: '缺少最终截图'
        });
      }
    }
    images.diff = await artifact(runDir, current?.attachments?.find(file => file.name.endsWith('-diff.png'))?.path);
    if (current?.status === 'diff' && !images.diff)
      errors.push({
        phase: 'current',
        stage: 'report',
        category: 'missing_artifact',
        code: 'MISSING_ARTIFACT',
        message: '缺少差异图'
      });
    const executionError =
      errors.some(error => error.category !== 'visual_difference') ||
      [baseline, current].some(result => result?.status === 'error');
    const status = executionError
      ? 'error'
      : baseline?.status !== 'passed' || !current || current.status === 'not_run'
      ? 'not_run'
      : current.status;
    const attachments = [];
    for (const [phase, result] of [
      ['baseline', baseline],
      ['current', current]
    ]) {
      for (const file of result?.attachments ?? []) {
        const relative = await artifact(runDir, file.path);
        if (relative) attachments.push({ phase, ...file, path: relative });
      }
    }
    cases.push({
      ...item,
      status,
      ...(status === 'not_run'
        ? {
            blockedBy: {
              phase: baseline?.status === 'passed' ? 'current' : 'baseline',
              reason: '前序阶段失败或该阶段未完成'
            }
          }
        : {}),
      phases: { baseline: baseline?.status ?? 'not_run', current: current?.status ?? 'not_run' },
      durationMs: (baseline?.durationMs ?? 0) + (current?.durationMs ?? 0),
      images,
      attachments,
      errors,
      rerun: `node packages/vtable/scripts/visual-test.mjs ${baselineArg} --case ${quote(item.id)}`.replace('  ', ' ')
    });
  }
  const counts = Object.fromEntries(
    ['passed', 'diff', 'error', 'not_run'].map(status => [status, cases.filter(item => item.status === status).length])
  );
  const complete =
    cases.length > 0 &&
    cases.every(item => ['passed', 'diff'].includes(item.status)) &&
    !issues.some(issue => ['RESULT_SET_MISMATCH', 'RUN_INCOMPLETE'].includes(issue.code));
  const status = summary.status === 'error' || issues.length || !complete ? 'error' : counts.diff ? 'diff' : 'passed';
  const logs = {};
  for (const name of [
    'build.log',
    'baseline.log',
    'current.log',
    'baseline-report/index.html',
    'current-report/index.html'
  ]) {
    const relative = await artifact(runDir, name);
    if (relative) logs[name] = relative;
  }
  const { baselineResult, currentResult, ...metadata } = summary;
  const report = {
    ...metadata,
    schemaVersion: 1,
    finalized: summary.finalized ?? true,
    status,
    complete,
    counts,
    cases,
    issues,
    logs,
    rerun: selection
      ? [
          'node packages/vtable/scripts/visual-test.mjs',
          baselineArg,
          selection.mode === 'all'
            ? ''
            : `${selection.mode === 'directory' ? '--dir' : '--case'} ${quote(selection.value)}`
        ]
          .filter(Boolean)
          .join(' ')
      : null,
    environment: {
      ...summary.environment,
      browser: phases.current?.browser ?? phases.baseline?.browser ?? summary.environment.browser
    }
  };
  // 汇总只生成新对象；HTML 和 Markdown 不改变调用方的状态。
  report.timings = { ...summary.timings, reportMs: Math.round(performance.now() - reportStarted) };
  await writeJson(path.join(runDir, 'summary.json'), report);
  await fs.writeFile(path.join(runDir, 'agent-summary.md'), agentSummary(report));
  await fs.writeFile(path.join(runDir, 'index.html'), renderHtml(report));
  report.timings.reportMs = Math.round(performance.now() - reportStarted);
  if (report.timings.totalMs !== undefined) report.timings.totalMs += report.timings.reportMs;
  await writeJson(path.join(runDir, 'summary.json'), report);
  await fs.writeFile(path.join(runDir, 'agent-summary.md'), agentSummary(report));
  await fs.writeFile(path.join(runDir, 'index.html'), renderHtml(report));
  return report;
}

/** 输出失败优先的纯文本入口，让 Agent 按路径读取证据而非消耗 Base64。 */
function agentSummary(report) {
  const lines = [
    '# VTable 视觉回归结果',
    '',
    `状态：${report.status}；完整比较：${report.complete}；${JSON.stringify(report.counts)}`,
    `测试范围：${selectionDescription(report)}`,
    ...(report.rerun ? [`本次范围复现：\`${report.rerun}\``] : []),
    '',
    `基线：${report.baseline?.repository ?? '未解析'} @ ${report.baseline?.sha ?? '未解析'}`,
    `本地：${report.local?.head ?? '未知'}；dirty=${report.local?.dirty ?? '未知'}；工作区摘要=${
      report.local?.digest ?? '未知'
    }`,
    `环境：${JSON.stringify(report.environment)}`,
    '',
    '完整结构化结果：[summary.json](summary.json)（schemaVersion=1）；所有证据路径相对于此报告目录。',
    '以下记录测试事实，不判断差异是否属于缺陷。复现命令在仓库根目录执行；基线 SHA 固定，本地工作区需要与摘要一致。',
    '用例 source.path 指向仓库文件；source.frozenPath 指向本次运行冻结文件。',
    '截图需由支持图片的 Agent 按需打开；本报告不调用模型，也不自动接受差异。',
    ''
  ];
  for (const issue of report.issues)
    lines.push(
      `## 运行错误：${issue.phase} / ${issue.code ?? issue.category}`,
      '',
      ...issue.message.split('\n').map(line => `> ${line}`),
      ''
    );
  for (const item of report.cases.filter(item => item.status !== 'passed')) {
    lines.push(
      `## ${item.id} — ${item.status}`,
      '',
      item.purpose,
      '',
      `源码：${item.source?.path ?? '未知'}:${item.source?.line ?? '?'}；冻结副本：${
        item.source?.frozenPath ?? '未知'
      }`,
      `阶段：${JSON.stringify(item.phases)}`,
      '',
      `复现：\`${item.rerun}\``,
      ''
    );
    for (const [kind, file] of Object.entries(item.images))
      lines.push(`- ${kind}：${file ? `[${file}](${file})` : '未生成或缺失'}`);
    for (const error of item.errors)
      lines.push(
        '',
        `${error.phase} / ${error.stage} / ${error.code ?? error.category}`,
        ...error.message.split('\n').map(line => `> ${line}`)
      );
    lines.push('');
  }
  if (report.complete && !report.counts.diff) lines.push('所选用例全部通过，详情见 summary.json。', '');
  lines.push('## 日志与详细报告', '', ...Object.values(report.logs).map(file => `- [${file}](${file})`), '');
  return lines.join('\n');
}

/** 生成无需服务和网络的三图报告；原图链接保留完整分辨率。 */
function renderHtml(report) {
  const labels = { passed: '通过', diff: '视觉差异', error: '执行错误', not_run: '未完成' };
  const link = (file, label) => `<a href="${escape(file)}">${escape(label)}</a>`;
  const baseline = report.baseline?.repository === 'working-tree' ? '工作区自比较' : '官方基线';
  const cards = report.cases
    .map(
      item => `<article data-status="${item.status}" data-id="${escape(item.id)}">
    <div class="case-title"><h2>${escape(item.id)}</h2><span class="badge ${item.status}">${
        labels[item.status]
      }</span><span>${(item.durationMs / 1000).toFixed(1)}s</span></div>
    <p>${escape(item.purpose)}</p><div class="images">${[
        ['baseline', `${baseline} · ${report.baseline?.sha?.slice(0, 8) ?? '?'}`],
        ['current', `本地 · ${report.local?.head?.slice(0, 8) ?? '?'}${report.local?.dirty ? ' + 未提交修改' : ''}`],
        ['diff', 'Diff · 差异图']
      ]
        .map(
          ([kind, title]) =>
            `<figure><figcaption>${escape(title)}</figcaption>${
              item.images[kind]
                ? `<a href="${escape(
                    item.images[kind]
                  )}" target="_blank" rel="noopener" title="打开原始分辨率图片"><img loading="lazy" src="${escape(
                    item.images[kind]
                  )}" alt="${escape(`${item.id} ${title}`)}"></a>`
                : `<div class="empty">${
                    kind === 'diff' && item.status === 'passed' ? '无视觉差异' : '未生成或缺失；请查看状态与诊断'
                  }</div>`
            }</figure>`
        )
        .join('')}</div>
    <p class="source">用例：${escape(item.source?.path)}:${item.source?.line ?? '?'} · ${
        item.source?.frozenPath ? link(item.source.frozenPath, '查看冻结用例') : ''
      } · baseline=${item.phases.baseline} / current=${item.phases.current}</p>
    <div class="command"><code>${escape(item.rerun)}</code><button type="button" class="copy">复制命令</button></div>
    ${
      item.errors.length
        ? `<details ${item.status === 'error' ? 'open' : ''}><summary>诊断（${
            item.errors.length
          }）</summary>${item.errors
            .map(
              error =>
                `<h3>${escape(`${error.phase} / ${error.stage} / ${error.code ?? error.category}`)}</h3><pre>${escape(
                  error.message
                )}</pre>`
            )
            .join('')}</details>`
        : ''
    }
    ${
      item.attachments.length
        ? `<details><summary>证据文件</summary><ul>${item.attachments
            .map(file => `<li>${escape(file.phase)} · ${link(file.path, file.name)}</li>`)
            .join('')}</ul></details>`
        : ''
    }</article>`
    )
    .join('');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VTable 视觉回归 · ${
    labels[report.status]
  }</title>
  <style>
  *{box-sizing:border-box}body{margin:0;background:#f4f6fa;color:#18283e;font:14px/1.6 system-ui,sans-serif}header{background:#14243a;color:white;padding:24px 32px}header p{color:#cbd5e1;margin:4px 0}h1{font-size:24px;margin:0 0 8px}h2{font-size:19px;margin:0}h3{font-size:14px}main{max-width:1600px;margin:auto;padding:24px}a{color:#175bcc}header a{color:#a8c9ff}nav{display:flex;gap:18px;flex-wrap:wrap;margin-top:16px}.stats{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px}.stat,article,.run-error,.metadata{background:white;border:1px solid #dce2ec;border-radius:8px;padding:18px}.stat{flex:1;min-width:130px}.stat strong{font-size:25px;display:block}.filters{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:18px 0}select,button{font:inherit;padding:6px 10px;border:1px solid #bcc8d9;background:white;border-radius:5px;color:#18283e}button{cursor:pointer}article{margin:18px 0}.case-title{display:flex;gap:14px;align-items:center}.badge{padding:2px 10px;border-radius:20px}.passed{color:#176642;background:#e7f5eb}.diff{color:#8a5000;background:#fff2ce}.error{color:#b12733;background:#ffebee}.not_run{color:#536077;background:#edf0f5}.images{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}figure{margin:0;border:1px solid #dce2ec;border-radius:4px;overflow:hidden;background:#fff}figcaption{padding:10px;background:#f7f9fc;border-bottom:1px solid #dce2ec;font-weight:600}img{width:100%;display:block}.empty{aspect-ratio:5/4;display:grid;place-items:center;color:#68758a;text-align:center;padding:20px}.source{color:#68758a;overflow-wrap:anywhere}.command{display:flex;gap:12px;align-items:center;background:#f4f6fa;padding:10px}.command code{flex:1;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f4f6fa;padding:12px}details{margin-top:12px}summary{cursor:pointer}.run-error{border-left:4px solid #bd3340;margin:12px 0}[hidden]{display:none!important}@media(max-width:760px){header{padding:20px}main{padding:12px}.images{overflow-x:auto;grid-template-columns:repeat(3,300px)}.command{align-items:flex-start;flex-direction:column}}
  </style></head><body><header><h1>VTable 视觉回归 · ${labels[report.status]}</h1><p>${escape(report.startedAt)} · ${
    report.complete ? '所选用例完成比较' : '比较未完整完成'
  } · ${escape(report.environment.platform)} / ${escape(report.environment.arch)} · Chromium ${escape(
    report.environment.browser ?? '未启动'
  )}</p><p>基线 ${escape(report.baseline?.sha ?? '未解析')} · 本地 ${escape(report.local?.head ?? '未解析')}${
    report.local?.dirty ? '（有未提交修改）' : ''
  }</p><p data-testid="selection">${escape(selectionDescription(report))}</p><nav>${link(
    'summary.json',
    '结构化 JSON'
  )}${link('agent-summary.md', 'Agent 摘要')}${Object.values(report.logs)
    .map(file => link(file, file))
    .join('')}</nav></header>
  <main><div class="stats">${Object.entries(report.counts)
    .map(([status, count]) => `<div class="stat"><strong>${count}</strong>${labels[status]}</div>`)
    .join('')}</div>
  <p>同机、同一套用例对比。点击图片打开原图；视觉差异需要审查，不自动判为缺陷。</p>
  ${
    report.rerun
      ? `<p>本次范围复现：</p><div class="command"><code>${escape(
          report.rerun
        )}</code><button type="button" class="copy">复制命令</button></div>`
      : ''
  }
  ${report.issues
    .map(
      issue =>
        `<section class="run-error"><strong>${escape(
          `${issue.phase} / ${issue.code ?? issue.category}`
        )}</strong><pre>${escape(issue.message)}</pre></section>`
    )
    .join('')}
  <div class="filters"><label>状态 <select id="status"><option value="issues" ${
    report.counts.diff + report.counts.error + report.counts.not_run ? 'selected' : ''
  }>问题用例</option><option value="all" ${
    report.counts.diff + report.counts.error + report.counts.not_run ? '' : 'selected'
  }>全部</option>${Object.entries(labels)
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join('')}</select></label><label>用例 <select id="case"><option value="all">全部用例</option>${report.cases
    .map(item => `<option value="${escape(item.id)}">${escape(item.id)}</option>`)
    .join('')}</select></label><span id="visible" aria-live="polite"></span></div>${cards}
  <details class="metadata"><summary>环境、源码摘要与阶段耗时</summary><pre>${escape(
    JSON.stringify(
      {
        local: report.local,
        selection: report.selection,
        baseline: report.baseline,
        environment: report.environment,
        suiteDigest: report.suiteDigest,
        bundles: report.bundles,
        timings: report.timings
      },
      null,
      2
    )
  )}</pre></details></main>
  <script>
  const statusFilter = document.getElementById('status');
  const caseFilter = document.getElementById('case');
  // 同时按状态与用例过滤，默认优先展示需要检查的结果。
  function filter() {
    let visible = 0;
    for (const card of document.querySelectorAll('article')) {
      card.hidden = !(statusFilter.value === 'all' || (statusFilter.value === 'issues' ? card.dataset.status !== 'passed' : card.dataset.status === statusFilter.value)) || !(caseFilter.value === 'all' || caseFilter.value === card.dataset.id);
      if (!card.hidden) visible++;
    }
    document.getElementById('visible').textContent = '显示 ' + visible + ' 个用例';
  }
  statusFilter.addEventListener('change', filter); caseFilter.addEventListener('change', filter); filter();
  for (const button of document.querySelectorAll('.copy')) button.addEventListener('click', async () => {
    // file:// 的剪贴板权限因浏览器而异，失败时保留可手动复制的命令。
    try { await navigator.clipboard.writeText(button.previousElementSibling.textContent); button.textContent = '已复制'; }
    catch { button.textContent = '请选中命令复制'; }
  });
  </script></body></html>`;
}

/** 在报告目录内原子替换 JSON，避免读者看到半写入的终态。 */
async function writeJson(file, value) {
  const temporary = `${file}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(value, null, 2));
  await fs.rename(temporary, file);
}
