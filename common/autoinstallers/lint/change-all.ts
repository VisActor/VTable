import path from 'path';
import chalk from 'chalk';
import minimist, { ParsedArgs } from 'minimist';
import { spawnSync, execSync } from 'child_process';

interface RunScriptArgv extends ParsedArgs {
  message?: string;
  type?: string;
  'not-commit'?: boolean; 
}

function run() {
  const commitLineConfigPath = path.resolve(__dirname, './commitlint.config.js');
  const commitLintBinPath = path.resolve(__dirname, './node_modules/.bin/commitlint');
  const argv: RunScriptArgv = minimist(process.argv.slice(2));
  let message = argv.message;
  let bumpType = argv.type;
  let notCommit = argv['not-commit']

  if (!message) {
    const lastCommitMessage = execSync('git log -1 --pretty=%B ').toString();

    if (!lastCommitMessage) {
      process.exit(1);
    }

    console.log(chalk.green(`[Notice] no message is supplied, we'll use latest commit mesage: ${chalk.red.bold(lastCommitMessage)}`));
    message = lastCommitMessage;
  } else {
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
  }

  if (!bumpType) {
    console.log(chalk.green(`[Notice] no bumpType is supplied, we'll use default bumpType: ${chalk.red.bold('patch')}`));
    bumpType = 'patch';
  }

  spawnSync('sh', ['-c', `rush change --bulk --bump-type '${bumpType}' --message '${message}'`], {
    stdio: 'inherit',
    shell: false,
  });

  if (!notCommit) {
    spawnSync('sh', ['-c', 'git add --all'], {
      stdio: 'inherit',
      shell: false,
    });
  
    spawnSync('sh', ['-c', `git commit -m 'docs: update changlog of rush'`], {
      stdio: 'inherit',
      shell: false,
    });
  }

}

run();