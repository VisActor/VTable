import { PivotTable } from './PivotTable';
import {
  registerAxis,
  registerEmptyTip,
  registerLegend,
  registerMenu,
  registerTitle,
  registerTooltip
} from './components';
import {
  registerChartCell,
  registerCheckboxCell,
  registerImageCell,
  registerProgressBarCell,
  registerRadioCell,
  registerSparkLineCell,
  registerTextCell,
  registerVideoCell
} from './scenegraph/group-creater/cell-type';

registerAxis();
registerEmptyTip();
registerLegend();
registerMenu();
registerTitle();
registerTooltip();

registerChartCell();
registerCheckboxCell();
registerImageCell();
registerProgressBarCell();
registerRadioCell();
registerSparkLineCell();
registerTextCell();
registerVideoCell();

export class PivotTableAll extends PivotTable {}
