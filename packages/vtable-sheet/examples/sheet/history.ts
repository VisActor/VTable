import { VTableSheet } from '../../src/index';
import type { IVTableSheetOptions } from '../../src/index';
import * as VTablePlugins from '@visactor/vtable-plugins';
// 简单示例：演示如何在 VTableSheet 中启用 History 插件并通过按钮和快捷键使用撤销 / 重做

const CONTAINER_ID = 'vTable';

export function createTable() {
  const container = document.getElementById(CONTAINER_ID) as HTMLDivElement;
  if (!container) {
    throw new Error(`#${CONTAINER_ID} not found`);
  }

  const options: IVTableSheetOptions = {
    showFormulaBar: true,
    showSheetTab: true,
    defaultRowHeight: 25,
    defaultColWidth: 80,
    VTablePluginModules: [
      {
        module: VTablePlugins.HistoryPlugin,
        moduleOptions: {
          maxHistory: 100,
          enableCompression: true
        },
        disabled: false
      }
    ],
    sheets: [
      {
        sheetKey: 'sheet1',
        sheetTitle: 'History Demo',
        rowCount: 20,
        columnCount: 10,
        data: [
          ['Name', 'Age', 'City', 'tel', 'email'],
          ['Alice', 24, 'Beijing', '13800000000', 'alice@example.com'],
          ['Bob', 30, 'Shanghai', '13900000000', 'bob@example.com'],
          ['Carol', 28, 'Shenzhen', '13700000000', 'carol@example.com'],
          ['David', 32, 'Guangzhou', '13600000000', 'david@example.com'],
          ['Eve', 26, 'Chengdu', '13500000000', 'eve@example.com'],
          ['Frank', 34, 'Chongqing', '13400000000', 'frank@example.com']
        ],
        firstRowAsHeader: true,
        active: true
      }
    ]
  };

  const sheet = new VTableSheet(container, options);

  // 挂到 window 方便调试
  (window as any).sheetInstance = sheet;

  // 创建简单的控制按钮
  createControls(sheet);

  return sheet;
}

function createControls(sheet: VTableSheet) {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '20px';
  wrapper.style.right = '20px';
  wrapper.style.zIndex = '999';
  wrapper.style.background = '#fff';
  wrapper.style.padding = '8px 12px';
  wrapper.style.border = '1px solid #ddd';
  wrapper.style.borderRadius = '4px';
  wrapper.style.fontSize = '12px';

  const undoBtn = document.createElement('button');
  undoBtn.textContent = '撤销 (Ctrl+Z)';
  undoBtn.style.marginRight = '8px';

  const redoBtn = document.createElement('button');
  redoBtn.textContent = '重做 (Ctrl+Shift+Z / Ctrl+Y)';

  undoBtn.onclick = () => {
    const table = sheet.getActiveSheet()?.tableInstance;
    const historyPlugin = table?.pluginManager?.getPluginByName('History') as any;
    historyPlugin?.undo?.();
  };

  redoBtn.onclick = () => {
    const table = sheet.getActiveSheet()?.tableInstance;
    const historyPlugin = table?.pluginManager?.getPluginByName('History') as any;
    historyPlugin?.redo?.();
  };

  wrapper.appendChild(undoBtn);
  wrapper.appendChild(redoBtn);

  document.body.appendChild(wrapper);
}
