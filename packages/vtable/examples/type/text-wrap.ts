import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const Table_CONTAINER_DOM_ID = 'vTable';

export function createTable() {
  const personsDataSource: any[] = [];
  for (let i = 0; i < 10; i++) {
    personsDataSource.push({
      progress: i,
      id: i + 1,
      name: 'name'
    });
  }
  const option: VTable.ListTableConstructorOptions = {
    parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
    columns: [
      {
        field: 'progress',
        fieldFormat(rec) {
          return `已完成已完成已完成${rec.progress}%`;
        },
        caption: 'progress',
        description: '这是一个标题的详细描述',
        width: 150,
        showSort: true, //显示VTable内置排序图标
        style: {
          autoWrapText: true,
          lineHeight: 50,
          textBaseline: 'middle'
        }
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
        width: 100,
        style: {
          lineHeight: 40,
          textBaseline: 'middle'
        }
      },
      {
        field: 'id',
        fieldFormat(rec) {
          return `手动换行\n这是这是第${rec.id}号`;
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
        caption: 'Name',
        headerStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'sans-serif'
        },
        field: 'name',
        width: 150
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2,
    defaultRowHeight: 50,
    autoRowHeight: true,
    // theme: {},
    hover: {
      // isShowTooltip: true, //当hover到未展示全的文本上时是否需要出现提示框
      // enableRowHighlight: true, //hover到的行，整行高亮
      // enableColumnHighlight: true, //hover到的行，整行高亮
      highlightMode: 'cross',
      // enableSingalCellHighlight: true, //hover到的单元格高亮
      disableHeaderHover: true
    }
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
  (window as any).tableInstance = instance;
}
