# VTable on-demand loading

By default, `ListTable`, `PivotTable` and `PivotChart` introduced from `@visactor/vtable` package contain all table-related components, which is a complete table component library.

In order to meet the needs of package size optimization, VTable provides two types, `ListTableSimple` and `PivotTableSimple`, which are the most simplified lists and pivot tables, respectively. They only support text display and do not contain external components such as menus and titles. If you need some functions, you can load them on demand. The usage is as follows:

```js
// ListTableSimple, PivotTableSimple are the simplest list and pivot table components, which do not include cell types and any components other than text
import {ListTableSimple, PivotTableSimple, registerTitle, registerTooltip} from '@visactor/vtable';

// Register title component
registerTitle();

// Register tooltip component
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
