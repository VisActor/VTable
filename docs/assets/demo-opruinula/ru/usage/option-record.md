---
категория: примеры
группа: usвозраст
заголовок: use option и record
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/react-по умолчанию-новый.png
порядок: 1-1
ссылка: Developer_Ecology/openinula
---

# use option и record

Records can be separated от options и passed into the таблица компонент as a separate prop.

## код демонстрация

```javascript liveдемонстрация template=vтаблица-openinula
// import * as InulaVтаблица от '@visactor/openinula-vтаблица';
const option = {
  columns: [
    {
      поле: '0',
      заголовок: 'имя'
    },
    {
      поле: '1',
      заголовок: 'возраст'
    },
    {
      поле: '2',
      заголовок: 'пол'
    },
    {
      поле: '3',
      заголовок: 'хобби'
    }
  ]
};
const records = новый массив(1000).fill(['John', 18, 'male', '🏀']);

const root = document.getElementById(CONTAINER_ID);
Inula.render(<InulaVтаблица.списоктаблица option={option} records={records} высота={'500px'} />, root);

// Релиз openinula instance, do не copy
window.пользовательскийРелиз = () => {
  Inula.unmountкомпонентAtNode(root);
};
```
