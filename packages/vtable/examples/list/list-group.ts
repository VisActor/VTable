/* eslint-disable max-len */
import * as VTable from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
import { createGroup } from '@visactor/vrender-core';
import { isValid } from '@visactor/vutils';
// import { VGroup } from '@visactor/vrender-kits';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);

const { VGroup, VText, jsx } = VTable;

const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];
const bloggerAvatar = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg';
const collapseRight = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M5.81235 11.3501C5.48497 11.612 5 11.3789 5 10.9597L5 5.04031C5 4.62106 5.48497 4.38797 5.81235 4.64988L9.51196 7.60957C9.76216 7.80973 9.76216 8.19027 9.51196 8.39044L5.81235 11.3501Z" fill="#141414" fill-opacity="0.65"/>
      </svg>`;
const collapseDown = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M4.64988 6.81235C4.38797 6.48497 4.62106 6 5.04031 6L10.9597 6C11.3789 6 11.612 6.48497 11.3501 6.81235L8.39043 10.512C8.19027 10.7622 7.80973 10.7622 7.60957 10.512L4.64988 6.81235Z" fill="#141414" fill-opacity="0.65"/>
</svg>`;

export function createTable() {
  let tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then(res => res.json())
    .then(data => {
      const columns = [
        {
          field: 'Order ID',
          title: 'Order ID',
          width: 'auto',
          sort: true
        },
        {
          field: 'Customer ID',
          title: 'Customer ID',
          width: 'auto'
          // cellType: 'checkbox'
        },
        {
          field: 'Product Name',
          title: 'Product Name',
          width: 'auto'
        },
        {
          field: 'Category',
          title: 'Category',
          width: 'auto'
        },
        {
          field: 'Sub-Category',
          title: 'Sub-Category',
          width: 'auto'
        },
        {
          field: 'Region',
          title: 'Region',
          width: 'auto'
        },
        {
          field: 'City',
          title: 'City',
          width: 'auto'
        },
        {
          field: 'Order Date',
          title: 'Order Date',
          width: 'auto'
        },
        {
          field: 'Quantity',
          title: 'Quantity',
          width: 'auto'
        },
        {
          field: 'Sales',
          title: 'Sales',
          width: 'auto'
        },
        {
          field: 'Profit',
          title: 'Profit',
          width: 'auto'
        }
      ];

      const option: VTable.ListTableConstructorOptions = {
        records: data.slice(0, 50),
        columns,
        widthMode: 'standard',
        groupBy: ['Category', 'Sub-Category'],
        groupTitleFieldFormat: (record, col, row, table) => {
          return record.vtableMergeName + '(' + record.children.length + ')';
        },
        // autoFillWidth: true,

        // hierarchyExpandLevel: Infinity,
        theme: VTable.themes.DEFAULT.extends({
          groupTitleStyle: {
            fontWeight: 'bold',
            // bgColor: '#3370ff'
            bgColor: args => {
              const { col, row, table } = args;
              const index = table.getGroupTitleLevel(col, row);
              if (index !== undefined) {
                return titleColorPool[index % titleColorPool.length];
              }
            }
          }
        }),
        // editor: 'input',
        // sortState: {
        //   field: 'Order ID',
        //   order: 'asc'
        // },
        // groupTitleCustomLayout: args => {
        //   // const { table, row, col, rect } = args;
        //   // const record = table.getCellOriginRecord(col, row);
        //   // const { height, width } = rect ?? table.getCellRect(col, row);
        //   // const hierarchyState = table.getHierarchyState(col, row);

        //   // const container = new VTable.CustomLayout.Group({
        //   //   height,
        //   //   width,
        //   //   display: 'flex',
        //   //   flexDirection: 'row',
        //   //   flexWrap: 'nowrap',
        //   //   cursor: 'pointer',
        //   //   alignItems: 'center'
        //   // });

        //   // const icon = new VTable.CustomLayout.Image({
        //   //   id: 'hierarchy',
        //   //   image: hierarchyState === 'collapse' ? collapseRight : collapseDown,
        //   //   width: 18,
        //   //   height: 18,
        //   //   boundsPadding: [0, 0, 0, 10],
        //   //   cursor: 'pointer'
        //   // });
        //   // icon.stateProxy = (stateName: string) => {
        //   //   if (stateName === 'hover') {
        //   //     return {
        //   //       background: {
        //   //         fill: '#ccc',
        //   //         cornerRadius: 5,
        //   //         expandX: 1,
        //   //         expandY: 1
        //   //       }
        //   //     };
        //   //   }
        //   // };
        //   // icon.addEventListener('pointerenter', event => {
        //   //   event.currentTarget.addState('hover', true, false);
        //   //   event.currentTarget.stage.renderNextFrame();
        //   // });
        //   // icon.addEventListener('pointerleave', event => {
        //   //   event.currentTarget.removeState('hover', false);
        //   //   event.currentTarget.stage.renderNextFrame();
        //   // });
        //   // container.add(icon);

        //   // const avatar = new VTable.CustomLayout.Image({
        //   //   id: 'hierarchy',
        //   //   image: bloggerAvatar,
        //   //   width: 30,
        //   //   height: 30,
        //   //   boundsPadding: [0, 0, 0, 10],
        //   //   cursor: 'pointer',
        //   //   cornerRadius: 15
        //   // });
        //   // container.add(avatar);

        //   // const bloggerName = new VTable.CustomLayout.Text({
        //   //   text: record.vtableMergeName,
        //   //   fontSize: 13,
        //   //   fontFamily: 'sans-serif',
        //   //   fill: 'black',
        //   //   boundsPadding: [0, 0, 0, 10]
        //   // });
        //   // container.add(bloggerName);

        //   // const info = new VTable.CustomLayout.Text({
        //   //   text: 'some info',
        //   //   fontSize: 13,
        //   //   fontFamily: 'sans-serif',
        //   //   fill: 'black',
        //   //   boundsPadding: [0, 0, 0, 100]
        //   // });
        //   // container.add(info);

        //   // container.addEventListener('click', e => {
        //   //   // 折叠后单元格的行列值会变化，需要动态获取
        //   //   const { col, row } = e.target.parent;
        //   //   const hierarchyState = table.getHierarchyState(col, row);
        //   //   // 更新按钮状态
        //   //   icon.setAttribute('image', hierarchyState !== 'collapse' ? collapseRight : collapseDown);
        //   //   // 除非折叠
        //   //   table.toggleHierarchyState(col, row);
        //   //   // e.target.stage.renderNextFrame();
        //   // });

        //   // const container = (
        //   //   <VGroup
        //   //     attribute={{
        //   //       id: 'container',
        //   //       width,
        //   //       height,
        //   //       display: 'flex',
        //   //       flexWrap: 'no-wrap',
        //   //       justifyContent: 'flex-start',
        //   //       alignContent: 'center'
        //   //     }}
        //   //   >
        //   //     <VText
        //   //       attribute={{
        //   //         id: 'bloggerName',
        //   //         text: 'record.bloggerName',
        //   //         fontSize: 13,
        //   //         fontFamily: 'sans-serif',
        //   //         fill: 'black',
        //   //         textAlign: 'left',
        //   //         textBaseline: 'top',
        //   //         boundsPadding: [0, 0, 0, 10]
        //   //       }}
        //   //     ></VText>
        //   //   </VGroup>
        //   // );

        //   const { table, row, col, rect } = args;
        //   const record = table.getCellOriginRecord(col, row);
        //   const { height, width } = rect ?? table.getCellRect(col, row);
        //   const hierarchyState = table.getHierarchyState(col, row);
        //   const bloggerAvatar = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg';
        //   const collapseRight = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        //           <path d="M5.81235 11.3501C5.48497 11.612 5 11.3789 5 10.9597L5 5.04031C5 4.62106 5.48497 4.38797 5.81235 4.64988L9.51196 7.60957C9.76216 7.80973 9.76216 8.19027 9.51196 8.39044L5.81235 11.3501Z" fill="#141414" fill-opacity="0.65"/>
        //         </svg>`;
        //   const collapseDown = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        //   <path d="M4.64988 6.81235C4.38797 6.48497 4.62106 6 5.04031 6L10.9597 6C11.3789 6 11.612 6.48497 11.3501 6.81235L8.39043 10.512C8.19027 10.7622 7.80973 10.7622 7.60957 10.512L4.64988 6.81235Z" fill="#141414" fill-opacity="0.65"/>
        //   </svg>`;
        //   const container = new VTable.CustomLayout.Group({
        //     height,
        //     width,
        //     display: 'flex',
        //     flexDirection: 'row',
        //     flexWrap: 'nowrap',
        //     cursor: 'pointer',
        //     alignItems: 'center'
        //   });
        //   const icon = new VTable.CustomLayout.Image({
        //     // id: 'hierarchy',
        //     image: hierarchyState === 'collapse' ? collapseRight : collapseDown,
        //     width: 18,
        //     height: 18,
        //     boundsPadding: [0, 0, 0, 10],
        //     cursor: 'pointer'
        //   });
        //   icon.stateProxy = (stateName: string) => {
        //     if (stateName === 'hover') {
        //       return {
        //         background: {
        //           fill: '#ccc',
        //           cornerRadius: 5,
        //           expandX: 1,
        //           expandY: 1
        //         }
        //       };
        //     }
        //   };
        //   icon.addEventListener('pointerenter', event => {
        //     event.currentTarget.addState('hover', true, false);
        //     event.currentTarget.stage.renderNextFrame();
        //   });
        //   icon.addEventListener('pointerleave', event => {
        //     event.currentTarget.removeState('hover', false);
        //     event.currentTarget.stage.renderNextFrame();
        //   });
        //   container.add(icon);
        //   const taskGroup = new VTable.CustomLayout.Group({
        //     height,
        //     width: 340,
        //     display: 'flex',
        //     flexDirection: 'row',
        //     flexWrap: 'nowrap',
        //     cursor: 'pointer',
        //     alignItems: 'center',
        //     justifyContent: 'space-between'
        //   });
        //   const leftGroup = new VTable.CustomLayout.Group({
        //     height,
        //     display: 'flex',
        //     flexDirection: 'row',
        //     flexWrap: 'nowrap',
        //     cursor: 'pointer',
        //     alignItems: 'center'
        //   });
        //   const avatar = new VTable.CustomLayout.Image({
        //     image: bloggerAvatar,
        //     width: 24,
        //     height: 24,
        //     boundsPadding: [0, 8, 0, 8],
        //     cursor: 'pointer',
        //     cornerRadius: 12
        //   });
        //   const bloggerName = new VTable.CustomLayout.Text({
        //     text: record.vtableMergeName,
        //     fontSize: 14,
        //     fill: 'black'
        //   });
        //   leftGroup.add(avatar);
        //   leftGroup.add(bloggerName);
        //   taskGroup.add(leftGroup);
        //   const info = new VTable.CustomLayout.Text({
        //     text: `${record.children.length} 条记录`,
        //     fontSize: 12
        //   });
        //   taskGroup.add(info);
        //   container.add(taskGroup);
        //   container.addEventListener('click', e => {
        //     // 折叠后单元格的行列值会变化，需要动态获取
        //     const { col, row } = e.currentTarget.parent;
        //     const hierarchyState = table.getHierarchyState(col, row);
        //     // 更新按钮状态
        //     icon.setAttribute('image', hierarchyState === 'collapse' ? collapseDown : collapseRight);
        //     // 除非折叠
        //     table.toggleHierarchyState(col, row);
        //     // e.target.stage.renderNextFrame();
        //   });

        //   return {
        //     rootContainer: container,
        //     renderDefault: false
        //   };
        // },
        // frozenColCount: 1
        enableTreeStickCell: true,
        rowSeriesNumber: {
          dragOrder: true,
          title: '序号',
          width: 'auto',
          headerStyle: {
            color: 'black',
            bgColor: 'pink'
          },
          style: {
            color: 'red'
          }
        }
      };
      tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
      window.tableInstance = tableInstance;
      bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

      let index = 100;
      const updateing = false;
      const addRecords = () => {
        tableInstance.addRecords(data.slice(index, index + 100));
        index += 100;
      };
      const showLoading = () => {
        const container = document.createElement('div');
        container.id = 'loading';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.background = 'rgba(0, 0, 0, 0.5)';
        container.innerHTML = 'loading...';
        container.style.fontSize = '40px';
        container.style.color = 'white';
        container.style.fontWeight = 'bold';
        container.style.textAlign = 'center';
        container.style.lineHeight = '100vh';
        document.body.appendChild(container);
      };
      const hideLoading = () => {
        const container = document.getElementById('loading');
        if (container) {
          document.body.removeChild(container);
        }
      };

      // tableInstance.on('scroll_vertical_end', () => {
      //   if (updateing) {
      //     return;
      //   }
      //   updateing = true;
      //   showLoading();
      //   setTimeout(() => {
      //     addRecords();
      //     hideLoading();
      //     updateing = false;
      //   }, 1000);
      // });

      // tableInstance.on('scroll', () => {
      //   updateGroupTitle(tableInstance);
      // });
    })
    .catch(e => {
      console.error(e);
    });
}

