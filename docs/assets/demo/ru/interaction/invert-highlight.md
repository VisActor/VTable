---
категория: примеры
группа: Interaction
заголовок: invert highlight
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/invert-highlight.png
ссылка: plugin/invert-highlight
---

# Invert highlight

показать the highlight effect when set highlight range.

## Ключевые Конфигурации

- `FocusHighlightPlugin` invert highlight plugin
  - `fill` invert highlight фон цвет
  - `opaГород` invert highlight opaГород
- `setInvertHighlightRange` set highlight range

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// use this для project
// import * as Vтаблица от '@visactor/vтаблица';
// import * as VтаблицаPlugins от '@visactor/vтаблица-plugins';

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
    imвозраст:
      '<svg ширина="16" высота="16" viewBox="0 0 48 48" fill="никто" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" strхорошоe="#f5a623" strхорошоe-ширина="1" strхорошоe-linecap="round" strхорошоe-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" strхорошоe="#f5a623" strхорошоe-ширина="1" strхорошоe-linejoin="round"/></svg>'
  }));
};

const records = generatePersons(20);

const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 'авто',
    minширина: 50,
    сортировка: true
  },
  {
    поле: 'email1',
    заголовок: 'email',
    ширина: 200,
    сортировка: true,
    style: {
      underline: true,
      underlineDash: [2, 0],
      underlineOffset: 3
    }
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
  }
];
const highlightPlugin = новый VтаблицаPlugins.FocusHighlightPlugin();
const option = {
  records,
  columns,
  тема: Vтаблица.темаs.DARK,
  plugins: [highlightPlugin]
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;



```
