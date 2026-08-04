import * as VTable from '@visactor/vtable';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';

const columns: VTable.ColumnsDefine = [
  { field: 'name', title: 'Name', width: 180 },
  { field: 'department', title: 'Department', width: 160 },
  { field: 'status', title: 'Status', width: 120 }
];

const detailColumns: VTable.ColumnsDefine = [
  { field: 'project', title: 'Project', width: 180 },
  { field: 'role', title: 'Role', width: 140 }
];

const createRecords = (prefix: string) => [
  {
    id: `${prefix}-1`,
    name: `${prefix} Employee 1`,
    department: 'Engineering',
    status: 'Active',
    children: [
      { project: `${prefix} Project A`, role: 'Owner' },
      { project: `${prefix} Project B`, role: 'Reviewer' }
    ]
  },
  {
    id: `${prefix}-2`,
    name: `${prefix} Employee 2`,
    department: 'Design',
    status: 'Active',
    children: [{ project: `${prefix} Project C`, role: 'Designer' }]
  }
];

const createStatusBar = () => {
  const container = document.getElementById(CONTAINER_ID)!;
  const status = document.createElement('div');
  status.id = 'issue5185Status';
  status.style.cssText = 'height: 32px; line-height: 32px; font-size: 13px; color: #333;';
  status.textContent = 'Click "Check setRecords expand" to verify issue #5185.';

  const button = document.createElement('button');
  button.textContent = 'Check setRecords expand';
  button.style.cssText = 'margin: 0 0 8px 8px;';
  button.onclick = () => checkSetRecordsExpand();

  container.parentElement?.insertBefore(status, container);
  status.appendChild(button);
};

const getSubTableCount = (tableInstance: VTable.ListTable) =>
  ((tableInstance as any).internalProps.subTableInstances as Map<number, VTable.ListTable>)?.size ?? 0;

const checkSetRecordsExpand = () => {
  const tableInstance = (window as any).tableInstance as VTable.ListTable;
  const status = document.getElementById('issue5185Status')!;

  tableInstance.setRecords(createRecords('After'));
  tableInstance.toggleHierarchyState(0, tableInstance.columnHeaderLevelCount);

  const subTableCount = getSubTableCount(tableInstance);
  const firstRecord = tableInstance.records?.[0] as any;
  const pass = subTableCount > 0 && firstRecord?.hierarchyState === VTable.TYPES.HierarchyState.expand;

  status.textContent = `${pass ? 'PASS' : 'FAIL'} | subTableCount=${subTableCount}, hierarchyState=${
    firstRecord?.hierarchyState
  }`;
  return status.textContent;
};

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    records: createRecords('Initial'),
    columns,
    widthMode: 'standard',
    defaultRowHeight: 36,
    plugins: [
      new MasterDetailPlugin({
        detailTableOptions: {
          columns: detailColumns,
          heightMode: 'autoHeight',
          defaultRowHeight: 30,
          style: {
            height: 90
          }
        }
      })
    ]
  };

  createStatusBar();
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID)!, option);
  (window as any).tableInstance = tableInstance;
  (window as any).issue5185Run = checkSetRecordsExpand;
}
