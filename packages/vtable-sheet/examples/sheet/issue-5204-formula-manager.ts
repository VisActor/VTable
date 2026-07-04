import { VTableSheet } from '../../src/index';

const CONTAINER_ID = 'vTable';

const columns = [
  { title: '测试公式计算', field: 'test', width: 120 },
  {
    title: 'B商品营业额',
    field: 'Bmoney',
    width: 120
  },
  {
    title: 'A商品营业额',
    field: 'Amoney',
    width: 120
  }
];

const dataA = Array.from({ length: 12 }, (_, index) => ({
  test: `${index}-row`,
  Bmoney: `${(index + 1) * 50}`,
  Amoney: `${(index + 2) * 50}`
}));

const columnsB = [
  { title: '测试公式计算', width: 120 },
  {
    title: 'B商品营业额',
    width: 120
  },
  {
    title: 'A商品营业额',
    width: 120
  }
];

const dataB = [['1', 2, 3]];

export function createTable() {
  const container = document.getElementById(CONTAINER_ID)!;
  window.sheetInstance = new VTableSheet(container, {
    showFormulaBar: false,
    showSheetTab: true,
    defaultRowHeight: 32,
    defaultColWidth: 120,
    sheets: [
      {
        sheetKey: 'Issue-5204-a',
        sheetTitle: 'data是Array<Object>',
        columns,
        data: dataA as any,
        active: true
      },
      {
        sheetKey: 'Issue-5204-b',
        sheetTitle: 'data是Array<Array<any>>',
        columns: columnsB,
        data: dataB as any,
        active: true
      }
    ]
  });
}
