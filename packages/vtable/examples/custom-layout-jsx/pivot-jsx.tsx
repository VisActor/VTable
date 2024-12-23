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
const add =
  '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 4H18V18H4V30H18V44H30V30H44V18H30V4Z" fill="rgb(51, 101, 238)" stroke="rgb(51, 101, 238)" stroke-width="1" stroke-linejoin="round"/></svg>';
const filter = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
<path d="M1.29609 1C0.745635 1 0.444871 1.64195 0.797169 2.06491L4.64953 6.68988V9.81861C4.64953 9.89573 4.69727 9.9648 4.76942 9.99205L7.11236 10.877C7.27164 10.9372 7.4419 10.8195 7.4419 10.6492V6.68988L11.2239 2.06012C11.5703 1.63606 11.2685 1 10.721 1H1.29609Z" stroke="#141414" stroke-opacity="0.65" stroke-width="1.18463" stroke-linejoin="round"/>
</svg>`;
const more =
  '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="12" r="3" fill="#9b9b9b"/><circle cx="24" cy="24" r="3" fill="#9b9b9b"/><circle cx="24" cy="35" r="3" fill="#9b9b9b"/></svg>';

const columnTree = [
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
];
const rowTree = [
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
];
const option: VTable.PivotTableConstructorOptions = {
  columnTree: clone(columnTree),
  rowTree: clone(rowTree),
  rows: [
    {
      dimensionKey: '220524114340021',
      title: '类别-细分',
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
      title: '细分',
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
  columns: [
    {
      dimensionKey: '220524114340020',
      title: '地区',
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
      headerCustomLayout: customLayoutRow,
      // 指标菜单
      dropDownMenu: ['重置表头'],
      // corner菜单
      // cornerDropDownMenu: ['升序排序C', '降序排序C', '冻结列C'],
      drillDown: true,
      dragHeader: true
    },
    {
      dimensionKey: '220524114340031',
      title: '省份',
      dragHeader: false
    },
    {
      dimensionKey: '220524114340023',
      title: '邮寄方式',
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
      title: '子类别',
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
      format(value) {
        // if (rec.rowDimensions[0].value === '东北') return `${rec.dataValue}%`;
        if (!value) return '--';
        return Math.floor(parseFloat(value));
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
      dropDownMenu: ['展示数值', '展示色阶'],
      headerCustomLayout: customLayoutIndicator
      // customRender: customRenderIndicator,
      // headerType: 'MULTILINETEXT',
    },
    {
      indicatorKey: '220524114340014',
      caption: '利润',
      format(value) {
        // if (rec.rowDimensions[0].value === '东北') return `${rec.dataValue}%`;
        if (!value) return '--';
        return Math.floor(parseFloat(value));
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
      dropDownMenu: ['展示数值', '展示色阶'],
      headerCustomLayout: customLayoutIndicator
      // customRender: customRenderIndicator,
    }
  ],
  corner: {
    titleOnDimension: 'row',
    headerStyle: {
      textAlign: 'center',
      fontSize: 20,
      // borderColor: 'red',
      // color: 'red',
      underline: true,
      lineHeight: 20
    }
  },
  // records,
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

export function createTable() {
  fetch(supermarketJson)
    .then(res => res.json())
    .then(data => {
      option.records = data;
      const instance = new PivotTable(document.getElementById(Table_CONTAINER_DOM_ID), option);
      bindDebugTool(instance.scenegraph.stage, {
        customGrapicKeys: ['role']
      });
      // 只为了方便控制太调试用，不要拷贝
      window.tableInstance = instance;

      bindEvent(instance);
    });
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function customLayout(args: VTable.TYPES.CustomRenderFunctionArg) {
  const { table, value, col, row } = args;
  const { height, width } = args.rect;
  // const width = 300;
  // const height = 100;
  const hierarchyState = table.getHierarchyState(col, row);
  const path = table.getLayoutRowTree(col, row);
  const rowPathLength = path.length;
  const children = path[rowPathLength - 1].children;
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
      onMouseEnter={event => {
        const filterIcon = event.currentTarget?.find(child => {
          return child.attribute.id === 'filter-icon';
        }, true);
        filterIcon?.setAttribute('visible', true);
        event.currentTarget.stage.renderNextFrame();
      }}
      onMouseLeave={event => {
        const filterIcon = event.currentTarget?.find(child => {
          return child.attribute.id === 'filter-icon';
        }, true);
        filterIcon?.setAttribute('visible', false);
        event.currentTarget.stage.renderNextFrame();
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
          stateProxy={(stateName: string) => {
            if (stateName === 'hover') {
              return {
                background: {
                  fill: '#ccc',
                  cornerRadius: 5,
                  expandX: 1,
                  expandY: 1
                }
              };
            }
          }}
          onMouseEnter={event => {
            event.currentTarget.addState('hover', true, false);
            event.currentTarget.stage.renderNextFrame();
          }}
          onMouseLeave={event => {
            event.currentTarget.removeState('hover', false);
            event.currentTarget.stage.renderNextFrame();
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
                      id: `cross-${child.value}`,
                      width: 10,
                      height: 10,
                      image:
                        '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 11L11 6L24 19L37 6L42 11L29 24L42 37L37 42L24 29L11 42L6 37L19 24L6 11Z" fill="#9b9b9b" stroke="#9b9b9b" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                      boundsPadding: [0, 0, 0, 5],
                      cursor: 'pointer'
                    }}
                    stateProxy={(stateName: string) => {
                      if (stateName === 'hover') {
                        return {
                          background: {
                            fill: '#ccc',
                            cornerRadius: 5,
                            expandX: 1,
                            expandY: 1
                          }
                        };
                      }
                    }}
                    onMouseEnter={event => {
                      event.currentTarget.addState('hover', true, false);
                      event.currentTarget.stage.renderNextFrame();
                    }}
                    onMouseLeave={event => {
                      event.currentTarget.removeState('hover', false);
                      event.currentTarget.stage.renderNextFrame();
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
              image: add,
              width: 16,
              height: 16,
              boundsPadding: [12, 0, 0, 5],
              cursor: 'pointer'
            }}
            stateProxy={(stateName: string) => {
              if (stateName === 'hover') {
                return {
                  background: {
                    fill: '#ccc',
                    cornerRadius: 5,
                    expandX: 1,
                    expandY: 1
                  }
                };
              }
            }}
            onMouseEnter={event => {
              event.currentTarget.addState('hover', true, false);
              event.currentTarget.stage.renderNextFrame();
            }}
            onMouseLeave={event => {
              event.currentTarget.removeState('hover', false);
              event.currentTarget.stage.renderNextFrame();
            }}
          ></VImage>
        ) : null}
        <VImage
          attribute={{
            id: 'filter-icon',
            image: filter,
            width: 16,
            height: 16,
            visible: false,
            boundsPadding: [8, 0, 0, 5],
            cursor: 'pointer'
          }}
          stateProxy={(stateName: string) => {
            if (stateName === 'hover') {
              return {
                background: {
                  fill: '#ccc',
                  cornerRadius: 5,
                  expandX: 1,
                  expandY: 1
                }
              };
            }
          }}
          onMouseEnter={event => {
            event.currentTarget.addState('hover', true, false);
            event.currentTarget.stage.renderNextFrame();
          }}
          onMouseLeave={event => {
            event.currentTarget.removeState('hover', false);
            event.currentTarget.stage.renderNextFrame();
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

function customLayoutRow(args: VTable.TYPES.CustomRenderFunctionArg) {
  const { table, value, col, row } = args;
  const { height, width } = args.rect;
  const title = value;
  // const subTitle = '销售额+利润';
  const path = table.getLayoutColumnTree(col, row);
  let subTitle = '';
  if (path[0].children[0].children.length === 2) {
    subTitle = '销售额+利润';
  } else {
    subTitle = path[0].children[0].children[0].value;
  }

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
      onMouseEnter={event => {
        const filterIcon = event.currentTarget?.find(child => {
          return child.attribute.id === 'filter-row';
        }, true);
        filterIcon?.setAttribute('visible', true);
        event.currentTarget.stage.renderNextFrame();
      }}
      onMouseLeave={event => {
        const filterIcon = event.currentTarget?.find(child => {
          return child.attribute.id === 'filter-row';
        }, true);
        filterIcon?.setAttribute('visible', false);
        event.currentTarget.stage.renderNextFrame();
      }}
    >
      <VGroup
        attribute={{
          id: 'container-left',
          width: width - 80,
          height,
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          fill: '#f80',
          opacity: 0.1,
          alignItems: 'flex-start'
        }}
      >
        <VText
          attribute={{
            text: `${title}地区`,
            fontSize: 16,
            fontFamily: 'sans-serif',
            fill: 'black',
            textAlign: 'left',
            textBaseline: 'top',
            boundsPadding: [10, 0, 20, 30]
          }}
        ></VText>
        <VGroup
          attribute={{
            id: `tag-group`,
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            boundsPadding: [0, 0, 10, 30]
          }}
        >
          <VText
            attribute={{
              text: subTitle,
              fontSize: 12,
              fontFamily: 'sans-serif',
              fill: 'rgb(51, 101, 238)',
              textBaseline: 'top',
              boundsPadding: [5, 0, 0, 0]
            }}
          ></VText>
          <VImage
            attribute={{
              id: 'row-down',
              image: collapseDown,
              width: 20,
              height: 20,
              cursor: 'pointer'
            }}
            stateProxy={(stateName: string) => {
              if (stateName === 'hover') {
                return {
                  background: {
                    fill: '#ccc',
                    cornerRadius: 5,
                    expandX: 1,
                    expandY: 1
                  }
                };
              }
            }}
            onMouseEnter={event => {
              event.currentTarget.addState('hover', true, false);
              event.currentTarget.stage.renderNextFrame();
            }}
            onMouseLeave={event => {
              event.currentTarget.removeState('hover', false);
              event.currentTarget.stage.renderNextFrame();
            }}
          ></VImage>
        </VGroup>
      </VGroup>
      <VGroup
        attribute={{
          id: 'container-right',
          width: 80,
          height,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          fill: '#f08',
          opacity: 0.1
        }}
      >
        <VImage
          attribute={{
            id: 'more',
            image: more,
            width: 20,
            height: 20,
            boundsPadding: [0, 10, 0, 0],
            cursor: 'pointer'
          }}
          stateProxy={(stateName: string) => {
            if (stateName === 'hover') {
              return {
                background: {
                  fill: '#ccc',
                  cornerRadius: 5,
                  expandX: 1,
                  expandY: 1
                }
              };
            }
          }}
          onMouseEnter={event => {
            event.currentTarget.addState('hover', true, false);
            event.currentTarget.stage.renderNextFrame();
          }}
          onMouseLeave={event => {
            event.currentTarget.removeState('hover', false);
            event.currentTarget.stage.renderNextFrame();
          }}
        ></VImage>
        <VImage
          attribute={{
            id: 'filter-row',
            image: filter,
            iconName: 'filterC',
            width: 16,
            height: 16,
            boundsPadding: [0, 10, 0, 0],
            visible: false,
            cursor: 'pointer'
          }}
          stateProxy={(stateName: string) => {
            if (stateName === 'hover') {
              return {
                background: {
                  fill: '#ccc',
                  cornerRadius: 5,
                  expandX: 1,
                  expandY: 1
                }
              };
            }
          }}
          onMouseEnter={event => {
            event.currentTarget.addState('hover', true, false);
            event.currentTarget.stage.renderNextFrame();
          }}
          onMouseLeave={event => {
            event.currentTarget.removeState('hover', false);
            event.currentTarget.stage.renderNextFrame();
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

function customLayoutIndicator(args: VTable.TYPES.CustomRenderFunctionArg) {
  const { table, value, col, row } = args;
  const { height, width } = args.rect;

  const container = (
    <VGroup
      attribute={{
        id: 'container',
        width,
        height,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        fill: '#f00',
        opacity: 0.1
      }}
    >
      <VText
        attribute={{
          text: value,
          fontSize: 12,
          fontFamily: 'sans-serif',
          fill: 'black',
          boundsPadding: [13, 10, 7, 10],
          textAlign: 'left',
          textBaseline: 'top'
        }}
      ></VText>
      <VImage
        attribute={{
          id: 'more-indicator',
          image: more,
          width: 16,
          height: 16,
          boundsPadding: [0, 5, 0, 0],
          cursor: 'pointer'
        }}
        stateProxy={(stateName: string) => {
          if (stateName === 'hover') {
            return {
              background: {
                fill: '#ccc',
                cornerRadius: 5,
                expandX: 1,
                expandY: 1
              }
            };
          }
        }}
        onMouseEnter={event => {
          event.currentTarget.addState('hover', true, false);
          event.currentTarget.stage.renderNextFrame();
        }}
        onMouseLeave={event => {
          event.currentTarget.removeState('hover', false);
          event.currentTarget.stage.renderNextFrame();
        }}
      ></VImage>
    </VGroup>
  );

  container.setStage(table.scenegraph.stage);
  return {
    rootContainer: container,
    renderDefault: false
  };
}

function bindEvent(table) {
  const { CLICK_CELL, DROPDOWN_MENU_CLICK } = VTable.ListTable.EVENT_TYPE;
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
        // const define = table.getHeaderDefine(args[0].col, args[0].row);
        // eslint-disable-next-line prefer-template, no-alert
        // alert('Add:' + JSON.stringify(define));
        clickAdd(args[0].col, args[0].row, table);
      } else if (id === 'filter-icon') {
        // const define = table.getHeaderDefine(args[0].col, args[0].row);
        // eslint-disable-next-line prefer-template, no-alert
        // alert('Filter:' + JSON.stringify(define));
        clickFilter(args[0].col, args[0].row, 'rows', table);
      } else if (id === 'filter-row') {
        // const define = table.getHeaderDefine(args[0].col, args[0].row);
        // eslint-disable-next-line prefer-template, no-alert
        // alert('Filter:' + JSON.stringify(define));
        clickFilter(args[0].col, args[0].row, 'columns', table);
      } else if (typeof id === 'string' && id.startsWith('cross')) {
        // eslint-disable-next-line prefer-template, no-alert
        // alert('Cross:' + id + '-' + args[0].col + '/' + args[0].row);
        clickCross(id, args[0].col, args[0].row, table);
      } else if (id === 'more-indicator') {
        // table.showDropDownMenu(args[0].col, args[0].row);
      } else if (id === 'more') {
        table.showDropDownMenu(args[0].col, args[0].row);
      } else if (id === 'row-down') {
        clickRowDown(args[0].event, args[0].col, args[0].row, table);
      }
    }
    console.log(CLICK_CELL, args);
  });
}

// 编辑行维度
function clickAdd(col, row, table) {
  const menuContainer = document.createElement('div');
  const formContainer = document.createElement('form');
  const path = table.getCellHeaderPaths(col, row);

  // 重置维度
  const pathValues = path.rowHeaderPaths.map(path => path.value);
  const value = pathValues[pathValues.length - 1];
  const dimensionKey = path.rowHeaderPaths[path.rowHeaderPaths.length - 1].dimensionKey;
  let newPath;
  // 分析原始维度path
  rowTree.forEach((row, index) => {
    if (row.dimensionKey === dimensionKey && row.value === value) {
      newPath = row;
    } else if (row.dimensionKey === dimensionKey) {
      // do nothing
    } else if (row.children) {
      row.children.forEach((childRow, childIndex) => {
        if (childRow.dimensionKey === dimensionKey && childRow.value === value) {
          newPath = childRow;
        }
      });
    }
  });

  const title = document.createElement('div');
  title.innerHTML = `${path.rowHeaderPaths[path.rowHeaderPaths.length - 1].value} 分组`;
  title.style.marginBottom = '10px';
  menuContainer.appendChild(title);

  // pivotLayout = cloneDeep(pivotLayoutOrigin);
  // 重置维度
  const newRowTree = clone(rowTree);

  // 加入选项
  newPath.children.forEach(item => {
    const checkContainer = document.createElement('div');
    const check = document.createElement('input');
    check.name = item.value;
    check.checked = true;
    check.type = 'checkbox';
    const name = document.createElement('span');
    name.innerHTML = item.value;
    checkContainer.appendChild(check);
    checkContainer.appendChild(name);
    formContainer.appendChild(checkContainer);
  });

  // 加入提交按钮
  const buttonContainer = document.createElement('div');
  buttonContainer.style.marginTop = '10px';
  const submitButton = document.createElement('input');
  submitButton.value = '确认';
  submitButton.type = 'submit';
  const cancelButton = document.createElement('button');
  cancelButton.innerHTML = '取消';
  cancelButton.style.marginLeft = '15px';
  buttonContainer.appendChild(submitButton);
  buttonContainer.appendChild(cancelButton);
  formContainer.appendChild(buttonContainer);

  menuContainer.appendChild(formContainer);

  menuContainer.style.padding = '20px';
  menuContainer.style.width = '200px';
  menuContainer.style.height = '180px';
  menuContainer.style.position = 'fixed';
  menuContainer.style.top = 'calc(50% - 90px)';
  menuContainer.style.left = 'calc(50% - 100px)';
  menuContainer.style.border = '1px solid #bbb';
  // menuContainer.style.borderRadius = '20px';
  menuContainer.style.background = 'rgb(233,238,242)';
  menuContainer.style.boxShadow = '1px 1px 1px #ddd';

  document.body.appendChild(menuContainer);

  // 处理确认点击
  formContainer.addEventListener('submit', e => {
    e.preventDefault();
    const keys = [];
    Array.from(e.srcElement).forEach(input => {
      if (input.checked) keys.push(input.name);
    });

    const path = table.getCellHeaderPaths(col, row);
    const pathValues = path.rowHeaderPaths.map(path => path.value);
    // const cellValue = path.rowHeaderPaths[0].value;
    // 过滤指定维度
    newRowTree.forEach(column => {
      if (column.value === pathValues[0]) {
        if (pathValues.length === 1) {
          column.children = column.children.filter((child, index) => {
            // return child.value !== buttomId;
            return keys.indexOf(child.value) !== -1;
          });
        } else if (pathValues.length === 2) {
          column.children.forEach(childColum => {
            if (childColum.value === pathValues[1]) {
              childColum.children = childColum.children.filter((child, index) => {
                // return child.value !== buttomId;
                return keys.indexOf(child.value) !== -1;
              });
            }
          });
        }
      }
    });
    document.body.removeChild(menuContainer);
    option.rowTree = newRowTree;
    table.updateOption(option);
  });

  // 处理取消点击
  cancelButton.addEventListener('click', e => {
    document.body.removeChild(menuContainer);
  });
}

const filterFunc = {
  '===': (a, b) => a === b,
  '!==': (a, b) => a !== b
};

// 维度过滤
function clickFilter(col, row, direction, table) {
  const menuContainer = document.createElement('div');
  const formContainer = document.createElement('form');
  const path = table.getCellHeaderPaths(col, row);
  const pathName = direction === 'rows' ? 'rowHeaderPaths' : 'colHeaderPaths';

  // 重置维度
  const pathValues = path[pathName].map(path => path.value);
  const value = pathValues[pathValues.length - 1];
  const dimensionKey = path[pathName][path[pathName].length - 1].dimensionKey;
  let newPath;
  const newTree = direction === 'rows' ? clone(rowTree) : clone(columnTree);
  newTree.forEach((row, index) => {
    if (row.dimensionKey === dimensionKey && row.value === value) {
      newPath = row;
    } else if (row.dimensionKey === dimensionKey) {
      // do nothing
    } else if (row.children) {
      row.children.forEach((childRow, childIndex) => {
        if (childRow.dimensionKey === dimensionKey && childRow.value === value && childRow.children) {
          newPath = childRow;
        }
      });
    }
  });

  const title = document.createElement('div');
  title.innerHTML = `${path[pathName][path[pathName].length - 1].value} 分组过滤`;
  title.style.marginBottom = '10px';
  menuContainer.appendChild(title);

  // pivotLayout = cloneDeep(pivotLayoutOrigin);

  // 加入方法选项
  const methodSelecter = document.createElement('select');
  methodSelecter.name = 'method';
  const voidMethod = document.createElement('option');
  voidMethod.value = '';
  voidMethod.innerHTML = '';
  methodSelecter.appendChild(voidMethod);
  const eq = document.createElement('option');
  eq.value = '===';
  eq.innerHTML = '===';
  methodSelecter.appendChild(eq);
  const neq = document.createElement('option');
  neq.value = '!==';
  neq.innerHTML = '!==';
  methodSelecter.appendChild(neq);
  formContainer.appendChild(methodSelecter);

  // 加入value选项
  const childSelecter = document.createElement('select');
  childSelecter.style.marginLeft = '15px';
  const voidChild = document.createElement('option');
  voidChild.value = '';
  voidChild.innerHTML = '';
  childSelecter.appendChild(voidChild);
  newPath.children.forEach(item => {
    const child = document.createElement('option');
    child.value = item.value;
    child.innerHTML = item.value;
    childSelecter.appendChild(child);
  });
  formContainer.appendChild(childSelecter);

  // 加入提交按钮
  const buttonContainer = document.createElement('div');
  buttonContainer.style.marginTop = '10px';
  const submitButton = document.createElement('input');
  submitButton.value = '确认';
  submitButton.type = 'submit';
  const cancelButton = document.createElement('button');
  cancelButton.innerHTML = '取消';
  cancelButton.style.marginLeft = '15px';
  buttonContainer.appendChild(submitButton);
  buttonContainer.appendChild(cancelButton);
  formContainer.appendChild(buttonContainer);

  menuContainer.appendChild(formContainer);

  // 容器样式
  menuContainer.style.padding = '20px';
  menuContainer.style.width = '200px';
  menuContainer.style.height = '180px';
  menuContainer.style.position = 'fixed';
  menuContainer.style.top = 'calc(50% - 90px)';
  menuContainer.style.left = 'calc(50% - 100px)';
  menuContainer.style.border = '1px solid #bbb';
  // menuContainer.style.borderRadius = '20px';
  menuContainer.style.background = 'rgb(233,238,242)';
  menuContainer.style.boxShadow = '1px 1px 1px #ddd';

  document.body.appendChild(menuContainer);

  // 处理确认点击
  formContainer.addEventListener('submit', e => {
    e.preventDefault();
    // e.srcElement.length;
    // console.log(e, (e).srcElement.length);
    const method = e.srcElement[0].value;
    const value = e.srcElement[1].value;

    if (method === '' || value === '') {
      // 没有过滤
      document.body.removeChild(menuContainer);
      if (direction === 'rows') {
        option.rowTree = newTree;
      } else {
        option.columnTree = newTree;
      }
      table.updateOption(option);
      return;
    }

    // 处理过滤条件
    const path = table.getCellHeaderPaths(col, row);
    const pathValues = path[pathName].map(path => path.value);
    // const cellValue = path[pathName][0].value;
    newTree.forEach(column => {
      if (column.value === pathValues[0]) {
        if (pathValues.length === 1) {
          // 过滤子维度
          column.children = column.children.filter((child, index) => {
            // return child.value !== buttomId;
            // return keys.indexOf(child.value) !== -1;
            return filterFunc[method](child.value, value);
          });
        } else if (pathValues.length === 2) {
          column.children.forEach(childColum => {
            if (childColum.value === pathValues[1]) {
              // 过滤子维度
              childColum.children = childColum.children.filter((child, index) => {
                // return child.value !== buttomId;
                // return keys.indexOf(child.value) !== -1;
                return filterFunc[method](child.value, value);
              });
            }
          });
        }
      }
    });
    document.body.removeChild(menuContainer);
    if (direction === 'rows') {
      option.rowTree = newTree;
    } else {
      option.columnTree = newTree;
    }
    table.updateOption(option);
  });

  // 处理取消点击
  cancelButton.addEventListener('click', e => {
    document.body.removeChild(menuContainer);
  });
}

// 点击x删除行维度
function clickCross(id, col, row, table) {
  const path = table.getCellHeaderPaths(col, row);
  const pathValues = path.rowHeaderPaths.map(path => path.value);
  // const cellValue = path.rowHeaderPaths[0].value;
  const buttomId = id.slice(6);
  const newRowTree = clone(rowTree);
  newRowTree.forEach(column => {
    if (column.value === pathValues[0]) {
      if (pathValues.length === 1) {
        column.children = column.children.filter((child, index) => {
          return child.value !== buttomId;
        });
      } else if (pathValues.length === 2) {
        column.children.forEach(childColum => {
          if (childColum.value === pathValues[1]) {
            childColum.children = childColum.children.filter((child, index) => {
              return child.value !== buttomId;
            });
          }
        });
      }
    }
  });

  option.rowTree = newRowTree;
  table.updateOption(option);
}

let dpMenuContainer;

// 列表头维度选择
function clickRowDown(e, col, row, table) {
  // 创建容器
  let container;
  if (dpMenuContainer) {
    container = dpMenuContainer;
    container.innerHTML = '';
  } else {
    container = document.createElement('div');
    dpMenuContainer = container;
  }
  container.id = 'dp-menu';
  container.style.width = '120px';
  container.style.height = '100px';
  container.style.position = 'fixed';
  container.style.top = `${e.clientY + 15}px`;
  container.style.left = `${e.clientX - 120 + 15}px`;
  container.style.border = '1px solid #bbb';
  container.style.borderRadius = '5px';
  container.style.background = 'rgb(233,238,242)';
  container.style.boxShadow = '1px 1px 1px #ddd';
  container.style.padding = '10px';

  // 创建选项
  const option1 = createOption('销售额', col, row, table);
  container.appendChild(option1);
  const option2 = createOption('利润', col, row, table);
  container.appendChild(option2);
  const option3 = createOption('销售额+利润', col, row, table);
  container.appendChild(option3);

  document.body.appendChild(container);
  // return container;
}

function createOption(str, col, row, table) {
  const option = document.createElement('div');
  option.innerText = str;
  option.style.marginBottom = '5px';
  option.addEventListener('mouseenter', e => {
    option.style.backgroundColor = '#ccc';
    option.style.cursor = 'pointer';
  });
  option.addEventListener('mouseleave', e => {
    option.style.backgroundColor = '';
    option.style.cursor = '';
  });
  option.addEventListener('click', () => {
    // 改变维度
    changeRowChild(option, col, row, str, table);
  });
  return option;
}

function changeRowChild(optionDiv, col, row, methodStr, table) {
  const path = table.getCellHeaderPaths(col, row);
  const name = path.colHeaderPaths[0].value;
  // pivotLayout.columns = JSON.parse(JSON.stringify(columnsOrigin));
  const originHead = columnTree.filter(column => column.value === name);
  let distIndex = 0;
  columnTree.forEach((row, index) => {
    if (row.value === name) {
      distIndex = index;
    }
  });
  // 使用原始表头重置
  option.columnTree[distIndex] = clone(originHead[0]);

  option.columnTree?.forEach(row => {
    if (row.value === name) {
      row.children?.forEach(row => {
        // 过滤指定维度
        row.children = row.children?.filter(row => {
          if (optionDiv.innerText === '销售额') {
            return row.value === '销售额';
          } else if (optionDiv.innerText === '利润') {
            return row.value === '利润';
          }
          return true;
        });
      });
    }
  });

  table.updateOption(option);
  document.body.removeChild(optionDiv.parentNode);
}
