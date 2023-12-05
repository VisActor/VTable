import type { Group } from '../graphic/group';
import type { Scenegraph } from '../scenegraph';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import { updateCellHeightForColumn } from './update-height';

/**
 * @description: 场景树节点生成后，处理自动列宽
 * @param {Scenegraph} scene
 * @param {boolean} clearCellSize 是否重新计算单元格高度，false的话使用目前cell记录的高度，true重新计算当前宽度的情况下单元格内容高度；
 * 在调整列宽时为true，在场景结点生成后为false
 * @return {*}
 */
// export function updateAutoRowHeight(scene: Scenegraph, clearCellSize?: boolean) {
//   const colHeader = scene.colHeaderGroup;
//   const rowHeader = scene.rowHeaderGroup;
//   const cornerHeader = scene.cornerHeaderGroup;
//   const body = scene.bodyGroup;

//   // 获取行高
//   for (let row = 0; row <= scene.bodyRowEnd; row++) {
//     let maxRowHeight = 0;
//     for (let col = 0; col < scene.table.colCount; col++) {
//       const cellGroup = scene.getCell(col, row);
//       // maxRowHeight = Math.max(maxRowHeight, cellGroup.attribute.height);
//       const mergeInfo = getCellMergeInfo(scene.table, cellGroup.col, cellGroup.row);
//       if (mergeInfo) {
//         const mergeCell = scene.getCell(mergeInfo.start.col, mergeInfo.start.row);
//         maxRowHeight = Math.max(
//           maxRowHeight,
//           mergeCell.attribute.height / (mergeInfo.end.row - mergeInfo.start.row + 1)
//         );
//       } else {
//         maxRowHeight = Math.max(maxRowHeight, cellGroup.attribute.height);
//       }
//     }
//     scene.table._setRowHeight(row, maxRowHeight, true);
//   }

//   // 设置行高
//   let yTemp = 0;
//   for (let row = 0; row <= scene.bodyRowEnd; row++) {
//     const maxRowHeight = scene.table.getRowHeight(row);
//     if (row === scene.table.columnHeaderLevelCount) {
//       // 更新行表头行高
//       let colHeaderHeight = 0;
//       colHeader?.firstChild?.forEachChildren((cell: Group) => {
//         if (cell.role !== 'shadow-cell') {
//           colHeaderHeight += cell.attribute.height;
//         }
//       });
//       colHeader.setAttribute('height', colHeaderHeight);
//       cornerHeader.setAttribute('height', colHeaderHeight);
//       rowHeader.setAttribute('y', colHeaderHeight);
//       body.setAttribute('y', colHeaderHeight);

//       yTemp = 0;
//     }

//     for (let col = 0; col < scene.table.colCount; col++) {
//       const cellGroup = scene.getCell(col, row);
//       updateCellHeight(cellGroup, scene, col, row, maxRowHeight, yTemp);
//     }
//     yTemp += maxRowHeight;
//   }

//   // 更新容器尺寸
//   rowHeader.setAttribute('height', yTemp);
//   body.setAttribute('height', yTemp);
// }

// 更新单元格高度信息
function updateCellHeight(
  cell: Group,
  scene: Scenegraph,
  col: number,
  row: number,
  maxRowHeight: number,
  yTemp: number,
  column?: Group
) {
  const mergeInfo = getCellMergeInfo(scene.table, col, row);
  if (mergeInfo && mergeInfo.end.row - mergeInfo.start.row) {
    cell = scene.getCell(mergeInfo.start.col, mergeInfo.start.row);
    if (row === mergeInfo.start.row) {
      cell.setAttribute('y', yTemp);
    }

    updateCellHeightForColumn(scene, cell, col, row, maxRowHeight, 0, scene.table.isHeader(col, row));
  } else if (cell.role !== 'shadow-cell') {
    cell.setAttribute('y', yTemp);

    updateCellHeightForColumn(scene, cell, col, row, maxRowHeight, 0, scene.table.isHeader(col, row));
  }
}
