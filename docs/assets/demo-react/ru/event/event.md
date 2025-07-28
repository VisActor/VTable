---
категория: примеры
группа: событие
заголовок: событие списокerner
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/react-по умолчанию.png
порядок: 1-1
ссылка: таблица_type/список_таблица/список_таблица_define_and_generate
опция: списоктаблица-columns-текст#cellType
---

# событие списокerner

The событиеs supported по Vтаблица can be monitored through react props. для details, please refer к [событие список]([../апи/событие](https://www.visactor.io/vтаблица/guide/Developer_Ecology/react# %E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A)).

## код демонстрация

```javascript liveдемонстрация template=vтаблица-react
// import * as ReactVтаблица от '@visactor/react-vтаблица';

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

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(
  <ReactVтаблица.списоктаблица
    option={option}
    высота={'500px'}
    onMouseMoveCell={args => {
      console.log('onMouseMoveCell', args);
    }}
  />
);

// Релиз openinula instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```
