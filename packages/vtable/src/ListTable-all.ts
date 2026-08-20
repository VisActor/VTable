import { ListTable } from './ListTable';
import {
  registerAxis,
  registerEmptyTip,
  registerLegend,
  registerMenu,
  registerTitle,
  registerTooltip,
  registerAnimation
} from './components';
import { registerCustomCellStylePlugin } from './plugins/custom-cell-style';
import { registerListTreeStickCellPlugin } from './plugins/list-tree-stick-cell';
import {
  registerAudioCell,
  registerButtonCell,
  registerChartCell,
  registerCheckboxCell,
  registerImageCell,
  registerProgressBarCell,
  registerRadioCell,
  registerSparkLineCell,
  registerSwitchCell,
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
registerAnimation();
registerAudioCell();
registerChartCell();
registerCheckboxCell();
registerImageCell();
registerProgressBarCell();
registerRadioCell();
registerSwitchCell();
registerButtonCell();
registerSparkLineCell();
registerTextCell();
registerVideoCell();
export class ListTableAll extends ListTable {}
