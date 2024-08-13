import { ListTable } from './ListTable';
import {
  registerAxis,
  registerEmptyTip,
  registerLegend,
  registerMenu,
  registerTitle,
  registerTooltip
} from './components';
import { registerListTreeStickCellPlugin } from './plugins/list-tree-stick-cell';
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
registerListTreeStickCellPlugin();

registerChartCell();
registerCheckboxCell();
registerImageCell();
registerProgressBarCell();
registerRadioCell();
registerSparkLineCell();
registerTextCell();
registerVideoCell();
export class ListTableAll extends ListTable {}
