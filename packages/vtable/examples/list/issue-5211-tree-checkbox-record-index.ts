import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    {
      task: { text: 'Project A', checked: true },
      owner: 'Alice',
      status: 'collapsed parent',
      hierarchyState: VTable.TYPES.HierarchyState.collapse,
      children: [
        {
          task: { text: 'Hidden task A-1', checked: true },
          owner: 'Bob',
          status: 'hidden child'
        },
        {
          task: { text: 'Hidden task A-2', checked: true },
          owner: 'Cindy',
          status: 'hidden child'
        }
      ]
    },
    {
      task: { text: 'Project B', checked: true },
      owner: 'David',
      status: 'root'
    }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns: [
      {
        field: 'task',
        title: 'Task',
        tree: true,
        cellType: 'checkbox',
        headerType: 'checkbox',
        width: 260
      },
      { field: 'owner', title: 'Owner', width: 120 },
      { field: 'status', title: 'Status', width: 180 }
    ],
    defaultRowHeight: 38,
    hierarchyIndent: 20,
    enableCheckboxCascade: false,
    enableHeaderCheckboxCascade: false,
    theme: VTable.themes.BRIGHT
  };

  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  const toolbar = document.createElement('div');
  toolbar.style.cssText = 'position:absolute;top:8px;left:8px;z-index:10;display:flex;gap:8px;';

  const setHiddenChildButton = document.createElement('button');
  setHiddenChildButton.textContent = 'Uncheck hidden child [0,0]';
  setHiddenChildButton.onclick = () => {
    tableInstance.setCellCheckboxStateByRecordIndex([0, 0], 'task', false);
    console.log('checkbox state after set hidden child:', tableInstance.getCheckboxState('task'));
  };

  const clearAllButton = document.createElement('button');
  clearAllButton.textContent = 'Clear task checkbox field';
  clearAllButton.onclick = () => {
    tableInstance.clearAllCheckboxState('task');
    console.log('checkbox state after clear:', tableInstance.getCheckboxState('task'));
  };

  toolbar.appendChild(setHiddenChildButton);
  toolbar.appendChild(clearAllButton);
  document.body.appendChild(toolbar);

  return tableInstance;
}
