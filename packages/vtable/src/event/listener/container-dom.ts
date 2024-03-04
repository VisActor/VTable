import { isValid } from '@visactor/vutils';
import type { EventHandler } from '../EventHandler';
import type { KeydownEvent, ListTableAPI } from '../../ts-types';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import { handleWhell } from '../scroll';
import { browser } from '../../tools/helper';
import type { EventManager } from '../event';

export function bindContainerDomListener(eventManager: EventManager) {
  const table = eventManager.table;
  const stateManager = table.stateManager;
  const handler: EventHandler = table.internalProps.handler;

  // handler.on(table.getElement(), 'mousedown', (e: MouseEvent) => {
  // if (table.eventManager.isPointerDownOnTable) {
  //   e.stopPropagation();
  // }
  // });

  handler.on(table.getElement(), 'blur', (e: MouseEvent) => {
    eventManager.dealTableHover();
    // eventManager.dealTableSelect();
  });

  handler.on(table.getElement(), 'wheel', (e: WheelEvent) => {
    handleWhell(e, stateManager);
  });

  // 监听键盘事件
  handler.on(table.getElement(), 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      if (table.keyboardOptions?.selectAllOnCtrlA) {
        // 处理全选
        e.preventDefault();
        //全选
        eventManager.deelTableSelectAll();
      }
    } else if (
      stateManager.select.cellPos.col >= 0 &&
      stateManager.select.cellPos.row >= 0 &&
      (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')
    ) {
      if (
        !(table.options.keyboardOptions?.moveEditCellOnArrowKeys ?? false) &&
        (table as ListTableAPI).editorManager.editingEditor
      ) {
        // 编辑单元格状态下 如果没有开启方向键切换cell 则退出 。方向键可以在编辑input内移动光标
        return;
      }
      e.preventDefault();
      // 如果不加这句话 外部监听了键盘事件 会影响表格本身的移动格子功能，例如自定义日历编辑器的日期选择pickday.js
      //可能会引起其他问题  例如自定义实现了日历编辑器 里面切换日期左右键可能失效，这个时候建议监听VTable实例的事件keydown
      e.stopPropagation();
      let targetCol;
      let targetRow;

      // 处理向上箭头键
      if (e.key === 'ArrowUp') {
        targetCol = stateManager.select.cellPos.col;
        targetRow = Math.min(table.rowCount - 1, Math.max(0, stateManager.select.cellPos.row - 1));
      } else if (e.key === 'ArrowDown') {
        // 处理向下箭头键
        targetCol = stateManager.select.cellPos.col;
        targetRow = Math.min(table.rowCount - 1, Math.max(0, stateManager.select.cellPos.row + 1));
      } else if (e.key === 'ArrowLeft') {
        // 处理向左箭头键
        targetRow = stateManager.select.cellPos.row;
        targetCol = Math.min(table.colCount - 1, Math.max(0, stateManager.select.cellPos.col - 1));
      } else if (e.key === 'ArrowRight') {
        // 处理向右箭头键
        targetRow = stateManager.select.cellPos.row;
        targetCol = Math.min(table.colCount - 1, Math.max(0, stateManager.select.cellPos.col + 1));
      }
      table.selectCell(targetCol, targetRow);
      if (
        (table.options.keyboardOptions?.moveEditCellOnArrowKeys ?? false) &&
        (table as ListTableAPI).editorManager.editingEditor
      ) {
        // 开启了方向键切换编辑单元格  并且当前已经在编辑状态下 切换到下一个需先退出再进入下个单元格的编辑
        (table as ListTableAPI).editorManager.completeEdit();
        table.getElement().focus();
        if ((table as ListTableAPI).getEditor(targetCol, targetRow)) {
          (table as ListTableAPI).editorManager.startEditCell(targetCol, targetRow);
        }
      }
    } else if (e.key === 'Escape') {
      (table as ListTableAPI).editorManager.cancelEdit();
    } else if (e.key === 'Enter') {
      // 如果按enter键 可以结束当前的编辑 或开启编辑选中的单元格（仅限单选）
      if ((table as ListTableAPI).editorManager.editingEditor) {
        (table as ListTableAPI).editorManager.completeEdit();
        table.getElement().focus();
      } else {
        if (
          (table.options.keyboardOptions?.editCellOnEnter ?? true) &&
          (table.stateManager.select.ranges?.length ?? 0) === 1
        ) {
          // 如果开启按enter键进入编辑的配置 且当前有选中的单元格 则进入编辑
          const startCol = table.stateManager.select.ranges[0].start.col;
          const startRow = table.stateManager.select.ranges[0].start.row;
          const endCol = table.stateManager.select.ranges[0].end.col;
          const endRow = table.stateManager.select.ranges[0].end.row;
          if (startCol === endCol && startRow === endRow) {
            if ((table as ListTableAPI).getEditor(startCol, startRow)) {
              (table as ListTableAPI).editorManager.startEditCell(startCol, startRow);
            }
          }
        }
      }
    } else if (e.key === 'Tab') {
      if (table.options.keyboardOptions?.moveFocusCellOnTab ?? true) {
        e.preventDefault();
        if (stateManager.select.cellPos.col >= 0 && stateManager.select.cellPos.row >= 0) {
          let targetCol;
          let targetRow;
          if (stateManager.select.cellPos.col === table.colCount - 1) {
            targetRow = Math.min(table.rowCount - 1, stateManager.select.cellPos.row + 1);
            targetCol = table.rowHeaderLevelCount;
          } else if (stateManager.select.cellPos.row === table.rowCount - 1) {
            targetRow = table.rowCount - 1;
            targetCol = table.rowHeaderLevelCount;
          } else {
            targetRow = stateManager.select.cellPos.row;
            targetCol = stateManager.select.cellPos.col + 1;
          }
          table.selectCell(targetCol, targetRow);
          if ((table as ListTableAPI).editorManager.editingEditor) {
            (table as ListTableAPI).editorManager.completeEdit();
            table.getElement().focus();
            if ((table as ListTableAPI).getEditor(targetCol, targetRow)) {
              (table as ListTableAPI).editorManager.startEditCell(targetCol, targetRow);
            }
          }
        }
      }
    }

    if ((table as any).hasListeners(TABLE_EVENT_TYPE.KEYDOWN)) {
      const cellsEvent: KeydownEvent = {
        keyCode: e.keyCode ?? e.which,
        code: e.code,
        event: e,
        // cells: table.getSelectedCellInfos(),
        scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth
      };
      table.fireListeners(TABLE_EVENT_TYPE.KEYDOWN, cellsEvent);
    }
  });

  handler.on(table.getElement(), 'copy', (e: KeyboardEvent) => {
    if (table.keyboardOptions?.copySelected) {
      const data = table.getCopyValue();
      if (isValid(data)) {
        e.preventDefault();
        // if (browser.IE) {
        //   (window as any).clipboardData.setData('Text', data); // IE
        // } else {
        //   (e as any).clipboardData.setData('text/plain', data); // Chrome, Firefox
        // }
        const parsedCellData = data.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\r\n/g, '</td></tr><tr><td>').replace(/\t/g, '</td><td>').replace(/(<br(\s*|\/)>(\r\n|\n)?|\r\n|\n)/g, '<br>\r\n').replace(/\x20{2,}/gi, substring => {
          // excel空格序列化
          return `<span style="mso-spacerun: yes">${'&nbsp;'.repeat(substring.length - 1)} </span>`;
        });
        const result = `<table><tbody><tr><td>${parsedCellData}</td></tr></tbody></table>`;
        navigator.clipboard.writeText(result);
        navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([result], { type: 'text/html' }),
          })
        ])
        table.fireListeners(TABLE_EVENT_TYPE.COPY_DATA, {
          cellRange: table.stateManager.select.ranges,
          copyData: data
        });
      }
    }
  });
  handler.on(table.getElement(), 'paste', (e: any) => {
    if (table.keyboardOptions?.pasteValueToCell && (table as ListTableAPI).changeCellValues) {
      if ((table as ListTableAPI).editorManager?.editingEditor) {
        return;
      }
      if (table.stateManager.select.ranges?.length > 0) {
        const ranges = table.stateManager.select.ranges;
        const col = Math.min(ranges[0].start.col, ranges[0].end.col);
        const row = Math.min(ranges[0].start.row, ranges[0].end.row);

        // const clipboardData = e.clipboardData || window.Clipboard;
        // const pastedData = clipboardData.getData('text');
        // const rows = pastedData.split('\n'); // 将数据拆分为行
        // const values: (string | number)[][] = [];
        // rows.forEach(function (rowCells: any, rowIndex: number) {
        //   const cells = rowCells.split('\t'); // 将行数据拆分为单元格
        //   const rowValues: (string | number)[] = [];
        //   values.push(rowValues);
        //   cells.forEach(function (cell: string, cellIndex: number) {
        //     // 去掉单元格数据末尾的 '\r'
        //     if (cellIndex === cells.length - 1) {
        //       cell = cell.trim();
        //     }
        //     rowValues.push(cell);
        //   });
        // });
        
        navigator.clipboard.read().then(clipboardItems => {
          for (const item of clipboardItems) {
          
            if (item.types.includes('text/html')) {
              item.getType('text/html').then(blob => {
              
                blob.text().then(pastedData => {
                  const values: (string | number)[][] = [];
                  if (pastedData && /(<table)|(<TABLE)/g.test(pastedData)) {
                    const regex = /<tr[^>]*>(.*?)<\/tr>/gs; // 匹配<tr>标签及其内容
                    // const matches = pastedData.matchAll(regex);
                    const matches = Array.from(pastedData.matchAll(regex)); 
                    for (const match of matches) {
                      const rowContent = match[1]; // 获取<tr>标签中的内容
                      const cellRegex = /<td[^>]*>(.*?)<\/td>/gs; // 匹配<td>标签及其内容
                      const cellMatches: RegExpMatchArray[] = Array.from(rowContent.matchAll(cellRegex));
                      const rowValues = cellMatches.map(cellMatch => {
                        return cellMatch[1]
                        .replace(/(<(?!br)([^>]+)>)/gi, '')
                        .replace(/<br(\s*|\/)>[\r\n]?/gim, '\n')
                          // .replace(/<br>/g, '\n') // 替换<br>标签为换行符
                          // .replace(/<(?:.|\n)*?>/gm, '') // 去除HTML标签
                          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#9;/gi, '\t').replace(/&nbsp;/g, ' ')
                          // .trim(); // 去除首尾空格
                      });
                      values.push(rowValues);
                    }
                  } else {
                      const rows = pastedData.split('\n'); // 将数据拆分为行
                      rows.forEach(function (rowCells: any, rowIndex: number) {
                        const cells = rowCells.split('\t'); // 将行数据拆分为单元格
                        const rowValues: (string | number)[] = [];
                        values.push(rowValues);
                        cells.forEach(function (cell: string, cellIndex: number) {
                          // 去掉单元格数据末尾的 '\r'
                          if (cellIndex === cells.length - 1) {
                            cell = cell.trim();
                          }
                          rowValues.push(cell);
                        });
                      });
                  }
                  (table as ListTableAPI).changeCellValues(col, row, values);

                }).catch(error => {
             
                });
              }).catch(error => {
           
              });
            } else if (item.types.length === 1 && item.types[0] === 'text/plain') {
                // 如果只有 'text/plain'
                item.getType('text/plain').then(blob => {
         
                blob.text().then(pastedData => {
                const rows = pastedData.replace(/\r(?!\n)/g, '\r\n').split('\r\n'); // 将数据拆分为行
                if (rows.length > 1 && rows[rows.length - 1] === '') {
                  rows.pop();
                }
                const values: (string | number)[][] = [];
                rows.forEach(function (rowCells: any, rowIndex: number) {
                  const cells = rowCells.split('\t'); // 将行数据拆分为单元格
                  const rowValues: (string | number)[] = [];
                  values.push(rowValues);
                  cells.forEach(function (cell: string, cellIndex: number) {
            
                    if (cell.includes("\n")) {
                      cell = cell.replace(/^"(.*)"$/, '$1')
                      .replace(/["]*/g, match => (new Array(Math.floor(match.length / 2))).fill('"').join(''));
                    }
                    rowValues.push(cell);
                  });
                });

                  (table as ListTableAPI).changeCellValues(col, row, values);
                }).catch(error => {
            
                  });
              }).catch(error => {
      
                });
              } else {
              // 其他情况
           
            }
          }
        }).catch(error => {
        });

      }
    }
  });
  handler.on(table.getElement(), 'contextmenu', (e: any) => {
    if (table.eventOptions?.preventDefaultContextMenu !== false) {
      e.preventDefault();
    }
  });

  handler.on(table.getContainer(), 'resize', e => {
    if (e.width === 0 && e.height === 0) {
      // 临时绕行解决因为display设置为none产生的问题
      return;
    }
    table.resize();
  });
}
