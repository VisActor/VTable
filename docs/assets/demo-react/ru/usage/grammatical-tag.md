---
категория: примеры
группа: использование
заголовок: грамматический тег
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
порядок: 1-1
ссылка: Developer_Ecology/react
---

# грамматический тег

Use syntax tags to assemble a complete table configuration and generate tables in the form of subкомпонентs.

- ListColumn: List column, consistent with the definition of columns in опция [api](../../опция/ListTable-columns-text#cellType)

## демонстрация кода

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';
const records = new Array(1000).fill(['John', 18, 'мужской', '🏀']);

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(
  <ReactVTable.ListTable records={records} height={'500px'}>
    <ReactVTable.ListColumn field={'0'} title={'имя'} />
    <ReactVTable.ListColumn field={'1'} title={'возраст'} />
    <ReactVTable.ListColumn field={'2'} title={'пол'} />
    <ReactVTable.ListColumn field={'3'} title={'хобби'} />
  </ReactVTable.ListTable>
);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
