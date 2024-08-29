import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

const DEFAULT_BAR_COLOR = data => {
  if (parseInt(data.dataValue, 10) > 80) {
    return '#20a8d8';
  }
  if (parseInt(data.dataValue, 10) > 50) {
    return '#4dbd74';
  }
  if (parseInt(data.dataValue, 10) > 20) {
    return '#ffc107';
  }
  return '#f86c6b';
};

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'value',
        title: 'icon',
        width: 120,
        style: {
          color: data => {
            if (Number(data.value) > 0) {
              return 'rgb(80, 170, 83)';
            }
            return 'rgb(216, 88, 89)';
          }
        },
        icon: data => {
          // if (data.value > 0) return 'up-green';
          // // 1. 直接返回name
          // return 'down-red';
          // 2. 返回对象，name+position
          // return {
          //   name: 'down-red',
          //   position: 0,
          // };
          // 3. 返回一个完整的ColumnIconOption对象
          return {
            type: 'svg',
            svg: '<svg width="12" height="12"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="rgb(0, 170, 0)"><path d="M503.146667 117.429333a64.373333 64.373333 0 0 1 11.029333 0.341334l0.714667 0.085333 1.749333 0.245333 0.682667 0.117334c0.554667 0.085333 1.088 0.192 1.632 0.288l0.853333 0.181333c1.514667 0.32 2.986667 0.682667 4.458667 1.098667l0.202666 0.064a60.618667 60.618667 0 0 1 10.656 4.138666l0.64 0.330667c0.512 0.256 1.024 0.522667 1.525334 0.8l0.704 0.394667 1.493333 0.853333 0.426667 0.266667a47.466667 47.466667 0 0 1 3.36 2.186666 82.24 82.24 0 0 1 3.989333 3.04l0.512 0.416c1.173333 0.992 2.314667 2.016 3.413333 3.082667l0.298667 0.288 282.666667 277.333333a64 64 0 1 1-89.642667 91.370667L570.666667 333.792v539.392a64 64 0 0 1-61.6 63.957333l-2.4 0.042667a64 64 0 0 1-64-64v-539.413333L268.821333 504.352a64 64 0 0 1-88.565333 1.024l-1.941333-1.888a64 64 0 0 1 0.864-90.506667l282.666666-277.333333a65.301333 65.301333 0 0 1 11.573334-9.013333l0.437333-0.266667a50.24 50.24 0 0 1 1.482667-0.853333l0.704-0.394667c0.501333-0.277333 1.013333-0.544 1.514666-0.8l0.650667-0.32a52.949333 52.949333 0 0 1 2.784-1.312 63.765333 63.765333 0 0 1 7.872-2.848l0.213333-0.053333c1.450667-0.426667 2.933333-0.789333 4.437334-1.098667l0.864-0.170667c0.533333-0.106667 1.077333-0.213333 1.621333-0.298666l0.704-0.106667c0.576-0.106667 1.152-0.181333 1.738667-0.256l0.714666-0.085333c0.906667-0.106667 1.813333-0.192 2.730667-0.266667z"></path></svg>',
            width: 12,
            height: 12,
            name: 'up-green111',
            positionType: VTable.TYPES.IconPosition.right
          };
        }
      },
      {
        field: 'percent',
        title: 'percent',
        width: 120,
        cellType: 'progressbar'
      },
      {
        field: 'percent',
        title: 'percent2',
        width: 120,
        cellType: 'progressbar',
        style: {
          textAlign: 'right',
          // barHeight: 20,
          // barBottom: 7,
          barHeight: '50%',
          barBottom: '25%',
          barColor: DEFAULT_BAR_COLOR
        },
        mergeCell: true
      },
      {
        field: 'percent',
        title: 'percent3',
        width: 120,
        cellType: 'progressbar',
        style: {
          barHeight: '100%',
          // barBgColor: '#aaa',
          // barColor: '#444',
          barBgColor: data => {
            return `rgb(${100 + 100 * (1 - Number(data.percentile))},${100 + 100 * (1 - Number(data.percentile))},${
              255 * (1 - Number(data.percentile))
            })`;
          },
          barColor: 'transparent'
        }
      },
      {
        field: 'percent',
        title: 'percent4',
        width: 120,
        cellType: 'progressbar',
        style: {
          barBgColor: data => (Number(data.percentile) > 0.5 ? '#faa' : '#aaa'),
          barColor: data => (Number(data.percentile) > 0.5 ? '#f44' : '#444')
        }
      },
      {
        field: 'value',
        title: 'axis',
        width: 100,
        cellType: 'progressbar',
        min: -10,
        max: 20,
        barType: 'negative',
        style: {
          barHeight: 20,
          barBottom: 7,
          barBgColor: 'transparent',
          textAlign: 'right'
        },
        headerStyle: {
          textAlign: 'right'
        }
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords([
    { percent: '100%', value: 20 },
    { percent: '60%', value: 18 },
    { percent: '60%', value: 16 },
    { percent: '40%', value: 14 },
    { percent: '20%', value: 12 },
    { percent: '0%', value: 10 },
    { percent: '0%', value: -10 }
  ]);

  // VTable.bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag'],
  // });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
