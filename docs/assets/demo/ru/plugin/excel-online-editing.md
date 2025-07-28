---
категория: примеры
группа: plugin
заголовок: Excel-like Online Editing
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/excel-online-editing.gif
ссылка: plugin/usвозраст
опция: plugins
---

# Excel-like Online Editing

Based на Vтаблица's plugin mechanism, this пример implements Excel-like online editing функциональность.

в this пример, we use Следующий plugins в combination:
- `AddRowColumnPlugin`: Add rows и columns
- `PastedAddRowColumnPlugin`: Add новый rows или columns when there are не enough rows или columns when pasting
- `ColumnSeriesPlugin`: Column series plugin
- `RowSeriesPlugin`: Row series plugin
- `HighlightHeaderWhenSelectCellPlugin`: Highlight selected cells
- `ExcelEditCellKeyboardPlugin`: Excel-style cell editing keyboard plugin

It's important к note that there are dependencies between plugins. для пример, в the `AddRowColumnPlugin`, we call the `columnSeries.resetColumnCount` method к reset the column count, ensuring that after adding columns, the count remains consistent с the column count в the `ColumnSeriesPlugin`.

## Key Configuration

- `editCellTrigger`: Cell editing trigger method
- `editor`: Editor тип
- `plugins`: Plugin список


## код демонстрация

```javascript liveдемонстрация template=vтаблица
//  import * as Vтаблица от '@visactor/vтаблица';
// 使用时需要引入插件包@visactor/vтаблица-plugins
// import * as VтаблицаPlugins от '@visactor/vтаблица-plugins';
// 正常使用方式 const columnSeries = новый Vтаблица.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 Vтаблица.plugins重命名成了VтаблицаPlugins

// 注册编辑器
const input_editor = новый Vтаблица_editors.InputEditor();
Vтаблица.регистрация.editor('ввод', input_editor);

// 注册插件
  const addRowColumn = новый VтаблицаPlugins.AddRowColumnPlugin({
    addColumnCallback: col => {
      // 新增列时，重置列数
      columnSeries.resetColumnCount(columnSeries.pluginOptions.columnCount + 1);
      // 将таблица实例中的数据源records每一个数组中新增一个空字符串，对应新增的列
      const newRecords = таблицаInstance.records.map(record => {
        if (массив.isArray(record)) {
          record.splice(col - 1, 0, '');
        }
        возврат record;
      });
      таблицаInstance.setRecords(newRecords);
    },
    addRowCallback: row => {
      // 新增行时，填充空行数据
      таблицаInstance.addRecord([], row - таблицаInstance.columnHeaderLevelCount);
    }
  });

  const columnSeries = новый VтаблицаPlugins.ColumnSeriesPlugin({
    columnCount: 26
  });
  const rowSeries = новый VтаблицаPlugins.RowSeriesPlugin({
    rowCount: 100,
    //records数据以外 填充空行数据
    fillRowRecord: (index) => {
      возврат [];
    },
    rowSeriesNumber: {
      ширина: 'авто'
    }
  });
  const highlightPlugin = новый VтаблицаPlugins.HighlightHeaderWhenSelectCellPlugin({
    colHighlight: true,
    rowHighlight: true
  });
  const excelEditCellKeyboardPlugin = новый VтаблицаPlugins.ExcelEditCellKeyboardPlugin();
  const option = {
    // 二维数组的数据 和excel的行列一致
    records: [
      ['姓名', '年龄', '地址'],
      ['张三', 18, '北京'],
      ['李四', 20, '上海'],
      ['王五', 22, '广州'],
      ['赵六', 24, '深圳'],
      ['孙七', 26, '成都']
    ],

    заполнение: 30,
    editor: 'ввод',
    editCellTrigger: ['апи', 'keydown', 'doubleНажать'],// 编辑单元格触发方式
    выбрать: {
      cornerHeaderSelectMode: 'body',
      headerSelectMode: 'body'
    },
    тема: Vтаблица.темаs.по умолчанию.extends({
      defaultStyle: {
        textAlign: 'лево',
        заполнение: [2, 6, 2, 6]
      },
      headerStyle: {
        textAlign: 'центр'
      }
    }),
    defaultRowвысота: 30,
    plugins: [addRowColumn, columnSeries, rowSeries, highlightPlugin, excelEditCellKeyboardPlugin]
  };
  const таблицаInstance = новый Vтаблица.списоктаблица( document.getElementById(CONTAINER_ID),option);
  window.таблицаInstance = таблицаInstance;
  
```