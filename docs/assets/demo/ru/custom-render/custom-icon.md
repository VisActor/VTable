---
категория: примеры
группа: пользовательский
заголовок: пользовательский иконка
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский-иконка.png
ссылка: пользовательский_define/пользовательский_иконка
---

# пользовательский иконка

Display иконка content в cells.

регистрация the иконка information globally through `Vтаблица.регистрация.иконка`, и then directly configure the registration имя в the иконка или headerиконка в the column, или configure the complete иконка information в the иконка или headerиконка

## Ключевые Конфигурации

- `Vтаблица.регистрация.иконка` регистрацияed пользовательский иконкаs can be used с columns \[x] .иконка или columns \[x] .headerиконка. или reset the internal иконка

The имяs из the built-в функция иконкаs are:
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
// #Регион 为自定义弹出框做准备
const container = document.getElementById(CONTAINER_ID);
const всплывающее окно = document.createElement('div');
объект.assign(всплывающее окно.style, {
  позиция: 'fixed',
  ширина: '300px',
  backgroundColor: '#f1f1f1',
  bпорядок: '1px solid #ccc',
  заполнение: '10px',
  textAlign: 'лево'
});
функция showПодсказка(infoсписок, x, y) {
  всплывающее окно.innerHTML = '';
  всплывающее окно.id = 'всплывающее окно';
  всплывающее окно.style.лево = x + 'px';
  всплывающее окно.style.верх = y + 'px';
  const heading = document.createElement('h4');
  heading.textContent = 'пользовательскийer Information:';
  heading.style.отступ = '0px';
  всплывающее окно.appendChild(heading);
  для (let i = 0; i < infoсписок.length; i++) {
    const информация = infoсписок[i];
    const info1 = document.createElement('p');
    info1.textContent = информация;
    всплывающее окно.appendChild(info1);
  }
  // 将弹出框添加到文档主体中
  document.body.appendChild(всплывающее окно);
}

функция hideПодсказка() {
  if (document.body.contains(всплывающее окно)) {
    document.body.removeChild(всплывающее окно);
  }
}
// #endРегион 为自定义弹出框做准备

Vтаблица.регистрация.иконка('freeze', {
  тип: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/freeze.svg',
  ширина: 22,
  высота: 22,
  имя: 'freeze',
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
  cursor: 'pointer'
  // Подсказка: {
  //   style: {
  //     bgColor:'gray',
  //     fontSize:6
  //   },
  //   // 气泡框，按钮的的解释信息
  //   заголовок: '点击可复制',
  //   placement: Vтаблица.TYPES.Placement.верх,
  // },
});

Vтаблица.регистрация.иконка('текст-Кнопка', {
  тип: 'текст',
  content: 'Нажать',
  имя: 'текст-Кнопка',
  positionType: Vтаблица.TYPES.иконкаPosition.лево,
  style: {
    fill: 'red',
    cursor: 'pointer'
  }
});

Vтаблица.регистрация.иконка('текст-Кнопка1', {
  тип: 'текст',
  content: 'Нажать',
  имя: 'текст-Кнопка',
  positionType: Vтаблица.TYPES.иконкаPosition.лево,
  marginLeft: 10,
  style: {
    cursor: 'pointer',
    fill: 'blue'
  }
});

