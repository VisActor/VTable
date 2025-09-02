import type { WorkSheet } from '../core/WorkSheet';
import type VTableSheet from '../components/vtable-sheet';
import type { CellCoord } from '../ts-types';

interface HighlightedCell {
  row: number;
  col: number;
  color: string;
}

export class CellHighlightManager {
  private sheet: VTableSheet;
  private highlightedCells: Map<string, HighlightedCell> = new Map();
  // /** 目前还没有自定义样式的功能 这个逻辑不需要 */
  // private originalBorderStyles: Map<string, any> = new Map(); // 保存原始边框样式
  private colors = [
    '#4A90E2', // 蓝色
    '#50C878', // 绿色
    '#FF6B6B', // 红色
    '#FFD93D', // 黄色
    '#6BCB77', // 浅绿
    '#9B59B6', // 紫色
    '#FF8C42', // 橙色
    '#00BCD4' // 青色
  ];
  private colorIndex = 0;

  constructor(sheet: VTableSheet) {
    this.sheet = sheet;
  }

  /**
   * 解析公式中的单元格引用（包括范围引用）
   */
  parseCellReferences(
    formula: string
  ): Array<{ address: string; coords: CellCoord[]; color: string; isRange: boolean }> {
    const references: Array<{ address: string; coords: CellCoord[]; color: string; isRange: boolean }> = [];

    // 匹配单元格引用的正则表达式（包括范围引用）
    const cellRefRegex = /(\$?[A-Z]+\$?\d+(?::\$?[A-Z]+\$?\d+)?)/gi;

    const matches = formula.match(cellRefRegex);
    if (!matches) {
      return references;
    }

    const activeSheet = this.sheet.getActiveSheet();
    if (!activeSheet) {
      return references;
    }

    const uniqueRefs = new Set<string>();
    this.colorIndex = 0;

    matches.forEach(match => {
      const normalizedRef = match.replace(/\$/g, '').toUpperCase();

      if (!uniqueRefs.has(normalizedRef)) {
        uniqueRefs.add(normalizedRef);

        try {
          const isRange = normalizedRef.includes(':');
          let coords: CellCoord[] = [];

          if (isRange) {
            // 解析范围引用，如 A1:A4
            coords = this.parseRangeReference(normalizedRef, activeSheet);
          } else {
            // 解析单个单元格引用，如 A1
            const coord = activeSheet.coordFromAddress(normalizedRef);
            coords = [coord];
          }

          if (coords.length > 0) {
            const color = this.colors[this.colorIndex % this.colors.length];
            this.colorIndex++;

            references.push({
              address: normalizedRef,
              coords: coords,
              color: color,
              isRange: isRange
            });
          }
        } catch (e) {
          // 忽略无效的单元格引用
          console.warn(`Invalid cell reference: ${normalizedRef}`, e);
        }
      }
    });

    return references;
  }

