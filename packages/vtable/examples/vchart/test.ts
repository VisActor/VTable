/* eslint-disable */
import VChart from '@visactor/vchart';
const CONTAINER_ID = 'vTable';

export function createTable() {
  const spec = {
    type: 'common',
    axes: [
      {
        range: {
          min: 0,
          max: 1676224.1276245117
        },
        id: 'main-0',
        type: 'linear',
        tick: {
          visible: false,
          style: {
            stroke: '#f5222d'
          }
        },
        niceType: 'accurateFirst',
        grid: {
          visible: false,
          style: {
            stroke: '#f5222d',
            lineWidth: 5,
            lineDash: [5, 5]
          }
        },
        orient: 'left',
        visible: true,
        domainLine: {
          visible: false,
          style: {
            lineWidth: 1,
            stroke: '#f5222d'
          }
        },
        title: {
          visible: false,
          text: '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          style: {
            fontSize: 10,
            fill: '#f5222d',
            fontWeight: 'normal'
          }
        },
        label: {
          visible: false,
          style: {
            fontSize: 14,
            fill: '#f5222d',
            angle: 0,
            fontWeight: 'normal'
          }
        },
        hover: false,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        zero: true,
        sync: {
          axisId: 'NO_AXISID_FRO_VTABLE',
          zeroAlign: true,
          tickAlign: true
        },
        seriesIndex: 0,
        width: -1
      },
      {
        range: {
          min: 0,
          max: 199582.20107278973
        },
        id: 'sub-0',
        type: 'linear',
        tick: {
          visible: false,
          style: {
            stroke: '#f5222d'
          }
        },
        niceType: 'accurateFirst',
        grid: {
          visible: false,
          style: {
            stroke: '#f5222d',
            lineWidth: 5,
            lineDash: [5, 5]
          }
        },
        orient: 'right',
        visible: true,
        domainLine: {
          visible: false,
          style: {
            lineWidth: 1,
            stroke: '#f5222d'
          }
        },
        title: {
          visible: false,
          text: '利润',
          style: {
            fontSize: 10,
            fill: '#f5222d',
            fontWeight: 'normal'
          }
        },
        label: {
          visible: false,
          style: {
            fontSize: 14,
            fill: '#f5222d',
            angle: 0,
            fontWeight: 'normal'
          }
        },
        hover: false,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        zero: true,
        sync: {
          axisId: 'NO_AXISID_FRO_VTABLE',
          zeroAlign: true,
          tickAlign: true
        },
        seriesIndex: 1,
        width: -1
      },
      {
        domain: ['西南', '中南', '东北', '华北', '西北', '华东'],
        type: 'band',
        orient: 'bottom',
        visible: true,
        label: {
          visible: false,
          space: 0
        },
        domainLine: {
          visible: false
        },
        tick: {
          visible: false
        },
        subTick: {
          visible: false
        },
        title: {
          visible: false
        },
        height: -1
      }
    ],
    zeroAlign: true,
    series: [
      {
        type: 'bar',
        yField: '010011',
        xField: ['230804193430032'],
        stack: false,
        direction: 'vertical',
        data: {
          sortIndex: 0,
          id: 'main-data',
          fields: {
            '10001': {
              alias: '指标名称 ',
              type: 'ordinal'
            },
            '20001': {
              alias: '图例项 ',
              domain: ['超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额', '利润'],
              lockStatisticsByDomain: true,
              type: 'ordinal',
              _domainCache: {
                超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额: 0,
                利润: 1
              }
            },
            '010011': {
              alias: '指标值(主轴) ',
              type: 'ordinal'
            },
            '010012': {
              alias: '指标值(次轴) ',
              type: 'ordinal'
            },
            '230804193430032': {
              alias: '地区',
              sortIndex: 0,
              type: 'ordinal'
            },
            '230808211907009': {
              alias: '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
              type: 'ordinal'
            },
            '230810114507017': {
              alias: '利润',
              type: 'ordinal'
            },
            '230810115400021': {
              alias: '类别',
              type: 'ordinal'
            }
          }
        },
        seriesField: '20001'
      },
      {
        type: 'line',
        yField: '010012',
        xField: ['230804193430032'],
        label: {
          visible: true,
          overlap: {
            hideOnHit: true,
            clampForce: true
          },
          style: {
            fontSize: 12,
            fontWeight: 'normal',
            fill: '#363839',
            stroke: 'rgba(255, 255, 255, 0.8)',
            lineWidth: 2,
            strokeOpacity: 1
          },
          position: 'outside',
          smartInvert: false
        },
        stack: false,
        direction: 'vertical',
        data: {
          sortIndex: 0,
          id: 'sub-data',
          fields: {
            '10001': {
              alias: '指标名称 ',
              type: 'ordinal'
            },
            '20001': {
              alias: '图例项 ',
              domain: ['超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额', '利润'],
              lockStatisticsByDomain: true,
              type: 'ordinal',
              _domainCache: {
                超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额: 0,
                利润: 1
              }
            },
            '010011': {
              alias: '指标值(主轴) ',
              type: 'ordinal'
            },
            '010012': {
              alias: '指标值(次轴) ',
              type: 'ordinal'
            },
            '230804193430032': {
              alias: '地区',
              sortIndex: 0,
              type: 'ordinal'
            },
            '230808211907009': {
              alias: '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
              type: 'ordinal'
            },
            '230810114507017': {
              alias: '利润',
              type: 'ordinal'
            },
            '230810115400021': {
              alias: '类别',
              type: 'ordinal'
            }
          }
        },
        seriesField: '20001'
      }
    ],
    color: {
      type: 'ordinal',
      range: ['#2E62F1', '#4DC36A'],
      domain: ['超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额', '利润']
    },
    tooltip: {
      visible: false
    },
    padding: 0,
    dataZoom: []
  };
  const vchart = new VChart(spec, { dom: CONTAINER_ID });
  vchart.renderSync();
  // vchart.renderAsync();
  window['vchart'] = vchart;

  const datas = [
    {
      id: 'main-data',
      values: [
        {
          '10001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '10003': '230808211907009',
          '20001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '010011': '316212.42824935913',
          '230804193430032': '西北',
          '230808211907009': '316212.42824935913',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 0,
          __VCHART_DEFAULT_DATA_KEY: 0,
          VGRAMMAR_DATA_ID_KEY_47: 0
        },
        {
          '10001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '10003': '230808211907009',
          '20001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '010011': '919743.9351348877',
          '230804193430032': '华北',
          '230808211907009': '919743.9351348877',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 1,
          __VCHART_DEFAULT_DATA_KEY: 1,
          VGRAMMAR_DATA_ID_KEY_47: 1
        },
        {
          '10001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '10003': '230808211907009',
          '20001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '010011': '1676224.1276245117',
          '230804193430032': '华东',
          '230808211907009': '1676224.1276245117',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 2,
          __VCHART_DEFAULT_DATA_KEY: 2,
          VGRAMMAR_DATA_ID_KEY_47: 2
        },
        {
          '10001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '10003': '230808211907009',
          '20001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '010011': '920698.4041175842',
          '230804193430032': '东北',
          '230808211907009': '920698.4041175842',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 3,
          __VCHART_DEFAULT_DATA_KEY: 3,
          VGRAMMAR_DATA_ID_KEY_47: 3
        },
        {
          '10001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '10003': '230808211907009',
          '20001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '010011': '501533.7320175171',
          '230804193430032': '西南',
          '230808211907009': '501533.7320175171',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 4,
          __VCHART_DEFAULT_DATA_KEY: 4,
          VGRAMMAR_DATA_ID_KEY_47: 4
        },
        {
          '10001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '10003': '230808211907009',
          '20001': '超级长的销售额超级长的销售额超级长的销售额超级长的销售额超级长的销售额',
          '010011': '1399928.2008514404',
          '230804193430032': '中南',
          '230808211907009': '1399928.2008514404',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 5,
          __VCHART_DEFAULT_DATA_KEY: 5,
          VGRAMMAR_DATA_ID_KEY_47: 5
        }
      ]
    },
    {
      id: 'sub-data',
      values: [
        {
          '10001': '利润',
          '10003': '230810114507017',
          '20001': '利润',
          '010012': '24903.787846319377',
          '230804193430032': '西北',
          '230810114507017': '24903.787846319377',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 0,
          __VCHART_DEFAULT_DATA_KEY: 0,
          VGRAMMAR_DATA_ID_KEY_52: 0
        },
        {
          '10001': '利润',
          '10003': '230810114507017',
          '20001': '利润',
          '010012': '148800.47773075104',
          '230804193430032': '华北',
          '230810114507017': '148800.47773075104',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 1,
          __VCHART_DEFAULT_DATA_KEY: 1,
          VGRAMMAR_DATA_ID_KEY_52: 1
        },
        {
          '10001': '利润',
          '10003': '230810114507017',
          '20001': '利润',
          '010012': '163453.42999391258',
          '230804193430032': '华东',
          '230810114507017': '163453.42999391258',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 2,
          __VCHART_DEFAULT_DATA_KEY: 2,
          VGRAMMAR_DATA_ID_KEY_52: 2
        },
        {
          '10001': '利润',
          '10003': '230810114507017',
          '20001': '利润',
          '010012': '72692.64069590718',
          '230804193430032': '东北',
          '230810114507017': '72692.64069590718',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 3,
          __VCHART_DEFAULT_DATA_KEY: 3,
          VGRAMMAR_DATA_ID_KEY_52: 3
        },
        {
          '10001': '利润',
          '10003': '230810114507017',
          '20001': '利润',
          '010012': '29303.0919713974',
          '230804193430032': '西南',
          '230810114507017': '29303.0919713974',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 4,
          __VCHART_DEFAULT_DATA_KEY: 4,
          VGRAMMAR_DATA_ID_KEY_52: 4
        },
        {
          '10001': '利润',
          '10003': '230810114507017',
          '20001': '利润',
          '010012': '199582.20107278973',
          '230804193430032': '中南',
          '230810114507017': '199582.20107278973',
          '230810115400021': '家具',
          __VCHART_DEFAULT_DATA_INDEX: 5,
          __VCHART_DEFAULT_DATA_KEY: 5,
          VGRAMMAR_DATA_ID_KEY_52: 5
        }
      ]
    }
  ];
  vchart.updateFullDataSync(datas);
  // window['updateData'] = () => {
  // }
}
