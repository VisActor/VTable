#!/usr/bin/env node
"use strict";

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const bootstrapPath = path.join(__dirname, '../output/bootstrap');

function tryRequireBootstrap() {
  return require(bootstrapPath);
}

try {
  tryRequireBootstrap();
} catch (err) {
  const isMissingBootstrap =
    err &&
    err.code === 'MODULE_NOT_FOUND' &&
    typeof err.message === 'string' &&
    (err.message.includes(bootstrapPath) || err.message.includes('output/bootstrap'));

  if (!isMissingBootstrap) {
    throw err;
  }

  const projectRoot = path.join(__dirname, '..');
  const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
  const outputDir = path.join(projectRoot, 'output');

  if (!fs.existsSync(tsconfigPath)) {
    throw err;
  }

  try {
    const tscBin = require.resolve('typescript/bin/tsc', { paths: [projectRoot] });
    fs.mkdirSync(outputDir, { recursive: true });
    const result = childProcess.spawnSync(process.execPath, [tscBin, '--project', tsconfigPath], { stdio: 'inherit' });
    if (result.status !== 0) {
      process.exit(result.status || 1);
    }
  } catch (compileErr) {
    throw err;
  }

  tryRequireBootstrap();
}
