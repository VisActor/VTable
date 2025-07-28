---
категория: примеры
группа: Cell тип
заголовок: переключатель тип
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/переключатель.png
ссылка: cell_type/переключатель
опция: списоктаблица-columns-флажок#cellType
---

# переключатель тип

демонстрацияnstrate multiple ways к use переключатель

## Critical Configuration

cellType: 'переключатель';

## код демонстрация

```javascript liveдемонстрация template=vтаблица
const records = [
  {
    productимя: 'aaaa',
    price: 20,
    radio1: 'переключатель информация',
    radio2: true,
    radio3: {
      текст: 'column переключатель a',
      checked: false,
      отключить: false
    },
    radio4: ['cell переключатель 1', 'cell переключатель 2'],
    radio5: [
      { текст: 'cell переключатель 1', checked: true, отключить: false },
      { текст: 'cell переключатель 2', checked: false, отключить: false }
    ]
  },
  {
    productимя: 'bbbb',
    price: 18,
    radio1: 'переключатель информация',
    radio2: true,
    radio3: {
      текст: 'column переключатель b',
      checked: false,
      отключить: false
    },
    radio4: ['cell переключатель 1', 'cell переключатель 2'],
    radio5: [
      { текст: 'cell переключатель 1', checked: false, отключить: false },
      { текст: 'cell переключатель 2', checked: true, отключить: false }
    ]
  },
  {
    productимя: 'cccc',
    price: 16,
    radio1: 'переключатель информация',
    radio2: true,
    radio3: {
      текст: 'column переключатель c',
      checked: false,
      отключить: false
    },
    radio4: ['cell переключатель 1', 'cell переключатель 2'],
    radio5: [
      { текст: 'cell переключатель 1', checked: true, отключить: false },
      { текст: 'cell переключатель 2', checked: false, отключить: false }
    ]
  },
  {
    productимя: 'dddd',
    price: 14,
    radio1: 'переключатель информация',
    radio2: true,
    radio3: {
      текст: 'column переключатель d',
      checked: false,
      отключить: false
    },
    radio4: ['cell переключатель 1', 'cell переключатель 2'],
    radio5: [
      { текст: 'cell переключатель 1', checked: false, отключить: true },
      { текст: 'cell переключатель 2', checked: true, отключить: false }
    ]
  },
  {
    productимя: 'eeee',
    price: 12,
    radio1: 'переключатель информация',
    radio2: true,
    radio3: {
      текст: 'column переключатель e',
      checked: false,
      отключить: false
    },
    radio4: ['cell переключатель 1', 'cell переключатель 2'],
    radio5: [
      { текст: 'cell переключатель 1', checked: true, отключить: false },
      { текст: 'cell переключатель 2', checked: false, отключить: false }
    ]
  },
  {
    productимя: 'ffff',
    price: 10,
    radio1: 'переключатель информация',
    radio2: true,
    radio3: {
      текст: 'column переключатель f',
      checked: false,
      отключить: false
    },
    radio4: ['cell переключатель 1', 'cell переключатель 2'],
    radio5: [
      { текст: 'cell переключатель 1', checked: false, отключить: false },
      { текст: 'cell переключатель 2', checked: true, отключить: false }
    ]
  },
  {
    productимя: 'gggg',
    price: 10,
    radio1: 'переключатель информация',
    radio2: true,
    radio3: {
      текст: 'column переключатель g',
      checked: false,
      отключить: false
    },
    radio4: ['cell переключатель 1', 'cell переключатель 2'],
    radio5: [
      { текст: 'cell переключатель 1', checked: true, отключить: false },
      { текст: 'cell переключатель 2', checked: false, отключить: false }
    ]
  }
];

const columns = [
  {
    поле: 'isCheck',
    заголовок: '',
    ширина: 50,
    cellType: 'переключатель'
  },
  {
    поле: 'productимя',
    заголовок: 'product имя',
    ширина: 160
  },
  {
    поле: 'price',
    заголовок: 'price',
    ширина: 120
  },
  {
    поле: 'radio1',
    заголовок: 'column переключатель отключить',
    ширина: 200,
    cellType: 'переключатель',
    отключить: true,
    checked: args => {
      if (args.row === 3) возврат true;
    }
  },
  {
    поле: 'radio3',
    заголовок: 'column переключатель данные config',
    ширина: 230,
    cellType: 'переключатель'
  },
  {
    поле: 'radio4',
    заголовок: 'cell переключатель',
    ширина: 140,
    cellType: 'переключатель',
    style: {
      spaceBetweenRadio: 4
    }
  },
  {
    поле: 'radio5',
    заголовок: 'cell переключатель данные config',
    ширина: 240,
    radioDirectionInCell: 'horizontal',
    radioCheckType: 'cell',
    cellType: 'переключатель',
    style: {
      spaceBetweenRadio: 8
    }
  }
];
const option = {
  records,
  columns,
  высотаMode: 'автовысота'
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
