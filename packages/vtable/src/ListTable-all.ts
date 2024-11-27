import { ListTable } from './ListTable';
import {
  registerAxis,
  registerEmptyTip,
  registerLegend,
  registerMenu,
  registerTitle,
  registerTooltip
} from './components';
import { registerListTreeStickCellPlugin, registerCustomCellStylePlugin } from '@visactor/vtable-plugins';
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
registerCustomCellStylePlugin();

registerChartCell();
registerCheckboxCell();
registerImageCell();
registerProgressBarCell();
registerRadioCell();
registerSparkLineCell();
registerTextCell();
registerVideoCell();
export class ListTableAll extends ListTable {}
