import type VTableSheet from '../components/vtable-sheet';

// 拖拽状态接口
interface DragState {
  isDragging: boolean;
  draggedSheetKey: string | null;
  draggedElement: HTMLElement | null;
  startX: number;
  startY: number;
  threshold: number;
  preview: HTMLElement | null;
  dropZones: Array<{
    element: HTMLElement;
    position: 'left' | 'right';
    targetKey: string;
  }>;
}

export default class SheetTabDragManager {
  // 依赖的VTableSheet实例
  private sheet: VTableSheet;
  // 拖拽状态
  private dragState: DragState = {
    isDragging: false,
    draggedSheetKey: null,
    draggedElement: null,
    startX: 0,
    startY: 0,
    threshold: 5,
    preview: null,
    dropZones: []
  };
  // 插入指示器
  private insertIndicator: HTMLElement | null = null;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseUp: (e: MouseEvent) => void;

  constructor(sheet: VTableSheet) {
    this.sheet = sheet;
    // 绑定this上下文并存储函数引用
    this.boundMouseMove = e => this.handleGlobalMouseMove(e);
    this.boundMouseUp = e => this.handleGlobalMouseUp(e);
  }

  /**
   * 处理tab鼠标按下事件
   */
  handleTabMouseDown(e: MouseEvent, sheetKey: string): void {
    if (!this.insertIndicator) {
      this.insertIndicator = this.sheet.getRootElement().querySelector('.vtable-sheet-insert-indicator') as HTMLElement;
    }
    if (e.button !== 0) {
      return;
    }
    e.preventDefault();
    // 记录拖拽开始位置
    this.dragState.startX = e.clientX;
    this.dragState.startY = e.clientY;
    this.dragState.draggedSheetKey = sheetKey;
    this.dragState.draggedElement = e.target as HTMLElement;

    // 全局鼠标事件监听
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  /**
   * 处理全局鼠标移动事件
   *
   */
  handleGlobalMouseMove(e: MouseEvent): void {
    if (!this.dragState.draggedSheetKey || !this.dragState.draggedElement) {
      return;
    }
    const deltaX = Math.abs(e.clientX - this.dragState.startX);
    const deltaY = Math.abs(e.clientY - this.dragState.startY);
    // 判断是否超过拖拽阈值
    if (!this.dragState.isDragging && (deltaX > this.dragState.threshold || deltaY > this.dragState.threshold)) {
      this.startDragging();
    }
    if (this.dragState.isDragging) {
      this.updateDragging(e);
    }
  }

  /**
   * 处理全局鼠标抬起事件
   */
  handleGlobalMouseUp(e: MouseEvent): void {
    if (this.dragState.isDragging) {
      this.endDragging(e);
    }
    // 清理拖拽状态
    this.cleanupDragState();
    // 移除全局事件监听
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
  }

  /**
   * 开始拖拽
   */
  startDragging(): void {
    if (!this.dragState.draggedElement || !this.dragState.draggedSheetKey) {
      return;
    }
    this.dragState.isDragging = true;
    this.dragState.draggedElement.classList.add('dragging');
    // 创建拖拽预览
    this.createDragPreview();
    // 计算放置区域
    this.calculateDropZones();
    if (this.insertIndicator) {
      this.insertIndicator.style.display = 'block';
    }
  }

  /**
   * 更新拖拽状态
   */
  updateDragging(e: MouseEvent): void {
    if (!this.dragState.isDragging) {
      return;
    }
    // 更新拖拽预览位置
    this.updateDragPreview(e);
    // 检测当前鼠标位置对应的放置区域
    const dropZone = this.getDropZoneAt(e.clientX, e.clientY);
    if (dropZone) {
      this.showInsertIndicator(dropZone);
    } else {
      this.hideInsertIndicator();
    }
  }

  /**
   * 结束拖拽
   */
  endDragging(e: MouseEvent): void {
    if (!this.dragState.isDragging || !this.dragState.draggedSheetKey) {
      return;
    }
    // 检查是否有有效的放置目标
    const dropZone = this.getDropZoneAt(e.clientX, e.clientY);
    if (dropZone && dropZone.targetKey !== this.dragState.draggedSheetKey) {
      // 执行拖拽排序
      this.performTabReorder(this.dragState.draggedSheetKey, dropZone.targetKey, dropZone.position);
    }
    this.hideInsertIndicator();
    if (this.dragState.draggedElement) {
      this.dragState.draggedElement.classList.remove('dragging');
    }
  }

  /**
   * 创建拖拽预览
   */
  createDragPreview(): void {
    if (!this.dragState.draggedElement) {
      return;
    }
    // 创建拖拽预览元素
    this.dragState.preview = document.createElement('div');
    this.dragState.preview.className = 'vtable-sheet-drag-preview';
    this.dragState.preview.innerHTML = `
      <span class="drag-preview-text">${this.dragState.draggedElement.textContent}</span>
    `;
    document.body.appendChild(this.dragState.preview);
    this.dragState.draggedElement.style.cursor = 'grabbing';
  }

  /**
   * 更新拖拽预览位置
   */
  updateDragPreview(e: MouseEvent): void {
    if (!this.dragState.preview) {
      return;
    }
    this.dragState.preview.style.left = `${e.clientX - this.dragState.preview.offsetWidth / 2}px`;
    this.dragState.preview.style.top = `${e.clientY - this.dragState.preview.offsetHeight / 2}px`;
  }

  /**
   * 清理拖拽预览
   */
  cleanupDragPreview(): void {
    // 移除拖拽预览元素
    if (this.dragState.preview) {
      this.dragState.preview.remove();
      this.dragState.preview = null;
    }
    if (this.dragState.draggedElement) {
      this.dragState.draggedElement.style.cursor = '';
    }
  }

  /**
   * 计算放置区域
   */
  calculateDropZones(): void {
    this.dragState.dropZones = [];
    const tabsContainer = this.sheet.getSheetTabElement()?.querySelector('.vtable-sheet-tabs-container') as HTMLElement;
    if (!tabsContainer) {
      return;
    }
    const tabs = tabsContainer.querySelectorAll('.vtable-sheet-tab') as NodeListOf<HTMLElement>;
    tabs.forEach(tab => {
      const sheetKey = tab.dataset.key;
      if (!sheetKey || sheetKey === this.dragState.draggedSheetKey) {
        return;
      }
      // 左侧放置区域
      this.dragState.dropZones.push({
        element: tab,
        position: 'left',
        targetKey: sheetKey
      });

      // 右侧放置区域
      this.dragState.dropZones.push({
        element: tab,
        position: 'right',
        targetKey: sheetKey
      });
    });
  }

  /**
   * 获取指定位置的放置区域
   */
  getDropZoneAt(x: number, y: number): (typeof this.dragState.dropZones)[0] | null {
    for (const zone of this.dragState.dropZones) {
      const rect = zone.element.getBoundingClientRect();

      // 检查Y坐标是否在tab范围内
      if (y < rect.top || y > rect.bottom) {
        continue;
      }
      const midX = rect.left + rect.width / 2;
      if (zone.position === 'left' && x >= rect.left && x <= midX) {
        return zone;
      } else if (zone.position === 'right' && x >= midX && x <= rect.right) {
        return zone;
      }
    }

    return null;
  }

  /**
   * 显示插入指示器
   */
  showInsertIndicator(dropZone: (typeof this.dragState.dropZones)[0]): void {
    if (!this.insertIndicator) {
      return;
    }
    const rect = dropZone.element.getBoundingClientRect();
    const containerRect = this.sheet
      .getRootElement()
      .querySelector('.vtable-sheet-tabs-container')
      ?.getBoundingClientRect();
    if (!containerRect) {
      return;
    }
    let indicatorX: number;
    if (dropZone.position === 'left') {
      indicatorX = rect.left - containerRect.left - 4;
    } else {
      indicatorX = rect.right - containerRect.left - 4;
    }
    this.insertIndicator.style.left = `${indicatorX}px`;
    this.insertIndicator.style.display = 'block';
  }

  /**
   * 隐藏插入指示器
   */
  hideInsertIndicator(): void {
    if (this.insertIndicator) {
      this.insertIndicator.style.display = 'none';
    }
  }

  /**
   * 执行tab排序
   * @param sourceKey 源tab的key
   * @param targetKey 目标tab的key
   * @param position 插入位置 左侧或右侧
   */
  performTabReorder(sourceKey: string, targetKey: string, position: 'left' | 'right'): void {
    try {
      this.sheet.getSheetManager().reorderSheet(sourceKey, targetKey, position);
      // 更新UI
      this.sheet.updateSheetTabs();
      this.sheet.updateSheetMenu();
    } catch (error) {
      console.error('Tab reorder failed:', error);
    }
  }

  /**
   * 清理拖拽状态
   */
  cleanupDragState(): void {
    this.cleanupDragPreview();
    // 重置拖拽状态
    this.dragState.isDragging = false;
    this.dragState.draggedSheetKey = null;
    this.dragState.draggedElement = null;
    this.dragState.dropZones = [];
    this.dragState.startX = 0;
    this.dragState.startY = 0;
  }
}
