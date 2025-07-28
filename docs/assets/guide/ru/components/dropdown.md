# выпадающий список отпускание-down меню introduction

в таблица компонентs, a выпадающий список (отпускание-down меню) is a common user интерфейс element commonly used к provide a список из options для selection или action. It appears as an Expandable меню that, when the user Нажатьs или hovers over выпадающий список, displays a отпускание-down список от which the user can выбрать one или more options.
Use cases such as:

- данные operations: such as modifying a piece из данные, deleting и other operations, let the user выбрать through the отпускание-down меню.
- сортировкаing options: The выпадающий список меню can provide сортировкаing options that allow users к сортировка или filter таблица данные based на different columns или criteria.

## Introduction к configuration items

    {
       /** 下拉菜单的相关配置。消失时机：显示后点击菜单区域外自动消失*/
      меню?: {
        /** 代替原来的option.менюType  html目前实现较完整 先默认html渲染方式*/
        renderMode?: 'canvas' | 'html';
        /** 内置下拉菜单的全局设置项 目前只针对基本表格有效 会对每个表头单元格开启默认的下拉菜单功能。代替原来的option.dropDownменю*/
        defaultHeaderменюItems?: менюсписокItem[] | ((args: { col: число; row: число; таблица: Baseтаблицаапи }) => менюсписокItem[]);
        /** 右键菜单。代替原来的option.contextменю */
        contextменюItems?: менюсписокItem[] | ((поле: строка, row: число, col: число, таблица: Baseтаблицаапи) => менюсписокItem[]);
        /** 设置选中状态的菜单。代替原来的option.dropDownменюHighlight  */
        dropDownменюHighlight?: DropDownменюHighlightInfo[];
      };
    };

- renderMode: specifies the rendering method;
- defaultHeaderменюItems: Specify the header по умолчанию configuration item content
- contextменюItems: specify the право-Нажать меню список
- dropDownменюHighlight: If the меню has a corresponding selected state, configure it here

## пример

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа',
        ширина: 'авто'
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: 'авто',
        style: {
          textAlign: 'лево',
          textBaseline: 'середина',
          textOverflow: 'ellipsis',
          цвет: '#F66',
          fontSize: 14,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          fontStyle: 'italic'
        }
      },
      {
        поле: 'Категория',
        заголовок: 'Категория',
        ширина: 'авто'
      },
      {
        поле: 'Sub-Категория',
        заголовок: 'Sub-Категория',
        ширина: 'авто'
      },
      {
        поле: 'Регион',
        заголовок: 'Регион',
        ширина: 'авто'
      },
      {
        поле: 'Город',
        заголовок: 'Город',
        ширина: 'авто'
      },
      {
        поле: 'Дата Заказа',
        заголовок: 'Дата Заказа',
        ширина: 'авто'
      },
      {
        поле: 'Количество',
        заголовок: 'Количество',
        ширина: 'авто'
      },
      {
        поле: 'Продажи',
        заголовок: 'Продажи',
        ширина: 'авто'
      },
      {
        поле: 'Прибыль',
        заголовок: 'Прибыль',
        ширина: 'авто'
      }
    ];

    const option = {
      container: document.getElementById(CONTAINER_ID),
      records: данные,
      columns,
      ширинаMode: 'standard',
      тема: Vтаблица.темаs.по умолчанию,
      меню: {
        renderMode: 'html',
        defaultHeaderменюItems: [
          {
            текст: '升序排序',
            иконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
            },
            selectedиконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
            },
            stateиконка: {
              svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
            },
            children: [
              {
                текст: '升序规则1',
                менюKey: '升序排序1',
                иконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
                },
                selectedиконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
                },
                stateиконка: {
                  ширина: 12,
                  высота: 11,
                  svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
                },
                менюKey: '升序规则1'
              },
              {
                текст: '升序规则2',
                иконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
                },
                selectedиконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
                },
                stateиконка: {
                  ширина: 12,
                  высота: 11,
                  svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
                },
                менюKey: '升序规则2'
              }
            ]
          },
          {
            текст: '降序排序',
            иконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
            },
            selectedиконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
            },
            stateиконка: {
              svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 38.5314L34.9864 48.5634L34.9864 4.01538H28.9864L28.9864 48.4974L18.9864 38.5014V46.9854L27.776 55.7727H27.7732L32.0158 60.0154L45.0144 47.0174V38.5314Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
            }
          },
          {
            текст: '冻结列',
            иконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8H22V88H8V8ZM34 88V8H88V88H34ZM80 16H42V80H80V16Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
            }
          }
        ],
        contextменюItems: ['复制', '粘贴'],
        dropDownменюHighlight: [
          {
            поле: 'ID Заказа',
            менюKey: '升序规则1'
          }
        ]
      }
    };
    таблицаInstance = новый Vтаблица.списоктаблица(option);
    window['таблицаInstance'] = таблицаInstance;
  });