let titleRows = [];
const showTitleRows = [];
let nowRow = -1;
let isTitle = false;
let skip = 0;
const skipAll = false;

let startRow;
let endRow;

function updateGroupTitle(tableInstance: VTable.ListTable) {
  let renderLast = false;
  if (isValid(startRow) && isValid(endRow) && startRow !== tableInstance.scenegraph.proxy.bodyTopRow - 1) {
    if (
      tableInstance.scenegraph.proxy.screenTopRow <= startRow ||
      tableInstance.scenegraph.proxy.screenTopRow >= endRow
    ) {
      startRow = undefined;
      endRow = undefined;
      getGroupTitleInfo(tableInstance);
    } else {
      // const row = tableInstance.scenegraph.proxy.screenTopRow + titleRows.length;
      // nowRow = row;
      renderLast = true;
    }
  } else {
    startRow = undefined;
    endRow = undefined;
    getGroupTitleInfo(tableInstance);
  }
  // getGroupTitleInfo(tableInstance);

  // if (showTitleRows.length === titleRows.length && showTitleRows.every((item, index) => item === titleRows[index])) {
  //   return;
  // }

  // const topRow = tableInstance.scenegraph.proxy.screenTopRow + (titleRows?.length ?? 0);
  const topRow = nowRow;
  // console.log('titleRows', titleRows, showTitleRows, topRow, isTitle, skip);
  const colHeaderGroup = tableInstance.scenegraph.colHeaderGroup;
  const shadowGroup = colHeaderGroup.shadowRoot;
  shadowGroup.setAttributes({
    // shadowRootIdx: 1,
    // width: 500,
    // height: 500,
    // fill: 'red'
  });
  shadowGroup.removeAllChild();

  // if (titleRows.length < showTitleRows.length) {
  //   return;
  // }

  if (renderLast) {
    for (let col = 0; col < tableInstance.colCount; col++) {
      const colGroup = createGroup({
        x: tableInstance.getColsWidth(0, col - 1),
        y: tableInstance.getFrozenRowsHeight()
      });
      shadowGroup.add(colGroup);
      for (let i = 0; i < titleRows.length; i++) {
        const row = titleRows[i];
        if (isSkipRow(row, topRow, tableInstance.scenegraph.proxy.screenTopRow)) {
          // skipOne = true;
          col === 0 && skip++;
          continue;
        }
        // if (col === 0) {
        //   showTitleRows.push(row);
        // }
        const cell = tableInstance.scenegraph.getCell(col, row);
        if (cell.role === 'cell') {
          // const newCell = cell.clone();
          const newCell = cloneGraphic(cell);
          newCell.setAttributes({
            y: i * 40
          });
          colGroup.add(newCell);
        }
      }
    }
  } else {
    showTitleRows.length = 0;
    skip = 0;
    for (let col = 0; col < tableInstance.colCount; col++) {
      const colGroup = createGroup({
        x: tableInstance.getColsWidth(0, col - 1),
        y: tableInstance.getFrozenRowsHeight()
      });
      shadowGroup.add(colGroup);
      for (let i = 0; i < titleRows.length; i++) {
        const row = titleRows[i];
        if (isSkipRow(row, topRow, tableInstance.scenegraph.proxy.screenTopRow)) {
          // skipOne = true;
          col === 0 && skip++;
          continue;
        }
        if (col === 0) {
          showTitleRows.push(row);
        }
        const cell = tableInstance.scenegraph.getCell(col, row);
        if (cell.role === 'cell') {
          // const newCell = cell.clone();
          const newCell = cloneGraphic(cell);
          newCell.setAttributes({
            y: i * 40
          });
          colGroup.add(newCell);
        }
      }
    }

    if (skip > 0) {
      const titleRowsLength = titleRows.length;
      startRow = tableInstance.scenegraph.proxy.screenTopRow - 1;
      endRow = tableInstance.scenegraph.proxy.screenTopRow + 1;
    }
  }
  // if (showTitleRows.length === 0) {
  //   skipAll = true;
  //   // skip = titleRows[0] - tableInstance.scenegraph.proxy.screenTopRow;
  // } else {
  //   skipAll = false;
  // }

  console.log(
    'titleRows-after',
    titleRows,
    showTitleRows,
    topRow,
    tableInstance.scenegraph.proxy.screenTopRow,
    isTitle,
    skip,
    startRow,
    endRow
  );

  // if (skip > 0) {
  //   skip += titleRows.length - 1;
  // }
  // console.log('skip', skip);
}

