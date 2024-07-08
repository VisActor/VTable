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