# Подсказка Introduction

в таблица компонентs, a Подсказка is a common user интерфейс element used к provide additional information about a specific таблица cell или данные. It appears as a small pop-up window или floating box that displays relevant prompt текст when the user hovers over a specific cell или interacts с a specific element.

## Подсказка usвозраст scenarios

- данные interpretation и description: данные в некоторые таблицаs may require additional interpretation или description. Подсказка can be used к display these interpretations к help users understand the meaning, units, calculation методы или other relevant information из the данные.

- Overflow content: When the текст или данные в the таблица exceeds the ширина из the cell, Вы можете use Подсказка к display the full content к prсобытие truncation или скрыть important information.

- Description из Interactive Elements: If the таблица contains interactive elements (such as links, Кнопкаs, или иконкаs), Подсказка can be used к provide functional descriptions или action hints для those elements.

## Introduction к configuration items

The configuration items are:

    {
      /** 提示弹框的相关配置。消失时机：显示后鼠标移动到指定区域外或者进入新的单元格后自动消失*/
      Подсказка: {
        /** 渲染方式：如使用html具有较好灵活行，上层可以覆盖样式；canvas具有较好的跨平台展示稳定性 */
        renderMode: 'html' | 'canvas';
        /** 代替原来hover:isShowПодсказка配置 */
        isShowOverflowTextПодсказка: логический;
        /** 弹框是否需要限定在表格区域内 */
        confine: логический;
      };
    }

## Подсказка prompt box style settings

The style configuration из Подсказка can be set through тема.ПодсказкаStyle. The specific configuration is as follows:

```
export тип ПодсказкаStyle = {
  fontFamily?: строка;
  fontSize?: число;
  цвет?: строка;
  заполнение?: число[];
  bgColor?: строка;
  maxширина?: число;
  maxвысота?: число;
};

```

## включить overflow content prompt

по по умолчанию, Vтаблица enables the Подсказка из overflow content: isShowOverflowTextПодсказка defaults к true. If you need к delay disappearance so that the mouse can move к the Подсказка content, Вы можете configure overflowTextПодсказкаDisappearDelay.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c8170e.gif)

## пользовательский иконка навести prompt

для пример, the configuration из the таблица header иконка is as follows:

```
const таблицаInstance = новый Vтаблица.списоктаблица({
  columns: [
    {
      поле: 'orderID',
      заголовок: '订单编号',
      headerиконка: {
        тип: 'svg', //指定svg格式图标，其他还支持path，imвозраст
        svg: `<svg xmlns="http://www.w3.org/2000/svg" ширина="12" высота="12" viewBox="0 0 12 12" fill="никто">
        <path d="M1.29609 1C0.745635 1 0.444871 1.64195 0.797169 2.06491L4.64953 6.68988V9.81861C4.64953 9.89573 4.69727 9.9648 4.76942 9.99205L7.11236 10.877C7.27164 10.9372 7.4419 10.8195 7.4419 10.6492V6.68988L11.2239 2.06012C11.5703 1.63606 11.2685 1 10.721 1H1.29609Z" strхорошоe="#141414" strхорошоe-opaГород="0.65" strхорошоe-ширина="1.18463" strхорошоe-linejoin="round"/>
        </svg>`,
        ширина: 20,
        высота: 20,
        имя: 'filter', //定义图标的名称，在内部会作为缓存的key值
        positionType: Vтаблица.TYPES.иконкаPosition.absoluteRight, // 指定位置，可以在文本的前后，或者在绝对定位在单元格的左侧右侧
        visibleTime: 'mouseenter_cell', // 显示时机， 'always' | 'mouseenter_cell' | 'Нажать_cell'
        навести: {
          // 热区大小
          ширина: 26,
          высота: 26,
          bgColor: 'rgba(22,44,66,0.5)'
        },
        Подсказка: {
          style: { arrowMark: false },
          // 气泡框，按钮的的解释信息
          заголовок: '过滤',
          placement: Vтаблица.TYPES.Placement.право,
          disappearDelay: 1000,
        }
      }
    }
  ]
});
```

The Подсказка в headerиконка is the prompt box when the mouse hovers over the иконка. в the same time, disappearDelay is configured к delay the disappearance из the pop-up box so that the mouse can move к the Подсказка content.

для detailed information about иконка configuration, please refer к the tutorial: https://visactor.io/vтаблица/guide/пользовательский_define/пользовательский_иконка.

## Display Подсказка пользовательский information through the интерфейс

The интерфейс showПодсказка can actively display Подсказка information, which is used as follows: (списокen для cell навести событиеs, call the интерфейс)
[Reference интерфейс description](https://visactor.io/vтаблица/option/методы#showПодсказка)

      таблицаInstance.на('mouseenter_cell', (args) => {
            const { col, row, targetиконка } = args;
            if(col===0&&row>=1){
              const rect = таблицаInstance.getVisibleCellRangeRelativeRect({ col, row });
              таблицаInstance.showПодсказка(col, row, {
                content: 'ID Заказа：'+таблицаInstance.getCellValue(col,row),
                referencePosition: { rect, placement: Vтаблица.TYPES.Placement.право }, //TODO
                classимя: 'defineПодсказка',
                style: {
                  bgColor: 'black',
                  цвет: 'white',
                  шрифт: 'normal bold normal 14px/1 STKaiti',
                  arrowMark: true,
                },
                disappearDelay: 100,
              });
            }
        });

Effect:
![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/ffc3a9b5518762d274121ff05.gif)

## иконка Подсказка configuration

When пользовательскийizing the иконка, Вы можете display the prompt information по configuring the Подсказка as follows:

```
Vтаблица.регистрация.иконка('order', {
  ... //其他配置
  Подсказка: {
    // 气泡框，按钮的的解释信息
    заголовок:'ID Заказа is the unique identifier для каждый order',
    style: {
      fontSize: 14,
      fontFamily: 'Arial',
      заполнение: [10,10,10,10],
      bgColor: 'black',
      arrowMark: true,
      цвет: 'white',
      maxвысота: 100,
      maxширина: 200
    },
    disappearDelay: 1000
  }
})
```
