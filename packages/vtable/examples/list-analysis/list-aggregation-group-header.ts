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
      },
      aggregation: [
        {
          aggregationType: AggregationType.NONE,
          formatFun: () => '合计'
        }
      ]
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
          width: 200,
          aggregation: [
            {
              aggregationType: AggregationType.COUNT
            }
          ]
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200,
          aggregation: {
            aggregationType: AggregationType.NONE,
            formatFun: () => '自定义数据'
          }
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
    bottomFrozenRowCount: 1,
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
    })

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
