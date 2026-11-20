import fs from 'node:fs/promises';
import path from 'node:path';
import { test, expect } from '@playwright/test';
const ids = JSON.parse(process.env.VISUAL_CASE_IDS);
const run = process.env.VISUAL_RUN_DIR;
const captured = JSON.parse(await fs.readFile(path.join(run, 'capture-current.json'), 'utf8'));
for (const id of ids) test(id, async ({}, info) => {
  info.annotations.push({ type: 'stage', description: 'comparison' });
  const item = captured.tests.find(item => item.id === id);
  const image = await fs.readFile(path.join(run, item.attachments.find(file => file.name === 'rendered').path));
  try { expect(image).toMatchSnapshot(`${id}.png`); }
  catch (error) {
    // 差异只接受原生比较器生成的完整三图证据，缺图/尺寸错误仍为执行错误。
    const dimensions = [];
    for (const kind of ['expected', 'actual', 'diff']) {
      const file = info.attachments.find(item => item.name === `${id}-${kind}.png`)?.path;
      if (!file) throw error;
      const png = await fs.readFile(file);
      if (png.length < 24 || png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw error;
      dimensions.push(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`);
    }
    if (new Set(dimensions).size === 1) await info.attach('visual-difference', { body: Buffer.from('原生像素比较存在差异'), contentType: 'text/plain' });
    throw error;
  }
});
