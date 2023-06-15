import path from 'path';
import chalk from 'chalk';
import minimist, { ParsedArgs } from 'minimist';
import { spawnSync } from 'child_process';

interface RunScriptArgv extends ParsedArgs {
  message?: string;
  type?: string;
}

function run() {
  const commitLineConfigPath = path.resolve(__dirname, './commitlint.config.js');
  const commitLintBinPath = path.resolve(__dirname, './node_modules/.bin/commitlint');
  const argv: RunScriptArgv = minimist(process.argv.slice(2));
  const message = argv.message;
  let bumpType = argv.type;

  if (message) {
    const result = spawnSync(
      'sh',
      ['-c', `echo ${message} | ${commitLintBinPath} --config ${commitLineConfigPath}`],
      {
        stdio: 'inherit'
      }
    );
    
    if (result.status !== 0) {
      process.exit(1);
    }

    if (!bumpType) {
      console.log(chalk.green(`[Notice] no bumpType is supplied, we'll use default bumpType: ${chalk.red.bold('patch')}`));
      bumpType = 'patch';
    }

    spawnSync('sh', ['-c', `rush change --bulk --bump-type '${bumpType}' --message '${message}'`], {
      stdio: 'inherit',
      shell: false,
    });
  }
}

run();
