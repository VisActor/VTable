import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

const columns: VTable.ColumnsDefine = [
  {
    field: 'name',
    title: 'Name',
    width: 240,
    sort: true,
    tree: true
  }
];

const records = [
  {
    name: 'Parent',
    children: [{ name: 'Child' }]
  }
];

const initialIconColors = {
  sort_color: '#111111',
  collapse_color: '#222222',
  dragReorder_color: '#333333'
};

const updatedIconColors = {
  sort_color: '#123456',
  collapse_color: '#234567',
  dragReorder_color: '#345678'
};

const removeToolbar = () => {
  document.getElementById('issue4816Toolbar')?.remove();
};

const setStatus = (message: string, pass: boolean) => {
  const status = document.getElementById('issue4816Status');
  if (!status) {
    return;
  }
  status.textContent = message;
  status.style.color = pass ? '#237804' : '#cf1322';
};

const getIconSvgState = (tableInstance: VTable.ListTable) => {
  const internalProps = (tableInstance as any).internalProps;
  return {
    sort: internalProps.headerHelper.normalIcon.svg,
    collapse: internalProps.bodyHelper.collapseIcon.svg,
    drag: internalProps.rowSeriesNumberHelper.dragReorderIconName.svg
  };
};

const includesColors = (iconState: ReturnType<typeof getIconSvgState>, colors: typeof updatedIconColors) =>
  iconState.sort.includes(colors.sort_color) &&
  iconState.collapse.includes(colors.collapse_color) &&
  iconState.drag.includes(colors.dragReorder_color);

export function createTable() {
  removeToolbar();

  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '640px';
  container.style.height = '360px';

  const toolbar = document.createElement('div');
  toolbar.id = 'issue4816Toolbar';
  toolbar.style.cssText = 'display:flex;gap:8px;align-items:center;height:48px;font-size:12px;';
  toolbar.innerHTML = `
    <button id="issue4816CheckInitial">检查初始图标颜色</button>
    <button id="issue4816Update">updateOption 更新颜色并检查</button>
    <span>预期：updateOption 后 sort/collapse/drag 图标 SVG 都使用新颜色。</span>
    <strong id="issue4816Status"></strong>
  `;
  container.before(toolbar);

  const createOption = (functionalIconsStyle: typeof initialIconColors): VTable.ListTableConstructorOptions => ({
    columns,
    records,
    rowSeriesNumber: { dragOrder: true },
    theme: {
      functionalIconsStyle
    }
  });

  const tableInstance = new VTable.ListTable(container, createOption(initialIconColors));

  const checkInitial = () => {
    const iconState = getIconSvgState(tableInstance);
    const pass = includesColors(iconState, initialIconColors);
    const sortMatched = iconState.sort.includes(initialIconColors.sort_color);
    const collapseMatched = iconState.collapse.includes(initialIconColors.collapse_color);
    const dragMatched = iconState.drag.includes(initialIconColors.dragReorder_color);

    setStatus(
      `${pass ? 'PASS' : 'FAIL'} | initial sort=${sortMatched}, collapse=${collapseMatched}, drag=${dragMatched}`,
      pass
    );
  };

  const updateAndCheck = () => {
    tableInstance.updateOption(createOption(updatedIconColors));
    const iconState = getIconSvgState(tableInstance);
    const pass = includesColors(iconState, updatedIconColors);
    const sortMatched = iconState.sort.includes(updatedIconColors.sort_color);
    const collapseMatched = iconState.collapse.includes(updatedIconColors.collapse_color);
    const dragMatched = iconState.drag.includes(updatedIconColors.dragReorder_color);

    setStatus(
      `${pass ? 'PASS' : 'FAIL'} | updated sort=${sortMatched}, collapse=${collapseMatched}, drag=${dragMatched}`,
      pass
    );
  };

  document.getElementById('issue4816CheckInitial')?.addEventListener('click', checkInitial);
  document.getElementById('issue4816Update')?.addEventListener('click', updateAndCheck);

  checkInitial();

  (window as any).tableInstance = tableInstance;
  (window as any).issue4816Run = () => {
    updateAndCheck();
    return document.getElementById('issue4816Status')?.textContent;
  };

  const release = tableInstance.release.bind(tableInstance);
  tableInstance.release = () => {
    removeToolbar();
    release();
  };
}
