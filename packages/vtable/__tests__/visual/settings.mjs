/** 两阶段共用的确定性环境与像素比较策略。 */
export const settings = {
  viewport: { width: 1000, height: 800 },
  table: { width: 800, height: 600 },
  deviceScaleFactor: 1,
  locale: 'en-US',
  timezoneId: 'UTC',
  fontFamily: 'Arial',
  timeout: 30000,
  stableTimeout: 5000,
  comparison: { threshold: 0.1, maxDiffPixels: 0 }
};
