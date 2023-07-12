// import type { CellRange } from '../../ts-types';
// import { dealWithCustom } from '../component/custom';
// import type { Group } from '../graphic/group';
// import type { Scenegraph } from '../scenegraph';
// import { getCellMergeInfo } from '../utils/get-cell-merge';
// import { getQuadProps } from '../utils/padding';
// import { updateCellContentWidth } from '../utils/text-icon-layout';

// /**
//  * @description: 场景树节点生成后，处理自动行高
//  * @param {Scenegraph} scene
//  * @return {*}
//  */
// export function updateAutoColWidth(scene: Scenegraph) {
//   const mergeCells: CellRange[] = [];

//   const { layoutMap } = scene.table.internalProps;
//   for (let col = 0; col < scene.table.colCount; col++) {
//     let columnMaxWidth = 0;
//     const column = layoutMap.columnWidths?.[col] || { width: 'auto' };
//     if (column.width === 'auto' || scene.transpose || (scene.table.widthMode === 'autoWidth' && !column.width)) {
//       // 找到colHeader index列最大宽度
//       const colHeaderColumn = scene.getColGroup(col, true) as Group;
//       if (colHeaderColumn) {
//         colHeaderColumn.forEachChildren((cell: Group, row: number) => {
//           // 处理Merge情况，宽度度均分
//           const mergeInfo = getCellMergeInfo(scene.table, col, row);
//           if (mergeInfo) {
//             const mergeCell = scene.getCell(mergeInfo.start.col, mergeInfo.start.row);
//             columnMaxWidth = Math.max(
//               columnMaxWidth,
//               mergeCell.attribute.width / (mergeInfo.end.col - mergeInfo.start.col + 1)
//             );
//           } else {
//             columnMaxWidth = Math.max(columnMaxWidth, cell.attribute.width);
//           }
//         });
//       }

//       const rowHeaderOrBodyColumn: Group = scene.getColGroup(col);
//       rowHeaderOrBodyColumn.forEachChildren((cell: Group) => {
//         // columnMaxWidth = Math.max(columnMaxWidth, cell.attribute.width);
//         // 处理Merge情况，宽度度均分
//         const mergeInfo = getCellMergeInfo(scene.table, cell.col, cell.row);
//         if (mergeInfo) {
//           const mergeCell = scene.getCell(mergeInfo.start.col, mergeInfo.start.row);
//           columnMaxWidth = Math.max(
//             columnMaxWidth,
//             mergeCell.attribute.width / (mergeInfo.end.col - mergeInfo.start.col + 1)
//           );
//         } else {
//           columnMaxWidth = Math.max(columnMaxWidth, cell.attribute.width);
//         }
//       });

//       // 更新列宽与后续列位置
//       if (colHeaderColumn) {
//         const colHeaderColumnDetaWidth = colHeaderColumn.attribute.width - columnMaxWidth;
//         if (colHeaderColumnDetaWidth) {
//           colHeaderColumn.setAttribute('width', columnMaxWidth);
//           colHeaderColumn.parent.forEachChildren((column: Group) => {
//             const columnCol = column.col;
//             if (columnCol > col) {
//               column.setAttribute('x', column.attribute.x - colHeaderColumnDetaWidth);
//             }
//           });
//         }
//         // 更新最大列宽到column theme
//         colHeaderColumn.setAttribute('width', columnMaxWidth);

//         // 更新最大列宽到column cell
//         colHeaderColumn.forEachChildren((cell: Group, row: number) => {
//           const mergeInfo = getCellMergeInfo(scene.table, cell.col, cell.row);
//           if (mergeInfo && mergeInfo.start.col !== mergeInfo.end.col) {
//             // 处理Merge情况，跨行Merge单元格宽度最后统一处理
//             mergeCells.push(mergeInfo);
//           } else if (cell.role !== 'shadow-cell') {
//             // cell.setAttribute('width', columnMaxWidth);
//             updateCell(cell, columnMaxWidth, scene);
//           }
//         });
//       }

//       // 更新列宽与后续列位置
//       const rowHeaderOrBodyColumnDetaWidth = rowHeaderOrBodyColumn.attribute.width - columnMaxWidth;
//       if (rowHeaderOrBodyColumnDetaWidth) {
//         rowHeaderOrBodyColumn.setAttribute('width', columnMaxWidth);
//         rowHeaderOrBodyColumn.parent.forEachChildren((column: Group) => {
//           const columnCol = column.col;
//           if (columnCol > col) {
//             column.setAttribute('x', column.attribute.x - rowHeaderOrBodyColumnDetaWidth);
//           }
//         });
//       }
//       // 更新最大列宽到column theme
//       rowHeaderOrBodyColumn.setAttribute('width', columnMaxWidth);

//       // 更新最大列宽到column cell
//       rowHeaderOrBodyColumn.forEachChildren((cell: Group, row: number) => {
//         const mergeInfo = getCellMergeInfo(scene.table, cell.col, cell.row);
//         if (mergeInfo && mergeInfo.start.col !== mergeInfo.end.col) {
//           // 处理Merge情况，跨行Merge单元格宽度最后统一处理
//           mergeCells.push(mergeInfo);
//         } else if (cell.role !== 'shadow-cell') {
//           // cell.setAttribute('width', columnMaxWidth);
//           updateCell(cell, columnMaxWidth, scene);
//         }
//       });

//       // 更新table map列宽存储
//       scene.table.setColWidth(col, columnMaxWidth, true);
//     }
//   }

//   // 处理跨行Merge单元格
//   for (let i = 0; i < mergeCells.length; i++) {
//     const mergeInfo = mergeCells[i];
//     const mergeCell = scene.getCell(mergeInfo.start.col, mergeInfo.start.row);
//     let width = 0;
//     for (let j = mergeInfo.start.col; j <= mergeInfo.end.col; j++) {
//       width += scene.getColGroup(j).attribute.width;
//     }

//     updateCell(mergeCell, width, scene);
//   }
// }

// function updateCell(cellGroup: Group, width: number, scene: Scenegraph) {
//   const oldWidth = cellGroup.attribute.width;
//   cellGroup.setAttribute('width', width);

//   const style = scene.table._getCellStyle(cellGroup.col, cellGroup.row);
//   updateCellContentWidth(
//     cellGroup,
//     width,
//     width - oldWidth,
//     scene.table.internalProps.autoRowHeight,
//     getQuadProps(style.padding as number),
//     style.textAlign,
//     style.textBaseline,
//     scene
//   );

//   // 处理自定义渲染
//   const customContainer = cellGroup.getChildByName('custom-container') as Group;
//   if (customContainer) {
//     customContainer.clear();
//     cellGroup.removeChild(customContainer);

//     let customRender;
//     let customLayout;
//     const cellType = scene.table.getCellType(cellGroup.col, cellGroup.row);
//     if (cellType !== 'body') {
//       const define = scene.table.getHeaderDefine(cellGroup.col, cellGroup.row);
//       customRender = define?.headerCustomRender;
//       customLayout = define?.headerCustomLayout;
//     } else {
//       const define = scene.table.getBodyColumnDefine(cellGroup.col, cellGroup.row);
//       customRender = define?.customRender || scene.table.customRender;
//       customLayout = define?.customLayout;
//     }
//     const customResult = dealWithCustom(
//       customLayout,
//       customRender,
//       cellGroup.col,
//       cellGroup.row,
//       cellGroup.attribute.width,
//       cellGroup.attribute.height,
//       false,
//       false,
//       scene.table
//     );
//     cellGroup.appendChild(customResult.elementsGroup);
//   }
// }
