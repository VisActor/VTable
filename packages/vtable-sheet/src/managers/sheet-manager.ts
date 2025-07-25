import type { ISheetManager, ISheetAPI } from '../ts-types/sheet';
import type { ISheetDefine } from '../ts-types';

export default class SheetManager implements ISheetManager {
  /** sheets集合 */
  _sheets: Map<string, ISheetDefine> = new Map();
  /** 当前活动sheet的key */
  _activeSheetKey: string = '';

  constructor() {
    // 初始化
  }

  /**
   * 获取当前活动sheet
   */
  getActiveSheet(): ISheetDefine | null {
    // 如果没有活动sheet，返回第一个sheet
    if (!this._activeSheetKey || !this._sheets.has(this._activeSheetKey)) {
      const firstSheet = this._sheets.values().next().value;
      if (firstSheet) {
        this._activeSheetKey = firstSheet.sheetKey;
        return firstSheet;
      }

      // 如果没有任何sheet，返回null而不是抛出错误
      return null;
    }

    return this._sheets.get(this._activeSheetKey)!;
  }

  /**
   * 设置活动sheet
   * @param sheetKey 要设置为活动sheet的sheet的key
   */
  setActiveSheet(sheetKey: string): void {
    if (!this._sheets.has(sheetKey)) {
      throw new Error(`Sheet with key '${sheetKey}' not found`);
    }

    this._activeSheetKey = sheetKey;

    // 更新所有sheet的active状态
    for (const [key, sheet] of this._sheets.entries()) {
      sheet.active = key === sheetKey;
    }
  }

  /**
   * 添加sheet
   * @param sheet 要添加的sheet
   */
  addSheet(sheet: ISheetDefine): void {
    // 检查key是否已存在
    if (this._sheets.has(sheet.sheetKey)) {
      throw new Error(`Sheet with key '${sheet.sheetKey}' already exists`);
    }

    // 添加sheet
    this._sheets.set(sheet.sheetKey, sheet);
  }

  /**
   * 移除sheet
   * @param sheetKey 要移除的sheet的key
   */
  removeSheet(sheetKey: string): void {
    // 检查key是否存在
    if (!this._sheets.has(sheetKey)) {
      throw new Error(`Sheet with key '${sheetKey}' not found`);
    }

    // 如果要移除的是当前活动sheet，需要选择新的活动sheet
    if (sheetKey === this._activeSheetKey) {
      // 查找其他sheet
      let nextSheet: ISheetDefine | null = null;

      for (const [key, sheet] of this._sheets.entries()) {
        if (key !== sheetKey) {
          nextSheet = sheet;
          break;
        }
      }

      // 如果有其他sheet，将其设为活动sheet
      if (nextSheet) {
        this._activeSheetKey = nextSheet.sheetKey;
        nextSheet.active = true;
      } else {
        this._activeSheetKey = '';
      }
    }

    // 移除sheet
    this._sheets.delete(sheetKey);
  }

  /**
   * 重命名sheet
   * @param sheetKey 要重命名的sheet的key
   * @param newTitle 新的标题
   */
  renameSheet(sheetKey: string, newTitle: string): void {
    // 检查key是否存在
    if (!this._sheets.has(sheetKey)) {
      throw new Error(`Sheet with key '${sheetKey}' not found`);
    }

    // 更新标题
    const sheet = this._sheets.get(sheetKey)!;
    sheet.sheetTitle = newTitle;
  }

  /**
   * 获取所有sheet
   * @returns 所有sheet
   */
  getAllSheets(): ISheetDefine[] {
    return Array.from(this._sheets.values());
  }

  /**
   * 获取指定sheet
   * @param sheetKey 要获取的sheet的key
   * @returns 指定sheet
   */
  getSheet(sheetKey: string): ISheetDefine | null {
    return this._sheets.get(sheetKey) || null;
  }

  /**
   * 获取sheet数量
   * @returns sheet数量
   */
  getSheetCount(): number {
    return this._sheets.size;
  }

  /**
   * 获取sheet API
   * @param sheetKey 要获取的sheet的key
   * @returns sheet API
   */
  getSheetAPI(sheetKey: string): ISheetAPI | null {
    // TODO: Implement sheet API
    return null;
  }

  /**
   * 监听sheet变化
   * @param callback 回调函数
   */
  onSheetChange(callback: (sheets: ISheetDefine[]) => void): void {
    // TODO: Implement event handling
  }

  /**
   * 移除sheet变化监听
   * @param callback 回调函数
   */
  offSheetChange(callback: (sheets: ISheetDefine[]) => void): void {
    // TODO: Implement event handling
  }

  /**
   * 监听活动sheet变化
   * @param callback 回调函数
   */
  onActiveSheetChange(callback: (sheet: ISheetDefine) => void): void {
    // TODO: Implement event handling
  }

  /**
   * 移除活动sheet变化监听
   * @param callback 回调函数
   */
  offActiveSheetChange(callback: (sheet: ISheetDefine) => void): void {
    // TODO: Implement event handling
  }

  /**
   * 移动sheet的位置
   * @param sourceKey 源sheet的key
   * @param targetKey 目标sheet的key
   */
  reorderSheet(sourceKey: string, targetKey: string, position: 'left' | 'right'): void {
    if (sourceKey === targetKey) {
      console.warn('Source and target sheet keys cannot be the same');
      return;
    }
    if (!this._sheets.has(sourceKey)) {
      throw new Error(`Source sheet '${sourceKey}' does not exist`);
    }
    if (!this._sheets.has(targetKey)) {
      throw new Error(`Target sheet '${targetKey}' does not exist`);
    }
    // 计算索引
    const sheetsArray = Array.from(this._sheets.entries());
    const sourceIndex = sheetsArray.findIndex(([key]) => key === sourceKey);
    const targetIndex = sheetsArray.findIndex(([key]) => key === targetKey);
    if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
      return;
    }
    // 计算插入位置
    let insertIndex = position === 'left' ? targetIndex : targetIndex + 1;
    // 调整索引
    if (sourceIndex < insertIndex) {
      insertIndex--;
    }
    // 重排序
    const [movedSheet] = sheetsArray.splice(sourceIndex, 1);
    sheetsArray.splice(insertIndex, 0, movedSheet);
    // 清空并重新添加
    this._sheets.clear();
    sheetsArray.forEach(([key, sheet]) => {
      this._sheets.set(key, sheet);
    });
  }
}
