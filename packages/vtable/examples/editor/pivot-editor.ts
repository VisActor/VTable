import * as VTable from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
const CONTAINER_ID = 'vTable';
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);
export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
    .then(res => res.json())
    .then(data => {
      data = [
        // {
        //   Category: 'Office Supplies',

        //   City: 'Aberdeen'
        // },
        {
          Category: 'Office Supplies',
          Quantity: '3',
          Sales: '25.5',
          City: 'Aberdeen'
        },
        {
          Category: 'Office Supplies',
          Profit: '6.630000114440918',
          City: 'Aberdeen'
        },
        {
          Category: 'Technology',
          Quantity: null,
          City: 'Aberdeen'
        },
        {
          Category: 'Technology',
          Sales: null,
          City: 'Aberdeen'
        },
        {
          Category: 'Technology',
          Profit: null,
          City: 'Aberdeen'
        }
      ];
      const option: VTable.PivotTableConstructorOptions = {
        container: document.getElementById(CONTAINER_ID),
        // records: data,
        menu: {
          contextMenuItems: ['复制单元格内容', '查询详情']
        },
        rowTree: [
          {
            dimensionKey: 'City',
            value: 'Aberdeen'
          },
          {
            dimensionKey: 'City',
            value: 'Abilene'
          }
        ],
        columnTree: [
          {
            dimensionKey: 'Category',
            value: 'Office Supplies',
            children: [
              {
                indicatorKey: 'Quantity',
                value: 'ddddf'
              },
              {
                indicatorKey: 'Sales'
              },
              {
                indicatorKey: 'Profit'
              }
            ]
          }
        ],
        rows: [
          {
            dimensionKey: 'City',
            title: 'City',
            headerStyle: {
              textStick: true,
              bgColor: '#356b9c',
              color: '#00ffff'
            },
            width: 'auto',
            headerEditor: 'input'
          }
        ],
        columns: [
          {
            dimensionKey: 'Category',
            title: 'Category',
            headerStyle: {
              textStick: true,
              bgColor: arg => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                  return '#bd422a';
                }
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                  return '#ff9900';
                }
                return 'gray';
              }
            },
            headerEditor: 'input'
          }
          // {
          //   dimensionKey: 'Sub-Category',
          //   title: 'Sub-Category',
          //   headerStyle: {
          //     textStick: true,
          //     bgColor: arg => {
          //       const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
          //       if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
          //         return '#bd422a';
          //       }
          //       if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
          //         return '#ff9900';
          //       }
          //       return 'gray';
          //     }
          //   },
          //   width: 'auto'
          // }
        ],
        indicators: [
          {
            indicatorKey: 'Quantity',
            title: 'Quantity',
            width: 'auto',
            showSort: false,
            editor: 'input',
            style: {
              color: 'black',
              fontWeight: 'bold',
              bgColor: arg => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
                if (arg.value > 3) {
                  return 'red';
                }
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                  return '#bd422a';
                }
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                  return '#ff9900';
                }
                return 'gray';
              }
            },
            headerStyle: {
              color: 'black',
              textStick: true,
              fontWeight: 'bold',
              bgColor: arg => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                  return '#bd422a';
                }
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                  return '#ff9900';
                }
                return 'gray';
              }
            }
          },
          {
            indicatorKey: 'Sales',
            title: 'Sales',
            width: 'auto',
            showSort: false,
            editor: 'input',
            headerEditor: 'input',
            format: value => {
              if (value) {
                return Number(value).toFixed(2);
              }
              return '--';
            },
            style: {
              color: 'blue',
              fontWeight: 'bold',
              bgColor: arg => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                  return '#bd422a';
                }
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                  return '#ff9900';
                }
                return 'gray';
              }
            },
            headerStyle: {
              textStick: true,
              color: 'blue',
              bgColor: arg => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                  return '#bd422a';
                }
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                  return '#ff9900';
                }
                return 'gray';
              }
            }
          },
          {
            indicatorKey: 'Profit',
            title: 'Profit',
            width: 'auto',
            showSort: false,
            format: value => {
              return Number(value).toFixed(2);
            },
            style: {
              color: 'white',
              bgColor: arg => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                  return '#bd422a';
                }
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                  return '#ff9900';
                }
                return 'gray';
              }
            },
            headerStyle: {
              color: 'white',
              textStick: true,
              bgColor: arg => {
                const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Office Supplies') {
                  return '#bd422a';
                }
                if (cellHeaderPaths.colHeaderPaths && cellHeaderPaths.colHeaderPaths[0].value === 'Technology') {
                  return '#ff9900';
                }
                return 'gray';
              }
            }
          }
        ],
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            bgColor: '#356b9c',
            color: '#00ffff'
          }
        }
        // widthMode: 'adaptive',
        // headerEditor: 'input'
      };
      const tableInstance = new VTable.PivotTable(option);
      // 只为了方便控制太调试用，不要拷贝
      window.tableInstance = tableInstance;
      tableInstance.setRecords(data);
      tableInstance.on('change_cell_value', arg => {
        console.log(arg);
      });
      tableInstance.on('mouseenter_cell', args => {
        const { col, row } = args;
        const rect = tableInstance.getVisibleCellRangeRelativeRect({ col, row });
        tableInstance.showTooltip(col, row, {
          content: '你好！',
          position: {
            x: rect.left,
            y: rect.bottom
          },
          referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
          className: 'defineTooltip',
          style: {
            bgColor: 'black',
            color: 'white',
            fontSize: 14,
            fontFamily: 'STKaiti',
            arrowMark: true
          }
        });
      });
    })
    // eslint-disable-next-line no-console
    .catch(e => console.log(e));
}
