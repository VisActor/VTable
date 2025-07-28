# How к пользовательскийize the отпускание-down меню в таблица компонент?

## Question Description

How к пользовательскийize the отпускание-down меню в the header part из the таблица компонент к support configuration иконкаs и multi-level менюs.

## Solution

Vтаблица supports two отпускание-down меню configuration методы:

1. Configure globally
   Configuring the меню attribute в option will take effect на все headers that do не have a отпускание-down меню configured. The displayed меню items are configured в defaultHeaderменюItems и support Следующий configurations:

- текст: меню item текст
- иконка: меню item иконка
- selectedиконка: меню item selected status иконка
- children: secondary меню items

```javascript
меню: {
  defaultHeaderменюItems: [
    {
      текст: 'ascend',
      иконка: {
        svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
      },
      selectedиконка: {
        svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
      },
      children: [
        {
          текст: 'ascend',
          иконка: {
            svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
          },
          selectedиконка: {
            svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
          },
          менюKey: 'ascend1'
        },
        {
          текст: 'descend',
          иконка: {
            svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
          },
          selectedиконка: {
            svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
          },
          менюKey: 'descend1'
        }
      ]
    }
    // ......
  ];
}
```

2. Configure в the header
   dropDownменю can be configured в columns. The items are the same as defaultHeaderменюItems. The меню only takes effect в the corresponding column.
3. меню selection status update
   After the отпускание-down меню item is selected, the "dropdown_меню_Нажать" событие will be triggered. The списокening событие updates the отпускание-down меню status through the setDropDownменюHighlight интерфейс. The selected item текст и иконка will change the style.

```javascript
таблица.на('dropdown_меню_Нажать', (args: любой) => {
  console.log('dropdown_меню_Нажать', args);
  таблица.setDropDownменюHighlight([args]);
});
```

## код пример

```javascript
const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 80
  },
  {
    поле: 'hobbies',
    заголовок: 'hobbies',
    ширина: 200,
    dropDownменю: ['item1', 'item2']
  }
];
const опция: TYPES.списоктаблицаConstructorOptions = {
  records,
  columns,
  высотаMode: 'автовысота',
  автоWrapText: true,
  меню: {
    defaultHeaderменюItems: [
      {
        текст: 'ascend',
        иконка: {
          svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
        },
        selectedиконка: {
          svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
        },
        children: [
          {
            текст: 'ascend',
            иконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
            },
            selectedиконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
            },
            менюKey: 'ascend1'
          },
          {
            текст: 'descend',
            иконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
            },
            selectedиконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
            },
            менюKey: '降序排序1'
          }
        ]
      },
      {
        текст: 'descend',
        иконка: {
          svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
        },
        selectedиконка: {
          svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
        }
      },
      {
        текст: 'frozen',
        иконка: {
          svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8H22V88H8V8ZM34 88V8H88V88H34ZM80 16H42V80H80V16Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
        }
      }
    ]
  }
};
const таблица = новый списоктаблица(document.getElementById('container'), option);
таблица.на('dropdown_меню_Нажать', (args: любой) => {
  console.log('dropdown_меню_Нажать', args);
  таблица.setDropDownменюHighlight([args]);
});
```

## Results

[Online демонстрация](https://кодsandbox.io/s/vтаблица-выпадающий список-меню-wn4gl3)

![result](/vтаблица/Часто Задаваемые Вопросы/16-1.png)

## Quote

- [отпускание-down меню Tutorial](https://www.visactor.io/vтаблица/guide/компонентs/выпадающий список)
- [Related апи](https://www.visactor.io/vтаблица/option/списоктаблица-columns-текст#dropDownменю)
- [Related апи](<https://www.visactor.io/vтаблица/option/списоктаблица#меню.defaultHeaderменюItems(менюсписокItem%5B%5D)>>)
- [github](https://github.com/VisActor/Vтаблица)
