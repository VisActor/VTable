import { createFormulaAdapter, enhanceCellDataWithFormula } from '../../src/auto-fill/formula-integration';

function createTableStub(initial: Record<string, any> = {}) {
  const store = new Map<string, any>(Object.entries(initial));
  return {
    getCellValue: (col: number, row: number) => store.get(`${col}:${row}`),
    changeCellValue: (col: number, row: number, value: any) => {
      store.set(`${col}:${row}`, value);
    }
  } as any;
}

test('DefaultFormulaAdapter detects and reads formula string', () => {
  const table = createTableStub({ '0:0': '=B1' });
  const adapter = createFormulaAdapter(table);
  expect(adapter.isFormulaCell(0, 0)).toBe(true);
  expect(adapter.getCellFormula(0, 0)).toBe('=B1');
});

test('DefaultFormulaAdapter setCellFormula writes to table value', () => {
  const table = createTableStub();
  const adapter = createFormulaAdapter(table);
  adapter.setCellFormula(1, 2, '=A1+1');
  expect(table.getCellValue(1, 2)).toBe('=A1+1');
});

test('CustomFormulaAdapter uses custom functions when provided', () => {
  const table = createTableStub({ '0:0': { f: 'SUM(A1:A2)' } });
  const adapter = createFormulaAdapter(
    table,
    (_c, _r, cellData) => Boolean(cellData?.f),
    (_c, _r, cellData) => (cellData?.f ? `=${cellData.f}` : undefined),
    (c, r, formula) => table.changeCellValue(c, r, { f: formula.replace(/^=/, '') })
  );

  expect(adapter.isFormulaCell(0, 0)).toBe(true);
  expect(adapter.getCellFormula(0, 0)).toBe('=SUM(A1:A2)');

  adapter.setCellFormula(0, 1, '=A1+1');
  expect(table.getCellValue(0, 1)).toEqual({ f: 'A1+1' });
});

test('enhanceCellDataWithFormula attaches formula metadata for formula cells', () => {
  const table = createTableStub({ '0:0': '=B1' });
  const adapter = createFormulaAdapter(table);
  const cellData = { value: '=B1', col: 0, row: 0 } as any;
  const enhanced = enhanceCellDataWithFormula(cellData, 0, 0, adapter);
  expect(enhanced.isFormula).toBe(true);
  expect(enhanced.formula).toBe('=B1');
});
