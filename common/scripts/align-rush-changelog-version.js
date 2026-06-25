const fs = require('fs');
const path = require('path');

function readReleaseVersions() {
  const releaseChangelogPath = path.join(__dirname, '../../docs/assets/changelog/en/release.md');
  const releaseChangelog = fs.readFileSync(releaseChangelogPath, 'utf8');

  return Array.from(releaseChangelog.matchAll(/^#\s+v?(\d+\.\d+\.\d+)/gm)).map(match => match[1]);
}

function getPreviousReleaseVersion(releaseVersion) {
  const versions = readReleaseVersions();
  const releaseIndex = versions.indexOf(releaseVersion);

  if (releaseIndex === -1 || !versions[releaseIndex + 1]) {
    return null;
  }

  return versions[releaseIndex + 1];
}

function dedupeEntriesByVersion(entries) {
  const seenVersions = new Set();

  return entries.filter(entry => {
    if (seenVersions.has(entry.version)) {
      return false;
    }
    seenVersions.add(entry.version);
    return true;
  });
}

function alignChangelogJson(packageDir, packageName, releaseVersion, previousReleaseVersion) {
  const changelogJsonPath = path.join(packageDir, 'CHANGELOG.json');
  const changelog = JSON.parse(fs.readFileSync(changelogJsonPath, 'utf8'));

  if (!Array.isArray(changelog.entries) || changelog.entries.length === 0) {
    throw new Error(`No changelog entries found in ${changelogJsonPath}`);
  }

  changelog.entries[0].version = releaseVersion;
  changelog.entries[0].tag = `${packageName}_v${releaseVersion}`;

  if (previousReleaseVersion && changelog.entries[1]?.version === releaseVersion) {
    changelog.entries[1].version = previousReleaseVersion;
    changelog.entries[1].tag = `${packageName}_v${previousReleaseVersion}`;
  }

  changelog.entries = dedupeEntriesByVersion(changelog.entries);

  fs.writeFileSync(changelogJsonPath, `${JSON.stringify(changelog, null, 2)}\n`);
}

function parseMarkdownSections(changelog) {
  const headingMatches = Array.from(changelog.matchAll(/^##\s+(.+)$/gm));

  if (headingMatches.length === 0) {
    return null;
  }

  const prelude = changelog.slice(0, headingMatches[0].index);
  const sections = headingMatches.map((match, index) => {
    const start = match.index;
    const bodyStart = start + match[0].length;
    const end = headingMatches[index + 1]?.index ?? changelog.length;

    return {
      version: match[1].trim(),
      body: changelog.slice(bodyStart, end)
    };
  });

  return { prelude, sections };
}

function dedupeMarkdownSections(sections) {
  const seenVersions = new Set();

  return sections.filter(section => {
    if (seenVersions.has(section.version)) {
      return false;
    }
    seenVersions.add(section.version);
    return true;
  });
}

function alignChangelogMarkdown(packageDir, releaseVersion, previousReleaseVersion) {
  const changelogMdPath = path.join(packageDir, 'CHANGELOG.md');
  const changelog = fs.readFileSync(changelogMdPath, 'utf8');
  const parsed = parseMarkdownSections(changelog);

  if (!parsed) {
    throw new Error(`No changelog version heading found in ${changelogMdPath}`);
  }

  parsed.sections[0].version = releaseVersion;

  if (previousReleaseVersion && parsed.sections[1]?.version === releaseVersion) {
    parsed.sections[1].version = previousReleaseVersion;
  }

  const sections = dedupeMarkdownSections(parsed.sections);
  const nextChangelog = parsed.prelude + sections.map(section => `## ${section.version}${section.body}`).join('');

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

  const previousReleaseVersion = getPreviousReleaseVersion(releaseVersion);

  alignChangelogJson(packageDir, packageName, releaseVersion, previousReleaseVersion);
  alignChangelogMarkdown(packageDir, releaseVersion, previousReleaseVersion);
}

run();
