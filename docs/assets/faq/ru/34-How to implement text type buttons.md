---
заголовок: Vтаблица usвозраст issue: How к implement текст тип Кнопкаs</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к implement текст тип Кнопкаs</br>


## Problem description

Hope к display текст тип Кнопкаs в the cell, Нажать к operate.</br>


## Solution

Вы можете use the `пользовательскиймакет `feature к пользовательскийize Кнопка elements и bind corresponding событиеs</br>


## код пример

```
import {createGroup, createText} от '@visactor/vтаблица/es/vrender';

  const опция: Vтаблица.списоктаблицаConstructorOptions = {
    columns: [
      // ......
      {
        поле: 'worksCount',
        заголовок: 'operation',
        ширина: 110,
        пользовательскиймакет: (args: Vтаблица.TYPES.пользовательскийRenderFunctionArg) => {
          const { таблица, row, col, rect } = args;
          const { высота, ширина } = rect ?? таблица.getCellRect(col, row);

          const container = createGroup({
            высота,
            ширина,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          });

          const editText = createText({
            текст: '编辑',
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: '#2440b3', // #315efb
            boundsPadding: [10, 0, 0, 10],
            underline: 0,
            cursor: 'pointer'
          });
          editText.stateProxy = (stateимя: строка) => {
            if (stateимя === 'навести') {
              возврат {
                fill: '#315efb',
                underline: 1
              };
            }
          };
          editText.addсобытиесписокener('mouseenter', e => {
            editText.addState('навести', true, false);
            таблица.scenegraph.updateNextFrame();
          });
          editText.addсобытиесписокener('mouseleave', e => {
            editText.removeState('навести', false);
            таблица.scenegraph.updateNextFrame();
          });
          editText.addсобытиесписокener('Нажать', e => {
            console.log('edit Нажать');
          });
          container.add(editText);

          возврат {
            rootContainer: container,
            renderDefault: false
          };
        }
      }
    ],
    // ......
  };</br>
```
## Results показать

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/UK7fbpamQorpNnxaMjtcO3Genpe.gif' alt='' ширина='384' высота='564'>



Complete sample код (Вы можете try pasting it into the [editor ](https%3A%2F%2Fwww.visactor.io%2Fvтаблица%2Fдемонстрация%2Fтаблица-тип%2Fсписок-таблица-tree)):</br>
```
import {createGroup, createText} от '@visactor/vтаблица/es/vrender';

  const option = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        поле: 'bloggerId',
        заголовок: 'index'
      },
      {
        поле: 'worksCount',
        заголовок: 'operation',
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold'
        },
        ширина: 110,
        пользовательскиймакет: (args) => {
          const { таблица, row, col, rect } = args;
          const { высота, ширина } = rect ?? таблица.getCellRect(col, row);

          const container = createGroup({
            высота,
            ширина,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          });

          const editText = createText({
            текст: '编辑',
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: '#2440b3', // #315efb
            boundsPadding: [10, 0, 0, 10],
            underline: 0,
            cursor: 'pointer'
          });
          editText.stateProxy = (stateимя) => {
            if (stateимя === 'навести') {
              возврат {
                fill: '#315efb',
                underline: 1
              };
            }
          };
          editText.addсобытиесписокener('mouseenter', e => {
            editText.addState('навести', true, false);
            таблица.scenegraph.updateNextFrame();
          });
          editText.addсобытиесписокener('mouseleave', e => {
            editText.removeState('навести', false);
            таблица.scenegraph.updateNextFrame();
          });
          editText.addсобытиесписокener('Нажать', e => {
            console.log('edit Нажать');
          });
          container.add(editText);

          const deleteText = createText({
            текст: '删除',
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: '#2440b3', // #315efb
            boundsPadding: [10, 0, 0, 10],
            underline: 0,
            cursor: 'pointer'
          });
          deleteText.stateProxy = (stateимя) => {
            if (stateимя === 'навести') {
              возврат {
                fill: '#315efb',
                underline: 1
              };
            }
          };
          deleteText.addсобытиесписокener('mouseenter', e => {
            deleteText.addState('навести', true, false);
            таблица.scenegraph.updateNextFrame();
          });
          deleteText.addсобытиесписокener('mouseleave', e => {
            deleteText.removeState('навести', false);
            таблица.scenegraph.updateNextFrame();
          });
          deleteText.addсобытиесписокener('Нажать', e => {
            console.log('delete Нажать');
          });
          container.add(deleteText);

          возврат {
            rootContainer: container,
            renderDefault: false
          };
        }
      }
    ],
    records: [
      {
        bloggerId: 1,
      },
      {
        bloggerId: 2,
      },
      {
        bloggerId: 3,
      },
      {
        bloggerId: 4,
      },
      {
        bloggerId: 5,
      },
      {
        bloggerId: 6,
      }
    ],
    defaultRowвысота: 40
  };

  const instance = новый Vтаблица.списоктаблица(option);</br>
```
## Related Documents

Related апи: https://www.visactor.io/vтаблица/guide/пользовательский_define/пользовательский_макет</br>
github：https://github.com/VisActor/Vтаблица</br>



