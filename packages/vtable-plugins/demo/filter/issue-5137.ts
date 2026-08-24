import * as VTable from '@visactor/vtable';
import { FilterPlugin } from '../../src/filter';

const CONTAINER_ID = 'vTable';

type RecordItem = {
  id: number;
  name: string;
  gender: '男' | '女';
  city: string;
  department: string;
  status: '在职' | '请假' | '离职';
};

function createRecords(): RecordItem[] {
  return [
    { id: 1, name: '张三', gender: '男', city: '北京', department: '研发', status: '在职' },
    { id: 2, name: '李四', gender: '女', city: '上海', department: '销售', status: '请假' },
    { id: 3, name: '王五', gender: '男', city: '深圳', department: '研发', status: '在职' },
    { id: 4, name: '赵六', gender: '女', city: '杭州', department: '设计', status: '离职' },
    { id: 5, name: '钱七', gender: '男', city: '广州', department: '运营', status: '在职' },
    { id: 6, name: '孙八', gender: '女', city: '苏州', department: '销售', status: '请假' }
  ];
}

function createColumns(): VTable.ColumnsDefine {
  return [
    { field: 'id', title: 'ID', width: 80, sort: true },
    { field: 'name', title: '姓名', width: 120, sort: true },
    { field: 'gender', title: '性别', width: 100 },
    { field: 'city', title: '城市', width: 120 },
    { field: 'department', title: '部门', width: 120 },
    { field: 'status', title: '状态', width: 120 }
  ];
}

function getOrderText(table: VTable.ListTable) {
  const visibleFields: string[] = [];
  for (let col = 0; col < table.colCount; col++) {
    visibleFields.push(String(table.getHeaderField(col, 0)));
  }
  return visibleFields.join(' | ');
}

function getOptionOrderText(table: VTable.ListTable) {
  return (table.options.columns ?? []).map(col => `${String(col.field)}${col.hide ? '(hide)' : ''}`).join(' | ');
}

function getVisibleHeaderColByField(table: VTable.ListTable, field: string) {
  for (let col = 0; col < table.colCount; col++) {
    if (table.getHeaderField(col, 0) === field) {
      return col;
    }
  }
  return -1;
}

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    return;
  }

  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.top = '12px';
  panel.style.right = '12px';
  panel.style.zIndex = '9999';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.gap = '8px';
  panel.style.width = '420px';
  panel.style.padding = '12px';
  panel.style.background = 'rgba(17,24,39,0.88)';
  panel.style.color = '#fff';
  panel.style.fontSize = '12px';
  panel.style.borderRadius = '8px';

  const title = document.createElement('div');
  title.textContent = 'issue-5137 repro: 隐藏列 -> 拖拽排序 -> Filter 确认';
  title.style.fontWeight = 'bold';

  const desc = document.createElement('div');
  desc.textContent =
    '手动复现：1. 点击“隐藏性别列” 2. 直接拖拽“城市”列到“姓名”后面 3. 点击“状态”列的筛选图标并确认。也可用下面的一键脚本。';
  desc.style.lineHeight = '1.5';

  const buttonRow = document.createElement('div');
  buttonRow.style.display = 'flex';
  buttonRow.style.flexWrap = 'wrap';
  buttonRow.style.gap = '8px';

  const status = document.createElement('pre');
  status.style.margin = '0';
  status.style.whiteSpace = 'pre-wrap';
  status.style.lineHeight = '1.5';

  const records = createRecords();
  const columns = createColumns();
  const filterPlugin = new FilterPlugin({
    defaultEnabled: true
  });

  const table = new VTable.ListTable({
    container,
    records,
    columns,
    widthMode: 'standard',
    dragHeaderMode: 'all',
    plugins: [filterPlugin]
  });

  function updateStatus(label: string) {
    status.textContent = `${label}\n` + `current: ${getOrderText(table)}\n` + `options: ${getOptionOrderText(table)}`;
  }

  function hideGenderColumn() {
    const nextColumns = table.columns.map(col => {
      if (col.field === 'gender') {
        return {
          ...col,
          hide: true
        };
      }
      return { ...col };
    });
    table.updateColumns(nextColumns, { clearRowHeightCache: false });
    updateStatus('已隐藏 `gender` 列');
  }

  function dragCityAfterDepartment() {
    const cityIndex = getVisibleHeaderColByField(table, 'city');
    const departmentIndex = getVisibleHeaderColByField(table, 'department');
    if (cityIndex < 0 || departmentIndex < 0) {
      updateStatus('未找到 `city` 或 `department` 列');
      return;
    }
    table.changeHeaderPosition({
      source: { col: cityIndex, row: 0 },
      target: { col: departmentIndex, row: 0 },
      movingColumnOrRow: 'column'
    });
    updateStatus('已把 `city` 拖到 `department` 后面');
  }

  function applyStatusFilter() {
    filterPlugin.applyFilterSnapshot({
      filters: [
        {
          field: 'status',
          type: 'byValue',
          values: ['在职', '请假'],
          enable: true
        }
      ]
    });
    updateStatus('已执行一次 Filter 确认（status in 在职/请假）');
  }

  function runAllSteps() {
    hideGenderColumn();
    dragCityAfterDepartment();
    applyStatusFilter();
    updateStatus('已完成完整复现链路');
  }

  function resetTable() {
    table.updateOption({
      ...table.options,
      records: createRecords(),
      columns: createColumns(),
      plugins: [filterPlugin]
    });
    filterPlugin.applyFilterSnapshot({ filters: [] });
    updateStatus('已重置为初始状态');
  }

  function createButton(text: string, onClick: () => void) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.padding = '6px 10px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '4px';
    button.style.border = '1px solid rgba(255,255,255,0.2)';
    button.style.background = 'rgba(255,255,255,0.12)';
    button.style.color = '#fff';
    button.addEventListener('click', onClick);
    return button;
  }

  buttonRow.appendChild(createButton('隐藏性别列', hideGenderColumn));
  buttonRow.appendChild(createButton('拖拽 city 到 department 后', dragCityAfterDepartment));
  buttonRow.appendChild(createButton('一键复现', runAllSteps));
  buttonRow.appendChild(createButton('重置', resetTable));

  panel.appendChild(title);
  panel.appendChild(desc);
  panel.appendChild(buttonRow);
  panel.appendChild(status);
  document.body.appendChild(panel);

  const demoWindow = window as Window &
    typeof globalThis & {
      tableInstance?: VTable.ListTable;
      filterPlugin?: FilterPlugin;
      issue5137?: Record<string, unknown>;
    };

  demoWindow.tableInstance = table;
  demoWindow.filterPlugin = filterPlugin;
  demoWindow.issue5137 = {
    hideGenderColumn,
    dragCityAfterDepartment,
    applyStatusFilter,
    runAllSteps,
    resetTable,
    getOrderText: () => getOrderText(table)
  };

  updateStatus('初始化完成');
}
