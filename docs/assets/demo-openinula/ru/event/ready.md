---
категория: примеры
группа: событие
заголовок: onReady
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
порядок: 1-1
ссылка: table_type/List_table/list_table_define_and_generate
опция: ListTable-columns-text#cellType
---

# onReady

The onReady callback is triggered after the table completes initialization or update. You can obtain the table instance and whether it is the first rendering.

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
Inula.render(
  <InulaVTable.ListTable
    option={option}
    height={'500px'}
    onReady={(tableInstance, isFirst) => {
      console.log(tableInstance, isFirst);
    }}
  />,
  root
);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
