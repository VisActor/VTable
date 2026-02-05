import type VTableSheet from '../components/vtable-sheet';

/**
 * 事件管理器类
 * 负责处理VTableSheet组件的DOM事件和内部业务逻辑
 */
export class DomEventManager {
  private sheet: VTableSheet;
  private boundHandlers: Map<string, EventListener> = new Map();

  /**
   * 创建事件管理器实例
   * @param sheet VTableSheet实例
   */
  constructor(sheet: VTableSheet) {
    this.sheet = sheet;

    this.setupEventListeners();
  }

  /**
   * 设置DOM事件监听
   */
  private setupEventListeners(): void {
    // 获取Sheet元素
    // const element = this.sheet.getContainer();

    // // 设置鼠标事件
    // this.addEvent(element, 'mousedown', this.handleMouseDown.bind(this));

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
