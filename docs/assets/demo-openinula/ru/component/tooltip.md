---
категория: примеры
группа: компонент
заголовок: подсказка компонент
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-default-new.png
порядок: 1-1
ссылка: table_type/List_table/list_table_define_and_generate
опция: ListTable#подсказка
---

# подсказка компонент

Вы можете напрямую использовать `Tooltip` для настройки компонента меню, и конфигурация соответствует опция.подсказка.

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
    <InulaVTable.Tooltip renderMode={'html'} isShowOverflowTextTooltip={true} />
  </InulaVTable.ListTable>,
  root
);

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
