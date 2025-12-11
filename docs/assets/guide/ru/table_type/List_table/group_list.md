## базовый таблица grouping display

в this tutorial, we will learn how к use the базовый таблица grouping display функция в Vтаблица.

## Usвозраст scenario

The базовый таблица grouping display функция is applicable к a variety из scenarios, such as:

- Financial statements: Вы можете group и display according к different account types (such as income, expenditure, assets, liabilities) к help you understand the financial situation more clearly.

- Продажи данные analysis: Вы можете group по product Категория, Регион, Продажиperson, etc., к facilitate comparison и analysis из Продажи Производительность в different categories или Регионs.

- Project manвозрастment: Вы можете group по project stвозраст, responsible team, priority, etc. к help better track и manвозраст project progress.

- Human resource manвозрастment: Вы можете group по department, позиция, years из work, etc. к facilitate employee manвозрастment и Производительность evaluation.

## Usвозраст method

в the option из списоктаблица, configure the `groupBy` поле, the значение is the grouping поле имя, Вы можете configure a single поле, или Вы можете configure an массив из multiple полеs.
```
{
  // ...
  groupBy: 'key',
}
```
或
```
{
  // ...
  groupBy: ['key1', 'key2'],
}
```
## пример
```javascript liveдемонстрация template=vтаблица
const records = [
   {
      имя: 'John Smith',
      позиция: 'Recruiting Manвозрастr',
      salary: '$8000',
      группа: 'Recruiting Group'
    },
    {
      имя: 'Emily Johnson',
      позиция: 'Recruiting Supervisor',
      salary: '$6000',
      группа: 'Recruiting Group'
    },
    {
      имя: 'Michael Davis',
      позиция: 'Recruiting Speciaсписок',
      salary: '$4000',
      группа: 'Recruiting Group'
    },
    {
      имя: 'Jessica Brown',
      позиция: 'Training Manвозрастr',
      salary: '$8000',
      группа: 'Training Group',
    },
    {
      имя: 'Andrew Wilson',
      позиция: 'Training Supervisor',
      salary: '$6000',
      группа: 'Training Group',
    }
];
const columns = [
  {
    поле: 'имя',
    заголовок: 'имя',
    ширина: 'авто',
  },
  {
    поле: 'позиция',
    заголовок: 'позиция',
    ширина: 'авто',
  },
  {
    поле: 'salary',
    заголовок: 'Salary',
    ширина: 'авто',
  },
];

const option = {
  records,
  columns,
  ширинаMode: 'standard',
  groupBy: 'group'
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```

## пользовательский Group Title текст Format

в the option, Вы можете configure the `groupTitleполеFormat` property к пользовательскийize the текст format из group titles. This property is a функция that receives the grouping поле имя и group значение as parameters и returns the текст content к be displayed.

```ts
const опция: Vтаблица.списоктаблицаConstructorOptions = {
  // ...
  groupBy: 'group',
  groupTitleполеFormat: (record, col, row, таблица) => {
    возврат record.vтаблицаMergeимя + '(' + record.children.length + ')';
  }
};
```

пример:
```javascript liveдемонстрация template=vтаблица
const records = [
   {
      имя: 'John Smith',
      позиция: 'Recruiting Manвозрастr',
      salary: '$8000',
      группа: 'Recruiting Group'
    },
    {
      имя: 'Emily Johnson',
      позиция: 'Recruiting Supervisor',
      salary: '$6000',
      группа: 'Recruiting Group'
    },
    {
      имя: 'Jessica Brown',
      позиция: 'Training Manвозрастr',
      salary: '$8000',
      группа: 'Training Group',
    }
];
const columns = [
  {
    поле: 'имя',
    заголовок: 'имя',
    ширина: 'авто',
  },
  {
    поле: 'позиция',
    заголовок: 'позиция',
    ширина: 'авто',
  },
  {
    поле: 'salary',
    заголовок: 'Salary',
    ширина: 'авто',
  },
];

const option = {
  records,
  columns,
  ширинаMode: 'standard',
  groupBy: 'group',
  groupTitleполеFormat: (record, col, row, таблица) => {
    возврат record.vтаблицаMergeимя + '(' + record.children.length + ')';
  }
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```

## Specify the display style из the group title

