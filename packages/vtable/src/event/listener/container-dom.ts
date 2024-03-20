import { isValid } from '@visactor/vutils';
import type { EventHandler } from '../EventHandler';
import { InteractionState, type KeydownEvent, type ListTableAPI } from '../../ts-types';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import { handleWhell } from '../scroll';
import { browser } from '../../tools/helper';
import type { EventManager } from '../event';
import { BaseTableAPI } from '../../ts-types/base-table';

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

        // 将复制的数据转为html格式
        const setDataToHTML = (data: string) => {
          const result = ['<table>'];
          const META_HEAD = [
            '<meta name="author" content="Visactor"/>', // 后面可用于vtable之间的快速复制粘贴
            //white-space:normal，连续的空白字符会被合并为一个空格，并且文本会根据容器的宽度自动换行显示
            //mso-data-placement:same-cell，excel专用， 在同一个单元格中显示所有数据，而不是默认情况下将数据分散到多个单元格中显示
            '<style type="text/css">td{white-space:normal}br{mso-data-placement:same-cell}</style>'
          ].join('');
          const rows = data.split('\r\n'); // 将数据拆分为行
          rows.forEach(function (rowCells: any, rowIndex: number) {
            const cells = rowCells.split('\t'); // 将行数据拆分为单元格
            const rowValues: string[] = [];
            if (rowIndex === 0) {
              result.push('<tbody>');
            }
            cells.forEach(function (cell: string, cellIndex: number) {
              // 单元格数据处理
              const parsedCellData = !cell
                ? ''
                : cell
                    .toString()
                    .replace(/&/g, '&amp;') // replace & with &amp; to prevent XSS attacks
                    .replace(/'/g, '&#39;') // replace ' with &#39; to prevent XSS attacks
                    .replace(/</g, '&lt;') // replace < with &lt; to prevent XSS attacks
                    .replace(/>/g, '&gt;') // replace > with &gt; to prevent XSS attacks
                    .replace(/\n/g, '<br>') // replace \n with <br> to prevent XSS attacks
                    .replace(/(<br(\s*|\/)>(\r\n|\n)?|\r\n|\n)/g, '<br>\r\n') //   replace <br> with <br>\r\n to prevent XSS attacks
                    .replace(/\x20{2,}/gi, (substring: string | any[]) => {
                      //  excel连续空格序列化
                      return `<span style="mso-spacerun: yes">${'&nbsp;'.repeat(substring.length - 1)} </span>`;
                    }) // replace 2 or more spaces with &nbsp; to prevent XSS attacks
                    .replace(/\t/gi, '&#9;'); //   replace \t with &#9; to prevent XSS attacks

              rowValues.push(`<td>${parsedCellData}</td>`);
            });
            result.push('<tr>', ...rowValues, '</tr>');

            if (rowIndex === rowCells.length - 1) {
              result.push('</tbody>');
            }
          });
          result.push('</table>');
          return [META_HEAD, result.join('')].join('');
        };
        const dataHTML = setDataToHTML(data);
        navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([dataHTML], { type: 'text/html' }),
            'text/plain': new Blob([data], { type: 'text/plain' })
          })
        ]);
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
        const values: (string | number)[][] = [];

        // 读取剪切板数据
        navigator.clipboard.read().then(clipboardItems => {
          for (const item of clipboardItems) {
            // 优先处理 html 格式数据
            if (item.types.includes('text/html')) {
              item.getType('text/html').then(blob => {
                blob.text().then(pastedData => {
                  // 解析html数据
                  if (pastedData && /(<table)|(<TABLE)/g.test(pastedData)) {
                    const regex = /<tr[^>]*>(.*?)<\/tr>/gs; // 匹配<tr>标签及其内容
                    // const matches = pastedData.matchAll(regex);
                    const matches = Array.from(pastedData.matchAll(regex));
                    for (const match of matches) {
                      const rowContent = match[1]; // 获取<tr>标签中的内容
                      const cellRegex = /<td[^>]*>(.*?)<\/td>/gs; // 匹配<td>标签及其内容
                      const cellMatches: RegExpMatchArray[] = Array.from(rowContent.matchAll(cellRegex)); // 获取<td>标签中的内容
                      const rowValues = cellMatches.map(cellMatch => {
                        return (
                          cellMatch[1]
                            .replace(/(<(?!br)([^>]+)>)/gi, '') // 除了 <br> 标签以外的所有 HTML 标签都替换为空字符串
                            .replace(/<br(\s*|\/)>[\r\n]?/gim, '\n') // 将字符串中的 <br> 标签以及其后可能存在的空白字符和斜杠都替换为换行符 \n
                            // .replace(/<br>/g, '\n') // 替换<br>标签为换行符
                            // .replace(/<(?:.|\n)*?>/gm, '') // 去除HTML标签
                            //将字符串中的 HTML 实体字符转换为原始的字符
                            .replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&#9;/gi, '\t')
                            .replace(/&nbsp;/g, ' ')
                        );
                        // .trim(); // 去除首尾空格
                      });
                      values.push(rowValues);
                    }
                    (table as ListTableAPI).changeCellValues(col, row, values, true);
                  } else {
                    navigator.clipboard.read().then(clipboardItems => {
                      for (const item of clipboardItems) {
                        if (item.types.includes('text/plain')) {
                          item.getType('text/plain').then(blob => {
                            blob.text().then(pastedData => {
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
                              (table as ListTableAPI).changeCellValues(col, row, values, true);
                            });
                          });
                        }
                      }
                    });
                  }
                });
              });
            } else if (item.types.length === 1 && item.types[0] === 'text/plain') {
              // 如果只有 'text/plain'
              item.getType('text/plain').then(blob => {
                blob.text().then(pastedData => {
                  const rows = pastedData.replace(/\r(?!\n)/g, '\r\n').split('\r\n'); // 文本中的换行符格式进行统一处理
                  const values: (string | number)[][] = [];
                  if (rows.length > 1 && rows[rows.length - 1] === '') {
                    rows.pop();
                  }
                  rows.forEach(function (rowCells: any, rowIndex: number) {
                    const cells = rowCells.split('\t'); // 将行数据拆分为单元格
                    const rowValues: (string | number)[] = [];
                    values.push(rowValues);
                    cells.forEach(function (cell: string, cellIndex: number) {
                      if (cell.includes('\n')) {
                        cell = cell
                          .replace(/^"(.*)"$/, '$1') // 将字符串开头和结尾的双引号去除，并保留双引号内的内容
                          .replace(/["]*/g, match => new Array(Math.floor(match.length / 2)).fill('"').join('')); // 连续出现的双引号替换为一半数量的双引号
                      }
                      rowValues.push(cell);
                    });
                  });
                });
              });
              (table as ListTableAPI).changeCellValues(col, row, values, true);
            } else {
              // 其他情况
            }
          }
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

  // 有被阻止冒泡的场景 就触发不到这里的事件了 所以这个LastBodyPointerXY变量的赋值在scrollbar的down事件也进行了处理
  const globalPointerdownCallback = (e: MouseEvent) => {
    // console.log('body pointerdown');
    table.eventManager.LastBodyPointerXY = { x: e.x, y: e.y };
    table.eventManager.isDown = true;
  };
  eventManager.globalEventListeners.push({
    name: 'pointerdown',
    env: 'body',
    callback: globalPointerdownCallback
  });
  document.body.addEventListener('pointerdown', globalPointerdownCallback);

  const globalPointerupCallback = (e: MouseEvent) => {
    table.eventManager.LastBodyPointerXY = null;
    // console.log('body pointerup', table.eventManager.isDown, table.eventManager.isDraging);
    table.eventManager.isDown = false;
    table.eventManager.isDraging = false;
  };
  eventManager.globalEventListeners.push({
    name: 'pointerup',
    env: 'document',
    callback: globalPointerupCallback
  });
  document.addEventListener('pointerup', globalPointerupCallback);

  const globalPointermoveCallback = (e: MouseEvent) => {
    if (table.eventManager.isDown && table.eventManager.LastBodyPointerXY) {
      const lastX = table.eventManager.LastBodyPointerXY?.x ?? e.x;
      const lastY = table.eventManager.LastBodyPointerXY?.y ?? e.y;
      if (Math.abs(lastX - e.x) > 1 || Math.abs(lastY - e.y) > 1) {
        table.eventManager.isDraging = true;
      }
    }
    // 注释掉。因为： 这里pointermove太敏感了 点击快的时候 可能动了1px这里也会执行到 就影响到下面选中不触发的问题。下面pointermove就有这段逻辑，这里先去掉
    // if (eventManager.touchSetTimeout) {
    //   clearTimeout(eventManager.touchSetTimeout);
    //   console.log('eventManager.touchSetTimeout', eventManager.touchSetTimeout);
    //   eventManager.touchSetTimeout = undefined;
    // }
    // const eventArgsSet = getCellEventArgsSet(e);
    const { x, y } = table._getMouseAbstractPoint(e, false);
    if (stateManager.interactionState === InteractionState.scrolling) {
      return;
    }
    if (stateManager.interactionState === InteractionState.grabing) {
      if (stateManager.isResizeCol()) {
        eventManager.dealColumnResize(x, y);
        if ((table as any).hasListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN)) {
          table.fireListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN, {
            col: table.stateManager.columnResize.col,
            colWidth: table.getColWidth(table.stateManager.columnResize.col)
          });
        }
      }
    }
  };
  eventManager.globalEventListeners.push({
    name: 'pointermove',
    env: 'body',
    callback: globalPointermoveCallback
  });
  document.body.addEventListener('pointermove', globalPointermoveCallback);
}
