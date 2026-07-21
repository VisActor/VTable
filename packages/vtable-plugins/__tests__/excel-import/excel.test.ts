import ExcelJS from 'exceljs';
import { parseWorksheetToSheetData } from '../../src/excel-import/excel';

describe('Excel worksheet import', () => {
  test('preserves data after a blank first row', async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    worksheet.getCell('A2').value = 'Name';
    worksheet.getCell('B2').value = 'Age';
    worksheet.getCell('A3').value = 'Alice';
    worksheet.getCell('B3').value = 30;

    const result = await parseWorksheetToSheetData(worksheet, 0);

    expect(result.rowCount).toBe(3);
    expect(result.data).toEqual([
      [null, null],
      ['Name', 'Age'],
      ['Alice', 30]
    ]);
  });
});
