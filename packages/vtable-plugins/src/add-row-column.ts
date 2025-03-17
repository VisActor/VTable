import * as VTable from '@visactor/vtable';
/**
 * 添加行和列的插件的配置选项
 */
export interface AddRowColumnOptions {
  /**
   * 是否启用添加列
   */
  addColumnEnable?: boolean;
  /**
   * 是否启用添加行
   */
  addRowEnable?: boolean;
  /**
   * 添加列的回调函数
   */
  addColumnCallback?: (col: number) => void;
  /**
   * 添加行的回调函数
   */
  addRowCallback?: (row: number) => void;
}
/**
 * 添加行和列的插件
 * 该插件监听了table的MOUSEENTER_CELL,MOUSELEAVE_CELL,MOUSELEAVE_TABLE事件
 * 当鼠标hover到table的cell时，会显示添加行和列的dot和加号
 * 当鼠标离开table的cell时，会隐藏添加行和列的dot和加号
 */
export class AddRowColumnPlugin implements VTable.plugins.IVTablePlugin {
  id = 'add-row-column';
  name = 'Add-Row-Column';
  type: 'layout' = 'layout';
  runTime = [
    VTable.TABLE_EVENT_TYPE.MOUSEENTER_CELL,
    VTable.TABLE_EVENT_TYPE.MOUSELEAVE_CELL,
    VTable.TABLE_EVENT_TYPE.MOUSELEAVE_TABLE
  ];
  pluginOptions: AddRowColumnOptions;
  table: VTable.ListTable;
  hoverCell: VTable.TYPES.CellAddressWithBound;
  hideAllTimeoutId_addColumn: NodeJS.Timeout;
  hideAllTimeoutId_addRow: NodeJS.Timeout;
  leftDotForAddColumn: HTMLElement;
  rightDotForAddColumn: HTMLElement;
  addIconForAddColumn: HTMLElement;
  addLineForAddColumn: HTMLElement;
  topDotForAddRow: HTMLElement;
  bottomDotForAddRow: HTMLElement;
  addIconForAddRow: HTMLElement;
  addLineForAddRow: HTMLElement;

