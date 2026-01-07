// import { FederatedPointerEvent } from '@src/vrender';
import type { FederatedPointerEvent, Gesture, IEventTarget } from '@src/vrender';
import { RichText, vglobal } from '@src/vrender';
import type { CellInfo, CellRange, ListTableAPI, ListTableConstructorOptions } from '../ts-types';
import { IconFuncTypeEnum } from '../ts-types';
import type { StateManager } from '../state/state';
import type { Group } from '../scenegraph/graphic/group';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { Icon } from '../scenegraph/graphic/icon';
import { checkCellInSelect } from '../state/common/check-in-select';
import { bindMediaClick } from './media-click';
import { bindDrillEvent, checkHaveDrill, drillClick } from './drill';
import { bindSparklineHoverEvent } from './sparkline-event';
import type { BaseTableAPI, ListTableProtected } from '../ts-types/base-table';
import { checkHaveTextStick, handleTextStick } from '../scenegraph/stick-text';
import { bindGesture, bindTableGroupListener } from './listener/table-group';
import { bindScrollBarListener } from './listener/scroll-bar';
import { bindContainerDomListener } from './listener/container-dom';
import { bindTouchListener } from './listener/touch';
import { getCellEventArgsSet, setDataToHTML, type SceneEvent } from './util';
import { bindAxisClickEvent } from './self-event-listener/pivot-chart/axis-click';
import { bindAxisHoverEvent } from './self-event-listener/pivot-chart/axis-hover';
import type { PivotTable } from '../PivotTable';
import { Env } from '../tools/env';
import type { ListTable } from '../ListTable';
import { isValid } from '@visactor/vutils';
import { InertiaScroll } from './scroll';
import { isCellDisableSelect } from '../state/select/is-cell-select-highlight';
import {
  bindGroupCheckboxTreeChange,
  bindGroupTitleCheckboxChange,
  bindHeaderCheckboxChange
} from './self-event-listener/list-table/checkbox';
import { bindButtonClickEvent } from './component/button';
import { bindIconClickEvent } from './self-event-listener/base-table/icon';
import { bindDropdownMenuEvent } from './self-event-listener/base-table/dropdown-menu';
import { bindDBClickAutoColumnWidthEvent } from './self-event-listener/base-table/dbclick-auto-column-width';
import { browser } from '../tools/helper';
import { clearActiveCellRangeState, setActiveCellRangeState } from '../tools/style';

export class EventManager {
  table: BaseTableAPI;
  // _col: number;
  // _resizing: boolean = false;
  // /** 为了能够判断canvas mousedown 事件 以阻止事件冒泡 */
  // isPointerDownOnTable: boolean = false;
  isTouchdown: boolean; // touch scrolling mode on
  isTouchMove: boolean; // touchmove 事件中设置
  touchMovePoints: {
    x: number;
    y: number;
    timestamp: number;
  }[]; // touch points record in touch scrolling mode
  touchSetTimeout: any; // touch start timeout, use to distinguish touch scrolling mode and default touch event
  touchEnd: boolean; // is touch event end when default touch event listener response
  /** 是在touchSetTimeout中设置的true 延迟了500ms 如果在500ms内接入了touch事件 则取消touchSetTimeout逻辑 也就是不会将touchMode设置为true。这个是longTouch的逻辑 */
  isLongTouch: boolean; // is touch listener working, use to disable document touch scrolling function
  gesture: Gesture;
  handleTextStickBindId: number[];

  //鼠标事件记录。 PointerMove敏感度太高了 记录下上一个鼠标位置 在接收到PointerMove事件时做判断 是否到到触发框选或者移动表头操作的标准，防止误触
  LastPointerXY: { x: number; y: number };
  LastBodyPointerXY: { x: number; y: number };
  isDown = false;
  isDraging = false;
  scrollYSpeed: number;
  scrollXSpeed: number;
  downIcon: IEventTarget; // 记录鼠标按下的sicon
  //报错已绑定过的事件 后续清除绑定
  globalEventListeners: {
    name: string;
    env: 'document' | 'body' | 'window' | 'vglobal';
    callback: (e?: any) => void;
  }[] = [];
  inertiaScroll: InertiaScroll;

  bindSparklineHoverEvent: boolean;

  _enableTableScroll: boolean = true;
  /** 剪切后等待粘贴 */
  cutWaitPaste: boolean = false;
  private clipboardCheckTimer: number | null = null; // 剪贴板检测定时器
  private cutOperationTime: number = 0; // 记录剪切操作的时间
  lastClipboardContent: string = ''; // 最后一次复制/剪切的内容
  cutCellRange: CellInfo[][] | null = null;
  cutRanges: CellRange[] | null = null;
  /** 复制时的源位置信息（用于公式相对引用调整） */
  copySourceRange: { startCol: number; startRow: number } | null = null;
  constructor(table: BaseTableAPI) {
    this.table = table;
    this.handleTextStickBindId = [];
    this.inertiaScroll = new InertiaScroll(table.stateManager);
    if (Env.mode === 'node' || table.options.disableInteraction) {
      return;
    }
    this.bindOuterEvent();
    setTimeout(() => {
      this.bindSelfEvent();
    }, 0);
  }

