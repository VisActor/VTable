import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

const sortIconBase = {
  type: 'text' as const,
  width: 16,
  height: 16,
  funcType: VTable.TYPES.IconFuncTypeEnum.sort,
  positionType: VTable.TYPES.IconPosition.absoluteRight,
  marginRight: 8,
  cursor: 'pointer'
};

function registerSortIcons() {
  VTable.register.icon('sort_normal', {
    ...sortIconBase,
    name: 'sort_normal',
    content: '-',
    visibleTime: 'mouseenter_cell',
    style: {
      fill: '#999',
      fontWeight: 'bold'
    }
  });
  VTable.register.icon('sort_upward', {
    ...sortIconBase,
    name: 'sort_upward',
    content: '^',
    visibleTime: 'always',
    style: {
      fill: '#1677ff',
      fontWeight: 'bold'
    }
  });
  VTable.register.icon('sort_downward', {
    ...sortIconBase,
    name: 'sort_downward',
    content: 'v',
    visibleTime: 'always',
    style: {
      fill: '#f5222d',
      fontWeight: 'bold'
    }
  });
}

function getSortIconState(tableInstance: VTable.ListTable, col: number) {
  let state: any = null;
  tableInstance.scenegraph.getCell(col, 0).forEachChildren((mark: any) => {
    if (mark.attribute?.funcType === VTable.TYPES.IconFuncTypeEnum.sort) {
      state = {
        name: mark.name,
        text: mark.attribute.text,
        fill: mark.attribute.fill,
        visibleTime: mark.attribute.visibleTime,
        opacity: mark.attribute.opacity
      };
    }
  });
  return state;
}

export function createTable() {
  registerSortIcons();

  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '600px';
  container.style.height = '360px';

  const tableInstance = new VTable.ListTable({
    container,
    records: [
      { id: 1, name: 'Alice', score: 91 },
      { id: 2, name: 'Bob', score: 85 },
      { id: 3, name: 'Carol', score: 96 }
    ],
    columns: [
      { field: 'id', title: 'ID', width: 120, sort: true },
      { field: 'name', title: 'Name', width: 200, sort: true },
      { field: 'score', title: 'Score', width: 120 }
    ]
  });

  window.tableInstance = tableInstance;
  (window as any).issue4798GetSortIconState = (col = 0) => getSortIconState(tableInstance, col);
  (window as any).issue4798Run = () => {
    tableInstance.updateSortState({ field: 'id', order: 'asc' });
    const firstAsc = getSortIconState(tableInstance, 0);
    tableInstance.updateSortState({ field: 'name', order: 'asc' });
    const firstNormalAfterSecondSort = getSortIconState(tableInstance, 0);
    const secondAsc = getSortIconState(tableInstance, 1);
    return {
      firstAsc,
      firstNormalAfterSecondSort,
      secondAsc,
      fixed:
        firstNormalAfterSecondSort?.name === 'sort_normal' &&
        firstNormalAfterSecondSort?.text === '-' &&
        firstNormalAfterSecondSort?.fill === '#999' &&
        firstNormalAfterSecondSort?.visibleTime === 'mouseenter_cell' &&
        firstNormalAfterSecondSort?.opacity === 0 &&
        secondAsc?.name === 'sort_upward' &&
        secondAsc?.text === '^' &&
        secondAsc?.fill === '#1677ff' &&
        secondAsc?.visibleTime === 'always' &&
        secondAsc?.opacity === 1
    };
  };
}
