# 数据导入插件

## 功能介绍

ExcelImportPlugin是一个导入插件，旨在为用户提供多格式外部数据文件的高效导入解决方案。该插件支持 Excel、CSV、JSON 和 HTML 格式的数据导入

## 插件说明

该插件会向table实例添加importFile方法。

- importFile：导入文件，会弹出文件选择器，用户选择文件后，会自动导入文件数据。

如：
```ts
await tableInstance.importFile();
```

也可以直接调用import方法，传入文件路径，或者文件对象，或者文件内容。下面有介绍到：

### 支持的数据格式
- Excel 文件
- CSV 文件（支持自定义分隔符）
- JSON 数据对象
- HTML 表格数据

### 使用限制
当前版本不支持透视表（PivotTable）数据的导入功能。

## 插件配置

### ExcelImportOptions

插件构造函数接受一个配置对象，该对象需要实现 `ExcelImportOptions` 接口。以下为完整的配置参数说明：

```
interface ExcelImportOptions {
  id?: string;                        // 插件实例的唯一标识符，默认会使用excel-import-plugin-${Date.now()};
  headerRowCount?: number;             // Excel 文件表头行数，仅对 Excel 格式有效，未指定时将自动检测
  exportData?: boolean;                // 是否导出为 JavaScript 对象格式，默认为 false
  autoTable?: boolean;                 // 是否自动替换表格数据，默认为 true
  autoColumns?: boolean;               // 是否自动生成列配置，默认为 true
  delimiter?: string;                  // CSV 文件分隔符，默认为英文逗号
  batchSize?: number;                  // 批处理数据行数，默认为 1000
  enableBatchProcessing?: boolean;     // 是否启用批处理模式，默认为 true
  asyncDelay?: number;                 // 异步处理延迟时间（毫秒），默认为 5
}
```

| 参数名称 | 类型 | 默认值 | 说明 |
|---------|------|--------|------|
| `id` | string | excel-import-plugin-${Date.now()} | 插件实例标识符，用于区分多个插件实例 |
| `headerRowCount` | number | - | 指定 Excel 文件的表头行数，仅对 Excel 文件有效 |
| `exportData` | boolean | false | 控制是否将数据导出为 JavaScript 对象格式 |
| `autoTable` | boolean | true | 控制是否自动替换表格中的现有数据 |
| `autoColumns` | boolean | true | 控制是否根据导入数据自动生成列配置 |
| `delimiter` | string | ',' | CSV 文件的字段分隔符 |
| `batchSize` | number | 1000 | 批处理模式下每批处理的数据行数 |
| `enableBatchProcessing` | boolean | true | 是否启用批处理模式以优化内存使用 |
| `asyncDelay` | number | 5 | 异步处理过程中的延迟时间（毫秒） |

### import 方法

插件的核心方法，负责执行数据导入操作。

```ts
async import(
  type: 'file' | 'csv' | 'json' | 'html',
  source?: string | object,
  options?: Partial<ExcelImportOptions>
): Promise<ImportResult>
```

**type（必需）**
- 类型：`'file' | 'csv' | 'json' | 'html'`
- 说明：指定导入数据的类型
  - `'file'`：通过文件选择器导入文件
  - `'csv'`：导入 CSV 格式的字符串数据
  - `'json'`：导入 JSON 格式的数据对象
  - `'html'`：导入 HTML 表格格式的数据

**source（可选）**
- 类型：`string | object`
- 说明：数据源内容
  - 当 `type` 为 `'file'` 时，此参数无效
  - 当 `type` 为 `'csv'` 或 `'html'` 或者 `'json'`时，应传入对应格式的字符串或者对象

**options（可选）**
- 类型：`Partial<ExcelImportOptions>`
- 说明：运行时配置参数，会临时覆盖插件初始化时的配置

## 使用指南

### 插件初始化

首先需要创建插件实例并将其添加到 VTable 的插件配置中：