  // 绑定DOM事件
  bindOuterEvent() {
    bindTableGroupListener(this);
    bindContainerDomListener(this);
    bindScrollBarListener(this);
    bindTouchListener(this);
    bindGesture(this);
  }
  updateEventBinder() {
    setTimeout(() => {
      if (this.table.isReleased) {
        return;
      }

      // 处理textStick 是否绑定SCROLL的判断
      if (checkHaveTextStick(this.table) && this.handleTextStickBindId?.length === 0) {
        this.handleTextStickBindId.push(
          this.table.on(TABLE_EVENT_TYPE.SCROLL, e => {
            handleTextStick(this.table);
          })
        );

        this.handleTextStickBindId.push(
          this.table.on(TABLE_EVENT_TYPE.RESIZE_COLUMN_END, e => {
            handleTextStick(this.table);
          })
        );
        this.handleTextStickBindId.push(
          this.table.on(TABLE_EVENT_TYPE.RESIZE_ROW_END, e => {
            handleTextStick(this.table);
          })
        );
      } else if (!checkHaveTextStick(this.table) && this.handleTextStickBindId) {
        this.handleTextStickBindId.forEach(id => {
          this.table.off(id);
        });
        this.handleTextStickBindId = [];
      }

      // chart hover
      bindSparklineHoverEvent(this.table);
    }, 0);
  }
  bindSelfEvent() {
    if (this.table.isReleased) {
      return;
    }

    // 图标点击
    bindIconClickEvent(this.table);

    // 下拉菜单内容点击
    bindDropdownMenuEvent(this.table);

    // 处理textStick
    // if (checkHaveTextStick(this.table)) {
    //   this.handleTextStickBindId = this.table.on(TABLE_EVENT_TYPE.SCROLL, e => {
    //     handleTextStick(this.table);
    //   });
    // }
    this.updateEventBinder();

    // link/image/video点击
    bindMediaClick(this.table);

    // 双击自动列宽
    bindDBClickAutoColumnWidthEvent(this.table);

    // drill icon
    if (this.table.isPivotTable() && checkHaveDrill(this.table as PivotTable)) {
      bindDrillEvent(this.table);
    }

    // chart hover
    bindSparklineHoverEvent(this.table);

    // axis click
    bindAxisClickEvent(this.table);

    // chart axis event
    bindAxisHoverEvent(this.table);

    // group title checkbox change
    bindGroupTitleCheckboxChange(this.table);
    // checkbox and titlr change
    bindGroupCheckboxTreeChange(this.table as ListTable);
    // header checkbox change
    bindHeaderCheckboxChange(this.table);

    // button click
    bindButtonClickEvent(this.table);
  }

  dealTableHover(eventArgsSet?: SceneEvent) {
    if (!eventArgsSet) {
      this.table.stateManager.updateHoverPos(-1, -1);
      return;
    }
    const { eventArgs } = eventArgsSet;

    if (eventArgs) {
      this.table.stateManager.updateHoverPos(eventArgs.col, eventArgs.row);
    } else {
      this.table.stateManager.updateHoverPos(-1, -1);
    }
  }

  dealIconHover(eventArgsSet: SceneEvent) {
    const { eventArgs } = eventArgsSet;

    if (eventArgs) {
      this.table.stateManager.updateHoverIcon(eventArgs.col, eventArgs.row, eventArgs.target, eventArgs.targetCell);
    } else {
      this.table.stateManager.updateHoverIcon(-1, -1, undefined, undefined);
    }
  }

  dealMenuHover(eventArgsSet: SceneEvent) {
    // menu自身状态实现
  }

  dealTableSelect(eventArgsSet?: SceneEvent, isSelectMoving?: boolean): boolean {
    if (!eventArgsSet) {
      this.table.stateManager.updateSelectPos(-1, -1);
      return false;
    }
    const { eventArgs } = eventArgsSet;

    if (eventArgs) {
      if (
        eventArgs.target.name === 'checkbox' ||
        eventArgs.target.name === 'radio' ||
        eventArgs.target.name === 'switch' ||
        eventArgs.target.name === 'button'
      ) {
        return false;
      }

      // // 注意：如果启用下面这句代码逻辑 则在点击选中单元格时失效hover效果。但是会导致chart实例的click事件失效，所以先特殊处理这个逻辑
      // if (
      //   !this.table.isPivotChart() &&
      //   eventArgsSet?.eventArgs?.target.type !== 'chart' &&
      //   eventArgs.event.pointerType !== 'touch'
      // ) {
      //   this.table.stateManager.updateHoverPos(-1, -1);
      // }

      if (
        this.table.isHeader(eventArgs.col, eventArgs.row) &&
        isCellDisableSelect(this.table, eventArgs.col, eventArgs.row)
      ) {
        if (!isSelectMoving) {
          // 如果是点击点表头 取消单元格选中状态
          this.table.stateManager.updateSelectPos(-1, -1);
        }
        return false;
      } else if (
        !this.table.isHeader(eventArgs.col, eventArgs.row) &&
        isCellDisableSelect(this.table, eventArgs.col, eventArgs.row)
      ) {
        if (!isSelectMoving) {
          const isHasSelected = !!this.table.stateManager.select.ranges?.length;
          this.table.stateManager.updateSelectPos(-1, -1);
          if (isHasSelected) {
            this.table.stateManager.endSelectCells(true, isHasSelected);
          }
        }
        return false;
      }

      if (
        this.table.isPivotChart() &&
        (eventArgsSet?.eventArgs?.target.name === 'axis-label' || eventArgsSet?.eventArgs?.target.type === 'chart')
      ) {
        // 点击透视图坐标轴标签或图标内容，执行图表状态更新，不触发Select
        this.table.stateManager.updateSelectPos(-1, -1);
        return false;
      }
      const shiftMultiSelect = this.table.keyboardOptions?.shiftMultiSelect ?? true;
      const ctrlMultiSelect = this.table.keyboardOptions?.ctrlMultiSelect ?? true;
      this.table.stateManager.updateSelectPos(
        this.table.stateManager.select.selectInline === 'row' ? this.table.colCount - 1 : eventArgs.col,
        this.table.stateManager.select.selectInline === 'col' ? this.table.rowCount - 1 : eventArgs.row,
        eventArgs.event.shiftKey && shiftMultiSelect,
        (eventArgs.event.ctrlKey || eventArgs.event.metaKey) && ctrlMultiSelect,
        false,
        isSelectMoving ? false : this.table.options.select?.makeSelectCellVisible ?? true
      );

      return true;
    }
    // this.table.stateManager.updateSelectPos(-1, -1); 这句有问题 如drag框选鼠标超出表格范围 这里就直接情况是不对的
    return false;
  }
  dealFillSelect(eventArgsSet?: SceneEvent, isSelectMoving?: boolean): boolean {
    const { eventArgs } = eventArgsSet;

    if (eventArgs) {
      if (this.table.stateManager.select?.ranges?.length && this.table.stateManager.isFillHandle()) {
        let updateRow;
        let updateCol;
        const currentRange = this.table.stateManager.select.ranges[this.table.stateManager.select.ranges.length - 1];
        if (isSelectMoving) {
          if (!isValid(this.table.stateManager.fillHandle.directionRow)) {
            if (
              Math.abs(this.table.stateManager.fillHandle.startY - eventArgsSet.abstractPos.y) >=
              Math.abs(this.table.stateManager.fillHandle.startX - eventArgsSet.abstractPos.x)
            ) {
              this.table.stateManager.fillHandle.directionRow = true;
            } else {
              this.table.stateManager.fillHandle.directionRow = false;
            }
          }

          if (
            Math.abs(this.table.stateManager.fillHandle.startY - eventArgsSet.abstractPos.y) >=
            Math.abs(this.table.stateManager.fillHandle.startX - eventArgsSet.abstractPos.x)
          ) {
            if (this.table.stateManager.fillHandle.startY - eventArgsSet.abstractPos.y > 0) {
              this.table.stateManager.fillHandle.direction = 'top';
            } else {
              this.table.stateManager.fillHandle.direction = 'bottom';
            }
          } else {
            if (this.table.stateManager.fillHandle.startX - eventArgsSet.abstractPos.x > 0) {
              this.table.stateManager.fillHandle.direction = 'left';
            } else {
              this.table.stateManager.fillHandle.direction = 'right';
            }
          }
          if (this.table.stateManager.fillHandle.directionRow) {
            updateRow = eventArgs.row;
            updateCol = currentRange.end.col;
          } else {
            updateRow = currentRange.end.row;
            updateCol = eventArgs.col;
          }
        }
        const ctrlMultiSelect = this.table.keyboardOptions?.ctrlMultiSelect ?? true;

        this.table.stateManager.updateSelectPos(
          isSelectMoving ? updateCol : currentRange.end.col,
          isSelectMoving ? updateRow : currentRange.end.row,
          true,
          (eventArgs.event.ctrlKey || eventArgs.event.metaKey) && ctrlMultiSelect,
          false,
          !isSelectMoving
        );
      } else {
        const shiftMultiSelect = this.table.keyboardOptions?.shiftMultiSelect ?? true;
        const ctrlMultiSelect = this.table.keyboardOptions?.ctrlMultiSelect ?? true;
        this.table.stateManager.updateSelectPos(
          eventArgs.col,
          eventArgs.row,
          eventArgs.event.shiftKey && shiftMultiSelect,
          (eventArgs.event.ctrlKey || eventArgs.event.metaKey) && ctrlMultiSelect,
          false,
          !isSelectMoving
        );
      }
      return true;
    }
    // this.table.stateManager.updateSelectPos(-1, -1); 这句有问题 如drag框选鼠标超出表格范围 这里就直接情况是不对的
    return false;
  }

