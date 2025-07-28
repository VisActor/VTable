---
категория: примеры
группа: использование
заголовок: full опция
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
порядок: 1-1
ссылка: Developer_Ecology/react
---

# full опция

You can use the complete опция of VTable directly and pass the опция into the table компонент as a prop.

## демонстрация кода

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';
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

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<ReactVTable.ListTable option={option} height={'500px'} />);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
