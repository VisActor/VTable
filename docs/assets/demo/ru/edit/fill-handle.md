---
категория: примеры
группа: edit
заголовок: fill handle
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/fill-handle.gif
ссылка: edit/fill-handle
опция: списоктаблица#excelOptions.fillHandle
---

# Fill Handle

When a cell is selected, a fill handle will appear above the cell, и Вы можете перетаскивание the fill handle к edit the cell's значение. или double-Нажать the fill handle к change the значение из the cell you want к edit (This пример does не implement this logic).

## Ключевые Конфигурации

-`списоктаблица.excelOptions.fillHandle`

## код демонстрация

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
      excelOptions: {
        fillHandle: true
      }
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
    // 记录 拖拽填充柄之前的选中范围
    let beforeDragMaxCol;
    let beforeDragMinCol;
    let beforeDragMaxRow;
    let beforeDragMinRow;
    таблицаInstance.на('mousedown_fill_handle', arg => {
      const startSelectCellRange = таблицаInstance.getSelectedCellRanges()[0];
      beforeDragMaxCol = Math.max(startSelectCellRange.начало.col, startSelectCellRange.конец.col);
      beforeDragMinCol = Math.min(startSelectCellRange.начало.col, startSelectCellRange.конец.col);
      beforeDragMaxRow = Math.max(startSelectCellRange.начало.row, startSelectCellRange.конец.row);
      beforeDragMinRow = Math.min(startSelectCellRange.начало.row, startSelectCellRange.конец.row);
      console.log('mousedown_fill_handle', beforeDragMinCol, beforeDragMinRow, beforeDragMaxCol, beforeDragMaxRow);
    });
    таблицаInstance.на('drag_fill_handle_end', arg => {
      console.log('drag_fill_handle_end', arg);

      const direciton = arg.direction;
      let startChangeCellCol;
      let startChangeCellRow;
      let endChangeCellCol;
      let endChangeCellRow;
      const endSelectCellRange = таблицаInstance.getSelectedCellRanges()[0];
      //根据填充方向 确定需要填充值的范围
      if (direciton === 'низ') {
        startChangeCellCol = beforeDragMinCol;
        startChangeCellRow = beforeDragMaxRow + 1;
        endChangeCellCol = beforeDragMaxCol;
        endChangeCellRow = endSelectCellRange.конец.row;
      } else if (direciton === 'право') {
        startChangeCellCol = beforeDragMaxCol + 1;
        startChangeCellRow = beforeDragMinRow;
        endChangeCellCol = endSelectCellRange.конец.col;
        endChangeCellRow = beforeDragMaxRow;
      } else if (direciton === 'верх') {
        startChangeCellCol = beforeDragMinCol;
        startChangeCellRow = beforeDragMinRow - 1;
        endChangeCellCol = beforeDragMaxCol;
        endChangeCellRow = endSelectCellRange.конец.row;
      } else if (direciton === 'лево') {
        startChangeCellCol = beforeDragMinCol - 1;
        startChangeCellRow = beforeDragMinRow;
        endChangeCellCol = endSelectCellRange.конец.col;
        endChangeCellRow = beforeDragMaxRow;
      }
      changeтаблицаValues(startChangeCellCol, startChangeCellRow, endChangeCellCol, endChangeCellRow);
    });
    таблицаInstance.на('dblНажать_fill_handle', arg => {
      console.log('dblНажать_fill_handle');
    });

    функция changeтаблицаValues(startChangeCellCol, startChangeCellRow, endChangeCellCol, endChangeCellRow) {
      const startCol = Math.min(startChangeCellCol, endChangeCellCol);
      const startRow = Math.min(startChangeCellRow, endChangeCellRow);
      const endCol = Math.max(startChangeCellCol, endChangeCellCol);
      const endRow = Math.max(startChangeCellRow, endChangeCellRow);
      const values = [];
      для (let row = startRow; row <= endRow; row++) {
        const rowValues = [];
        для (let col = startCol; col <= endCol; col++) {
          rowValues.push(`col-row:${col}-${row}`);
        }
        values.push(rowValues);
      }
      таблицаInstance.changeCellValues(startCol, startRow, values);
    }
  });
```
