/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  let tableInstance;
  const opacityBackgroundColor = 'rgba(0,0,0,0)';
  const rowHeaderBgColor = 'rgba(51, 112, 235, 0.03)';
  const headerBgColor = 'rgba(51, 112, 235, 0.1)';
  const bgColorFc = args => {
    const showGrandTotals = args?.table?.options?.dataConfig?.totals?.row?.showGrandTotals;
    const isRowHeader = args?.cellHeaderPaths?.cellLocation === 'rowHeader';
    const originColor = isRowHeader ? rowHeaderBgColor : opacityBackgroundColor;
    return showGrandTotals && args.row === args.table.rowCount - 1 ? headerBgColor : originColor;
  };
  const option: VTable.ListTableConstructorOptions = {
    theme: VTable.themes.DEFAULT.extends({
      defaultStyle: {
        fontFamily: 'PingFang SC',
        fontSize: 14,
        lineHeight: 32,
        fontWeight: 400,
        color: 'rgb(31, 35, 41)',
        padding: [20, 20, 16, 20],
        hover: {
          cellBgColor: 'rgba(31, 35, 41, 0.08)'
        },
        borderLineWidth: 1,
        borderColor: 'rgba(225, 0, 0, 0.1)'
        // "borderColor": 'red',
      },
      frameStyle: {
        // "cornerRadius": 16,
        borderLineWidth: 0,
        borderColor: 'rgba(0, 0, 0, 0)'
      },
      headerStyle: {
        fontWeight: '600',
        hover: {
          cellBgColor: 'rgba(31, 35, 41, 0.08)'
        },
        bgColor: 'rgba(51, 112, 235, 0.1)'
      },
      cornerHeaderStyle: {
        fontWeight: '600',
        hover: {
          cellBgColor: 'rgba(31, 35, 41, 0.08)'
        },
        bgColor: 'rgba(51, 112, 235, 0.1)'
      },
      rowHeaderStyle: {
        hover: {
          cellBgColor: 'rgba(31, 35, 41, 0.08)'
        },
        bgColor: bgColorFc,
        borderColor: args => {
          return args.row === args.table.rowCount - 1 ? ['red', '#E1E4E8', '#E1E4E8', '#E1E4E8'] : '#E1E4E8';
        },
        borderLineWidth: args => {
          return args.row === args.table.rowCount - 1 ? [4, 1, 1, 1] : 1;
        }
      },
      bodyStyle: {
        hover: {
          cellBgColor: 'rgba(31, 35, 41, 0.08)'
        },
        bgColor: bgColorFc,
        // borderColor: (args) => {
        //   return "rgba(0, 0, 0, 0.1)";
        // },
        borderColor: args => {
          return args.row === args.table.rowCount - 1 ? ['red', '#E1E4E8', '#E1E4E8', '#E1E4E8'] : '#E1E4E8';
        },
        borderLineWidth: args => {
          return args.row === args.table.rowCount - 1 ? [4, 1, 1, 1] : 1;
        }
      },
      selectionStyle: {
        cellBorderColor: 'rgb(20, 86, 240)',
        cellBgColor: 'rgba(255, 255, 255, 0)'
      },
      underlayBackgroundColor: 'rgba(0,0,0,0)'
    }),
    records: [
      {
        fldF0o8WWs: '',
        original: {
          fldF0o8WWs: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldF0o8WWs',
            key: 'CHART_COUNT_SERIES'
          },
          fldJUQbtMj: {
            value: '黄也',
            text: '黄也',
            groupKey: '7391679846503546881',
            fldKey: 'fldJUQbtMj',
            key: '7391679846503546881'
          },
          fld0RRqvef: {
            value: '浙江',
            text: '浙江',
            groupKey: 'optLqMyO9x',
            fldKey: 'fld0RRqvef',
            key: 'optLqMyO9x'
          },
          flduJaFJXb: {
            value: 1,
            text: '1',
            formatString: '',
            groupKey: '1',
            fldKey: 'flduJaFJXb',
            key: '1'
          }
        },
        fldJUQbtMj: '黄也',
        fld0RRqvef: '浙江',
        flduJaFJXb: '1'
      },
      {
        fldJUQbtMj: '黄也',
        original: {
          fldJUQbtMj: {
            value: '黄也',
            text: '黄也',
            groupKey: '7391679846503546881',
            fldKey: 'fldJUQbtMj',
            key: '7391679846503546881'
          },
          fld0RRqvef: {
            value: '上海',
            text: '上海',
            groupKey: 'optnGiTh3j',
            fldKey: 'fld0RRqvef',
            key: 'optnGiTh3j'
          },
          flduJaFJXb: {
            value: 1,
            text: '1',
            formatString: '',
            groupKey: '1',
            fldKey: 'flduJaFJXb',
            key: '1'
          },
          fldF0o8WWs: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldF0o8WWs',
            key: '7391679846503546881-1'
          }
        },
        fld0RRqvef: '上海',
        flduJaFJXb: '1',
        fldF0o8WWs: ''
      },
      {
        fldJUQbtMj: '孙锐',
        original: {
          fldJUQbtMj: {
            value: '孙锐',
            text: '孙锐',
            groupKey: '6911117420048482305',
            fldKey: 'fldJUQbtMj',
            key: '6911117420048482305'
          },
          fld0RRqvef: {
            value: '北京',
            text: '北京',
            groupKey: 'optJX6B5W2',
            fldKey: 'fld0RRqvef',
            key: 'optJX6B5W2'
          },
          flduJaFJXb: {
            value: 1,
            text: '1',
            formatString: '',
            groupKey: '1',
            fldKey: 'flduJaFJXb',
            key: '1'
          },
          fldF0o8WWs: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldF0o8WWs',
            key: '6911117420048482305-1'
          }
        },
        fld0RRqvef: '北京',
        flduJaFJXb: '1',
        fldF0o8WWs: ''
      },
      {
        fld0RRqvef: '浙江',
        original: {
          fld0RRqvef: {
            value: '浙江',
            text: '浙江',
            groupKey: 'optLqMyO9x',
            fldKey: 'fld0RRqvef',
            key: 'optLqMyO9x'
          },
          flduJaFJXb: {
            value: 1,
            text: '1',
            formatString: '',
            groupKey: '1',
            fldKey: 'flduJaFJXb',
            key: '1'
          },
          fldJUQbtMj: {
            value: '王瑜',
            text: '王瑜',
            groupKey: '6926721444135239708',
            fldKey: 'fldJUQbtMj',
            key: '6926721444135239708'
          },
          fldF0o8WWs: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldF0o8WWs',
            key: 'optLqMyO9x-1'
          }
        },
        flduJaFJXb: '1',
        fldJUQbtMj: '王瑜',
        fldF0o8WWs: ''
      },
      {
        fldJUQbtMj: '袁力皓',
        original: {
          fldJUQbtMj: {
            value: '袁力皓',
            text: '袁力皓',
            groupKey: '7287778942055317508',
            fldKey: 'fldJUQbtMj',
            key: '7287778942055317508'
          },
          fld0RRqvef: {
            value: '浙江',
            text: '浙江',
            groupKey: 'optLqMyO9x',
            fldKey: 'fld0RRqvef',
            key: 'optLqMyO9x'
          },
          flduJaFJXb: {
            value: 1,
            text: '1',
            formatString: '',
            groupKey: '1',
            fldKey: 'flduJaFJXb',
            key: '1'
          },
          fldF0o8WWs: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldF0o8WWs',
            key: '7287778942055317508-1'
          }
        },
        fld0RRqvef: '浙江',
        flduJaFJXb: '1',
        fldF0o8WWs: ''
      },
      {
        fldF0o8WWs: '',
        original: {
          fldF0o8WWs: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldF0o8WWs',
            key: '123_BITABLE_DASHBOARD_CHART_DIMENSION_DEFAULT_EMPTY_KEY_321'
          },
          fldJUQbtMj: {
            value: '袁力皓',
            text: '袁力皓',
            groupKey: '7287778942055317508',
            fldKey: 'fldJUQbtMj',
            key: '7287778942055317508'
          },
          fld0RRqvef: {
            value: '北京',
            text: '北京',
            groupKey: 'optJX6B5W2',
            fldKey: 'fld0RRqvef',
            key: 'optJX6B5W2'
          },
          flduJaFJXb: {
            value: 1,
            text: '1',
            formatString: '',
            groupKey: '1',
            fldKey: 'flduJaFJXb',
            key: '1'
          }
        },
        fldJUQbtMj: '袁力皓',
        fld0RRqvef: '北京',
        flduJaFJXb: '1'
      },
      {
        fldF0o8WWs: '',
        original: {
          fldF0o8WWs: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldF0o8WWs',
            key: '123_BITABLE_DASHBOARD_CHART_DIMENSION_DEFAULT_EMPTY_KEY_321'
          },
          fldJUQbtMj: {
            value: '袁力皓',
            text: '袁力皓',
            groupKey: '7287778942055317508',
            fldKey: 'fldJUQbtMj',
            key: '7287778942055317508'
          },
          fld0RRqvef: {
            value: '上海',
            text: '上海',
            groupKey: 'optnGiTh3j',
            fldKey: 'fld0RRqvef',
            key: 'optnGiTh3j'
          },
          flduJaFJXb: {
            value: 1,
            text: '1',
            formatString: '',
            groupKey: '1',
            fldKey: 'flduJaFJXb',
            key: '1'
          }
        },
        fldJUQbtMj: '袁力皓',
        fld0RRqvef: '上海',
        flduJaFJXb: '1'
      },
      {
        fldF0o8WWs: '',
        original: {
          fldF0o8WWs: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldF0o8WWs',
            key: '123_BITABLE_DASHBOARD_CHART_DIMENSION_DEFAULT_EMPTY_KEY_321'
          },
          fldJUQbtMj: {
            value: '袁力皓',
            text: '袁力皓',
            groupKey: '7287778942055317508',
            fldKey: 'fldJUQbtMj',
            key: '7287778942055317508'
          },
          fld0RRqvef: {
            value: '广东',
            text: '广东',
            groupKey: 'optIDgZ8tC',
            fldKey: 'fld0RRqvef',
            key: 'optIDgZ8tC'
          },
          flduJaFJXb: {
            value: 1,
            text: '1',
            formatString: '',
            groupKey: '1',
            fldKey: 'flduJaFJXb',
            key: '1'
          }
        },
        fldJUQbtMj: '袁力皓',
        fld0RRqvef: '广东',
        flduJaFJXb: '1'
      },
      {
        fld0RRqvef: '',
        original: {
          fld0RRqvef: {
            value: '',
            text: '',
            groupKey: null,
            fldKey: 'fld0RRqvef',
            key: '123_BITABLE_DASHBOARD_CHART_DIMENSION_DEFAULT_EMPTY_KEY_321'
          },
          flduJaFJXb: {
            value: 1,
            text: '1',
            formatString: '',
            groupKey: '1',
            fldKey: 'flduJaFJXb',
            key: '1'
          },
          fldJUQbtMj: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldJUQbtMj',
            key: '123_BITABLE_DASHBOARD_CHART_DIMENSION_DEFAULT_EMPTY_KEY_321-optLqMyO9x'
          },
          fldF0o8WWs: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldF0o8WWs',
            key: '123_BITABLE_DASHBOARD_CHART_DIMENSION_DEFAULT_EMPTY_KEY_321-1'
          }
        },
        flduJaFJXb: '1',
        fldJUQbtMj: '',
        fldF0o8WWs: ''
      }
    ],
    rows: [
      {
        dimensionKey: 'fldF0o8WWs',
        title: '文本',
        width: 'auto',
        maxWidth: 370
      },
      {
        dimensionKey: 'fldJUQbtMj',
        title: '人员',
        width: 'auto',
        maxWidth: 370
      }
    ],
    columns: [
      {
        dimensionKey: 'fld0RRqvef',
        title: '地区',
        width: 'auto',
        maxWidth: 370
      }
    ],
    indicators: [
      {
        indicatorKey: 'flduJaFJXb',
        title: '销售额',
        width: 'auto',
        maxWidth: 370
      }
    ],
    defaultRowHeight: 32,
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        textStick: true
      }
    },
    widthMode: 'standard',
    rowHierarchyIndent: 20,
    rowHierarchyTextStartAlignment: true,
    dataConfig: {
      totals: {
        row: {
          showGrandTotals: true,
          grandTotalLabel: 'Bitable_Dashboard_PivotTable_Total_Title'
        },
        column: {
          showGrandTotals: true,
          grandTotalLabel: 'Bitable_Dashboard_PivotTable_Total_Title'
        }
      }
    },

    customConfig: {
      scrollEventAlwaysTrigger: true
    }

    // viewBox: {
    //   x1: 20,
    //   y1: 20,
    //   x2: 700,
    //   y2: 700
    // }

    // canvasWidth: 660,
    // canvasHeight: 660

    // canvasWidth: 600
  };

  const dom = document.getElementById(CONTAINER_ID);
  dom.style.width = '700px';
  dom.style.height = '700px';
  dom.style.border = '1px solid red';

  window.update = () => {
    dom.style.width = '500px';
  };

  tableInstance = new VTable.PivotTable(dom, option);
  window['tableInstance'] = tableInstance;

  const operator = new VTablePaddingOperator([20, 20, 20, 20], tableInstance);
  // operator.destroy();
}

