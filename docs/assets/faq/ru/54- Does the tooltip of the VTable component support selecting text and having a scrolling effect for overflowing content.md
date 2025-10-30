---
заголовок: 32. Does the Подсказка из the Vтаблица компонент support selecting текст и having a scrolling effect для overflowing content?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Problem Title

Does the Подсказка из the Vтаблица компонент support selecting текст и having a scrolling effect для overflowing content?</br>
## Problem Description

I utilized the Подсказка feature из the Vтаблица компонент, which means when the cell content is too long, a Подсказка will appear when the mouse hovers over the cell.</br>
However, I found that the content из this Подсказка cannot be selected because when the mouse leaves the cell и tries к move к the Подсказка, the Подсказка disappears и it is impossible к move the mouse over it. Also, when the content is too long, the Подсказка will be stretched very large, resulting в an ugly effect. I hope that when the content is very long, I can прокрутка through it. Can Vтаблица achieve the effect I need?</br>
## Solution

Vтаблица provides a configuration solution к this problem. первый, normally, as soon as the mouse leaves the cell с the overflowing текст, the `Подсказка` disappears immediately, making it impossible к move the mouse к the Подсказка. Therefore, a новый configuration called `overflowTextПодсказкаDisappearDelay` is added к the Подсказка configuration к delay the disappearance из the Подсказка. After configuring this, the mouse has enough time к move к the Подсказка, thus solving the need к выбрать и copy текст. (The usвозраст из Подсказкаs для иконкаs is similar!)</br>
```
  /** Подсказка相关配置 */
  Подсказка?: {
    /** html目前实现较完整 先默认html渲染方式 */
    renderMode?: 'html'; // 目前暂不支持canvas方案
    /**  Whether к показать the thumbnail Подсказка. Instead из the original навести:isShowПодсказка configuration, it is temporarily necessary к set the renderMode configuration к html в order к display it. canvas has не been developed yet.*/
    isShowOverflowTextПодсказка?: логический;
*** /** Abbreviation текст prompt box delayed disappearance time **/***
**    overflowTextПодсказкаDisappearDelay?: число;**
    /** 是否将 Подсказка 框限制在画布区域内，默认开启。针对renderMode:"html"有效 */
    confine?: логический;
  };</br>
```
к limit the размер из a Подсказка pop-up box, Вы можете configure it в the style из the Подсказка. The specific style definition is as follows:</br>
```
/**
 * Bubble box, Кнопка explanation information
 */
export тип ПодсказкаStyle = {
  fontFamily?: строка;
  fontSize?: число;
  цвет?: строка;
  заполнение?: число[];
  bgColor?: строка;
**  maxширина?: число;**
**  maxвысота?: число;**
};</br>
```
Configure it по putting it в the тема.</br>
```
const option={
   Подсказка: {
      renderMode: 'html',
      isShowOverflowTextПодсказка: true,
      overflowTextПодсказкаDisappearDelay: 1000
    },
    тема:{
        ПодсказкаStyle:{
            **maxширина：200，**
            **maxвысота：100**
        }
    }
}</br>
```


## код примеры

Вы можете paste it into the official editor для testing:</br>
https://visactor.io/vтаблица/демонстрация/компонент/Подсказка</br>
```
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
        ширина: '200'
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
      Подсказка: {
        renderMode: 'html',
        isShowOverflowTextПодсказка: true,
        overflowTextПодсказкаDisappearDelay: 1000
      },
      тема:{
          ПодсказкаStyle:{
              maxширина:200,
              maxвысота:60
          }
      }
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;

  });</br>
```
## Result Presentation

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Dx0ibyoBrouD0xxZykIco2CCnTe.gif' alt='' ширина='1512' высота='1092'>

## Related Документация

Related апи: https://www.visactor.io/vтаблица/апи/методы#showПодсказка</br>
Tutorial: https://www.visactor.io/vтаблица/guide/компонентs/Подсказка</br>
github：https://github.com/VisActor/Vтаблица</br>



