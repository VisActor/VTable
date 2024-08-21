import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
import { InputEditor } from '@visactor/vtable-editors';
import { bearImageUrl, birdImageUrl, catImageUrl, flowerImageUrl, rabbitImageUrl, wolfImageUrl } from '../resource-url';
const ListTable = VTable.ListTable;
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);
const CONTAINER_ID = 'vTable';

function createRecords(length) {
  const records: any[] = [];
  for (let i = 0; i < length; i++) {
    records.push({
      id: i,
      text: 'text'
    });
  }

  return records;
}

function createColumns(length) {
  const columns: any[] = [];
  for (let i = 0; i < length; i++) {
    columns.push({
      field: 'text',
      title: 'custom',
      width: 120,
      customLayout
    });
  }

  return columns;
}

function customLayout(args: VTable.TYPES.CustomRenderFunctionArg) {
  const { table, row, col, rect } = args;
  const record = table.getRecordByCell(col, row);
  const { height, width } = rect ?? table.getCellRect(col, row);

  const container = new VTable.CustomLayout.Group({
    height,
    width
    // display: 'flex',
    // flexDirection: 'row',
    // flexWrap: 'wrap'
  });

  const tag = new VTable.CustomLayout.Text({
    text: 'tag1',
    textStyle: {
      fontSize: 10,
      fontFamily: 'sans-serif',
      fill: 'rgb(51, 101, 238)'
    },
    panel: {
      visible: true,
      fill: '#f4f4f2',
      cornerRadius: 5
    },
    space: 5,
    marginLeft: 5
  });
  const tag2 = new VTable.CustomLayout.Text({
    x: 50,
    text: 'tag2',
    textStyle: {
      fontSize: 10,
      fontFamily: 'sans-serif',
      fill: 'rgb(51, 101, 238)'
    },
    panel: {
      visible: true,
      fill: '#f4f4f2',
      cornerRadius: 5
    },
    space: 5,
    marginLeft: 5
  });
  container.appendChild(tag);
  container.appendChild(tag2);

  return {
    rootContainer: container,
    renderDefault: false
  };
}

export function createTable() {
  const columns = createColumns(20);
  const records = createRecords(3000);
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'id',
        title: 'id'
      },
      ...columns
    ],
    records,
    // editor: 'input',
    defaultRowHeight: 40,
    defaultColWidth: 120,
    // customMergeCell: (col, row, table) => {
    //   if (col >= 0 && col < table.colCount && row === table.rowCount - 2) {
    //     return {
    //       range: {
    //         start: {
    //           col: 0,
    //           row: table.rowCount - 2
    //         },
    //         end: {
    //           col: table.colCount - 1,
    //           row: table.rowCount - 2
    //         }
    //       },
    //       customLayout: args => {
    //         const { table, row, col, rect } = args;
    //         const { height, width } = rect || table.getCellRect(col, row);
    //         const percentCalc = VTable.CustomLayout.percentCalc;
    //         const container = new VTable.CustomLayout.Group({
    //           height,
    //           width,
    //           display: 'flex',
    //           flexDirection: 'row',
    //           flexWrap: 'nowrap'
    //         });
    //         const containerLeft = new VTable.CustomLayout.Group({
    //           height: percentCalc(100),
    //           width: 160,
    //           display: 'flex',
    //           direction: 'column',
    //           alignContent: 'center',
    //           alignItems: 'center',
    //           justifyContent: 'space-around',
    //           fill: 'blue',
    //           // dx: 200
    //           x: 200
    //         });
    //         container.add(containerLeft);

    //         containerLeft.addEventListener('click', () => {
    //           containerLeft.setAttributes({ fill: 'red' });
    //         });

    //         const containerRight = new VTable.CustomLayout.Group({
    //           height: percentCalc(100),
    //           width: percentCalc(100, -50),
    //           display: 'flex',
    //           direction: 'column'
    //           // justifyContent: 'center'
    //         });
    //         container.add(containerRight);

    //         const containerRightTop = new VTable.CustomLayout.Group({
    //           id: 'containerRightTop',
    //           height: percentCalc(50),
    //           width: percentCalc(100),
    //           display: 'flex',
    //           alignItems: 'center',
    //           flexWrap: 'nowrap'
    //         });

    //         const containerRightBottom = new VTable.CustomLayout.Group({
    //           height: percentCalc(50),
    //           width: percentCalc(100),
    //           display: 'flex',
    //           alignItems: 'center'
    //         });

    //         containerRight.add(containerRightTop);
    //         containerRight.add(containerRightBottom);

    //         const bloggerName = new VTable.CustomLayout.Text({
    //           text: 'record.bloggerName',
    //           fontSize: 13,
    //           fontFamily: 'sans-serif',
    //           fill: 'black',
    //           marginLeft: 10
    //         });
    //         containerRightTop.add(bloggerName);

    //         const location = new VTable.CustomLayout.Icon({
    //           id: 'location',
    //           iconName: 'location',
    //           width: 15,
    //           height: 15,
    //           marginLeft: 10
    //         });
    //         containerRightTop.add(location);

    //         const locationName = new VTable.CustomLayout.Text({
    //           text: 'record.city',
    //           fontSize: 11,
    //           fontFamily: 'sans-serif',
    //           fill: '#6f7070',
    //           boundsPadding: [0, 10, 0, 0]
    //         });
    //         containerRightTop.add(locationName);

    //         return {
    //           rootContainer: container,
    //           renderDefault: false
    //         };
    //       }
    //     };
    //   }
    // },

    rowUpdateBufferCount: 0.1, // 行更新时，同步更新范围buffer系数；默认为1，同步更新为三倍屏幕预计行数（上下buffer各为1）
    columnUpdateBufferCount: 0.1, // 列更新时，同步更新范围buffer系数；默认为1，同步更新为三倍屏幕预计列数（左右buffer各为1）
    progressRowUpdateCount: 5, // 渐进更新行时，每个异步任务更新的行数；默认为屏幕预计行数
    progressColumnUpdateCount: 5, // 渐进更新列时，每个异步任务更新的列数；默认为屏幕预计列数

    renderOption: {
      // disableDirtyBounds: true
    }
  };

  const instance = new ListTable(option);
  // bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['col', 'row', 'role']
  // });

  // const { MOUSEMOVE_CELL } = VTable.ListTable.EVENT_TYPE;
  // instance.addEventListener(MOUSEMOVE_CELL, (...args) => {
  //   console.log('MOUSEMOVE_CELL', args[0]?.target);
  // });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
