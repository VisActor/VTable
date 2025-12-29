import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { FilterPlugin } from '../../src/filter';
const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    {
      id: 1,
      name: 'name.1',
      name_1: 'name_1.1',
      name_2: 'name_2.1',
      name_2_1: 'name_2_1.1',
      name_2_2: 'name_2_2.1'
    },
    {
      id: 2,
      name: 'name.2',
      name_1: 'name_1.2',
      name_2: 'name_2.2',
      name_2_1: 'name_2_1.2',
      name_2_2: 'name_2_2.2'
    },
    {
      id: 3,
      name: 'name.3',
      name_1: 'name_1.3',
      name_2: 'name_2.3',
      name_2_1: 'name_2_1.3',
      name_2_2: 'name_2_2.3'
    },
    {
      id: 4,
      name: 'name.4',
      name_1: 'name_1.4',
      name_2: 'name_2.4',
      name_2_1: 'name_2_1.4',
      name_2_2: 'name_2_2.4'
    },
    {
      id: 5,
      name: 'name.5',
      name_1: 'name_1.5',
      name_2: 'name_2.5',
      name_2_1: 'name_2_1.5',
      name_2_2: 'name_2_2.5'
    }
  ];

  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 100
    },
    {
      field: 'name',
      title: 'Name',
      columns: [
        {
          field: 'name_1',
          title: 'Name_1',
          width: 120
        },
        {
          field: 'name_2',
          title: 'Name_2',
          width: 150,
          columns: [
            {
              field: 'name_2_1',
              title: 'Name_2_1',
              width: 150
            },
            {
              field: 'name_2_2',
              title: 'Name_2_2',
              width: 150
            }
          ]
        }
      ]
    }
  ];

  const filterPlugin = new FilterPlugin({});
  (window as any).filterPlugin = filterPlugin;

  const option = {
    records,
    columns,
    headerHierarchyType: 'grid-tree', // 启用树形折叠
    headerExpandLevel: 2, // 默认展开至第二级
    widthMode: 'standard',
    defaultRowHeight: 40,
    plugins: [filterPlugin]
  };

  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);

  (window as any).tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
}
