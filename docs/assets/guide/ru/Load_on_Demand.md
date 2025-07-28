# Загрузка VTable по требованию

По умолчанию `ListTable`, `PivotTable` и `PivotChart`, импортированные из пакета `@visactor/vtable`, содержат все компоненты, связанные с таблицами, что представляет собой полную библиотеку табличных компонентов.

Для удовлетворения потребностей в оптимизации размера пакета, VTable предоставляет два типа: `ListTableSimple` и `PivotTableSimple`, которые являются наиболее упрощенными списками и сводными таблицами соответственно. Они поддерживают только отображение текста и не содержат внешних компонентов, таких как меню и заголовки. Если вам нужны некоторые функции, вы можете загружать их по требованию. Использование следующее:

```js
// ListTableSimple, PivotTableSimple - самые простые компоненты списка и сводной таблицы, которые не включают типы ячеек и любые компоненты, кроме текста
import {ListTableSimple, PivotTableSimple, registerTitle, registerTooltip} from '@visactor/vtable';

// Зарегистрировать компонент заголовка
registerTitle();

// Зарегистрировать компонент подсказки
registerTooltip();
```

## Load functions on demand

### Functional components

* registerAxis: axis component
* registerEmptyTip: empty prompt component
* registerLegend: legend component
* registerMenu: menu component
* registerTitle: title component
* registerTooltip: tooltip component
* registerAnimation: animation component

### Cell type

* registerChartCell: chart cell
* registerCheckboxCell: checkbox cell
* registerImageCell: Image cell
* registerProgressBarCell: Progress bar cell
* registerRadioCell: Radio button cell
* registerSparkLineCell: Sparkline cell
* registerTextCell: Text cell
* registerVideoCell: Video cell

## react-vtable on-demand loading

Similar to VTable, react-vtable also provides two components, `ListTableSimple` and `PivotTableSimple`, which are the most simplified list and pivot table respectively. They only support text type display and do not include external components such as menus and titles.

```tsx
function App() {
  const records = new Array(10).fill(['John', 18, 'male', '🏀']);

  return (
    <ListTableSimple records={records}>
      <ListColumn field={'0'} title={'name'} />
      <ListColumn field={'1'} title={'age'} />
      <ListColumn field={'2'} title={'sex'} />
      <ListColumn field={'3'} title={'hobby'} />
    </ListTableSimple>
  );
}
```

It should be noted that if react-vtable needs to register components, it is necessary to first introduce the registration function in the vtable package for on-demand registration. The versions of `'@visactor/vtable'` and `'@visactor/react-vtable'` used in the project need to be consistent.

```tsx
import {ListTableSimple} form '@visactor/react-vtable';
import {registerTitle, registerTooltip} from '@visactor/vtable';

registerTitle();

function App() {
  const records = new Array(10).fill(['John', 18, 'male', '🏀']);

  return (
    <ListTableSimple records={records}>
      <Title text={'title'} />
      <ListColumn field={'0'} title={'name'} />
      <ListColumn field={'1'} title={'age'} />
      <ListColumn field={'2'} title={'sex'} />
      <ListColumn field={'3'} title={'hobby'} />
    </ListTableSimple>
  );
}
```
