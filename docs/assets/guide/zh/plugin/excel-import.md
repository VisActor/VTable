# 数据导入插件

## 功能介绍

ExcelImportPlugin是一个导入插件，旨在为用户提供多格式外部数据文件的高效导入解决方案。该插件支持 Excel、CSV、JSON 和 HTML 格式的数据导入

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
  const records = [
        {
      col0: 1,
      col1: '《后端架构与开发》-Springboot和Springcloud框架的演进介绍',
      col2: '上海班（大三、大二选听）',
      col3: 45716,
      col4: '晚上19:30-21:00',
      col5: '荟庐W101',
      col6: '已完成',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 15618551318,
      col11: '仅大三在教室'
    },
    {
      col0: 2,
      col1: '《前端开发》-前后端分离模式和VUE（2.0与3.0）框架的介绍',
      col2: '上海班（大三、大二选听）',
      col3: 45728,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '已完成',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 18855588308,
      col11: '仅大三在教室'
    },
    {
      col0: 3,
      col1: '《后端架构与开发》-基于微服务架构的常用分布式组件与中间件的介绍与应用',
      col2: '上海班（大三、大二选听）',
      col3: 45731,
      col4: '上午9:30-11:00',
      col5: '荟庐W101',
      col6: '已完成',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 15618551318,
      col11: '仅大三在教室'
    },
    {
      col0: 4,
      col1: '《数据可视化理论与实践》-可视化概念与历史',
      col2: '上海班(大一、二、三)',
      col3: 45735,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 13681476041,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 5,
      col1: '《后端架构与开发》-微服务开发环境的搭建',
      col2: '上海班（大三、大二选听）',
      col3: 45738,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 18701995854,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 6,
      col1: '《数据库应用》-主流数据库简介以及数据库在软件系统的作用',
      col2: '上海班（大三、大二选听）',
      col3: 45738,
      col4: '上午9:30-11:00',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 17621148880,
      col11: '仅大三在教室'
    },
    {
      col0: 7,
      col1: '《前端开发》-HTML5与CSS3技术基础介绍',
      col2: '上海班（大三、大二选听）',
      col3: 45742,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 18855588308,
      col11: '仅大三在教室'
    },
    {
      col0: 8,
      col1: '《数据库应用》-mysql数据库介绍和微服务中mysql应用以及常用命令介绍',
      col2: '上海班（大三、大二选听）',
      col3: 45745,
      col4: '上午9:30-11:00',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 17621148880,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 9,
      col1: '《数据可视化理论与实践》-数据与视觉呈现',
      col2: '上海班(大一、二、三)',
      col3: 45749,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 13681476041,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 10,
      col1: '《后端架构与开发》-微服务环境下功能开发流程和发布流程',
      col2: '上海班（大三、大二选听）',
      col3: 45756,
      col4: '下午14:00-16:00',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '2小时',
      col8: '李婉静',
      col9: 18701995854,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 11,
      col1: '《前端开发》-VUE开发环境的搭建与核心组件的介绍',
      col2: '上海班（大三、大二选听）',
      col3: 45759,
      col4: '上午9:30-11:00',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 18855588308,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 12,
      col1: '《数据库应用》-基于mysql数据库的数据操作',
      col2: '上海班（大三、大二选听）',
      col3: 45759,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 17621148880,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 13,
      col1: '《数据可视化理论与实践》-表格可视化',
      col2: '上海班(大一、二、三)',
      col3: 45763,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 13681476041,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 14,
      col1: '《后端架构与开发》-简单业务场景的开发演示与代码解析一',
      col2: '上海班（大三、大二选听）',
      col3: 45766,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 18701995854,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 15,
      col1: '《数据库应用》-基于业务场景下sql语句的制作',
      col2: '上海班（大三、大二选听）',
      col3: 45766,
      col4: '上午9:30-11:00',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 17621148880,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 16,
      col1: '《前端开发》-VUE功能开发流程和发布流程、基于VUE的前端开发演示',
      col2: '上海班（大三、大二选听）',
      col3: 45770,
      col4: '下午14:00-16:00',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '2小时',
      col8: '李婉静',
      col9: 18855588308,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 17,
      col1: '《后端架构与开发》-简单业务场景的开发演示与代码解析二',
      col2: '上海班（大三、大二选听）',
      col3: 45773,
      col4: '上午9:30-11:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '2小时',
      col8: '李婉静',
      col9: 18701995854,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 18,
      col1: '《数据可视化理论与实践》-图表可视化',
      col2: '上海班(大一、二、三)',
      col3: 45777,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 13681476041,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 19,
      col1: '《前端开发》-基于业务场景的编码与解析',
      col2: '上海班（大三、大二选听）',
      col3: 45784,
      col4: '下午14:00-16:00',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '2小时',
      col8: '李婉静',
      col9: 18855588308,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 20,
      col1: '《数据库应用》-复杂场景的sql解析',
      col2: '上海班（大三、大二选听）',
      col3: 45787,
      col4: '上午9:30-11:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '2小时',
      col8: '李婉静',
      col9: 17621148880,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 21,
      col1: '《数据可视化理论与实践》-可视化叙事',
      col2: '上海班(大一、二、三)',
      col3: 45791,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 13681476041,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 22,
      col1: '《后端架构与开发》-复杂业务场景的开发演示与代码解析三',
      col2: '上海班（大三、大二选听）',
      col3: 45794,
      col4: '上午9:30-11:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '2小时',
      col8: '李婉静',
      col9: 18701995854,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 23,
      col1: '《前端开发》-编码规范、项目案例分析',
      col2: '上海班（大三、大二选听）',
      col3: 45794,
      col4: '下午14:00-16:00',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '2小时',
      col8: '李婉静',
      col9: 18855588308,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 24,
      col1: '《数据库应用》-基于mysql的数据表设计',
      col2: '上海班（大三、大二选听）',
      col3: 45798,
      col4: '下午14:00-16:00',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '2小时',
      col8: '李婉静',
      col9: 17621148880,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 25,
      col1: '《后端架构与开发》-编码规范、项目案例分析 ',
      col2: '上海班（大三、大二选听）',
      col3: 45801,
      col4: '上午9:30-11:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '2小时',
      col8: '李婉静',
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 26,
      col1: '《数据可视化理论与实践》-可视化场景与实践：数据大屏',
      col2: '上海班(大一、二、三)',
      col3: 45805,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 13681476041,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 27,
      col1: '《数据库应用》-基于mysql的sql规范和设计规范和项目案例分析',
      col2: '上海班（大三、大二选听）',
      col3: 45812,
      col4: '下午14:00-16:00',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '2小时',
      col8: '李婉静',
      col9: 17621148880,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 28,
      col1: '《数据可视化理论与实践》-可视化场景与实践：数据视频',
      col2: '上海班(大一、二、三)',
      col3: 45819,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 13681476041,
      col10: '带电脑',
      col11: '仅大三在教室'
    },
    {
      col0: 29,
      col1: '《数据可视化理论与实践》-智能可视化',
      col2: '上海班(大一、二、三)',
      col3: 45833,
      col4: '下午14:00-15:30',
      col5: '荟庐W101',
      col6: '待执行',
      col7: '1.5小时',
      col8: '李婉静',
      col9: 13681476041,
      col10: '带电脑',
      col11: '仅大三在教室'
    }
  ];
  const columns = [
    {
      field: 'col0',
      title: '序号',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col1',
      title: '课程名称',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col2',
      title: '上课对象',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col3',
      title: '授课日期',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col4',
      title: '具体上课时间段',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col5',
      title: '教室',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col6',
      title: '状态',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col7',
      title: '课时',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col8',
      title: '校内联系人',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col9',
      title: '授课导师联系电话',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col10',
      title: '备注1',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col11',
      title: '备注2',
      cellType: 'text',
      headerType: 'text'
    }
  ];
  const excelImportPlugin = new VTablePlugins.ExcelImportPlugin({
    exportData: true
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