  // fillSelected(eventArgsSet?: SceneEvent, SelectCellRange?: any, SelectData?: any): any {
  //   return;
  //   if (!eventArgsSet) {
  //     this.table.stateManager.updateSelectPos(-1, -1);
  //     return;
  //   }
  //   const { eventArgs } = eventArgsSet;

  //   if (eventArgs) {
  //     if (eventArgs.target.name === 'checkbox') {
  //       return;
  //     }
  //     let direction;

  //     if (eventArgs.row >= SelectCellRange.start.row && eventArgs.row <= SelectCellRange.end.row) {
  //       if (eventArgs.col > SelectCellRange.end.col) {
  //         direction = 'right';
  //       } else {
  //         direction = 'left';
  //       }
  //     } else {
  //       if (eventArgs.row > SelectCellRange.end.row) {
  //         direction = 'down';
  //       } else {
  //         direction = 'up';
  //       }
  //     }
  //     const values: (string | number)[][] = [];
  //     const fillData: any[][] = [];
  //     let updaterow;
  //     let updatecol;
  //     const rows = SelectData.split('\n'); // 将数据拆分为行
  //     rows.forEach(function (rowCells: any, rowIndex: number) {
  //       const cells = rowCells.split('\t'); // 将行数据拆分为单元格
  //       const rowValues: (string | number)[] = [];
  //       values.push(rowValues);
  //       cells.forEach(function (cell: string, cellIndex: number) {
  //         // 去掉单元格数据末尾的 '\r'
  //         if (cellIndex === cells.length - 1) {
  //           cell = cell.trim();
  //         }
  //         rowValues.push(cell);
  //       });
  //     });

  //     updaterow = SelectCellRange.start.row;
  //     updatecol = SelectCellRange.start.col;
  //     if (['up', 'left'].indexOf(direction) > -1) {
  //       if (direction === 'up') {
  //         updaterow = eventArgs.row;

  //         const fillLength = SelectCellRange.start.row - updaterow;

  //         for (let i = 0; i < fillLength; i++) {
  //           const rowIndex = values.length - 1 - (i % values.length);
  //           const newRow = values[rowIndex].slice(0); // 复制一行数据

  //           fillData.unshift(newRow); // 在填充数据的开头插入新行
  //         }
  //       } else {
  //         updatecol = eventArgs.col;
  //         const fillLength = SelectCellRange.start.col - updatecol;

  //         for (let i = 0; i < values.length; i++) {
  //           const newRow = values[i].slice(0); // 复制一行数据
  //           while (newRow.length < fillLength) {
  //             newRow.unshift(newRow[0]); // 在新行开头向左填充元素
  //           }
  //           fillData.push(newRow);
  //         }
  //       }
  //     } else {
  //       if (direction === 'down') {
  //         updaterow = SelectCellRange.end.row + 1;
  //         const fillLength = eventArgs.row - SelectCellRange.end.row;

  //         // 将原始数据添加到新数组中
  //         for (let i = 0; i < fillLength; i++) {
  //           const rowIndex = i % values.length;
  //           const newRow = values[rowIndex]; // 复制一行数据
  //           fillData.push(newRow);
  //         }
  //       } else {
  //         const fillLength = eventArgs.col - SelectCellRange.end.col;
  //         updatecol = SelectCellRange.end.col + 1;

  //         values.forEach(function (rowCells: any[]) {
  //           const newRow: any[] = [];
  //           // 将原始数据按顺序填充到新行中
  //           for (let i = 0; i < fillLength; i++) {
  //             const dataIndex = i % rowCells.length;
  //             newRow.push(rowCells[dataIndex]);
  //           }

  //           // 将新行添加到填充数据中
  //           fillData.push(newRow);
  //         });
  //       }
  //     }

  //     (this.table as ListTableAPI).changeCellValues(updatecol, updaterow, fillData, false);
  //   }
  // }

  deelTableSelectAll() {
    this.table.stateManager.updateSelectPos(-1, -1, false, false, true);
    this.table.fireListeners(TABLE_EVENT_TYPE.SELECTED_CELL, {
      ranges: this.table.stateManager.select.ranges,
      col: 0,
      row: 0
    });
  }

