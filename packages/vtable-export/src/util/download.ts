import { saveAs } from 'file-saver';

export function downloadCsv(str: string, name: string) {
  const blob = new Blob([`\ufeff${str}`], {
    type: 'text/csv;charset=utf-8'
  });

  saveAs(blob, `${name}.csv`);
}
