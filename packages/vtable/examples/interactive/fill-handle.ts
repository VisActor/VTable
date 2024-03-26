import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing'
  }));
};

export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then(res => res.json())
    .then(data => {
      const columns = [
        {
          field: 'Order ID',
          title: 'Order ID',
          width: 'auto'
        },
        {
          field: 'Customer ID',
          title: 'Customer ID',
          width: 'auto'
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

      const option = {
        records: data,
        columns,
        widthMode: 'standard',
        excelOptions: {
          fillHandle: true
        }
      };
      const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
      window.tableInstance = tableInstance;
      // 记录 拖拽填充柄之前的选中范围
      let beforeDragMaxCol;
      let beforeDragMinCol;
      let beforeDragMaxRow;
      let beforeDragMinRow;
      tableInstance.on('mousedown_fill_handle', arg => {
        const startSelectCellRange = tableInstance.getSelectedCellRanges()[0];
        beforeDragMaxCol = Math.max(startSelectCellRange.start.col, startSelectCellRange.end.col);
        beforeDragMinCol = Math.min(startSelectCellRange.start.col, startSelectCellRange.end.col);
        beforeDragMaxRow = Math.max(startSelectCellRange.start.row, startSelectCellRange.end.row);
        beforeDragMinRow = Math.min(startSelectCellRange.start.row, startSelectCellRange.end.row);
        console.log('mousedown_fill_handle', beforeDragMinCol, beforeDragMinRow, beforeDragMaxCol, beforeDragMaxRow);
      });
      tableInstance.on('drag_fill_handle_end', arg => {
        console.log('drag_fill_handle_end', arg);

        const direciton = arg.direction;
        let startChangeCellCol;
        let startChangeCellRow;
        let endChangeCellCol;
        let endChangeCellRow;
        const endSelectCellRange = tableInstance.getSelectedCellRanges()[0];
        //根据填充方向 确定需要填充值的范围
        if (direciton === 'bottom') {
          startChangeCellCol = beforeDragMinCol;
          startChangeCellRow = beforeDragMaxRow + 1;
          endChangeCellCol = beforeDragMaxCol;
          endChangeCellRow = endSelectCellRange.end.row;
        } else if (direciton === 'right') {
          startChangeCellCol = beforeDragMaxCol + 1;
          startChangeCellRow = beforeDragMinRow;
          endChangeCellCol = endSelectCellRange.end.col;
          endChangeCellRow = beforeDragMaxRow;
        } else if (direciton === 'top') {
          startChangeCellCol = beforeDragMinCol;
          startChangeCellRow = beforeDragMinRow - 1;
          endChangeCellCol = beforeDragMaxCol;
          endChangeCellRow = endSelectCellRange.end.row;
        } else if (direciton === 'left') {
          startChangeCellCol = beforeDragMinCol - 1;
          startChangeCellRow = beforeDragMinRow;
          endChangeCellCol = endSelectCellRange.end.col;
          endChangeCellRow = beforeDragMaxRow;
        }
        changeTableValues(startChangeCellCol, startChangeCellRow, endChangeCellCol, endChangeCellRow);
      });
      tableInstance.on('dblclick_fill_handle', arg => {
        console.log('dblclick_fill_handle');
      });

      function changeTableValues(startChangeCellCol, startChangeCellRow, endChangeCellCol, endChangeCellRow) {
        const startCol = Math.min(startChangeCellCol, endChangeCellCol);
        const startRow = Math.min(startChangeCellRow, endChangeCellRow);
        const endCol = Math.max(startChangeCellCol, endChangeCellCol);
        const endRow = Math.max(startChangeCellRow, endChangeCellRow);
        const values = [];
        for (let row = startRow; row <= endRow; row++) {
          const rowValues = [];
          for (let col = startCol; col <= endCol; col++) {
            rowValues.push(`col-row:${col}-${row}`);
          }
          values.push(rowValues);
        }
        tableInstance.changeCellValues(startCol, startRow, values);
      }
    });
  // setTimeout(() => {
  //   tableInstance.addRecord({ id: 333 }, 6);
  // }, 3000);
  // tableInstance.on('sort_click', args => {
  //   tableInstance.updateSortState(
  //     {
  //       field: args.field,
  //       order: Date.now() % 3 === 0 ? 'desc' : Date.now() % 3 === 1 ? 'asc' : 'normal'
  //     },
  //     false
  //   );
  //   return false; //return false代表不执行内部排序逻辑
  // });
}
