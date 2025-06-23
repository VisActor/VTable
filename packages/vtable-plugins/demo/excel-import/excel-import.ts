import * as VTable from '@visactor/vtable';
import { ExcelImportPlugin } from '../../src/excel-import';
const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [];
  const columns: VTable.ColumnsDefine = [
    { field: 'col0', title: '示例列1', width: 200 },
    { field: 'col1', title: '示例列2', width: 200 }
  ];  const excelImportPlugin = new ExcelImportPlugin({
    exportJson: false,
    supportedTypes: ['csv', 'json', 'xlsx', 'html'],
    autoTable: true,    // 自动更新表格
    autoColumns: true,  // 自动生成列
    delimiter: ',',     // CSV分隔符
    onImported: (columns, records) => {
      console.log('导入完成', columns, records);
    }
  });
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    theme: VTable.themes.DEFAULT,
    select: { disableSelect: false },
    plugins: [excelImportPlugin]
  };  const tableInstance = new VTable.ListTable(option);
  
  // 添加导入按钮
  addImportButton(excelImportPlugin);
  
  // 将实例保存到全局变量（用于调试）
  (window as any).tableInstance = tableInstance;
  (window as any).excelImportPlugin = excelImportPlugin;
}

// 添加导入按钮功能
function addImportButton(importPlugin: ExcelImportPlugin) {
  const buttonContainer = document.createElement('div');
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.top = '10px';
  buttonContainer.style.right = '10px';
  buttonContainer.style.zIndex = '1000';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '8px';
  buttonContainer.style.flexWrap = 'wrap';
  
  // 主导入按钮 (Tabulator风格)
  const importButton = document.createElement('button');
  importButton.textContent = '导入文件';
  importButton.style.padding = '8px 16px';
  importButton.style.backgroundColor = '#1890ff';
  importButton.style.color = 'white';
  importButton.style.border = 'none';
  importButton.style.borderRadius = '4px';
  importButton.style.cursor = 'pointer';
  importButton.style.fontSize = '14px';
  importButton.addEventListener('click', async () => {
    try {
      console.log('开始导入文件...');
      // 使用Tabulator风格API - 对于file类型，第二个参数是source（可选），第三个参数才是options
      const result = await importPlugin.import("file", undefined, {
        delimiter: ';'  // 正确传递options参数
      });
      console.log('导入成功:', result);
      alert(`导入成功！导入了 ${result.records.length} 条记录`);
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败: ' + (error as Error).message);
    }
  });

  // JSON数据导入按钮
  const jsonButton = document.createElement('button');
  jsonButton.textContent = '导入JSON';
  jsonButton.style.padding = '6px 12px';
  jsonButton.style.backgroundColor = '#722ed1';
  jsonButton.style.color = 'white';
  jsonButton.style.border = 'none';
  jsonButton.style.borderRadius = '4px';
  jsonButton.style.cursor = 'pointer';
  jsonButton.style.fontSize = '12px';

  jsonButton.addEventListener('click', async () => {
    const jsonData = [
      { name: '赵六', age: 32, department: '市场部', salary: 7000 },
      { name: '钱七', age: 26, department: '技术部', salary: 8500 },
      { name: '孙八', age: 29, department: '人事部', salary: 6500 }
    ];
    
    try {
      const result = await importPlugin.import("json", jsonData);
      console.log('JSON导入成功:', result);
      alert(`JSON导入成功！导入了 ${result.records.length} 条记录`);
    } catch (error) {
      console.error('JSON导入失败:', error);
      alert('JSON导入失败: ' + (error as Error).message);
    }
  });

  // 自定义分隔符演示按钮
  const delimiterButton = document.createElement('button');
  delimiterButton.textContent = '分号分隔CSV';
  delimiterButton.style.padding = '6px 12px';
  delimiterButton.style.backgroundColor = '#fa8c16';
  delimiterButton.style.color = 'white';
  delimiterButton.style.border = 'none';
  delimiterButton.style.borderRadius = '4px';
  delimiterButton.style.cursor = 'pointer';
  delimiterButton.style.fontSize = '12px';

  delimiterButton.addEventListener('click', async () => {
    const csvData = `姓名;年龄;部门;工资
张三;25;技术部;8000
李四;30;销售部;6000
王五;28;技术部;9000`;
    
    try {
      // 演示自定义分隔符功能
      const result = await importPlugin.import("csv", csvData, {
        delimiter: ';'  // 使用分号作为分隔符
      });
      console.log('自定义分隔符导入成功:', result);
      alert(`自定义分隔符(;)导入成功！导入了 ${result.records.length} 条记录`);
    } catch (error) {
      console.error('自定义分隔符导入失败:', error);
      alert('自定义分隔符导入失败: ' + (error as Error).message);
    }
  });
  
  buttonContainer.appendChild(importButton);
  buttonContainer.appendChild(jsonButton);
  buttonContainer.appendChild(delimiterButton);
  
  // 将按钮添加到表格容器的父元素
  const tableContainer = document.getElementById(CONTAINER_ID);
  if (tableContainer && tableContainer.parentElement) {
    tableContainer.appendChild(buttonContainer);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 创建主容器
  const mainContainer = document.createElement('div');
  mainContainer.style.position = 'relative';
  mainContainer.style.width = '1000px';
  mainContainer.style.height = '600px';
  mainContainer.style.margin = '24px auto';
  mainContainer.style.border = '1px solid #e8e8e8';
  mainContainer.style.borderRadius = '4px';
  
  // 创建标题
  const title = document.createElement('h2');
  title.textContent = 'Excel导入插件演示';
  title.style.margin = '0 0 20px 0';
  title.style.padding = '20px 20px 0 20px';
  title.style.fontSize = '18px';
  title.style.color = '#333';  // 创建说明文字
  const description = document.createElement('p');
  description.innerHTML = `
    <strong>Tabulator风格导入插件演示：</strong><br>
    • <span style="color: #1890ff;">导入文件</span> - 文件选择器导入 (支持 Excel/CSV/JSON/HTML)<br>
    • <span style="color: #52c41a;">导入CSV</span> - 从CSV字符串导入<br>
    • <span style="color: #722ed1;">导入JSON</span> - 从JSON对象导入<br>
    • <span style="color: #fa8c16;">分号分隔CSV</span> - 演示自定义分隔符功能<br>
    • <span style="color: #13c2c2;">仅数据导入</span> - 演示不自动生成列功能<br><br>
    <strong>核心特性：</strong> 多种数据源、自定义分隔符、灵活的列生成控制
  `;
  description.style.margin = '0 0 20px 0';
  description.style.padding = '0 20px';
  description.style.fontSize = '14px';
  description.style.color = '#666';
  description.style.lineHeight = '1.6';
  
  // 创建表格容器
  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  container.style.position = 'relative';
  container.style.width = 'calc(100% - 40px)';
  container.style.height = 'calc(100% - 120px)';
  container.style.margin = '0 20px 20px 20px';
  
  // 组装页面
  mainContainer.appendChild(title);
  mainContainer.appendChild(description);
  mainContainer.appendChild(container);
  document.body.appendChild(mainContainer);
  
  // 初始化表格
  createTable();
});