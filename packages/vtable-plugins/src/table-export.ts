import type { plugins, ListTable } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type { ExportVTableToCsvOptions, ExportVTableToExcelOptions } from './table-export/index';
import { exportVTableToCsv, exportVTableToExcel, downloadCsv, downloadExcel } from './table-export/index';

// // 扩展ListTable接口以包含导出方法
// declare module '@visactor/vtable' {
//   interface ListTableAll {
//     exportToCsv: (options?: any) => void;
//     exportToExcel: (options?: any) => void;
//   }
// }

export type TableExportPluginOptions = {
  exportExcelOptions?: ExportVTableToExcelOptions;
  exportCsvOptions?: ExportVTableToCsvOptions;
  exportOnIdle?: boolean; //是否空闲时导出下载，默认false
};

/**
 * 表格导出插件
 * 提供CSV和Excel格式的表格数据导出功能
 */
export class TableExportPlugin implements plugins.IVTablePlugin {
  id = 'table-export-plugin';
  name = 'TableExport';
  runTime: any[] = [TABLE_EVENT_TYPE.INITIALIZED];
  private table: ListTable;
  private pluginOptions: TableExportPluginOptions;
  constructor(pluginOptions: TableExportPluginOptions) {
    this.pluginOptions = Object.assign(
      {
        exportOnIdle: false,
        exportExcelOptions: { downloadFile: true, fileName: 'export' },
        exportCsvOptions: { downloadFile: true, fileName: 'export' }
      },
      pluginOptions
    );
  }
  /**
   * 插件初始化方法
   * @param tableInstance - 表格实例
   */
  run(...args: any[]) {
    // const eventArgs = args[0];
    const runTime = args[1];
    if (runTime === TABLE_EVENT_TYPE.INITIALIZED) {
      const eventArgs = args[0];
      this.table = args[2];
      // 挂载导出方法到表格实例
      (this.table as any).exportToCsv = () => {
        const options = this.pluginOptions.exportCsvOptions;
        if (options.downloadFile) {
          return downloadCsv(exportVTableToCsv(this.table, options), options.fileName || 'export');
        }
        return exportVTableToCsv(this.table, options);
      };
      (this.table as any).exportToExcel = async () => {
        const options = this.pluginOptions.exportExcelOptions;
        if (options.downloadFile) {
          return await downloadExcel(
            (await exportVTableToExcel(this.table, options, this.pluginOptions.exportOnIdle)) as ArrayBuffer,
            options.fileName || 'export'
          );
        }
        return exportVTableToExcel(this.table, options, this.pluginOptions.exportOnIdle);
      };
    }
  }

  /**
   * 插件销毁方法
   * 清理挂载到表格实例的方法
   */
  release() {
    if (this.table) {
      delete (this.table as any).exportToCsv;
      delete (this.table as any).exportToExcel;
      this.table = null;
    }
  }
}
