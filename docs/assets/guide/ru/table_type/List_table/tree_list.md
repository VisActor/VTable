## базовый таблица tree structure

в this tutorial, we will learn how к use the базовый таблица tree presentation feature в Vтаблица.

## usвозраст scenario

The базовый таблица tree display функция is suiтаблица для a variety из scenarios, such as:

- Organizational structure manвозрастment: Enterprise organizational structure is usually a multi-level tree structure.
- Commodity classification manвозрастment: E-commerce platforms usually need к manвозраст a large число из commodity classifications, which are usually also a multi-level tree structure.
- Project Manвозрастment: в a large project, there may be multiple sub-projects и tasks.
- File manвозрастment: в a large file library, there may be multiple folders и subfolders.
- данные analytics: в a данные analytics application, it may be necessary к демонстрацияnstrate multiple Dimensions и Metirc.

## How к use

**1.** Specify tree к be true в the column configuration where colums are embodied as a tree structure.

**2.** Add children данные nested structure к the данные к express и display as a tree hierarchy. Следующий данные:

    {
        "group": "Human Resources Department",
        "monthly_expense": "$45000",
        "children": [
          {
            "group": "Recruiting Group",
            "monthly_expense": "$25000",
            "children": [
              {
                "group": "John Smith",
                "позиция": "Recruiting Manвозрастr",
                "salary": "$8000"
              },
          }
        ]
    }

## пример

```javascript liveдемонстрация template=vтаблица
const records = [
  {
    группа: 'Human Resources Department',
    total_children: 30,
    monthly_expense: '$45000',
    new_hires_this_month: 6,
    resignations_this_month: 3,
    complaints_and_suggestions: 2,
    children: [
      {
        группа: 'Recruiting Group',
        children: [
          {
            группа: 'John Smith',
            позиция: 'Recruiting Manвозрастr',
            salary: '$8000'
          },
          {
            группа: 'Emily Johnson',
            позиция: 'Recruiting Supervisor',
            salary: '$6000'
          },
          {
            группа: 'Michael Davis',
            позиция: 'Recruiting Speciaсписок',
            salary: '$4000'
          }
        ],
        total_children: 15,
        monthly_expense: '$25000',
        new_hires_this_month: 4,
        resignations_this_month: 2,
        complaints_and_suggestions: 1
      },
      {
        группа: 'Training Group',
        children: [
          {
            группа: 'Jessica Brown',
            позиция: 'Training Manвозрастr',
            salary: '$8000'
          },
          {
            группа: 'Andrew Wilson',
            позиция: 'Training Supervisor',
            salary: '$6000'
          }
        ],
        total_children: 15,
        monthly_expense: '$20000',
        new_hires_this_month: 2,
        resignations_this_month: 1,
        complaints_and_suggestions: 1
      }
    ]
  }
];
const columns = [
  {
    поле: 'group',
    заголовок: 'department',
    ширина: 'авто',
    tree: true
  },
  {
    поле: 'total_children',
    заголовок: 'memebers count',
    ширина: 'авто',
    полеFormat(rec) {
      if (rec?.['позиция']) {
        возврат `позиция:  ${rec['позиция']}`;
      } else возврат rec?.['total_children'];
    }
  },
  {
    поле: 'monthly_expense',
    заголовок: 'monthly expense',
    ширина: 'авто',
    полеFormat(rec) {
      if (rec?.['salary']) {
        возврат `salary:  ${rec['salary']}`;
      } else возврат rec?.['monthly_expense'];
    }
  },
  {
    поле: 'new_hires_this_month',
    заголовок: 'новый hires this month',
    ширина: 'авто'
  },
  {
    поле: 'resignations_this_month',
    заголовок: 'resignations this month',
    ширина: 'авто'
  },
  {
    поле: 'complaints_and_suggestions',
    заголовок: 'recived complaints counts',
    ширина: 'авто'
  }
];

const option = {
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
  ширинаMode: 'standard'
};
const таблицаInstance = новый списоктаблица(option);
window['таблицаInstance'] = таблицаInstance;
```

## Specify the collapsed или expanded state из a node

в the above пример, Вы можете set the `hierarchyState` из the данные node к specify the collapsed или expanded state из the node, и its значение is `развернуть` или `свернуть`.

для пример, specify the первый node as expanded: `hierarchyState: 'развернуть'`.

```javascript
const records = [
  {
    группа: 'Human Resources Department',
    total_children: 30,
    monthly_expense: '$45000',
    new_hires_this_month: 6,
    resignations_this_month: 3,
    complaints_and_suggestions: 2,
    hierarchyState: 'развернуть',
    children: [
      // ...
    ]
  }
];
```

## по умолчанию expansion level из tree structure

в a tree structure, the по умолчанию expansion level can be specified through the `hierarchyExpandLevel` configuration item.

для пример, к specify the по умолчанию expansion к the third level: `hierarchyExpandLevel: 3`。

```javascript
const option = {
  records,
  columns,
  ширинаMode: 'standard',
  hierarchyExpandLevel: 3
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
```

## Lazy загрузка из child node данные scenarios

в некоторые scenarios, the child node данные may be relatively large. в view из the excessive Производительность pressure на the backend данныеbase, и you do не want к obtain все the данные в once, you need к call the интерфейс к load the данные when you Нажать к развернуть. Then Вы можете use Следующий method к achieve:

0. (необязательный) регистрация the загрузка иконка

```javascript
Vтаблица.регистрация.иконка('загрузка', {
  тип: 'imвозраст',
  ширина: 16,
  высота: 16,
  src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/загрузка-circle.gif',
  имя: 'загрузка', // Define the имя из the иконка, which will be used as the key значение для caching в the internal cache
  positionType: Vтаблица.TYPES.иконкаPosition.absoluteRight, // Specify the позиция, which can be before или after the текст, или лево или право из the cell
  marginLeft: 0, // The лево content interval в the specific позиция
  marginRight: 4, // The право content interval в the specific позиция
  visibleTime: 'always', // The display time, 'always' | 'mouseover_cell' | 'Нажать_cell'
  навести: {
    // The размер из the hot area
    ширина: 22,
    высота: 22,
    bgColor: 'rgba(101,117,168,0.1)'
  },
  isGif: true
});
```

1. Set the children из the corresponding данные к true instead из a specific данные collection so that the cell can display the folded иконка;
2. When the user Нажатьs the status иконка, the событие `Vтаблица.списоктаблица.событие_TYPE.TREE_HIERARCHY_STATE_CHANGE` will be triggered. The front-конец код needs к списокen к this событие к request children данные.
3. (необязательный) Before загрузка the данные, call the `instance.setLoadingHierarchyState(col, row)` method к display the загрузка иконка;
4. Pass the obtained данные back к the таблица компонент, Вы можете call the интерфейс `instance.setRecordChildren(childrenданные, col, row)`;

для specific примеры, please see: https://visactor.io/vтаблица/демонстрация/таблица-тип/список-таблица-tree-lazy-load

## Merge cells в the tree structure

в некоторые scenarios, you want к display the parent node as a merged cell в the entire row, Вы можете configure `vтаблицаMerge` и `vтаблицаMergeимя` в the данные, where `vтаблицаMerge` is true, indicating that the parent node is a merged cell, и `vтаблицаMergeимя` is the имя displayed в the merged cell. в the same time, you need к add the `enableTreeNodeMerge` configuration к true в the option.

```javascript liveдемонстрация template=vтаблица
const records = [
  {
    группа: 'Human Resources Department',
    total_children: 30,
    monthly_expense: '$45000',
    new_hires_this_month: 6,
    resignations_this_month: 3,
    complaints_and_suggestions: 2,
    vтаблицаMerge: true,
    vтаблицаMergeимя: 'Human Resources Department(merge)',
    children: [
      {
        группа: 'Recruiting Group',
        vтаблицаMerge: true,
        vтаблицаMergeимя: 'Recruiting Group(merge)',
        children: [
          {
            группа: 'John Smith',
            позиция: 'Recruiting Manвозрастr',
            salary: '$8000'
          },
          {
            группа: 'Emily Johnson',
            позиция: 'Recruiting Supervisor',
            salary: '$6000'
          },
          {
            группа: 'Michael Davis',
            позиция: 'Recruiting Speciaсписок',
            salary: '$4000'
          }
        ],
        total_children: 15,
        monthly_expense: '$25000',
        new_hires_this_month: 4,
        resignations_this_month: 2,
        complaints_and_suggestions: 1
      },
      {
        группа: 'Training Group',
        vтаблицаMerge: true,
        vтаблицаMergeимя: 'Training Group(merge)',
        children: [
          {
            группа: 'Jessica Brown',
            позиция: 'Training Manвозрастr',
            salary: '$8000'
          },
          {
            группа: 'Andrew Wilson',
            позиция: 'Training Supervisor',
            salary: '$6000'
          }
        ],
        total_children: 15,
        monthly_expense: '$20000',
        new_hires_this_month: 2,
        resignations_this_month: 1,
        complaints_and_suggestions: 1
      }
    ]
  }
];
const columns = [
  {
    поле: 'group',
    заголовок: 'department',
    ширина: 'авто',
    tree: true
  },
  {
    поле: 'total_children',
    заголовок: 'memebers count',
    ширина: 'авто',
    полеFormat(rec) {
      if (rec?.['позиция']) {
        возврат `позиция:  ${rec['позиция']}`;
      } else возврат rec?.['total_children'];
    }
  },
  {
    поле: 'monthly_expense',
    заголовок: 'monthly expense',
    ширина: 'авто',
    полеFormat(rec) {
      if (rec?.['salary']) {
        возврат `salary:  ${rec['salary']}`;
      } else возврат rec?.['monthly_expense'];
    }
  },
  {
    поле: 'new_hires_this_month',
    заголовок: 'новый hires this month',
    ширина: 'авто'
  },
  {
    поле: 'resignations_this_month',
    заголовок: 'resignations this month',
    ширина: 'авто'
  },
  {
    поле: 'complaints_and_suggestions',
    заголовок: 'recived complaints counts',
    ширина: 'авто'
  }
];

const option = {
  records,
  columns,
  ширинаMode: 'standard',
  enableTreeNodeMerge: true,
  hierarchyExpandLevel: Infinity
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
