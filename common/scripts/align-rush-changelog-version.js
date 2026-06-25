const fs = require('fs');
const path = require('path');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function alignChangelogJson(packageDir, packageName, releaseVersion) {
  const changelogJsonPath = path.join(packageDir, 'CHANGELOG.json');
  const changelog = JSON.parse(fs.readFileSync(changelogJsonPath, 'utf8'));

  if (!Array.isArray(changelog.entries) || changelog.entries.length === 0) {
    throw new Error(`No changelog entries found in ${changelogJsonPath}`);
  }

  changelog.entries[0].version = releaseVersion;
  changelog.entries[0].tag = `${packageName}_v${releaseVersion}`;
  changelog.entries = changelog.entries.filter((entry, index) => index === 0 || entry.version !== releaseVersion);

  fs.writeFileSync(changelogJsonPath, `${JSON.stringify(changelog, null, 2)}\n`);
}

function alignChangelogMarkdown(packageDir, releaseVersion) {
  const changelogMdPath = path.join(packageDir, 'CHANGELOG.md');
  const changelog = fs.readFileSync(changelogMdPath, 'utf8');
  const match = changelog.match(/^##\s+(.+)$/m);

  if (!match) {
    throw new Error(`No changelog version heading found in ${changelogMdPath}`);
  }

  let nextChangelog = changelog.slice(0, match.index) + `## ${releaseVersion}` + changelog.slice(match.index + match[0].length);
  const duplicateHeading = new RegExp(`\\n##\\s+${escapeRegExp(releaseVersion)}\\n[\\s\\S]*?(?=\\n##\\s+|$)`, 'g');
  let seenReleaseHeading = false;

  nextChangelog = nextChangelog.replace(duplicateHeading, block => {
    if (!seenReleaseHeading) {
      seenReleaseHeading = true;
      return block;
    }
    return '';
  });

  fs.writeFileSync(changelogMdPath, nextChangelog);
}

function run() {
  const releaseVersion = process.argv[2];
  const packageName = process.argv[3] || '@visactor/vtable';
  const packageDir = process.argv[4] || path.join(__dirname, '../../packages/vtable');

  if (!releaseVersion) {
    console.error('Usage: node common/scripts/align-rush-changelog-version.js <release-version> [package-name] [package-dir]');
    process.exit(1);
  }

  alignChangelogJson(packageDir, packageName, releaseVersion);
  alignChangelogMarkdown(packageDir, releaseVersion);
}

run();