```

### defaultHeaderменюItems пример:

This пример is configured с defaultHeaderменюItems, when the mouse навести к the таблица header that is the отпускание-down меню, if you want к change the отпускание-down меню иконка can be overwritten по registration:

      Vтаблица.регистрация.иконка('dropdownиконка',{
              ......
              },
      );

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    Vтаблица.регистрация.иконка('dropdownиконка', {
      имя: 'dropdownиконка',
      тип: 'svg',
      цвет: 'blue',
      positionType: Vтаблица.TYPES.иконкаPosition.право,
      funcType: Vтаблица.TYPES.иконкаFuncTypeEnum.выпадающий список,
      ширина: 20,
      visibleTime: 'always',
      высота: 20,
      svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/выпадающий список.svg',
      marginLeft: 10,
      Подсказка: {
        style: { arrowMark: true, шрифт: 10, bgColor: 'white', цвет: 'black' },
        // 气泡框，按钮的的解释信息
        заголовок: 'сортировка данные',
        placement: Vтаблица.TYPES.Placement.право
      }
    });
    const columns = [
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа',
        ширина: 'авто'
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: 'авто',
        style: {
          textAlign: 'лево',
          textBaseline: 'середина',
          textOverflow: 'ellipsis',
          цвет: '#F66',
          fontSize: 14,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          fontStyle: 'italic'
        }
      },
      {
        поле: 'Категория',
        заголовок: 'Категория',
        ширина: 'авто'
      },
      {
        поле: 'Sub-Категория',
        заголовок: 'Sub-Категория',
        ширина: 'авто'
      },
      {
        поле: 'Регион',
        заголовок: 'Регион',
        ширина: 'авто'
      },
      {
        поле: 'Город',
        заголовок: 'Город',
        ширина: 'авто'
      },
      {
        поле: 'Дата Заказа',
        заголовок: 'Дата Заказа',
        ширина: 'авто'
      },
      {
        поле: 'Количество',
        заголовок: 'Количество',
        ширина: 'авто'
      },
      {
        поле: 'Продажи',
        заголовок: 'Продажи',
        ширина: 'авто'
      },
      {
        поле: 'Прибыль',
        заголовок: 'Прибыль',
        ширина: 'авто'
      }
    ];

    const option = {
      container: document.getElementById(CONTAINER_ID),
      records: данные,
      columns,
      ширинаMode: 'standard',
      тема: Vтаблица.темаs.по умолчанию,
      меню: {
        renderMode: 'html',
        defaultHeaderменюItems: [
          {
            текст: '升序排序',
            иконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
            },
            selectedиконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
            },
            stateиконка: {
              svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
            },
            children: [
              {
                текст: '升序规则1',
                иконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
                },
                selectedиконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
                },
                stateиконка: {
                  ширина: 12,
                  высота: 11,
                  svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
                },
                менюKey: '升序规则1'
              },
              {
                текст: '升序规则2',
                иконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
                },
                selectedиконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
                },
                stateиконка: {
                  ширина: 12,
                  высота: 11,
                  svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
                },
                менюKey: '升序规则2'
              }
            ]
          },
          {
            текст: '降序排序',
            иконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
            },
            selectedиконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
            },
            stateиконка: {
              svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 38.5314L34.9864 48.5634L34.9864 4.01538H28.9864L28.9864 48.4974L18.9864 38.5014V46.9854L27.776 55.7727H27.7732L32.0158 60.0154L45.0144 47.0174V38.5314Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
            }
          },
          {
            текст: '冻结列',
            иконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8H22V88H8V8ZM34 88V8H88V88H34ZM80 16H42V80H80V16Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
            }
          }
        ],
        contextменюItems: ['复制', '粘贴']
      }
    };
    таблицаInstance = новый Vтаблица.списоктаблица(option);
    window['таблицаInstance'] = таблицаInstance;
  });
```

