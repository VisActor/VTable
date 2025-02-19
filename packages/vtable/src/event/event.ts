// import { FederatedPointerEvent } from '@src/vrender';
import type { FederatedPointerEvent, Gesture, IEventTarget } from '@src/vrender';
import { RichText } from '@src/vrender';
import type { ColumnDefine, ListTableConstructorOptions, MousePointerCellEvent } from '../ts-types';
import { IconFuncTypeEnum } from '../ts-types';
import type { StateManager } from '../state/state';
import type { Group } from '../scenegraph/graphic/group';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { Icon } from '../scenegraph/graphic/icon';
import { checkCellInSelect } from '../state/common/check-in-select';
import { bindMediaClick } from './media-click';
import { bindDrillEvent, checkHaveDrill, drillClick } from './drill';
import { bindSparklineHoverEvent } from './sparkline-event';
import type { BaseTableAPI } from '../ts-types/base-table';
import { checkHaveTextStick, handleTextStick } from '../scenegraph/stick-text';
import { bindGesture, bindTableGroupListener } from './listener/table-group';
import { bindScrollBarListener } from './listener/scroll-bar';
import { bindContainerDomListener } from './listener/container-dom';
import { bindTouchListener } from './listener/touch';
import { getCellEventArgsSet, type SceneEvent } from './util';
import { bindAxisClickEvent } from './pivot-chart/axis-click';
import { bindAxisHoverEvent } from './pivot-chart/axis-hover';
import type { PivotTable } from '../PivotTable';
import { Env } from '../tools/env';
import type { ListTable } from '../ListTable';
import { isValid } from '@visactor/vutils';
import { InertiaScroll } from './scroll';
import { isCellDisableSelect } from '../state/select/is-cell-select-highlight';
import { bindGroupTitleCheckboxChange } from './list-table/checkbox';
import { bindButtonClickEvent } from './component/button';

export class EventManager {
  table: BaseTableAPI;
  // _col: number;
  // _resizing: boolean = false;
  // /** 为了能够判断canvas mousedown 事件 以阻止事件冒泡 */
  // isPointerDownOnTable: boolean = false;
  isTouchdown: boolean; // touch scrolling mode on
  touchMovePoints: {
    x: number;
    y: number;
    timestamp: number;
  }[]; // touch points record in touch scrolling mode
  touchSetTimeout: any; // touch start timeout, use to distinguish touch scrolling mode and default touch event
  touchEnd: boolean; // is touch event end when default touch event listener response
  touchMove: boolean; // is touch listener working, use to disable document touch scrolling function
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
  globalEventListeners: { name: string; env: 'document' | 'body' | 'window'; callback: (e?: any) => void }[] = [];
  inertiaScroll: InertiaScroll;

  bindSparklineHoverEvent: boolean;

  _enableTableScroll: boolean = true;
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

    const stateManager: StateManager = this.table.stateManager;

    // 图标点击
    this.table.on(TABLE_EVENT_TYPE.ICON_CLICK, iconInfo => {
      const { col, row, x, y, funcType, icon, event } = iconInfo;
      // 下拉菜单按钮点击
      if (funcType === IconFuncTypeEnum.dropDown) {
        stateManager.triggerDropDownMenu(col, row, x, y, event);
      } else if (funcType === IconFuncTypeEnum.sort) {
        stateManager.triggerSort(col, row, icon, event);
      } else if (funcType === IconFuncTypeEnum.frozen) {
        stateManager.triggerFreeze(col, row, icon);
      } else if (funcType === IconFuncTypeEnum.drillDown) {
        drillClick(this.table);
      } else if (funcType === IconFuncTypeEnum.collapse || funcType === IconFuncTypeEnum.expand) {
        const isHasSelected = !!stateManager.select.ranges?.length;
        stateManager.updateSelectPos(-1, -1);
        stateManager.endSelectCells(true, isHasSelected);
        this.table.toggleHierarchyState(col, row);
      }
    });

