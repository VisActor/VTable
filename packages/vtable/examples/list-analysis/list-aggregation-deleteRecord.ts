import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
import { AggregationType } from '../../src/ts-types';
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
    city: 'beijing',
    salary: Math.round(Math.random() * 10000)
  }));
};

export function createTable() {
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
      city: 'beijing',
      salary: i + 1
    }));
  };

  const records = generatePersons(10);
  const columns = [
    {
      field: '',
      title: '行号',
      width: 80,
      fieldFormat(data, col, row, table) {
        return row - 1;
      },
      aggregation: {
        aggregationType: VTable.TYPES.AggregationType.NONE,
        formatFun() {
          return '汇总：';
        }
      }
    },
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
      field: 'salary',
      title: 'salary',
      width: 100
    },
    {
      field: 'salary',
      title: 'salary',
      width: 100,
      aggregation: [
        {
          aggregationType: VTable.TYPES.AggregationType.MAX,
          // showOnTop: true,
          formatFun(value) {
            return '最高薪资:' + Math.round(value) + '元';
          }
        },
        {
          aggregationType: VTable.TYPES.AggregationType.MIN,
          showOnTop: true,
          formatFun(value) {
            return '最低薪资:' + Math.round(value) + '元';
          }
        },
        {
          aggregationType: VTable.TYPES.AggregationType.AVG,
          showOnTop: false,
          formatFun(value, col, row, table) {
            return '平均:' + Math.round(value) + '元 (共计' + table.recordsCount + '条数据)';
          }
        }
      ]
    }
  ];
  const option = {
    records,
    // dataConfig: {
    //   filterRules: [
    //     {
    //       filterFunc: (record: Record<string, any>) => {
    //         return record.id % 2 === 0;
    //       }
    //     }
    //   ]
    // },
    columns,
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    frozenColCount: 1,
    bottomFrozenRowCount: 2,
    rightFrozenColCount: 1,
    overscrollBehavior: 'none',
    autoWrapText: true,
    widthMode: 'autoWidth',
    heightMode: 'autoHeight',
    dragHeaderMode: 'all',
    keyboardOptions: {
      pasteValueToCell: true
    },
    eventOptions: {
      preventDefaultContextMenu: false
    },
    // pagination: {
    //   perPageCount: 4,
    //   currentPage: 0
    // },
    theme: VTable.themes.DEFAULT.extends({
      bottomFrozenStyle: {
        bgColor: '#ECF1F5',
        borderLineWidth: [6, 0, 1, 0],
        borderColor: ['gray']
      }
    }),
    aggregation(args) {
      if (args.col === 1) {
        return [
          {
            aggregationType: VTable.TYPES.AggregationType.MAX,
            formatFun(value) {
              return '最大ID:' + Math.round(value) + '号';
            }
          },
          {
            aggregationType: VTable.TYPES.AggregationType.MIN,
            showOnTop: false,
            formatFun(value, col, row, table) {
              return '最小ID:' + Math.round(value) + '号';
            }
          }
        ];
      }
      if (args.field === 'salary') {
        return [
          {
            aggregationType: VTable.TYPES.AggregationType.MIN,
            formatFun(value) {
              return '最低低低薪资:' + Math.round(value) + '元';
            }
          },
          {
            aggregationType: VTable.TYPES.AggregationType.AVG,
            showOnTop: false,
            formatFun(value, col, row, table) {
              return '平均平均平均:' + Math.round(value) + '元 (共计' + table.recordsCount + '条数据)';
            }
          }
        ];
      }
      return null;
    }
    // transpose: true
    // widthMode: 'adaptive'
  };
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  tableInstance.deleteRecords([0]);
  // tableInstance.updateRecords(
  //   [
  //     {
  //       id: 10,
  //       email1: '10@xxx.com',
  //       name: '小明10',
  //       lastName: '王',
  //       date1: '2022年9月1日',
  //       tel: '000-0000-0000',
  //       sex: 'girl',
  //       work: 'front-end engineer10',
  //       city: 'beijing',
  //       salary: 60
  //     }
  //   ],
  //   [0]
  // );
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
  tableInstance.on('change_cell_value', arg => {
    console.log(arg);
  });
}
