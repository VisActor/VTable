import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HOST = '127.0.0.1';
const PORT = readNumber('BENCHMARK_PORT', 4173);
const ROUNDS = readNumber('BENCHMARK_ROUNDS', 5);
const WARMUP_ROUNDS = readNumber('BENCHMARK_WARMUP_ROUNDS', 1);
const DURATION = readNumber('BENCHMARK_DURATION', 1500);
const ROWS = readNumber('BENCHMARK_ROWS', 30000);
const COLUMNS = readNumber('BENCHMARK_COLUMNS', 64);
const TIMEOUT = readNumber('BENCHMARK_TIMEOUT', 30000);
const MAX_SCROLL_P95_RATIO = readNumber('BENCHMARK_MAX_SCROLL_P95_RATIO', 2.6);
const MAX_JUMP_DURATION_RATIO = readNumber('BENCHMARK_MAX_JUMP_DURATION_RATIO', 3.1);
const MAX_JUMP_ELAPSED_RATIO = readNumber('BENCHMARK_MAX_JUMP_ELAPSED_RATIO', 1.7);

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const viteCli = path.join(rootDirectory, 'node_modules', 'vite', 'bin', 'vite.js');
const serverUrl = `http://${HOST}:${PORT}`;
let server;
let browser;
let serverOutput = '';

