---
категория: примеры
группа: компонент
заголовок: menu компонент
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default.png
порядок: 1-1
ссылка: table_type/List_table/list_table_define_and_generate
опция: ListTable#menu
---

# menu компонент

Вы можете напрямую использовать `Menu` для настройки компонента меню, и конфигурация соответствует опция.menu.

## демонстрация кода

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';

const records = new Array(1000).fill(['John', 18, 'мужской', '🏀']);

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(
  <ReactVTable.ListTable
    records={records}
    height={'500px'}
    onDropdownMenuClick={args => {
      console.log('onDropdownMenuClick', args);
    }}
  >
    <ReactVTable.ListColumn field={'0'} title={'имя'} />
    <ReactVTable.ListColumn field={'1'} title={'возраст'} />
    <ReactVTable.ListColumn field={'2'} title={'пол'} />
    <ReactVTable.ListColumn field={'3'} title={'хобби'} />
    <ReactVTable.Menu
      renderMode={'html'}
      defaultHeaderMenuItems={['меню заголовка 1', 'меню заголовка 2']}
      contextMenuItems={['контекстное меню 1', 'контекстное меню 2']}
    />
  </ReactVTable.ListTable>
);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