### contextменюItems пример право-Нажать меню:

в this пример, contextменюItems is configured, и a отпускание-down меню pops up after the право mouse Кнопка:

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/ffc3a9b5518762d274121ff08.png)

Other reference демонстрация: https://visactor.io/vтаблица/демонстрация/interaction/context-меню

### dropDownменюHighlight меню initial selection status пример:

     dropDownменюHighlight: [
            {
              поле:'ID Заказа',
              менюKey: '升序规则1'
            }
          ]

Subsequent Нажатьs к switch states are доступный through the интерфейс:

    setDropDownменюHighlight(
    [
            {
              поле:'ID Заказа',
              менюKey: '升序规则1'
            }
          ]
    )

## Global & Local Configuration

- Globally specifies the отпускание-down меню displayed на the header, the configuration form в the above пример;

- Local configuration means that it can be configured на the header из a column.

в the пример below, the отпускание-down меню is only configured на the первый column:

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа',
        ширина: 'авто',
        dropDownменю: [
          {
            текст: '升序排序',
            менюKey: '升序排序',
            иконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
            },
            selectedиконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
            },
            stateиконка: {
              svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
            },
            children: [
              {
                текст: '升序规则1',
                менюKey: '升序规则1',
                иконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
                },
                selectedиконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
                },
                stateиконка: {
                  ширина: 12,
                  высота: 11,
                  svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
                },
                менюKey: '升序规则1'
              },
              {
                текст: '升序规则2',
                иконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
                },
                selectedиконка: {
                  svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
                },
                stateиконка: {
                  ширина: 12,
                  высота: 11,
                  svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
                },
                менюKey: '升序规则2'
              }
            ]
          },
          {
            текст: '降序排序',
            иконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
            },
            selectedиконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opaГород="0.9"></path></svg>'
            },
            stateиконка: {
              svg: '<svg ширина="12" высота="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-таблица-action-area-иконка"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 38.5314L34.9864 48.5634L34.9864 4.01538H28.9864L28.9864 48.4974L18.9864 38.5014V46.9854L27.776 55.7727H27.7732L32.0158 60.0154L45.0144 47.0174V38.5314Z" fill="#161616" fill-opaГород="0.9"></path></svg>'
            }
          },
          {
            текст: '冻结列',
            иконка: {
              svg: '<svg ширина="14" высота="14" viewBox="0 0 96 96" fill="никто" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8H22V88H8V8ZM34 88V8H88V88H34ZM80 16H42V80H80V16Z" fill="#2e2f32" fill-opaГород="0.9"></path></svg>'
            }
          }
        ]
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: 'авто',
        style: {
          textAlign: 'лево',
          textBaseline: 'середина',
          textOverflow: 'ellipsis',
          цвет: '#F66',
          fontSize: 14,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          fontStyle: 'italic'
        }
      },
      {
        поле: 'Категория',
        заголовок: 'Категория',
        ширина: 'авто'
      },
      {
        поле: 'Sub-Категория',
        заголовок: 'Sub-Категория',
        ширина: 'авто'
      },
      {
        поле: 'Регион',
        заголовок: 'Регион',
        ширина: 'авто'
      },
      {
        поле: 'Город',
        заголовок: 'Город',
        ширина: 'авто'
      },
      {
        поле: 'Дата Заказа',
        заголовок: 'Дата Заказа',
        ширина: 'авто'
      },
      {
        поле: 'Количество',
        заголовок: 'Количество',
        ширина: 'авто'
      },
      {
        поле: 'Продажи',
        заголовок: 'Продажи',
        ширина: 'авто'
      },
      {
        поле: 'Прибыль',
        заголовок: 'Прибыль',
        ширина: 'авто'
      }
    ];

    const option = {
      container: document.getElementById(CONTAINER_ID),
      records: данные,
      columns,
      ширинаMode: 'standard',
      тема: Vтаблица.темаs.по умолчанию
    };
    таблицаInstance = новый Vтаблица.списоктаблица(option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
