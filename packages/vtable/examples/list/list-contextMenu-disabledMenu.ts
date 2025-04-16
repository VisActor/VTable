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
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  }));
};

export function createTable() {
  const records = generatePersons(20);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: '1%',
      minWidth: 200,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        }
      ]
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
    records,
    columns,
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    pagination: {
      perPageCount: 10,
      currentPage: 0
    },

    rowSeriesNumber: {
      title: '行号',
      dragOrder: true,
      headerStyle: {
        bgColor: '#EEF1F5',
        borderColor: '#e1e4e8'
      },
      style: {
        borderColor: '#e1e4e8'
      }
    },
    menu: {
      // contextMenuItems: ['向下插入数据', '向下插入空行', '修改掉整行值', '修改值', '删除该行'],
      contextMenuItems: [
        {
          text: '向下插入数据',
          menuKey: 'insertData'
        },
        {
          text: '向下插入空行',
          menuKey: 'insertRow'
        },
        {
          text: '修改掉整行值',
          menuKey: 'modifyRow',
          disabled: true
        },
        {
          text: '修改值',
          menuKey: 'modifyCell'
        },
        {
          text: '删除该行',
          menuKey: 'deleteRow',
          children: [
            {
              text: '删除1行',
              menuKey: 'deleteRow1'
            },
            {
              text: '删除2行',
              menuKey: 'deleteRow2',
              disabled: true
            }
          ]
        }
      ],
      dropDownMenuHighlight: [
        {
          menuKey: 'se3'
        }
      ],
      defaultHeaderMenuItems: [
        {
          text: '刷新',
          menuKey: 'refresh'
        },
        {
          text: '关闭',
          menuKey: 'close',
          disabled: true,
          children: [
            {
              text: '二级菜单1',
              menuKey: 'se1',
              disabled: true,
              children: [
                {
                  text: '三级菜单1',
                  menuKey: 'se1-1'
                },
                {
                  text: '三级菜单2',
                  menuKey: 'se1-2'
                }
              ]
            },
            {
              text: '二级菜单2',
              menuKey: 'se2'
            },
            {
              text: '二级菜单3',
              menuKey: 'se3'
            }
          ]
        },
        {
          text: '删除',
          menuKey: 'delete'
        }
      ]
    }

    // bottomFrozenRowCount: 1
    // autoWrapText: true,
    // heightMode: 'autoHeight',
    // widthMode: 'adaptive'
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  // bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
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
