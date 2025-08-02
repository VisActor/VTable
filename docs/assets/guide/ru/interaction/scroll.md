# таблица scrolling

в the process из данные analytics, a large amount из данные is usually displayed в the таблица. в order к display more данные content в the same time и provide a better данные query body, the scrolling функция is particularly important. по scrolling, users can quickly find the desired content в the таблица и perform subsequent analysis и processing.

## Rolling Производительность advantвозраст

The underlying layer из Vтаблица is rendered based на canvas, и only the visual Регион content is drawn с каждый update, ensuring smooth scrolling even when working с big данные.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090d.gif)

## прокрутка style

Vтаблица provides rich прокрутка style configuration items, и users can пользовательскийize the текущий прокрутка bar style according к their own needs. Configure the прокрутка bar style through списоктаблица.тема.scrollStyle. Следующий are the details из the прокрутка style configuration:

- scrollRailColor: Configure the цвет из the scrollbar track.
- scrollSliderColor: Configure the цвет из the прокрутка bar ползунок.
- scrollSliderCornerRadius: The corner radius из the прокрутка bar ползунок
- ширина: Configure the прокрутка bar ширина.
- видимый: Configure whether the прокрутка bar is видимый, и can be configured с values: 'always' | 'scrolling' | 'никто' | 'фокус', which correspond к: resident display | display when scrolling | display | фокус на the canvas. по умолчанию is'scrolling '.
- hoverOn: Specifies whether the прокрутка bar is suspended на the container или independent из the container. The по умолчанию is true к float на the container.
- barToSide: Whether к display к the edge из the container even though the contents are не full. по умолчанию false

Below we показать the effect из these configurations с an пример:

```javascript liveдемонстрация  template=vтаблица
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
      records: данные,
      columns,
      ширинаMode: 'standard',
      тема: {
        scrollStyle: {
          видимый: 'always',
          scrollSliderColor: 'purple',
          scrollRailColor: '#bac3cc',
          hoverOn: false,
          barToSide: true
        }
      }
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```

## прокрутка horizontally

Vтаблица supports horizontal scrolling while holding down the Shift key, или directly dragging the horizontal прокрутка bar к make it easier для users к browse таблица данные. из course, if your computer has a touchpad, Вы можете swipe лево и право directly на the touchpad к achieve horizontal scrolling.

## прокрутка интерфейс

Vтаблица provides the scrollToCell интерфейс для scrolling к the specified cell location. The method accepts the cellAddr параметр к specify the cell location к прокрутка к. пример код is as follows:

```javascript
таблица.scrollToCell({ row: 20, col: 10 });
```

в the above пример, we will прокрутка к the cell позиция с row число 20 и column число 10.

## Turn off browser по умолчанию behavior

The browser по умолчанию behavior can be turned off through the overscrollBehavior attribute из the configuration item, as shown в Следующий configuration instructions:

```
  /**
   * 'авто': Trigger the browser's по умолчанию behavior when the таблица scrolls к the верх или низ;
   * 'никто': When the таблица scrolls к the верх или низ, the browser's по умолчанию behavior will не be triggered, that is, when the таблица scrolls к the boundary и continues к прокрутка, it will не trigger the scrolling из the parent pвозраст.
   * */
  overscrollBehavior?: 'авто' | 'никто';
```

на a Mac computer, it sometimes appears that 'никто' has been set, but the browser's по умолчанию scrolling is still triggered (such as a rubber band effect или a pвозраст rollback is triggered).

<div style="display: flex;">
 <div style="ширина: 20%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/прокрутка-bounce.gif" />
  </div>
  <div style="ширина: 10%; текст-align: центр;">
  </div>
  <div style="ширина: 20%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/прокрутка-back.jpeg" />
  </div>
</div>

This problem may be because the browser's по умолчанию behavior is triggered outside the таблица, и the effect continues when scrolling в the таблица. в order к avoid this problem, Вы можете set the css прокрутка bar style в the pвозраст body (и cooperate с Vтаблица The overscrollBehavior is configured с two layers для restrictions):

```
"overscroll-behavior: никто;"
```

для specific instructions, please refer к: https://developer.mozilla.org/zh-CN/docs/Web/CSS/overscroll-behavior
