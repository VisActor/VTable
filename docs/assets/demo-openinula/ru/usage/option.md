---
категория: примеры
группа: использование
заголовок: full опция
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
порядок: 1-1
ссылка: Developer_Ecology/openinula
---

# full опция

You can use the complete опция of VTable directly and pass the опция into the table компонент as a prop.

## демонстрация кода

```javascript livedemo template=vtable-openinula
// import * as InulaVTable from '@visactor/openinula-vtable';
const option = {
  columns: [
    {
      field: '0',
      title: 'имя'
    },
    {
      field: '1',
      title: 'возраст'
    },
    {
      field: '2',
      title: 'пол'
    },
    {
      field: '3',
      title: 'хобби'
    }
  ],
  records: new Array(1000).fill(['John', 18, 'мужской', '🏀'])
};

const root = document.getElementById(CONTAINER_ID);
Inula.render(<InulaVTable.ListTable option={option} height={'500px'} />, root);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
