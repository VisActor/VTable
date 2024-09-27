import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const newData = [];
    data.forEach(v => {
      v.descD = Math.floor(Math.random() * 1000) + 1;
      v.desc = Math.floor(Math.random() * 1000) + 1;
      v.descc = 'descc';
      newData.push(v);
    });
    newData.push({
      Region: 'Central',
      Category: 'Furniture',
      descc: '111',
      desc: 'descD',
      descD: '222',
      'Sub-Category': 'Chairs',
      'Order Year': '2015',
      Segment: 'Consumer',
      'Ship Mode': 'First Class'
    });
    const option = {
      records: newData,
      rows: [
        {
          dimensionKey: 'Category',
          title: 'Category',
          headerStyle: {
            textStick: true,
            bgColor(arg) {
              if (arg.dataValue === 'Row Totals') {
                return '#a5b7fc';
              }
              return '#ECF1F5';
            }
          },
          width: 'auto'
        },
        {
          dimensionKey: 'Sub-Category',
          title: 'Sub-Catogery',
          headerStyle: {
            textStick: true,
            bgColor(arg) {
              if (arg.dataValue === 'Sub Totals') {
                return '#d2dcff';
              }
              return '#ECF1F5';
            }
          },
          width: 'auto'
        }
      ],
      columnTree: [
        {
          dimensionKey: 'Segment-1',
          value: 'Segment-1 (virtual-node)',
          virtual: true,
          children: [
            {
              dimensionKey: 'Segment',
              value: 'Consumer',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity'
                }
              ]
            }
          ]
        },
        {
          dimensionKey: 'descc',
          value: 'descc',
          virtual: true,
          children: [
            {
              indicatorKey: 'desc',
              value: 'desc'
            }
          ]
        }
      ],
      indicators: [
        {
          indicatorKey: 'Quantity',
          title: 'Quantity',
          width: 'auto',
          showSort: false
        },
        {
          indicatorKey: 'desc',
          title: 'desc',
          width: 'auto',
          showSort: false
        }
      ],
      dataConfig: {
        aggregationRules: [
          //做聚合计算的依据，如销售额如果没有配置则默认按聚合sum计算结果显示单元格内容
          {
            indicatorKey: 'desc', //指标名称
            field: 'desc', //指标依据字段
            aggregationType: VTable.TYPES.AggregationType.NONE //计算类型
          }
        ]
      },
      corner: {
        titleOnDimension: 'row'
      },
      theme: VTable.themes.DEFAULT.extends({
        headerStyle: {
          bgColor: '#5071f9',
          color(args) {
            if (
              (args.cellHeaderPaths.colHeaderPaths?.length === 1 && args.cellHeaderPaths.colHeaderPaths[0].virtual) ||
              (args.cellHeaderPaths.colHeaderPaths?.length === 2 && args.cellHeaderPaths.colHeaderPaths[1].virtual)
            ) {
              return 'red';
            }
            return '#fff';
          }
        },
        cornerHeaderStyle: {
          bgColor: '#5071f9',
          color: '#fff'
        }
      }),
      supplementIndicatorNodes: false,
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = tableInstance;

    bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
  })
  .catch(e => {
    console.error(e);
  });
