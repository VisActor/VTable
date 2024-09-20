import * as VTable from '@visactor/vtable';
import { animal1ImageUrl, animal2ImageUrl, animal3ImageUrl, animal4ImageUrl, animalImageUrl } from '../resource-url';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const personsDataSource = [
    {
      progress: 100,
      id: 1,
      name: 'a',
      link: animal1ImageUrl
    },
    {
      progress: 80,
      id: 2,
      name: 'b',
      link: animal1ImageUrl
    },
    {
      progress: 1,
      id: 3,
      name: 'c',
      link: animal2ImageUrl
    },
    {
      progress: 55,
      id: 4,
      name: 'd',
      link: animal3ImageUrl
    },
    {
      progress: 28,
      id: 5,
      name: 'e',
      link: animal4ImageUrl
    },
    ...new Array(200).fill({
      progress: 28,
      id: 5,
      name: 'e',
      link: animal4ImageUrl
    })
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'progress',
        fieldFormat(rec) {
          return `已完成${rec.progress}%`;
        },
        title: 'progress',
        description: '这是一个标题的详细描述',
        width: 150
      },
      {
        field: 'id',
        title: 'ID',
        // sort: (v1, v2, order) => {
        //   if (order === 'desc') {
        //     return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        //   }
        //   return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        // },
        width: 100
      },
      {
        field: 'id',
        fieldFormat(rec) {
          return `这是第${rec.id}号`;
        },
        title: 'ID说明',
        description: '这是一个ID详细描述',
        // sort: (v1, v2, order) => {
        //   if (order === 'desc') {
        //     return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        //   }
        //   return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        // },
        width: 150
      },
      {
        title: 'Image',
        headerStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'sans-serif'
        },
        field: 'link',
        cellType: 'image',
        // cellType(args) {
        //   if (args.row % 2 === 1) {
        //     return 'image';
        //   }
        //   return 'link';
        // },
        width: 200,
        style: {
          padding: 1
        }
        // keepAspectRatio: true,
        // imageAutoSizing: true
      },
      {
        field: 'progress',
        fieldFormat(rec) {
          return `已完成${rec.progress}%`;
        },
        title: 'progress',
        description: '这是一个标题的详细描述',
        width: 150
      }
    ],
    showFrozenIcon: false, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(personsDataSource, {
    field: 'progress'
    // order: 'desc'
  });

  // VTable.bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
