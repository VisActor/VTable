# excel导入插件

## 功能介绍

`ExcelImportPlugin`是为了让VTable支持导入excel文件而开发的插件，并且同时还支持csv、json、 xlsx、 html的导入

该插件会在`VTable.TABLE_EVENT_TYPE.INITIALIZED`的开始生效

当需要使用这个插件的时候，请调用`ExcelImportPlugin`中的`import`接口来实现文件导入

目前这个插件不支持透视表的导入

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

这是我们这个插件调用的导入方法

```
  async import(
    type: 'file' | 'csv' | 'json' | 'xlsx' | 'html',
    source?: string | object | HTMLInputElement,
    options?: Partial<ExcelImportOptions>
  ): Promise<ImportResult>
```

因为我们调用的`import`方法最多接受三个参数，也就是说当我们`import`导入文件的时候，需要定义`delimiter`的时候，我们就需要传入第二个参数来当`source`，然后再传入我们的`option`，在这个`option`去定义我们的`delimiter`，当然我们也可以在一开始`ExcelImportPlugin`初始化的时候传入我们需要的`delimiter`

```
      await importPlugin.import('file', undefined, {
        delimiter: ','
      });
```

## 插件示例

初始化插件对象并且添加到配置中plugins中
```
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