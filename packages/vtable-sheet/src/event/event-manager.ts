import type VTableSheet from '../components/vtable-sheet';

/**
 * 事件管理器类
 * 负责处理VTableSheet组件的DOM事件和内部业务逻辑
 */
export class EventManager {
  private sheet: VTableSheet;
  private boundHandlers: Map<string, EventListener> = new Map();

  /**
   * 创建事件管理器实例
   * @param sheet VTableSheet实例
   */
  constructor(sheet: VTableSheet) {
    this.sheet = sheet;

    this.setupEventListeners();
    this.setupTableEventListeners();
  }

  /**
   * 设置DOM事件监听
   */
  private setupEventListeners(): void {
    // 获取Sheet元素
    const element = this.sheet.getContainer();

    // 设置鼠标事件
    this.addEvent(element, 'mousedown', this.handleMouseDown.bind(this));
    this.addEvent(element, 'mousemove', this.handleMouseMove.bind(this));
    this.addEvent(element, 'mouseup', this.handleMouseUp.bind(this));
    this.addEvent(element, 'dblclick', this.handleDoubleClick.bind(this));

    // 设置键盘事件
    this.addEvent(element, 'keydown', this.handleKeyDown.bind(this));
    this.addEvent(element, 'keyup', this.handleKeyUp.bind(this));

    // 设置剪贴板事件
    this.addEvent(element, 'copy', this.handleCopy.bind(this));
    this.addEvent(element, 'paste', this.handlePaste.bind(this));
    this.addEvent(element, 'cut', this.handleCut.bind(this));

    // 设置焦点事件
    this.addEvent(element, 'focus', this.handleFocus.bind(this));
    this.addEvent(element, 'blur', this.handleBlur.bind(this));

    // 窗口大小变化事件
    this.addEvent(window, 'resize', this.handleWindowResize.bind(this));
  }

  /**
   * 添加DOM事件监听
   * @param target 事件目标
   * @param eventType 事件类型
   * @param handler 事件处理函数
   */
  private addEvent(target: EventTarget, eventType: string, handler: EventListener): void {
    target.addEventListener(eventType, handler);
    this.boundHandlers.set(`${eventType}-${handler.toString()}`, handler);
  }

  /**
   * 设置 Table 事件监听器（内部业务逻辑）
   * 使用统一的 onTableEvent API
   */
  private setupTableEventListeners(): void {
    // 监听单元格点击 - 用于更新公式栏
    this.sheet.onTableEvent('click_cell', event => {
      // 如果在公式编辑状态，不处理
      if (this.sheet.formulaManager.formulaWorkingOnCell) {
        return;
      }

      // 重置公式栏显示标志，让公式栏显示选中单元格的值
      const formulaUIManager = this.sheet.formulaUIManager;
      formulaUIManager.isFormulaBarShowingResult = false;
      formulaUIManager.clearFormula();
      formulaUIManager.updateFormulaBar();
    });

    // 监听单元格值改变 - 用于公式相关逻辑
    this.sheet.onTableEvent('change_cell_value', event => {
      // 处理公式相关逻辑
      this.sheet.formulaManager.formulaRangeSelector.handleCellValueChanged(event);
    });

    // 监听选择范围变化 - 用于公式范围选择
    this.sheet.onTableEvent('selected_changed', event => {
      // 处理公式相关逻辑
      this.sheet.formulaManager.formulaRangeSelector.handleSelectionChangedForRangeMode(event);
    });

    // 监听拖拽选择结束 - 用于公式范围选择
    this.sheet.onTableEvent('drag_select_end', event => {
      // 处理公式相关逻辑
      this.sheet.formulaManager.formulaRangeSelector.handleSelectionChangedForRangeMode(event);
    });
  }

  // 原有DOM事件处理方法保持不变
  private handleMouseDown(event: MouseEvent): void {
    // 原有逻辑保持不变
  }

  private handleMouseMove(event: MouseEvent): void {
    // 原有逻辑保持不变
  }

  private handleMouseUp(event: MouseEvent): void {
    // 原有逻辑保持不变
  }

  private handleDoubleClick(event: MouseEvent): void {
    // 原有逻辑保持不变
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // 原有逻辑保持不变
  }

  private handleKeyUp(event: KeyboardEvent): void {
    // 原有逻辑保持不变
  }

  private handleCopy(event: ClipboardEvent): void {
    // 原有逻辑保持不变
  }

  private handlePaste(event: ClipboardEvent): void {
    // 原有逻辑保持不变
  }

  private handleCut(event: ClipboardEvent): void {
    // 原有逻辑保持不变
  }

  private handleFocus(event: FocusEvent): void {
    // 原有逻辑保持不变
  }

  private handleBlur(event: FocusEvent): void {
    // 原有逻辑保持不变
  }

  /**
   * 处理窗口大小变化事件
   * @param event UI事件
   */
  private handleWindowResize(event: UIEvent): void {
    // 更新Sheet大小
    this.sheet.resize();
  }

  /**
   * 释放所有事件处理函数
   */
  release(): void {
    const element = this.sheet.getContainer();

    // 移除所有DOM事件监听器
    for (const [key, handler] of this.boundHandlers.entries()) {
      const eventType = key.split('-')[0];

      if (eventType === 'resize') {
        window.removeEventListener(eventType, handler);
      } else {
        element.removeEventListener(eventType, handler);
      }
    }

    // 清空事件处理函数映射
    this.boundHandlers.clear();
  }
}
