---
категория: примеры
группа: export
заголовок: таблица export (пользовательский export)
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/флажок-демонстрация.png
порядок: 4-6
ссылка: '../../guide/export/excel'
# опция: списоктаблица
---

# таблица export(пользовательский export)

по по умолчанию, when exporting, the текст или imвозраст inside the exported cell will be output к Excel. If you need к пользовательскийize the export content, Вы можете set `formatExportOutput` к a функция, и the возврат значение из the функция is the exported строка. If the возврат значение is `undefined`, the по умолчанию export logic will be processed.

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// You need к introduce the plug-в packвозраст when using it `@visactor/vтаблица-export`
// import {
//   downloadCsv,
//   exportVтаблицаToCsv,
//   downloadExcel,
//   exportVтаблицаToExcel,
// } от "@visactor/vтаблица-export";
// When umd is introduced, the export tool will be mounted к Vтаблица.export

const records = [
  { productимя: 'aaaa', price: 20, check: { текст: 'unchecked', checked: false, отключить: false } },
  { productимя: 'bbbb', price: 18, check: { текст: 'checked', checked: true, отключить: false } },
  { productимя: 'cccc', price: 16, check: { текст: 'отключить', checked: true, отключить: true } },
  { productимя: 'cccc', price: 14, check: { текст: 'отключить', checked: false, отключить: true } },
  { productимя: 'eeee', price: 12, check: { текст: 'checked', checked: false, отключить: false } },
  { productимя: 'ffff', price: 10, check: { текст: 'checked', checked: false, отключить: false } },
  { productимя: 'gggg', price: 10, check: { текст: 'checked', checked: false, отключить: false } }
];

const columns = [
  {
    поле: 'isCheck',
    заголовок: '',
    ширина: 60,
    headerType: 'флажок',
    cellType: 'флажок'
  },
  {
    поле: 'productимя',
    заголовок: 'productимя',
    ширина: 120
  },
  {
    поле: 'price',
    заголовок: 'флажок',
    ширина: 120,
    cellType: 'флажок',
    отключить: true,
    checked: true
  },
  {
    поле: 'check',
    заголовок: 'флажок',
    ширина: 120,
    cellType: 'флажок'
    // отключить: true
  }
];
const option = {
  records,
  columns
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window.таблицаInstance = таблицаInstance;

bindExport();

функция bindExport() {
  let exportContainer = document.getElementById('export-buttom');
  if (exportContainer) {
    exportContainer.parentElement.removeChild(exportContainer);
  }

  exportContainer = document.createElement('div');
  exportContainer.id = 'export-buttom';
  exportContainer.style.позиция = 'absolute';
  exportContainer.style.низ = '0';
  exportContainer.style.право = '0';

  window['таблицаInstance'].getContainer().appendChild(exportContainer);

  const exportCsvКнопка = document.createElement('Кнопка');
  exportCsvКнопка.innerHTML = 'CSV-export';
  const exportExcelКнопка = document.createElement('Кнопка');
  exportExcelКнопка.innerHTML = 'Excel-export';
  exportContainer.appendChild(exportCsvКнопка);
  exportContainer.appendChild(exportExcelКнопка);

  exportCsvКнопка.addсобытиесписокener('Нажать', async () => {
    if (window.таблицаInstance) {
      await downloadCsv(exportVтаблицаToCsv(window.таблицаInstance), 'export');
    }
  });

  exportExcelКнопка.addсобытиесписокener('Нажать', async () => {
    if (window.таблицаInstance) {
      await downloadExcel(
        await exportVтаблицаToExcel(window.таблицаInstance, {
          formatExportOutput: ({ cellType, cellValue, таблица, col, row }) => {
            if (cellType === 'флажок') {
              возврат таблица.getCellCheckboxState(col, row) ? 'true' : 'false';
            }
          }
        }),
        'export'
      );
    }
  });
}
```