class VTablePaddingOperator {
  table: VTable.PivotTable;
  x2: number;
  x2Target: number;
  y2Target: number;
  tag: boolean;
  element: HTMLElement;
  observer: ResizeObserver;

  constructor(padding: [number, number, number, number], vtable: VTable.PivotTable) {
    this.table = vtable;

    this.element = vtable.getElement().parentElement as HTMLElement;

    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;

    this.table.updateViewBox({
      x1: padding[3],
      y1: padding[0],
      x2: width - padding[1],
      y2: height - padding[2]
    });

    this.x2 = width;
    this.x2Target = width;
    this.y2Target = height;
    this.tag = false;

    const ResizeObserverWindow = window.ResizeObserver;
    this.observer = new ResizeObserverWindow(this.resizeCallback);
    this.observer?.observe(this.element);

    this.table.on('scroll', e => {
      console.log(e.dx, e.scrollRatioX);
      if (e.scrollRatioX === 1 && (e.dx ?? 0) >= 0 && this.x2 > this.x2Target - 20) {
        // right
        this.x2 = this.x2 - (e.dx || 1);

        console.log('left', this.x2);
        setTimeout(() => {
          const context = this.table.canvas.getContext('2d');
          context?.clearRect(0, 0, this.x2Target * 2, this.y2Target * 2);
          this.table.updateViewBox({
            x1: 20,
            y1: 20,
            x2: this.x2,
            y2: this.y2Target
          });
          this.table.scenegraph.setX(-this.table.stateManager.scroll.horizontalBarPos - 1, true);
        }, 0);
      } else if (this.x2 < this.x2Target && (e.dx ?? 0) < 0) {
        // left
        this.x2 = this.x2 - (e.dx ?? 0);

        console.log('right', this.x2);
        setTimeout(() => {
          const context = this.table.canvas.getContext('2d');
          context?.clearRect(0, 0, this.x2Target * 2, this.y2Target * 2);
          this.table.updateViewBox({
            x1: 20,
            y1: 20,
            x2: this.x2,
            y2: this.y2Target
          });
          this.table.scenegraph.setX(-this.table.stateManager.scroll.horizontalBarPos - 1, true);
        }, 0);
      } else {
        console.log('normal', this.x2);
      }
    });
  }

  resizeCallback = () => {
    const xOffset = this.element.offsetWidth - this.x2Target;
    const yOffset = this.element.offsetHeight - this.y2Target;
    this.x2 = this.x2 + xOffset;
    this.x2Target = this.element.offsetWidth;
    this.y2Target = this.element.offsetHeight;
    this.table.updateViewBox({
      x1: 20,
      y1: 20,
      x2: this.element.offsetWidth,
      y2: this.element.offsetHeight
    });
  };

  destroy() {
    this.observer.disconnect();
  }
}