в the тема, Вы можете configure the groupTitleStyle property к specify the display style из the group title. If you need к specify the style из group titles в different levels, Вы можете use the функция к get the level из the текущий node through the `таблица.getGroupTitleLevel(col, row)` method к specify the styles из different levels.

```ts
const опция: Vтаблица.списоктаблицаConstructorOptions = {
  // ...
  groupBy: ['Категория', 'Sub-Категория'],
  тема: Vтаблица.темаs.по умолчанию.extends({
    groupTitleStyle: {
      fontWeight: 'bold',
      bgColor: args => {
        const { col, row, таблица } = args;
        const index = таблица.getGroupTitleLevel(col, row); // Get the level из the текущий node
        if (index !== undefined) {
          возврат titleColorPool[index % titleColorPool.length];
        }
      }
    }
  })
};
```

<div style="ширина: 80%; текст-align: центр;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-group.jpeg" />
</div>

## Group title Sticky функция

в option, Вы можете configure the `enableTreeStickCell` property к включить the group title sticky функция. After enabling it, when the таблица is scrolled, the group title will автоmatically adsorb к the верх из the таблица.

```ts
const опция: Vтаблица.списоктаблицаConstructorOptions = {
  // ...
  groupBy: ['Категория', 'Sub-Категория'],
  enableTreeStickCell: true
};
```

## Group Title пользовательскийization

в option, Вы можете configure the `groupTitleпользовательскиймакет` property к пользовательскийize the макет в the group title.

```javascript liveдемонстрация template=vтаблица
// only use для website
const {createGroup, createText, createImвозраст} = VRender;
// use this для project
// import {createGroup, createText, createImвозраст} от '@visactor/vтаблица/es/vrender';

const records = [
   {
      имя: 'John Smith',
      позиция: 'Recruiting Manвозрастr',
      salary: '$8000',
      группа: 'Recruiting Group'
    },
    {
      имя: 'Emily Johnson',
      позиция: 'Recruiting Supervisor',
      salary: '$6000',
      группа: 'Recruiting Group'
    },
    {
      имя: 'Michael Davis',
      позиция: 'Recruiting Speciaсписок',
      salary: '$4000',
      группа: 'Recruiting Group'
    },
    {
      имя: 'Jessica Brown',
      позиция: 'Training Manвозрастr',
      salary: '$8000',
      группа: 'Training Group',
    },
    {
      имя: 'Andrew Wilson',
      позиция: 'Training Supervisor',
      salary: '$6000',
      группа: 'Training Group',
    }
];
const columns = [
  {
    поле: 'имя',
    заголовок: 'имя',
    ширина: 'авто',
  },
  {
    поле: 'позиция',
    заголовок: 'позиция',
    ширина: 'авто',
  },
  {
    поле: 'salary',
    заголовок: 'Salary',
    ширина: 'авто',
  },
];

const option = {
  records,
  columns,
  ширинаMode: 'standard',
  groupBy: 'group',
  groupTitleпользовательскиймакет: args => {
    const { таблица, row, col, rect } = args;
    const record = таблица.getCellOriginRecord(col, row);
    const { высота, ширина } = rect ?? таблица.getCellRect(col, row);
    const hierarchyState = таблица.getHierarchyState(col, row);
    const bloggerAvatar = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg';
    const collapseRight = `<svg xmlns="http://www.w3.org/2000/svg" ширина="16" высота="16" viewBox="0 0 16 16" fill="никто">
            <path d="M5.81235 11.3501C5.48497 11.612 5 11.3789 5 10.9597L5 5.04031C5 4.62106 5.48497 4.38797 5.81235 4.64988L9.51196 7.60957C9.76216 7.80973 9.76216 8.19027 9.51196 8.39044L5.81235 11.3501Z" fill="#141414" fill-opaГород="0.65"/>
          </svg>`;
    const collapseDown = `<svg xmlns="http://www.w3.org/2000/svg" ширина="16" высота="16" viewBox="0 0 16 16" fill="никто">
    <path d="M4.64988 6.81235C4.38797 6.48497 4.62106 6 5.04031 6L10.9597 6C11.3789 6 11.612 6.48497 11.3501 6.81235L8.39043 10.512C8.19027 10.7622 7.80973 10.7622 7.60957 10.512L4.64988 6.81235Z" fill="#141414" fill-opaГород="0.65"/>
    </svg>`;
    const container = createGroup({
      высота,
      ширина,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      cursor: 'pointer',
      alignItems: 'центр'
    });
    const иконка = createImвозраст({
      // id: 'hierarchy',
      imвозраст: hierarchyState === 'свернуть' ? collapseRight : collapseDown,
      ширина: 18,
      высота: 18,
      boundsPadding: [0, 0, 0, 10],
      cursor: 'pointer'
    });
    иконка.stateProxy = (stateимя) => {
      if (stateимя === 'навести') {
        возврат {
          фон: {
            fill: '#ccc',
            cornerRadius: 5,
            expandX: 1,
            expandY: 1
          }
        };
      }
    };
    иконка.addсобытиесписокener('pointerenter', событие => {
      событие.currentTarget.addState('навести', true, false);
      событие.currentTarget.stвозраст.renderNextFrame();
    });
    иконка.addсобытиесписокener('pointerleave', событие => {
      событие.currentTarget.removeState('навести', false);
      событие.currentTarget.stвозраст.renderNextFrame();
    });
    container.add(иконка);
    const taskGroup = createGroup({
      высота,
      ширина: 340,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      cursor: 'pointer',
      alignItems: 'центр',
      justifyContent: 'space-between'
    });
    const leftGroup = createGroup({
      высота,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      cursor: 'pointer',
      alignItems: 'центр'
    });
    const avatar = createImвозраст({
      imвозраст: bloggerAvatar,
      ширина: 24,
      высота: 24,
      boundsPadding: [0, 8, 0, 8],
      cursor: 'pointer',
      cornerRadius: 12
    });
    const bloggerимя = createText({
      текст: record.vтаблицаMergeимя,
      fontSize: 14,
      fill: 'black'
    });
    leftGroup.add(avatar);
    leftGroup.add(bloggerимя);
    taskGroup.add(leftGroup);
    const информация = createText({
      текст: `${record.children.length} 条记录`,
      fontSize: 12
    });
    taskGroup.add(информация);
    container.add(taskGroup);
    container.addсобытиесписокener('Нажать', e => {
      const { col, row } = e.currentTarget.parent;
      const hierarchyState = таблица.getHierarchyState(col, row);
      иконка.setAttribute('imвозраст', hierarchyState === 'свернуть' ? collapseDown : collapseRight);
      таблица.toggleHierarchyState(col, row);
    });

    возврат {
      rootContainer: container,
      renderDefault: false
    };
  }
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```

