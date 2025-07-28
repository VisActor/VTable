---
категория: примеры
группа: использование
заголовок: грамматический тег
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
порядок: 1-1
ссылка: Developer_Ecology/openinula
---

# грамматический тег

Use syntax tags to assemble a complete table configuration and generate tables in the form of subкомпонентs.

- ListColumn: List column, consistent with the definition of columns in опция [api](../../опция/ListTable-columns-text#cellType)

## демонстрация кода

```javascript livedemo template=vtable-openinula
// import * as InulaVTable from '@visactor/openinula-vtable';
const records = new Array(1000).fill(['John', 18, 'мужской', '🏀']);

const root = document.getElementById(CONTAINER_ID);
Inula.render(
  <InulaVTable.ListTable records={records} height={'500px'}>
    <InulaVTable.ListColumn field={'0'} title={'имя'} />
    <InulaVTable.ListColumn field={'1'} title={'возраст'} />
    <InulaVTable.ListColumn field={'2'} title={'пол'} />
    <InulaVTable.ListColumn field={'3'} title={'хобби'} />
  </InulaVTable.ListTable>,
  root
);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
