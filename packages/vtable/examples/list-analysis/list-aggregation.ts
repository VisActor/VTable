import * as VTable from '../../src';
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
  const records = generatePersons(300);
  const columns: VTable.ColumnsDefine = [
    {
      field: '',
      title: '行号',
      width: 80,
      fieldFormat(data, col, row, table) {
        return row - 1;
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
      width: 100,
      aggregation: [
        {
          aggregationType: AggregationType.AVG
        },
        {
          aggregationType: AggregationType.SUM,
          showOnTop: true
        }
      ]
    },
    {
      field: 'salary',
      title: 'salary',
      width: 100,
      aggregation: [
        {
          aggregationType: AggregationType.MAX,
          formatFun(value) {
            return '最高薪资:' + Math.round(value) + '元';
          }
        },
        {
          aggregationType: AggregationType.MIN,
          formatFun(value) {
            return '最低薪资:' + Math.round(value) + '元';
          }
        },
        {
          aggregationType: AggregationType.AVG,
          showOnTop: false,
          formatFun(value, col, row, table) {
            return '平均:' + Math.round(value) + '元 (共计' + table.recordsCount + '条数据)';
          }
        }
      ]
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    sortState: {
      field: 'id',
      order: 'desc'
    },
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
    // frozenColCount: 1,
    bottomFrozenRowCount: 3,
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
    pagination: {
      perPageCount: 100,
      currentPage: 0
    },
    theme: VTable.themes.DEFAULT.extends({
      cornerRightBottomCellStyle: {
        bgColor: 'rgba(1,1,1,0.1)',
        borderColor: 'red'
      }
    }),
    customMergeCell: (col, row, table) => {
      if (col >= 0 && col < table.colCount && row === table.rowCount - 1) {
        return {
          text: '统计数据中平均薪资：' + table.getCellOriginValue(table.colCount - 1, table.rowCount - 1),
          range: {
            start: {
              col: 0,
              row: table.rowCount - 1
            },
            end: {
              col: table.colCount - 1,
              row: table.rowCount - 1
            }
          },
          style: {
            borderLineWidth: [6, 1, 1, 1],
            borderColor: ['gray'],
            textAlign: 'center'
          }
        };
      }
      if (col >= 0 && col < table.colCount && row === table.rowCount - 2) {
        return {
          text: '统计数据中最低薪资：' + table.getCellOriginValue(table.colCount - 1, table.rowCount - 2),
          range: {
            start: {
              col: 0,
              row: table.rowCount - 2
            },
            end: {
              col: table.colCount - 1,
              row: table.rowCount - 2
            }
          },
          style: {
            textStick: true,
            borderLineWidth: [6, 1, 1, 1],
            borderColor: ['gray'],
            textAlign: 'center'
          }
        };
      }
    }
    // transpose: true
    // widthMode: 'adaptive'
  };
  const tableInstance = new VTable.ListTable(option);
  // tableInstance.updateFilterRules([
  //   {
  //     filterKey: 'sex',
  //     filteredValues: ['boy']
  //   }
  // ]);
  window.tableInstance = tableInstance;
  tableInstance.on('change_cell_value', arg => {
    console.log(arg);
  });
}
