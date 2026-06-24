// @ts-nocheck
import { VTableSheet } from '../src/index';
import { createDiv, removeDom } from './dom';

(global as any).__VERSION__ = 'none';

test('VTableSheet keeps record fields when top-level columns mix leaf and grouped headers', () => {
  const container = createDiv() as HTMLDivElement;
  container.style.position = 'relative';
  container.style.width = '1000px';
  container.style.height = '800px';

  const sheet = new VTableSheet(container, {
    showFormulaBar: false,
    showSheetTab: false,
    defaultRowHeight: 25,
    defaultColWidth: 100,
    sheets: [
      {
        sheetKey: 'multiHeaderSheet',
        sheetTitle: '多级表头示例',
        active: true,
        columns: [
          { title: '计划编码', field: 'planningCode', width: 120 },
          { title: '采购类别', field: 'type', width: 120 },
          {
            title: '采购需求计划完成时间',
            columns: [
              { title: '计划完成时间', field: 'demandPlanningTime', width: 150 },
              { title: '实际完成时间', field: 'demandActualTime', width: 150 }
            ]
          },
          { title: '备注', field: 'description', width: 120 }
        ],
        data: [
          {
            planningCode: 'PC-001',
            type: 'type1-1',
            demandPlanningTime: '2026-06-20',
            demandActualTime: '2026-06-21',
            description: 'record data'
          }
        ] as any
      }
    ]
  });

  try {
    const table = sheet.getActiveSheet().tableInstance;
    const dataRow = table.columnHeaderLevelCount;

    expect(table.internalProps.layoutMap.getHeaderField(0, dataRow - 1)).toBe('planningCode');
    expect(table.internalProps.layoutMap.getHeaderField(2, dataRow - 1)).toBe('demandPlanningTime');
    expect(table.getCellValue(0, dataRow)).toBe('PC-001');
    expect(table.getCellValue(1, dataRow)).toBe('type1-1');
    expect(table.getCellValue(2, dataRow)).toBe('2026-06-20');
    expect(table.getCellValue(3, dataRow)).toBe('2026-06-21');
    expect(table.getCellValue(4, dataRow)).toBe('record data');
  } finally {
    sheet.release();
    removeDom(container);
  }
});
