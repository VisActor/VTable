# данные Import Plugin

## функция Introduction

ExcelImportPlugin is an import plugin designed к provide users с an efficient solution для importing multiple formats из external данные files. This plugin supports данные import в Excel, CSV, JSON и HTML formats.

### Supported данные formats
- Excel File
- CSV File (Supporting пользовательский Delimiters)
- JSON объект
- HTML данные

### Service restrictions
The текущий version does не support the import функция из сводныйтаблица данные.

## Plugin configuration

### ExcelImportOptions
The plugin constructor accepts a configuration объект, which must implement the `ExcelImportOptions` интерфейс. Следующий is a complete description из the configuration parameters:

```
интерфейс ExcelImportOptions {
  id?: строка;                        // The unique identifier из the plugin instance, which по по умолчанию will use excel-import-plugin-${Date.now()};
  headerRowCount?: число;             // The число из header rows в an Excel file is only valid для Excel format. If не specified, it will be автоmatically detected.
  exportданные?: логический;                // Whether к export as JavaScript объект format. The по умолчанию is false.
  автотаблица?: логический;                 // Whether к автоmatically replace the таблица данные. The по умолчанию setting is true.
  автоColumns?: логический;               // Whether к автоmatically generate column configuration, по умолчанию is true
  delimiter?: строка;                  // CSV file delimiter, по умолчанию is the English comma
  batchSize?: число;                  // Batch processing данные row count, по умолчанию значение is 1000
  enableBatchProcessing?: логический;     // Whether к включить batch processing mode. The по умолчанию is true.
  asyncDelay?: число;                 // Asynchronous processing delay time (в milliseconds), по умолчанию значение is 5
}
```

| имя из параметр | тип | по умолчанию | explain |
|---------|------|--------|------|
| `id` | строка | excel-import-plugin-${Date.now()} | Plugin instance identifier, used к distinguish multiple plugin instances|
| `headerRowCount` | число | - | Specify the число из header rows в the Excel file. This setting is only applicable к Excel files. |
| `exportданные` | логический | false | Control whether к export the данные в JavaScript объект format |
| `автотаблица` | логический | true | Control whether к автоmatically replace the existing данные в the таблица |
| `автоColumns` | логический | true | Control whether columns are автоmatically configured based на the imported данные |
| `delimiter` | строка | ',' | The поле delimiter из a CSV file|
| `batchSize` | число | 1000 | The число из данные rows processed в каждый batch under batch processing mode |
| `enableBatchProcessing` | логический | true | Should the batch processing mode be включен к optimize memory usвозраст? |
| `asyncDelay` | число | 5 | Delay time (в milliseconds) during the asynchronous processing process |

### import функция

The core method из the plugin is responsible для performing the данные import operation.

```ts
async import(
  тип: 'file' | 'csv' | 'json' | 'html',
  source?: строка | объект,
  options?: Partial<ExcelImportOptions>
): Promise<ImportResult>
```

**тип（necessary）**
- тип：`'file' | 'csv' | 'json' | 'html'`
- explain：Specify the тип из imported данные
  - `'file'`：Import files through the file selector
  - `'csv'`：Import строка данные в CSV format
  - `'json'`：Import данные objects в JSON format
  - `'html'`：Import данные в HTML таблица format

**source（необязательный）**
- тип：`строка | объект`
- explain：данные source content
  - When `тип` is set к `'file'`, this параметр is invalid.
  - When `тип` is either `'csv'`, `'html'`, или `'json'`, a строка или объект в the corresponding format should be passed в.

**options（необязательный）**
- тип：`Partial<ExcelImportOptions>`
- explain：The runtime configuration parameters will temporarily override the configuration set during the plugin initialization.

## operating guide

### Plugin initialization

первый, a plugin instance needs к be created и added к the plugin configuration из the Vтаблица:

```ts
//初始化插件
const excelImportPlugin = новый ExcelImportPlugin({
  exportданные: true
});
const опция: Vтаблица.списоктаблицаConstructorOptions = {
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
  тема: Vтаблица.темаs.по умолчанию,
  выбрать: { disableSelect: false },
  plugins: [excelImportPlugin]
};
```

### Usвозраст пример

#### File import

Import local files through the file selector:

```ts
await excelImportPlugin.import('file');

await excelImportPlugin.import('file', undefined, {
  exportданные: true,
  delimiter: ';' 
});
```

#### CSV данные import

Import строка данные в CSV format:

```ts
const csvданные1 = `姓名,年龄,部门
张三,25,技术部
李四,30,销售部
王五,28,市场部`;

await excelImportPlugin.import('csv', csvданные1);

const csvданные2 = `姓名;年龄;部门
张三;25;技术部
李四;30;销售部`;

await excelImportPlugin.import('csv', csvданные2, {
  delimiter: ';'
});

```

#### отключить автоmatic таблица updates

Only obtain данные без автоmatically updating the таблица:

```javascript
const result = await excelImportPlugin.import('json', jsonданные, {
  автотаблица: false,
});
```

## 演示代码

