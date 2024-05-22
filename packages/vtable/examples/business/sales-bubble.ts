import * as VTable from '../../src';
const CONTAINER_ID = 'vTable';
function getColor(min, max, value, opacity) {
  if (max === min) {
    if (value > 0) {
      return `rgba(255,0,0,${opacity})`;
    }
    return `rgba(255,255,255,${opacity})`;
  }
  if (value === '') {
    return `rgba(255,255,255,${opacity})`;
  }
  const c = (value - min) / (max - min) + 0.1;
  const red = (1 - c) * 200 + 55;
  const green = (1 - c) * 200 + 55;
  return `rgba(${red},${green},255,${opacity})`;
}

fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: [
        {
          dimensionKey: 'Sub-Category',
          title: 'Sub-Catogery'
        }
      ],
      columns: [
        {
          dimensionKey: 'Region',
          title: 'Region'
        },
        {
          dimensionKey: 'Segment',
          title: 'Segment'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Sales',
          title: 'Sales'
        }
      ],
      corner: {
        titleOnDimension: 'none'
      },
      dataConfig: {
        sortRules: [
          {
            sortField: 'Category',
            sortBy: ['Office Supplies', 'Technology', 'Furniture']
          }
        ],
        totals: {
          row: {
            showSubTotals: true,
            subTotalsDimensions: ['Category'],
            subTotalLabel: 'subtotal'
          }
        }
      },
      tooltip: {
        isShowOverflowTextTooltip: true
      },
      hideIndicatorName: true,
      defaultHeaderRowHeight: 30,
      defaultRowHeight: 40,
      defaultColWidth: 60,
      widthMode: 'autoWidth',
      keyboardOptions: {
        copySelected: true
      },
      customRender: {
        elements: [
          {
            type: 'circle',
            x: '50%',
            y: '50%',
            radius: value => {
              const percent = Math.max(5, (Number(value) / 59645 / 2) * 100);
              return `${percent}%`;
            },
            fill: value => {
              const color = getColor(80, 59645, value, 0.5);
              const color1 = getColor(80, 59645, value, 1);
              return {
                gradient: 'linear',
                x0: 0,
                y0: 1,
                x1: 0,
                y1: 0,
                stops: [
                  {
                    offset: 0,
                    color: color
                  },
                  {
                    offset: 1,
                    color: color1
                  }
                ]
              };
            }
          }
        ],
        renderDefault: false
      },
      theme: {
        headerStyle: {
          borderLineWidth: 0,
          color: '#434343',
          fontSize: 12
        },
        rowHeaderStyle: {
          borderLineWidth: 0,
          color: '#434343',
          fontSize: 12
        },
        cornerHeaderStyle: {
          borderLineWidth: 0,
          color: '#434343',
          fontSize: 12
        },
        bodyStyle: {
          borderLineWidth: 0
        }
      }
    };
    const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = tableInstance;
  })
  .catch(err => console.error(err));
