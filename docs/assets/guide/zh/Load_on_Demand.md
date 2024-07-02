# VTable 按需加载

默认从 `@visactor/vtable` 包中引入的 `ListTable` 、 `PivotTable` 和 `PivotChart` 包含所有的表格相关的组件，是一个完整的表格组件库。

为了满足包体积优化的需求，VTable提供了 `ListTableSimple` 和 `PivotTableSimple` 两个类型，分别是最简化的列表和透视表，只支持文字类型的显示，不包含菜单、标题等外部组件。如果需要部分功能，可以进行按需加载，使用方法如下：

```js
// ListTableSimple, PivotTableSimple 是最简单的列表和透视表组件，不包除了文字之外的单元格类型和任何组件
import {ListTableSimple, PivotTableSimple, registerTitle, registerTooltip} from '@visactor/vtable'; 

// 注册标题组件
registerTitle();

// 注册tooltip组件
registerTooltip();
```

## 按需加载功能

### 功能组件

* registerAxis: 坐标轴组件
* registerEmptyTip: 空白提示组件
* registerLegend: 图例组件
* registerMenu: 菜单组件
* registerTitle: 标题组件
* registerTooltip: tooltip组件

### 单元格类型

* registerChartCell: 图表单元格
* registerCheckboxCell: 复选框单元格
* registerImageCell: 图片单元格
* registerProgressBarCell: 进度条单元格
* registerRadioCell: 单选框单元格
* registerSparkLineCell: 迷你图单元格
* registerTextCell: 文字单元格
* registerVideoCell: 视频单元格