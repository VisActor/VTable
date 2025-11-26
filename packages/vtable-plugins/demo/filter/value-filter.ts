import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { FilterPlugin } from '../../src/filter';
const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    {
      id: 1,
      class: 1,
      phone: 30,
      computer: 30,
      tv: 30,
      pad: 30
    },
    {
      id: 2,
      class: 1,
      phone: 30,
      computer: 10,
      tv: 15,
      pad: 0
    },
    {
      id: 3,
      class: 4,
      phone: 360,
      computer: 360,
      tv: 240,
      pad: 240
    },
    {
      id: 4,
      class: 2,
      phone: 20,
      computer: 0,
      tv: 20,
      pad: 10
    },
    {
      id: 5,
      class: 4,
      phone: 20,
      computer: 15,
      tv: 10,
      pad: 0
    },
    {
      id: 6,
      class: 5,
      phone: 30,
      computer: 30,
      tv: 30,
      pad: 30
    },
    {
      id: 7,
      class: 3,
      phone: 2,
      computer: 1,
      tv: 1,
      pad: 1
    },
    {
      id: 8,
      class: 3,
      phone: 20,
      computer: 0,
      tv: 0,
      pad: 0
    },
    {
      id: 9,
      class: 3,
      phone: 10,
      computer: 20,
      tv: 10,
      pad: 10
    },
    {
      id: 10,
      class: 2,
      phone: 60,
      computer: 0,
      tv: 90,
      pad: 0
    },
    {
      id: 11,
      class: 1,
      phone: 30,
      computer: 20,
      tv: 10,
      pad: 0
    },
    {
      id: 12,
      class: 1,
      phone: 0,
      computer: 0,
      tv: 0,
      pad: 0
    }
  ];
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 120,
      sort: true
    },
    {
      field: 'class',
      title: ' 班级',
      width: 120,
      sort: true,
      headerIcon: {
        type: 'svg',
        svg: '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#ff5a5f" stroke="#333" stroke-width="1"/></svg>',
        width: 20,
        height: 20,
        name: 'name-icon',
        positionType: VTable.TYPES.IconPosition.absoluteRight,
        marginRight: 30
      }
    },
    {
      field: 'phone',
      title: '手机',
      width: 100
    },
    {
      field: 'computer',
      title: '计算机',
      width: 120,
      sort: true
    },
    {
      field: 'tv',
      title: '电视机',
      width: 150,
      sort: true
    },
    {
      field: 'pad',
      title: '平板电脑',
      width: 100,
      sort: true
    }
  ];

  const filterPlugin = new FilterPlugin({});
  (window as any).filterPlugin = filterPlugin;

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    padding: 10,
    plugins: [filterPlugin]
  };
  const tableInstance = new VTable.ListTable(option);
  (window as any).tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
}
