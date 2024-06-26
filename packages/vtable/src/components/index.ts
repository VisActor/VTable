import { Factory } from '../core/factory';
import { getAxisConfigInPivotChart } from '../layout/chart-helper/get-axis-config';
import { CartesianAxis } from './axis/axis';
import { computeAxisComponentHeight, computeAxisComponentWidth } from './axis/get-axis-component-size';

export const registerAxis = () => {
  Factory.registerComponent('axis', CartesianAxis);
  Factory.registerFunction('computeAxisComponentWidth', computeAxisComponentWidth);
  Factory.registerFunction('computeAxisComponentHeight', computeAxisComponentHeight);
  Factory.registerFunction('getAxisConfigInPivotChart', getAxisConfigInPivotChart);
};
