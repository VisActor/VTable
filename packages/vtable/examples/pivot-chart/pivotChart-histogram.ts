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
      indicatorKey: 'profit',
      title: '利润',
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
        type: 'histogram',
        xField: 'from',
        x2Field: 'to',
        yField: 'profit',
        seriesField: 'type',
        data: { id: 'data1' },
        bar: {
          style: {
            stroke: 'white',
            lineWidth: 1
          }
        }
      }
    }
  ];
  const records = [
    {
      from: 0,
      to: 100,
      profit: 300,
      type: 'A',
      city: '北京',
      category: '电子'
    },
    {
      from: 0,
      to: 100,
      profit: 100,
      type: 'B',
      city: '北京',
      category: '电子'
    },
    {
      from: 0,
      to: 100,
      profit: 100,
      type: 'C',
      city: '北京',
      category: '电子'
    },
    {
      from: 529,
      to: 535,
      profit: 60,
      type: 'C',
      city: '北京',
      category: '电子'
    },
    {
      from: 50,
      to: 150,
      profit: 30,
      type: 'B',
      city: '北京',
      category: '电子'
    },
    {
      from: 120,
      to: 130,
      profit: 150,
      type: 'D',
      city: '北京',
      category: '电子'
    },
    {
      from: 150,
      to: 160,
      profit: 30,
      type: 'E',
      city: '北京',
      category: '电子'
    },
    {
      from: 10,
      to: 16,
      profit: 3,
      type: 'B',
      city: '上海',
      category: '服装'
    },
    {
      from: 16,
      to: 18,
      profit: 15,
      type: 'C',
      city: '广州',
      category: '食品'
    },
    {
      from: 18,
      to: 26,
      profit: 12,
      type: 'D',
      city: '深圳',
      category: '家具'
    },
    {
      from: 26,
      to: 32,
      profit: 22,
      type: 'E',
      city: '杭州',
      category: '电子'
    },
    {
      from: 32,
      to: 56,
      profit: 7,
      type: 'F',
      city: '成都',
      category: '服装'
    },
    {
      from: 56,
      to: 62,
      profit: 17,
      type: 'G',
      city: '武汉',
      category: '食品'
    },
    {
      from: 62,
      to: 68,
      profit: 8,
      type: 'A',
      city: '北京',
      category: '家具'
    },
    {
      from: 68,
      to: 73,
      profit: 14,
      type: 'B',
      city: '上海',
      category: '电子'
    },
    {
      from: 73,
      to: 79,
      profit: 21,
      type: 'C',
      city: '广州',
      category: '服装'
    },
    {
      from: 79,
      to: 85,
      profit: 5,
      type: 'D',
      city: '深圳',
      category: '食品'
    },
    {
      from: 85,
      to: 92,
      profit: 18,
      type: 'E',
      city: '杭州',
      category: '家具'
    },
    {
      from: 92,
      to: 97,
      profit: 9,
      type: 'F',
      city: '成都',
      category: '电子'
    },
    {
      from: 97,
      to: 105,
      profit: 13,
      type: 'G',
      city: '武汉',
      category: '服装'
    },
    {
      from: 105,
      to: 111,
      profit: 4,
      type: 'A',
      city: '北京',
      category: '食品'
    },
    {
      from: 111,
      to: 117,
      profit: 19,
      type: 'B',
      city: '上海',
      category: '家具'
    },
    {
      from: 117,
      to: 124,
      profit: 11,
      type: 'C',
      city: '广州',
      category: '电子'
    },
    {
      from: 124,
      to: 130,
      profit: 23,
      type: 'D',
      city: '深圳',
      category: '服装'
    },
    {
      from: 130,
      to: 137,
      profit: 6,
      type: 'E',
      city: '杭州',
      category: '食品'
    },
    {
      from: 137,
      to: 142,
      profit: 16,
      type: 'F',
      city: '成都',
      category: '家具'
    },
    {
      from: 142,
      to: 150,
      profit: 20,
      type: 'G',
      city: '武汉',
      category: '电子'
    },
    {
      from: 150,
      to: 156,
      profit: 1,
      type: 'A',
      city: '北京',
      category: '服装'
    },
    {
      from: 156,
      to: 162,
      profit: 24,
      type: 'B',
      city: '上海',
      category: '食品'
    },
    {
      from: 162,
      to: 167,
      profit: 10,
      type: 'C',
      city: '广州',
      category: '家具'
    },
    {
      from: 167,
      to: 173,
      profit: 3,
      type: 'D',
      city: '深圳',
      category: '电子'
    },
    {
      from: 173,
      to: 178,
      profit: 17,
      type: 'E',
      city: '杭州',
      category: '服装'
    },
    {
      from: 178,
      to: 185,
      profit: 8,
      type: 'F',
      city: '成都',
      category: '食品'
    },
    {
      from: 185,
      to: 191,
      profit: 22,
      type: 'G',
      city: '武汉',
      category: '家具'
    },
    {
      from: 191,
      to: 198,
      profit: 5,
      type: 'A',
      city: '北京',
      category: '电子'
    },
    {
      from: 198,
      to: 203,
      profit: 19,
      type: 'B',
      city: '上海',
      category: '服装'
    },
    {
      from: 203,
      to: 209,
      profit: 14,
      type: 'C',
      city: '广州',
      category: '食品'
    },
    {
      from: 209,
      to: 215,
      profit: 7,
      type: 'D',
      city: '深圳',
      category: '家具'
    },
    {
      from: 215,
      to: 222,
      profit: 25,
      type: 'E',
      city: '杭州',
      category: '电子'
    },
    {
      from: 222,
      to: 228,
      profit: 12,
      type: 'F',
      city: '成都',
      category: '服装'
    },
    {
      from: 228,
      to: 234,
      profit: 9,
      type: 'G',
      city: '武汉',
      category: '食品'
    },
    {
      from: 234,
      to: 240,
      profit: 18,
      type: 'A',
      city: '北京',
      category: '家具'
    },
    {
      from: 240,
      to: 247,
      profit: 4,
      type: 'B',
      city: '上海',
      category: '电子'
    },
    {
      from: 247,
      to: 253,
      profit: 21,
      type: 'C',
      city: '广州',
      category: '服装'
    },
    {
      from: 253,
      to: 258,
      profit: 11,
      type: 'D',
      city: '深圳',
      category: '食品'
    },
    {
      from: 258,
      to: 264,
      profit: 6,
      type: 'E',
      city: '杭州',
      category: '家具'
    },
    {
      from: 264,
      to: 271,
      profit: 20,
      type: 'F',
      city: '成都',
      category: '电子'
    },
    {
      from: 271,
      to: 277,
      profit: 13,
      type: 'G',
      city: '武汉',
      category: '服装'
    },
    {
      from: 277,
      to: 282,
      profit: 2,
      type: 'A',
      city: '北京',
      category: '食品'
    },
    {
      from: 282,
      to: 288,
      profit: 23,
      type: 'B',
      city: '上海',
      category: '家具'
    },
    {
      from: 288,
      to: 294,
      profit: 8,
      type: 'C',
      city: '广州',
      category: '电子'
    },
    {
      from: 294,
      to: 299,
      profit: 16,
      type: 'D',
      city: '深圳',
      category: '服装'
    },
    {
      from: 299,
      to: 305,
      profit: 10,
      type: 'E',
      city: '杭州',
      category: '食品'
    },
    {
      from: 305,
      to: 312,
      profit: 3,
      type: 'F',
      city: '成都',
      category: '家具'
    },
    {
      from: 312,
      to: 319,
      profit: 19,
      type: 'G',
      city: '武汉',
      category: '电子'
    },
    {
      from: 319,
      to: 325,
      profit: 7,
      type: 'A',
      city: '北京',
      category: '服装'
    },
    {
      from: 325,
      to: 330,
      profit: 22,
      type: 'B',
      city: '上海',
      category: '食品'
    },
    {
      from: 330,
      to: 336,
      profit: 13,
      type: 'C',
      city: '广州',
      category: '家具'
    },
    {
      from: 336,
      to: 342,
      profit: 5,
      type: 'D',
      city: '深圳',
      category: '电子'
    },
    {
      from: 342,
      to: 348,
      profit: 24,
      type: 'E',
      city: '杭州',
      category: '服装'
    },
    {
      from: 348,
      to: 354,
      profit: 9,
      type: 'F',
      city: '成都',
      category: '食品'
    },
    {
      from: 354,
      to: 360,
      profit: 18,
      type: 'G',
      city: '武汉',
      category: '家具'
    },
    {
      from: 360,
      to: 366,
      profit: 1,
      type: 'A',
      city: '北京',
      category: '电子'
    },
    {
      from: 366,
      to: 372,
      profit: 14,
      type: 'B',
      city: '上海',
      category: '服装'
    },
    {
      from: 372,
      to: 378,
      profit: 11,
      type: 'C',
      city: '广州',
      category: '食品'
    },
    {
      from: 378,
      to: 384,
      profit: 25,
      type: 'D',
      city: '深圳',
      category: '家具'
    },
    {
      from: 384,
      to: 390,
      profit: 8,
      type: 'E',
      city: '杭州',
      category: '电子'
    },
    {
      from: 390,
      to: 397,
      profit: 17,
      type: 'F',
      city: '成都',
      category: '服装'
    },
    {
      from: 397,
      to: 403,
      profit: 60,
      type: 'G',
      city: '武汉',
      category: '食品'
    },
    {
      from: 403,
      to: 509,
      profit: 200,
      type: 'A',
      city: '北京',
      category: '家具'
    },
    {
      from: 409,
      to: 415,
      profit: 12,
      type: 'B',
      city: '上海',
      category: '电子'
    },
    {
      from: 415,
      to: 421,
      profit: 4,
      type: 'C',
      city: '广州',
      category: '服装'
    },
    {
      from: 421,
      to: 427,
      profit: 19,
      type: 'D',
      city: '深圳',
      category: '食品'
    },
    {
      from: 427,
      to: 433,
      profit: 15,
      type: 'E',
      city: '杭州',
      category: '家具'
    },
    {
      from: 433,
      to: 439,
      profit: 23,
      type: 'F',
      city: '成都',
      category: '电子'
    },
    {
      from: 439,
      to: 445,
      profit: 7,
      type: 'G',
      city: '武汉',
      category: '服装'
    },
    {
      from: 445,
      to: 451,
      profit: 13,
      type: 'A',
      city: '北京',
      category: '食品'
    },
    {
      from: 451,
      to: 457,
      profit: 21,
      type: 'B',
      city: '上海',
      category: '家具'
    },
    {
      from: 457,
      to: 463,
      profit: 5,
      type: 'C',
      city: '广州',
      category: '电子'
    },
    {
      from: 463,
      to: 469,
      profit: 18,
      type: 'D',
      city: '深圳',
      category: '服装'
    },
    {
      from: 469,
      to: 475,
      profit: 10,
      type: 'E',
      city: '杭州',
      category: '食品'
    },
    {
      from: 475,
      to: 481,
      profit: 2,
      type: 'F',
      city: '成都',
      category: '家具'
    },
    {
      from: 481,
      to: 487,
      profit: 24,
      type: 'G',
      city: '武汉',
      category: '电子'
    },
    {
      from: 487,
      to: 493,
      profit: 16,
      type: 'A',
      city: '北京',
      category: '服装'
    },
    {
      from: 493,
      to: 499,
      profit: 9,
      type: 'B',
      city: '上海',
      category: '食品'
    },
    {
      from: 499,
      to: 505,
      profit: 14,
      type: 'C',
      city: '广州',
      category: '家具'
    },
    {
      from: 505,
      to: 711,
      profit: 300,
      type: 'D',
      city: '深圳',
      category: '电子'
    },
    {
      from: 511,
      to: 517,
      profit: 22,
      type: 'E',
      city: '杭州',
      category: '服装'
    },
    {
      from: 517,
      to: 523,
      profit: 11,
      type: 'F',
      city: '成都',
      category: '食品'
    },
    {
      from: 523,
      to: 529,
      profit: 20,
      type: 'G',
      city: '武汉',
      category: '家具'
    },

    {
      from: 535,
      to: 541,
      profit: 25,
      type: 'B',
      city: '上海',
      category: '服装'
    },
    {
      from: 541,
      to: 547,
      profit: 15,
      type: 'C',
      city: '广州',
      category: '食品'
    },
    {
      from: 547,
      to: 553,
      profit: 8,
      type: 'D',
      city: '深圳',
      category: '家具'
    },
    {
      from: 553,
      to: 559,
      profit: 17,
      type: 'E',
      city: '杭州',
      category: '电子'
    },
    {
      from: 559,
      to: 565,
      profit: 4,
      type: 'F',
      city: '成都',
      category: '服装'
    },
    {
      from: 565,
      to: 571,
      profit: 19,
      type: 'G',
      city: '武汉',
      category: '食品'
    },
    {
      from: 571,
      to: 577,
      profit: 12,
      type: 'A',
      city: '北京',
      category: '家具'
    },
    {
      from: 577,
      to: 583,
      profit: 23,
      type: 'B',
      city: '上海',
      category: '电子'
    },
    {
      from: 583,
      to: 589,
      profit: 7,
      type: 'C',
      city: '广州',
      category: '服装'
    },
    {
      from: 589,
      to: 595,
      profit: 16,
      type: 'D',
      city: '深圳',
      category: '食品'
    },
    {
      from: 595,
      to: 601,
      profit: 1,
      type: 'E',
      city: '杭州',
      category: '家具'
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
