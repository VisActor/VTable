# excel导入插件

## 功能介绍

`ExcelImportPlugin`是为了让VTable支持导入excel文件而开发的插件，并且同时还支持csv、json、 xlsx、 html的导入

该插件会在`VTable.TABLE_EVENT_TYPE.INITIALIZED`的开始生效

当需要使用这个插件的时候，请调用`ExcelImportPlugin`中的`import`接口来实现文件导入

但是由于目前实现无法处理csv、json、html多层表头的导入，只有excel才支持多层表头的导入

## 插件配置

当调用构造`ExcelImportPlugin`时，需要传入配置的`ExcelImportOptions`

```
ExcelImportOptions {
  id?: string;
  headerRowCount?: number; // 指定头的层数，不指定会使用detectHeaderRowCount来自动判断，但是只有excel才有
  exportData?: boolean; // 是否导出JavaScript对象字面量格式文件，默认是false
  supportedTypes?: string[]; // 支持的文件类型，默认是['csv', 'json', 'xlsx', 'xls', 'html']
  autoTable?: boolean; // 是否自动替换表格数据 默认是true
  autoColumns?: boolean; // 是否自动生成列配置 默认是true
  delimiter?: string; // CSV分隔符，默认逗号 
  encoding?: string; // 文件编码，默认UTF-8
  batchSize?: number; // 批处理大小，默认1000行
  enableBatchProcessing?: boolean; // 是否启用分批处理，默认true
  asyncDelay?: number; // 异步处理延迟时间(ms)，默认5ms
}
```

## 插件示例

初始化插件对象并且添加到配置中plugins中
```
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    theme: VTable.themes.DEFAULT,
    select: { disableSelect: false },
    plugins: [excelImportPlugin]
  };
```

```javascript livedemo template=vtable
function createTable() {
  const records = [];
  const columns = [
    { field: 'col0', title: '示例列1', width: 200 },
    { field: 'col1', title: '示例列2', width: 200 }
  ];
  const excelImportPlugin = new VTablePlugins.ExcelImportPlugin({
    exportData: true,
    supportedTypes: ['csv', 'json', 'xlsx', 'html'],
    autoTable: true,
    autoColumns: true
  });
  const option = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    theme: VTable.themes.DEFAULT,
    select: { disableSelect: false },
    plugins: [excelImportPlugin]
  };
  const tableInstance = new VTable.ListTable(option);
  addImportButton(excelImportPlugin, tableInstance);
  window.tableInstance = tableInstance;
}

function addImportButton(importPlugin, tableInstance) {
  const buttonContainer = document.createElement('div');
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.top = '10px';
  buttonContainer.style.right = '10px';
  buttonContainer.style.zIndex = '1000';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '8px';
  buttonContainer.style.flexWrap = 'wrap';

  const importButton = document.createElement('button');
  importButton.textContent = '导入文件';
  importButton.addEventListener('click', async () => {
    try {
      //注意，如果用户需要使用文件传入csv并且文件中的分隔符需要自定义的话，我需要传入第二个参数为undefined
      const result = await importPlugin.import('file');
      console.log('导入成功:', result);
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败: ' + (error.message || error));
    }
  });

  const jsonButton = document.createElement('button');
  jsonButton.textContent = '导入JSON数据';
  jsonButton.addEventListener('click', async () => {
    const jsonData = [
      { name: '张三', age: 25, department: '技术部', salary: 8000 },
      { name: '李四', age: 30, department: '销售部', salary: 6000 },
      { name: '王五', age: 28, department: '市场部', salary: 7000 },
      { name: '赵六', age: 32, department: '人事部', salary: 6500 }
    ];
    try {
      const result = await importPlugin.import('json', jsonData);
      console.log('JSON导入成功:', result);
    } catch (error) {
      console.error('JSON导入失败:', error);
      alert('JSON导入失败: ' + (error.message || error));
    }
  });

  const delimiterButton = document.createElement('button');
  delimiterButton.textContent = '分号分隔CSV';
  delimiterButton.addEventListener('click', async () => {
    const csvData = `姓名;年龄;部门;工资
张三;25;技术部;8000
李四;30;销售部;6000
王五;28;市场部;7000`;
    try {
      const result = await importPlugin.import('csv', csvData, {
        delimiter: ';'
      });
      console.log('分号分隔CSV导入成功:', result);
    } catch (error) {
      console.error('分号分隔CSV导入失败:', error);
      alert('分号分隔CSV导入失败: ' + (error.message || error));
    }
  });

  buttonContainer.appendChild(importButton);
  buttonContainer.appendChild(jsonButton);
  buttonContainer.appendChild(delimiterButton);
  
  const tableContainer = document.getElementById(CONTAINER_ID);
  if (tableContainer) {
    tableContainer.appendChild(buttonContainer);
  }
}

createTable();
```

# 本文档由由以下人员贡献

[抽象薯片](https://github.com/Violet2314)