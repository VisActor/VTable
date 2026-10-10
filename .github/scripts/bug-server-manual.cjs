'use strict';

const { readFile, writeFile, appendFile, mkdtemp, rm } = require('node:fs/promises');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const { execFileSync } = require('node:child_process');
const { setTimeout: sleep } = require('node:timers/promises');

/** 控制脚本只运行于默认分支的可信 job，不安装或执行 PR 依赖。 */
function context(env) {
  if (!['VisActor/VChart', 'VisActor/VTable'].includes(env.GITHUB_REPOSITORY)) throw new Error('Unsupported repository');
  if (!env.BUG_SERVER_TOKEN) throw new Error('BUG_SERVER_TOKEN is not configured');
  const runId = Number(env.REPORTED_RUN_ID || env.GITHUB_RUN_ID);
  if (!Number.isSafeInteger(runId) || runId < 1) throw new Error('Invalid workflow run ID');
  if (env.TASK_ID && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(env.TASK_ID)) throw new Error('Invalid task ID');
  // 复用既有 GitHub CI 公网入口；内网页面入口另由 bugserver 的 Host 白名单控制。
  const host = env.BUG_SERVER_HOST || 'https://bug-server.zijieapi.com';
  if (!new Set(['https://bug-server.zijieapi.com', 'https://bugserver.cn.goofy.app', 'https://g20b7465b2.gf-boe.bytedance.net']).has(host)) throw new Error('Unsupported Bug Server host');
  return { env, host, runId };
}

/** 每次重新构造 multipart；服务端 checkpoint 保证重试不重复创建 SCM/截图批次。 */
async function call(ctx, triggerType, fields = {}, filePath) {
  let failure;
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const form = new FormData();
      for (const [key, value] of Object.entries({ token: ctx.env.BUG_SERVER_TOKEN, product: ctx.env.GITHUB_REPOSITORY,
        workflowRunId: String(ctx.runId), ...(ctx.env.TASK_ID ? { manualTaskId: ctx.env.TASK_ID } : {}), triggerType, ...fields })) {
        form.append(key, String(value));
      }
      if (filePath) form.append('bundleFile', new Blob([await readFile(filePath)], { type: 'text/javascript' }), 'index.js');
      const response = await fetch(`${ctx.host}/api/ci/trigger`, { method: 'POST', body: form,
        signal: AbortSignal.timeout(75000), redirect: 'error' });
      const result = await response.json();
      if (!response.ok || result.code !== 0) {
        const error = new Error(result.msg || `CI API returned ${response.status}`);
        error.retryable = response.status >= 500 || error.message.includes('STEP_PENDING');
        throw error;
      }
      return result.data;
    } catch (error) {
      failure = error;
      if (error.retryable === false || (error.retryable === undefined && !['TypeError', 'TimeoutError', 'AbortError', 'SyntaxError'].includes(error.name))) throw error;
      if (attempt < 7) await sleep(20000);
    }
  }
  throw failure;
}

/** artifact 经 GitHub 重定向后不再携带 token，压缩包只交给可信的严格提取器。 */
async function downloadBundle(ctx, artifact, destination) {
  if (!Number.isSafeInteger(artifact?.id) || artifact.id < 1 || !ctx.env.GH_TOKEN) throw new Error('Invalid artifact or missing GitHub token');
  const initial = await fetch(`https://api.github.com/repos/${ctx.env.GITHUB_REPOSITORY}/actions/artifacts/${artifact.id}/zip`, {
    headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10', Authorization: `Bearer ${ctx.env.GH_TOKEN}` },
    redirect: 'manual', signal: AbortSignal.timeout(20000),
  });
  if (initial.status !== 302) throw new Error('GitHub did not return an artifact download URL');
  const location = new URL(initial.headers.get('location'));
  if (location.protocol !== 'https:') throw new Error('Invalid artifact redirect');
  const response = await fetch(location, { signal: AbortSignal.timeout(60000), redirect: 'error' });
  if (!response.ok || !response.body) throw new Error('Artifact download failed');
  const parts = [];
  let size = 0;
  for await (const part of response.body) {
    size += part.length;
    if (size > 72 * 1024 * 1024) throw new Error('Artifact archive exceeds the size limit');
    parts.push(part);
  }
  const directory = await mkdtemp(join(tmpdir(), 'bugserver-archive-'));
  try {
    const archive = join(directory, 'bundle.zip');
    await writeFile(archive, Buffer.concat(parts));
    execFileSync('python3', [join(__dirname, 'extract_bug_server_bundle.py'), archive, destination], { stdio: 'pipe' });
  } finally { await rm(directory, { recursive: true, force: true }); }
}

