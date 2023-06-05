import * as VTable from '../../src';
import { flowerVideoUrl } from '../resource-url';
const ListTable = VTable.ListTable;
const Table_CONTAINER_DOM_ID = 'vTable';

export function createTable() {
  const personsDataSource = [
    {
      progress: 100,
      id: 1,
      name: 'a',
      link: flowerVideoUrl
    },
    {
      progress: 80,
      id: 2,
      name: 'b',
      link: flowerVideoUrl
    },
    {
      progress: 1,
      id: 3,
      name: 'c',
      link: flowerVideoUrl
    },
    {
      progress: 55,
      id: 4,
      name: 'd',
      link: flowerVideoUrl
    },
    {
      progress: 28,
      id: 5,
      name: 'e',
      link: flowerVideoUrl
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
    columns: [
      {
        field: 'progress',
        fieldFormat(rec) {
          return `已完成${rec.progress}%`;
        },
        caption: 'progress',
        description: '这是一个标题的详细描述',
        width: 150
      },
      {
        field: 'id',
        caption: 'ID',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        },
        width: 100
      },
      {
        field: 'id',
        fieldFormat(rec) {
          return `这是第${rec.id}号`;
        },
        caption: 'ID说明',
        description: '这是一个ID详细描述',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        },
        width: 150
      },
      {
        caption: 'Video',
        headerStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'sans-serif'
        },
        field: 'link',
        columnType: 'video',
        width: 300,
        style: {
          padding: 1
        }
        // keepAspectRatio: true,
        // imageAutoSizing: true,
      }
    ],
    showPin: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(personsDataSource, {
    field: 'progress',
    order: 'desc'
  });

  VTable.bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  // 只为了方便控制太调试用，不要拷贝
  (window as any).tableInstance = instance;
}
