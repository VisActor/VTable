import type { ISheetManager, SheetDefine } from '../ts-types';

/**
 * Sheet管理器 - 管理多个sheet
 */
export default class SheetManager implements ISheetManager {
  /** sheets集合 */
  _sheets: Map<string, SheetDefine> = new Map();
  /** 当前活动sheet的key */
  _activeSheetKey: string = '';

  /**
   * 构造函数
   */
  constructor() {
    // 初始化
  }

  /**
   * 获取当前活动sheet
   */
  getActiveSheet(): SheetDefine | null {
    // 如果没有活动sheet，返回第一个sheet
    if (!this._activeSheetKey || !this._sheets.has(this._activeSheetKey)) {
      const firstSheet = this._sheets.values().next().value;
      if (firstSheet) {
        this._activeSheetKey = firstSheet.key;
        return firstSheet;
      }

      // 如果没有任何sheet，返回null而不是抛出错误
      return null;
    }

    return this._sheets.get(this._activeSheetKey)!;
  }

  /**
   * 设置活动sheet
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
   */
  addSheet(sheet: SheetDefine): void {
    // 检查key是否已存在
    if (this._sheets.has(sheet.key)) {
      throw new Error(`Sheet with key '${sheet.key}' already exists`);
    }

    // 如果这是第一个sheet，将其设为活动sheet
    if (this._sheets.size === 0) {
      sheet.active = true;
      this._activeSheetKey = sheet.key;
    }

    // 添加sheet
    this._sheets.set(sheet.key, sheet);
  }

  /**
   * 移除sheet
   */
  removeSheet(sheetKey: string): void {
    // 检查key是否存在
    if (!this._sheets.has(sheetKey)) {
      throw new Error(`Sheet with key '${sheetKey}' not found`);
    }

    // 如果要移除的是当前活动sheet，需要选择新的活动sheet
    if (sheetKey === this._activeSheetKey) {
      // 查找其他sheet
      let nextSheet: SheetDefine | null = null;

      for (const [key, sheet] of this._sheets.entries()) {
        if (key !== sheetKey) {
          nextSheet = sheet;
          break;
        }
      }

      // 如果有其他sheet，将其设为活动sheet
      if (nextSheet) {
        this._activeSheetKey = nextSheet.key;
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
   */
  renameSheet(sheetKey: string, newTitle: string): void {
    // 检查key是否存在
    if (!this._sheets.has(sheetKey)) {
      throw new Error(`Sheet with key '${sheetKey}' not found`);
    }

    // 更新标题
    const sheet = this._sheets.get(sheetKey)!;
    sheet.title = newTitle;
  }

  /**
   * 获取所有sheet
   */
  getAllSheets(): SheetDefine[] {
    return Array.from(this._sheets.values());
  }

  /**
   * 获取指定sheet
   */
  getSheet(sheetKey: string): SheetDefine | null {
    return this._sheets.get(sheetKey) || null;
  }

  /**
   * 获取sheet数量
   */
  getSheetCount(): number {
    return this._sheets.size;
  }
}
