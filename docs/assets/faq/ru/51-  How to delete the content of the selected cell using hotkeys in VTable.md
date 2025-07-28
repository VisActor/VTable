---
заголовок: 29.  How к delete the content из the selected cell using hotkeys в Vтаблица?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question Title

How к delete the content из the selected cell using hotkeys в Vтаблица?</br>
## Question Description

We have implemented the ediтаблица таблица business scenario using the editing capabilities provided по Vтаблица. However, there is a requirement к delete the content из the selected cell when the delete key или backspace key is pressed на the keyboard.</br>
## Solution

Currently, Vтаблица itself does не support this feature. Вы можете implement it yourself по списокening для keyboard событиеs и calling the Vтаблица интерфейс к update cell values.</br>
первый, списокen для the `keydown` событие и call the `changeCellValue` интерфейс к update cell values в the событие.</br>
See the демонстрация для implementation logic: [https://visactor.io/vтаблица/демонстрация/interaction/context-меню](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Finteraction%2Fcontext-меню).</br>
```
    // 监听键盘事件
    document.addсобытиесписокener('keydown', (e) => {
       if (e.key === 'Delete'||e.key === 'Backspace') {
         let selectCells = таблицаInstance.getSelectedCellInfos();
        if (selectCells?.length > 0) {
          // 如果选中的是范围，则删除范围内的所有单元格
          deleteSelectRange(selectCells);
        } else {
          // 否则只删除单个单元格
          таблицаInstance.changeCellValue(args.col, args.row, '');
        }
      }
    });
    //将选中单元格的值设置为空
    функция deleteSelectRange(selectCells) {
      для (let i = 0; i < selectCells.length; i++) {
        для (let j = 0; j < selectCells[i].length; j++) {
          таблицаInstance.changeCellValue(selectCells[i][j].col, selectCells[i][j].row, '');
        }
      }
    }</br>
```
## код примеры

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
      меню: {
        contextменюItems: ['copy', 'paste', 'delete', '...']
      }
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;

    // 监听键盘事件
    document.addсобытиесписокener('keydown', (e) => {
      debugger
       if (e.key === 'Delete'||e.key === 'Backspace') {
         let selectCells = таблицаInstance.getSelectedCellInfos();
        if (selectCells?.length > 0 ) {
          // 如果选中的是范围，则删除范围内的所有单元格
          deleteSelectRange(selectCells);
        } else {
          // 否则只删除单个单元格
          таблицаInstance.changeCellValue(args.col, args.row, '');
        }
      }
    });
  });

      //将选中单元格的值设置为空
    функция deleteSelectRange(selectCells) {
      для (let i = 0; i < selectCells.length; i++) {
        для (let j = 0; j < selectCells[i].length; j++) {
          таблицаInstance.changeCellValue(selectCells[i][j].col, selectCells[i][j].row, '');
        }
      }
    }
</br>
```


## Result Display

Вы можете copy the код к the official website's код editor и test the effect directly.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WUYfbtUTgozP9bxfjTMc8Zn4npf.gif' alt='' ширина='2304' высота='900'>

## Related documents

демонстрация из deleting данные: [https://visactor.io/vтаблица/демонстрация/interaction/context-меню](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fдемонстрация%2Finteraction%2Fcontext-меню)</br>
Tutorial из данные update: [https://visactor.io/vтаблица/guide/данные/данные_format](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fguide%2Fданные%2Fданные_format)</br>
Related апи:</br>
https://visactor.io/vтаблица/апи/методы#changeCellValue</br>
github：https://github.com/VisActor/Vтаблица</br>



