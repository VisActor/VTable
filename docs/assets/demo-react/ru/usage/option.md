---
категория: примеры
группа: usвозраст
заголовок: full option
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/react-по умолчанию.png
порядок: 1-1
ссылка: Developer_Ecology/react
---

# full option

Вы можете use the complete option из Vтаблица directly и pass the option into the таблица компонент as a prop.

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
root.render(<ReactVтаблица.списоктаблица option={option} высота={'500px'} />);

// Релиз openinula instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```
