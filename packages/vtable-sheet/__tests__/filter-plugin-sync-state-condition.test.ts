// @ts-nocheck
import { VTableSheet } from '../src/index';
import { createDiv, removeDom } from './dom';
import * as VTablePlugins from '../src/test-shims/vtable-plugins';

(global as any).__VERSION__ = 'none';

test('ValueFilter syncSingleStateFromTableData does not clear byValue selection on cell edit', async () => {
  const container = createDiv() as HTMLDivElement;
  container.style.position = 'relative';
  container.style.width = '1000px';
  container.style.height = '800px';

  const data = [
    ['Name', 'Age', 'City'],
    ['Alice', 24, 'Beijing'],
    ['Bob', 30, 'Shanghai'],
    ['Carol', 28, 'Shenzhen'],
    ['David', 32, 'Guangzhou']
  ];

  const sheet = new VTableSheet(container, {
    showFormulaBar: false,
    showSheetTab: false,
    defaultRowHeight: 25,
    defaultColWidth: 80,
    VTablePluginModules: [
      {
        module: (VTablePlugins as any).FilterPlugin,
        moduleOptions: {},
        disabled: false
      }
    ],
    sheets: [
      {
        sheetKey: 'sheet1',
        sheetTitle: 'Filter Sync byValue',
        filter: true,
        data,
        active: true,
        firstRowAsHeader: true
      }
    ]
  });

  try {
    const ws = sheet.getActiveSheet();
    const table = ws.tableInstance;
    const filterPlugin =
      table?.pluginManager?.getPlugin?.('filter') ?? table?.pluginManager?.getPluginByName?.('Filter');

    const ageField = table.internalProps.layoutMap.getHeaderField(1, 0);

    filterPlugin.filterStateManager.dispatch({
      type: (VTablePlugins as any).FilterActionType.APPLY_FILTERS,
      payload: {
        field: ageField,
        type: 'byValue',
        values: [24, 32],
        enable: true
      }
    });

    table.changeCellValue(0, 1, 'Alice2');
    await Promise.resolve();

    expect(filterPlugin.filterStateManager.getFilterState(ageField).values).toEqual([24, 32]);
  } finally {
    sheet.release();
    removeDom(container);
  }
});

test('ValueFilter syncSingleStateFromTableData uses visible records for byCondition field', async () => {
  const container = createDiv() as HTMLDivElement;
  container.style.position = 'relative';
  container.style.width = '1000px';
  container.style.height = '800px';

  const data = [
    ['Name', 'Age', 'City'],
    ['Alice', 24, 'Beijing'],
    ['Bob', 30, 'Shanghai'],
    ['Carol', 28, 'Shenzhen'],
    ['David', 32, 'Guangzhou']
  ];

  const sheet = new VTableSheet(container, {
    showFormulaBar: false,
    showSheetTab: false,
    defaultRowHeight: 25,
    defaultColWidth: 80,
    VTablePluginModules: [
      {
        module: (VTablePlugins as any).FilterPlugin,
        moduleOptions: {},
        disabled: false
      }
    ],
    sheets: [
      {
        sheetKey: 'sheet1',
        sheetTitle: 'Filter Sync byCondition',
        filter: true,
        data,
        active: true,
        firstRowAsHeader: true
      }
    ]
  });

  try {
    const ws = sheet.getActiveSheet();
    const table = ws.tableInstance;
    const filterPlugin =
      table?.pluginManager?.getPlugin?.('filter') ?? table?.pluginManager?.getPluginByName?.('Filter');

    const cityField = table.internalProps.layoutMap.getHeaderField(2, 0);

    filterPlugin.filterStateManager.dispatch({
      type: (VTablePlugins as any).FilterActionType.APPLY_FILTERS,
      payload: {
        field: cityField,
        type: 'byCondition',
        operator: 'contains',
        condition: 'sh',
        enable: true
      }
    });

    filterPlugin.filterToolbar.show(2, 0, ['byValue', 'byCondition']);
    await new Promise(resolve => setTimeout(resolve, 0));

    filterPlugin.filterToolbar.valueFilter.show();
    await new Promise(resolve => setTimeout(resolve, 0));

    const cityCheckboxes = Array.from(
      document.querySelectorAll('.vtable-filter-menu input[type="checkbox"]')
    ) as HTMLInputElement[];
    const cbShanghai = cityCheckboxes.find(cb => cb.value === 'Shanghai');
    const cbShenzhen = cityCheckboxes.find(cb => cb.value === 'Shenzhen');
    expect(cbShanghai && cbShanghai.checked).toBe(true);
    expect(cbShenzhen && cbShenzhen.checked).toBe(true);

    const ageFilteredRecords = table.getFilteredRecords();
    expect(ageFilteredRecords.length).toBe(2);
    expect(ageFilteredRecords.some((r: any[]) => r[2] === 'Beijing')).toBe(false);
    expect(ageFilteredRecords.some((r: any[]) => r[2] === 'Guangzhou')).toBe(false);
  } finally {
    sheet.release();
    removeDom(container);
  }
});
