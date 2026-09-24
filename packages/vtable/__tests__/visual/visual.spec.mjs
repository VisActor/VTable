import fs from 'node:fs/promises';
import { test, expect } from '@playwright/test';
import { cases, loadCase } from './cases/index.mjs';
import { settings } from './settings.mjs';

/** 等待两张连续截图完全一致；持续变化视为执行错误而非像素差异。 */
async function stableScreenshot(page) {
  let previous;
  const deadline = Date.now() + settings.stableTimeout;
  while (Date.now() < deadline) {
    const current = await page.screenshot({ animations: 'disabled', timeout: 5000 });
    if (previous?.equals(current)) return current;
    previous = current;
    await page.waitForTimeout(100);
  }
  throw new Error('截图持续变化，5 秒内未稳定');
}

/** 检查表格确实生成了可见画布与非空像素，避免两侧同为空白时误通过。 */
async function checkDrawing(page, errors) {
  if (errors.length) throw new Error(errors.join('\n'));
  await page.evaluate(() => {
    if (window.__visualErrors.length) throw new Error(window.__visualErrors.join('\n'));
    const container = document.getElementById('table');
    const canvases = [...container.querySelectorAll('canvas')].filter(canvas => canvas.width > 0 && canvas.height > 0);
    if (!canvases.length) throw new Error('没有有效表格画布');
    let ink = 0;
    for (const canvas of canvases) {
      const context = canvas.getContext('2d');
      if (!context) continue;
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 0; i < pixels.length; i += 4)
        if (pixels[i + 3] && (pixels[i] < 245 || pixels[i + 1] < 245 || pixels[i + 2] < 245)) ink++;
    }
    if (ink < 100) throw new Error('表格没有有效绘制');
  });
}

const selectedIds = JSON.parse(process.env.VISUAL_CASE_IDS);
for (const metadata of cases.filter(item => selectedIds.includes(item.id))) {
  const item = { ...metadata, ...(await loadCase(metadata)) };
  test(item.id, async ({ page, browser }, info) => {
    // 记录来源和浏览器版本，并收集整个用例生命周期内的异常。
    info.annotations.push(
      { type: 'purpose', description: item.purpose },
      { type: 'browser', description: browser.version() }
    );
    const stage = { type: 'stage', description: 'resource' };
    info.annotations.push(stage);
    const failure = { type: 'failure-category', description: '' };
    info.annotations.push(failure);
    const errors = [];
    const base = process.env.VISUAL_BASE_URL;
    page.on('pageerror', error => {
      failure.description = 'render';
      errors.push(error.message);
    });
    page.on('requestfailed', request => {
      failure.description = 'resource';
      errors.push(`资源失败：${request.url()} ${request.failure()?.errorText}`);
    });
    page.on('response', response => {
      if (response.status() >= 400) {
        failure.description = 'resource';
        errors.push(`HTTP ${response.status()}：${response.url()}`);
      }
    });
    await page.route('**/*', route => {
      // 截图阶段禁止 CDN 和内网请求。
      if (new URL(route.request().url()).origin === base) return route.continue();
      failure.description = 'resource';
      errors.push(`禁止外部请求：${route.request().url()}`);
      return route.abort();
    });
    try {
      await page.goto(`${base}/suite/page.html?phase=${process.env.VISUAL_PHASE}&case=${item.id}`);
      stage.description = 'render';
      await page.waitForFunction(() => window.__visualReady || window.__visualErrors?.length);
      await checkDrawing(page, errors);
      stage.description = 'interaction';
      await item.exercise?.(page);
      stage.description = item.exercise ? 'interaction' : 'verify';
      await item.verify(page);
      stage.description = 'screenshot';
      await page.evaluate(() => document.fonts.ready);
      const screenshot = await stableScreenshot(page);
      await checkDrawing(page, errors);
      const renderedPath = info.outputPath('rendered.png');
      await fs.writeFile(renderedPath, screenshot);
      await info.attach('rendered', { path: renderedPath, contentType: 'image/png' });
      stage.description = 'comparison';
      const name = `${item.id}.png`;
      if (process.env.VISUAL_PHASE === 'current') {
        // 缺失基线必须在图片断言之前归类为执行错误。
        try {
          await fs.access(info.snapshotPath(name));
        } catch (error) {
          failure.description = 'missing_artifact';
          throw error;
        }
      }
      try {
        expect(screenshot).toMatchSnapshot(name);
      } catch (error) {
        if (process.env.VISUAL_PHASE === 'current' && (await hasComparisonEvidence(info, name)))
          await info.attach('visual-difference', {
            body: Buffer.from('图像存在差异，请检查是否符合预期'),
            contentType: 'text/plain'
          });
        throw error;
      }
    } finally {
      // 显式释放图表，浏览器 context 由 Playwright fixture 自动回收。
      await page.evaluate(() => window.__visualTable?.release?.()).catch(() => {});
    }
  });
}

/** 只有原生比较生成完整 PNG 证据时才允许把断言失败归类为视觉差异。 */
async function hasComparisonEvidence(info, name) {
  const stem = name.slice(0, -4);
  const dimensions = [];
  for (const kind of ['expected', 'actual', 'diff']) {
    const file = info.attachments.find(item => item.name === `${stem}-${kind}.png`)?.path;
    if (!file) return false;
    try {
      const bytes = await fs.readFile(file);
      if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') return false;
      dimensions.push(`${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`);
    } catch {
      return false;
    }
  }
  return new Set(dimensions).size === 1;
}
