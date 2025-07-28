---
категория: примеры
группа: Cell тип
заголовок: Switch тип
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/switch.png
ссылка: cell_type/switch
опция: списоктаблица-columns-switch#cellType
---

# Switch тип

демонстрацияnstrates various ways к use the switch тип.

## Key Configuration

cellType: 'switch';

## код демонстрация

```javascript liveдемонстрация template=vтаблица
const records = [
  { productимя: 'Apple', price: 20, switch: true },
  { productимя: 'Banana', price: 18, switch: false },
  { productимя: 'Cherry', price: 16, switch: true },
  { productимя: 'Date', price: 14, switch: false },
  { productимя: 'Elderberry', price: 12, switch: true },
  { productимя: 'Fig', price: 10, switch: false },
  { productимя: 'Grape', price: 10, switch: true }
];

const columns = [
  {
    поле: 'productимя',
    заголовок: 'имя',
    ширина: 120
  },
  {
    поле: 'price',
    заголовок: 'price',
    ширина: 120
  },
  {
    поле: 'switch0',
    заголовок: 'switch',
    ширина: 'авто',
    cellType: 'switch',
    checkedText: 'на',
    uncheckedText: 'off',
    style: {
      цвет: '#FFF'
    }
  },
  {
    поле: 'switch1',
    заголовок: 'отключен switch',
    ширина: 'авто',
    cellType: 'switch',
    checkedText: 'на',
    uncheckedText: 'off',
    style: {
      цвет: '#FFF'
    },
    отключить: true
  },
  {
    поле: 'switch',
    заголовок: 'пользовательский switch',
    ширина: 'авто',
    cellType: 'switch',
    style: {
      цвет: '#FFF'
    },
    checkedText: args => {
      возврат 'на' + args.row;
    },
    uncheckedText: args => {
      возврат 'off' + args.row;
    }
  }
];
const option = {
  records,
  columns
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
