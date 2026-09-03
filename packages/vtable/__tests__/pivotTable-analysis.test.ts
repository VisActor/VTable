// @ts-nocheck
// 有问题可对照demo unitTestPivotTable
import records from './data/marketsales.json';
import { PivotTable } from '../src';
import * as VTable from '../src/index';
import { createDiv } from './dom';
global.__VERSION__ = 'none';
function getColor(min: number, max: number, n: any) {
  if (max === min) {
    if (n > 0) {
      return 'rgb(255,0,0)';
    }
    return 'rgb(255,255,255)';
  }
  if (n === '') {
    return 'rgb(255,255,255)';
  }
  const c = Math.max(0.1, (n - min) / (max - min));
  const red = 255;
  const green = (1 - c) * 255;
  return `rgb(${red},${green},${green})`;
}

function getColor2(min: number, max: number, n: any) {
  if (max === min) {
    if (n > 0) {
      return 'rgb(0,255,0)';
    }
    return 'rgb(255,255,255)';
  }
  if (n === '') {
    return 'rgb(255,255,255)';
  }
  const c = Math.max(0.1, (n - min) / (max - min));
  const green = 255;
  const red = (1 - c) * 255;
  return `rgb(${red},${green},${green})`;
}
describe('pivotTable-analysis init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '500px';
  containerDom.style.height = '500px';

  const option: VTable.PivotTableConstructorOptions = {
    rows: ['province', 'city'],
    columns: ['category', 'sub_category'],
    indicators: ['sales', 'number'],
    indicatorTitle: '指标名称',
    indicatorsAsCol: false,
    corner: { titleOnDimension: 'row' },
    records: [
      {
        sales: 891,
        number: 7789,
        province: '浙江省',
        city: '杭州市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 792,
        number: 2367,
        province: '浙江省',
        city: '绍兴市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 893,
        number: 3877,
        province: '浙江省',
        city: '宁波市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 1094,
        number: 4342,
        province: '浙江省',
        city: '舟山市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 1295,
        number: 5343,
        province: '浙江省',
        city: '杭州市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 496,
        number: 632,
        province: '浙江省',
        city: '绍兴市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 1097,
        number: 7234,
        province: '浙江省',
        city: '宁波市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 998,
        number: 834,
        province: '浙江省',
        city: '舟山市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 766,
        number: 945,
        province: '浙江省',
        city: '杭州市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 990,
        number: 1304,
        province: '浙江省',
        city: '绍兴市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 891,
        number: 1145,
        province: '浙江省',
        city: '宁波市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 792,
        number: 1432,
        province: '浙江省',
        city: '舟山市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 745,
        number: 1343,
        province: '浙江省',
        city: '杭州市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 843,
        number: 1354,
        province: '浙江省',
        city: '绍兴市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 895,
        number: 1523,
        province: '浙江省',
        city: '宁波市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 965,
        number: 1634,
        province: '浙江省',
        city: '舟山市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 776,
        number: 1723,
        province: '四川省',
        city: '成都市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 634,
        number: 1822,
        province: '四川省',
        city: '绵阳市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 909,
        number: 1943,
        province: '四川省',
        city: '南充市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 399,
        number: 2330,
        province: '四川省',
        city: '乐山市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 700,
        number: 2451,
        province: '四川省',
        city: '成都市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 689,
        number: 2244,
        province: '四川省',
        city: '绵阳市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 500,
        number: 2333,
        province: '四川省',
        city: '南充市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 800,
        number: 2445,
        province: '四川省',
        city: '乐山市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 1044,
        number: 2335,
        province: '四川省',
        city: '成都市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 689,
        number: 245,
        province: '四川省',
        city: '绵阳市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 794,
        number: 2457,
        province: '四川省',
        city: '南充市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 566,
        number: 2458,
        province: '四川省',
        city: '乐山市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 865,
        number: 4004,
        province: '四川省',
        city: '成都市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 999,
        number: 3077,
        province: '四川省',
        city: '绵阳市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 999,
        number: 3551,
        province: '四川省',
        city: '南充市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 999,
        number: 352,
        province: '四川省',
        city: '乐山市',
        category: '办公用品',
        sub_category: '纸张'
      }
    ],
    dataConfig: {
      filterRules: [
        {
          filterFunc: (record: Record<string, any>) => {
            return record.province !== '四川省' || record.category !== '家具';
          }
        }
      ],
      sortRules: [
        {
          sortField: 'city',
          sortByIndicator: 'sales',
          sortType: VTable.TYPES.SortType.DESC,
          query: ['办公用品', '笔']
        } as VTable.TYPES.SortByIndicatorRule
      ],
      mappingRules: [
        {
          bgColor: {
            indicatorKey: 'sales',
            mapping({ table, value }) {
              const max: number =
                table.dataset.indicatorStatistics[table.dataset.indicatorKeys.indexOf('sales')].max.value();
              const min: number =
                table.dataset.indicatorStatistics[table.dataset.indicatorKeys.indexOf('sales')].min.value();
              return getColor(min, max, value);
            }
          }
        },
        {
          bgColor: {
            indicatorKey: 'number',
            mapping({ table, value }) {
              const max: number =
                table.dataset.indicatorStatistics[table.dataset.indicatorKeys.indexOf('number')].max.value();
              const min: number =
                table.dataset.indicatorStatistics[table.dataset.indicatorKeys.indexOf('number')].min.value();
              return getColor2(min, max, value);
            }
          }
        }
      ],
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['province'],
          grandTotalLabel: '行总计',
          subTotalLabel: '小计'
        },
        column: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['category'],
          grandTotalLabel: '列总计',
          subTotalLabel: '小计'
        }
      }
    },
    widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
  };
  const pivotTable = new PivotTable(containerDom, option);

  test('pivotTable-analysis init', () => {
    expect(pivotTable.rowCount).toBe(24);
  });
  test('pivotTable-analysis cellValue', () => {
    expect(pivotTable.getCellValue(7, 4)).toBe(999);
    pivotTable.release();
  });
});

