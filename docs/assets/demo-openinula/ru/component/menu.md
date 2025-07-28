---
category: examples
group: component
title: компонент меню
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-по умолчанию-новый.png
order: 1-1
link: table_type/List_table/list_table_define_and_generate
option: ListTable#menu
---

# компонент меню

Вы можете напрямую использовать `Menu` для настройки компонента меню, конфигурация соответствует option.menu.

## демонстрация кода

```javascript livedemo template=VTable-openinula
// import * as InulaVTable от '@visactor/openinula-VTable';

const records = новый массив(1000).fill(['John', 18, 'male', '🏀']);

const root = document.getElementById(CONTAINER_ID);
Inula.render(
  <InulaVTable.ListTable
    records={records}
    высота={'500px'}
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

// release openinula instance, do не copy
// освободить экземпляр openinula, не копировать
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