  constructor(
    pluginOptions: AddRowColumnOptions = {
      addColumnEnable: true,
      addRowEnable: true
    }
  ) {
    this.pluginOptions = pluginOptions;
    this.pluginOptions.addColumnEnable = this.pluginOptions.addColumnEnable ?? true;
    this.pluginOptions.addRowEnable = this.pluginOptions.addRowEnable ?? true;
    if (this.pluginOptions.addColumnEnable) {
      this.initAddColumnDomElement();
      this.bindEventForAddColumn();
    }
    if (this.pluginOptions.addRowEnable) {
      this.initAddRowDomElement();
      this.bindEventForAddRow();
    }
  }
  run(...args: any[]) {
    const eventArgs = args[0];
    const runTime = args[1];
    const table: VTable.BaseTableAPI = args[2];
    this.table = table as VTable.ListTable;
    if (runTime === VTable.TABLE_EVENT_TYPE.MOUSEENTER_CELL) {
      clearTimeout(this.hideAllTimeoutId_addColumn);
      clearTimeout(this.hideAllTimeoutId_addRow);
      const canvasBounds = table.canvas.getBoundingClientRect();
      const cell = table.getCellAtRelativePosition(
        eventArgs.event.clientX - canvasBounds.left,
        eventArgs.event.clientY - canvasBounds.top
      );
      this.hoverCell = cell;
      const cellRect = table.getCellRelativeRect(cell.col, cell.row);
      if (this.pluginOptions.addColumnEnable) {
        const isRowSerierNumberCol = table.isSeriesNumber(cell.col, 0);
        this.showDotForAddColumn(
          canvasBounds.top - 6,
          cellRect.left + canvasBounds.left,
          cellRect.right + canvasBounds.left,
          !isRowSerierNumberCol
        );
      }
      if (this.pluginOptions.addRowEnable) {
        const isHeader = table.isHeader(cell.col, cell.row);
        this.showDotForAddRow(
          cellRect.top + canvasBounds.top,
          canvasBounds.left - 6,
          cellRect.bottom + canvasBounds.top,
          !isHeader,
          !isHeader
        );
      }
    } else if (runTime === VTable.TABLE_EVENT_TYPE.MOUSELEAVE_CELL) {
    } else if (runTime === VTable.TABLE_EVENT_TYPE.MOUSELEAVE_TABLE) {
      if (this.pluginOptions.addColumnEnable) {
        this.delayHideAllForAddColumn();
      }
      if (this.pluginOptions.addRowEnable) {
        this.delayHideAllForAddRow();
      }
    }
  }
  // #region 添加列
  initAddColumnDomElement() {
    //创建一个div 作为hoverCell的顶部左侧的圆点
    this.leftDotForAddColumn = document.createElement('div');
    this.leftDotForAddColumn.style.width = '6px';
    this.leftDotForAddColumn.style.height = '6px';
    this.leftDotForAddColumn.style.backgroundColor = '#4A90E2'; // 蓝色
    this.leftDotForAddColumn.style.position = 'absolute';
    this.leftDotForAddColumn.style.cursor = 'pointer';
    this.leftDotForAddColumn.style.zIndex = '1000';
    this.leftDotForAddColumn.style.borderRadius = '50%';
    this.leftDotForAddColumn.style.border = '1px solid white';
    this.leftDotForAddColumn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
    document.body.appendChild(this.leftDotForAddColumn);

    //创建一个div 作为hoverCell的顶部右侧的圆点
    this.rightDotForAddColumn = document.createElement('div');
    this.rightDotForAddColumn.style.width = '6px';
    this.rightDotForAddColumn.style.height = '6px';
    this.rightDotForAddColumn.style.backgroundColor = '#4A90E2'; // 蓝色
    this.rightDotForAddColumn.style.position = 'absolute';
    this.rightDotForAddColumn.style.cursor = 'pointer';
    this.rightDotForAddColumn.style.zIndex = '1000';
    this.rightDotForAddColumn.style.borderRadius = '50%';
    this.rightDotForAddColumn.style.border = '1px solid white';
    this.rightDotForAddColumn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
    document.body.appendChild(this.rightDotForAddColumn);

    //创建+加号 当鼠标hover到圆点上时，显示+加号
    this.addIconForAddColumn = document.createElement('div');
    this.addIconForAddColumn.style.width = '18px';
    this.addIconForAddColumn.style.height = '18px';
    this.addIconForAddColumn.style.backgroundColor = '#4A90E2'; // 蓝色
    this.addIconForAddColumn.style.position = 'absolute';
    this.addIconForAddColumn.style.zIndex = '1001';
    this.addIconForAddColumn.style.display = 'none';
    this.addIconForAddColumn.style.borderRadius = '50%';
    this.addIconForAddColumn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    this.addIconForAddColumn.style.display = 'flex';
    this.addIconForAddColumn.style.justifyContent = 'center';
    this.addIconForAddColumn.style.alignItems = 'center';
    this.addIconForAddColumn.style.border = '1px solid white';
    document.body.appendChild(this.addIconForAddColumn);

    //addIcon中添加一个+号
    const addIconText = document.createElement('div');
    addIconText.textContent = '+';
    addIconText.style.color = 'white';
    addIconText.style.fontSize = '18px';
    addIconText.style.fontWeight = 'bold';
    addIconText.style.lineHeight = '15px';
    addIconText.style.userSelect = 'none';
    addIconText.style.cursor = 'pointer';
    addIconText.style.verticalAlign = 'top';
    addIconText.style.textAlign = 'center';

    this.addIconForAddColumn.appendChild(addIconText);

    // 创建加号下面列间隔线
    this.addLineForAddColumn = document.createElement('div');
    this.addLineForAddColumn.style.width = '2px';
    this.addLineForAddColumn.style.height = '10px';
    this.addLineForAddColumn.style.backgroundColor = '#4A90E2'; // 蓝色
    this.addLineForAddColumn.style.position = 'absolute';
    this.addLineForAddColumn.style.zIndex = '1001';
    this.addLineForAddColumn.style.display = 'none';
    document.body.appendChild(this.addLineForAddColumn);
  }
  bindEventForAddColumn() {
    this.leftDotForAddColumn.addEventListener('mouseenter', () => {
      clearTimeout(this.hideAllTimeoutId_addColumn);
      this.addIconForAddColumn.style.display = 'block';
      const dotWidth = this.leftDotForAddColumn.offsetWidth;
      const dotHeight = this.leftDotForAddColumn.offsetHeight;
      this.showAddIconForAddColumn(
        this.leftDotForAddColumn.offsetLeft + dotWidth / 2,
        this.leftDotForAddColumn.offsetTop + dotHeight / 2,
        true
      );
      this.showSplitLineForAddColumn(
        this.leftDotForAddColumn.offsetLeft + dotWidth / 2 - 1,
        this.leftDotForAddColumn.offsetTop + dotHeight / 2 + 2,
        this.table.getDrawRange().height
      );
    });

    this.rightDotForAddColumn.addEventListener('mouseenter', () => {
      clearTimeout(this.hideAllTimeoutId_addColumn);
      this.addIconForAddColumn.style.display = 'block';
      const dotWidth = this.rightDotForAddColumn.offsetWidth;
      const dotHeight = this.rightDotForAddColumn.offsetHeight;
      this.showAddIconForAddColumn(
        this.rightDotForAddColumn.offsetLeft + dotWidth / 2,
        this.rightDotForAddColumn.offsetTop + dotHeight / 2,
        false
      );
      this.showSplitLineForAddColumn(
        this.rightDotForAddColumn.offsetLeft + dotWidth / 2 - 1,
        this.rightDotForAddColumn.offsetTop + dotHeight / 2 + 2,
        this.table.getDrawRange().height
      );
    });

    // this.addIconForAddColumn.addEventListener('mouseenter', () => {
    //   clearTimeout(this.hideAllTimeoutId_addColumn);
    // });
    this.addIconForAddColumn.addEventListener('mouseleave', () => {
      this.addIconForAddColumn.style.display = 'none';
      this.addLineForAddColumn.style.display = 'none';
      this.delayHideAllForAddColumn();
    });

    this.addIconForAddColumn.addEventListener('click', (e: MouseEvent) => {
      const isLeft = this.addIconForAddColumn.dataset.addIconType === 'left';
      const columns = this.table.options.columns;
      const col = this.hoverCell.col;
      const addColIndex = isLeft ? col : col + 1;
      if (this.pluginOptions.addColumnCallback) {
        this.pluginOptions.addColumnCallback(addColIndex);
      } else {
        columns.splice(addColIndex, 0, {
          field: ``,
          title: `New Column ${col}`,
          width: 100
        });
        this.table.updateColumns(columns);
      }
      this.delayHideAllForAddColumn(0);
    });
  }
  showDotForAddColumn(
    top: number,
    left: number,
    right: number,
    isShowLeft: boolean = true,
    isShowRight: boolean = true
  ) {
    // 动态获取元素尺寸
    const dotWidth = this.leftDotForAddColumn.offsetWidth;
    const dotHeight = this.leftDotForAddColumn.offsetHeight;
    this.leftDotForAddColumn.style.left = `${left - dotWidth / 2}px`;
    this.leftDotForAddColumn.style.top = `${top - dotHeight / 2}px`;
    this.rightDotForAddColumn.style.left = `${right - dotWidth / 2}px`;
    this.rightDotForAddColumn.style.top = `${top - dotHeight / 2}px`;
    this.leftDotForAddColumn.style.display = isShowLeft ? 'block' : 'none';
    this.rightDotForAddColumn.style.display = isShowRight ? 'block' : 'none';
  }
  showAddIconForAddColumn(left: number, top: number, isLeft: boolean) {
    // 动态获取元素尺寸
    const iconWidth = this.addIconForAddColumn.offsetWidth;
    const iconHeight = this.addIconForAddColumn.offsetHeight;
    const dotHeight = this.leftDotForAddColumn.offsetHeight;
    this.addIconForAddColumn.style.left = `${left - iconWidth / 2}px`;
    this.addIconForAddColumn.style.top = `${top - iconHeight / 2 - dotHeight / 2}px`;
    if (isLeft) {
      this.addIconForAddColumn.dataset.addIconType = 'left';
    } else {
      this.addIconForAddColumn.dataset.addIconType = 'right';
    }
  }
  showSplitLineForAddColumn(left: number, top: number, height: number) {
    this.addLineForAddColumn.style.left = `${left}px`;
    this.addLineForAddColumn.style.top = `${top}px`;
    this.addLineForAddColumn.style.height = `${height}px`;
    this.addLineForAddColumn.style.display = 'block';
  }
  delayHideAllForAddColumn(delay: number = 1000) {
    this.hideAllTimeoutId_addColumn = setTimeout(() => {
      this.addIconForAddColumn.style.display = 'none';
      this.addLineForAddColumn.style.display = 'none';
      this.leftDotForAddColumn.style.display = 'none';
      this.rightDotForAddColumn.style.display = 'none';
    }, delay);
  }
  // #endregion