```ts
//初始化插件
const excelImportPlugin = new ExcelImportPlugin({
  exportData: true
});
const option: VTable.ListTableConstructorOptions = {
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
  theme: VTable.themes.DEFAULT,
  select: { disableSelect: false },
  plugins: [excelImportPlugin]
};
```

### 用法示例

#### 文件导入

通过文件选择器导入本地文件：

```ts
await excelImportPlugin.import('file');

await excelImportPlugin.import('file', undefined, {
  exportData: true,
  delimiter: ';' 
});
```

#### CSV 数据导入

导入 CSV 格式的字符串数据：

```ts
const csvData1 = `姓名,年龄,部门
张三,25,技术部
李四,30,销售部
王五,28,市场部`;

await excelImportPlugin.import('csv', csvData1);

const csvData2 = `姓名;年龄;部门
张三;25;技术部
李四;30;销售部`;

await excelImportPlugin.import('csv', csvData2, {
  delimiter: ';'
});

```

#### 禁用自动表格更新

仅获取数据而不自动更新表格：

```javascript
const result = await excelImportPlugin.import('json', jsonData, {
  autoTable: false,
});
```

## 演示代码

```javascript livedemo template=vtable
function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto'
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];
    const excelImportPlugin = new VTablePlugins.ExcelImportPlugin({
      exportData: true
    });
    const option = {
      container: document.getElementById(CONTAINER_ID),
      records:data,
      columns,
      theme: VTable.themes.DEFAULT,
      select: { disableSelect: false },
      plugins: [excelImportPlugin]
    };
    const tableInstance = new VTable.ListTable(option);
    addImportButton(excelImportPlugin, tableInstance);
    window.tableInstance = tableInstance;
  })
}

function addImportButton(importPlugin, tableInstance) {
  const panelContainer = document.createElement('div');
  const buttonContainer = document.createElement('div');
  const textareaContainer = document.createElement('div');
  textareaContainer.style.marginTop = '8px';
  const dataTextArea = document.createElement('textarea');
  dataTextArea.rows = 5;
  dataTextArea.cols = 50;
  dataTextArea.placeholder = '在此粘贴JSON或CSV数据(格式需正确)';
  dataTextArea.style.width = '100%';
  dataTextArea.style.boxSizing = 'border-box';
  dataTextArea.style.padding = '8px';

  panelContainer.style.position = 'absolute';
  panelContainer.style.top = '10px';
  panelContainer.style.opacity = '0.9';
  panelContainer.style.right = '10px';
  panelContainer.style.zIndex = '1000';
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
    let jsonData;
    if (dataTextArea.value.trim()) {
      try {
        jsonData = JSON.parse(dataTextArea.value.trim());
      } catch (error) {
        console.error('JSON格式错误');
        return;
      }
    } else {
      jsonData = [
        {
          "col0": "赵六",
          "col1": "32",
          "col2": "市场部",
          "col3": "7000"
        },
        {
          "col0": "钱七",
          "col1": "26",
          "col2": "技术部",
          "col3": "8500"
        },
        {
          "col0": "孙八",
          "col1": "29",
          "col2": "人事部",
          "col3": "6500"
        }
      ];
    }
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
    const csvData =
      dataTextArea.value.trim() ||
      `姓名;年龄;部门;工资
张三;25;技术部;8000
李四;30;销售部;6000
王五;28;技术部;9000`;
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

  panelContainer.appendChild(buttonContainer);
  buttonContainer.appendChild(importButton);
  buttonContainer.appendChild(jsonButton);
  buttonContainer.appendChild(delimiterButton);
  textareaContainer.appendChild(dataTextArea);
  panelContainer.appendChild(textareaContainer);
  
  const tableContainer = document.getElementById(CONTAINER_ID);
  if (tableContainer) {
    tableContainer.appendChild(panelContainer);
  }

}

createTable();

```

# 本文档由由以下人员贡献

[抽象薯片](https://github.com/Violet2314)