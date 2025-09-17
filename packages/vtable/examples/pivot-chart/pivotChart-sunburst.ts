/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const columns: (VTable.IDimension | string)[] = ['category'];
  const rows = ['city'];
  const indicators: VTable.TYPES.IChartIndicator[] = [
    {
      indicatorKey: 'name',
      title: '名称',
      cellType: 'chart',
      chartModule: 'vchart',
      headerStyle: {
        color: 'red',
        borderLineWidth: [1, 0, 1, 0],
        autoWrapText: true
      },
      style: {
        padding: 1
      },
      chartSpec: {
        type: 'sunburst',
        offsetX: 0,
        offsetY: 0,
        categoryField: 'name',
        valueField: 'value',
        outerRadius: 1,
        innerRadius: 0,
        data: { id: 'data1' }
      }
    }
  ];
  const records = [
    {
      name: 'Country A',
      city: '北京',
      category: '电子产品',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 824 },
            { name: 'Furniture', value: 920 },
            { name: 'Electronic equipment', value: 936 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1270 },
            { name: 'Furniture', value: 1399 },
            { name: 'Electronic equipment', value: 1466 }
          ]
        },
        {
          name: 'Region3',
          children: [
            { name: 'Office Supplies', value: 1408 },
            { name: 'Furniture', value: 1676 },
            { name: 'Electronic equipment', value: 1559 }
          ]
        },
        {
          name: 'Region4',
          children: [
            { name: 'Office Supplies', value: 745 },
            { name: 'Furniture', value: 919 },
            { name: 'Electronic equipment', value: 781 }
          ]
        },
        {
          name: 'Region5',
          children: [
            { name: 'Office Supplies', value: 267 },
            { name: 'Furniture', value: 316 },
            { name: 'Electronic equipment', value: 230 }
          ]
        },
        {
          name: 'Region6',
          children: [
            { name: 'Office Supplies', value: 347 },
            { name: 'Furniture', value: 501 },
            { name: 'Electronic equipment', value: 453 }
          ]
        }
      ]
    },
    {
      name: 'Country B',
      city: '北京',
      category: '电子产品',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 824 },
            { name: 'Furniture', value: 920 },
            { name: 'Electronic equipment', value: 936 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1270 },
            { name: 'Furniture', value: 1399 },
            { name: 'Electronic equipment', value: 1466 }
          ]
        },
        {
          name: 'Region3',
          children: [
            { name: 'Office Supplies', value: 1408 },
            { name: 'Furniture', value: 1676 },
            { name: 'Electronic equipment', value: 1559 }
          ]
        },
        {
          name: 'Region4',
          children: [
            { name: 'Office Supplies', value: 745 },
            { name: 'Furniture', value: 919 },
            { name: 'Electronic equipment', value: 781 }
          ]
        },
        {
          name: 'Region5',
          children: [
            { name: 'Office Supplies', value: 267 },
            { name: 'Furniture', value: 316 },
            { name: 'Electronic equipment', value: 230 }
          ]
        },
        {
          name: 'Region6',
          children: [
            { name: 'Office Supplies', value: 347 },
            { name: 'Furniture', value: 501 },
            { name: 'Electronic equipment', value: 453 }
          ]
        }
      ]
    },
    {
      name: 'Country C',
      city: '北京',
      category: '电子产品',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 824 },
            { name: 'Furniture', value: 920 },
            { name: 'Electronic equipment', value: 936 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1270 },
            { name: 'Furniture', value: 1399 },
            { name: 'Electronic equipment', value: 1466 }
          ]
        },
        {
          name: 'Region3',
          children: [
            { name: 'Office Supplies', value: 1408 },
            { name: 'Furniture', value: 1676 },
            { name: 'Electronic equipment', value: 1559 }
          ]
        },
        {
          name: 'Region4',
          children: [
            { name: 'Office Supplies', value: 745 },
            { name: 'Furniture', value: 919 },
            { name: 'Electronic equipment', value: 781 }
          ]
        },
        {
          name: 'Region5',
          children: [
            { name: 'Office Supplies', value: 267 },
            { name: 'Furniture', value: 316 },
            { name: 'Electronic equipment', value: 230 }
          ]
        },
        {
          name: 'Region6',
          children: [
            { name: 'Office Supplies', value: 347 },
            { name: 'Furniture', value: 501 },
            { name: 'Electronic equipment', value: 453 }
          ]
        }
      ]
    },
    {
      name: 'Country D',
      city: '深圳',
      category: '家具',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 754 },
            { name: 'Furniture', value: 870 },
            { name: 'Electronic equipment', value: 886 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1220 },
            { name: 'Furniture', value: 1349 },
            { name: 'Electronic equipment', value: 1416 }
          ]
        }
      ]
    },
    {
      name: 'Country E',
      city: '深圳',
      category: '家具',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 724 },
            { name: 'Furniture', value: 820 },
            { name: 'Electronic equipment', value: 836 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1170 },
            { name: 'Furniture', value: 1299 },
            { name: 'Electronic equipment', value: 1366 }
          ]
        }
      ]
    },
    {
      name: 'Country F',
      city: '深圳',
      category: '家具',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 714 },
            { name: 'Furniture', value: 810 },
            { name: 'Electronic equipment', value: 826 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1160 },
            { name: 'Furniture', value: 1289 },
            { name: 'Electronic equipment', value: 1356 }
          ]
        }
      ]
    },
    {
      name: 'Country A',
      city: '深圳',
      category: '电子产品',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 704 },
            { name: 'Furniture', value: 800 },
            { name: 'Electronic equipment', value: 816 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1150 },
            { name: 'Furniture', value: 1279 },
            { name: 'Electronic equipment', value: 1346 }
          ]
        }
      ]
    },
    {
      name: 'Country B',
      city: '深圳',
      category: '电子产品',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 694 },
            { name: 'Furniture', value: 790 },
            { name: 'Electronic equipment', value: 806 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1140 },
            { name: 'Furniture', value: 1269 },
            { name: 'Electronic equipment', value: 1336 }
          ]
        }
      ]
    },
    {
      name: 'Country C',
      city: '深圳',
      category: '电子产品',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 684 },
            { name: 'Furniture', value: 780 },
            { name: 'Electronic equipment', value: 796 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1130 },
            { name: 'Furniture', value: 1259 },
            { name: 'Electronic equipment', value: 1326 }
          ]
        }
      ]
    },
    {
      name: 'Country J',
      city: '重庆',
      category: '服装',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 674 },
            { name: 'Furniture', value: 770 },
            { name: 'Electronic equipment', value: 786 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1120 },
            { name: 'Furniture', value: 1249 },
            { name: 'Electronic equipment', value: 1316 }
          ]
        }
      ]
    },
    {
      name: 'Country K',
      city: '天津',
      category: '食品',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 664 },
            { name: 'Furniture', value: 760 },
            { name: 'Electronic equipment', value: 776 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1110 },
            { name: 'Furniture', value: 1239 },
            { name: 'Electronic equipment', value: 1306 }
          ]
        }
      ]
    },
    {
      name: 'Country L',
      city: '苏州',
      category: '家具',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 654 },
            { name: 'Furniture', value: 750 },
            { name: 'Electronic equipment', value: 766 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1100 },
            { name: 'Furniture', value: 1229 },
            { name: 'Electronic equipment', value: 1296 }
          ]
        }
      ]
    },
    {
      name: 'Country M',
      city: '厦门',
      category: '电子产品',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 644 },
            { name: 'Furniture', value: 740 },
            { name: 'Electronic equipment', value: 756 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1090 },
            { name: 'Furniture', value: 1219 },
            { name: 'Electronic equipment', value: 1286 }
          ]
        }
      ]
    },
    {
      name: 'Country N',
      city: '青岛',
      category: '服装',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 634 },
            { name: 'Furniture', value: 730 },
            { name: 'Electronic equipment', value: 746 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1080 },
            { name: 'Furniture', value: 1209 },
            { name: 'Electronic equipment', value: 1276 }
          ]
        }
      ]
    },
    {
      name: 'Country O',
      city: '大连',
      category: '食品',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 624 },
            { name: 'Furniture', value: 720 },
            { name: 'Electronic equipment', value: 736 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1070 },
            { name: 'Furniture', value: 1199 },
            { name: 'Electronic equipment', value: 1266 }
          ]
        }
      ]
    },
    {
      name: 'Country P',
      city: '宁波',
      category: '家具',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 614 },
            { name: 'Furniture', value: 710 },
            { name: 'Electronic equipment', value: 726 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1060 },
            { name: 'Furniture', value: 1189 },
            { name: 'Electronic equipment', value: 1256 }
          ]
        }
      ]
    },
    {
      name: 'Country Q',
      city: '长沙',
      category: '电子产品',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 604 },
            { name: 'Furniture', value: 700 },
            { name: 'Electronic equipment', value: 716 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1050 },
            { name: 'Furniture', value: 1179 },
            { name: 'Electronic equipment', value: 1246 }
          ]
        }
      ]
    },
    {
      name: 'Country R',
      city: '郑州',
      category: '服装',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 594 },
            { name: 'Furniture', value: 690 },
            { name: 'Electronic equipment', value: 706 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1040 },
            { name: 'Furniture', value: 1169 },
            { name: 'Electronic equipment', value: 1236 }
          ]
        }
      ]
    },
    {
      name: 'Country S',
      city: '济南',
      category: '食品',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 584 },
            { name: 'Furniture', value: 680 },
            { name: 'Electronic equipment', value: 696 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1030 },
            { name: 'Furniture', value: 1159 },
            { name: 'Electronic equipment', value: 1226 }
          ]
        }
      ]
    },
    {
      name: 'Country T',
      city: '合肥',
      category: '家具',
      children: [
        {
          name: 'Region1',
          children: [
            { name: 'Office Supplies', value: 574 },
            { name: 'Furniture', value: 670 },
            { name: 'Electronic equipment', value: 686 }
          ]
        },
        {
          name: 'Region2',
          children: [
            { name: 'Office Supplies', value: 1020 },
            { name: 'Furniture', value: 1149 },
            { name: 'Electronic equipment', value: 1216 }
          ]
        }
      ]
    }
  ];
  const option: VTable.PivotChartConstructorOptions = {
    rows,
    columns,
    indicators,
    indicatorsAsCol: false,
    container: document.getElementById(CONTAINER_ID),
    records,
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 30,
    defaultColWidth: 280,
    defaultHeaderColWidth: [80, 'auto'],
    // widthMode: 'autoWidth',
    // heightMode: 'autoHeight',
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        autoWrapText: true,
        padding: 0
      }
    },

    axes: [
      {
        orient: 'bottom',
        type: 'linear'
      },
      {
        orient: 'left',
        type: 'linear'
      }
    ]
  };

  const tableInstance = new VTable.PivotChart(option);
  tableInstance.onVChartEvent('click', args => {
    console.log('onVChartEvent click', args);
  });
  tableInstance.onVChartEvent('mouseover', args => {
    console.log('onVChartEvent mouseover', args);
  });
  window.tableInstance = tableInstance;
  const { LEGEND_CHANGE } = VTable.ListTable.EVENT_TYPE;
  tableInstance.on(LEGEND_CHANGE, args => {
    console.log('LEGEND_CHANGE', args);
    const maxValue = args.value[1];
    const minValue = args.value[0];
    tableInstance.updateFilterRules([
      {
        filterFunc: (record: any) => {
          console.log('updateFilterRules', record);
          if (record['230417171050011'] >= minValue && record['230417171050011'] <= maxValue) {
            return true;
          }
          return false;
        }
      }
    ]);
  });
  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

  window.update = () => {
    theme.cornerLeftBottomCellStyle.borderColor = 'red';
    tableInstance.updateTheme(theme);
  };
}
