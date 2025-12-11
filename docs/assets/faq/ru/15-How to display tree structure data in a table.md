# How к display tree structure данные в a таблица?

## Question Description

How can we implement the display из hierarchical данные в a таблица компонент на a frontend web pвозраст, as shown в the diagram?
![imвозраст](/vтаблица/Часто Задаваемые Вопросы/15-0.png)

## Solution

Vтаблица's two таблица forms, the базовый таблица списоктаблица и the сводный таблица сводныйтаблица, can achieve this kind из tree display, и the usвозраст is quite simple.
Let me give you an пример из a базовый таблица displayed as a tree structure. There are two main configurations:
(1) You need к configure the tree bit true на the column.
(2) It needs к be данные с children hierarchical structure
Вы можете refer к the two примеры на the official website:

1. базовый таблица tree: https://visactor.io/vтаблица/демонстрация/таблица-тип/список-таблица-tree
2. сводный таблица tree: https://visactor.io/vтаблица/демонстрация/таблица-тип/сводный-таблица-tree

## код пример

```javascript
const option = {
  records:
  [
    {
    "department": "Human Resources Department",
    "children": [
      {
        "group": "Recruiting Group",
        "children": [
          {
            "имя": "John Smith",
            "позиция": "Recruiting Manвозрастr",
            "salary": "$8000"
          },
          {
            "имя": "Emily Johnson",
            "позиция": "Recruiting Supervisor",
            "salary": "$6000"
          },
          {
            "имя": "Michael Davis",
            "позиция": "Recruiting Speciaсписок",
            "salary": "$4000"
          }
        ],
      },
      ...
  ],
  columns: [
    {
        "поле": "group",
        "title": "department",
        "ширина": "авто",
         tree: true,
      },
      ...
    ]
};
```

## Results

[Online демонстрация](https://visactor.io/vтаблица/демонстрация/таблица-тип/список-таблица-tree)

![result](/vтаблица/Часто Задаваемые Вопросы/15-1.png)

## Quote

- [Tree таблица Tutorial](https://visactor.io/vтаблица/guide/таблица_type/список_таблица/tree_список)
- [Related апи](https://visactor.io/vтаблица/option/списоктаблица-columns-текст#tree)
- [github](https://github.com/VisActor/Vтаблица)
