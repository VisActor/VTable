import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const personsDataSource = [
    {
      progress: 100,
      id: 1,
      name: 'a',
      link: 'http://' + window.location.host + '/mock-data/custom-render/flower.jpg'
    },
    {
      progress: 80,
      id: 2,
      name: 'b',
      link: 'http://' + window.location.host + '/mock-data/custom-render/wolf.jpg'
    },
    {
      progress: 1,
      id: 3,
      name: 'c',
      link: 'http://' + window.location.host + '/mock-data/custom-render/rabbit.jpg'
    },
    {
      progress: 55,
      id: 4,
      name: 'd',
      link: 'http://' + window.location.host + '/mock-data/custom-render/cat.jpg'
    },
    {
      progress: 28,
      id: 5,
      name: 'e',
      link: 'http://' + window.location.host + '/mock-data/custom-render/bear.jpg'
    }
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
        width: 150,
        showSort: true //显示VTable内置排序图标
      },
      {
        field: 'id',
        title: 'ID',
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
        title: 'ID说明',
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
        title: 'Link',
        headerStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'sans-serif'
        },
        style: {
          autoWrapText: true
        },
        field: 'link',
        width: 300,
        cellType: 'link',
        linkTarget: '_self'
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2,
    heightMode: 'autoHeight'
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(personsDataSource, {
    field: 'progress',
    order: 'desc'
  });

  bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
