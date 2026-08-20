import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';
const CHECKBOX_FIELD = 'task';

function getRecordByPath(records: any[], path: number[]) {
  let current: any = records;
  for (let i = 0; i < path.length; i++) {
    current = current?.[path[i]];
    if (i < path.length - 1) {
      current = current?.children;
    }
  }
  return current;
}

function getTaskText(record: any): string {
  return typeof record?.task === 'object' ? record.task.text : record?.task;
}

function getChecked(table: VTable.ListTable, path: number[]) {
  return table.stateManager.checkedState.get(path.toString())?.[CHECKBOX_FIELD];
}

function createRecords() {
  return [
    {
      task: 'Project A',
      owner: 'Alice',
      status: 'checked before move',
      hierarchyState: VTable.TYPES.HierarchyState.expand,
      children: [
        {
          task: 'Task A-1',
          owner: 'Bob',
          status: 'checked before move'
        },
        {
          task: 'Task A-2',
          owner: 'Cindy',
          status: 'unchecked'
        }
      ]
    },
    {
      task: 'Project B',
      owner: 'David',
      status: 'unchecked'
    },
    {
      task: 'Project C',
      owner: 'Emily',
      status: 'unchecked'
    }
  ];
}

export function createTable() {
  const records = createRecords();
  const container = document.getElementById(CONTAINER_ID);
  if (container) {
    container.style.width = '1000px';
    container.style.height = '520px';
  }

  const option: VTable.ListTableConstructorOptions = {
    container,
    records,
    rowSeriesNumber: {
      title: '',
      dragOrder: true,
      width: 46
    },
    columns: [
      {
        field: CHECKBOX_FIELD,
        title: 'Task',
        tree: true,
        cellType: 'checkbox',
        headerType: 'checkbox',
        width: 260
      },
      { field: 'owner', title: 'Owner', width: 120 },
      { field: 'status', title: 'Status', width: 220 }
    ],
    defaultRowHeight: 38,
    hierarchyIndent: 20,
    hierarchyExpandLevel: 2,
    enableCheckboxCascade: false,
    enableHeaderCheckboxCascade: false,
    theme: VTable.themes.BRIGHT
  };

  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  tableInstance.setCellCheckboxStateByRecordIndex(0, CHECKBOX_FIELD, true);
  tableInstance.setCellCheckboxStateByRecordIndex([0, 0], CHECKBOX_FIELD, true);

  const toolbar = document.createElement('div');
  toolbar.style.cssText = [
    'position:absolute',
    'top:8px',
    'left:8px',
    'right:8px',
    'z-index:10',
    'display:flex',
    'align-items:flex-start',
    'gap:8px',
    'font:12px sans-serif'
  ].join(';');

  const moveButton = document.createElement('button');
  moveButton.textContent = 'Move Project A after Project C';

  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';

  const status = document.createElement('pre');
  status.style.cssText = [
    'margin:0',
    'padding:8px 10px',
    'background:rgba(255,255,255,0.92)',
    'border:1px solid #d0d7de',
    'border-radius:4px',
    'line-height:1.5',
    'min-width:520px'
  ].join(';');

  const renderStatus = (label: string) => {
    const data = tableInstance.records as any[];
    const projectAAt2 = getTaskText(getRecordByPath(data, [2])) === 'Project A';
    const taskA1At20 = getTaskText(getRecordByPath(data, [2, 0])) === 'Task A-1';
    const projectAChecked = getChecked(tableInstance, [2]) === true;
    const taskA1Checked = getChecked(tableInstance, [2, 0]) === true;
    const staleChildState = tableInstance.stateManager.checkedState.get('0,0')?.[CHECKBOX_FIELD] === true;

    status.textContent = [
      label,
      `record order: ${data.map(record => getTaskText(record)).join(' -> ')}`,
      `Project A at [2]: ${projectAAt2 ? 'yes' : 'no'}, checked: ${projectAChecked ? 'yes' : 'no'}`,
      `Task A-1 at [2,0]: ${taskA1At20 ? 'yes' : 'no'}, checked: ${taskA1Checked ? 'yes' : 'no'}`,
      `stale checkedState at old [0,0]: ${staleChildState ? 'yes' : 'no'}`,
      `result: ${projectAAt2 && taskA1At20 && projectAChecked && taskA1Checked && !staleChildState ? 'fixed' : 'repro'}`
    ].join('\n');
  };

  moveButton.onclick = () => {
    tableInstance.changeHeaderPosition({
      source: { col: 0, row: 1 },
      target: { col: 0, row: 5 },
      movingColumnOrRow: 'row'
    });
    renderStatus('after moving Project A from [0] to [2]');
  };

  resetButton.onclick = () => {
    tableInstance.release();
    toolbar.remove();
    createTable();
  };

  toolbar.appendChild(moveButton);
  toolbar.appendChild(resetButton);
  toolbar.appendChild(status);
  document.body.appendChild(toolbar);

  renderStatus('before move: Project A and Task A-1 are checked');

  return tableInstance;
}
