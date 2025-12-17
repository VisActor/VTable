import type { ColumnsDefine } from '@visactor/vtable';

// 数据导入结果类型（单个sheet）
export interface ImportResult {
  columns: ColumnsDefine;
  records: Record<string, unknown>[];
}

// 单个 sheet 的数据结构（用于多 sheet 导入）
export interface SheetData {
  /** sheet 名称 */
  sheetTitle: string;
  /** sheet 唯一标识（自动生成） */
  sheetKey: string;
  /** 列定义 */
  columns?: ColumnsDefine;
  /** 数据 (二维数组格式，用于 VTable-sheet) */
  data: unknown[][];
  /** 列数 */
  columnCount: number;
  /** 行数 */
  rowCount: number;
  /** 单元格合并信息 */
  cellMerge?: Array<{
    text?: string;
    range: {
      start: {
        col: number;
        row: number;
      };
      end: {
        col: number;
        row: number;
      };
      isCustom?: boolean;
    };
  }>;
}

// 多 sheet 导入结果类型
export interface MultiSheetImportResult {
  /** 所有 sheet 的数据 */
  sheets: SheetData[];
}

export interface ExcelImportOptions {
  id?: string;
  headerRowCount?: number; // 指定头的层数，不指定会使用detectHeaderRowCount来自动判断，但是只有excel才有
  exportData?: boolean; // 是否导出JavaScript对象字面量格式文件
  autoTable?: boolean; // 是否自动替换表格数据
  autoColumns?: boolean; // 是否自动生成列配置
  delimiter?: string; // CSV分隔符，默认逗号
  batchSize?: number; // 批处理大小，默认1000行
  enableBatchProcessing?: boolean; // 是否启用分批处理，默认true
  asyncDelay?: number; // 异步处理延迟时间(ms)，默认5ms
  importAllSheets?: boolean; // 是否导入所有sheet，默认false（仅导入第一个sheet）
  sheetIndices?: number[]; // 指定要导入的sheet索引数组（从0开始），不指定则导入所有
  clearExisting?: boolean; // 对于 VTable-sheet：是否清除现有 sheets（true=替换，false=追加），默认 true
}