  dealMenuSelect(eventArgsSet: SceneEvent) {
    // do nothing
  }

  checkColumnResize(eventArgsSet: SceneEvent, update?: boolean): boolean {
    // return false;
    const { eventArgs } = eventArgsSet;

    if ((this.table.internalProps as ListTableProtected).enableTreeStickCell && !eventArgs) {
      return false;
    }
    // if (eventArgs) { // 如果是鼠标处理表格外部如最后一列的后面 也期望可以拖拽列宽
    const resizeCol = this.table.scenegraph.getResizeColAt(
      eventArgsSet.abstractPos.x,
      eventArgsSet.abstractPos.y,
      eventArgs?.targetCell
    );
    let useerCustomCanResizeColumn: boolean = true;
    if (
      this.table.internalProps.canResizeColumn &&
      !this.table.internalProps.canResizeColumn(resizeCol.col, resizeCol.row, this.table)
    ) {
      useerCustomCanResizeColumn = false;
    }

    if (useerCustomCanResizeColumn && this.table._canResizeColumn(resizeCol.col, resizeCol.row) && resizeCol.col >= 0) {
      if (update) {
        this.table.stateManager.startResizeCol(
          resizeCol.col,
          eventArgsSet.abstractPos.x,
          eventArgsSet.abstractPos.y,
          resizeCol.rightFrozen
        );
      }
      return true;
    }
    if (this.table.stateManager.isResizeCol()) {
      // 结束列调整
      this.table.stateManager.endResizeCol();
    }

    // }

    return false;
  }

  checkRowResize(eventArgsSet: SceneEvent, update?: boolean): boolean {
    const { eventArgs } = eventArgsSet;
    if (eventArgs) {
      const resizeRow = this.table.scenegraph.getResizeRowAt(
        eventArgsSet.abstractPos.x,
        eventArgsSet.abstractPos.y,
        eventArgs.targetCell
      );

      if (this.table._canResizeRow(resizeRow.col, resizeRow.row) && resizeRow.row >= 0) {
        if (update) {
          this.table.stateManager.startResizeRow(
            resizeRow.row,
            eventArgsSet.abstractPos.x,
            eventArgsSet.abstractPos.y,
            resizeRow.bottomFrozen
          );
        }
        return true;
      }
    }

    return false;
  }

  cellIsHeaderCheck(eventArgsSet: SceneEvent, update?: boolean): boolean {
    const { eventArgs } = eventArgsSet;
    const { col, row, target } = eventArgs;
    if (!this.table.isHeader(col, row)) {
      return false;
    }
    const cellType = this.table.getCellType(eventArgs.col, eventArgs.row);
    if (cellType === 'checkbox' && target.name === 'checkbox') {
      return true;
    }
    return false;
  }
  checkCellFillhandle(eventArgsSet: SceneEvent, update?: boolean): boolean {
    let isFillHandle = false;
    if (typeof this.table.options.excelOptions?.fillHandle === 'function') {
      isFillHandle = this.table.options.excelOptions.fillHandle({
        selectRanges: this.table.stateManager.select.ranges,
        table: this.table
      });
    } else {
      isFillHandle = this.table.options.excelOptions?.fillHandle;
    }
    if (isFillHandle) {
      const { eventArgs } = eventArgsSet;
      if (eventArgs) {
        if (this.table.stateManager.select?.ranges?.length) {
          const lastCol = Math.max(
            this.table.stateManager.select.ranges[this.table.stateManager.select.ranges.length - 1].start.col,
            this.table.stateManager.select.ranges[this.table.stateManager.select.ranges.length - 1].end.col
          );
          const lastRow = Math.max(
            this.table.stateManager.select.ranges[this.table.stateManager.select.ranges.length - 1].start.row,
            this.table.stateManager.select.ranges[this.table.stateManager.select.ranges.length - 1].end.row
          );
          const startCol = Math.min(
            this.table.stateManager.select.ranges[this.table.stateManager.select.ranges.length - 1].start.col,
            this.table.stateManager.select.ranges[this.table.stateManager.select.ranges.length - 1].end.col
          );
          const startRow = Math.min(
            this.table.stateManager.select.ranges[this.table.stateManager.select.ranges.length - 1].start.row,
            this.table.stateManager.select.ranges[this.table.stateManager.select.ranges.length - 1].end.row
          );
          // 计算鼠标与fillhandle矩形中心之间的距离 distanceX 和 distanceY
          // 考虑最后一行和最后一列的特殊情况  逻辑处理需要和update-select-border.ts 中 “计算填充柄小方块的位置” 逻辑处理一致。目前都还有小问题，例如存在冻结的时候。
          let lastCellBoundTargetX;
          if (lastCol < this.table.colCount - 1) {
            const lastCellBound = this.table.scenegraph.highPerformanceGetCell(lastCol, lastRow).globalAABBBounds;
            lastCellBoundTargetX = lastCellBound.x2;
          } else {
            if (startCol === 0) {
              const lastCellBound = this.table.scenegraph.highPerformanceGetCell(0, lastRow).globalAABBBounds;
              lastCellBoundTargetX = lastCellBound.x1;
            } else {
              const lastCellBound = this.table.scenegraph.highPerformanceGetCell(
                startCol - 1,
                lastRow
              ).globalAABBBounds;
              lastCellBoundTargetX = lastCellBound.x2;
            }
          }
          const distanceX = Math.abs(eventArgsSet.abstractPos.x - lastCellBoundTargetX);

          let lastCellBoundTargetY;
          if (lastRow < this.table.rowCount - 1) {
            const lastCellBound = this.table.scenegraph.highPerformanceGetCell(lastCol, lastRow).globalAABBBounds;
            lastCellBoundTargetY = lastCellBound.y2;
          } else {
            const lastCellBound = this.table.scenegraph.highPerformanceGetCell(lastCol, startRow - 1).globalAABBBounds;
            lastCellBoundTargetY = lastCellBound.y2;
          }
          const distanceY = Math.abs(eventArgsSet.abstractPos.y - lastCellBoundTargetY);

          const squareSize = 6 * 3;
          // 判断鼠标是否落在fillhandle矩形内
          if (
            this.table.stateManager.fillHandle?.isFilling ||
            (distanceX <= squareSize / 2 && distanceY <= squareSize / 2)
          ) {
            if (update) {
              this.table.stateManager.startFillSelect(eventArgsSet.abstractPos.x, eventArgsSet.abstractPos.y);
            }
            return true;
          }
        }
      }
    }
    return false;
  }

