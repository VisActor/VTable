"""Read a PR artifact as data without trusting archive paths or file attributes."""

import stat
import sys
import zipfile
from pathlib import Path

MAX_BUNDLE_BYTES = 64 * 1024 * 1024


def extract_bundle(archive_path, destination):
    """Extract only a bounded regular index.js entry without executing its contents."""
    with zipfile.ZipFile(archive_path) as archive:
        entries = archive.infolist()
        if len(entries) != 1 or entries[0].filename != 'index.js':
            raise ValueError('The PR artifact must contain exactly one file named index.js.')
        entry = entries[0]
        file_type = stat.S_IFMT(entry.external_attr >> 16)
        if entry.is_dir() or file_type not in (0, stat.S_IFREG):
            raise ValueError('The PR bundle must be a regular file, not a link or directory.')
        if entry.file_size > MAX_BUNDLE_BYTES:
            raise ValueError('The PR bundle exceeds the 64 MiB limit.')
        with archive.open(entry) as source:
            data = source.read(MAX_BUNDLE_BYTES + 1)
        if len(data) > MAX_BUNDLE_BYTES:
            raise ValueError('The PR bundle exceeds the 64 MiB limit.')
    destination = Path(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open('xb') as output:
        output.write(data)


if __name__ == '__main__':
    extract_bundle(sys.argv[1], sys.argv[2])
