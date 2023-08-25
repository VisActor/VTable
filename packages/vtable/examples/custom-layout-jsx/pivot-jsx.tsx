/* eslint-disable */
// @ts-ignore
import React from 'react';
import * as VTable from '../../src';
import { VGroup, VSymbol, VRect, VImage, VText, VTag, jsx } from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
import { IconPosition } from '../../src/ts-types';
import { bearImageUrl, birdImageUrl, catImageUrl, flowerImageUrl, rabbitImageUrl, wolfImageUrl } from '../resource-url';
import { supermarketJson } from '../resource-url/json';
const PivotTable = VTable.PivotTable;
const Table_CONTAINER_DOM_ID = 'vTable';

const collapseRight = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M5.81235 11.3501C5.48497 11.612 5 11.3789 5 10.9597L5 5.04031C5 4.62106 5.48497 4.38797 5.81235 4.64988L9.51196 7.60957C9.76216 7.80973 9.76216 8.19027 9.51196 8.39044L5.81235 11.3501Z" fill="#141414" fill-opacity="0.65"/>
      </svg>`;
const collapseDown = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M4.64988 6.81235C4.38797 6.48497 4.62106 6 5.04031 6L10.9597 6C11.3789 6 11.612 6.48497 11.3501 6.81235L8.39043 10.512C8.19027 10.7622 7.80973 10.7622 7.60957 10.512L4.64988 6.81235Z" fill="#141414" fill-opacity="0.65"/>
</svg>`;

