import * as VTable from '../../src';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then(res => res.json())
    .then(records => {
      const option: VTable.PivotTableConstructorOptions = {
        rows: [
          {
            dimensionKey: 'State',
            title: 'State',
            headerStyle: {
              textStick: true,
              bgColor(arg: VTable.TYPES.StylePropertyFunctionArg) {
                if (arg.dataValue === 'Row Totals') {
                  return '#ff9900';
                }
                return '#ECF1F5';
              }
            }
          },
          {
            dimensionKey: 'City',
            title: 'City',
            headerStyle: {
              bgColor(arg: VTable.TYPES.StylePropertyFunctionArg) {
                if (arg.dataValue === 'Sub Totals') {
                  return '#ba54ba';
                }
                return '#ECF1F5';
              }
            }
          }
        ],
        columns: ['Category', 'Sub-Category'],
        indicators: [
          {
            indicatorKey: 'Sales',
            title: 'Sales',
            headerStyle: {
              bgColor(arg: VTable.TYPES.StylePropertyFunctionArg) {
                const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                if ((rowHeaderPaths?.[1] as any)?.value === 'Sub Totals') {
                  return '#ba54ba';
                } else if ((rowHeaderPaths?.[0] as any)?.value === 'Row Totals') {
                  return '#ff9900';
                }
                return '#ECF1F5';
              }
            },
            style: {
              bgColor(arg: VTable.TYPES.StylePropertyFunctionArg) {
                const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                if ((rowHeaderPaths?.[1] as any)?.value === 'Sub Totals') {
                  return '#ba54ba';
                } else if ((rowHeaderPaths?.[0] as any)?.value === 'Row Totals') {
                  return '#ff9900';
                }

                return '';
              }
            }
          },
          {
            indicatorKey: 'Profit',
            title: 'Profit',
            headerStyle: {
              bgColor(arg: VTable.TYPES.StylePropertyFunctionArg) {
                const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                if ((rowHeaderPaths?.[1] as any)?.value === 'Sub Totals') {
                  return '#ba54ba';
                } else if ((rowHeaderPaths?.[0] as any)?.value === 'Row Totals') {
                  return '#ff9900';
                }
                return '#ECF1F5';
              }
            },
            style: {
              bgColor(arg: VTable.TYPES.StylePropertyFunctionArg) {
                const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                if ((rowHeaderPaths?.[1] as any)?.value === 'Sub Totals') {
                  return '#ba54ba';
                } else if ((rowHeaderPaths?.[0] as any)?.value === 'Row Totals') {
                  return '#ff9900';
                }
                return '';
              }
            }
          }
        ],

        indicatorTitle: '指标名称',
        indicatorsAsCol: false,
        dataConfig: {
          totals: {
            row: {
              showGrandTotals: true,
              showSubTotals: true,
              subTotalsDimensions: ['State'],
              grandTotalLabel: 'Row Totals',
              subTotalLabel: 'Sub Totals'
            },
            column: {
              showGrandTotals: true,
              showSubTotals: true,
              subTotalsDimensions: ['Category'],
              grandTotalLabel: 'Column Totals',
              subTotalLabel: 'Sub Totals'
            }
          }
        },
        corner: { titleOnDimension: 'row' },
        records,
        widthMode: 'autoWidth', // 宽度模式：standard 标准模式； adaptive 自动填满容器
        pagination: {
          perPageCount: 21,
          currentPage: 1
        },
        dragHeaderMode: 'all'
      };

      const instance = new PivotTable(document.getElementById(CONTAINER_ID)!, option);
      window.tableInstance = instance;
      // setTimeout(() => {
      //   instance.updatePagination({
      //     perPageCount: 21,
      //     currentPage: 1
      //   });
      // }, 8000);

      // 只为了方便控制太调试用，不要拷贝
      window.tableInstance = instance;
    })
    .catch(e => {
      throw e;
    });
}
