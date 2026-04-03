/* eslint-disable */
var fs = require('fs');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

function main() {
  var repoRoot = path.resolve(__dirname, '../../../..');
  var depsDir = path.join(repoRoot, '.react19-deps');
  var pkgJson = path.join(depsDir, 'package.json');

  if (!fs.existsSync(pkgJson)) {
    console.error('[react19-deps] Missing ' + pkgJson);
    process.exit(1);
  }

  var reactPkg = path.join(depsDir, 'node_modules', 'react', 'package.json');
  var reactDomPkg = path.join(depsDir, 'node_modules', 'react-dom', 'package.json');
  var reconcilerPkg = path.join(depsDir, 'node_modules', 'react-reconciler', 'package.json');
  if (fs.existsSync(reactPkg) && fs.existsSync(reactDomPkg) && fs.existsSync(reconcilerPkg)) {
    return;
  }

  var npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  var hasLock = fs.existsSync(path.join(depsDir, 'package-lock.json'));
  var args = hasLock ? ['ci'] : ['install'];

  var res = spawnSync(npmCmd, args, { cwd: depsDir, stdio: 'inherit' });
  if (typeof res.status === 'number' && res.status !== 0) {
    process.exit(res.status);
  }
  if (res.error) {
    console.error(res.error);
    process.exit(1);
  }
}

main();
