---
категория: примеры
группа: событие
заголовок: событие listerner
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
порядок: 1-1
ссылка: table_type/List_table/list_table_define_and_generate
опция: ListTable-columns-text#cellType
---

# событие listerner

The событиеs supported by VTable can be monitored through react props. For details, please refer to [Event List]([../api/событие](https://www.visactor.io/vtable/guide/Developer_Ecology/react# %E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A)).

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
root.render(
  <ReactVTable.ListTable
    option={option}
    height={'500px'}
    onMouseMoveCell={args => {
      console.log('onMouseMoveCell', args);
    }}
  />
);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
