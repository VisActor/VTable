import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option = {
    records: [],
    rows: [
      {
        dimensionKey: 'DATA_TYPE',
        title: '数据类型',
        width: 'auto',
        minWidth: 100,
        sort: true,
        showSort: false,
        showSortInCorner: false,
        headerStyle: {
          textStick: false,
          fontSize: 12,
          color: 'rgba(17, 25, 37, 0.85)'
        }
      }
    ],
    rowTree: [
      {
        dimensionKey: 'DATA_TYPE',
        value: '测试1'
      },
      {
        dimensionKey: 'DATA_TYPE',
        value: '测试2'
      }
    ],
    extensionRows: [
      {
        rows: [
          {
            dimensionKey: 'dim_0f3fd7af',
            title: 'test1/test2',
            width: 'auto',
            minWidth: 100,
            sort: true,
            showSort: false,
            showSortInCorner: false,
            headerStyle: {
              textStick: false,
              fontSize: 12,
              color: 'rgba(17, 25, 37, 0.85)'
            }
          },
          {
            dimensionKey: 'dim_6dd5f4b5',
            title: 'test2',
            width: 'auto',
            minWidth: 100,
            sort: true,
            showSort: false,
            showSortInCorner: false,
            headerStyle: {
              textStick: false,
              fontSize: 12,
              color: 'rgba(17, 25, 37, 0.85)'
            }
          }
        ],
        rowTree: [
          {
            dimensionKey: 'dim_0f3fd7af',
            value: 'value1',
            children: [
              {
                dimensionKey: 'dim_6dd5f4b5',
                value: 'value1-1',
                children: [],
                hierarchyState: 'expand'
              },
              {
                dimensionKey: 'dim_6dd5f4b5',
                value: 'value1-2',
                children: [],
                hierarchyState: 'expand'
              },
              {
                dimensionKey: 'dim_6dd5f4b5',
                value: 'value1-3',
                children: [],
                hierarchyState: 'expand'
              }
            ],
            hierarchyState: 'expand'
          },
          {
            dimensionKey: 'dim_0f3fd7af',
            value: 'value2',
            children: [
              {
                dimensionKey: 'dim_6dd5f4b5',
                value: 'value2-1',
                children: [],
                hierarchyState: 'expand'
              }
            ],
            hierarchyState: 'expand'
          },

          {
            dimensionKey: 'dim_0f3fd7af',
            value: '列小计',
            children: []
          }
        ]
      }
    ],
    indicators: [
      {
        indicatorKey: 'DATE_DIM_0_0',
        title: '2025-03',
        width: 'auto',
        sort: true,
        showSort: true,
        headerStyle: {
          fontWeight: 'normal',
          color: 'rgba(17, 25, 37, 0.85)'
        },
        style: {
          textAlign: 'right',
          padding: [8, 12, 8, 12],
          fontSize: 12
        }
      }
    ],
    frozenColCount: 3,
    rowExpandLevel: null,
    rowHierarchyType: 'tree',
    rowHierarchyIndent: 12,
    rowHierarchyTextStartAlignment: true,
    defaultRowHeight: 28,
    defaultHeaderRowHeight: 34,
    autoFillWidth: true
  };

  const instance = new PivotTable(document.getElementById(CONTAINER_ID)!, option);

  instance.on('click_cell', params => {
    console.log(
      'params',
      params,
      instance.getCellHeaderPaths(params.col, params.row),
      instance.getCellAddressByHeaderPaths({
        colHeaderPaths: params.cellHeaderPaths.colHeaderPaths,
        rowHeaderPaths: params.cellHeaderPaths.rowHeaderPaths
      })
    );
  });

  window.tableInstance = instance;

  bindDebugTool(instance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
}
