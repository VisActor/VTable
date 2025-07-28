---
категория: примеры
группа: событие
заголовок: событие списокerner
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/react-по умолчанию-новый.png
порядок: 1-1
ссылка: таблица_type/список_таблица/список_таблица_define_and_generate
опция: списоктаблица-columns-текст#cellType
---

# событие списокerner

The событиеs supported по Vтаблица can be monitored through openinula props. для details, please refer к [событие список]([../апи/событие](https://www.visactor.io/vтаблица/guide/Developer_Ecology/openinula# %E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A)).

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
  ],
  records: новый массив(1000).fill(['John', 18, 'male', '🏀'])
};

const root = document.getElementById(CONTAINER_ID);
Inula.render(
  <InulaVтаблица.списоктаблица
    option={option}
    высота={'500px'}
    onMouseMoveCell={args => {
      console.log('onMouseMoveCell', args);
    }}
  />,
  root
);

// Релиз openinula instance, do не copy
window.пользовательскийРелиз = () => {
  Inula.unmountкомпонентAtNode(root);
};
```
