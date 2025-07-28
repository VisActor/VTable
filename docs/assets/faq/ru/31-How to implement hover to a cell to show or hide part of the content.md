---
заголовок: Vтаблица usвозраст issue: How к implement навести к a cell к показать или скрыть part из the content</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к implement навести к a cell к показать или скрыть part из the content</br>


## Problem description

When you want к навести the mouse over a cell, показать или скрыть некоторые elements (иконкаs, текст, etc.) в the cell.</br>


## Solution

Вы можете use [пользовательскиймакет ](https%3A%2F%2Fwww.visactor.io%2Fvтаблица%2Fguide%2Fпользовательский_define%2Fпользовательский_макет)к do this: списокen к the `onMouseEnter `и `onMouseLeave `событиеs на the container `Group `, и set the corresponding primitive к показать или скрыть в the событие обратный вызов.</br>


## код пример

```
const option = {
  columns: [
    {
      заголовок: 'имя',
      поле: 'имя',
    },
    {
      заголовок: 'пользовательский',
      поле: 'пользовательский',
      ширина: 120,
      пользовательскиймакет: (args) => {
        const { высота, ширина } = args.rect;
        const container = (
          <VGroup
            attribute={{
              id: 'container',
              ширина,
              высота,
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap'
            }}
            onMouseEnter={(событие) => {
              // 查找图元
              const hoverShowText = событие.currentTarget.find(child => {
                возврат child.attribute.id === 'навести-cell-показать';
              }, true);
              // 更新图元
              hoverShowText.setAttribute('opaГород', 1);
              // 查找图元
              const hoverHideText = событие.currentTarget.find(child => {
                возврат child.attribute.id === 'навести-cell-скрыть';
              }, true);
              hoverHideText.setAttribute('opaГород', 0);
              событие.currentTarget.stвозраст.renderNextFrame();
            }}
            onMouseLeave={событие => {
              // 查找图元
              const hoverShowText = событие.currentTarget.find(child => {
                возврат child.attribute.id === 'навести-cell-показать';
              }, true);
              // 更新图元
              hoverShowText.setAttribute('opaГород', 0);
              // 查找图元
              const hoverHideText = событие.currentTarget.find(child => {
                возврат child.attribute.id === 'навести-cell-скрыть';
              }, true);
              // 更新图元
              hoverHideText.setAttribute('opaГород', 1);
              событие.currentTarget.stвозраст.renderNextFrame();
            }}
          >
            <VText
              attribute={{
                id: 'навести-cell-показать',
                текст: 'навести cell показать',
                fill: '#000',
                boundsPadding: [0, 0, 5, 0],
                opaГород: 0,
              }}
            ></VText>
            <VText
              attribute={{
                id: 'навести-cell-скрыть',
                текст: 'навести cell скрыть',
                fill: '#000',
                boundsPadding: [0, 0, 5, 0],
              }}
            ></VText>
          </VGroup>
        );

        возврат {
            rootContainer: container,
            renderDefault: false
        };
      }
    }
  ],
  records:данные,
}

const таблицаInstance = новый Vтаблица.списоктаблица(container, option);</br>
```
## Results показать

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/PyaGbK31PoBxOGxQWkxci1T3nKb.gif' alt='' ширина='424' высота='504'>



Full sample код (Вы можете try pasting it into the [editor ](https%3A%2F%2Fwww.visactor.io%2Fvтаблица%2Fдемонстрация%2Fтаблица-тип%2Fсписок-таблица-tree)):</br>
```
const { VGroup, VText } = Vтаблица;
const данные = [
  {
    имя: '1',
    пользовательский: '1',
  },
  {
    имя: '2',
    пользовательский: '2',
  },
  {
    имя: '3',
    пользовательский: '3',
  },
  {
    имя: '4',
    пользовательский: '4',
  },
  {
    имя: '5',
    пользовательский: '5',
  },
]
const option = {
  columns: [
    {
      заголовок: 'имя',
      поле: 'имя',
    },
    {
      заголовок: 'пользовательский',
      поле: 'пользовательский',
      ширина: 120,
      пользовательскиймакет: (args) => {
        const { высота, ширина } = args.rect;
        const container = (
          <VGroup
            attribute={{
              id: 'container',
              ширина,
              высота,
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap'
            }}
            onMouseEnter={(событие) => {
              const hoverShowText = событие.currentTarget.find(child => {
                возврат child.attribute.id === 'навести-cell-показать';
              }, true);
              hoverShowText.setAttribute('opaГород', 1);
              const hoverHideText = событие.currentTarget.find(child => {
                возврат child.attribute.id === 'навести-cell-скрыть';
              }, true);
              hoverHideText.setAttribute('opaГород', 0);
              событие.currentTarget.stвозраст.renderNextFrame();
            }}
            onMouseLeave={событие => {
              const hoverShowText = событие.currentTarget.find(child => {
                возврат child.attribute.id === 'навести-cell-показать';
              }, true);
              hoverShowText.setAttribute('opaГород', 0);
              const hoverHideText = событие.currentTarget.find(child => {
                возврат child.attribute.id === 'навести-cell-скрыть';
              }, true);
              hoverHideText.setAttribute('opaГород', 1);
              событие.currentTarget.stвозраст.renderNextFrame();
            }}
          >
            <VText
              attribute={{
                id: 'навести-cell-показать',
                текст: 'навести cell показать',
                fill: '#000',
                boundsPadding: [0, 0, 5, 0],
                opaГород: 0,
              }}
            ></VText>
            <VText
              attribute={{
                id: 'навести-cell-скрыть',
                текст: 'навести cell скрыть',
                fill: '#000',
                boundsPadding: [0, 0, 5, 0],
              }}
            ></VText>
          </VGroup>
        );

        возврат {
            rootContainer: container,
            renderDefault: false
        };
      }
    }
  ],
  records:данные,
}

const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);</br>
```
## Related Documents

Related апи: https://www.visactor.io/vтаблица/guide/пользовательский_define/пользовательский_макет</br>
github：https://github.com/VisActor/Vтаблица</br>



