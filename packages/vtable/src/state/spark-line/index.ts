import { createLine, createSymbol } from '@src/vrender';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import type { MousePointerSparklineEvent } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

export function clearChartHover(col: number, row: number, table: BaseTableAPI) {
  const cellGroup = table.scenegraph.getCell(col, row);
  const sparkline = cellGroup.getChildByName('sparkline');
  const highlightLine = sparkline?.getChildByName('highlight-line');
  const highlightSymbol = sparkline?.getChildByName('highlight-symbol');
  if (highlightLine) {
    highlightLine.setAttributes({
      visible: false,
      pickable: false
    });
  }
  if (highlightSymbol) {
    highlightSymbol.setAttributes({
      visible: false,
      pickable: false
    });
  }

  table.scenegraph.updateNextFrame();
}

export function updateChartHover(col: number, row: number, x: number, y: number, table: BaseTableAPI): boolean {
  const cellGroup = table.scenegraph.getCell(col, row);
  const sparkline = cellGroup.getChildByName('sparkline');
  const line = sparkline?.getChildByName('sparkline-line');
  const symbol = sparkline?.getChildByName('sparkline-symbol-group');
  if (!line) {
    return false;
  }
  const bandwidth = (line as any).bandwidth;
  const min = (line as any).min;
  const max = (line as any).max;
  const points = line.attribute.points;
  x = x - sparkline.globalAABBBounds.x1;
  y = y - sparkline.globalAABBBounds.y1;

  let chartPoint;
  for (let i = 0; i < points.length; i++) {
    const { x: pointX, y: pointY, defined, rawData } = points[i];

    if (Math.abs(x - pointX) < bandwidth / 2) {
      chartPoint = {
        point: points[i],
        points,
        pointsBandWidth: bandwidth,
        pointData: rawData
      };
      if (defined) {
        // 添加highlight line
        const highlightLine = sparkline.getChildByName('highlight-line');
        if (highlightLine) {
          highlightLine.setAttributes({
            // x: pointX,
            points: [
              { x: pointX, y: max },
              { x: pointX, y: min }
            ],
            visible: true,
            pickable: true
          });
        } else {
          const highlightLine = createLine({
            // x: 0,
            // y: 0,
            points: [
              { x: pointX, y: max },
              { x: pointX, y: min }
            ],
            lineWidth: line.hover?.strokeWidth,
            stroke: line.hover?.stroke
          });
          highlightLine.name = 'highlight-line';
          sparkline.addChild(highlightLine);
        }

        // 添加highlight symbol
        const highlightSymbol = sparkline.getChildByName('highlight-symbol');
        if (highlightSymbol) {
          highlightSymbol.setAttributes({
            x: pointX,
            y: pointY,
            visible: true,
            pickable: true
          });
        } else {
          const highlightSymbol = createSymbol({
            x: pointX,
            y: pointY,
            stroke: symbol.hover.stroke,
            lineWidth: symbol.hover.strokeWidth,
            fill: symbol.hover.fill,
            size: symbol.hover.size * 2, // 之前配置的是圆半径
            symbolType: 'circle'
          });
          highlightSymbol.name = 'highlight-symbol';
          sparkline.addChild(highlightSymbol);
        }
        break;
      }
    }
  }
  table.scenegraph.updateNextFrame();

  if (chartPoint) {
    const eventInfo: Omit<MousePointerSparklineEvent, 'target'> = {
      col,
      row,
      field: table.getHeaderField(col, row),
      value: table.getCellValue(col, row),
      dataValue: table.getCellOriginValue(col, row),
      cellHeaderPaths: table.internalProps.layoutMap.getCellHeaderPaths(col, row),
      title: table.getBodyColumnDefine(col, row).title,
      cellRange: table.getCellRelativeRect(col, row),
      sparkline: {
        pointData: chartPoint.pointData
      },
      scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth
    };
    table.fireListeners(TABLE_EVENT_TYPE.MOUSEOVER_CHART_SYMBOL, eventInfo as MousePointerSparklineEvent);
  }
  return true;
}