describe('pivotTable grand total grouped by lower-level dimension', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '500px';
  containerDom.style.height = '500px';

  const pivotTable = new PivotTable(containerDom, {
    rows: ['organization', 'type'],
    columns: [],
    indicators: ['balance'],
    indicatorsAsCol: true,
    records: [
      { organization: '公司一', type: '银票', balance: 100 },
      { organization: '公司一', type: '商票', balance: 200 },
      { organization: '公司二', type: '银票', balance: 300 },
      { organization: '公司二', type: '信用证', balance: 400 }
    ],
    dataConfig: {
      updateAggregationOnEditCell: true,
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: false,
          grandTotalDimensions: ['type'],
          grandTotalLabel: '合计',
          subTotalLabel: '小计'
        }
      }
    }
  });

  function findBodyCell(rowValues: string[], colValues: string[] = [], role?: 'normal' | 'grand-total') {
    for (let col = 0; col < pivotTable.colCount; col++) {
      for (let row = 0; row < pivotTable.rowCount; row++) {
        if (pivotTable.isHeader(col, row)) {
          continue;
        }
        const paths = pivotTable.getCellHeaderPaths(col, row);
        const currentRowValues = paths.rowHeaderPaths
          .filter(path => path.dimensionKey)
          .map(path => path.value as string);
        const currentColValues = paths.colHeaderPaths
          .filter(path => path.dimensionKey)
          .map(path => path.value as string);
        const rowRole = pivotTable.getCellPivotRole(col, row).rowRole;
        if (
          currentRowValues.join('|') === rowValues.join('|') &&
          currentColValues.join('|') === colValues.join('|') &&
          (!role || rowRole === role)
        ) {
          return { col, row };
        }
      }
    }
    throw new Error(`Unable to find body cell for ${rowValues.join('/')}`);
  }

  test('creates grouped grand total headers and values', () => {
    const grandTotalNode = pivotTable.dataset.rowHeaderTree.find(node => node.value === '合计');

    expect(grandTotalNode.levelSpan).toBe(1);
    expect(grandTotalNode.children.map(node => node.value)).toEqual(['银票', '商票', '信用证', '小计']);
    expect(pivotTable.dataset.getAggregator(['合计', '银票'], [], 'balance').value()).toBe(400);
    expect(pivotTable.dataset.getAggregator(['合计', '商票'], [], 'balance').value()).toBe(200);
    expect(pivotTable.dataset.getAggregator(['合计', '信用证'], [], 'balance').value()).toBe(400);
    expect(pivotTable.dataset.getAggregator(['合计', '小计'], [], 'balance').value()).toBe(1000);
  });

  test('keeps grouped grand total headers after sorting updates', () => {
    pivotTable.updateSortRules([
      {
        sortField: 'type',
        sortType: VTable.TYPES.SortType.DESC
      }
    ]);

    const grandTotalNode = pivotTable.dataset.rowHeaderTree.find(node => node.value === '合计');
    expect(grandTotalNode.children.map(node => node.value)).toEqual(['银票', '信用证', '商票', '小计']);
  });

  test('recalculates grouped and overall grand totals after editing', () => {
    const detailCell = findBodyCell(['公司一', '银票'], [], 'normal');
    pivotTable.changeCellValue(detailCell.col, detailCell.row, '150');
    const groupedTotalCell = findBodyCell(['合计', '银票'], [], 'grand-total');
    const overallTotalCell = findBodyCell(['合计', '小计'], [], 'grand-total');

    expect(pivotTable.getCellOriginValue(detailCell.col, detailCell.row)).toBe(150);
    expect(pivotTable.getCellOriginValue(groupedTotalCell.col, groupedTotalCell.row)).toBe(450);
    expect(pivotTable.getCellOriginValue(overallTotalCell.col, overallTotalCell.row)).toBe(1050);
    pivotTable.release();
  });
});