  // #region 添加行
  initAddRowDomElement() {
    //创建一个div 作为hoverCell的顶部左侧的圆点
    this.topDotForAddRow = document.createElement('div');
    this.topDotForAddRow.style.width = '6px';
    this.topDotForAddRow.style.height = '6px';
    this.topDotForAddRow.style.backgroundColor = '#4A90E2'; // 蓝色
    this.topDotForAddRow.style.position = 'absolute';
    this.topDotForAddRow.style.cursor = 'pointer';
    this.topDotForAddRow.style.zIndex = '1000';
    this.topDotForAddRow.style.borderRadius = '50%';
    this.topDotForAddRow.style.border = '1px solid white';
    this.topDotForAddRow.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
    document.body.appendChild(this.topDotForAddRow);

    //创建一个div 作为hoverCell的底部右侧的圆点
    this.bottomDotForAddRow = document.createElement('div');
    this.bottomDotForAddRow.style.width = '6px';
    this.bottomDotForAddRow.style.height = '6px';
    this.bottomDotForAddRow.style.backgroundColor = '#4A90E2'; // 蓝色
    this.bottomDotForAddRow.style.position = 'absolute';
    this.bottomDotForAddRow.style.cursor = 'pointer';
    this.bottomDotForAddRow.style.zIndex = '1000';
    this.bottomDotForAddRow.style.borderRadius = '50%';
    this.bottomDotForAddRow.style.border = '1px solid white';
    this.bottomDotForAddRow.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
    document.body.appendChild(this.bottomDotForAddRow);

    //创建+加号 当鼠标hover到圆点上时，显示+加号
    this.addIconForAddRow = document.createElement('div');
    this.addIconForAddRow.style.width = '18px';
    this.addIconForAddRow.style.height = '18px';
    this.addIconForAddRow.style.backgroundColor = '#4A90E2'; // 蓝色
    this.addIconForAddRow.style.position = 'absolute';
    this.addIconForAddRow.style.zIndex = '1001';
    this.addIconForAddRow.style.display = 'none';
    this.addIconForAddRow.style.borderRadius = '50%';
    this.addIconForAddRow.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    this.addIconForAddRow.style.display = 'flex';
    this.addIconForAddRow.style.justifyContent = 'center';
    this.addIconForAddRow.style.alignItems = 'center';
    this.addIconForAddRow.style.border = '1px solid white';
    document.body.appendChild(this.addIconForAddRow);

    //addIcon中添加一个+号
    const addIconText = document.createElement('div');
    addIconText.textContent = '+';
    addIconText.style.color = 'white';
    addIconText.style.fontSize = '18px';
    addIconText.style.fontWeight = 'bold';
    addIconText.style.lineHeight = '15px';
    addIconText.style.userSelect = 'none';
    addIconText.style.cursor = 'pointer';
    addIconText.style.verticalAlign = 'top';
    addIconText.style.textAlign = 'center';

    this.addIconForAddRow.appendChild(addIconText);

    // 创建加号下面行间隔线
    this.addLineForAddRow = document.createElement('div');
    this.addLineForAddRow.style.width = '10px';
    this.addLineForAddRow.style.height = '2px';
    this.addLineForAddRow.style.backgroundColor = '#4A90E2'; // 蓝色
    this.addLineForAddRow.style.position = 'absolute';
    this.addLineForAddRow.style.zIndex = '1001';
    this.addLineForAddRow.style.display = 'none';
    document.body.appendChild(this.addLineForAddRow);
  }
  bindEventForAddRow() {
    this.topDotForAddRow.addEventListener('mouseenter', () => {
      clearTimeout(this.hideAllTimeoutId_addRow);
      this.addIconForAddRow.style.display = 'block';
      const dotWidth = this.topDotForAddRow.offsetWidth;
      const dotHeight = this.topDotForAddRow.offsetHeight;
      this.showAddIconForAddRow(
        this.topDotForAddRow.offsetLeft + dotWidth / 2,
        this.topDotForAddRow.offsetTop + dotHeight / 2,
        true
      );
      this.showSplitLineForAddRow(
        this.topDotForAddRow.offsetLeft + dotWidth + 2,
        this.topDotForAddRow.offsetTop + dotHeight / 2 - 1,
        this.table.getDrawRange().width
      );
    });

    this.bottomDotForAddRow.addEventListener('mouseenter', () => {
      clearTimeout(this.hideAllTimeoutId_addRow);
      this.addIconForAddRow.style.display = 'block';
      const dotWidth = this.bottomDotForAddRow.offsetWidth;
      const dotHeight = this.bottomDotForAddRow.offsetHeight;
      this.showAddIconForAddRow(
        this.bottomDotForAddRow.offsetLeft + dotWidth / 2,
        this.bottomDotForAddRow.offsetTop + dotHeight / 2,
        false
      );
      this.showSplitLineForAddRow(
        this.bottomDotForAddRow.offsetLeft + dotWidth + 2,
        this.bottomDotForAddRow.offsetTop + dotHeight / 2 - 1,
        this.table.getDrawRange().height
      );
    });

    this.addIconForAddRow.addEventListener('mouseleave', () => {
      this.addIconForAddRow.style.display = 'none';
      this.addLineForAddRow.style.display = 'none';
      this.delayHideAllForAddRow();
    });

    this.addIconForAddRow.addEventListener('click', (e: MouseEvent) => {
      const isTop = this.addIconForAddRow.dataset.addIconType === 'top';
      const row = this.hoverCell.row;
      const addRowIndex = isTop ? row : row + 1;
      if (this.pluginOptions.addRowCallback) {
        this.pluginOptions.addRowCallback(addRowIndex);
      } else {
        const recordIndex = this.table.getRecordIndexByCell(0, addRowIndex);
        this.table.addRecord({}, recordIndex);
      }
      this.delayHideAllForAddRow(0);
    });
  }
  showDotForAddRow(top: number, left: number, bottom: number, isShowTop: boolean = true, isShowBottom: boolean = true) {
    // 动态获取元素尺寸
    const dotWidth = this.topDotForAddRow.offsetWidth;
    const dotHeight = this.topDotForAddRow.offsetHeight;
    this.topDotForAddRow.style.left = `${left - dotWidth / 2}px`;
    this.topDotForAddRow.style.top = `${top - dotHeight / 2}px`;
    this.bottomDotForAddRow.style.left = `${left - dotWidth / 2}px`;
    this.bottomDotForAddRow.style.top = `${bottom - dotHeight / 2}px`;
    this.topDotForAddRow.style.display = isShowTop ? 'block' : 'none';
    this.bottomDotForAddRow.style.display = isShowBottom ? 'block' : 'none';
  }
  showAddIconForAddRow(left: number, top: number, isTop: boolean) {
    // 动态获取元素尺寸
    const iconWidth = this.addIconForAddRow.offsetWidth;
    const iconHeight = this.addIconForAddRow.offsetHeight;
    const dotWidth = this.topDotForAddRow.offsetWidth;
    this.addIconForAddRow.style.left = `${left - iconWidth / 2 - dotWidth / 2}px`;
    this.addIconForAddRow.style.top = `${top - iconHeight / 2}px`;
    if (isTop) {
      this.addIconForAddRow.dataset.addIconType = 'top';
    } else {
      this.addIconForAddRow.dataset.addIconType = 'bottom';
    }
  }
  showSplitLineForAddRow(left: number, top: number, width: number) {
    this.addLineForAddRow.style.left = `${left}px`;
    this.addLineForAddRow.style.top = `${top}px`;
    this.addLineForAddRow.style.width = `${width}px`;
    this.addLineForAddRow.style.display = 'block';
  }
  delayHideAllForAddRow(delay: number = 1000) {
    this.hideAllTimeoutId_addRow = setTimeout(() => {
      this.addIconForAddRow.style.display = 'none';
      this.addLineForAddRow.style.display = 'none';
      this.topDotForAddRow.style.display = 'none';
      this.bottomDotForAddRow.style.display = 'none';
    }, delay);
  }
  // #endregion
  release() {
    this.leftDotForAddColumn.remove();
    this.rightDotForAddColumn.remove();
    this.addIconForAddColumn.remove();
    this.addLineForAddColumn.remove();
    this.topDotForAddRow.remove();
    this.bottomDotForAddRow.remove();
    this.addIconForAddRow.remove();
    this.addLineForAddRow.remove();
  }
}
