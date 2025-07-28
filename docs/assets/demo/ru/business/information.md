---
категория: примеры
группа: Business
заголовок: Information system
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/information.png
ссылка: пользовательский_define/пользовательский_иконка
---

# Information system

Query product order information.

## Ключевые Конфигурации

- `headerType` и `cellType` флажок флажок тип
- `getCheckboxState` Gets the checked state из the флажок under a certain поле
- `Vтаблица.регистрация.иконка` регистрацияs a пользовательский иконка и can be used с columns[x].иконка или columns[x].headerиконка. или reset the internal иконка

The specific имяs из built-в функция иконкаs are:
`'сортировка_upward',
'сортировка_downward',
'сортировка_normal',
'frozen',
'frozen',
'frozenCurrent',
'dropdownиконка',
'dropdownиконка_hover',
'развернуть',
'свернуть',`

## код демонстрация

```javascript liveдемонстрация template=vтаблица
Vтаблица.регистрация.иконка('freeze', {
  тип: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/freeze.svg',
  ширина: 22,
  высота: 22,
  имя: 'freeze',
  funcType: Vтаблица.TYPES.иконкаFuncTypeEnum.freeze,
  positionType: Vтаблица.TYPES.иконкаPosition.право,
  marginRight: 0,
  навести: {
    ширина: 22,
    высота: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});
Vтаблица.регистрация.иконка('frozenCurrent', {
  тип: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/frozenCurrent.svg',
  ширина: 22,
  высота: 22,
  имя: 'frozenCurrent',
  funcType: Vтаблица.TYPES.иконкаFuncTypeEnum.frozen,
  positionType: Vтаблица.TYPES.иконкаPosition.право,
  marginRight: 0,
  навести: {
    ширина: 22,
    высота: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});

Vтаблица.регистрация.иконка('frozen', {
  тип: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/frozen.svg',
  ширина: 22,
  высота: 22,
  имя: 'frozen',
  funcType: Vтаблица.TYPES.иконкаFuncTypeEnum.frozen,
  positionType: Vтаблица.TYPES.иконкаPosition.право,
  marginRight: 0,
  навести: {
    ширина: 22,
    высота: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});

Vтаблица.регистрация.иконка('order', {
  тип: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/order.svg',
  ширина: 22,
  высота: 22,
  имя: 'order',
  positionType: Vтаблица.TYPES.иконкаPosition.лево,
  marginRight: 0,
  навести: {
    ширина: 22,
    высота: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer',
  Подсказка: {
    style: {
      bgColor: 'gray',
      fontSize: 16
    },
    // 气泡框，按钮的的解释信息
    заголовок: '点击可复制',
    placement: Vтаблица.TYPES.Placement.верх
  }
});

let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: '',
        заголовок: '',
        ширина: 50,
        cellType: 'флажок',
        headerType: 'флажок'
      },
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа',
        ширина: 'авто',
        иконка: 'order'
      },
      {
        поле: 'пользовательскийer ID',
        заголовок: 'пользовательскийer ID',
        ширина: 'авто'
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: 'авто'
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
        поле: '2234',
        заголовок: 'single line',
        ширина: 120,
        иконка: [
          {
            имя: 'edit',
            тип: 'svg',
            marginLeft: 10,
            цвет: 'blue',
            positionType: Vтаблица.TYPES.иконкаPosition.лево,
            ширина: 20,
            высота: 20,
            svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/edit.svg',
            Подсказка: {
              style: { arrowMark: true },
              // 气泡框，按钮的的解释信息
              заголовок: '编辑',
              placement: Vтаблица.TYPES.Placement.право
            }
          },
          {
            имя: 'delete',
            тип: 'svg',
            marginLeft: 20,
            цвет: 'blue',
            positionType: Vтаблица.TYPES.иконкаPosition.лево,
            ширина: 20,
            высота: 20,
            svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/delete.svg',
            Подсказка: {
              style: { arrowMark: true },
              // 气泡框，按钮的的解释信息
              заголовок: '删除',
              placement: Vтаблица.TYPES.Placement.право
            }
          }
        ]
      }
    ];

    const option = {
      records: данные,
      columns,
      ширинаMode: 'standard',
      frozenColCount: 2,
      rightFrozenColCount: 1
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;

    таблицаInstance.на('Нажать_cell', args => {
      console.log('Нажать_cell', args);
      const { col, row, targetиконка } = args;
      if (targetиконка) {
        if (targetиконка.имя === 'edit') {
          window?.предупреждение?.('编辑第 ' + (row - таблицаInstance.columnHeaderLevelCount + 1) + ' 条数据');
        } else if (targetиконка.имя === 'delete') {
          данные.splice(row - таблицаInstance.columnHeaderLevelCount, 1);
          таблицаInstance.setRecords(данные);
        } else if (targetиконка.имя === 'order') {
          const значение = таблицаInstance.getCellValue(col, row);
          window?.предупреждение?.('已复制订单号： ' + значение);
        }
      }
    });
  });
```