describe('pivotTable column grand total grouped by lower-level dimension', () => {
  test('creates grouped column grand total headers and values', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '500px';
    containerDom.style.height = '500px';

    const pivotTable = new PivotTable(containerDom, {
      rows: [],
      columns: ['organization', 'type'],
      indicators: ['balance'],
      indicatorsAsCol: true,
      records: [
        { organization: '公司一', type: '银票', balance: 100 },
        { organization: '公司一', type: '商票', balance: 200 },
        { organization: '公司二', type: '银票', balance: 300 },
        { organization: '公司二', type: '信用证', balance: 400 }
      ],
      dataConfig: {
        updateAggregationOnEditCell: true,
        totals: {
          column: {
            showGrandTotals: true,
            showSubTotals: false,
            grandTotalDimensions: ['type'],
            grandTotalLabel: '合计',
            subTotalLabel: '小计'
          }
        }
      }
    });

    const grandTotalNode = pivotTable.dataset.colHeaderTree.find(node => node.value === '合计');
    expect(grandTotalNode.levelSpan).toBe(1);
    expect(grandTotalNode.children.map(node => node.value)).toEqual(['银票', '商票', '信用证', '小计']);
    expect(pivotTable.dataset.getAggregator([], ['合计', '银票'], 'balance').value()).toBe(400);
    expect(pivotTable.dataset.getAggregator([], ['合计', '小计'], 'balance').value()).toBe(1000);

    const findBodyCell = (colValues: string[], role: 'normal' | 'grand-total') => {
      for (let col = 0; col < pivotTable.colCount; col++) {
        for (let row = 0; row < pivotTable.rowCount; row++) {
          if (pivotTable.isHeader(col, row)) {
            continue;
          }
          const paths = pivotTable.getCellHeaderPaths(col, row);
          const values = paths.colHeaderPaths.filter(path => path.dimensionKey).map(path => path.value as string);
          if (values.join('|') === colValues.join('|') && pivotTable.getCellPivotRole(col, row).colRole === role) {
            return { col, row };
          }
        }
      }
      throw new Error(`Unable to find body cell for ${colValues.join('/')}`);
    };
    const detailCell = findBodyCell(['公司一', '银票'], 'normal');
    pivotTable.changeCellValue(detailCell.col, detailCell.row, '150');
    const groupedTotalCell = findBodyCell(['合计', '银票'], 'grand-total');
    const overallTotalCell = findBodyCell(['合计', '小计'], 'grand-total');

    expect(pivotTable.getCellOriginValue(groupedTotalCell.col, groupedTotalCell.row)).toBe(450);
    expect(pivotTable.getCellOriginValue(overallTotalCell.col, overallTotalCell.row)).toBe(1050);
    pivotTable.release();
  });
});

