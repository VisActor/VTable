---
категория: примеры
группа: использование
заголовок: use опция and record
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
порядок: 1-1
ссылка: Developer_Ecology/react
---

# use опция and record

Records can be separated from опцияs and passed into the table компонент as a separate prop.

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
  ]
};
const records = new Array(1000).fill(['John', 18, 'мужской', '🏀']);

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<ReactVTable.ListTable option={option} records={records} height={'500px'} />);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