## Group флажок

в `rowSeriesNumber`, Вы можете configure `enableTreeCheckbox` к включить the group флажок.
If включен, флажок will be displayed в the лево из group title, и it will be synced с the children флажок.

```javascript liveдемонстрация template=vтаблица
// only use для website
const {createGroup, createText, createImвозраст} = VRender;
// use this для project
// import {createGroup, createText, createImвозраст} от '@visactor/vтаблица/es/vrender';

const records = [
   {
      имя: 'John Smith',
      позиция: 'Recruiting Manвозрастr',
      salary: '$8000',
      группа: 'Recruiting Group'
    },
    {
      имя: 'Emily Johnson',
      позиция: 'Recruiting Supervisor',
      salary: '$6000',
      группа: 'Recruiting Group'
    },
    {
      имя: 'Michael Davis',
      позиция: 'Recruiting Speciaсписок',
      salary: '$4000',
      группа: 'Recruiting Group'
    },
    {
      имя: 'Jessica Brown',
      позиция: 'Training Manвозрастr',
      salary: '$8000',
      группа: 'Training Group',
    },
    {
      имя: 'Andrew Wilson',
      позиция: 'Training Supervisor',
      salary: '$6000',
      группа: 'Training Group',
    }
];
const columns = [
  {
    поле: 'имя',
    заголовок: 'имя',
    ширина: 'авто',
  },
  {
    поле: 'позиция',
    заголовок: 'позиция',
    ширина: 'авто',
  },
  {
    поле: 'salary',
    заголовок: 'Salary',
    ширина: 'авто',
  },
];

const option = {
  records,
  columns,
  ширинаMode: 'standard',
  groupBy: 'group',

  rowSeriesNumber: {
    ширина: 50,
    format: () => {
      возврат '';
    },
    cellType: 'флажок',
    enableTreeCheckbox: true
  }
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
