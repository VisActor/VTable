import type { CellCoord } from '../ts-types';
import type VTableSheet from '../components/vtable-sheet';
import type { FormulaUIManager } from '../formula/formula-ui-manager';

export class EventManager {
  private sheet: VTableSheet;
  private boundHandlers: Map<string, EventListener> = new Map();

  // 预先绑定的事件处理方法
  readonly handleCellSelectedBound: () => void;
  readonly handleCellValueChangedBound: (event: any) => void;
  readonly handleSelectionChangedForRangeModeBound: (event: any) => void;

  /**
   * Creates a new EventManager instance
   * @param sheet The Sheet instance
   */
  constructor(sheet: VTableSheet) {
    this.sheet = sheet;

    // 预先绑定事件处理方法
    this.handleCellSelectedBound = this.handleCellSelected.bind(this);
    this.handleCellValueChangedBound = this.handleCellValueChanged.bind(this);
    this.handleSelectionChangedForRangeModeBound = this.handleSelectionChangedForRangeMode.bind(this);

    this.setupEventListeners();
  }

  /**
   * 设置事件监听
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
   * 添加事件监听
   * @param target 事件目标
   * @param eventType 事件类型
   * @param handler 事件处理函数
   */
  private addEvent(target: EventTarget, eventType: string, handler: EventListener): void {
    target.addEventListener(eventType, handler);
    this.boundHandlers.set(`${eventType}-${handler.toString()}`, handler);
  }

  /**
   * 处理单元格选择事件
   * 这个方法处理从Worksheet冒泡上来的cell-selected事件
   */
  handleCellSelected(): void {
    // 如果在公式编辑状态，不处理
    if (this.sheet.formulaManager.formulaWorkingOnCell) {
      return;
    }

    // 重置公式栏显示标志，让公式栏显示选中单元格的值
    const formulaUIManager = this.sheet.formulaUIManager;
    formulaUIManager.isFormulaBarShowingResult = false;
    formulaUIManager.clearFormula();
    formulaUIManager.updateFormulaBar();
  }

  /**
   * 处理单元格值变更事件
   */
  handleCellValueChanged(event: any): void {
    this.sheet.formulaManager.formulaRangeSelector.handleCellValueChanged(event);
  }
  handleSelectionChangedForRangeMode(event: any): void {
    this.sheet.formulaManager.formulaRangeSelector.handleSelectionChangedForRangeMode(event);
  }

  // 原有方法保持不变
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

  private handleWindowResize(event: UIEvent): void {
    // 更新Sheet大小
    this.sheet.resize();
  }

  private getCellFromMouseCoords(x: number, y: number): CellCoord {
    // 原有实现保持不变
    return {
      row: 0,
      col: 0
    };
  }

  /**
   * 获取FormulaUIManager实例
   */
  private getFormulaUIManager(): FormulaUIManager | null {
    return (this.sheet as any).formulaUIManager || null;
  }

  /**
   * 释放所有事件处理函数
   */
  release(): void {
    const element = this.sheet.getContainer();

    // 移除所有事件监听器
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
