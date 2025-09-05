---
заголовок: 4.  How к use the право-Нажать меню к copy, paste и delete cells в Vтаблица?</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Title

How к use the право-Нажать меню к copy, paste и delete cells в Vтаблица?</br>
## Description

Currently, ctrl+c is supported для copying и ctrl+v для pasting. However, в our project requirements, we expect к use the право-Нажать меню к copy, paste, и delete cell values, but we don't know how к implement this capability.</br>
## Solution

списокen к the событие `dropdown_меню_Нажать` к determine the Нажатьed меню item.</br>
Get the content к be copied through the vтаблица интерфейс `getCopyValue`, и when pasting it into the таблица, investigate the интерфейс `changeCellValues` к set the значение к the cell.</br>
к delete the selected content, you need к get the selected cells through the `getSelectedCellInfos` интерфейс, и then assign the значение к empty для каждый cell through the `changeCellValue` интерфейс.</br>
Related интерфейс addresses:</br>
[https://visactor.io/vтаблица/апи/методы#getSelectedCellInfos](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fапи%2Fметоды%23getSelectedCellInfos)
[https://visactor.io/vтаблица/апи/методы#changeCellValue](https%3A%2F%2Fvisactor.io%2Fvтаблица%2Fапи%2Fметоды%23changeCellValue)</br>
## код пример

```
const option = {
  меню: {
    contextменюItems: ['copy', 'paste', 'delete', '...']
  }
  ...
}

const таблицаInstance = новый Vтаблица.списоктаблица(container, option);

    let copyданные;
    таблицаInstance.на('dropdown_меню_Нажать', args => {
      console.log('dropdown_меню_Нажать', args);
      if (args.менюKey === 'copy') {
        copyданные = таблицаInstance.getCopyValue();
      } else if (args.менюKey === 'paste') {
        const rows = copyданные.split('\n'); // 将数据拆分为行
        const values = [];
        rows.forEach(функция (rowCells, rowIndex) {
          const cells = rowCells.split('\t'); // 将行数据拆分为单元格
          const rowValues = [];
          values.push(rowValues);
          cells.forEach(функция (cell, cellIndex) {
            // 去掉单元格数据末尾的 '\r'
            if (cellIndex === cells.length - 1) {
              cell = cell.trim();
            }
            rowValues.push(cell);
          });
        });
        таблицаInstance.changeCellValues(args.col, args.row, values);
      } else if (args.менюKey === 'delete') {
        let selectCells = таблицаInstance.getSelectedCellInfos();
        if (selectCells?.length > 0 && cellIsSelectRange(args.col, args.row, selectCells)) {
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
    }
    // 判断单元格col,row是否在选中范围中
    функция cellIsSelectRange(col, row, selectCells) {
      для (let i = 0; i < selectCells.length; i++) {
        для (let j = 0; j < selectCells[i].length; j++) {
          if (selectCells[i][j].col === col && selectCells[i][j].row === row) {
            возврат true;
          }
        }
      }
      возврат false;
    }
  });</br>
```
## Results

Online effect reference: https://visactor.io/vтаблица/демонстрация/interaction/context-меню</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Sхорошо8bkNyLo4CLCx0PcvcvQEfnSh.gif' alt='' ширина='680' высота='406'>

## Related Documents

право-Нажать меню Copy Paste Delete демонстрация：https://visactor.io/vтаблица/демонстрация/interaction/context-меню</br>
выпадающий список меню tutorial：https://visactor.io/vтаблица/guide/компонентs/выпадающий список</br>
Related апи：https://visactor.io/vтаблица/option/списоктаблица#меню.contextменюItems</br>
github：https://github.com/VisActor/Vтаблица</br>



