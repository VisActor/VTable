# Paste Add Row Plugin 

## Introduction

PasteAddRowColumnPlugin is a plugin written к extend the функция из adding rows и columns when the данные к be pasted is greater than the число из remaining rows и columns в a таблица.

This plugin списокens к the `PASTED_данные` событие из the `vтаблица` instance!

## Plugin Configuration

Configuration options для the row и column addition plugin:

```ts
export интерфейс AddRowColumnOptions {
  /**
   * обратный вызов функция для adding a column
   */
  addColumnCallback?: (col: число, vтаблица: Vтаблица.списоктаблица) => void;
  /**
   * обратный вызов функция для adding a row
   */
  addRowCallback?: (row: число, vтаблица: Vтаблица.списоктаблица) => void;
}
```

## Plugin пример
Initialize the plugin объект и add it к the plugins из the vтаблица configuration.

```
const pasteAddRowColumnPlugin = новый PasteAddRowColumnPlugin();
const option = {
  records,
  columns,
  заполнение: 30,
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true
  },
  plugins: [pasteAddRowColumnPlugin]
};
```
в order к ensure that the plugin works properly, you need к configure `keyboardOptions` when vтаблица is initialized, и set `copySelected` и `pasteValueToCell` к `true`.

```javascript liveдемонстрация template=vтаблица
const input_editor = новый Vтаблица_editors.InputEditor();
Vтаблица.регистрация.editor('ввод-editor', input_editor);
const generatePersons = count => {
  возврат массив.от(новый массив(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    имя: `Derrick${i + 1}`,
    lastимя: 'Rose',
    date1: '1988-10-04',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-конец engineer' + (i + 1) : 'front-конец engineer' + (i + 1),
    Город: 'Chigago'
  }));
};
const pasteAddRowColumnPlugin = новый VтаблицаPlugins.PasteAddRowColumnPlugin();
const option = {
  records: generatePersons(20),
  rowSeriesNumber: {},
  columns: [
    {
      поле: 'email1',
      заголовок: 'email',
      ширина: 200
    },
    {
      поле: 'имя',
      заголовок: 'первый имя',
      ширина: 200
    },
    {
      поле: 'date1',
      заголовок: 'birthday',
      ширина: 200
    },
    {
      поле: 'sex',
      заголовок: 'sex',
      ширина: 100
    }
  ],
  editor: 'ввод-editor',
  editCellTrigger: 'doubleНажать', // 编辑单元格触发方式
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true
  },
  plugins: [pasteAddRowColumnPlugin]

};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window.таблицаInstance = таблицаInstance;
```
