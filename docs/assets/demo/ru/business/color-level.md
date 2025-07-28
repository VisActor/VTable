---
категория: примеры
группа: Business
заголовок: Продажи heat map
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/цвет-level.png
порядок: 9-1
опция: сводныйтаблица-indicators-текст#style.bgColor
---

# Продажи heat map

This пример shows how к implement a Продажи heat map по changing the фон цвет according к the цвет level configuration функция.

## Ключевые Конфигурации

- `indicators[x].style.bgColor` Configure the фон цвет из a Metirc content

## код демонстрация

```javascript liveдемонстрация template=vтаблица
функция getColor(min, max, n) {
  if (max === min) {
    if (n > 0) {
      возврат 'rgb(255,0,0)';
    }
    возврат 'rgb(255,255,255)';
  }
  if (n === '') возврат 'rgb(255,255,255)';
  const c = (n - min) / (max - min) + 0.1;
  const red = (1 - c) * 200 + 55;
  const green = (1 - c) * 200 + 55;
  возврат `rgb(${red},${green},255)`;
}
const option = {
  изменение размера: {
    columnResizeType: 'все'
  },
  records: [
    {
      Продажи: '936196.0161590576',
      Регион: 'North East',
      категория: 'Technology'
    },
    {
      Продажи: '824673.0542612076',
      Регион: 'North East',
      категория: 'Office Supplies'
    },
    {
      Продажи: '920698.4041175842',
      Регион: 'North East',
      категория: 'Furniture'
    },
    {
      Продажи: '1466575.628829956',
      Регион: 'Central South',
      категория: 'Technology'
    },
    {
      Продажи: '1270911.2654294968',
      Регион: 'Central South',
      категория: 'Office Supplies'
    },
    {
      Продажи: '1399928.2008514404',
      Регион: 'Central South',
      категория: 'Furniture'
    },
    {
      Продажи: '1599653.7198867798',
      Регион: 'East China',
      категория: 'Technology'
    },
    {
      Продажи: '1408628.5947360992',
      Регион: 'East China',
      категория: 'Office Supplies'
    },
    {
      Продажи: '1676224.1276245117',
      Регион: 'East China',
      категория: 'Furniture'
    },
    {
      Продажи: '781743.5634155273',
      Регион: 'North China',
      категория: 'Technology'
    },
    {
      Продажи: '745813.5155878067',
      Регион: 'North China',
      категория: 'Office Supplies'
    },
    {
      Продажи: '919743.9351348877',
      Регион: 'North China',
      категория: 'Furniture'
    },
    {
      Продажи: '230956.3768310547',
      Регион: 'North West',
      категория: 'Technology'
    },
    {
      Продажи: '267870.7928543091',
      Регион: 'North West',
      категория: 'Office Supplies'
    },
    {
      Продажи: '316212.42824935913',
      Регион: 'North West',
      категория: 'Furniture'
    },
    {
      Продажи: '453898.2000274658',
      Регион: 'South West',
      категория: 'Technology'
    },
    {
      Продажи: '347692.57691955566',
      Регион: 'South West',
      категория: 'Office Supplies'
    },
    {
      Продажи: '501533.7320175171',
      Регион: 'South West',
      категория: 'Furniture'
    }
  ],
  rows: [
    {
      dimensionKey: 'Регион',
      заголовок: 'Area',
      ширина: 'авто',
      showсортировка: false,
      headerType: 'link',
      linkDetect: true,
      linkJump: false
    }
  ],
  columns: [
    {
      dimensionKey: 'Категория',
      заголовок: 'Категория',
      headerStyle: {
        textAlign: 'право'
      },
      showсортировка: false,
      headerType: 'link',
      linkDetect: true,
      linkJump: false
    }
  ],
  indicators: [
    {
      indicatorKey: 'Продажи',
      ширина: 200,
      showсортировка: false,
      format(значение) {
        возврат Math.round(значение);
      },
      style: {
        цвет: 'white',
        bgColor: args => {
          возврат getColor(100000, 2000000, args.данныеValue);
        }
      }
    }
  ],
  corner: {
    titleOnDimension: 'никто',
    headerStyle: {
      textStick: true
    }
  },
  hideIndicatorимя: true,
  тема: {
    defaultStyle: {
      borderLineширина: 0
    }
  }
};

const таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
