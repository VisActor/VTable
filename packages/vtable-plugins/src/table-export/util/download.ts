import { saveAs } from 'file-saver';

export async function downloadCsv(str: string, name: string) {
  const blob = new Blob([`\ufeff${str}`], {
    type: 'text/csv;charset=utf-8'
  });

  await saveAs(blob, `${name}.csv`);
}

export async function downloadExcel(arrayBuffer: ArrayBuffer, name: string) {
  // const arrayBuffer = workSheetStr2ArrayBuffer(workSheetStr);
  const blob = new Blob([arrayBuffer], {
    type: 'application/octet-stream'
  });

  await saveAs(blob, `${name}.xlsx`);
}

function workSheetStr2ArrayBuffer(workSheetStr: string) {
  const buffer = new ArrayBuffer(workSheetStr.length);
  const arrayBuffer = new Uint8Array(buffer);

  for (let i = 0; i < workSheetStr.length; ++i) {
    arrayBuffer[i] = workSheetStr.charCodeAt(i) & 0xff;
  }

  return buffer;
}
