---
категория: примеры
группа: список-таблица-данные-analysis
заголовок: Set multiple aggregation и aggregation summary методы для the same column из данные
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-таблица-multiple-aggregation.png
ссылка: данные_analysis/список_таблица_данныеAnalysis
опция: списоктаблица-columns-текст#aggregation(Aggregation%20%7C%20пользовательскийAggregation%20%7C%20Array)
---

# Set multiple aggregation и aggregation summary методы для the same column из данные

базовый таблица aggregation calculation, каждый column can set the aggregation method, и supports summation, averвозраст, maximum и minimum, и пользовательский функция summary logic. The same column и multiple aggregation методы are set, и the results are displayed в multiple rows.

и this sample данные supports editing, и the values that need к be aggregated are автоmatically calculated after editing.

## Ключевые Конфигурации

- `списоктаблица`
- `columns.aggregation` Configure aggregation calculations

## код демонстрация

```javascript liveдемонстрация template=vтаблица
const input_editor = новый Vтаблица_editors.InputEditor({});
Vтаблица.регистрация.editor('ввод', input_editor);
const generatePersons = count => {
  возврат массив.от(новый массив(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    имя: `小明${i + 1}`,
    lastимя: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-конец engineer' + (i + 1) : 'front-конец engineer' + (i + 1),
    Город: 'beijing',
    salary: Math.round(Math.random() * 10000)
  }));
};
var таблицаInstance;

const records = generatePersons(300);
const columns = [
  {
    поле: '',
    заголовок: '行号',
    ширина: 80,
    полеFormat(данные, col, row, таблица) {
      возврат row - 1;
    },
    aggregation: {
      aggregationType: Vтаблица.TYPES.AggregationType.никто,
      formatFun() {
        возврат '汇总：';
      }
    }
  },
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: '1%',
    minширина: 200,
    сортировка: true
  },
  {
    поле: 'email1',
    заголовок: 'email',
    ширина: 200,
    сортировка: true
  },
  {
    заголовок: 'full имя',
    columns: [
      {
        поле: 'имя',
        заголовок: 'первый имя',
        ширина: 200
      },
      {
        поле: 'имя',
        заголовок: 'последний имя',
        ширина: 200
      }
    ]
  },
  {
    поле: 'date1',
    заголовок: 'birthday',
    ширина: 200
  },
  {
    поле: 'sex',
    заголовок: 'sex',
    ширина: 100
  },
  {
    поле: 'tel',
    заголовок: 'telephone',
    ширина: 150
  },
  {
    поле: 'work',
    заголовок: 'job',
    ширина: 200
  },
  {
    поле: 'Город',
    заголовок: 'Город',
    ширина: 150
  },
  {
    поле: 'date1',
    заголовок: 'birthday',
    ширина: 200
  },
  {
    поле: 'salary',
    заголовок: 'salary',
    ширина: 100
  },
  {
    поле: 'salary',
    заголовок: 'salary',
    ширина: 100,
    aggregation: [
      {
        aggregationType: Vтаблица.TYPES.AggregationType.MAX,
        // showOnTop: true,
        formatFun(значение) {
          возврат '最高薪资:' + Math.round(значение) + '元';
        }
      },
      {
        aggregationType: Vтаблица.TYPES.AggregationType.MIN,
        showOnTop: true,
        formatFun(значение) {
          возврат '最低薪资:' + Math.round(значение) + '元';
        }
      },
      {
        aggregationType: Vтаблица.TYPES.AggregationType.AVG,
        showOnTop: false,
        formatFun(значение, col, row, таблица) {
          возврат '平均:' + Math.round(значение) + '元 (共计' + таблица.recordsCount + '条数据)';
        }
      }
    ]
  }
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  records,
  // данныеConfig: {
  //   filterRules: [
  //     {
  //       filterFunc: (record: Record<строка, любой>) => {
  //         возврат record.id % 2 === 0;
  //       }
  //     }
  //   ]
  // },
  columns,
  Подсказка: {
    isShowOverflowTextПодсказка: true
  },
  frozenColCount: 1,
  bottomFrozenRowCount: 2,
  rightFrozenColCount: 1,
  overscrollBehavior: 'никто',
  автоWrapText: true,
  ширинаMode: 'автоширина',
  высотаMode: 'автовысота',
  dragпорядок: {
    dragHeaderMode: 'все'
  },
  keyboardOptions: {
    pasteValueToCell: true
  },
  событиеOptions: {
    prсобытиеDefaultContextменю: false
  },
  pagination: {
    perPвозрастCount: 100,
    currentPвозраст: 0
  },
  тема: Vтаблица.темаs.по умолчанию.extends({
    bottomFrozenStyle: {
      bgColor: '#ECF1F5',
      borderLineширина: [6, 0, 1, 0],
      borderColor: ['gray']
    }
  }),
  editor: 'ввод',
  headerEditor: 'ввод',
  aggregation(args) {
    if (args.col === 1) {
      возврат [
        {
          aggregationType: Vтаблица.TYPES.AggregationType.MAX,
          formatFun(значение) {
            возврат '最大ID:' + Math.round(значение) + '号';
          }
        },
        {
          aggregationType: Vтаблица.TYPES.AggregationType.MIN,
          showOnTop: false,
          formatFun(значение, col, row, таблица) {
            возврат '最小ID:' + Math.round(значение) + '号';
          }
        }
      ];
    }
    if (args.поле === 'salary') {
      возврат [
        {
          aggregationType: Vтаблица.TYPES.AggregationType.MIN,
          formatFun(значение) {
            возврат '最低低低薪资:' + Math.round(значение) + '元';
          }
        },
        {
          aggregationType: Vтаблица.TYPES.AggregationType.AVG,
          showOnTop: false,
          formatFun(значение, col, row, таблица) {
            возврат '平均平均平均:' + Math.round(значение) + '元 (共计' + таблица.recordsCount + '条数据)';
          }
        }
      ];
    }
    возврат null;
  }
  // transpose: true
  // ширинаMode: 'adaptive'
};
таблицаInstance = новый Vтаблица.списоктаблица(option);
// таблицаInstance.updateFilterRules([
//   {
//     filterKey: 'sex',
//     filteredValues: ['boy']
//   }
// ]);
window.таблицаInstance = таблицаInstance;
таблицаInstance.на('change_cell_value', arg => {
  console.log(arg);
});
```
