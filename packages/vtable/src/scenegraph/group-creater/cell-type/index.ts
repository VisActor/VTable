import { Factory } from '../../../core/factory';
import { createChartCellGroup } from './chart-cell';
import { createCheckboxCellGroup } from './checkbox-cell';
import { createImageCellGroup } from './image-cell';
import { createRadioCellGroup } from './radio-cell';
import { createSwitchCellGroup } from './switch-cell';
import { createSparkLineCellGroup } from './spark-line-cell';
import { createVideoCellGroup } from './video-cell';
import { createCellGroup as createTextCellGroup } from './text-cell';
import { createProgressBarCell } from './progress-bar-cell';
import { getAxisDomainRangeAndLabels } from '../../../layout/chart-helper/get-axis-domain';
import { createButtonCellGroup } from './button-cell';

export const registerChartCell = () => {
  Factory.registerFunction('createChartCellGroup', createChartCellGroup);
  Factory.registerFunction('getAxisDomainRangeAndLabels', getAxisDomainRangeAndLabels);
};

export const registerCheckboxCell = () => {
  Factory.registerFunction('createCheckboxCellGroup', createCheckboxCellGroup);
};

export const registerImageCell = () => {
  Factory.registerFunction('createImageCellGroup', createImageCellGroup);
};

export const registerProgressBarCell = () => {
  Factory.registerFunction('createProgressBarCell', createProgressBarCell);
};

export const registerRadioCell = () => {
  Factory.registerFunction('createRadioCellGroup', createRadioCellGroup);
};

export const registerSwitchCell = () => {
  Factory.registerFunction('createSwitchCellGroup', createSwitchCellGroup);
};

export const registerButtonCell = () => {
  Factory.registerFunction('createButtonCellGroup', createButtonCellGroup);
};

export const registerSparkLineCell = () => {
  Factory.registerFunction('createSparkLineCellGroup', createSparkLineCellGroup);
};

export const registerTextCell = () => {
  Factory.registerFunction('createTextCellGroup', createTextCellGroup);
};

export const registerVideoCell = () => {
  Factory.registerFunction('createVideoCellGroup', createVideoCellGroup);
};
