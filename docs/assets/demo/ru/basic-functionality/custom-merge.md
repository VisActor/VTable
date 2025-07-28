---
категория: примеры
группа: базовый возможности
заголовок: пользовательский Merge Cells
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский-merge.png
опция: списоктаблица-columns-текст#mergeCell
---

# пользовательский Merge cells

пользовательскийize the range, content, и style из merged cells through configuration

## Ключевые Конфигурации

 - `пользовательскийMergeCell`  Define rules для cell merging

## код демонстрация

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
    if (col >=0 && col < таблица.colCount && row === таблица.rowCount-1) {
      возврат {
        текст: 'Summary column: This данные is a базовый information из personnel',
        range: {
          начало: {
            col: 0,
            row: таблица.rowCount-1
          },
          конец: {
            col: таблица.colCount-1,
            row: таблица.rowCount-1
          }
        },
        style:{
          borderLineширина:[6,1,1,1],
          borderColor:['gray']
        }
      };
    }
  }
};
таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;
```
