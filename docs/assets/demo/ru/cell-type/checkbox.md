---
категория: примеры
группа: Cell тип
заголовок: флажок тип
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/флажок-демонстрация.png
ссылка: cell_type/флажок
опция: списоктаблица-columns-флажок#cellType
---

# Checbox тип

демонстрацияnstrate multiple ways к use флажок

## Critical Configuration

cellType: 'флажок';

## код демонстрация

```javascript liveдемонстрация template=vтаблица
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
window['таблицаInstance'] = таблицаInstance;
```
