import * as VTable from '@visactor/vtable';
import { MasterDetailPlugin } from '@visactor/vtable-plugins';
import { SearchComponent } from '../../src';

const CONTAINER_ID = 'vTable';
const demoWindow = window as typeof window & {
  tableInstance?: VTable.ListTable;
  search?: SearchComponent;
  masterDetailPlugin?: MasterDetailPlugin;
};

const records = Array.from({ length: 8 }, (_, index) => ({
  orderId: `ORDER-${String(index + 1).padStart(3, '0')}`,
  customer: index % 2 === 0 ? `Target customer ${index + 1}` : `Customer ${index + 1}`,
  status: index % 3 === 0 ? 'Review' : 'Ready',
  children: [
    {
      task: `Target task ${index + 1}`,
      owner: `Owner ${index + 1}`,
      children: [
        {
          task: `Target nested task ${index + 1}`,
          owner: `Reviewer ${index + 1}`
        }
      ]
    },
    {
      task: `Packaging ${index + 1}`,
      owner: `Operator ${index + 1}`
    }
  ]
}));

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    return;
  }

  const masterDetailPlugin = new MasterDetailPlugin({
    detailTableOptions: {
      columns: [
        { field: 'task', title: 'Detail task', tree: true, width: 260 },
        { field: 'owner', title: 'Owner', width: 180 }
      ],
      hierarchyExpandLevel: 1,
      defaultRowHeight: 34,
      defaultHeaderRowHeight: 36,
      style: {
        margin: [8, 16],
        height: 150
      },
      theme: VTable.themes.BRIGHT
    }
  });

  const tableInstance = new VTable.ListTable({
    container,
    records,
    columns: [
      { field: 'orderId', title: 'Order', width: 150 },
      { field: 'customer', title: 'Customer', width: 220 },
      { field: 'status', title: 'Status', width: 120 }
    ],
    defaultRowHeight: 40,
    heightMode: 'standard',
    plugins: [masterDetailPlugin]
  });

  demoWindow.tableInstance = tableInstance;
  demoWindow.masterDetailPlugin = masterDetailPlugin;
  demoWindow.search = new SearchComponent({
    table: tableInstance,
    autoJump: true,
    scrollOption: {
      duration: 500
    }
  });

  const input = document.getElementById('search-component-input') as HTMLInputElement | null;
  if (input) {
    input.value = 'Target';
  }

  requestAnimationFrame(() => {
    records.forEach((_record, recordIndex) => {
      const row = tableInstance.getTableIndexByRecordIndex(recordIndex);
      if (typeof row === 'number' && tableInstance.getHierarchyState(0, row) !== 'expand') {
        tableInstance.toggleHierarchyState(0, row);
      }
    });
  });
}
