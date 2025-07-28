---
категория: примеры
группа: таблица-тип
заголовок: базовый таблица tree display (lazy загрузка из child node данные)
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-tree-lazy-load-en.gif
ссылка: таблица_type/список_таблица/tree_список
опция: списоктаблица-columns-текст#tree
---

# базовый таблица tree display (lazy загрузка из child node данные)

базовый таблица tree display, turn на the tree mode из a certain column, if the children из the corresponding данные is set к true instead из a specific данные collection, then when Нажатьed, Вы можете списокen к the `TREE_HIERARCHY_STATE_CHANGE` событие к request the children данные и возврат it к the таблица компонент.

## Ключевые Конфигурации

- tree:true Set к включить tree display на a certain column
- children: true Set к включить tree display на a certain row из данные и lazily load child node данные
- setRecordChildren(children: любой[], col: число, row: число) Call this method after lazily загрузка child node данные в a row из данные и возврат it к the таблица компонент
- TREE_HIERARCHY_STATE_CHANGE tree display state change событиеs
- cellType: 'флажок' Turns на the флажок. Use it с tree:true к display the флажок в a tree format.
- enableCheckboxCascade: true It is used globally к turn на the флажок cascade. It must be used с cellType: 'флажок' и tree:true к synchronize the parent и child element selections.

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// регистрация the загрузка иконка
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

let таблицаInstance;
const данные = [
  {
    категория: 'Office Supplies',
    Продажи: '129.696',
    Количество: '2',
    Прибыль: '-60.704',
    children: [
      {
        категория: 'envelope', // 对应原子Категория
        Продажи: '125.44',
        Количество: '2',
        Прибыль: '42.56',
        children: [
          {
            категория: 'yellow envelope',
            Продажи: '125.44',
            Количество: '2',
            Прибыль: '42.56'
          },
          {
            категория: 'white envelope',
            Продажи: '1375.92',
            Количество: '3',
            Прибыль: '550.2'
          }
        ]
      },
      {
        категория: 'utensil', // 对应原子Категория
        Продажи: '1375.92',
        Количество: '3',
        Прибыль: '550.2',
        children: [
          {
            категория: 'stapler',
            Продажи: '125.44',
            Количество: '2',
            Прибыль: '42.56'
          },
          {
            категория: 'calculator',
            Продажи: '1375.92',
            Количество: '3',
            Прибыль: '550.2'
          }
        ]
      }
    ]
  },
  {
    категория: 'technology',
    Продажи: '229.696',
    Количество: '20',
    Прибыль: '90.704',
    children: [
      {
        категория: 'equipment', // 对应原子Категория
        Продажи: '225.44',
        Количество: '5',
        Прибыль: '462.56'
      },
      {
        категория: 'Accessories', // 对应原子Категория
        Продажи: '375.92',
        Количество: '8',
        Прибыль: '550.2'
      },
      {
        категория: 'copier', // 对应原子Категория
        Продажи: '425.44',
        Количество: '7',
        Прибыль: '342.56'
      },
      {
        категория: 'telephone', // 对应原子Категория
        Продажи: '175.92',
        Количество: '6',
        Прибыль: '750.2'
      }
    ]
  },
  {
    категория: 'furniture',
    Продажи: '129.696',
    Количество: '2',
    Прибыль: '-60.704',
    children: [
      {
        категория: 'desk', // 对应原子Категория
        Продажи: '125.44',
        Количество: '2',
        Прибыль: '42.56',
        children: [
          {
            категория: 'yellow desk',
            Продажи: '125.44',
            Количество: '2',
            Прибыль: '42.56'
          },
          {
            категория: 'white desk',
            Продажи: '1375.92',
            Количество: '3',
            Прибыль: '550.2'
          }
        ]
      },
      {
        категория: 'chair', // 对应原子Категория
        Продажи: '1375.92',
        Количество: '3',
        Прибыль: '550.2',
        children: [
          {
            категория: 'boss chairs',
            Продажи: '125.44',
            Количество: '2',
            Прибыль: '42.56'
          },
          {
            категория: 'sofa chair',
            Продажи: '1375.92',
            Количество: '3',
            Прибыль: '550.2'
          }
        ]
      }
    ]
  },
  {
    категория: 'Home appliances(lazy load)',
    Продажи: '229.696',
    Количество: '20',
    Прибыль: '90.704',
    children: true
  }
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  columns: [
    {
      поле: 'Категория',
      // Supports флажок tree display.
      // к synchronize parent и child element checkboxes, be sure к configure enableCheckboxCascade: true в the option global configuration.
      // cellType: 'флажок',
      tree: true,
      заголовок: 'Категория',
      ширина: 'авто',
      сортировка: true
    },
    {
      поле: 'Продажи',
      заголовок: 'Продажи',
      ширина: 'авто',
      сортировка: true
      // tree: true,
    },
    {
      поле: 'Прибыль',
      заголовок: 'Прибыль',
      ширина: 'авто',
      сортировка: true
    }
  ],
  // enableCheckboxCascade:true,
  showPin: true, //显示Vтаблица内置冻结列图标
  ширинаMode: 'standard',
  allowFrozenColCount: 2,
  records: данные,

  hierarchyIndent: 20,
  hierarchyExpandLevel: 2,
  hierarchyTextStartAlignment: true,
  сортировкаState: {
    поле: 'Продажи',
    порядок: 'asc'
  },
  тема: Vтаблица.темаs.BRIGHT,
  defaultRowвысота: 32
};

const instance = новый Vтаблица.списоктаблица(option);

const { TREE_HIERARCHY_STATE_CHANGE } = Vтаблица.списоктаблица.событие_TYPE;
instance.на(TREE_HIERARCHY_STATE_CHANGE, args => {
  // TODO 调用接口插入设置子节点的数据
  if (args.hierarchyState === Vтаблица.TYPES.HierarchyState.развернуть && !массив.isArray(args.originданные.children)) {
    const record = args.originданные;
    instance.setLoadingHierarchyState(args.col, args.row);
    setTimeout(() => {
      const children = [
        {
          категория: record['Категория'] + ' - Категория 1',
          Продажи: 2,
          Количество: 5,
          Прибыль: 4
        },
        {
          категория: record['Категория'] + ' - Категория 2',
          Продажи: 3,
          Количество: 8,
          Прибыль: 5
        },
        {
          категория: record['Категория'] + ' - Категория 3(lazy load)',
          Продажи: 4,
          Количество: 20,
          Прибыль: 90.704,
          children: true
        },
        {
          категория: record['Категория'] + ' - Категория 4',
          Продажи: 5,
          Количество: 6,
          Прибыль: 7
        }
      ];
      instance.setRecordChildren(children, args.col, args.row);
    }, 2000);
  }
});
window['таблицаInstance'] = таблицаInstance;
```
