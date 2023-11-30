import * as VTable from '../../src';
import {
  flowerVideoUrl,
  animal1ImageUrl,
  animal2ImageUrl,
  animal3ImageUrl,
  animal4ImageUrl,
  animalImageUrl
} from '../resource-url';
import { InputEditor } from '@visactor/vtable-editors';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);
export function createTable() {
  const personsDataSource = [
    {
      progress: 100,
      id: 1,
      name: 'a',
      image: animal1ImageUrl,
      link: flowerVideoUrl
    },
    {
      progress: 80,
      id: 2,
      name: 'b',
      image: animal1ImageUrl,
      link: flowerVideoUrl
    },
    {
      progress: 1,
      id: 3,
      name: 'c',
      image: animal1ImageUrl,
      link: flowerVideoUrl
    },
    {
      progress: 55,
      id: 4,
      name: 'd',
      image: animal1ImageUrl,
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
        title: 'Image',
        headerStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'sans-serif'
        },
        field: 'image',
        cellType: 'image'
      },
      {
        title: 'Video',
        headerStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'sans-serif'
        },
        field: 'link',
        cellType: 'video',
        width: 300,
        style: {
          padding: 1
        }
        // keepAspectRatio: true,
        // imageAutoSizing: true,
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2,
    editor: 'input'
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(personsDataSource, {
    field: 'progress',
    order: 'desc'
  });
  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
