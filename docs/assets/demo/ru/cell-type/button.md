---
категория: примеры
группа: Cell тип
заголовок: Кнопка тип
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/Кнопка.png
ссылка: cell_type/Кнопка
опция: списоктаблица-columns-Кнопка#cellType
---

# Кнопка тип

демонстрацияnstrates various ways к use Кнопка тип cells

## Key Configuration

cellType: 'Кнопка';

## код демонстрация

```javascript liveдемонстрация template=vтаблица
const records = [
  { productимя: 'Apple', price: 20 },
  { productимя: 'Banana', price: 18 },
  { productимя: 'Cherry', price: 16 },
  { productимя: 'Date', price: 14 },
  { productимя: 'Elderberry', price: 12 },
  { productимя: 'Fig', price: 10 },
  { productимя: 'Grape', price: 10 }
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
    поле: 'Кнопка',
    заголовок: 'Кнопка',
    ширина: 'авто',
    cellType: 'Кнопка',
    текст: 'выбрать',
    style: {
      цвет: '#FFF'
    }
  },
  {
    поле: 'Кнопка1',
    заголовок: 'отключен Кнопка',
    ширина: 'авто',
    cellType: 'Кнопка',
    отключить: true,
    текст: 'отключен выбрать',
    style: {
      цвет: '#FFF'
    }
  }
];
const option = {
  records,
  columns,
  defaultRowвысота: 60
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;

таблицаInstance.на(Vтаблица.списоктаблица.событие_TYPE.Кнопка_Нажать, e => {
  предупреждение(`${Vтаблица.списоктаблица.событие_TYPE.Кнопка_Нажать}, ${e.col}, ${e.row}`);
});
```