    // 下拉菜单内容点击
    this.table.on(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLICK, () => {
      stateManager.hideMenu();
    });

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
    this.table.on(TABLE_EVENT_TYPE.DBLCLICK_CELL, (e: MousePointerCellEvent) => {
      if (e.federatedEvent) {
        const eventArgsSet = getCellEventArgsSet(e.federatedEvent as any);
        const resizeCol = this.table.scenegraph.getResizeColAt(
          eventArgsSet.abstractPos.x,
          eventArgsSet.abstractPos.y,
          eventArgsSet.eventArgs?.targetCell
        );
        const disableDblclickAutoResizeColWidth =
          this.table.options.disableDblclickAutoResizeColWidth ??
          this.table.options.resize?.disableDblclickAutoResizeColWidth;
        if (this.table.eventManager.checkCellFillhandle(eventArgsSet)) {
          this.table.fireListeners(TABLE_EVENT_TYPE.DBLCLICK_FILL_HANDLE, {});
        } else if (
          this.table._canResizeColumn(resizeCol.col, resizeCol.row) &&
          resizeCol.col >= 0 &&
          !disableDblclickAutoResizeColWidth
        ) {
          this.table.scenegraph.updateAutoColWidth(resizeCol.col);
          this.table.internalProps._widthResizedColMap.add(resizeCol.col);
          // if (this.table.isPivotChart()) {
          this.table.scenegraph.updateChartSizeForResizeColWidth(resizeCol.col);
          // }
          const state = this.table.stateManager;
          // update frozen shadowline component
          if (
            state.columnResize.col < state.table.frozenColCount &&
            !state.table.isPivotTable() &&
            !(state.table as ListTable).transpose
          ) {
            state.table.scenegraph.component.setFrozenColumnShadow(
              state.table.frozenColCount - 1,
              state.columnResize.isRightFrozen
            );
          }
          const colWidths = [];
          // 返回所有列宽信息
          for (let col = 0; col < this.table.colCount; col++) {
            colWidths.push(this.table.getColWidth(col));
          }
          this.table.fireListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN_END, {
            col: resizeCol.col,
            colWidths
          });
        }
      }
    });

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

      this.table.stateManager.updateSelectPos(
        eventArgs.col,
        eventArgs.row,
        eventArgs.event.shiftKey,
        eventArgs.event.ctrlKey || eventArgs.event.metaKey,
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

        this.table.stateManager.updateSelectPos(
          isSelectMoving ? updateCol : currentRange.end.col,
          isSelectMoving ? updateRow : currentRange.end.row,
          true,
          eventArgs.event.ctrlKey || eventArgs.event.metaKey,
          false,
          !isSelectMoving
        );
      } else {
        this.table.stateManager.updateSelectPos(
          eventArgs.col,
          eventArgs.row,
          eventArgs.event.shiftKey,
          eventArgs.event.ctrlKey || eventArgs.event.metaKey,
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

    if ((this.table.options as ListTableConstructorOptions).enableTreeStickCell && !eventArgs) {
      return false;
    }
    // if (eventArgs) { // 如果是鼠标处理表格外部如最后一列的后面 也期望可以拖拽列宽
    const resizeCol = this.table.scenegraph.getResizeColAt(
      eventArgsSet.abstractPos.x,
      eventArgsSet.abstractPos.y,
      eventArgs?.targetCell
    );
    if (this.table._canResizeColumn(resizeCol.col, resizeCol.row) && resizeCol.col >= 0) {
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

  checkCellFillhandle(eventArgsSet: SceneEvent, update?: boolean): boolean {
    if (this.table.options.excelOptions?.fillHandle) {
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

          const lastCellBound = this.table.scenegraph.highPerformanceGetCell(lastCol, lastRow).globalAABBBounds;
          // 计算鼠标与fillhandle矩形中心之间的距离
          const distanceX = Math.abs(eventArgsSet.abstractPos.x - lastCellBound.x2);
          const distanceY = Math.abs(eventArgsSet.abstractPos.y - lastCellBound.y2);
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

  chechColumnMover(eventArgsSet: SceneEvent): boolean {
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

  dealColumnMover(eventArgsSet: SceneEvent) {
    const { eventArgs } = eventArgsSet;
    if (isValid(eventArgs.col) && isValid(eventArgs.row)) {
      this.table.stateManager.updateMoveCol(
        eventArgs.col,
        eventArgs.row,
        eventArgsSet.abstractPos.x,
        eventArgsSet.abstractPos.y,
        eventArgs?.event?.nativeEvent
      );
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
    this.gesture.release();

    // remove global event listerner
    this.globalEventListeners.forEach(item => {
      if (item.env === 'document') {
        document.removeEventListener(item.name, item.callback);
      } else if (item.env === 'body') {
        document.body.removeEventListener(item.name, item.callback);
      } else if (item.env === 'window') {
        window.removeEventListener(item.name, item.callback);
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
}