function readNumber(name, defaultValue) {
  const rawValue = process.env[name];
  if (rawValue === undefined) {
    return defaultValue;
  }
  const value = Number(rawValue);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative number`);
  }
  return value;
}

function validateConfiguration() {
  const integerValues = [
    ['BENCHMARK_PORT', PORT],
    ['BENCHMARK_ROUNDS', ROUNDS],
    ['BENCHMARK_WARMUP_ROUNDS', WARMUP_ROUNDS],
    ['BENCHMARK_ROWS', ROWS],
    ['BENCHMARK_COLUMNS', COLUMNS]
  ];
  for (const [name, value] of integerValues) {
    if (!Number.isInteger(value)) {
      throw new Error(`${name} must be an integer`);
    }
  }
  if (PORT < 1 || PORT > 65535 || ROUNDS < 1 || DURATION <= 0 || ROWS < 100 || COLUMNS < 42 || TIMEOUT <= 0) {
    throw new Error(
      'Benchmark configuration requires a valid port, at least one round, positive duration/timeout, 100 rows, and 42 columns'
    );
  }
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function percentile(values, percentileValue) {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil((percentileValue / 100) * sorted.length) - 1)];
}

function round(value) {
  return Number(value.toFixed(2));
}

function summarizeSample(result) {
  const frameBudget = 1000 / 60;
  return {
    elapsed: result.elapsed,
    jumpDuration: result.jumpDuration ?? 0,
    frameGapP95: percentile(result.frameGaps, 95),
    frameGapP99: percentile(result.frameGaps, 99),
    maxFrameGap: Math.max(0, ...result.frameGaps),
    missedFrameTime: result.frameGaps.reduce((total, gap) => total + Math.max(0, gap - frameBudget), 0),
    longTaskTime: result.longTasks.reduce((total, duration) => total + duration, 0),
    maxLongTask: Math.max(0, ...result.longTasks),
    scrollEvents: result.scrollEvents,
    cellUpdates: result.cellUpdates,
    cellUpdatesByType: result.cellUpdatesByType
  };
}

function summarizeRuns(samples) {
  const numericKeys = [
    'elapsed',
    'jumpDuration',
    'frameGapP95',
    'frameGapP99',
    'maxFrameGap',
    'missedFrameTime',
    'longTaskTime',
    'maxLongTask',
    'scrollEvents',
    'cellUpdates'
  ];
  return Object.fromEntries(numericKeys.map(key => [key, round(median(samples.map(sample => sample[key])))]));
}

function findBrowserExecutable() {
  if (process.env.BENCHMARK_BROWSER_EXECUTABLE_PATH) {
    return process.env.BENCHMARK_BROWSER_EXECUTABLE_PATH;
  }
  const candidates =
    process.platform === 'darwin'
      ? [
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          '/Applications/Chromium.app/Contents/MacOS/Chromium'
        ]
      : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  return candidates.find(candidate => fs.existsSync(candidate));
}

async function waitForServer() {
  const deadline = Date.now() + TIMEOUT;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Vite exited before becoming ready:\n${serverOutput}`);
    }
    try {
      const response = await fetch(`${serverUrl}/issue-5308-scroll-performance.html`);
      if (response.ok) {
        return;
      }
    } catch {
      // The server is still starting.
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Vite did not start within ${TIMEOUT}ms`);
}

async function runSample(mode, workload) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  const params = new URLSearchParams({
    rows: String(ROWS),
    cols: String(COLUMNS),
    cells: workload,
    frozen: 'off',
    cross: 'off',
    duration: String(DURATION),
    [mode === 'scroll' ? 'auto' : 'jump']: '1'
  });

  try {
    await page.goto(`${serverUrl}/issue-5308-scroll-performance.html?${params}`, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    });
    await page.waitForFunction(() => window.issue5308Init?.ready === true, undefined, { timeout: TIMEOUT });
    await page.waitForFunction(() => window.issue5308Result !== undefined, undefined, { timeout: TIMEOUT });
    if (pageErrors.length > 0) {
      throw new Error(`Page error: ${pageErrors.join('; ')}`);
    }
    const result = await page.evaluate(() => window.issue5308Result);
    return { ...summarizeSample(result), cellUpdatesByType: result.cellUpdatesByType };
  } finally {
    await page.close();
  }
}

async function runScenario(mode) {
  for (let roundIndex = 0; roundIndex < WARMUP_ROUNDS; roundIndex++) {
    await runSample(mode, 'text');
    await runSample(mode, 'complex');
  }

  const samples = { text: [], complex: [] };
  for (let roundIndex = 0; roundIndex < ROUNDS; roundIndex++) {
    const order = roundIndex % 2 === 0 ? ['text', 'complex'] : ['complex', 'text'];
    for (const workload of order) {
      samples[workload].push(await runSample(mode, workload));
    }
  }

  return {
    text: summarizeRuns(samples.text),
    complex: summarizeRuns(samples.complex),
    samples
  };
}

function ratio(complexValue, textValue) {
  return textValue > 0 ? round(complexValue / textValue) : null;
}

function verifyCoverage(results) {
  const expectedTypes = ['checkbox', 'switch', 'button', 'progressbar'];
  for (const mode of ['scroll', 'jump']) {
    for (const sample of results[mode].samples.complex) {
      for (const type of expectedTypes) {
        if (!sample.cellUpdatesByType[type]) {
          throw new Error(`${mode} benchmark did not update any ${type} cells`);
        }
      }
    }
  }
}

function evaluateThresholds(results) {
  const comparisons = {
    scrollP95Ratio: ratio(results.scroll.complex.frameGapP95, results.scroll.text.frameGapP95),
    jumpDurationRatio: ratio(results.jump.complex.jumpDuration, results.jump.text.jumpDuration),
    jumpElapsedRatio: ratio(results.jump.complex.elapsed, results.jump.text.elapsed)
  };
  const failures = [];
  const scrollP95Limit = results.scroll.text.frameGapP95 * MAX_SCROLL_P95_RATIO + 4;
  const jumpDurationLimit = results.jump.text.jumpDuration * MAX_JUMP_DURATION_RATIO + 5;
  const jumpElapsedLimit = results.jump.text.elapsed * MAX_JUMP_ELAPSED_RATIO + 30;

  if (results.scroll.complex.frameGapP95 > scrollP95Limit) {
    failures.push(
      `scroll frame-gap p95 ${results.scroll.complex.frameGapP95}ms exceeds relative limit ${round(
        scrollP95Limit
      )}ms`
    );
  }
  if (results.jump.complex.jumpDuration > jumpDurationLimit) {
    failures.push(
      `jump synchronous duration ${results.jump.complex.jumpDuration}ms exceeds relative limit ${round(
        jumpDurationLimit
      )}ms`
    );
  }
  if (results.jump.complex.elapsed > jumpElapsedLimit) {
    failures.push(
      `jump elapsed ${results.jump.complex.elapsed}ms exceeds relative limit ${round(jumpElapsedLimit)}ms`
    );
  }

  return {
    comparisons,
    thresholds: {
      maxScrollP95Ratio: MAX_SCROLL_P95_RATIO,
      scrollP95AdditiveTolerance: 4,
      maxJumpDurationRatio: MAX_JUMP_DURATION_RATIO,
      jumpDurationAdditiveTolerance: 5,
      maxJumpElapsedRatio: MAX_JUMP_ELAPSED_RATIO,
      jumpElapsedAdditiveTolerance: 30
    },
    failures
  };
}

function formatSummary(result) {
  return [
    '## VTable scroll performance benchmark',
    '',
    `- Rounds: ${ROUNDS} (+ ${WARMUP_ROUNDS} warmup)`,
    `- Scroll p95: text ${result.scroll.text.frameGapP95}ms, complex ${result.scroll.complex.frameGapP95}ms`,
    `- Jump elapsed: text ${result.jump.text.elapsed}ms, complex ${result.jump.complex.elapsed}ms`,
    `- Ratios: scroll p95 ${result.evaluation.comparisons.scrollP95Ratio}x, jump duration ${result.evaluation.comparisons.jumpDurationRatio}x, jump elapsed ${result.evaluation.comparisons.jumpElapsedRatio}x`,
    `- Status: ${result.evaluation.failures.length === 0 ? 'PASS' : 'FAIL'}`,
    ''
  ].join('\n');
}

async function main() {
  validateConfiguration();
  if (!fs.existsSync(viteCli)) {
    throw new Error(`Vite CLI not found at ${viteCli}. Run Rush install first.`);
  }

  server = spawn(process.execPath, [viteCli, 'serve', 'examples', '--host', HOST, '--port', String(PORT), '--strictPort'], {
    cwd: rootDirectory,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const captureServerOutput = chunk => {
    serverOutput = `${serverOutput}${chunk}`.slice(-4000);
  };
  server.stdout.on('data', captureServerOutput);
  server.stderr.on('data', captureServerOutput);
  await waitForServer();

  const executablePath = findBrowserExecutable();
  browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {})
  });

  const results = {
    configuration: {
      rows: ROWS,
      columns: COLUMNS,
      duration: DURATION,
      rounds: ROUNDS,
      warmupRounds: WARMUP_ROUNDS
    },
    scroll: await runScenario('scroll'),
    jump: await runScenario('jump')
  };
  verifyCoverage(results);
  const evaluation = evaluateThresholds(results);
  const output = { ...results, evaluation };
  const serialized = JSON.stringify(output);

  console.log(formatSummary(output));
  console.log(`VTABLE_BENCHMARK_RESULT=${serialized}`);

  if (process.env.BENCHMARK_OUTPUT) {
    fs.writeFileSync(path.resolve(process.env.BENCHMARK_OUTPUT), `${JSON.stringify(output, null, 2)}\n`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, formatSummary(output));
  }
  if (evaluation.failures.length > 0) {
    throw new Error(`Performance regression:\n${evaluation.failures.join('\n')}`);
  }
}

async function cleanup() {
  await browser?.close();
  server?.kill('SIGTERM');
}

try {
  await main();
} finally {
  await cleanup();
}
