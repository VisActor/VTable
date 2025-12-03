/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
import { theme } from '../../src/register';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const chartDimensionLinkage = {
    showTooltip: true,
    heightLimitToShowTooltipForLastRow: 60,
    widthLimitToShowTooltipForLastColumn: 90,
    labelHoverOnAxis: {
      bottom: {
        visible: true
      },
      left: {
        visible: true,
        formatMethod: a => {
          return Math.floor(a);
        }
      }
    }
  };

  const option = {
    animation: true,
    chartDimensionLinkage,
    rows: [
      {
        dimensionKey: 'ro_20251104185543_4739',
        title: 'area'
      }
    ],
    columns: [
      {
        dimensionKey: 'co_20251104185551_436c',
        title: 'product_type'
      }
    ],
    indicators: [
      {
        indicatorKey: 'scatter-0',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'scatter',
          direction: 'vertical',
          xField: '__MeaXValue__0',
          yField: '__MeaYValue__0',
          seriesField: '__Dim_ColorId__',
          padding: 0,
          region: [
            {
              clip: true
            }
          ],
          animation: true,
          color: {
            type: 'ordinal',
            domain: [],
            range: ['#7E5DFF', '#BCB5D6', '#5B5F89', '#80E1D9', '#F8BC3B', '#B2596E', '#72BEF4', '#C9A0FF']
          },
          //  "background": "transparent",
          data: {
            id: 'scatter-0',
            fields: {}
          },
          large: false,
          largeThreshold: null,
          progressiveStep: 400,
          progressiveThreshold: null,
          axes: [
            {
              range: {},
              visible: true,
              type: 'linear',
              base: 10,
              orient: 'bottom',
              nice: true,
              zero: true,
              inverse: false,
              label: {
                space: 8,
                visible: true,
                style: {
                  fill: '#BCC1CB',
                  angle: 0,
                  fontSize: 12,
                  fontWeight: 400
                }
              },
              title: {
                visible: false,
                text: '',
                style: {
                  fill: '#606773',
                  fontSize: 12,
                  fontWeight: 400
                }
              },
              tick: {
                visible: false,
                tickSize: 4,
                inside: false,
                style: {
                  stroke: '#21252C'
                }
              },
              grid: {
                visible: false,
                style: {
                  lineWidth: 1,
                  stroke: '#E3E5EB',
                  lineDash: [4, 2]
                }
              },
              domainLine: {
                visible: true
              },
              innerOffset: {
                right: 12
              }
            },
            {
              range: {},
              visible: true,
              type: 'linear',
              base: 10,
              orient: 'left',
              nice: true,
              zero: true,
              inverse: false,
              label: {
                space: 8,
                visible: true,
                style: {
                  fill: '#BCC1CB',
                  angle: 0,
                  fontSize: 12,
                  fontWeight: 400
                }
              },
              title: {
                visible: false,
                text: 'sum(amount)',
                style: {
                  fill: '#606773',
                  fontSize: 12,
                  fontWeight: 400
                }
              },
              tick: {
                visible: false,
                tickSize: 4,
                inside: false,
                style: {
                  stroke: '#21252C'
                }
              },
              grid: {
                visible: true,
                style: {
                  lineWidth: 1,
                  stroke: '#F0F1F6',
                  lineDash: [4, 2]
                }
              },
              domainLine: {
                visible: false
              },
              innerOffset: {
                top: 12
              }
            }
          ],
          label: {
            visible: false,
            style: {
              stroke: '#fff',
              fill: '#212121',
              fontSize: 12
            },
            smartInvert: false,
            overlap: {
              hideOnHit: true,
              clampForce: true
            }
          },
          tooltip: {
            style: {
              panel: {
                padding: 7,
                border: {
                  radius: 12,
                  width: 1,
                  color: '#e3e5e8'
                },
                backgroundColor: '#fff'
              },
              keyLabel: {
                lineHeight: 12,
                fontSize: 12,
                fontColor: '#606773'
              },
              valueLabel: {
                lineHeight: 12,
                fontSize: 12,
                fontColor: '#21252c',
                fontWeight: 'medium'
              },
              titleLabel: {
                fontSize: 12,
                lineHeight: 12,
                fontColor: '#21252c',
                fontWeight: 'bold'
              }
            },
            visible: true,
            mark: {
              title: {
                visible: false
              },
              content: [
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound'
                },
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound'
                },
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound',
                  key: 'sum(discount)'
                },
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound',
                  key: 'sum(amount)'
                }
              ]
            },
            dimension: {
              visible: false
            }
          },
          crosshair: {
            xField: {
              visible: true,
              line: {
                type: 'line',
                style: {
                  lineWidth: 1,
                  opacity: 1,
                  stroke: '#21252C',
                  lineDash: [4, 2]
                }
              },
              label: {
                visible: false,
                labelBackground: {
                  visible: true,
                  style: {
                    fill: '#21252C'
                  }
                },
                style: {
                  fill: '#ffffff'
                }
              }
            },
            yField: {
              visible: true,
              line: {
                type: 'line',
                style: {
                  lineWidth: 1,
                  opacity: 1,
                  stroke: '#21252C',
                  lineDash: [4, 2]
                }
              },
              label: {
                visible: false,
                labelBackground: {
                  visible: true,
                  style: {
                    fill: '#21252C'
                  }
                },
                style: {
                  fill: '#ffffff'
                }
              }
            }
          },
          point: {
            style: {},
            state: {
              hover: {
                scaleX: 1.4,
                scaleY: 1.4,
                fillOpacity: 0.6,
                lineWidth: 1
              }
            }
          },
          markPoint: [],
          markLine: [],
          markArea: []
        },
        style: {
          padding: [1, 1, 0, 1]
        }
      }
    ],
    records: {
      'scatter-0': [
        {
          co_20251104185551_436c: '办公用品',
          ro_20251104185543_4739: '东北',
          __OriginalData__: {
            co_20251104185551_436c: '办公用品',
            ro_20251104185543_4739: '东北',
            xA_20251104185532_7ed4: '107.40000000000035',
            yA_20251104185531_8aaf: '3622'
          },
          xA_20251104185532_7ed4: '107.40000000000035',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '107.40000000000035',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '3622',
          __MeaYValue__0: '3622'
        },
        {
          co_20251104185551_436c: '办公用品',
          ro_20251104185543_4739: '中南',
          __OriginalData__: {
            co_20251104185551_436c: '办公用品',
            ro_20251104185543_4739: '中南',
            xA_20251104185532_7ed4: '108.60000000000043',
            yA_20251104185531_8aaf: '5590'
          },
          xA_20251104185532_7ed4: '108.60000000000043',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '108.60000000000043',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '5590',
          __MeaYValue__0: '5590'
        },
        {
          co_20251104185551_436c: '办公用品',
          ro_20251104185543_4739: '华东',
          __OriginalData__: {
            co_20251104185551_436c: '办公用品',
            ro_20251104185543_4739: '华东',
            xA_20251104185532_7ed4: '159.6000000000008',
            yA_20251104185531_8aaf: '6341'
          },
          xA_20251104185532_7ed4: '159.6000000000008',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '159.6000000000008',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '6341',
          __MeaYValue__0: '6341'
        },
        {
          co_20251104185551_436c: '办公用品',
          ro_20251104185543_4739: '华北',
          __OriginalData__: {
            co_20251104185551_436c: '办公用品',
            ro_20251104185543_4739: '华北',
            xA_20251104185532_7ed4: '35.19999999999996',
            yA_20251104185531_8aaf: '3020'
          },
          xA_20251104185532_7ed4: '35.19999999999996',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '35.19999999999996',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '3020',
          __MeaYValue__0: '3020'
        },
        {
          co_20251104185551_436c: '办公用品',
          ro_20251104185543_4739: '西北',
          __OriginalData__: {
            co_20251104185551_436c: '办公用品',
            ro_20251104185543_4739: '西北',
            xA_20251104185532_7ed4: '21.199999999999996',
            yA_20251104185531_8aaf: '970'
          },
          xA_20251104185532_7ed4: '21.199999999999996',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '21.199999999999996',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '970',
          __MeaYValue__0: '970'
        },
        {
          co_20251104185551_436c: '办公用品',
          ro_20251104185543_4739: '西南',
          __OriginalData__: {
            co_20251104185551_436c: '办公用品',
            ro_20251104185543_4739: '西南',
            xA_20251104185532_7ed4: '51.9999999999999',
            yA_20251104185531_8aaf: '1858'
          },
          xA_20251104185532_7ed4: '51.9999999999999',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '51.9999999999999',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '1858',
          __MeaYValue__0: '1858'
        },
        {
          co_20251104185551_436c: '家具',
          ro_20251104185543_4739: '东北',
          __OriginalData__: {
            co_20251104185551_436c: '家具',
            ro_20251104185543_4739: '东北',
            xA_20251104185532_7ed4: '69.34999999999994',
            yA_20251104185531_8aaf: '1470'
          },
          xA_20251104185532_7ed4: '69.34999999999994',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '69.34999999999994',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '1470',
          __MeaYValue__0: '1470'
        },
        {
          co_20251104185551_436c: '家具',
          ro_20251104185543_4739: '中南',
          __OriginalData__: {
            co_20251104185551_436c: '家具',
            ro_20251104185543_4739: '中南',
            xA_20251104185532_7ed4: '71.55000000000008',
            yA_20251104185531_8aaf: '2023'
          },
          xA_20251104185532_7ed4: '71.55000000000008',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '71.55000000000008',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '2023',
          __MeaYValue__0: '2023'
        },
        {
          co_20251104185551_436c: '家具',
          ro_20251104185543_4739: '华东',
          __OriginalData__: {
            co_20251104185551_436c: '家具',
            ro_20251104185543_4739: '华东',
            xA_20251104185532_7ed4: '96.30000000000021',
            yA_20251104185531_8aaf: '2517'
          },
          xA_20251104185532_7ed4: '96.30000000000021',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '96.30000000000021',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '2517',
          __MeaYValue__0: '2517'
        },
        {
          co_20251104185551_436c: '家具',
          ro_20251104185543_4739: '华北',
          __OriginalData__: {
            co_20251104185551_436c: '家具',
            ro_20251104185543_4739: '华北',
            xA_20251104185532_7ed4: '25.29999999999999',
            yA_20251104185531_8aaf: '1199'
          },
          xA_20251104185532_7ed4: '25.29999999999999',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '25.29999999999999',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '1199',
          __MeaYValue__0: '1199'
        },
        {
          co_20251104185551_436c: '家具',
          ro_20251104185543_4739: '西北',
          __OriginalData__: {
            co_20251104185551_436c: '家具',
            ro_20251104185543_4739: '西北',
            xA_20251104185532_7ed4: '19.399999999999995',
            yA_20251104185531_8aaf: '468'
          },
          xA_20251104185532_7ed4: '19.399999999999995',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '19.399999999999995',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '468',
          __MeaYValue__0: '468'
        },
        {
          co_20251104185551_436c: '家具',
          ro_20251104185543_4739: '西南',
          __OriginalData__: {
            co_20251104185551_436c: '家具',
            ro_20251104185543_4739: '西南',
            xA_20251104185532_7ed4: '43.199999999999925',
            yA_20251104185531_8aaf: '814'
          },
          xA_20251104185532_7ed4: '43.199999999999925',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '43.199999999999925',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '814',
          __MeaYValue__0: '814'
        },
        {
          co_20251104185551_436c: '技术',
          ro_20251104185543_4739: '东北',
          __OriginalData__: {
            co_20251104185551_436c: '技术',
            ro_20251104185543_4739: '东北',
            xA_20251104185532_7ed4: '57.99999999999986',
            yA_20251104185531_8aaf: '1371'
          },
          xA_20251104185532_7ed4: '57.99999999999986',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '57.99999999999986',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '1371',
          __MeaYValue__0: '1371'
        },
        {
          co_20251104185551_436c: '技术',
          ro_20251104185543_4739: '中南',
          __OriginalData__: {
            co_20251104185551_436c: '技术',
            ro_20251104185543_4739: '中南',
            xA_20251104185532_7ed4: '51.99999999999988',
            yA_20251104185531_8aaf: '2087'
          },
          xA_20251104185532_7ed4: '51.99999999999988',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '51.99999999999988',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '2087',
          __MeaYValue__0: '2087'
        },
        {
          co_20251104185551_436c: '技术',
          ro_20251104185543_4739: '华东',
          __OriginalData__: {
            co_20251104185551_436c: '技术',
            ro_20251104185543_4739: '华东',
            xA_20251104185532_7ed4: '75.19999999999999',
            yA_20251104185531_8aaf: '2183'
          },
          xA_20251104185532_7ed4: '75.19999999999999',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '75.19999999999999',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '2183',
          __MeaYValue__0: '2183'
        },
        {
          co_20251104185551_436c: '技术',
          ro_20251104185543_4739: '华北',
          __OriginalData__: {
            co_20251104185551_436c: '技术',
            ro_20251104185543_4739: '华北',
            xA_20251104185532_7ed4: '13.600000000000007',
            yA_20251104185531_8aaf: '927'
          },
          xA_20251104185532_7ed4: '13.600000000000007',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '13.600000000000007',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '927',
          __MeaYValue__0: '927'
        },
        {
          co_20251104185551_436c: '技术',
          ro_20251104185543_4739: '西北',
          __OriginalData__: {
            co_20251104185551_436c: '技术',
            ro_20251104185543_4739: '西北',
            xA_20251104185532_7ed4: '12.800000000000006',
            yA_20251104185531_8aaf: '347'
          },
          xA_20251104185532_7ed4: '12.800000000000006',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '12.800000000000006',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '347',
          __MeaYValue__0: '347'
        },
        {
          co_20251104185551_436c: '技术',
          ro_20251104185543_4739: '西南',
          __OriginalData__: {
            co_20251104185551_436c: '技术',
            ro_20251104185543_4739: '西南',
            xA_20251104185532_7ed4: '38.99999999999995',
            yA_20251104185531_8aaf: '727'
          },
          xA_20251104185532_7ed4: '38.99999999999995',
          __MeaId__: 'yA_20251104185531_8aaf',
          __MeaName__: 'sum(amount)',
          __MeaXValue__0: '38.99999999999995',
          __Dim_Detail__: 'yA_20251104185531_8aaf',
          yA_20251104185531_8aaf: '727',
          __MeaYValue__0: '727'
        }
      ]
    },
    widthMode: 'standard',
    autoFillWidth: true,
    defaultHeaderColWidth: 'auto',
    defaultColWidth: 200,
    heightMode: 'standard',
    autoFillHeight: true,
    defaultRowHeight: 100,
    defaultHeaderRowHeight: 'auto',
    indicatorsAsCol: false,
    select: {
      highlightMode: 'cell',
      headerSelectMode: 'inline'
    },
    hover: {
      highlightMode: 'cross'
    },
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    corner: {
      titleOnDimension: 'row'
    },
    animationAppear: {
      duration: 600,
      type: 'all',
      direction: 'row'
    },
    theme: {
      underlayBackgroundColor: 'rgba(0,0,0,0)',
      bodyStyle: {
        borderColor: '#e3e5eb',
        color: '#141414',
        bgColor: 'rgba(0,0,0,0)',
        hover: {
          cellBgColor: 'transparent'
        }
      },
      headerStyle: {
        borderColor: '#e3e5eb',
        fontSize: 12,
        color: '#21252c',
        textAlign: 'center',
        bgColor: 'transparent',
        hover: {
          cellBgColor: '#D9DDE4',
          inlineRowBgColor: '#D9DDE455',
          inlineColumnBgColor: '#D9DDE455'
        }
      },
      rowHeaderStyle: {
        borderColor: '#e3e5eb',
        fontSize: 12,
        color: '#21252c',
        padding: [0, 12, 0, 12],
        bgColor: 'transparent',
        hover: {
          cellBgColor: '#D9DDE4',
          inlineRowBgColor: '#D9DDE455',
          inlineColumnBgColor: '#D9DDE455'
        }
      },
      cornerHeaderStyle: {
        borderColor: '#e3e5eb',
        textAlign: 'center',
        fontSize: 12,
        color: '#21252c',
        padding: [0, 12, 0, 4],
        fontWeight: 'bold',
        borderLineWidth: [0, 1, 1, 0],
        bgColor: 'transparent',
        frameStyle: {
          borderColor: '#e3e5eb'
        },
        hover: {
          cellBgColor: '#D9DDE4',
          inlineRowBgColor: '#D9DDE455',
          inlineColumnBgColor: '#D9DDE455'
        }
      },
      cornerLeftBottomCellStyle: {
        borderColor: '#e3e5eb',
        borderLineWidth: [0, 0, 0, 0],
        bgColor: 'transparent',
        frameStyle: {
          borderColor: '#e3e5eb',
          borderLineWidth: [1, 0, 0, 0]
        },
        hover: {
          cellBgColor: '#D9DDE4'
        }
      },
      cornerRightTopCellStyle: {
        borderColor: '#e3e5eb',
        borderLineWidth: [0, 0, 1, 1],
        frameStyle: {
          borderColor: '#e3e5eb',
          borderLineWidth: 0
        },
        bgColor: 'transparent',
        hover: {
          cellBgColor: '#D9DDE4'
        }
      },
      rightFrozenStyle: {
        borderColor: '#e3e5eb',
        bgColor: 'transparent',
        frameStyle: {
          borderLineWidth: 0
        },
        hover: {
          borderLineWidth: 0,
          cellBgColor: '#D9DDE4'
        }
      },
      cornerRightBottomCellStyle: {
        borderColor: '#e3e5eb',
        bgColor: 'transparent',
        borderLineWidth: [1, 0, 0, 1],
        frameStyle: {
          borderColor: '#e3e5eb',
          borderLineWidth: [1, 0, 0, 1]
        },
        hover: {
          cellBgColor: '#D9DDE4'
        }
      },
      bottomFrozenStyle: {
        borderColor: '#e3e5eb',
        borderLineWidth: [1, 0, 0, 1],
        bgColor: 'transparent',
        hover: {
          cellBgColor: '#D9DDE4'
        }
      },
      selectionStyle: {
        cellBgColor: '',
        cellBorderColor: ''
      },
      frameStyle: {
        borderColor: '#e3e5eb',
        cornerRadius: 0,
        borderLineWidth: 0
      }
    },
    title: {
      text: 'product_type',
      align: 'center',
      orient: 'top',
      padding: [2, 0, 0, 0],
      textStyle: {
        fontSize: 12,
        fill: '#21252c',
        fontWeight: 'bold'
      }
    },
    legends: {
      padding: 0,
      visible: true,
      type: 'discrete',
      orient: 'top',
      position: 'end',
      maxCol: 1,
      maxRow: 1,
      data: [],
      item: {
        focus: true,
        maxWidth: '30%',
        focusIconStyle: {
          size: 14,
          fill: '#606773',
          fontWeight: 400
        },
        shape: {
          space: 6,
          style: {
            symbolType: 'rectRound',
            size: 8
          }
        },
        label: {
          style: {
            fontSize: 12,
            fill: '#606773',
            fontWeight: 400
          }
        },
        background: {
          state: {
            selectedHover: {
              fill: '#606773',
              fillOpacity: 0.05
            }
          }
        }
      }
    }
  };
  const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
  // tableInstance.onVChartEvent('click', args => {
  //   console.log('onVChartEvent click', args);
  // });
  // tableInstance.onVChartEvent('mouseover', args => {
  //   console.log('onVChartEvent mouseover', args);
  // });
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

  window.update = () => {
    theme.cornerLeftBottomCellStyle.borderColor = 'red';
    tableInstance.updateTheme(theme);
  };
}
