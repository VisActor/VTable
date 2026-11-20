import stat
import tempfile
import unittest
import warnings
import zipfile
from pathlib import Path
from unittest.mock import patch

from extract_bug_server_bundle import extract_bundle


class ExtractBundleTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.archive = self.root / 'bundle.zip'
        self.destination = self.root / 'dist' / 'index.js'

    def archive_entries(self, entries):
        with warnings.catch_warnings():
            warnings.simplefilter('ignore', UserWarning)
            with zipfile.ZipFile(self.archive, 'w', zipfile.ZIP_DEFLATED) as archive:
                for name, data in entries:
                    archive.writestr(name, data)

    def test_preserves_binary_content(self):
        data = b'\x00\xffbundle\n'
        self.archive_entries([('index.js', data)])
        extract_bundle(self.archive, self.destination)
        self.assertEqual(self.destination.read_bytes(), data)

    def test_executable_text_is_only_data(self):
        data = b'throw new Error("BUNDLE_MUST_NOT_EXECUTE");'
        self.archive_entries([('index.js', data)])
        extract_bundle(self.archive, self.destination)
        self.assertEqual(self.destination.read_bytes(), data)

    def test_rejects_unexpected_names_and_extra_files(self):
        for entries in [
            [], [('index.js', b'a'), ('scripts/trigger-test.ts', b'evil')],
            [('../scripts/trigger-test.ts', b'evil')], [('/tmp/index.js', b'evil')],
            [('index.js', b'a'), ('index.js', b'b')], [('folder/index.js', b'a')],
        ]:
            with self.subTest(entries=entries):
                self.archive_entries(entries)
                with self.assertRaises(ValueError):
                    extract_bundle(self.archive, self.destination)
                self.assertFalse(self.destination.exists())

    def test_rejects_links_and_special_files(self):
        for file_type in [stat.S_IFLNK, stat.S_IFDIR, stat.S_IFIFO, stat.S_IFCHR]:
            with self.subTest(file_type=file_type):
                entry = zipfile.ZipInfo('index.js')
                entry.create_system = 3
                entry.external_attr = (file_type | 0o777) << 16
                self.archive_entries([(entry, b'../scripts/trigger-test.ts')])
                with self.assertRaises(ValueError):
                    extract_bundle(self.archive, self.destination)

    def test_rejects_oversized_bundle(self):
        self.archive_entries([('index.js', b'x' * 1025)])
        with patch('extract_bug_server_bundle.MAX_BUNDLE_BYTES', 1024):
            with self.assertRaises(ValueError):
                extract_bundle(self.archive, self.destination)
        self.assertFalse(self.destination.exists())

    def test_does_not_overwrite_existing_file(self):
        self.archive_entries([('index.js', b'new')])
        self.destination.parent.mkdir()
        self.destination.write_bytes(b'original')
        with self.assertRaises(FileExistsError):
            extract_bundle(self.archive, self.destination)
        self.assertEqual(self.destination.read_bytes(), b'original')


if __name__ == '__main__':
    unittest.main()