  dealColumnResize(xInTable: number, yInTable: number) {
    this.table.stateManager.updateResizeCol(xInTable, yInTable);
  }

  dealRowResize(xInTable: number, yInTable: number) {
    this.table.stateManager.updateResizeRow(xInTable, yInTable);
  }

  checkColumnMover(eventArgsSet: SceneEvent): boolean {
    // return false;
    const { eventArgs } = eventArgsSet;
    if (
      eventArgs &&
      // this.table.isHeader(eventArgs.col, eventArgs.row) &&
      // (checkCellInSelect(eventArgs.col, eventArgs.row, this.table.stateManager.select.ranges) ||
      //   this.table.options.select?.disableHeaderSelect ||
      //   this.table.options.select?.disableSelect) &&
      // this.table.stateManager.select.cellPosStart.col === eventArgs.col &&
      // this.table.stateManager.select.cellPosStart.row === eventArgs.row &&
      this.table._canDragHeaderPosition(eventArgs.col, eventArgs.row)
    ) {
      this.table.stateManager.startMoveCol(
        eventArgs.col,
        eventArgs.row,
        eventArgsSet.abstractPos.x,
        eventArgsSet.abstractPos.y,
        eventArgs?.event?.nativeEvent
      );
      return true;
    }

    return false;
  }

  dealColumnMover(x: number, y: number, event: MouseEvent | PointerEvent | TouchEvent) {
    let col = this.table.getColAtRelativePosition(x);
    let row = this.table.getRowAtRelativePosition(y);
    if (col === -1 && this.table.stateManager.columnMove.movingColumnOrRow === 'row') {
      col = 0;
    }
    if (row === -1 && this.table.stateManager.columnMove.movingColumnOrRow === 'column') {
      row = 0;
    }
    // const { eventArgs } = eventArgsSet;
    if (isValid(col) && isValid(row)) {
      this.table.stateManager.updateMoveCol(col, row, x, y, event);
    }
  }

  startColumnResize(eventArgsSet: SceneEvent) {
    // do nothing
  }

  dealIconClick(e: FederatedPointerEvent, eventArgsSet: SceneEvent): boolean {
    const { eventArgs } = eventArgsSet;
    // if (!eventArgs) {
    //   return false;
    // }

    const { target, event, col, row } = eventArgs || {
      target: e.target,
      event: e,
      col: -1,
      row: -1
    };
    const icon = target as unknown as Icon;

    if (icon.role && icon.role.startsWith('icon-')) {
      this.table.fireListeners(TABLE_EVENT_TYPE.ICON_CLICK, {
        name: icon.name,
        // 默认位置：icon中部正下方
        x: (icon.globalAABBBounds.x1 + icon.globalAABBBounds.x2) / 2,
        y: icon.globalAABBBounds.y2,
        col,
        row,
        funcType: icon.attribute.funcType,
        icon,
        event
      });

      return true;
    } else if (target instanceof RichText) {
      const icon = target.pickIcon(event.global);
      if (icon) {
        this.table.fireListeners(TABLE_EVENT_TYPE.ICON_CLICK, {
          name: icon.attribute.id,
          // 默认位置：icon中部正下方
          x: icon.globalX + icon.globalAABBBounds.width() / 2,
          y: icon.globalY + icon.AABBBounds.height(),
          col,
          row,
          funcType: (icon.attribute as any).funcType,
          icon: icon as unknown as Icon,
          event
        });
        return true;
      }
    }

    return false;
  }
  /** TODO 其他的事件并么有做remove */
  release() {
    this.gesture?.release();

    // remove global event listerner
    this.globalEventListeners.forEach(item => {
      if (item.env === 'document') {
        document.removeEventListener(item.name, item.callback);
      } else if (item.env === 'body') {
        document.body.removeEventListener(item.name, item.callback);
      } else if (item.env === 'window') {
        window.removeEventListener(item.name, item.callback);
      } else if (item.env === 'vglobal') {
        vglobal.removeEventListener(item.name, item.callback);
      }
    });
    this.globalEventListeners = [];
  }

  enableScroll() {
    this._enableTableScroll = true;
  }

  disableScroll() {
    this._enableTableScroll = false;
  }

  async handleCopy(e: KeyboardEvent, isCut: boolean = false) {
    const table = this.table;
    !isCut && (this.cutWaitPaste = false);
    this.copySourceRange = null;
    // 记录复制时的源位置（用于公式相对引用调整）
    const sourceRanges = table.stateManager.select.ranges;
    if (sourceRanges && sourceRanges.length === 1) {
      // 只有一个选区的时候才需要采取解析公式（和excel一致），才需要记录源位置
      const sourceRange = sourceRanges[0];
      this.copySourceRange = {
        startCol: Math.min(sourceRange.start.col, sourceRange.end.col),
        startRow: Math.min(sourceRange.start.row, sourceRange.end.row)
      };
    } else if (!sourceRanges?.length) {
      this.copySourceRange = null;
      // 没有选中区域，直接返回，不进行复制操作
      return;
    }

    const data = this.table.getCopyValue(
      table.options.keyboardOptions?.getCopyCellValue?.value as (col: number, row: number) => string | number
    );
    if (isValid(data)) {
      e.preventDefault();

      // 确保表格元素获得焦点，避免Document is not focused错误
      const element = table.getElement();
      if (element && element !== document.activeElement) {
        element.focus();
        // 短暂延迟，确保焦点设置完成
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      try {
        // 优先使用现代剪贴板API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          // 尝试获取权限（如果支持）
          let hasPermission = true;
          if (navigator.permissions && navigator.permissions.query) {
            try {
              const permissionState = await navigator.permissions.query({
                name: 'clipboard-write' as PermissionName
              });
              hasPermission = permissionState.state === 'granted';
            } catch (permissionError) {
              // 权限查询失败，继续尝试写入
              console.warn('无法查询剪贴板权限:', permissionError);
              hasPermission = true; // 假设有权限，让写入操作自己失败
            }
          }

          if (hasPermission) {
            // 将复制的数据转为html格式

            try {
              // 尝试使用 ClipboardItem（支持富文本）
              if (window.ClipboardItem) {
                let htmlValues = data;
                if (
                  table.stateManager.select.ranges.length === 1 && //只有一个选区的时候采取解析公式（和excel一致）
                  table.options.keyboardOptions?.getCopyCellValue?.html
                ) {
                  htmlValues = this.table.getCopyValue(
                    table.options.keyboardOptions?.getCopyCellValue.html as (
                      col: number,
                      row: number
                    ) => string | number
                  );
                }
                const dataHTML = setDataToHTML(htmlValues);
                await navigator.clipboard.write([
                  new ClipboardItem({
                    'text/html': new Blob([dataHTML], { type: 'text/html' }),
                    'text/plain': new Blob([data], { type: 'text/plain' })
                  })
                ]);
              } else {
                // 降级到纯文本
                await navigator.clipboard.writeText(data);
              }
            } catch (clipboardError) {
              console.warn('剪贴板写入失败，使用降级方案:', clipboardError);
              // 降级到传统方法
              this.fallbackCopyToClipboard(data, e);
            }
          } else {
            // 没有权限，使用降级方案
            this.fallbackCopyToClipboard(data, e);
          }
        } else {
          // 不支持现代剪贴板API，使用降级方案
          this.fallbackCopyToClipboard(data, e);
        }

        table.fireListeners(TABLE_EVENT_TYPE.COPY_DATA, {
          cellRange: table.stateManager.select.ranges,
          copyData: data,
          isCut
        });
      } catch (error) {
        console.error('复制操作失败:', error);
        // 最后的降级方案
        this.fallbackCopyToClipboard(data, e);
      }
    }
    if (table.keyboardOptions?.showCopyCellBorder) {
      setActiveCellRangeState(table);
      table.clearSelected();
    }
  }

