import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing'
  }));
};

VTable.register.icon('sort_normal', {
  type: 'svg',
  svg: `<svg t="1669210412838" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5700" width="200" height="200"><path d="M420.559974 72.98601l-54.855 0 0 774.336c-52.455014-69.163008-121.619046-123.762995-201.120051-157.052006l0 61.968c85.838029 41.401958 156.537958 111.337984 201.120051 198.221005l0 0.208 54.855 0 0-13.047c0.005018-0.00297 0.010035-0.005018 0.01495-0.007987-0.005018-0.010035-0.010035-0.019968-0.01495-0.030003L420.559974 72.986zM658.264986 73.385984l0-0.4L603.41 72.985984l0 877.68 54.855 0L658.265 176.524c52.457984 69.178982 121.632051 123.790029 201.149952 157.078016l0-61.961C773.560013 230.238003 702.853018 160.287027 658.264986 73.385984z" p-id="5701"></path></svg>`,
  width: 20, //其实指定的是svg图片绘制多大，实际占位是box，margin也是相对阴影范围指定的
  height: 20,
  funcType: VTable.TYPES.IconFuncTypeEnum.sort,
  name: 'sort_normal',
  positionType: VTable.TYPES.IconPosition.inlineFront,
  marginLeft: 0,
  marginRight: 0,
  hover: {
    width: 24,
    height: 24,
    bgColor: 'rgba(22,44,66,0.5)'
  },
  cursor: 'pointer'
});

export function createTable() {
  const records = generatePersons(2000);
  const columns: VTable.ColumnsDefine = [
    {
      field: '',
      title: '行号',
      width: 80,
      fieldFormat(data, col, row, table) {
        return row - 1;
      },
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },
    {
      field: 'id',
      title: 'ID',
      width: 'auto',
      minWidth: 50,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true,
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },
    // {
    //   title: 'full name',
    //   columns: [
    //     {
    //       field: 'name',
    //       title: 'First Name',
    //       width: 200
    //     },
    //     {
    //       field: 'name',
    //       title: 'Last Name',
    //       width: 200
    //     }
    //   ]
    // },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    emptyTip: true,
    records,
    columns: [
      ...columns
      // ...columns,
      // ...columns,
      // ...columns,
      // ...columns,
      // ...columns,
      // ...columns,
      // ...columns,
      // ...columns,
      // ...columns
    ],
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    frozenColCount: 1,
    bottomFrozenRowCount: 2,
    rightFrozenColCount: 2,
    overscrollBehavior: 'none',
    // dragHeaderMode: 'all',
    keyboardOptions: {
      pasteValueToCell: true,
      copySelected: true,
      selectAllOnCtrlA: true
    },
    eventOptions: {
      preventDefaultContextMenu: false
    },
    autoWrapText: true,
    editor: '',
    // theme: VTable.themes.ARCO,
    // hover: {
    //   highlightMode: 'cross'
    // },
    // select: {
    //   headerSelectMode: 'cell',
    //   highlightMode: 'cross'
    // },
    theme: {
      frameStyle: {
        cornerRadius: [10, 0, 0, 10],
        // cornerRadius: 10,
        borderLineWidth: [10, 0, 10, 10],
        // borderLineWidth: 10,
        borderColor: 'red',
        shadowBlur: 0
      },
      bodyStyle: {
        select: {
          cellBgColor: 'red',
          inlineRowBgColor: 'pink',
          inlineColumnBgColor: 'purple'
        }
      }
    },

    // transpose: true,
    select: {
      headerSelectMode: 'inline',
      highlightMode: 'cross',
      highlightInRange: true
    }
    // excelOptions: {
    //   fillHandle: true
    // }
    // widthMode: 'adaptive'
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });

  // tableInstance.on('sort_click', args => {
  //   tableInstance.updateSortState(
  //     {
  //       field: args.field,
  //       order: Date.now() % 3 === 0 ? 'desc' : Date.now() % 3 === 1 ? 'asc' : 'normal'
  //     },
  //     false
  //   );
  //   return false; //return false代表不执行内部排序逻辑
  // });
}
