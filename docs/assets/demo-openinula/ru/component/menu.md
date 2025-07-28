---
категория: примеры
группа: компонент
заголовок: компонент меню
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
порядок: 1-1
ссылка: table_type/List_table/list_table_define_and_generate
опция: ListTable#menu
---

# компонент меню

Вы можете напрямую использовать `Menu` для настройки компонента меню, и конфигурация соответствует опция.menu.

## демонстрация кода

```javascript livedemo template=vtable-openinula
// import * as InulaVTable from '@visactor/openinula-vtable';

const records = new Array(1000).fill(['John', 18, 'мужской', '🏀']);

const root = document.getElementById(CONTAINER_ID);
Inula.render(
  <InulaVTable.ListTable
    records={records}
    height={'500px'}
    onDropdownMenuClick={args => {
      console.log('onDropdownMenuClick', args);
    }}
  >
    <InulaVTable.ListColumn field={'0'} title={'имя'} />
    <InulaVTable.ListColumn field={'1'} title={'возраст'} />
    <InulaVTable.ListColumn field={'2'} title={'пол'} />
    <InulaVTable.ListColumn field={'3'} title={'хобби'} />
    <InulaVTable.Menu
      renderMode={'html'}
      defaultHeaderMenuItems={['меню заголовка 1', 'меню заголовка 2']}
      contextMenuItems={['контекстное меню 1', 'контекстное меню 2']}
    />
  </InulaVTable.ListTable>,
  root
);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