  // 降级复制方案
  private fallbackCopyToClipboard(data: string, e: KeyboardEvent): void {
    try {
      // 尝试使用旧的 clipboardData API (在事件处理函数中直接设置)
      if ((e as any).clipboardData) {
        (e as any).clipboardData.setData('text/plain', data);
        return;
      }

      // 确保当前文档有焦点
      if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }

      // 尝试使用 document.execCommand
      const textArea = document.createElement('textarea');
      textArea.value = data;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      textArea.setAttribute('readonly', '');
      textArea.setAttribute('aria-hidden', 'true');
      document.body.appendChild(textArea);

      // 强制聚焦并选中文本
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, data.length);

      try {
        const successful = document.execCommand('copy');
        if (!successful) {
          console.warn('execCommand复制返回false，可能不被支持');
        }
      } catch (execError) {
        console.warn('execCommand复制失败:', execError);
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('降级复制方案失败:', error);
    }
  }

  async handleCut(e: KeyboardEvent) {
    this.handleCopy(e, true);
    this.cutWaitPaste = true;
    this.cutCellRange = this.table.getSelectedCellInfos();
    this.cutRanges = this.table.stateManager.select.ranges?.map(r => ({
      start: { col: r.start.col, row: r.start.row },
      end: { col: r.end.col, row: r.end.row }
    }));
    // 设置自动超时，防止剪切状态无限期保持
    if (this.clipboardCheckTimer) {
      clearTimeout(this.clipboardCheckTimer);
    }

    // 30秒后自动取消剪切状态
    this.clipboardCheckTimer = window.setTimeout(() => {
      if (this.cutWaitPaste) {
        // 剪切操作超时，重置剪切状态
        this.cutWaitPaste = false;
        this.cutCellRange = null;
        this.cutRanges = null;
        this.clipboardCheckTimer = null;
      }
    }, 30000); // 30秒超时

    // 保存剪贴板内容以便后续检测变化
    this.saveClipboardContent();
  }

  // 执行实际的粘贴操作
  handlePaste(e: KeyboardEvent): void {
    if (!this.cutWaitPaste) {
      // 非剪切状态，直接粘贴
      this.executePaste(e);
      return;
    }

    this.checkClipboardChanged()
      .then(changed => {
        // 执行粘贴操作，并根据剪贴板是否变化决定是否清空选中区域
        this.executePaste(e);
        if (!changed) {
          this.clearCutArea(this.table as ListTableAPI);
        }
        // 执行完粘贴操作后，重置剪切状态
        if (this.cutWaitPaste) {
          this.cutWaitPaste = false;
          this.cutCellRange = null;
          this.cutRanges = null;
          // 清除定时器
          if (this.clipboardCheckTimer) {
            clearTimeout(this.clipboardCheckTimer);
            this.clipboardCheckTimer = null;
          }
        }
      })
      .catch(() => {
        // 如果无法检测剪贴板变化（例如权限问题），则保守地执行粘贴但不清空选中区域
        this.executePaste(e);
        // 执行完粘贴操作后，重置剪切状态
        if (this.cutWaitPaste) {
          this.cutWaitPaste = false;
          this.cutCellRange = null;
          // 清除定时器
          if (this.clipboardCheckTimer) {
            clearTimeout(this.clipboardCheckTimer);
            this.clipboardCheckTimer = null;
          }
        }
      });
  }
  private async executePaste(e: any) {
    const table = this.table;
    if ((table as ListTableAPI).editorManager?.editingEditor) {
      return;
    }
    if ((table as ListTableAPI).changeCellValues && table.stateManager.select.ranges?.length > 0) {
      try {
        // 优先使用现代剪贴板API
        if (navigator.clipboard && navigator.clipboard.read) {
          try {
            // 读取剪切板数据
            const clipboardItems = await navigator.clipboard.read();
            let handled = false;

            for (const item of clipboardItems) {
              // 优先处理 html 格式数据
              if (item.types.includes('text/html')) {
                await this.pasteHtmlToTable(item);
                handled = true;
                break;
              } else if (item.types.includes('text/plain')) {
                await this.pasteTextToTable(item);
                handled = true;
                break;
              }
            }

            if (!handled) {
              // 如果没有处理任何数据，使用降级方案
              await this.fallbackPasteFromClipboard(e);
            }
          } catch (clipboardError) {
            console.warn('现代剪贴板API读取失败，使用降级方案:', clipboardError);
            // 降级到传统方法
            await this.fallbackPasteFromClipboard(e);
          }
        } else {
          // 不支持现代剪贴板API，使用降级方案
          await this.fallbackPasteFromClipboard(e);
        }
      } catch (error) {
        console.error('粘贴操作失败:', error);
        // 最后的降级方案
        await this.fallbackPasteFromClipboard(e);
      }
    }
    if (table.keyboardOptions?.showCopyCellBorder) {
      clearActiveCellRangeState(table);
    }
  }

  // 降级粘贴方案
  private async fallbackPasteFromClipboard(e: any): Promise<void> {
    const table = this.table;
    const ranges = table.stateManager.select.ranges;
    const col = Math.min(ranges[0].start.col, ranges[0].end.col);
    const row = Math.min(ranges[0].start.row, ranges[0].end.row);

    try {
      // 确保表格元素获得焦点
      const element = table.getElement();
      if (element && element !== document.activeElement) {
        element.focus();
        // 短暂延迟，确保焦点设置完成
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // 尝试从事件对象获取剪贴板数据
      const clipboardData = e.clipboardData || (window as any).clipboardData || window.Clipboard;

      if (clipboardData) {
        const pastedData = clipboardData.getData('text') || clipboardData.getData('Text');
        if (pastedData) {
          await this.processPastedText(pastedData, col, row);
          return;
        }
      }
    } catch (error) {
      console.error('降级粘贴方案失败:', error);
    }
  }

  // 处理粘贴的文本数据
  private async processPastedText(pastedData: string, col: number, row: number): Promise<void> {
    const table = this.table;
    const rows = pastedData.split('\n'); // 将数据拆分为行
    const values: (string | number)[][] = [];

    rows.forEach(function (rowCells: any) {
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
    let processedValues;
    // 检查是否支持公式处理（针对vtable-sheet）
    if (table.options.keyboardOptions?.processFormulaBeforePaste && this.copySourceRange) {
      // 利用复制时记录的源位置，对粘贴的数据进行公式处理
      processedValues = table.options.keyboardOptions.processFormulaBeforePaste(
        values,
        this.copySourceRange.startCol,
        this.copySourceRange.startRow,
        col,
        row
      );
    }

    // 保持与 navigator.clipboard.read 中的操作一致
    const changedCellResults = await (table as ListTableAPI).changeCellValues(
      col,
      row,
      processedValues ? processedValues : values,
      true
    );
    if (table.hasListeners(TABLE_EVENT_TYPE.PASTED_DATA)) {
      table.fireListeners(TABLE_EVENT_TYPE.PASTED_DATA, {
        col,
        row,
        pasteData: processedValues ? processedValues : values,
        changedCellResults
      });
    }
  }
  // 清空选中区域的内容
  private clearCutArea(table: ListTableAPI): void {
    try {
      const ranges = this.cutRanges;
      if (!ranges || ranges.length === 0) {
        return;
      }

      table.changeCellValuesByIds(ranges, '');
    } catch (error) {
      console.error('清空单元格内容失败', error);
    }
  }

  // 检查剪贴板内容是否被其他应用更改
  private async checkClipboardChanged(): Promise<boolean> {
    // 如果不支持读取剪贴板，则无法检测变化
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      return false;
    }

    try {
      const currentContent = await navigator.clipboard.readText();
      // console.log('当前剪贴板内容:', currentContent);
      // console.log('上次保存的剪贴板内容:', this.lastClipboardContent);

      // 比较当前剪贴板内容与剪切时保存的内容
      return currentContent !== this.lastClipboardContent;
    } catch (err) {
      console.warn('检查剪贴板状态失败:', err);
      // 出错时假设剪贴板未变化
      return false;
    }
  }

  // 保存剪贴板内容
  private saveClipboardContent(): void {
    // 尝试获取剪贴板内容
    if (navigator.clipboard && navigator.clipboard.readText) {
      // 延迟一点以确保剪贴板内容已更新
      setTimeout(() => {
        navigator.clipboard
          .readText()
          .then(text => {
            this.lastClipboardContent = text;
            console.log('已保存剪贴板状态');
          })
          .catch(err => {
            console.warn('无法读取剪贴板内容:', err);
          });
      }, 50);
    }
  }
  private pasteHtmlToTable(item: ClipboardItem) {
    // const regex = /<tr[^>]*>(.*?)<\/tr>/gs; // 匹配<tr>标签及其内容
    const regex = /<tr[^>]*>([\s\S]*?)<\/tr>/g; // for webpack3
    // const cellRegex = /<td[^>]*>(.*?)<\/td>/gs; // 匹配<td>标签及其内容
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/g; // for webpack3
    const table = this.table;
    const ranges = table.stateManager.select.ranges;
    const selectRangeLength = ranges.length;
    const col = Math.min(ranges[selectRangeLength - 1].start.col, ranges[selectRangeLength - 1].end.col);
    const row = Math.min(ranges[selectRangeLength - 1].start.row, ranges[selectRangeLength - 1].end.row);
    const maxCol = Math.max(ranges[selectRangeLength - 1].start.col, ranges[selectRangeLength - 1].end.col);
    const maxRow = Math.max(ranges[selectRangeLength - 1].start.row, ranges[selectRangeLength - 1].end.row);
    let pasteValuesColCount = 0;
    let pasteValuesRowCount = 0;
    let values: (string | number)[][] = [];
    item.getType('text/html').then((blob: any) => {
      blob.text().then(async (pastedData: any) => {
        // 解析html数据
        if (pastedData && /(<table)|(<TABLE)/g.test(pastedData)) {
          // const matches = pastedData.matchAll(regex);
          const matches = Array.from(pastedData.matchAll(regex)) as RegExpMatchArray[];
          for (const match of matches) {
            const rowContent = match[1]; // 获取<tr>标签中的内容
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
            pasteValuesColCount = Math.max(pasteValuesColCount, rowValues?.length ?? 0);
          }
          pasteValuesRowCount = values.length ?? 0;
          values = this.handlePasteValues(
            values,
            pasteValuesRowCount,
            pasteValuesColCount,
            maxRow - row + 1,
            maxCol - col + 1
          );
          let processedValues;
          // 检查是否支持公式处理（针对vtable-sheet）
          if (table.options.keyboardOptions?.processFormulaBeforePaste && this.copySourceRange) {
            // 使用复制时记录的源位置（而不是当前的选中位置）
            processedValues = table.options.keyboardOptions.processFormulaBeforePaste(
              values,
              this.copySourceRange.startCol,
              this.copySourceRange.startRow,
              col,
              row
            );
          }

          const changedCellResults = await (table as ListTableAPI).changeCellValues(
            col,
            row,
            processedValues ? processedValues : values,
            true
          );
          if (table.hasListeners(TABLE_EVENT_TYPE.PASTED_DATA)) {
            table.fireListeners(TABLE_EVENT_TYPE.PASTED_DATA, {
              col,
              row,
              pasteData: processedValues ? processedValues : values,
              changedCellResults
            });
          }
        } else {
          navigator.clipboard.read().then(clipboardItems => {
            for (const item of clipboardItems) {
              if (item.types.includes('text/plain')) {
                item.getType('text/plain').then((blob: Blob) => {
                  blob.text().then(data => this._pasteValue(data));
                });
              }
            }
          });
        }
      });
    });
  }

  private async _pasteValue(pastedData: string) {
    const table = this.table;
    const ranges = table.stateManager.select.ranges;
    const selectRangeLength = ranges.length;
    const col = Math.min(ranges[selectRangeLength - 1].start.col, ranges[selectRangeLength - 1].end.col);
    const row = Math.min(ranges[selectRangeLength - 1].start.row, ranges[selectRangeLength - 1].end.row);
    const maxCol = Math.max(ranges[selectRangeLength - 1].start.col, ranges[selectRangeLength - 1].end.col);
    const maxRow = Math.max(ranges[selectRangeLength - 1].start.row, ranges[selectRangeLength - 1].end.row);
    let pasteValuesColCount = 0;
    let pasteValuesRowCount = 0;
    let values: (string | number)[][] = [];
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
      pasteValuesColCount = Math.max(pasteValuesColCount, rowValues?.length ?? 0);
    });
    pasteValuesRowCount = values.length ?? 0;
    values = this.handlePasteValues(
      values,
      pasteValuesRowCount,
      pasteValuesColCount,
      maxRow - row + 1,
      maxCol - col + 1
    );
    let processedValues;
    // 检查是否支持公式处理（针对vtable-sheet）
    if (table.options.keyboardOptions?.processFormulaBeforePaste && this.copySourceRange) {
      // 利用复制时记录的源位置，对粘贴的数据进行公式处理
      processedValues = table.options.keyboardOptions.processFormulaBeforePaste(
        values,
        this.copySourceRange.startCol,
        this.copySourceRange.startRow,
        col,
        row
      );
    }
    // 保持与 navigator.clipboard.read 中的操作一致
    const changedCellResults = await (table as ListTableAPI).changeCellValues(
      col,
      row,
      processedValues ? processedValues : values,
      true
    );
    if (table.hasListeners(TABLE_EVENT_TYPE.PASTED_DATA)) {
      table.fireListeners(TABLE_EVENT_TYPE.PASTED_DATA, {
        col,
        row,
        pasteData: processedValues ? processedValues : values,
        changedCellResults
      });
    }
  }
  private async pasteTextToTable(item: ClipboardItem) {
    const table = this.table;
    // 如果只有 'text/plain'
    const ranges = table.stateManager.select.ranges;
    const selectRangeLength = ranges.length;
    const col = Math.min(ranges[selectRangeLength - 1].start.col, ranges[selectRangeLength - 1].end.col);
    const row = Math.min(ranges[selectRangeLength - 1].start.row, ranges[selectRangeLength - 1].end.row);
    const maxCol = Math.max(ranges[selectRangeLength - 1].start.col, ranges[selectRangeLength - 1].end.col);
    const maxRow = Math.max(ranges[selectRangeLength - 1].start.row, ranges[selectRangeLength - 1].end.row);

    try {
      const blob = await item.getType('text/plain');
      const pastedData = await blob.text();
      const values = this.parsePastedData(pastedData);

      const pasteValuesRowCount = values.length;
      const pasteValuesColCount = Math.max(...values.map(row => row.length), 0);

      const processedValues = this.handlePasteValues(
        values,
        pasteValuesRowCount,
        pasteValuesColCount,
        maxRow - row + 1,
        maxCol - col + 1
      );

      const changedCellResults = await (table as ListTableAPI).changeCellValues(col, row, processedValues, true);

      if (table.hasListeners(TABLE_EVENT_TYPE.PASTED_DATA)) {
        table.fireListeners(TABLE_EVENT_TYPE.PASTED_DATA, {
          col,
          row,
          pasteData: processedValues,
          changedCellResults
        });
      }
    } catch (error) {
      // 静默处理粘贴错误，保持原有行为
      console.warn('Paste operation failed:', error);
    }
  }

  private parsePastedData(pastedData: string): (string | number)[][] {
    const rows = pastedData.replace(/\r(?!\n)/g, '\r\n').split('\r\n'); // 文本中的换行符格式进行统一处理
    const values: (string | number)[][] = [];

    // 移除最后一行空行
    if (rows.length > 1 && rows[rows.length - 1] === '') {
      rows.pop();
    }

    rows.forEach((rowCells: string) => {
      const cells = rowCells.split('\t'); // 将行数据拆分为单元格
      const rowValues: (string | number)[] = cells.map(cell => this.processCellValue(cell));
      values.push(rowValues);
    });

    return values;
  }

  private processCellValue(cell: string): string | number {
    if (cell.includes('\n')) {
      cell = cell
        .replace(/^"(.*)"$/, '$1') // 将字符串开头和结尾的双引号去除，并保留双引号内的内容
        .replace(/["]*/g, match => new Array(Math.floor(match.length / 2)).fill('"').join('')); // 连续出现的双引号替换为一半数量的双引号
    }

    // 尝试转换为数字
    const numValue = Number(cell);
    return isNaN(numValue) ? cell : numValue;
  }
  private handlePasteValues(
    values: (string | number)[][],
    rowCount: number,
    colCount: number,
    selectedRowCount: number,
    selectedColCount: number
  ) {
    if (selectedColCount > colCount || selectedRowCount > rowCount) {
      if (selectedColCount % colCount === 0 && selectedRowCount % rowCount === 0) {
        const toPasteValues: (string | number)[][] = [];
        // 在目标区域中循环遍历，将复制的值逐个粘贴到每个单元格中
        for (let i = 0; i < selectedRowCount; i++) {
          const rowPasteValue: (string | number)[] = [];
          toPasteValues.push(rowPasteValue);
          for (let j = 0; j < selectedColCount; j++) {
            const copiedRow = i % rowCount;
            const copiedCol = j % colCount;
            rowPasteValue.push(values[copiedRow][copiedCol]);
          }
        }
        return toPasteValues;
      }
      return values;
    }
    return values;
  }
}
