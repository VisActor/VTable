/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
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
      }
    }
  };

  const option = {
    animation: true,
    chartDimensionLinkage,
    rows: [],
    columns: [],
    indicators: [
      {
        indicatorKey: '0',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'line',
          direction: 'vertical',
          xField: '__Dim_X__',
          yField: '__MeaValue__0',
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
            domain: [
              'xA_20251104185715_0c08',
              'xA_20251104185721_16cd',
              'yA_20251118110628_29fb',
              'yA_20251118110617_f8e8'
            ],
            range: ['#7E5DFF', '#BCB5D6', '#5B5F89', '#80E1D9', '#F8BC3B', '#B2596E', '#72BEF4', '#C9A0FF']
          },
          background: 'transparent',
          data: {
            id: '0',
            fields: {
              __Dim_Angle__: {
                sortIndex: 0
              },
              __Dim_X__: {
                sortIndex: 0
              },
              __Dim_ColorId__: {
                sortIndex: 0
              }
            }
          },
          large: false,
          largeThreshold: null,
          progressiveStep: 400,
          progressiveThreshold: null,
          axes: [
            {
              visible: true,
              type: 'band',
              orient: 'bottom',
              maxHeight: 140,
              sampling: false,
              hover: true,
              label: {
                visible: true,
                flush: true,
                space: 8,
                style: {
                  maxLineWidth: 80,
                  fill: '#BCC1CB',
                  angle: 0,
                  fontSize: 12,
                  fontWeight: 400
                },
                minGap: 4,
                autoHide: true,
                autoHideMethod: 'greedy',
                autoHideSeparation: 4,
                autoLimit: true,
                autoRotate: false,
                autoRotateAngle: [0, -45, -90],
                lastVisible: true
              },
              title: {
                visible: false,
                text: 'order_date',
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
                visible: false
              },
              paddingInner: [0.15, 0.1],
              paddingOuter: [0.075, 0.1],
              innerOffset: {
                left: 2,
                right: 2
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
                text: 'sum(sales)',
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
            }
          },
          point: {
            style: {},
            state: {
              dimension_hover: {
                scaleX: 1.4,
                scaleY: 1.4,
                outerBorder: {
                  lineWidth: 4,
                  strokeOpacity: 0.25,
                  distance: 2
                }
              }
            }
          },
          line: {
            style: {}
          },
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
                }
              ]
            },
            dimension: {
              title: {
                visible: true
              },
              content: [
                {
                  visible: true,
                  shapeType: 'rectRound',
                  hasShape: true
                }
              ]
            }
          },
          markPoint: [],
          markLine: [],
          markArea: []
        },
        style: {
          padding: [1, 1, 0, 1]
        }
      },
      {
        indicatorKey: '1',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'line',
          direction: 'vertical',
          xField: '__Dim_X__',
          yField: '__MeaValue__1',
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
            domain: [
              'xA_20251104185715_0c08',
              'xA_20251104185721_16cd',
              'yA_20251118110628_29fb',
              'yA_20251118110617_f8e8'
            ],
            range: ['#7E5DFF', '#BCB5D6', '#5B5F89', '#80E1D9', '#F8BC3B', '#B2596E', '#72BEF4', '#C9A0FF']
          },
          background: 'transparent',
          data: {
            id: '1',
            fields: {
              __Dim_Angle__: {
                sortIndex: 0
              },
              __Dim_X__: {
                sortIndex: 0
              },
              __Dim_ColorId__: {
                sortIndex: 0
              }
            }
          },
          large: false,
          largeThreshold: null,
          progressiveStep: 400,
          progressiveThreshold: null,
          axes: [
            {
              visible: true,
              type: 'band',
              orient: 'bottom',
              maxHeight: 140,
              sampling: false,
              hover: true,
              label: {
                visible: true,
                flush: true,
                space: 8,
                style: {
                  maxLineWidth: 80,
                  fill: '#BCC1CB',
                  angle: 0,
                  fontSize: 12,
                  fontWeight: 400
                },
                minGap: 4,
                autoHide: true,
                autoHideMethod: 'greedy',
                autoHideSeparation: 4,
                autoLimit: true,
                autoRotate: false,
                autoRotateAngle: [0, -45, -90],
                lastVisible: true
              },
              title: {
                visible: false,
                text: 'order_date',
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
                visible: false
              },
              paddingInner: [0.15, 0.1],
              paddingOuter: [0.075, 0.1],
              innerOffset: {
                left: 2,
                right: 2
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
                text: 'sum(discount) & sum(amount)',
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
            }
          },
          point: {
            style: {},
            state: {
              dimension_hover: {
                scaleX: 1.4,
                scaleY: 1.4,
                outerBorder: {
                  lineWidth: 4,
                  strokeOpacity: 0.25,
                  distance: 2
                }
              }
            }
          },
          line: {
            style: {}
          },
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
                }
              ]
            },
            dimension: {
              title: {
                visible: true
              },
              content: [
                {
                  visible: true,
                  shapeType: 'rectRound',
                  hasShape: true
                }
              ]
            }
          },
          markPoint: [],
          markLine: [],
          markArea: []
        },
        style: {
          padding: [1, 1, 0, 1]
        }
      },
      {
        indicatorKey: '2',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'line',
          direction: 'vertical',
          xField: '__Dim_X__',
          yField: '__MeaValue__2',
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
            domain: [
              'xA_20251104185715_0c08',
              'xA_20251104185721_16cd',
              'yA_20251118110628_29fb',
              'yA_20251118110617_f8e8'
            ],
            range: ['#7E5DFF', '#BCB5D6', '#5B5F89', '#80E1D9', '#F8BC3B', '#B2596E', '#72BEF4', '#C9A0FF']
          },
          background: 'transparent',
          data: {
            id: '2',
            fields: {
              __Dim_Angle__: {
                sortIndex: 0
              },
              __Dim_X__: {
                sortIndex: 0
              },
              __Dim_ColorId__: {
                sortIndex: 0
              }
            }
          },
          large: false,
          largeThreshold: null,
          progressiveStep: 400,
          progressiveThreshold: null,
          axes: [
            {
              visible: true,
              type: 'band',
              orient: 'bottom',
              maxHeight: 140,
              sampling: false,
              hover: true,
              label: {
                visible: true,
                flush: true,
                space: 8,
                style: {
                  maxLineWidth: 80,
                  fill: '#BCC1CB',
                  angle: 0,
                  fontSize: 12,
                  fontWeight: 400
                },
                minGap: 4,
                autoHide: true,
                autoHideMethod: 'greedy',
                autoHideSeparation: 4,
                autoLimit: true,
                autoRotate: false,
                autoRotateAngle: [0, -45, -90],
                lastVisible: true
              },
              title: {
                visible: false,
                text: 'order_date',
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
                visible: false
              },
              paddingInner: [0.15, 0.1],
              paddingOuter: [0.075, 0.1],
              innerOffset: {
                left: 2,
                right: 2
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
                text: 'sum(profit)',
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
            }
          },
          point: {
            style: {},
            state: {
              dimension_hover: {
                scaleX: 1.4,
                scaleY: 1.4,
                outerBorder: {
                  lineWidth: 4,
                  strokeOpacity: 0.25,
                  distance: 2
                }
              }
            }
          },
          line: {
            style: {}
          },
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
                }
              ]
            },
            dimension: {
              title: {
                visible: true
              },
              content: [
                {
                  visible: true,
                  shapeType: 'rectRound',
                  hasShape: true
                }
              ]
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
      '0': [
        {
          yA_20251104185711_61c6: '2016-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '2931056.4149999986',
            xA_20251104185721_16cd: '196.50000000000122',
            yA_20251104185711_61c6: '2016-01-01',
            yA_20251118110617_f8e8: '373011.27499999997',
            yA_20251118110628_29fb: '6710'
          },
          xA_20251104185715_0c08: '2931056.4149999986',
          __MeaId__: 'xA_20251104185715_0c08',
          __MeaName__: 'sum(sales)',
          __MeaValue__0: '2931056.4149999986',
          __Dim_X__: '2016-01-01',
          __Dim_Color__: 'xA_20251104185715_0c08',
          __Dim_Detail__: 'xA_20251104185715_0c08',
          __Dim_ColorId__: 'xA_20251104185715_0c08'
        },
        {
          yA_20251104185711_61c6: '2017-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '3431919.4629999986',
            xA_20251104185721_16cd: '227.9000000000013',
            yA_20251104185711_61c6: '2017-01-01',
            yA_20251118110617_f8e8: '471470.2230000006',
            yA_20251118110628_29fb: '8012'
          },
          xA_20251104185715_0c08: '3431919.4629999986',
          __MeaId__: 'xA_20251104185715_0c08',
          __MeaName__: 'sum(sales)',
          __MeaValue__0: '3431919.4629999986',
          __Dim_X__: '2017-01-01',
          __Dim_Color__: 'xA_20251104185715_0c08',
          __Dim_Detail__: 'xA_20251104185715_0c08',
          __Dim_ColorId__: 'xA_20251104185715_0c08'
        },
        {
          yA_20251104185711_61c6: '2018-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '4243539.8599999985',
            xA_20251104185721_16cd: '286.95000000000056',
            yA_20251104185711_61c6: '2018-01-01',
            yA_20251118110617_f8e8: '621943.0',
            yA_20251118110628_29fb: '9901'
          },
          xA_20251104185715_0c08: '4243539.8599999985',
          __MeaId__: 'xA_20251104185715_0c08',
          __MeaName__: 'sum(sales)',
          __MeaValue__0: '4243539.8599999985',
          __Dim_X__: '2018-01-01',
          __Dim_Color__: 'xA_20251104185715_0c08',
          __Dim_Detail__: 'xA_20251104185715_0c08',
          __Dim_ColorId__: 'xA_20251104185715_0c08'
        },
        {
          yA_20251104185711_61c6: '2019-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '5462438.386999988',
            xA_20251104185721_16cd: '348.34999999999803',
            yA_20251104185711_61c6: '2019-01-01',
            yA_20251118110617_f8e8: '681114.4269999989',
            yA_20251118110628_29fb: '12911'
          },
          xA_20251104185715_0c08: '5462438.386999988',
          __MeaId__: 'xA_20251104185715_0c08',
          __MeaName__: 'sum(sales)',
          __MeaValue__0: '5462438.386999988',
          __Dim_X__: '2019-01-01',
          __Dim_Color__: 'xA_20251104185715_0c08',
          __Dim_Detail__: 'xA_20251104185715_0c08',
          __Dim_ColorId__: 'xA_20251104185715_0c08'
        }
      ],
      '1': [
        {
          yA_20251104185711_61c6: '2016-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '2931056.4149999986',
            xA_20251104185721_16cd: '196.50000000000122',
            yA_20251104185711_61c6: '2016-01-01',
            yA_20251118110617_f8e8: '373011.27499999997',
            yA_20251118110628_29fb: '6710'
          },
          xA_20251104185721_16cd: '196.50000000000122',
          __MeaId__: 'xA_20251104185721_16cd',
          __MeaName__: 'sum(discount)',
          __MeaValue__1: '196.50000000000122',
          __Dim_X__: '2016-01-01',
          __Dim_Color__: 'xA_20251104185721_16cd',
          __Dim_Detail__: 'xA_20251104185721_16cd',
          __Dim_ColorId__: 'xA_20251104185721_16cd'
        },
        {
          yA_20251104185711_61c6: '2016-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '2931056.4149999986',
            xA_20251104185721_16cd: '196.50000000000122',
            yA_20251104185711_61c6: '2016-01-01',
            yA_20251118110617_f8e8: '373011.27499999997',
            yA_20251118110628_29fb: '6710'
          },
          yA_20251118110628_29fb: '6710',
          __MeaId__: 'yA_20251118110628_29fb',
          __MeaName__: 'sum(amount)',
          __MeaValue__1: '6710',
          __Dim_X__: '2016-01-01',
          __Dim_Color__: 'yA_20251118110628_29fb',
          __Dim_Detail__: 'yA_20251118110628_29fb',
          __Dim_ColorId__: 'yA_20251118110628_29fb'
        },
        {
          yA_20251104185711_61c6: '2017-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '3431919.4629999986',
            xA_20251104185721_16cd: '227.9000000000013',
            yA_20251104185711_61c6: '2017-01-01',
            yA_20251118110617_f8e8: '471470.2230000006',
            yA_20251118110628_29fb: '8012'
          },
          xA_20251104185721_16cd: '227.9000000000013',
          __MeaId__: 'xA_20251104185721_16cd',
          __MeaName__: 'sum(discount)',
          __MeaValue__1: '227.9000000000013',
          __Dim_X__: '2017-01-01',
          __Dim_Color__: 'xA_20251104185721_16cd',
          __Dim_Detail__: 'xA_20251104185721_16cd',
          __Dim_ColorId__: 'xA_20251104185721_16cd'
        },
        {
          yA_20251104185711_61c6: '2017-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '3431919.4629999986',
            xA_20251104185721_16cd: '227.9000000000013',
            yA_20251104185711_61c6: '2017-01-01',
            yA_20251118110617_f8e8: '471470.2230000006',
            yA_20251118110628_29fb: '8012'
          },
          yA_20251118110628_29fb: '8012',
          __MeaId__: 'yA_20251118110628_29fb',
          __MeaName__: 'sum(amount)',
          __MeaValue__1: '8012',
          __Dim_X__: '2017-01-01',
          __Dim_Color__: 'yA_20251118110628_29fb',
          __Dim_Detail__: 'yA_20251118110628_29fb',
          __Dim_ColorId__: 'yA_20251118110628_29fb'
        },
        {
          yA_20251104185711_61c6: '2018-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '4243539.8599999985',
            xA_20251104185721_16cd: '286.95000000000056',
            yA_20251104185711_61c6: '2018-01-01',
            yA_20251118110617_f8e8: '621943.0',
            yA_20251118110628_29fb: '9901'
          },
          xA_20251104185721_16cd: '286.95000000000056',
          __MeaId__: 'xA_20251104185721_16cd',
          __MeaName__: 'sum(discount)',
          __MeaValue__1: '286.95000000000056',
          __Dim_X__: '2018-01-01',
          __Dim_Color__: 'xA_20251104185721_16cd',
          __Dim_Detail__: 'xA_20251104185721_16cd',
          __Dim_ColorId__: 'xA_20251104185721_16cd'
        },
        {
          yA_20251104185711_61c6: '2018-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '4243539.8599999985',
            xA_20251104185721_16cd: '286.95000000000056',
            yA_20251104185711_61c6: '2018-01-01',
            yA_20251118110617_f8e8: '621943.0',
            yA_20251118110628_29fb: '9901'
          },
          yA_20251118110628_29fb: '9901',
          __MeaId__: 'yA_20251118110628_29fb',
          __MeaName__: 'sum(amount)',
          __MeaValue__1: '9901',
          __Dim_X__: '2018-01-01',
          __Dim_Color__: 'yA_20251118110628_29fb',
          __Dim_Detail__: 'yA_20251118110628_29fb',
          __Dim_ColorId__: 'yA_20251118110628_29fb'
        },
        {
          yA_20251104185711_61c6: '2019-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '5462438.386999988',
            xA_20251104185721_16cd: '348.34999999999803',
            yA_20251104185711_61c6: '2019-01-01',
            yA_20251118110617_f8e8: '681114.4269999989',
            yA_20251118110628_29fb: '12911'
          },
          xA_20251104185721_16cd: '348.34999999999803',
          __MeaId__: 'xA_20251104185721_16cd',
          __MeaName__: 'sum(discount)',
          __MeaValue__1: '348.34999999999803',
          __Dim_X__: '2019-01-01',
          __Dim_Color__: 'xA_20251104185721_16cd',
          __Dim_Detail__: 'xA_20251104185721_16cd',
          __Dim_ColorId__: 'xA_20251104185721_16cd'
        },
        {
          yA_20251104185711_61c6: '2019-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '5462438.386999988',
            xA_20251104185721_16cd: '348.34999999999803',
            yA_20251104185711_61c6: '2019-01-01',
            yA_20251118110617_f8e8: '681114.4269999989',
            yA_20251118110628_29fb: '12911'
          },
          yA_20251118110628_29fb: '12911',
          __MeaId__: 'yA_20251118110628_29fb',
          __MeaName__: 'sum(amount)',
          __MeaValue__1: '12911',
          __Dim_X__: '2019-01-01',
          __Dim_Color__: 'yA_20251118110628_29fb',
          __Dim_Detail__: 'yA_20251118110628_29fb',
          __Dim_ColorId__: 'yA_20251118110628_29fb'
        }
      ],
      '2': [
        {
          yA_20251104185711_61c6: '2016-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '2931056.4149999986',
            xA_20251104185721_16cd: '196.50000000000122',
            yA_20251104185711_61c6: '2016-01-01',
            yA_20251118110617_f8e8: '373011.27499999997',
            yA_20251118110628_29fb: '6710'
          },
          yA_20251118110617_f8e8: '373011.27499999997',
          __MeaId__: 'yA_20251118110617_f8e8',
          __MeaName__: 'sum(profit)',
          __MeaValue__2: '373011.27499999997',
          __Dim_X__: '2016-01-01',
          __Dim_Color__: 'yA_20251118110617_f8e8',
          __Dim_Detail__: 'yA_20251118110617_f8e8',
          __Dim_ColorId__: 'yA_20251118110617_f8e8'
        },
        {
          yA_20251104185711_61c6: '2017-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '3431919.4629999986',
            xA_20251104185721_16cd: '227.9000000000013',
            yA_20251104185711_61c6: '2017-01-01',
            yA_20251118110617_f8e8: '471470.2230000006',
            yA_20251118110628_29fb: '8012'
          },
          yA_20251118110617_f8e8: '471470.2230000006',
          __MeaId__: 'yA_20251118110617_f8e8',
          __MeaName__: 'sum(profit)',
          __MeaValue__2: '471470.2230000006',
          __Dim_X__: '2017-01-01',
          __Dim_Color__: 'yA_20251118110617_f8e8',
          __Dim_Detail__: 'yA_20251118110617_f8e8',
          __Dim_ColorId__: 'yA_20251118110617_f8e8'
        },
        {
          yA_20251104185711_61c6: '2018-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '4243539.8599999985',
            xA_20251104185721_16cd: '286.95000000000056',
            yA_20251104185711_61c6: '2018-01-01',
            yA_20251118110617_f8e8: '621943.0',
            yA_20251118110628_29fb: '9901'
          },
          yA_20251118110617_f8e8: '621943.0',
          __MeaId__: 'yA_20251118110617_f8e8',
          __MeaName__: 'sum(profit)',
          __MeaValue__2: '621943.0',
          __Dim_X__: '2018-01-01',
          __Dim_Color__: 'yA_20251118110617_f8e8',
          __Dim_Detail__: 'yA_20251118110617_f8e8',
          __Dim_ColorId__: 'yA_20251118110617_f8e8'
        },
        {
          yA_20251104185711_61c6: '2019-01-01',
          __OriginalData__: {
            xA_20251104185715_0c08: '5462438.386999988',
            xA_20251104185721_16cd: '348.34999999999803',
            yA_20251104185711_61c6: '2019-01-01',
            yA_20251118110617_f8e8: '681114.4269999989',
            yA_20251118110628_29fb: '12911'
          },
          yA_20251118110617_f8e8: '681114.4269999989',
          __MeaId__: 'yA_20251118110617_f8e8',
          __MeaName__: 'sum(profit)',
          __MeaValue__2: '681114.4269999989',
          __Dim_X__: '2019-01-01',
          __Dim_Color__: 'yA_20251118110617_f8e8',
          __Dim_Detail__: 'yA_20251118110617_f8e8',
          __Dim_ColorId__: 'yA_20251118110617_f8e8'
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
          cellBgColor: 'rgba(0,0,0,0)',
          inlineRowBgColor: 'rgba(0,0,0,0)',
          inlineColumnBgColor: 'rgba(0,0,0,0)'
        }
      },
      rowHeaderStyle: {
        borderColor: '#e3e5eb',
        fontSize: 12,
        color: '#21252c',
        padding: [0, 12, 0, 4],
        bgColor: 'transparent',
        hover: {
          cellBgColor: 'rgba(0,0,0,0)',
          inlineRowBgColor: 'rgba(0,0,0,0)',
          inlineColumnBgColor: 'rgba(0,0,0,0)'
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
          cellBgColor: 'rgba(0,0,0,0)',
          inlineRowBgColor: 'rgba(0,0,0,0)',
          inlineColumnBgColor: 'rgba(0,0,0,0)'
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
          cellBgColor: 'rgba(0,0,0,0)'
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
          cellBgColor: 'rgba(0,0,0,0)'
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
          cellBgColor: 'rgba(0,0,0,0)'
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
          cellBgColor: 'rgba(0,0,0,0)'
        }
      },
      bottomFrozenStyle: {
        borderColor: '#e3e5eb',
        borderLineWidth: [1, 0, 0, 1],
        bgColor: 'transparent',
        hover: {
          cellBgColor: 'rgba(0,0,0,0)'
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
    legends: {
      padding: 0,
      visible: true,
      type: 'discrete',
      orient: 'top',
      position: 'end',
      maxCol: 1,
      maxRow: 1,
      data: [
        {
          label: 'xA_20251104185715_0c08',
          shape: {
            outerBorder: {
              stroke: '#7E5DFF',
              distance: 3,
              lineWidth: 1
            },
            fill: '#7E5DFF'
          }
        },
        {
          label: 'xA_20251104185721_16cd',
          shape: {
            outerBorder: {
              stroke: '#BCB5D6',
              distance: 3,
              lineWidth: 1
            },
            fill: '#BCB5D6'
          }
        },
        {
          label: 'yA_20251118110628_29fb',
          shape: {
            outerBorder: {
              stroke: '#5B5F89',
              distance: 3,
              lineWidth: 1
            },
            fill: '#5B5F89'
          }
        },
        {
          label: 'yA_20251118110617_f8e8',
          shape: {
            outerBorder: {
              stroke: '#80E1D9',
              distance: 3,
              lineWidth: 1
            },
            fill: '#80E1D9'
          }
        }
      ],
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
  tableInstance.onVChartEvent('click', args => {
    console.log('onVChartEvent click', args);
  });
  tableInstance.onVChartEvent('mouseover', args => {
    console.log('onVChartEvent mouseover', args);
  });
  window.tableInstance = tableInstance;

  // bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

  window.update = () => {
    theme.cornerLeftBottomCellStyle.borderColor = 'red';
    tableInstance.updateTheme(theme);
  };
}
