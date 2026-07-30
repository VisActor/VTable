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
    content: 'N',
    visibleTime: 'mouseenter_cell',
    style: {
      fill: '#999'
    }
  });
  VTable.register.icon('sort_upward', {
    ...sortIconBase,
    name: 'sort_upward',
    content: 'A',
    visibleTime: 'always',
    style: {
      fill: '#1677ff'
    }
  });
  VTable.register.icon('sort_downward', {
    ...sortIconBase,
    name: 'sort_downward',
    content: 'D',
    visibleTime: 'always',
    style: {
      fill: '#1677ff'
    }
  });
}

function getSortIconState(tableInstance: VTable.ListTable) {
  let state: any = null;
  tableInstance.scenegraph.getCell(0, 0).forEachChildren((mark: any) => {
    if (mark.attribute?.funcType === VTable.TYPES.IconFuncTypeEnum.sort) {
      state = {
        name: mark.name,
        visibleTime: mark.attribute.visibleTime,
        opacity: mark.attribute.opacity
      };
    }
  });
  return state;
}

function showCurrentSortIcon(tableInstance: VTable.ListTable) {
  tableInstance.scenegraph.getCell(0, 0).forEachChildren((mark: any) => {
    if (mark.attribute?.funcType === VTable.TYPES.IconFuncTypeEnum.sort) {
      mark.setAttribute('opacity', 1);
    }
  });
}

export function createTable() {
  registerSortIcons();

  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '600px';
  container.style.height = '360px';

  const tableInstance = new VTable.ListTable({
    container,
    records: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Carol' }
    ],
    columns: [
      { field: 'id', title: 'ID', width: 120, sort: true },
      { field: 'name', title: 'Name', width: 200 }
    ]
  });

  window.tableInstance = tableInstance;
  (window as any).issue4798GetSortIconState = () => getSortIconState(tableInstance);
  (window as any).issue4798CycleSort = () => {
    showCurrentSortIcon(tableInstance);
    const shownNormal = getSortIconState(tableInstance);
    tableInstance.updateSortState({ field: 'id', order: 'asc' });
    const asc = getSortIconState(tableInstance);
    tableInstance.updateSortState({ field: 'id', order: 'desc' });
    const desc = getSortIconState(tableInstance);
    tableInstance.updateSortState(null);
    const normal = getSortIconState(tableInstance);
    return { shownNormal, asc, desc, normal };
  };
}