let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    данные.forEach((данные, index) => {
      данные['avatar'] = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/avatar/' + (index % 10) + '.jpeg';
    });
    const columns = [
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
        поле: 'пользовательскийer имя',
        заголовок: 'пользовательскийer',
        ширина: 'авто',
        иконка: {
          тип: 'imвозраст',
          src: 'avatar',
          имя: 'avatar_pic',
          shape: 'circle',
          //定义文本内容行内图标，第一个字符展示
          ширина: 30, // необязательный
          высота: 30,
          positionType: Vтаблица.TYPES.иконкаPosition.contentLeft,
          marginRight: 20,
          marginLeft: 0,
          cursor: 'pointer'
        }
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: 'авто',
        headerиконка: [
          {
            имя: 'question',
            тип: 'svg',
            marginLeft: 10,
            positionType: Vтаблица.TYPES.иконкаPosition.contentRight,
            ширина: 20,
            высота: 20,
            svg: `<svg t="1706853751091" class="иконка" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4226" ширина="200" высота="200"><path d="M533.333333 85.333333c-247.426667 0-448 200.573333-448 448s200.573333 448 448 448 448-200.573333 448-448-200.573333-448-448-448z m0 853.333334c-223.86 0-405.333333-181.473333-405.333333-405.333334s181.473333-405.333333 405.333333-405.333333 405.333333 181.473333 405.333334 405.333333-181.473333 405.333333-405.333334 405.333334z m21.333334-192a21.333333 21.333333 0 1 1-21.333334-21.333334 21.333333 21.333333 0 0 1 21.333334 21.333334z m-21.333334-85.333334a21.333333 21.333333 0 0 1-21.333333-21.333333v-42.666667a21.333333 21.333333 0 0 1 6.246667-15.086666c13.1-13.093333 28.9-24.886667 45.633333-37.333334C601.333333 516.966667 640 488.1 640 448c0-58.813333-47.853333-106.666667-106.666667-106.666667s-106.666667 47.853333-106.666666 106.666667a21.333333 21.333333 0 0 1-42.666667 0 149.333333 149.333333 0 0 1 298.666667 0c0 28.113333-10.6 53.873333-32.406667 78.74-17.593333 20.046667-39.593333 36.466667-60.873333 52.34-12.666667 9.453333-24.76 18.473333-34.72 27.433333V640a21.333333 21.333333 0 0 1-21.333334 21.333333z" fill="#5C5C66" p-id="4227"></path></svg>`,
            Подсказка: {
              style: { arrowMark: true },
              // 气泡框，按钮的的解释信息
              заголовок: 'this is product имя',
              placement: Vтаблица.TYPES.Placement.право
            }
          }
        ]
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
        поле: 'null',
        заголовок: 'текст иконка',
        ширина: 'авто',
        иконка: ['текст-Кнопка', 'текст-Кнопка1']
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
      allowFrozenColCount: 3,
      frozenColCount: 1,
      rightFrozenColCount: 2
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
        } else if (targetиконка.имя === 'question') {
          const значение = таблицаInstance.getCellValue(col, row);
          window?.предупреждение?.('question: ' + значение);
        }
      }
    });
    let hoverиконкаKey;
    таблицаInstance.на('mousemove_cell', args => {
      console.log('mousemove_cell', args);
      const { col, row, targetиконка } = args;
      if (targetиконка) {
        const key = `${col}-${row}-${targetиконка?.имя}`;
        if (targetиконка?.имя === 'order') {
          if (hoverиконкаKey !== key) {
            hoverиконкаKey = key;
            таблицаInstance.showПодсказка(col, row, {
              content: 'Нажать к Copy：' + таблицаInstance.getCellValue(col, row),
              referencePosition: { rect: targetиконка.позиция, placement: Vтаблица.TYPES.Placement.право }, //TODO
              style: {
                bgColor: 'black',
                цвет: 'white',
                шрифт: 'normal bold normal 14px/1 STKaiti',
                arrowMark: true
              }
            });
          }
        } else if (targetиконка?.имя === 'avatar_pic') {
          if (hoverиконкаKey !== key) {
            hoverиконкаKey = key;
            const cellRange = таблицаInstance.getCellRelativeRect(col, row);
            const container = document.getElementById(CONTAINER_ID);
            const containerRect = container.getBoundingClientRect();
            // if (!таблицаInstance.isHeader(col, row)) {
            const record = таблицаInstance.getCellOriginRecord(col, row);
            showПодсказка(
              ['ID: ' + record['пользовательскийer ID'], 'имя: ' + record['пользовательскийer имя'], 'Город: ' + record['Город']],
              cellRange?.лево + containerRect.лево,
              cellRange?.низ + containerRect.верх
            );
          }
        } else {
          hideПодсказка();
        }
      } else {
        hoverиконкаKey = '';
        hideПодсказка();
      }
    });
  });
```
