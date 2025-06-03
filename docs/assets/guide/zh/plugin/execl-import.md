# execl导入插件

## 功能介绍
`ExcelImportPlugin`可以把execl导入到vtable中，并且可以导出json格式的解析文件方便用户调试。

由于是通过直接解析execl行中的内容来实现的导入，所以无法支持较为特殊或复杂的表格结构，仅适用于常规表格的导入。

## 插件配置
```
export interface ExcelImportOptions {
  id?: string;
  headerRowCount?: number;
  exportJson?: boolean;
  buttonText?: string;
  onImported?: (columns: any[], records: any[]) => void;
}
```

## 插件示例

你可以通过下方交互面板选择 Excel 文件并导入，表格会自动刷新为新数据。

```javascript livedemo template=vtable
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';

const IMPORT_PANEL_ID = 'excel-import-panel';
const excelImportPlugin = new VTablePlugins.ExcelImportPlugin({
  id: 'my-import-plugin',
  exportJson: true,
  buttonText: '自定义导入按钮',
  onImported: (columns, records) => {
    console.log('导入完成', columns, records);
  }
});

const columns = [
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 80 },
  { field: 'city', title: '城市', width: 120 }
];

let records = [
  { name: '张三', age: 18, city: '北京' },
  { name: '李四', age: 22, city: '上海' }
];

const option = {
  columns,
  records,
  plugins: [excelImportPlugin]
};

const container = document.getElementById(CONTAINER_ID);

// 创建一个包装容器
const wrapper = document.createElement('div');
wrapper.style.height = '100%';
wrapper.style.width = '100%';
wrapper.style.position = 'relative';
container.appendChild(wrapper);


// 创建表格容器
const tableContainer = document.createElement('div');
tableContainer.style.height = '100%';
tableContainer.style.width = '100%';
tableContainer.style.position = 'relative';
wrapper.appendChild(tableContainer);


// 创建 VTable 实例
const table = new VTable.ListTable(tableContainer, option);
```
---

你也可以根据实际需求调整 `options` 参数，例如：
- `headerRowCount`：指定表头层数，默认为自动检测
- `exportJson`：是否导出json文件，默认为false
- `buttonText`：自定义按钮文本
- `onImported`：自定义导入完成回调

# 本文档由以下人员贡献

[抽象薯片](https://github.com/Violet2314)