import { isValid } from '@visactor/vutils';
import type { EventHandler } from '../EventHandler';
import type { ListTableConstructorOptions, MousePointerMultiCellEvent } from '../../ts-types';
import { InteractionState, type KeydownEvent, type ListTableAPI } from '../../ts-types';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import { handleWhell } from '../scroll';
import { browser, getPromiseValue } from '../../tools/helper';
import type { EventManager } from '../event';
import { getPixelRatio } from '../../tools/pixel-ratio';
import { endResizeCol, endResizeRow } from './table-group';
import { isCellDisableSelect } from '../../state/select/is-cell-select-highlight';
import { fireMoveColEventListeners } from '../helper';
import { vglobal } from '@src/vrender';
export function bindContainerDomListener(eventManager: EventManager) {
  const table = eventManager.table;
  const stateManager = table.stateManager;
  const handler: EventHandler = table.internalProps.handler;

  // handler.on(table.getElement(), 'mousedown', (e: MouseEvent) => {
  // if (table.eventManager.isPointerDownOnTable) {
  //   e.stopPropagation();
  // }
  // });

  handler.on(table.getElement(), 'blur', (e: FocusEvent) => {
    // 检查焦点是否转移到了表格内部的元素（如 editInputElement）
    // 如果是，则不处理 blur 事件，避免在编辑时触发不必要的逻辑
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget) {
      // 检查是否是编辑器内部的 input
      const selectedRanges = table.stateManager.select.ranges;
      const justOneCellSelected =
        selectedRanges.length === 1 &&
        selectedRanges[0].start.col === selectedRanges[0].end.col &&
        selectedRanges[0].start.row === selectedRanges[0].end.row;
      const editor =
        justOneCellSelected &&
        (table as ListTableAPI).getEditor &&
        (table as ListTableAPI).getEditor(table.stateManager.select.cellPos.col, table.stateManager.select.cellPos.row);
      const editorInput = editor?.getInputElement?.();
      if (editorInput === relatedTarget) {
        return;
      }
    }

    eventManager.dealTableHover();
    // eventManager.dealTableSelect();
  });

  // 监听键盘事件
  handler.on(table.getElement(), 'keydown', (e: KeyboardEvent) => {
    // 键盘按下事件 内部逻辑处理前
    const beforeKeydownEvent: KeydownEvent = {
      keyCode: e.keyCode ?? e.which,
      code: e.code,
      event: e
    };
    table.fireListeners(TABLE_EVENT_TYPE.BEFORE_KEYDOWN, beforeKeydownEvent);
    // 键盘按下事件 内部逻辑处理
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
        (!(table.options.keyboardOptions?.moveEditCellOnArrowKeys ?? false) &&
          (table as ListTableAPI).editorManager?.editingEditor) ||
        table.options.keyboardOptions?.moveSelectedCellOnArrowKeys === false
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
        if (e.ctrlKey || e.metaKey) {
          targetCol = stateManager.select.cellPos.col;
          targetRow = 0;
        } else if (e.shiftKey) {
          targetCol = stateManager.select.cellPos.col;
          targetRow = Math.min(table.rowCount - 1, Math.max(0, stateManager.select.cellPos.row - 1));
        } else {
          targetCol = stateManager.select.cellPos.col;
          targetRow = Math.min(table.rowCount - 1, Math.max(0, stateManager.select.cellPos.row - 1));
        }
      } else if (e.key === 'ArrowDown') {
        // 处理向下箭头键
        if (e.ctrlKey || e.metaKey) {
          targetCol = stateManager.select.cellPos.col;
          targetRow = table.rowCount - 1;
        } else if (e.shiftKey) {
          targetCol = stateManager.select.cellPos.col;
          targetRow = Math.min(table.rowCount - 1, Math.max(0, stateManager.select.cellPos.row + 1));
        } else {
          targetCol = stateManager.select.cellPos.col;
          targetRow = Math.min(table.rowCount - 1, Math.max(0, stateManager.select.cellPos.row + 1));
        }
      } else if (e.key === 'ArrowLeft') {
        // 处理向左箭头键
        if (e.ctrlKey || e.metaKey) {
          targetCol = 0;
          targetRow = stateManager.select.cellPos.row;
        } else if (e.shiftKey) {
          targetRow = stateManager.select.cellPos.row;
          targetCol = Math.min(table.colCount - 1, Math.max(0, stateManager.select.cellPos.col - 1));
        } else {
          targetRow = stateManager.select.cellPos.row;
          targetCol = Math.min(table.colCount - 1, Math.max(0, stateManager.select.cellPos.col - 1));
        }
      } else if (e.key === 'ArrowRight') {
        // 处理向右箭头键
        if (e.ctrlKey || e.metaKey) {
          targetCol = table.colCount - 1;
          targetRow = stateManager.select.cellPos.row;
        } else if (e.shiftKey) {
          targetRow = stateManager.select.cellPos.row;
          targetCol = Math.min(table.colCount - 1, Math.max(0, stateManager.select.cellPos.col + 1));
        } else {
          targetRow = stateManager.select.cellPos.row;
          targetCol = Math.min(table.colCount - 1, Math.max(0, stateManager.select.cellPos.col + 1));
        }
      }
      // 如果是不支持选中的单元格 则退出
      if (isCellDisableSelect(table, targetCol, targetRow)) {
        return;
      }
      const isEditingCell = !!(table as ListTableAPI).editorManager?.editingEditor;
      // 下面这句completeEdit代码和selectCell代码顺序很重要，不能颠倒，否则会导致编辑器失去焦点（selectCell会触发到edit-manager的selected_changed事件，getEditor会创建editor实例并缓存，completeEdit会清空缓存）
      (table as ListTableAPI).editorManager?.completeEdit();
      table.getElement().focus();
      const enableShiftSelectMode = table.options.keyboardOptions?.shiftMultiSelect ?? true;
      table.selectCell(targetCol, targetRow, e.shiftKey && enableShiftSelectMode);
      if ((table.options.keyboardOptions?.moveEditCellOnArrowKeys ?? false) && isEditingCell) {
        // 开启了方向键切换编辑单元格  并且当前已经在编辑状态下 切换到下一个需先退出再进入下个单元格的编辑
        if ((table as ListTableAPI).getEditor(targetCol, targetRow)) {
          (table as ListTableAPI).editorManager?.startEditCell(targetCol, targetRow);
        }
      }
    } else if (e.key === 'Escape') {
      (table as ListTableAPI).editorManager?.cancelEdit();
      table.getElement().focus();
    } else if (e.key === 'Enter') {
      // 如果按enter键 可以结束当前的编辑 或开启编辑选中的单元格（仅限单选）
      if ((table as ListTableAPI).editorManager?.editingEditor) {
        // 如果是结束当前编辑，且有主动监听keydown事件，则先触发keydown事件，之后再结束编辑
        handleKeydownListener(e);
        (table as ListTableAPI).editorManager?.completeEdit();
        table.getElement().focus();

        if (table.options.keyboardOptions?.moveFocusCellOnEnter === true) {
          // 利用enter键选中下一个单元格
          const targetCol = stateManager.select.cellPos.col;
          const targetRow = Math.min(table.rowCount - 1, Math.max(0, stateManager.select.cellPos.row + 1));
          // 如果是不支持选中的单元格 则退出
          if (isCellDisableSelect(table, targetCol, targetRow)) {
            return;
          }
          const enableShiftSelectMode = table.options.keyboardOptions?.shiftMultiSelect ?? true;
          table.selectCell(targetCol, targetRow, e.shiftKey && enableShiftSelectMode);
        }
        // 直接返回，不再触发最后的keydown监听事件相关代码
        return;
      }
      if (table.options.keyboardOptions?.moveFocusCellOnEnter === true) {
        // 利用enter键选中下一个单元格
        const targetCol = stateManager.select.cellPos.col;
        const targetRow = Math.min(table.rowCount - 1, Math.max(0, stateManager.select.cellPos.row + 1));
        // 如果是不支持选中的单元格 则退出
        if (isCellDisableSelect(table, targetCol, targetRow)) {
          return;
        }
        const enableShiftSelectMode = table.options.keyboardOptions?.shiftMultiSelect ?? true;
        table.selectCell(targetCol, targetRow, e.shiftKey && enableShiftSelectMode);
      } else if (
        (table.options.keyboardOptions?.editCellOnEnter ?? true) &&
        (table.stateManager.select.ranges?.length ?? 0) === 1
      ) {
        // 如果开启按enter键进入编辑的配置 且当前有选中的单元格 则进入编辑（仅限单选）
        const startCol = table.stateManager.select.ranges[0].start.col;
        const startRow = table.stateManager.select.ranges[0].start.row;
        const endCol = table.stateManager.select.ranges[0].end.col;
        const endRow = table.stateManager.select.ranges[0].end.row;
        if (startCol === endCol && startRow === endRow) {
          if ((table as ListTableAPI).getEditor(startCol, startRow)) {
            (table as ListTableAPI).editorManager?.startEditCell(startCol, startRow);
          }
        }
      }
    } else if (e.key === 'Tab') {
      if (table.options.keyboardOptions?.moveFocusCellOnTab ?? true) {
        if (stateManager.select.cellPos.col >= 0 && stateManager.select.cellPos.row >= 0) {
          const isLastCell =
            stateManager.select.cellPos.col === table.colCount - 1 &&
            stateManager.select.cellPos.row === table.rowCount - 1;

          if (isLastCell) {
            return;
          }

          e.preventDefault();

          let targetCol;
          let targetRow;
          if (stateManager.select.cellPos.col === table.colCount - 1) {
            targetRow = Math.min(table.rowCount - 1, stateManager.select.cellPos.row + 1);
            targetCol = table.rowHeaderLevelCount;
          } else {
            targetRow = stateManager.select.cellPos.row;
            targetCol = stateManager.select.cellPos.col + 1;
          }
          // 如果是不支持选中的单元格 则退出
          if (isCellDisableSelect(table, targetCol, targetRow)) {
            return;
          }
          const isEditingCell = !!(table as ListTableAPI).editorManager?.editingEditor;
          // 下面这句completeEdit代码和selectCell代码顺序很重要，不能颠倒，否则会导致编辑器失去焦点（selectCell会触发到edit-manager的selected_changed事件，getEditor会创建editor实例并缓存，completeEdit会清空缓存）
          (table as ListTableAPI).editorManager?.completeEdit();
          table.getElement().focus();
          table.selectCell(targetCol, targetRow);
          if (isEditingCell) {
            if ((table as ListTableAPI).getEditor(targetCol, targetRow)) {
              (table as ListTableAPI).editorManager?.startEditCell(targetCol, targetRow);
            }
          }
        }
      }
    } else if (!(e.ctrlKey || e.metaKey)) {
      const editCellTrigger = (table.options as ListTableConstructorOptions).editCellTrigger;
      const selectedRanges = table.stateManager.select.ranges;
      const justOneCellSelected =
        selectedRanges.length === 1 &&
        selectedRanges[0].start.col === selectedRanges[0].end.col &&
        selectedRanges[0].start.row === selectedRanges[0].end.row;
      if (justOneCellSelected) {
        if (
          (editCellTrigger === 'keydown' || (Array.isArray(editCellTrigger) && editCellTrigger.includes('keydown'))) &&
          !table.editorManager?.editingEditor
        ) {
          const allowedKeys = /^[a-zA-Z0-9+\-*\/%=.,\s]$/; // 允许的键值正则表达式
          if (e.key.match(allowedKeys)) {
            table.editorManager && (table.editorManager.beginTriggerEditCellMode = 'keydown');
            table.editorManager?.startEditCell(stateManager.select.cellPos.col, stateManager.select.cellPos.row, '');
          }
        }
      }
    }
    handleKeydownListener(e);
  });

  /**
   * 处理主动注册的keydown事件
   * @param e
   */
  function handleKeydownListener(e: KeyboardEvent) {
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
  }

  handler.on(table.getElement(), 'copy', async (e: KeyboardEvent) => {
    if (table.keyboardOptions?.copySelected) {
      eventManager.handleCopy(e);
    }
  });
  handler.on(table.getElement(), 'cut', async (e: KeyboardEvent) => {
    if (table.keyboardOptions?.cutSelected) {
      eventManager.handleCut(e);
    }
  });
  handler.on(table.getElement(), 'paste', async (e: any) => {
    if (table.keyboardOptions?.pasteValueToCell) {
      eventManager.handlePaste(e);
    }
  });

  handler.on(table.getElement(), 'contextmenu', (e: any) => {
    if (table.eventOptions?.preventDefaultContextMenu !== false) {
      e.preventDefault();
    } else {
      // default context menu will cause pointerup event can not trigger
      // call manually
      globalPointerupCallback(e);
    }
  });

  if (!table.options.canvas) {
    handler.on(table.getContainer(), 'resize', e => {
      if (table.isReleased) {
        return;
      }
      if (e.width === 0 && e.height === 0) {
        // 临时绕行解决因为display设置为none产生的问题
        return;
      }
      if (
        table.autoFillWidth ||
        table.autoFillHeight ||
        table.widthMode === 'adaptive' ||
        table.heightMode === 'adaptive'
      ) {
        table.editorManager?.completeEdit();
      }
      if (!isValid(table.options.pixelRatio)) {
        table.setPixelRatio(getPixelRatio());
      }
      if (!e.windowSizeNotChange) {
        table.resize();
      }
    });
  }

  // 有被阻止冒泡的场景 就触发不到这里的事件了 所以这个LastBodyPointerXY变量的赋值在scrollbar的down事件也进行了处理
  const globalPointerdownCallback = (e: MouseEvent) => {
    if (table.isReleased) {
      return;
    }
    // console.log('body pointerdown');
    table.eventManager.LastBodyPointerXY = { x: e.x, y: e.y };
    table.eventManager.isDown = true;

    const target = e.target as HTMLElement;
    if (
      !table.getElement().contains(target) &&
      !table.internalProps.menuHandler.containElement(target) &&
      (!table.options.customConfig?.shouldTreatAsClickOnTable ||
        (table.options.customConfig?.shouldTreatAsClickOnTable &&
          !table.options.customConfig?.shouldTreatAsClickOnTable(e)))
    ) {
      // 如果点击到表格外部的dom
      const isCompleteEdit = (table as ListTableAPI).editorManager?.completeEdit(e);
      getPromiseValue<boolean>(isCompleteEdit, isCompleteEdit => {
        if (isCompleteEdit === false) {
          // 如果没有正常退出编辑状态 则不执行下面的逻辑 如选择其他单元格的逻辑
          return;
        }
        //点击到表格外部不需要取消选中状态
        if (table.options.select?.outsideClickDeselect) {
          const isHasSelected = !!stateManager.select.ranges?.length;
          eventManager.dealTableSelect();
          stateManager.endSelectCells(true, isHasSelected);
        }
      });
      table.scenegraph.updateChartState(null, undefined);
      table.scenegraph.deactivateChart(-1, -1, true);
    }
  };
  eventManager.globalEventListeners.push({
    name: 'pointerdown',
    env: 'vglobal',
    callback: globalPointerdownCallback
  });
  vglobal.addEventListener('pointerdown', globalPointerdownCallback);

  const globalPointerupOutsideCallback = (e: MouseEvent) => {
    // console.log('pointerupoutside');
    // const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    if (stateManager.menu.isShow) {
      setTimeout(() => {
        // conside page scroll
        if (!table.internalProps.menuHandler.pointInMenuElement(e.clientX, e.clientY)) {
          stateManager.menu.isShow && stateManager.hideMenu();
        }
      }, 0);
    }
    // 同pointerup中的逻辑
    if (stateManager.isResizeCol()) {
      endResizeCol(table);
    } else if (stateManager.isResizeRow()) {
      endResizeRow(table);
    } else if (stateManager.isMoveCol()) {
      const endMoveColSuccess = table.stateManager.endMoveCol();
      fireMoveColEventListeners(table, endMoveColSuccess, e);
    } else if (stateManager.isSelecting()) {
      if (table.stateManager.select?.ranges?.length) {
        const lastCol = table.stateManager.select.ranges[table.stateManager.select.ranges.length - 1].end.col;
        const lastRow = table.stateManager.select.ranges[table.stateManager.select.ranges.length - 1].end.row;
        table.stateManager.endSelectCells();
        if ((table as any).hasListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END)) {
          const cellsEvent: MousePointerMultiCellEvent = {
            event: e,
            cells: [],
            col: lastCol,
            row: lastRow,
            scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
            target: undefined
          };
          cellsEvent.cells = table.getSelectedCellInfos();
          table.fireListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END, cellsEvent);
        }
      }
    }
  };

  const globalPointerupCallback = (e: MouseEvent) => {
    if (table.isReleased) {
      return;
    }
    const target = e.target as HTMLElement;

    if (target !== table.canvas) {
      globalPointerupOutsideCallback(e);
    }

    table.eventManager.LastBodyPointerXY = null;
    // console.log('body pointerup', table.eventManager.isDown, table.eventManager.isDraging);
    table.eventManager.isDown = false;
    table.eventManager.isDraging = false;
    table.eventManager.inertiaScroll.endInertia();
    if (stateManager.interactionState === 'grabing' && stateManager.isResizeCol()) {
      endResizeCol(table);
    } else if (stateManager.interactionState === 'grabing' && stateManager.isResizeRow()) {
      endResizeRow(table);
    } else if (stateManager.isMoveCol()) {
      const endMoveColSuccess = table.stateManager.endMoveCol();
      fireMoveColEventListeners(table, endMoveColSuccess, e);
    } else if (table.editorManager?.editingEditor) {
      if (!table.getElement().contains(target)) {
        // 如果点击到表格外部的dom
        const isCompleteEdit = (table as ListTableAPI).editorManager?.completeEdit(e);
        getPromiseValue<boolean>(isCompleteEdit, (isCompleteEdit: boolean) => {
          if (isCompleteEdit === false) {
            // 如果没有正常退出编辑状态 则不执行下面的逻辑 如选择其他单元格的逻辑
            return;
          }
          stateManager.updateInteractionState(InteractionState.default);
          eventManager.dealTableHover();
        });
      }
    }
    stateManager.updateInteractionState(InteractionState.default);
  };
  eventManager.globalEventListeners.push({
    name: 'pointerup',
    env: 'vglobal',
    callback: globalPointerupCallback
  });
  vglobal.addEventListener('pointerup', globalPointerupCallback);

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
    const { x, y } = table._getMouseAbstractPoint(e);
    // if (stateManager.interactionState === InteractionState.scrolling) {
    //   return;
    // }
    if (stateManager.interactionState === InteractionState.grabing) {
      if (stateManager.isResizeCol()) {
        eventManager.dealColumnResize(x, y);
        if ((table as any).hasListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN)) {
          table.fireListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN, {
            col: table.stateManager.columnResize.col,
            colWidth: table.getColWidth(table.stateManager.columnResize.col)
          });
        }
      } else if (stateManager.isResizeRow()) {
        eventManager.dealRowResize(x, y);
        if ((table as any).hasListeners(TABLE_EVENT_TYPE.RESIZE_ROW)) {
          table.fireListeners(TABLE_EVENT_TYPE.RESIZE_ROW, {
            row: table.stateManager.rowResize.row,
            rowHeight: table.getRowHeight(table.stateManager.rowResize.row)
          });
        }
      } else if (stateManager.isMoveCol()) {
        eventManager.dealColumnMover(x, y, e);
      }
    }
    const isSelecting = table.stateManager.isSelecting();

    if (
      eventManager._enableTableScroll &&
      eventManager.isDraging &&
      isSelecting &&
      table.stateManager.select.ranges?.length > 0
    ) {
      // 检测鼠标是否离开了table
      const drawRange = table.getDrawRange();
      // const element = table.getElement();
      // const { x: rootLeft, y: rootTop, width: rootWidth } = element.getBoundingClientRect();
      // const tableLeft = drawRange.left + rootLeft;
      // const tableTop = drawRange.top + rootTop;
      // const tableRight = tableLeft + drawRange.width;
      // const tableBottom = tableTop + drawRange.height;
      // console.log('x, y', x, y);
      const topFrozenRowHeight = table.getFrozenRowsHeight();
      const bottomFrozenRowHeight = table.getBottomFrozenRowsHeight();
      const leftFrozenColsWidth = table.getFrozenColsWidth();
      const rightFrozenColsWidth = table.getRightFrozenColsWidth();
      const startCell = table.stateManager.select.ranges[table.stateManager.select.ranges.length - 1].start;
      if (table.isSeriesNumber(startCell.col, startCell.row)) {
        //如果是鼠标落到了序号列 不自动滚动
        return;
      }
      const endCell = table.stateManager.select.ranges[table.stateManager.select.ranges.length - 1].end;
      const canScrollY =
        (table.isFrozenRow(startCell.row) === false || table.isFrozenRow(endCell.row) === false) &&
        table.getAllRowsHeight() > table.tableNoFrameHeight;
      const canScrollX =
        (table.isFrozenColumn(startCell.col) === false || table.isFrozenColumn(endCell.col) === false) &&
        table.getAllColsWidth() > table.tableNoFrameWidth;
      if (
        ((y > drawRange.bottom - bottomFrozenRowHeight || y < drawRange.top + topFrozenRowHeight) && canScrollY) ||
        ((x > drawRange.right - rightFrozenColsWidth || x < drawRange.left + leftFrozenColsWidth) && canScrollX)
      ) {
        table.eventManager.scrollXSpeed = 0;
        table.eventManager.scrollYSpeed = 0;
        let bottom = false;
        let top = false;
        let right = false;
        let left = false;
        if (
          y > drawRange.bottom - bottomFrozenRowHeight &&
          canScrollY &&
          table.scrollTop + table.tableNoFrameHeight < table.getAllRowsHeight()
        ) {
          bottom = true;
          table.eventManager.scrollYSpeed = -(y - drawRange.bottom + bottomFrozenRowHeight) / 50;
        } else if (y < drawRange.top + topFrozenRowHeight && canScrollY && table.scrollTop > 0) {
          top = true;
          table.eventManager.scrollYSpeed = -(y - drawRange.top - topFrozenRowHeight) / 50;
        }

        if (
          x > drawRange.right - rightFrozenColsWidth &&
          canScrollX &&
          table.scrollLeft + table.tableNoFrameWidth < table.getAllColsWidth()
        ) {
          right = true;
          table.eventManager.scrollXSpeed = -(x - drawRange.right + rightFrozenColsWidth) / 50;
        } else if (x < drawRange.left + leftFrozenColsWidth && canScrollX && table.scrollLeft > 0) {
          left = true;
          table.eventManager.scrollXSpeed = -(x - drawRange.left - leftFrozenColsWidth) / 50;
        }
        table.eventManager.inertiaScroll.startInertia(
          table.eventManager.scrollXSpeed,
          table.eventManager.scrollYSpeed,
          1
        );
        table.eventManager.inertiaScroll.setScrollHandle((dx: number, dy: number) => {
          handleWhell({ deltaX: -dx, deltaY: -dy } as any, table.stateManager, false);

          let selectX: number;
          let selectY: number;

          if (bottom) {
            selectY = table.scrollTop + drawRange.height - bottomFrozenRowHeight - 20;
          } else if (top) {
            selectY = table.scrollTop + topFrozenRowHeight + 20;
          }

          if (right) {
            selectX = table.scrollLeft + drawRange.width - rightFrozenColsWidth - 20;
          } else if (left) {
            selectX = table.scrollLeft + leftFrozenColsWidth + 20;
          }

          let considerFrozenY = false;
          let considerFrozenX = false;
          if (!right && !left) {
            if (
              (x > table.tableNoFrameWidth - table.getRightFrozenColsWidth() && x < table.tableNoFrameWidth) ||
              (x > 0 && x < table.getFrozenColsWidth())
            ) {
              selectX = x;
              considerFrozenX = true;
            } else {
              selectX = table.scrollLeft + x;
            }
          }
          if (!bottom && !top) {
            if (
              (y > table.tableNoFrameHeight - table.getBottomFrozenRowsHeight() && y < table.tableNoFrameHeight) ||
              (y > 0 && y < table.getFrozenRowsHeight())
            ) {
              selectY = y;
              considerFrozenY = true;
            } else {
              selectY = table.scrollTop + y;
            }
          }
          table.stateManager.updateInteractionState(InteractionState.grabing);
          const targetCol = table.getTargetColAtConsiderRightFrozen(selectX, considerFrozenX);
          const targetRow = table.getTargetRowAtConsiderBottomFrozen(selectY, considerFrozenY);
          if (!table.options.select?.disableDragSelect && isValid(targetCol) && isValid(targetRow)) {
            table.stateManager.updateSelectPos(
              table.stateManager.select.selectInline === 'row' ? table.colCount - 1 : targetCol.col,
              table.stateManager.select.selectInline === 'col' ? table.rowCount - 1 : targetRow.row,
              false,
              false,
              false,
              false
            );
          }
        });
      } else if (table.eventManager.inertiaScroll.isInertiaScrolling()) {
        table.eventManager.inertiaScroll.endInertia();
      } else {
        table.eventManager.scrollYSpeed = 0;
      }
    }
  };
  eventManager.globalEventListeners.push({
    name: 'pointermove',
    env: 'vglobal',
    callback: globalPointermoveCallback
  });
  vglobal.addEventListener('pointermove', globalPointermoveCallback);
}
