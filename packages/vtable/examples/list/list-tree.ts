import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option = {
    records: [
      {
        item: '项目1',
        id: 'PARA.206',
        collapse: false,
        remark: {},
        children: [
          {
            item: '项目1-1',
            id: 'PARA.207',
            collapse: false,
            remark: {},
            '2023-11-20 07:30:00': `豫章故郡，洪都新府。星分翼轸，地接衡庐。襟三江而带五湖，控蛮荆而引瓯越。物华天宝，龙
              光射牛斗之。`
          }
        ]
      },
      {
        item: '项目2',
        id: 'PARA.206',
        collapse: false,
        remark: {},
        children: [
          {
            item: '项目2-1',
            id: 'PARA.207',
            collapse: false,
            remark: {},
            '2023-11-20 07:30:00': 111
          },
          {
            item: '项目2-2',
            id: 'PARA.207',
            collapse: false,
            remark: {},
            '2023-11-20 07:30:00': 111
          },
          {
            item: '项目2-3',
            id: 'PARA.207',
            collapse: false,
            remark: {},
            '2023-11-20 07:30:00': 111,
            children: [
              {
                item: '项目2-3-1',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目2-3-2',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目2-3-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              },
              {
                item: '项目6-3-3',
                id: 'PARA.207',
                collapse: false,
                remark: {},
                '2023-11-20 07:30:00': 111
              }
            ]
          }
        ]
      },
      {
        item: '项目7',
        id: 'PARA.207',
        collapse: false,
        remark: {},
        '2023-11-20 07:30:00': 111,
        children: [
          {
            item: '项目7-1',
            id: 'PARA.207',
            collapse: false,
            remark: {},
            '2023-11-20 07:30:00': 111
          }
        ]
      }
    ],
    columns: [
      {
        field: 'item',
        title: '项目',
        width: 286,
        disableColumnResize: true,
        tree: true,
        style: {
          fontSize: 14,
          fontFamily: 'Microsoft YaHei'
        }
      },
      {
        field: '2023-11-20 07:30:00',
        title: '11-20 07:30',
        disableColumnResize: true,
        customRender(args) {
          const { col, row, table } = args;
          const { width, height } = args.rect;
          const elements = [
            {
              type: 'rect',
              fill: '#D4FAE6',
              x: 0,
              y: args.table.autoWrapText ? 0 : 3,
              width,
              height: height - 6
            }
          ];
          return { elements, renderDefault: true };
        }
      }
    ],
    frozenColCount: 1,
    defaultRowHeight: 30,
    defaultColWidth: 200,
    heightMode: 'autoHeight',
    defaultHeaderRowHeight: 48,
    showFrozenIcon: false,
    autoWrapText: true,
    hover: {
      highlightMode: 'cross'
    },
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    menu: {},
    container: {},
    transpose: false
  };

  const instance = new ListTable(document.getElementById(CONTAINER_ID), option);

  // 展开树节点
  function expandingTree(record) {
    if (!record || !record.length) {
      return;
    }
    let num = 0;
    const expand = node => {
      node.children?.forEach(child => {
        num += 1;
        if (node.fatherCollapse) {
          child.fatherCollapse = true;
        }
        if (!child.collapse && child.children?.length && !child.fatherCollapse) {
          instance.toggleHierarchyState(0, num);
        }
        if ((child.collapse || child.fatherCollapse) && child.children?.length) {
          num -= child.children.length;
        }
        expand(child);
      });
    };
    record.forEach(item => {
      num += 1;
      if (!item.collapse && item.children?.length) {
        instance.toggleHierarchyState(0, num);
      }
      if (item.collapse && item.children?.length) {
        num -= item.children.length;
      }
      if (item.collapse) {
        item.fatherCollapse = true;
      }
      expand(item);
    });
  }

  expandingTree(option.records);

  window.tableInstance = instance;
  bindDebugTool(instance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

  const { TREE_HIERARCHY_STATE_CHANGE } = VTable.ListTable.EVENT_TYPE;
  instance.on(TREE_HIERARCHY_STATE_CHANGE, args => {
    // TODO 调用接口插入设置子节点的数据
    if (args.hierarchyState === VTable.TYPES.HierarchyState.expand && !Array.isArray(args.originData.children)) {
      const record = args.originData;
      setTimeout(() => {
        const children = [
          {
            类别: record['类别'] + ' - 分类1', // 对应原子类别
            销售额: 2,
            数量: 5,
            利润: 4
          },
          {
            类别: record['类别'] + ' - 分类2', // 对应原子类别
            销售额: 3,
            数量: 8,
            利润: 5
          },
          {
            类别: record['类别'] + ' - 分类3（懒加载）',
            销售额: 4,
            数量: 20,
            利润: 90.704,
            children: true
          },
          {
            类别: record['类别'] + ' - 分类4', // 对应原子类别
            销售额: 5,
            数量: 6,
            利润: 7
          }
        ];
        instance.setRecordChildren(children, args.col, args.row);
      }, 200);
    }
  });

  window.tableInstance = instance;
}
