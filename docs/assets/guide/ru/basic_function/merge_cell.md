# Cell merge

Cell merging refers к merging multiple cells into one cell, which is commonly used для functions such as merging и displaying duplicate content.

## автоmatic cell merge

в Vтаблица, Вы можете configure `mergeCell` на a column к merge adjacent cells с the same content в the same column.

### пример

```javascript liveдемонстрация template=vтаблица

let  таблицаInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные100.json')
    .then((res) => res.json())
    .then((данные) => {

const columns =[
  {
        "поле": "Категория",
        "title": "Категория",
        "ширина": "авто",
        сортировка:true,
        "mergeCell": true,
        style:{
          "textStick":true,
          textAlign:'право'
          // textBaseline:"низ"
        }
    },
    {
        "поле": "Sub-Категория",
        "title": "Sub-Категория",
        "ширина": "авто",
        сортировка:true,
        "mergeCell": true,
    },
    {
        "поле": "ID Заказа",
        "title": "ID Заказа",
        "ширина": "авто"
    },
    {
        "поле": "пользовательскийer ID",
        "title": "пользовательскийer ID",
        "ширина": "авто"
    },
    {
        "поле": "Product имя",
        "title": "Product имя",
        "ширина": "авто",
        headerStyle:{
          "textStick":true,
        }
    },
    {
        "поле": "Регион",
        "title": "Регион",
        "ширина": "авто"
    },
    {
        "поле": "Город",
        "title": "Город",
        "ширина": "авто"
    },
    {
        "поле": "Дата Заказа",
        "title": "Дата Заказа",
        "ширина": "авто"
    },
    {
        "поле": "Количество",
        "title": "Количество",
        "ширина": "авто"
    },
    {
        "поле": "Продажи",
        "title": "Продажи",
        "ширина": "авто"
    },
    {
        "поле": "Прибыль",
        "title": "Прибыль",
        "ширина": "авто"
    }
];

const option = {
  records:данные,
  columns,
  ширинаMode:'standard',
  навести:{
    highlightMode:'row'
  },
  сортировкаState:{
    поле:'Категория',
    порядок:'asc'
  }
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;
    })
```

If `mergeCell` is configured, adjacent cells с the same content в the same column will be merged и displayed.

## пользовательский cell merge

в Vтаблица, Вы можете configure `пользовательскийMergeCell` к пользовательскийize the merging method из cells. This method is often used к display некоторые label information. The `пользовательскийMergeCell` обратный вызов функция will pass в the column число и таблица instance, determine the cells that need к be merged в the функция, и возврат the corresponding merging rules:
* текст: Merge текст в cells
* range: merged range
* style: style из merged cells

`пользовательскийMergeCell` can also be configured as an массив из merge rules. каждый item в the массив is a merge rule. The configuration из the rule is the same as the возврат значение из the `пользовательскийMergeCell` обратный вызов функция.

### пример

```javascript liveдемонстрация template=vтаблица

let  таблицаInstance;

const generatePersons = count => {
  возврат массив.от(новый массив(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    имя: `имя${i + 1}`,
    date1: '2022-9-1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-конец engineer' : 'front-конец engineer',
    Город: 'beijing'
  }));
};
const records = generatePersons(10);

const columns = [
    {
      поле: 'id',
      заголовок: 'ID ff',
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
    }
  ];


const option = {
  records,
  columns,
  ширинаMode:'standard',
  пользовательскийMergeCell: (col, row, таблица) => {
    if (col > 0 && col < 8 && row > 7 && row < 11) {
      возврат {
        текст: 'long long long long long long long long long long long long long long long long long long текст!',
        range: {
          начало: {
            col: 1,
            row: 8
          },
          конец: {
            col: 7,
            row: 10
          }
        },
        style: {
          bgColor: '#ccc'
        }
      };
    }
  }
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;
```