describe('pivotTable grouped grand total edge cases', () => {
  function createPivotTable(
    records: any[],
    options: {
      rows?: string[];
      rowHierarchyType?: 'grid' | 'tree' | 'grid-tree';
      grandTotalDimensions?: string[];
      showSubTotalsOnTop?: boolean;
      showSubTotalsOnTreeNode?: boolean;
      aggregationRules?: any[];
      sortRules?: any[];
      filterRules?: any[];
    } = {}
  ) {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '500px';
    containerDom.style.height = '500px';
    return new PivotTable(containerDom, {
      rows: options.rows ?? ['organization', 'type'],
      columns: [],
      indicators: ['balance'],
      indicatorsAsCol: true,
      rowHierarchyType: options.rowHierarchyType,
      rowExpandLevel: 3,
      records,
      dataConfig: {
        updateAggregationOnEditCell: true,
        aggregationRules: options.aggregationRules,
        sortRules: options.sortRules,
        filterRules: options.filterRules,
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: false,
            grandTotalDimensions: options.grandTotalDimensions ?? ['type'],
            grandTotalLabel: '合计',
            subTotalLabel: '小计',
            showSubTotalsOnTop: options.showSubTotalsOnTop,
            showSubTotalsOnTreeNode: options.showSubTotalsOnTreeNode
          }
        }
      }
    });
  }

  function findBodyCell(
    pivotTable: PivotTable,
    rowValues: string[],
    role?: 'normal' | 'grand-total'
  ): { col: number; row: number } {
    const candidates: string[] = [];
    for (let col = 0; col < pivotTable.colCount; col++) {
      for (let row = 0; row < pivotTable.rowCount; row++) {
        if (pivotTable.isHeader(col, row)) {
          continue;
        }
        const values = pivotTable
          .getCellHeaderPaths(col, row)
          .rowHeaderPaths.filter(path => path.dimensionKey)
          .map(path => path.value as string);
        candidates.push(`${values.join('/')} (${pivotTable.getCellPivotRole(col, row).rowRole})`);
        if (
          values.join('|') === rowValues.join('|') &&
          (!role || pivotTable.getCellPivotRole(col, row).rowRole === role)
        ) {
          return { col, row };
        }
      }
    }
    const availableCells = Array.from(new Set(candidates)).join(', ');
    throw new Error(`Unable to find body cell for ${rowValues.join('/')}: ${availableCells}`);
  }

  test('keeps records whose dimension values match total labels separate from grouped totals', () => {
    const pivotTable = createPivotTable([
      { organization: '合计', type: '小计', balance: 100 },
      { organization: '公司二', type: '小计', balance: 300 }
    ]);
    const grandTotalNode = pivotTable.dataset.rowHeaderTree.find(node => node.role === 'grand-total');
    const groupedNode = grandTotalNode.children[0];
    const overallNode = grandTotalNode.children[1];

    expect(pivotTable.dataset.getAggregator(['合计', '小计'], [], 'balance').value()).toBe(100);
    expect(
      pivotTable.dataset.getAggregator([grandTotalNode.dataValue, groupedNode.dataValue], [], 'balance').value()
    ).toBe(400);
    expect(
      pivotTable.dataset.getAggregator([grandTotalNode.dataValue, overallNode.dataValue], [], 'balance').value()
    ).toBe(400);
    const groupedTotalCell = findBodyCell(pivotTable, ['合计', '小计'], 'grand-total');
    expect(pivotTable.getCellOriginValue(groupedTotalCell.col, groupedTotalCell.row)).toBe(400);
    pivotTable.release();
  });

  test('uses active dimension indexes when an intermediate dimension has no values', () => {
    const pivotTable = createPivotTable(
      [
        { organization: '公司一', type: '银票', balance: 100 },
        { organization: '公司二', type: '银票', balance: 300 }
      ],
      {
        rows: ['organization', 'unused', 'type']
      }
    );
    const grandTotalNode = pivotTable.dataset.rowHeaderTree.find(node => node.role === 'grand-total');

    expect(grandTotalNode.children.map(node => node.value)).toEqual(['银票', '小计']);
    expect(pivotTable.dataset.getAggregator(['合计', '银票'], [], 'balance').value()).toBe(400);
    pivotTable.release();
  });

  test('keeps a configured lower-level total when the first dimension has no values', () => {
    const pivotTable = createPivotTable(
      [
        { type: '银票', balance: 100 },
        { type: '商票', balance: 300 }
      ],
      {
        rows: ['unused', 'type']
      }
    );
    const grandTotalNode = pivotTable.dataset.rowHeaderTree.find(node => node.role === 'grand-total');

    expect(grandTotalNode.levelSpan).toBe(1);
    expect(grandTotalNode.children.map(node => node.value)).toEqual(['银票', '商票', '小计']);
    expect(pivotTable.dataset.getAggregator(['合计', '银票'], [], 'balance').value()).toBe(100);
    pivotTable.release();
  });

  test('only uses filtered records to determine active grouped total dimensions', () => {
    const pivotTable = createPivotTable(
      [
        { organization: '公司一', type: '银票', balance: 100 },
        { type: '商票', balance: 300 }
      ],
      {
        filterRules: [{ filterFunc: record => record.organization !== '公司一' }]
      }
    );
    const grandTotalNode = pivotTable.dataset.rowHeaderTree.find(node => node.role === 'grand-total');

    expect(grandTotalNode.levelSpan).toBe(1);
    expect(grandTotalNode.children.map(node => node.value)).toEqual(['商票', '小计']);
    expect(pivotTable.dataset.getAggregator(['合计', '商票'], [], 'balance').value()).toBe(300);
    pivotTable.release();
  });

  test('keeps column values matching the grand total label separate from grouped totals', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '500px';
    containerDom.style.height = '500px';
    const pivotTable = new PivotTable(containerDom, {
      rows: [],
      columns: ['organization', 'type'],
      indicators: ['balance'],
      indicatorsAsCol: true,
      records: [
        { organization: '合计', type: '银票', balance: 100 },
        { organization: '公司二', type: '银票', balance: 300 }
      ],
      dataConfig: {
        totals: {
          column: {
            showGrandTotals: true,
            showSubTotals: false,
            grandTotalDimensions: ['type'],
            grandTotalLabel: '合计',
            subTotalLabel: '小计'
          }
        }
      }
    });
    const grandTotalNode = pivotTable.dataset.colHeaderTree.find(node => node.role === 'grand-total');

    expect(pivotTable.dataset.getAggregator([], ['合计', '银票'], 'balance').value()).toBe(100);
    expect(
      pivotTable.dataset
        .getAggregator([], [grandTotalNode.dataValue, grandTotalNode.children[0].dataValue], 'balance')
        .value()
    ).toBe(400);
    pivotTable.release();
  });

  test('does not classify retained-dimension records as totals when totals are hidden', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '500px';
    containerDom.style.height = '500px';
    const pivotTable = new PivotTable(containerDom, {
      rows: ['organization', 'type'],
      columns: [],
      indicators: ['balance'],
      records: [
        { organization: '公司一', type: '银票', balance: 100 },
        { type: '银票', balance: 300 }
      ],
      dataConfig: {
        totals: {
          row: {
            showGrandTotals: false,
            grandTotalDimensions: ['type']
          }
        }
      }
    });

    expect(pivotTable.dataset.getAggregator(['银票'], [], 'balance').value()).toBe(300);
    pivotTable.release();
  });

  test('resolves column grouped totals independently for each row', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '500px';
    containerDom.style.height = '500px';
    const pivotTable = new PivotTable(containerDom, {
      rows: ['region'],
      columns: ['organization', 'type'],
      indicators: ['balance'],
      records: [
        { region: '华北', organization: '合计', type: '银票', balance: 100 },
        { region: '华东', organization: '公司一', type: '银票', balance: 300 }
      ],
      dataConfig: {
        totals: {
          column: {
            showGrandTotals: true,
            grandTotalDimensions: ['type'],
            grandTotalLabel: '合计',
            subTotalLabel: '小计'
          }
        }
      }
    });

    expect(pivotTable.dataset.getAggregator(['华东'], ['合计', '银票'], 'balance').value()).toBe(300);
    pivotTable.release();
  });

  test('passes the custom aggregation function to grouped and overall totals', () => {
    const pivotTable = createPivotTable(
      [
        { organization: '公司一', type: '银票', balance: 100 },
        { organization: '公司一', type: '银票', balance: 200 },
        { organization: '公司二', type: '商票', balance: 300 },
        { organization: '公司二', type: '商票', balance: 500 }
      ],
      {
        aggregationRules: [
          {
            indicatorKey: 'balance',
            field: 'balance',
            aggregationType: VTable.TYPES.AggregationType.CUSTOM,
            aggregationFun: (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length
          }
        ]
      }
    );

    expect(pivotTable.dataset.getAggregator(['合计', '银票'], [], 'balance').value()).toBe(150);
    expect(pivotTable.dataset.getAggregator(['合计', '商票'], [], 'balance').value()).toBe(400);
    expect(pivotTable.dataset.getAggregator(['合计', '小计'], [], 'balance').value()).toBe(275);

    const detailCell = findBodyCell(pivotTable, ['公司一', '银票'], 'normal');
    pivotTable.changeCellValue(detailCell.col, detailCell.row, '500');
    expect(pivotTable.dataset.getAggregator(['合计', '银票'], [], 'balance').value()).toBe(500);
    expect(pivotTable.dataset.getAggregator(['合计', '小计'], [], 'balance').value()).toBeCloseTo(433.33, 2);
    pivotTable.release();
  });

  test('recalculates custom aggregation records after editing a multi-record cell', () => {
    const pivotTable = createPivotTable(
      [
        { organization: '公司一', type: '银票', balance: 100 },
        { organization: '公司一', type: '银票', balance: 200 },
        { organization: '公司二', type: '商票', balance: 300 }
      ],
      {
        aggregationRules: [
          {
            indicatorKey: 'balance',
            field: 'balance',
            aggregationType: VTable.TYPES.AggregationType.CUSTOM,
            aggregationFun: (_values: number[], records: { balance: number }[]) =>
              records.reduce((sum, record) => sum + record.balance, 0)
          }
        ]
      }
    );
    const detailCell = findBodyCell(pivotTable, ['公司一', '银票'], 'normal');

    pivotTable.changeCellValue(detailCell.col, detailCell.row, '500');

    expect(pivotTable.dataset.getAggregator(['合计', '银票'], [], 'balance').value()).toBe(500);
    expect(pivotTable.dataset.getAggregator(['合计', '小计'], [], 'balance').value()).toBe(800);
    pivotTable.release();
  });

  test('recalculates custom grouped total intersections after editing', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '500px';
    containerDom.style.height = '500px';
    const pivotTable = new PivotTable(containerDom, {
      rows: ['organization', 'type'],
      columns: ['category', 'channel'],
      indicators: ['balance'],
      records: [
        { organization: '公司一', type: '银票', category: '票据', channel: '线上', balance: 100 },
        { organization: '公司一', type: '银票', category: '票据', channel: '线上', balance: 200 }
      ],
      dataConfig: {
        updateAggregationOnEditCell: true,
        aggregationRules: [
          {
            indicatorKey: 'balance',
            field: 'balance',
            aggregationType: VTable.TYPES.AggregationType.CUSTOM,
            aggregationFun: (_values: number[], records: { balance: number }[]) =>
              records.reduce((sum, record) => sum + record.balance, 0)
          }
        ],
        totals: {
          row: {
            showGrandTotals: true,
            grandTotalDimensions: ['type'],
            grandTotalLabel: '合计',
            subTotalLabel: '小计'
          },
          column: {
            showGrandTotals: true,
            grandTotalDimensions: ['channel'],
            grandTotalLabel: '合计',
            subTotalLabel: '小计'
          }
        }
      }
    });
    const findCell = (rowValues: string[], colValues: string[], role: 'normal' | 'grand-total') => {
      for (let col = 0; col < pivotTable.colCount; col++) {
        for (let row = 0; row < pivotTable.rowCount; row++) {
          if (pivotTable.isHeader(col, row)) {
            continue;
          }
          const paths = pivotTable.getCellHeaderPaths(col, row);
          const currentRowValues = paths.rowHeaderPaths
            .filter(path => path.dimensionKey)
            .map(path => path.value as string);
          const currentColValues = paths.colHeaderPaths
            .filter(path => path.dimensionKey)
            .map(path => path.value as string);
          const roles = pivotTable.getCellPivotRole(col, row);
          if (
            currentRowValues.join('|') === rowValues.join('|') &&
            currentColValues.join('|') === colValues.join('|') &&
            roles.rowRole === role &&
            roles.colRole === role
          ) {
            return { col, row };
          }
        }
      }
      throw new Error(`Unable to find ${rowValues.join('/')} and ${colValues.join('/')}`);
    };
    const detailCell = findCell(['公司一', '银票'], ['票据', '线上'], 'normal');

    pivotTable.changeCellValue(detailCell.col, detailCell.row, '500');

    const intersection = findCell(['合计', '银票'], ['合计', '线上'], 'grand-total');
    expect(pivotTable.getCellOriginValue(intersection.col, intersection.row)).toBe(500);
    pivotTable.release();
  });

  test('keeps custom overall total records effective with grouped grand totals', () => {
    const pivotTable = createPivotTable([
      { organization: '公司一', type: '银票', balance: 100 },
      { organization: '公司二', type: '银票', balance: 300 },
      { balance: 999 }
    ]);

    expect(pivotTable.dataset.getAggregator(['合计', '银票'], [], 'balance').value()).toBe(400);
    expect(pivotTable.dataset.getAggregator(['合计', '小计'], [], 'balance').value()).toBe(999);
    pivotTable.release();
  });

  test('uses custom grouped total records for retained dimensions', () => {
    const pivotTable = createPivotTable([
      { organization: '公司一', type: '银票', balance: 100 },
      { organization: '公司二', type: '银票', balance: 300 },
      { type: '银票', balance: 999 }
    ]);

    expect(pivotTable.dataset.getAggregator(['合计', '银票'], [], 'balance').value()).toBe(999);
    expect(pivotTable.dataset.getAggregator(['合计', '小计'], [], 'balance').value()).toBe(400);
    pivotTable.release();
  });

  test('sorts grouped totals by indicator values', () => {
    const pivotTable = createPivotTable(
      [
        { organization: '公司一', type: '银票', balance: 100 },
        { organization: '公司一', type: '商票', balance: 300 },
        { organization: '公司二', type: '信用证', balance: 200 }
      ],
      {
        sortRules: [
          {
            sortField: 'type',
            sortByIndicator: 'balance',
            sortType: VTable.TYPES.SortType.DESC,
            query: []
          }
        ]
      }
    );
    const grandTotalNode = pivotTable.dataset.rowHeaderTree.find(node => node.role === 'grand-total');

    expect(grandTotalNode.children.map(node => node.value)).toEqual(['商票', '信用证', '银票', '小计']);
    pivotTable.release();
  });

  test('supports multiple retained dimensions and grid-tree lookup', () => {
    const pivotTable = createPivotTable(
      [
        { organization: '公司一', category: '票据', type: '银票', balance: 100 },
        { organization: '公司二', category: '票据', type: '商票', balance: 300 },
        { organization: '公司三', category: '贷款', type: '信用贷', balance: 200 },
        { category: '票据', balance: 999 }
      ],
      {
        rows: ['organization', 'category', 'type'],
        rowHierarchyType: 'grid-tree',
        grandTotalDimensions: ['category', 'type'],
        showSubTotalsOnTreeNode: true
      }
    );
    const grandTotalNode = pivotTable.dataset.rowHeaderTree.find(node => node.role === 'grand-total');

    expect(grandTotalNode.children.map(node => node.value)).toEqual(['票据', '贷款', '小计']);
    expect(grandTotalNode.children[0].children.map(node => node.value)).toEqual(['银票', '商票']);
    expect(grandTotalNode.children[0].levelSpan).toBe(1);
    expect(pivotTable.dataset.getAggregator(['合计', '票据'], [], 'balance').value()).toBe(999);
    expect(pivotTable.dataset.getAggregator(['合计', '票据', '银票'], [], 'balance').value()).toBe(100);
    const groupedCell = findBodyCell(pivotTable, ['合计', '票据', '银票'], 'grand-total');
    expect(pivotTable.getCellOriginValue(groupedCell.col, groupedCell.row)).toBe(100);
    const groupedPath = pivotTable
      .getCellHeaderPaths(groupedCell.col, groupedCell.row)
      .rowHeaderPaths.filter(path => path.dimensionKey)
      .map(path => path.dataValue ?? path.value)
      .join(pivotTable.dataset.stringJoinChar);
    expect((pivotTable.internalProps.layoutMap as any).getRowKeysPath(groupedCell.col, groupedCell.row)).toBe(
      groupedPath
    );
    pivotTable.release();
  });

  test('sorts non-leaf grouped totals by their own aggregated values', () => {
    const pivotTable = createPivotTable(
      [
        { organization: '公司一', category: '票据', type: '银票', balance: 100 },
        { organization: '公司二', category: '票据', type: '商票', balance: 600 },
        { organization: '公司三', category: '贷款', type: '信用贷', balance: 500 }
      ],
      {
        rows: ['organization', 'category', 'type'],
        grandTotalDimensions: ['category', 'type'],
        sortRules: [
          {
            sortField: 'category',
            sortByIndicator: 'balance',
            sortType: VTable.TYPES.SortType.DESC,
            query: []
          }
        ]
      }
    );
    const grandTotalNode = pivotTable.dataset.rowHeaderTree.find(node => node.role === 'grand-total');

    expect(grandTotalNode.children.map(node => node.value)).toEqual(['票据', '贷款', '小计']);
    pivotTable.release();
  });

  test('round-trips grouped total header paths when labels collide with data', () => {
    const pivotTable = createPivotTable([
      { organization: '合计', type: '银票', balance: 100 },
      { organization: '公司二', type: '银票', balance: 300 }
    ]);
    const groupedTotalCell = findBodyCell(pivotTable, ['合计', '银票'], 'grand-total');
    const paths = pivotTable.getCellHeaderPaths(groupedTotalCell.col, groupedTotalCell.row);

    expect(pivotTable.getCellAddressByHeaderPaths(paths)).toEqual(groupedTotalCell);
    pivotTable.release();
  });

  test('orders tree grouped totals by retained dimensions and honors subtotal placement', () => {
    const pivotTable = createPivotTable(
      [
        { organization: 'A', type: 'A', balance: 100 },
        { organization: 'A', type: 'B', balance: 200 },
        { organization: 'B', type: 'A', balance: 300 }
      ],
      {
        rowHierarchyType: 'tree',
        showSubTotalsOnTop: true
      }
    );
    pivotTable.updateSortRules([
      { sortField: 'organization', sortType: VTable.TYPES.SortType.ASC },
      { sortField: 'type', sortType: VTable.TYPES.SortType.DESC }
    ]);
    const grandTotalNode = pivotTable.dataset.rowHeaderTree.find(node => node.role === 'grand-total');

    expect(grandTotalNode.children.map(node => node.value)).toEqual(['小计', 'B', 'A']);
    expect(pivotTable.dataset.getAggregator(['合计', 'B'], [], 'balance').value()).toBe(200);
    const groupedTotalCell = findBodyCell(pivotTable, ['合计', 'B'], 'grand-total');
    const paths = pivotTable.getCellHeaderPaths(groupedTotalCell.col, groupedTotalCell.row);
    expect(pivotTable.getCellAddressByHeaderPaths(paths)).toEqual(groupedTotalCell);
    pivotTable.release();
  });
});
