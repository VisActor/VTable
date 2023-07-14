import type { IGroup, INode, IText } from '@visactor/vrender';
import type { LineAxis } from '@visactor/vrender-components';
import type { CartesianAxis } from './axis';
import { isXAxis } from '../util/orient';
import { isEmpty, last as peek } from '@visactor/vutils';

export function doOverlap(axisComponent: LineAxis, axis: CartesianAxis) {
  const layer0LabelsContainer = axisComponent.find(
    (node: INode) => node.name === 'axis-label-container-layer-0',
    true
  ) as IGroup;
  const layer1LabelsContainer = axisComponent.find(
    (node: INode) => node.name === 'axis-label-container-layer-1',
    true
  ) as IGroup;
  overlap(layer0LabelsContainer ? (layer0LabelsContainer.getChildren() as IText[]) : [], axis);
  overlap(layer1LabelsContainer ? (layer1LabelsContainer.getChildren() as IText[]) : [], axis);
}

function labelFlush(axisLabels: IText[], axis: CartesianAxis) {
  const { width, height } = axis.getLayoutRect();
  const isX = isXAxis(axis.orient);
  const first = axisLabels[0];
  const last = peek(axisLabels);

  if (isX) {
    const start = 0;
    const end = width;
    const startBound = first.AABBBounds.x1;
    const endBound = last.AABBBounds.x2;
    if (startBound < start) {
      first.setAttributes({
        x: start,
        textAlign: 'left'
      });
    }

    if (endBound > end) {
      last.setAttributes({
        x: end,
        textAlign: 'right'
      });
    }
  } else {
    const start = height;
    const end = 0;
    const startBound = first.AABBBounds.y2;
    const endBound = last.AABBBounds.y1;

    if (startBound > start) {
      first.setAttributes({
        y: start,
        textBaseline: 'bottom'
      });
    }

    if (endBound < end) {
      last.setAttributes({
        y: end,
        textBaseline: 'top'
      });
    }
  }
}

function overlap(axisLabels: IText[], axis: CartesianAxis) {
  const spec = axis.option;
  if (!isEmpty(axisLabels)) {
    // 首尾标签向内偏移
    if (spec?.label?.flush) {
      labelFlush(axisLabels, axis);
    }
  }
}
