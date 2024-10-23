import { Factory } from '../core/factory';
import { getAxisConfigInPivotChart } from '../layout/chart-helper/get-axis-config';
import { CartesianAxis } from './axis/axis';
import { computeAxisComponentHeight, computeAxisComponentWidth } from './axis/get-axis-component-size';
import { EmptyTip } from './empty-tip/empty-tip';
import { createLegend } from './legend/create-legend';
import { MenuHandler } from './menu/dom/MenuHandler';
import { Title } from './title/title';
import { TooltipHandler } from './tooltip/TooltipHandler';

export const registerAxis = () => {
  Factory.registerComponent('axis', CartesianAxis);
  Factory.registerFunction('computeAxisComponentWidth', computeAxisComponentWidth);
  Factory.registerFunction('computeAxisComponentHeight', computeAxisComponentHeight);
  Factory.registerFunction('getAxisConfigInPivotChart', getAxisConfigInPivotChart);
};

export const registerEmptyTip = () => {
  Factory.registerComponent('emptyTip', EmptyTip);
};

export const registerLegend = () => {
  Factory.registerFunction('createLegend', createLegend);
};

export const registerMenu = () => {
  Factory.registerComponent('menuHandler', MenuHandler);
};

export const registerTitle = () => {
  Factory.registerComponent('title', Title);
};

export const registerTooltip = () => {
  Factory.registerComponent('tooltipHandler', TooltipHandler);
};