/** 冻结元数据写入 job outputs；复用失败时自动退回无凭据的构建 job。 */
async function prepare(ctx) {
  const data = await call(ctx, 'manual-info');
  if (!/^[a-f0-9]{40}$/.test(data.headSha) || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(data.headRepository)) throw new Error('Invalid frozen PR metadata');
  let reused = false;
  if (data.artifact) {
    try { await downloadBundle(ctx, data.artifact, join(ctx.env.RUNNER_TEMP, 'manual-bundle', 'index.js')); reused = true; }
    catch { console.info('Existing artifact is unavailable or invalid; building the frozen head instead.'); }
  }
  await appendFile(ctx.env.GITHUB_OUTPUT, `head_sha=${data.headSha}\nhead_repository=${data.headRepository}\nreused=${reused}\n`);
}

/** 串行轮询有总截止时间，不使用可能重叠请求的 setInterval。 */
async function waitFor(action, finished, duration, label) {
  const deadline = Date.now() + duration;
  while (Date.now() < deadline) {
    const result = await action();
    if (finished(result)) return result;
    await sleep(30000);
  }
  const error = new Error(`${label} timed out`);
  error.outcome = 'timed_out';
  throw error;
}

/** 新链路仅触发截图；产物是数据，始终从本轮固定 artifact 获取。 */
async function submit(ctx) {
  const directory = await mkdtemp(join(tmpdir(), 'bugserver-submit-'));
  try {
    const { artifact } = await call(ctx, 'manual-artifact');
    const file = join(directory, 'index.js');
    await downloadBundle(ctx, artifact, file);
    await call(ctx, 'upload-file', {}, file);
    const { scmVersion } = await call(ctx, 'scm-build');
    console.info(`SCM version: ${scmVersion}`);
    await waitFor(() => call(ctx, 'scm-version-info'), result => {
      if (result.status === 'build_failed') throw new Error('SCM build failed');
      return result.status === 'build_ok';
    }, 10 * 60000, 'SCM build');
    const { bundleId } = await call(ctx, 'photo-test');
    console.info(`Screenshot bundle: ${bundleId}`);
    await waitFor(() => call(ctx, 'photo-result'), result => result.status === 'ok', 150 * 60000, 'Screenshot test');
    const task = await call(ctx, 'manual-finish');
    console.info(`Manual PR result: ${task.outcome}`);
    return task.outcome === 'passed' ? 0 : 1;
  } catch (error) {
    // 失败结论也通过同一任务结束接口发送；独立 workflow_run 是取消/强制超时的兜底。
    await call(ctx, 'manual-finish', { outcome: error.outcome || 'failed', error: error.message });
    throw error;
  } finally { await rm(directory, { recursive: true, force: true }); }
}

/** 完成回报只传源 run ID，具体任务和结论由服务端核对 GitHub 后确定。 */
async function run(mode, env = process.env) {
  const ctx = context(env);
  if (mode === 'prepare') { await prepare(ctx); return 0; }
  if (mode === 'submit') return submit(ctx);
  if (mode === 'complete') { await call(ctx, 'manual-finish'); return 0; }
  throw new Error('Unknown manual workflow command');
}

module.exports = { context, call, downloadBundle, run };
if (require.main === module) run(process.argv[2]).then(code => { process.exitCode = code; }).catch(() => {
  // 不输出响应正文、multipart、签名 URL 或 token；详情在 bugserver 任务记录中查看。
  console.error('Manual PR workflow failed; see the Bug Server task record for details.');
  process.exitCode = 1;
});
