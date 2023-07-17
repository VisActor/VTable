import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const Table_CONTAINER_DOM_ID = 'vTable';

export function createTable() {
  fetch(window.location.origin + '/pivot/North_American_Superstore_pivot.json')
    .then(res => res.json())
    .then(data => {
      const option: VTable.PivotTableConstructorOptions = {
        parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
        records: data,
        indicatorTitle: '指标名称',
        menu: {
          contextMenuItems: ['复制单元格内容', '查询详情']
        },
        columnTree: [
          {
            dimensionKey: '230517143221047',
            value: 'Aberdeen'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Abilene'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Akron'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Albuquerque'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Alexandria'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Allen'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Allentown'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Altoona'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Amarillo'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Anaheim'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Andover'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Ann Arbor'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Antioch'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Apopka'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Apple Valley'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Appleton'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Arlington'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Arlington Heights'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Arvada'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Asheville'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Athens'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Atlanta'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Atlantic City'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Auburn'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Aurora'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Austin'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Avondale'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bakersfield'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Baltimore'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bangor'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bartlett'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bayonne'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Baytown'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Beaumont'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bedford'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Belleville'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bellevue'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bellingham'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bethlehem'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Beverly'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Billings'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bloomington'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Boca Raton'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Boise'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bolingbrook'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bossier City'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bowling Green'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Boynton Beach'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Bozeman'
          },
          {
            dimensionKey: '230517143221047',
            value: 'Brentwood'
          }
        ],
        rowTree: [
          {
            dimensionKey: '230517143221023',
            value: 'Office Supplies',
            children: [
              {
                indicatorKey: '230517143221042'
              },
              {
                indicatorKey: '230517143221040'
              },
              {
                indicatorKey: '230517143221041'
              }
            ]
          },
          {
            dimensionKey: '230517143221023',
            value: 'Technology',
            children: [
              {
                indicatorKey: '230517143221042'
              },
              {
                indicatorKey: '230517143221040'
              },
              {
                indicatorKey: '230517143221041'
              }
            ]
          },
          {
            dimensionKey: '230517143221023',
            value: 'Furniture',
            children: [
              {
                indicatorKey: '230517143221042'
              },
              {
                indicatorKey: '230517143221040'
              },
              {
                indicatorKey: '230517143221041'
              }
            ]
          }
        ],
        columns: [
          {
            dimensionKey: '230517143221047',
            dimensionTitle: 'City',
            headerStyle: {
              textStick: true,
              bgColor: '#356b9c',
              color: '#00ffff'
            },
            width: 'auto'
          }
        ],
        rows: [
          {
            dimensionKey: '230517143221023',
            dimensionTitle: 'Category',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          },
          {
            dimensionKey: '230517143221023',
            dimensionTitle: 'Category',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
        ],
        indicators: [
          {
            indicatorKey: '230517143221042',
            caption: 'Quantity',
            width: 'auto',
            showSort: false,
            style: {
              color: 'black',
              fontWeight: 'bold'
            },
            headerStyle: {
              color: 'black',
              textStick: true,
              fontWeight: 'bold'
            }
          },
          {
            indicatorKey: '230517143221040',
            caption: 'Sales',
            width: 'auto',
            showSort: false,
            format: rec => {
              return Number(rec['230517143221040']).toFixed(2);
            },
            style: {
              color: 'blue',
              fontWeight: 'bold'
            },
            headerStyle: {
              textStick: true,
              color: 'blue'
            }
          },
          {
            indicatorKey: '230517143221041',
            caption: 'Profit',
            width: 'auto',
            showSort: false,
            format: rec => {
              return Number(rec['230517143221041']).toFixed(2);
            },
            style: {
              color: 'pink'
            },
            headerStyle: {
              color: 'pink',
              textStick: true
            }
          }
        ],
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            bgColor: 'yellow',
            color: 'red'
          }
        },
        widthMode: 'standard'
      };
      const tableInstance = new VTable.PivotTable(option);
      // 只为了方便控制太调试用，不要拷贝
      (window as any).tableInstance = tableInstance;

      tableInstance.listen('mouseenter_cell', args => {
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
            font: 'normal normal normal 14px/1 STKaiti',
            arrowMark: true
          }
        });
      });
    })
    // eslint-disable-next-line no-console
    .catch(e => console.log(e));
}
