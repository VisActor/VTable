---
категория: примеры
группа: базовый возможности
заголовок: Container Fit - Adapt таблица Frame к Container
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/ширина-mode-adaptive.png
порядок: 3-6
ссылка: базовый_function/container_fit
опция: списоктаблица#containerFit
---

# Container Fit - Adapt таблица Frame к Container

The containerFit configuration allows the таблица frame к adapt к the container размер while preserving the original dimensions из row высотаs и column ширинаs. This is different от adaptive mode which stretches content к fill the container.

## Ключевые Конфигурации

- `containerFit: { ширина: true, высота: true }`

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;

const records = [
  { id: 1, имя: 'Alice', возраст: 25, Город: 'новый York' },
  { id: 2, имя: 'Bob', возраст: 30, Город: 'London' },
  { id: 3, имя: 'Charlie', возраст: 35, Город: 'Tхорошоyo' },
  { id: 4, имя: 'David', возраст: 40, Город: 'Beijing' },
  { id: 5, имя: 'Eve', возраст: 45, Город: 'Shanghai' },
  { id: 6, имя: 'Frank', возраст: 50, Город: 'Guangzhou' },
  { id: 7, имя: 'Grace', возраст: 55, Город: 'Shenzhen' },
  { id: 8, имя: 'Henry', возраст: 60, Город: 'Chengdu' },
  { id: 9, имя: 'Ivy', возраст: 65, Город: 'Chongqing' },
  { id: 10, имя: 'Jack', возраст: 70, Город: "Xi'an" },
  { id: 11, имя: 'Kate', возраст: 75, Город: 'Wuhan' },
  { id: 12, имя: 'Liam', возраст: 80, Город: 'Zhengzhou' },
  { id: 13, имя: 'Mia', возраст: 85, Город: 'Qingdao' }
];

const columns = [
  {
    поле: 'id',
    заголовок: 'ID',
    ширина: 60
  },
  {
    поле: 'имя',
    заголовок: 'имя',
    ширина: 100
  },
  {
    поле: 'возраст',
    заголовок: 'возраст',
    ширина: 80
  },
  {
    поле: 'Город',
    заголовок: 'Город',
    ширина: 120
  }
];

const container = document.getElementById(CONTAINER_ID);
container.style.ширина = '800px';
container.style.высота = '500px';
container.style.граница = '2px solid #333';

const option = {
  records,
  columns,
  containerFit: {
    ширина: true,
    высота: true
  },
  тема: {
    frameStyle: { borderLineширина: 2, borderColor: 'red' },
    scrollStyle: { barToSide: true }
  }
};

таблицаInstance = новый Vтаблица.списоктаблица(container, option);
window['таблицаInstance'] = таблицаInstance;
```