function getGroupTitleInfo(tableInstance: VTable.ListTable) {
  // const row = skipAll
  //   ? tableInstance.scenegraph.proxy.screenTopRow + titleRows.length + 1 - skip
  //   : tableInstance.scenegraph.proxy.screenTopRow + showTitleRows.length + skip;
  // const row = tableInstance.scenegraph.proxy.screenTopRow + skip;
  const row = tableInstance.scenegraph.proxy.screenTopRow + titleRows.length;
  // skipOne = false;
  const recordIndex = tableInstance.getRecordIndexByCell(0, row); // [0, 0, 6]/0

  // lastTitleRows = titleRows;
  titleRows = getTitleRowsByRecordIndex(tableInstance, recordIndex, row);
  nowRow = row;

  // if (nowRow === titleRows[titleRows.length - 1] && isTitle) {
  //   skipOne = true;
  // } else {
  //   skipOne = false;
  // }
  return titleRows;
}

function getTitleRowsByRecordIndex(tableInstance: VTable.ListTable, recordIndex: number | number[], row: number) {
  const titleRecords = [];
  if (!Array.isArray(recordIndex)) {
    recordIndex = [recordIndex];
  }

  for (let i = 0; i < recordIndex.length; i++) {
    const index = recordIndex.slice(0, i + 1);
    const record = tableInstance.dataSource.getRawRecord(index);
    titleRecords.push(record);
  }

  const titleRows = [];
  isTitle = !(recordIndex.length === tableInstance.options.groupBy.length + 1);
  let titleIndex = recordIndex.slice(0, !isTitle ? recordIndex.length - 1 : recordIndex.length);
  const currentIndexedData = tableInstance.dataSource.currentIndexedData;
  const startIndex = row - tableInstance.columnHeaderLevelCount;

  for (let i = startIndex; i >= 0; i--) {
    const currentIndex = currentIndexedData[i];
    if (Array.isArray(currentIndex) && titleIndex.length === currentIndex.length) {
      let isMatch = true;
      for (let j = 0; j < currentIndex.length; j++) {
        if (currentIndex[j] !== titleIndex[j]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        titleRows.push(i + tableInstance.columnHeaderLevelCount);
        titleIndex = titleIndex.slice(0, titleIndex.length - 1);
      }
    } else if (currentIndex === recordIndex[0]) {
      titleRows.push(i + tableInstance.columnHeaderLevelCount);
      break;
    }
  }

  return titleRows.reverse();
  // return titleRecords;
}

function cloneGraphic(graphic: VTable.Graphic) {
  const newGraphic = graphic.clone();
  if (graphic.type === 'group') {
    const newGroup = newGraphic as VTable.Group;
    graphic.forEachChildren(child => {
      const newChild = cloneGraphic(child);
      newGroup.add(newChild);
    });
  }
  return newGraphic;
}

function isSkipRow(row, topRow, screenTopRow) {
  if (row === topRow && row !== screenTopRow + (titleRows?.length ?? 0) - 1) {
    return true;
  }

  // const rowLimit = topRow - (titleRows?.length ?? 0);
  const rowIndex = titleRows.indexOf(row);
  const rowLimit = screenTopRow + rowIndex + 1;
  if (row === rowLimit && row < topRow) {
    return true;
  }

  return false;
}