  /**
   * 解析范围引用，如 A1:A4
   */
  private parseRangeReference(rangeRef: string, activeSheet: WorkSheet): CellCoord[] {
    const parts = rangeRef.split(':');
    if (parts.length !== 2) {
      throw new Error(`Invalid range reference: ${rangeRef}`);
    }

    const startCoord = activeSheet.coordFromAddress(parts[0]);
    const endCoord = activeSheet.coordFromAddress(parts[1]);

    const coords: CellCoord[] = [];

    // 生成范围内的所有单元格坐标
    const startRow = Math.min(startCoord.row, endCoord.row);
    const endRow = Math.max(startCoord.row, endCoord.row);
    const startCol = Math.min(startCoord.col, endCoord.col);
    const endCol = Math.max(startCoord.col, endCoord.col);

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        coords.push({ row, col });
      }
    }

    return coords;
  }

  /**
   * 高亮公式中引用的单元格
   */
  highlightFormulaCells(formula: string): void {
    // 清除之前的高亮
    this.clearHighlights();

    const references = this.parseCellReferences(formula);

    if (references.length === 0) {
      return;
    }

    const activeSheet = this.sheet.getActiveSheet();
    if (!activeSheet) {
      return;
    }

    // 应用高亮
    references.forEach(ref => {
      ref.coords.forEach(coord => {
        const key = `${coord.row}-${coord.col}`;

        // 保存高亮信息
        this.highlightedCells.set(key, {
          row: coord.row,
          col: coord.col,
          color: ref.color
        });

        // 应用高亮样式
        this.applyCellHighlight(activeSheet, coord, ref.color);
      });
    });
  }

  /**
   * 应用单元格高亮
   * 通过修改单元格的边框样式实现
   */
  private applyCellHighlight(sheet: WorkSheet, coord: CellCoord, color: string): void {
    const table = (sheet as any).tableInstance;
    if (!table || !table.scenegraph) {
      return;
    }

    try {
      const key = `${coord.row}-${coord.col}`;

      // // 保存原始样式
      // if (!this.originalBorderStyles.has(key)) {
      //   const originalStyle = table.getCellStyle(coord.col, coord.row);
      //   this.originalBorderStyles.set(key, originalStyle);
      // }

      // 创建高亮样式
      const highlightStyle = {
        ...table._getCellStyle(coord.col, coord.row),
        borderColor: [color, color, color, color],
        borderLineWidth: [4, 4, 4, 4],
        borderLineDash: [
          [4, 4],
          [4, 4],
          [4, 4],
          [4, 4]
        ],
        padding: [8, 8, 8, 8]
      };

      // 注册自定义样式
      const styleId = `highlight-${key}`;
      table.registerCustomCellStyle(styleId, highlightStyle);

      // 应用样式到单元格
      table.arrangeCustomCellStyle({ col: coord.col, row: coord.row }, styleId, true);
    } catch (e) {
      console.error('applyCellHighlight: 错误', e);
    }
  }

  /**
   * 清除所有高亮
   */
  clearHighlights(): void {
    const activeSheet = this.sheet.getActiveSheet();
    if (!activeSheet) {
      return;
    }

    const table = (activeSheet as any).tableInstance;
    if (!table || !table.scenegraph) {
      return;
    }

    this.highlightedCells.forEach(info => {
      try {
        const key = `${info.row}-${info.col}`;
        const styleId = `highlight-${key}`;

        // 移除高亮样式
        table.arrangeCustomCellStyle({ col: info.col, row: info.row }, null, true);

        // // 恢复原始样式
        // const originalStyle = this.originalBorderStyles.get(key);
        // if (originalStyle) {
        //   table.registerCustomCellStyle(styleId, originalStyle);
        //   table.arrangeCustomCellStyle({ col: info.col, row: info.row }, styleId, true);
        // }
      } catch (e) {
        console.warn(`Failed to clear highlight at ${info.row},${info.col}:`, e);
      }
    });

    this.highlightedCells.clear();
    // this.originalBorderStyles.clear();
    this.colorIndex = 0;
  }

  /**
   * 获取单元格的高亮颜色
   */
  getCellHighlightColor(coord: CellCoord): string | null {
    const key = `${coord.row}-${coord.col}`;
    const info = this.highlightedCells.get(key);
    return info ? info.color : null;
  }

  /**
   * 获取高亮的单元格列表
   */
  getHighlightedCells(): Array<{ coord: CellCoord; color: string }> {
    return Array.from(this.highlightedCells.values()).map(info => ({
      coord: { row: info.row, col: info.col },
      color: info.color
    }));
  }

  /**
   * 获取彩色公式文本
   */
  getColorizedFormula(formula: string): Array<{ text: string; color?: string }> {
    const references = this.parseCellReferences(formula);
    const parts: Array<{ text: string; color?: string }> = [];

    if (references.length === 0) {
      return [{ text: formula }];
    }

    let lastIndex = 0;
    const colorMap = new Map<string, string>();
    references.forEach(ref => {
      colorMap.set(ref.address.toUpperCase(), ref.color);
    });

    const regex = /(\$?[A-Z]+\$?\d+)/gi;
    let match;

    while ((match = regex.exec(formula)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: formula.substring(lastIndex, match.index) });
      }

      const normalizedRef = match[0].replace(/\$/g, '').toUpperCase();
      const color = colorMap.get(normalizedRef);
      parts.push({
        text: match[0],
        color: color
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < formula.length) {
      parts.push({ text: formula.substring(lastIndex) });
    }

    return parts;
  }

  /**
   * 销毁管理器
   */
  release(): void {
    this.clearHighlights();
    this.highlightedCells.clear();
    // this.originalBorderStyles.clear();
  }
}