```javascript liveдемонстрация template=vтаблица
функция createтаблица() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа',
        ширина: 'авто'
      },
      {
        поле: 'пользовательскийer ID',
        заголовок: 'пользовательскийer ID',
        ширина: 'авто'
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: 'авто'
      },
      {
        поле: 'Категория',
        заголовок: 'Категория',
        ширина: 'авто'
      },
      {
        поле: 'Sub-Категория',
        заголовок: 'Sub-Категория',
        ширина: 'авто'
      },
      {
        поле: 'Регион',
        заголовок: 'Регион',
        ширина: 'авто'
      },
      {
        поле: 'Город',
        заголовок: 'Город',
        ширина: 'авто'
      },
      {
        поле: 'Дата Заказа',
        заголовок: 'Дата Заказа',
        ширина: 'авто'
      },
      {
        поле: 'Количество',
        заголовок: 'Количество',
        ширина: 'авто'
      },
      {
        поле: 'Продажи',
        заголовок: 'Продажи',
        ширина: 'авто'
      },
      {
        поле: 'Прибыль',
        заголовок: 'Прибыль',
        ширина: 'авто'
      }
    ];
    const excelImportPlugin = новый VтаблицаPlugins.ExcelImportPlugin({
      exportданные: true
    });
    const option = {
      container: document.getElementById(CONTAINER_ID),
      records:данные,
      columns,
      тема: Vтаблица.темаs.по умолчанию,
      выбрать: { disableSelect: false },
      plugins: [excelImportPlugin]
    };
    const таблицаInstance = новый Vтаблица.списоктаблица(option);
    addImportКнопка(excelImportPlugin, таблицаInstance);
    window.таблицаInstance = таблицаInstance;
  })
}

функция addImportКнопка(importPlugin, таблицаInstance) {
  const panelContainer = document.createElement('div');
  const КнопкаContainer = document.createElement('div');
  const textareaContainer = document.createElement('div');
  textareaContainer.style.marginTop = '8px';
  const данныеTextArea = document.createElement('textarea');
  данныеTextArea.rows = 5;
  данныеTextArea.cols = 50;
  данныеTextArea.placeholder = '在此粘贴JSON或CSV数据(格式需正确)';
  данныеTextArea.style.ширина = '100%';
  данныеTextArea.style.boxSizing = 'граница-box';
  данныеTextArea.style.заполнение = '8px';

  panelContainer.style.позиция = 'absolute';
  panelContainer.style.верх = '10px';
  panelContainer.style.opaГород = '0.9';
  panelContainer.style.право = '10px';
  panelContainer.style.zIndex = '1000';
  КнопкаContainer.style.display = 'flex';
  КнопкаContainer.style.gap = '8px';
  КнопкаContainer.style.flexWrap = 'wrap';

  const importКнопка = document.createElement('Кнопка');
  importКнопка.textContent = '导入文件';
  importКнопка.addсобытиесписокener('Нажать', async () => {
    try {
      //注意，如果用户需要使用文件传入csv并且文件中的分隔符需要自定义的话，我需要传入第二个参数为undefined
      const result = await importPlugin.import('file');
      console.log('导入成功:', result);
    } catch (ошибка) {
      console.ошибка('导入失败:', ошибка);
      предупреждение('导入失败: ' + (ошибка.messвозраст || ошибка));
    }
  });

  const jsonКнопка = document.createElement('Кнопка');
  jsonКнопка.textContent = '导入JSON数据';
  jsonКнопка.addсобытиесписокener('Нажать', async () => {
    let jsonданные;
    if (данныеTextArea.значение.trim()) {
      try {
        jsonданные = JSON.parse(данныеTextArea.значение.trim());
      } catch (ошибка) {
        console.ошибка('JSON格式错误');
        возврат;
      }
    } else {
      jsonданные = [
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
      const result = await importPlugin.import('json', jsonданные);
      console.log('JSON导入成功:', result);
    } catch (ошибка) {
      console.ошибка('JSON导入失败:', ошибка);
      предупреждение('JSON导入失败: ' + (ошибка.messвозраст || ошибка));
    }
  });

  const delimiterКнопка = document.createElement('Кнопка');
  delimiterКнопка.textContent = '分号分隔CSV';
  delimiterКнопка.addсобытиесписокener('Нажать', async () => {
    const csvданные =
      данныеTextArea.значение.trim() ||
      `姓名;年龄;部门;工资
张三;25;技术部;8000
李四;30;销售部;6000
王五;28;技术部;9000`;
    try {
      const result = await importPlugin.import('csv', csvданные, {
        delimiter: ';'
      });
      console.log('分号分隔CSV导入成功:', result);
    } catch (ошибка) {
      console.ошибка('分号分隔CSV导入失败:', ошибка);
      предупреждение('分号分隔CSV导入失败: ' + (ошибка.messвозраст || ошибка));
    }
  });

  panelContainer.appendChild(КнопкаContainer);
  КнопкаContainer.appendChild(importКнопка);
  КнопкаContainer.appendChild(jsonКнопка);
  КнопкаContainer.appendChild(delimiterКнопка);
  textareaContainer.appendChild(данныеTextArea);
  panelContainer.appendChild(textareaContainer);
  
  const таблицаContainer = document.getElementById(CONTAINER_ID);
  if (таблицаContainer) {
    таблицаContainer.appendChild(panelContainer);
  }

}

createтаблица();

```

# This document was contributed по:

[Abstract chips](https://github.com/Violet2314)