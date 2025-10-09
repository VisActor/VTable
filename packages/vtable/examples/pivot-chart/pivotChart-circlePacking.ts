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
        type: 'circlePacking',
        categoryField: 'name',
        valueField: 'value',
        circlePacking: {
          style: {
            fillOpacity: d => (d.isLeaf ? 0.75 : 0.25)
          }
        },
        layoutPadding: 5,
        label: {
          style: {
            fontSize: 10,
            visible: d => {
              return d.depth === 1;
            }
          }
        },
        data: { id: 'data1' }
      }
    }
  ];
  const records = [
    {
      city: '北京',
      category: '办公用品',
      name: 'root',
      children: [
        {
          name: 'Country A',
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
        }
      ]
    },
    {
      city: '北京',
      category: '电子产品',
      name: 'root',
      children: [
        {
          name: 'Country A',
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
            }
          ]
        }
      ]
    },
    {
      city: '上海',
      category: '办公用品',
      name: 'root',
      children: [
        {
          name: 'Country A',
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
        }
      ]
    },
    {
      city: '北京',
      category: '电子产品',
      name: 'root',
      children: [
        {
          name: 'Country A',
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
        }
      ]
    },
    {
      city: '北京',
      category: '家具',
      name: 'root',
      children: [
        {
          name: 'Country A',
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
        }
      ]
    },
    {
      city: '北京',
      category: '家具',
      name: 'root',
      children: [
        {
          name: 'Country A',
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
        }
      ]
    },
    {
      city: '北京',
      category: '家具',
      name: 'root',
      children: [
        {
          name: 'Country A',
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
        }
      ]
    },
    {
      city: '北京',
      category: '家具',
      name: 'root',
      children: [
        {
          name: 'Country A',
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
        }
      ]
    },

    {
      city: '上海',
      category: '电子产品',
      name: 'root',
      children: [
        {
          name: 'Country A',
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
        }
      ]
    },
    {
      city: '上海',
      category: '电子产品',
      name: 'physics',
      children: [
        { name: 'DragForce', value: 1082 },
        { name: 'GravityForce', value: 1336 },
        { name: 'IForce', value: 319 },
        { name: 'NBodyForce', value: 10498 },
        { name: 'Particle', value: 2822 },
        { name: 'Simulation', value: 9983 },
        { name: 'Spring', value: 2213 },
        { name: 'SpringForce', value: 1681 }
      ]
    },
    {
      city: '上海',
      category: '家具',
      name: 'root',
      children: [
        {
          name: 'Country A',
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
        }
      ]
    },
    {
      city: '上海',
      category: '家具',
      name: 'root',
      children: [
        {
          name: 'Country A',
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
        }
      ]
    }
  ];
  const option: VTable.PivotChartConstructorOptions = {
    rows,
    columns,
    indicators,
    hideIndicatorName: true,
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