export function createTable() {
  fetch(supermarketJson)
    .then(res => res.json())
    .then(data => {
      registerIcon();
      const records = data;
      const option: VTable.PivotTableConstructorOptions = {
        columnTree: [
          {
            dimensionKey: '220524114340020',
            value: '东北',
            children: [
              {
                dimensionKey: '220524114340031',
                value: '黑龙江',
                children: [
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '吉林',
                children: [
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '辽宁',
                children: [
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              }
            ]
          },
          {
            dimensionKey: '220524114340020',
            value: '华北',
            children: [
              {
                dimensionKey: '220524114340031',
                value: '内蒙古',
                children: [
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '北京',
                children: [
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '天津',
                children: [
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              }
            ]
          },
          {
            dimensionKey: '220524114340020',
            value: '中南',
            children: [
              {
                dimensionKey: '220524114340031',
                value: '广东',
                children: [
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '广西',
                children: [
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '湖南',
                children: [
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '1111',
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              }
            ]
          }
        ],
        rowTree: [
          {
            dimensionKey: '220524114340021',
            value: '办公用品',
            // hierarchyState: 'collapse',
            children: [
              {
                dimensionKey: '220524114340022',
                value: '公司',
                // hierarchyState: 'expand',//设置默认展开
                children: [
                  {
                    dimensionKey: '220524114340023',
                    value: '一级'
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: '二级'
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: '三级'
                  }
                ]
              },
              {
                dimensionKey: '220524114340022',
                value: '消费者',
                children: [
                  {
                    dimensionKey: '220524114340023',
                    value: '一级'
                    // hierarchyState: 'expand',
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: '二级'
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: '三级'
                  }
                ]
              },
              {
                dimensionKey: '220524114340022',
                value: '小型企业',
                children: [
                  {
                    dimensionKey: '220524114340024',
                    value: '纸张'
                    // hierarchyState: 'expand',
                  },
                  {
                    dimensionKey: '220524114340024',
                    value: '打印机'
                  },
                  {
                    dimensionKey: '220524114340024',
                    value: '电脑'
                  }
                ]
              }
            ]
          },
          {
            dimensionKey: '220524114340021',
            //dimensionTitle: '220524114340021',
            value: '家具',
            hierarchyState: VTable.TYPES.HierarchyState.collapse,
            children: [
              {
                dimensionKey: '220524114340022',
                value: '公司'
                // hierarchyState: 'expand',
              },
              {
                dimensionKey: '220524114340022',
                value: '消费者'
              },
              {
                dimensionKey: '220524114340022',
                value: '小型企业'
              }
            ]
          },
          {
            dimensionKey: '220524114340021',
            //dimensionTitle: '220524114340021',
            value: '餐饮',
            hierarchyState: VTable.TYPES.HierarchyState.collapse,
            children: [
              {
                dimensionKey: '220524114340022',
                value: '公司'
                // hierarchyState: 'expand',
              },
              {
                dimensionKey: '220524114340022',
                value: '消费者'
              },
              {
                dimensionKey: '220524114340022',
                value: '小型企业'
              }
            ]
          },
          {
            dimensionKey: '220524114340021',
            //dimensionTitle: '220524114340021',
            value: '技术',
            hierarchyState: VTable.TYPES.HierarchyState.collapse,
            children: [
              {
                dimensionKey: '220524114340022',
                value: '公司'
                // hierarchyState: 'expand',
              },
              {
                dimensionKey: '220524114340022',
                value: '消费者'
              },
              {
                dimensionKey: '220524114340022',
                value: '小型企业'
              }
            ]
          }
        ],
        columns: [
          {
            dimensionKey: '220524114340021',
            dimensionTitle: '类别-细分',
            // headerFormat(value) {
            //   return ``;
            // },

            width: 'auto',
            minWidth: 300,
            headerStyle: {
              // cursor: 'help',
              textAlign: 'center',
              // borderColor: 'blue',
              // color: 'purple',
              // textBaseline: 'top',
              textStick: true
              // bgColor: '#6cd26f',
            },
            headerCustomLayout: customLayout
          },
          {
            dimensionKey: '220524114340022',
            dimensionTitle: '细分',
            dragHeader: true,
            headerStyle: {
              textAlign: 'left'
              // color: 'white',
              // bgColor: '#33cc99',
            },
            headerCustomLayout: customLayout,
            maxWidth: 400
            // width: 400,
            // headerType: 'MULTILINETEXT',
          }
        ],
        rows: [
          {
            dimensionKey: '220524114340020',
            dimensionTitle: '地区',
            // headerFormat(value) {
            //   return `${value}地区`;
            // },

            headerStyle: {
              textAlign: 'right',
              // borderColor: 'blue',
              // color: 'yellow',
              textStick: true
              // bgColor(arg: VTable.TYPES.StylePropertyFunctionArg) {
              //   if (
              //     (<VTable.TYPES.IPivotGridCellHeaderPaths>(
              //       arg.cellHeaderPaths.colHeaderPaths
              //     ))[0].value === '东北'
              //   )
              //     return '#bd422a';
              //   if (
              //     (<VTable.TYPES.IPivotGridCellHeaderPaths>(
              //       arg.cellHeaderPaths.colHeaderPaths
              //     ))[0].value === '华北'
              //   )
              //     return '#ff9900';
              //   return 'rgba(101, 117, 168, 0.3)';
              // },
            },
            // headerCustomLayout: customLayoutRow,
            // 指标菜单
            dropDownMenu: ['重置表头'],
            // corner菜单
            // cornerDropDownMenu: ['升序排序C', '降序排序C', '冻结列C'],
            drillDown: true,
            dragHeader: true
          },
          {
            dimensionKey: '220524114340031',
            dimensionTitle: '省份',
            dragHeader: false
          },
          {
            dimensionKey: '220524114340023',
            dimensionTitle: '邮寄方式',
            headerStyle: {
              textAlign: 'left',
              // color: 'white',
              // bgColor: '#33ff99',
              padding: [0, 30, 0, 50]
            },
            headerIcon: ['filter'] // to be fixed
            // headerType: 'MULTILINETEXT',
          },
          {
            dimensionKey: '220524114340024',
            dimensionTitle: '子类别',
            headerStyle: {
              textAlign: 'left',
              // color: 'white',
              // bgColor: '#33ff99',
              padding: [0, 30, 0, 50]
            },
            headerIcon: ['filter'] // to be fixed
            // headerType: 'MULTILINETEXT',
          }
        ],
        indicators: [
          {
            indicatorKey: '220524114340013',
            caption: '销售额',
            width: 'auto',
            format(record) {
              // if (rec.rowDimensions[0].value === '东北') return `${rec.dataValue}%`;
              if (!record?.['220524114340013']) return '--';
              return Math.floor(parseFloat(record?.['220524114340013']));
            },
            headerStyle: {
              // color: 'red',
              // bgColor(arg: VTable.TYPES.StylePropertyFunctionArg) {
              //   // if (
              //   //   (<VTable.TYPES.IPivotGridCellHeaderPaths>(
              //   //     arg.cellHeaderPaths.colHeaderPaths
              //   //   ))[0].value === '东北'
              //   // )
              //   //   return '#bd422a';
              //   // if (
              //   //   (<VTable.TYPES.IPivotGridCellHeaderPaths>(
              //   //     arg.cellHeaderPaths.colHeaderPaths
              //   //   ))[0].value === '华北'
              //   // )
              //   //   return '#ff9900';
              //   return 'rgba(101, 117, 168, 0.3)';
              // },
            },
            // headerIcons: ['moreC'],
            dropDownMenu: ['展示数值', '展示色阶']
            // customRender: customRenderIndicator,
            // headerType: 'MULTILINETEXT',
          },
          {
            indicatorKey: '220524114340014',
            caption: '利润',
            format(record) {
              // if (rec.rowDimensions[0].value === '东北') return `${rec.dataValue}%`;
              if (!record?.['220524114340014']) return '--';
              return Math.floor(parseFloat(record?.['220524114340014']));
            },
            width: 'auto',
            headerStyle: {
              // bgColor(arg: VTable.TYPES.StylePropertyFunctionArg) {
              //   // if (
              //   //   (<VTable.TYPES.IPivotGridCellHeaderPaths>(
              //   //     arg.cellHeaderPaths.colHeaderPaths
              //   //   ))[0].value === '东北'
              //   // )
              //   //   return '#bd422a';
              //   // if (
              //   //   (<VTable.TYPES.IPivotGridCellHeaderPaths>(
              //   //     arg.cellHeaderPaths.colHeaderPaths
              //   //   ))[0].value === '华北'
              //   // )
              //   //   return '#ff9900';
              //   return 'rgba(101, 117, 168, 0.3)';
              // },
            },
            // headerIcons: ['moreC'],
            dropDownMenu: ['展示数值', '展示色阶']
            // customRender: customRenderIndicator,
          }
        ],
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            textAlign: 'center',
            // borderColor: 'red',
            // color: 'red',
            underline: true,
            lineHeight: 20
          }
        },
        records,
        theme: VTable.themes.ARCO,
        rowHierarchyType: 'tree',
        rowExpandLevel: 2,
        rowHierarchyIndent: 20,
        defaultHeaderColWidth: 'auto',
        heightMode: 'autoHeight',
        defaultRowHeight: 50,
        select: {
          disableHeaderSelect: true
        },
        dragHeaderMode: 'none'
      };
      const instance = new PivotTable(document.getElementById(Table_CONTAINER_DOM_ID), option);
      bindDebugTool(instance.scenegraph.stage, {
        customGrapicKeys: ['role']
      });
      // 只为了方便控制太调试用，不要拷贝
      window.tableInstance = instance;

      bindEvent(instance);
    });
}

// 注册图标
function registerIcon() {
  VTable.register.icon('moreC', {
    type: 'svg', //指定svg格式图标，其他还支持path，image，font
    svg: '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="12" r="3" fill="#9b9b9b"/><circle cx="24" cy="24" r="3" fill="#9b9b9b"/><circle cx="24" cy="35" r="3" fill="#9b9b9b"/></svg>',
    width: 16,
    height: 16,
    name: 'moreC', //定义图标的名称，在内部会作为缓存的key值
    visibleTime: 'always', // 显示时机， 'always' | 'mouseover_cell' | 'click_cell'
    hover: {
      // 热区大小
      width: 20,
      height: 20,
      bgColor: 'rgba(22,44,66,0.2)'
    },
    positionType: VTable.TYPES.IconPosition.right, // 指定位置，可以在文本的前后，或者在绝对定位在单元格的左侧右侧
    cursor: 'pointer'
    // tooltip: {
    //   // 气泡框，按钮的的解释信息
    //   title: 'cross',
    //   placement: VTable.TYPES.Placement.left,
    // },
  });
}

function customLayout(args: VTable.TYPES.CustomRenderFunctionArg) {
  const { table, value, col, row } = args;
  const { height, width } = args.rect;
  // const width = 300;
  // const height = 100;
  const hierarchyState = table.getHierarchyState(col, row);
  const path = table.internalProps.layoutMap.getCellHeaderPathsWidthTreeNode(col, row);
  const rowPathLength = path.rowHeaderPaths.length;
  const children = path.rowHeaderPaths[rowPathLength - 1].children;
  if (!children) {
    // 根节点指定传入宽高
    return {
      renderDefault: true
    };
  }
  const leftContainerWidth = rowPathLength === 1 ? 30 : 50;
  const container = (
    <VGroup
      attribute={{
        id: 'container',
        width,
        height,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        fill: '#f00',
        opacity: 0.1
      }}
    >
      <VGroup
        attribute={{
          id: 'container-left',
          width: leftContainerWidth,
          height,
          display: 'flex',
          flexDirection: 'column',
          fill: '#f80',
          opacity: 0.1,
          alignItems: 'flex-end'
        }}
      >
        <VImage
          attribute={{
            id: 'hierarchy',
            image: hierarchyState === 'collapse' ? collapseRight : collapseDown,
            width: 18,
            height: 15,
            boundsPadding: [10, 0, 0, 0],
            cursor: 'pointer'
          }}
        ></VImage>
      </VGroup>
      <VGroup
        attribute={{
          id: 'container-middle',
          width: width - leftContainerWidth - 40,
          height,
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          fill: '#f88',
          opacity: 0.1
        }}
      >
        <VGroup
          attribute={{
            id: 'container-middle-top',
            width: width - leftContainerWidth - 40,
            height: 30,
            display: 'flex',
            alignItems: 'flex-end',
            // flexWrap: 'nowrap',
            fill: '#848',
            opacity: 0.1
          }}
        >
          <VText
            attribute={{
              text: value,
              fontSize: rowPathLength === 1 ? 14 : 14,
              fontFamily: 'sans-serif',
              fill: 'black',
              boundsPadding: [0, 0, 5, 0],
              textAlign: 'left',
              textBaseline: 'top'
            }}
          ></VText>
        </VGroup>
        <VGroup
          attribute={{
            id: 'container-middle-bottom',
            width: width - leftContainerWidth - 40,
            height: height - 30,
            display: 'flex',
            // flexWrap: 'nowrap',
            fill: '#088',
            opacity: 0.1
          }}
        >
          <VGroup
            attribute={{
              id: 'container-middle-bottom-left',
              width: 50,
              height: height - 30,
              display: 'flex',
              fill: '#0f8',
              opacity: 0.1,
              justifyContent: 'flex-end'
            }}
          >
            <VText
              attribute={{
                text: '分组',
                fontSize: 12,
                fontFamily: 'sans-serif',
                fill: 'black',
                boundsPadding: [10, 10, 0, 0],
                textAlign: 'left',
                textBaseline: 'top'
              }}
            ></VText>
          </VGroup>
          <VGroup
            attribute={{
              id: 'container-middle-bottom-right',
              width: width - leftContainerWidth - 40 - 50,
              height: height - 30,
              display: 'flex',
              // alignItems: 'center',
              fill: '#008',
              opacity: 0.1
            }}
          >
            {children.map((child, index) => {
              return (
                <VGroup
                  attribute={{
                    id: `tag-group-${index}`,
                    display: 'flex',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    // alignContent: 'center',
                    boundsPadding: [5, 5, 5, 10]
                  }}
                >
                  <VTag
                    attribute={{
                      text: child.value,
                      textStyle: {
                        fontSize: 12,
                        fontFamily: 'sans-serif',
                        fill: 'rgb(51, 101, 238)'
                      },
                      panel: {
                        visible: true,
                        fill: 'rgb(220, 240, 252)',
                        cornerRadius: 5
                      }
                    }}
                  ></VTag>
                  <VImage
                    attribute={{
                      id: `cross-${index}`,
                      width: 10,
                      height: 10,
                      image:
                        '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 11L11 6L24 19L37 6L42 11L29 24L42 37L37 42L24 29L11 42L6 37L19 24L6 11Z" fill="#9b9b9b" stroke="#9b9b9b" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                      boundsPadding: [0, 0, 0, 5],
                      cursor: 'pointer'
                    }}
                  ></VImage>
                </VGroup>
              );
            })}
          </VGroup>
        </VGroup>
      </VGroup>
      <VGroup
        attribute={{
          id: 'container-right',
          width: 40,
          height,
          display: 'flex',
          flexDirection: 'column',
          fill: '#f08',
          opacity: 0.1
        }}
      >
        {rowPathLength === 1 ? (
          <VImage
            attribute={{
              id: 'add',
              image:
                '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 4H18V18H4V30H18V44H30V30H44V18H30V4Z" fill="rgb(51, 101, 238)" stroke="rgb(51, 101, 238)" stroke-width="1" stroke-linejoin="round"/></svg>',
              width: 16,
              height: 16,
              boundsPadding: [12, 0, 0, 5],
              cursor: 'pointer'
            }}
          ></VImage>
        ) : null}
        <VImage
          attribute={{
            id: 'filter',
            image: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1.29609 1C0.745635 1 0.444871 1.64195 0.797169 2.06491L4.64953 6.68988V9.81861C4.64953 9.89573 4.69727 9.9648 4.76942 9.99205L7.11236 10.877C7.27164 10.9372 7.4419 10.8195 7.4419 10.6492V6.68988L11.2239 2.06012C11.5703 1.63606 11.2685 1 10.721 1H1.29609Z" stroke="#141414" stroke-opacity="0.65" stroke-width="1.18463" stroke-linejoin="round"/>
          </svg>`,
            width: 16,
            height: 16,
            boundsPadding: [8, 0, 0, 5],
            cursor: 'pointer'
          }}
        ></VImage>
      </VGroup>
    </VGroup>
  );

  container.setStage(table.scenegraph.stage);

  return {
    rootContainer: container,
    renderDefault: false
  };
}

function bindEvent(table) {
  const { CLICK_CELL, DROPDOWNMENU_CLICK } = VTable.ListTable.EVENT_TYPE;
  table.addEventListener(CLICK_CELL, (...args) => {
    if (args[0].target) {
      const target = args[0].target;
      const id = target?.attribute?.id;
      if (id === 'hierarchy') {
        table.toggleHierarchyState(args[0].col, args[0].row);
        const hierarchyState = table.getHierarchyState(args[0].col, args[0].row);
        const image = hierarchyState === 'collapse' ? collapseRight : collapseDown;
        target.setAttribute('image', image);
        target.loadImage(image);
      } else if (id === 'add') {
        const define = table.getHeaderDefine(args[0].col, args[0].row);
        // eslint-disable-next-line prefer-template, no-alert
        alert('Add:' + JSON.stringify(define));
        // clickAdd(args[0].col, args[0].row);
      } else if (id === 'filter') {
        const define = table.getHeaderDefine(args[0].col, args[0].row);
        // eslint-disable-next-line prefer-template, no-alert
        alert('Filter:' + JSON.stringify(define));
        // clickFilter(args[0].col, args[0].row, 'rows');
      } else if (id === 'filter-row') {
        const define = table.getHeaderDefine(args[0].col, args[0].row);
        // eslint-disable-next-line prefer-template, no-alert
        alert('Filter:' + JSON.stringify(define));
        // clickFilter(args[0].col, args[0].row, 'columns');
      } else if (typeof id === 'string' && id.startsWith('cross')) {
        // eslint-disable-next-line prefer-template, no-alert
        alert('Cross:' + id + '-' + args[0].col + '/' + args[0].row);
        // clickCross(id, args[0].col, args[0].row);
      } else if (id === 'more-indicator') {
        // table.showDropDownMenu(args[0].col, args[0].row);
      } else if (id === 'more') {
        // table.showDropDownMenu(args[0].col, args[0].row);
      } else if (id === 'row-down') {
        // clickRowDown(args[0].event, args[0].col, args[0].row);
      }
    }
    console.log(CLICK_CELL, args);
  });
}
