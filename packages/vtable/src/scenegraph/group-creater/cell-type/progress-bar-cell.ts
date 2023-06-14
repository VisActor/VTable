import { createRect, createLine } from '@visactor/vrender';
import type { ProgressBarStyle } from '../../../body-helper/style/ProgressBarStyle';
import { str, getOrApply } from '../../../tools/helper';
import { Group } from '../../graphic/group';
import { getProp } from '../../utils/get-prop';
import { getPadding } from '../../utils/padding';
import type { BaseTableAPI } from '../../../ts-types/base-table';

export function createProgressBarCell(
  progressBarDefine: {
    min?: number;
    max?: number;
    barType?: 'default' | 'negative' | 'negative_no_axis'; // 进度图类型
    dependField?: string; // 指定其他列数据（风神使用）,
  },
  style: ProgressBarStyle,
  width: number,
  // height: number,
  value: string,
  dataValue: string,
  col: number,
  row: number,
  padding: [number, number, number, number],
  table: BaseTableAPI
) {
  if (progressBarDefine.dependField) {
    dataValue = (table.getCellOriginRecord(col, row) as any)?.[progressBarDefine.dependField] ?? dataValue;
  }

  progressBarDefine.barType = progressBarDefine.barType ?? 'default';
  progressBarDefine.min = progressBarDefine.min ?? 0;
  progressBarDefine.max = progressBarDefine.max ?? progressBarDefine.min + 100;
  const height = table.getRowHeight(row);
  let contentWidth = width;
  let contentHeight = height;
  const percentCompleteBarGroup = new Group({
    x: 0,
    y: 0,
    width: contentWidth,
    height: contentHeight
  });
  percentCompleteBarGroup.name = 'progress-bar';

  const {
    showBar,
    barColor,
    barBgColor,
    // bgColor,
    barPositiveColor,
    barNegativeColor,
    barAxisColor,
    barRightToLeft,
    showBarMark,
    barMarkPositiveColor,
    barMarkNegativeColor,
    barMarkWidth,
    barMarkPosition
  } = style;
  let { barHeight, barBottom, barPadding } = style;
  // const { col, row, dataValue: originalValue } = context;

  // 完善四元组
  if (barPadding.length === 1) {
    barPadding = [barPadding[0], barPadding[0], barPadding[0], barPadding[0]];
  } else if (barPadding.length === 2) {
    barPadding = [barPadding[0], barPadding[1], barPadding[0], barPadding[1]];
  } else if (barPadding.length === 3) {
    barPadding = [barPadding[0], barPadding[1], barPadding[2], barPadding[1]];
  }

  // 将百分比值转换为数值
  barPadding = barPadding.map((v, i) => {
    if (typeof v === 'string' && str.endsWith(v, '%')) {
      const num = Number(v.substr(0, v.length - 1));
      if (i === 0 || i === 2) {
        return (height * num) / 100;
      }
      return (width * num) / 100;
    }
    return Number(v);
  });

  const top = 0;
  const left = 0;
  const right = contentWidth;
  const bottom = contentHeight;

  const borderWidth = getPadding(getProp('borderLineWidth', style, col, row, table));
  let barPaddingTop = Math.max((barPadding as number[])[0], borderWidth[0]);
  const barPaddingRight = Math.max((barPadding as number[])[1], borderWidth[1]);
  const barPaddingBottom = Math.max((barPadding as number[])[2], borderWidth[2]);
  let barPaddingLeft = Math.max((barPadding as number[])[3], borderWidth[3]);

  contentWidth -= barPaddingRight + barPaddingLeft;
  contentHeight -= barPaddingBottom + barPaddingTop;

  if (barPaddingTop & 1) {
    barPaddingTop += 0.5;
  }
  if (barPaddingLeft & 1) {
    barPaddingLeft += 0.5;
  }

  if (typeof barHeight === 'string' && str.endsWith(barHeight, '%')) {
    barHeight = Number(barHeight.substr(0, barHeight.length - 1));
    barHeight = (contentHeight * barHeight) / 100;
  } else {
    barHeight = Number(barHeight);
  }
  if (typeof barBottom === 'string' && str.endsWith(barBottom, '%')) {
    barBottom = Number(barBottom.substr(0, barBottom.length - 1));
    barBottom = (contentHeight * barBottom) / 100;
  } else {
    barBottom = Number(barBottom);
  }

  const show = getOrApply(showBar as any, {
    col,
    row,
    table,
    context: null,
    value,
    dataValue
  });

  if (show) {
    let svalue = `${dataValue}`;
    if (str.endsWith(svalue, '%')) {
      svalue = svalue.substr(0, svalue.length - 1);
    }
    const num = Number(svalue);
    if (isNaN(num)) {
      return percentCompleteBarGroup;
    }

    if ((progressBarDefine.barType ?? 'default') === 'default') {
      const rate =
        num < progressBarDefine.min
          ? 0
          : num > progressBarDefine.max
          ? 1
          : (num - progressBarDefine.min) / (progressBarDefine.max - progressBarDefine.min);

      const barMaxWidth = contentWidth;
      const barTop = barPaddingTop + contentHeight - (barHeight as number) - (barBottom as number);
      const barLeft = 0 + barPaddingLeft;

      const bgFillColor = getOrApply(barBgColor as any, {
        col,
        row,
        table,
        context: null,
        value,
        dataValue,
        rate
      });

      if (bgFillColor) {
        const barBack = createRect({
          x: barLeft,
          y: barTop,
          width: barMaxWidth,
          height: barHeight,
          fill: bgFillColor
        });
        percentCompleteBarGroup.addChild(barBack);
      }

      const barSize = Math.min(barMaxWidth * rate, barMaxWidth);
      const fillColor =
        getOrApply(barColor as any, {
          col,
          row,
          table,
          context: null,
          value,
          dataValue,
          rate
        }) || '#20a8d8';
      const barMain = createRect({
        x: barLeft,
        y: barTop,
        width: barSize,
        height: barHeight,
        fill: fillColor
      });
      percentCompleteBarGroup.addChild(barMain);
    } else if (progressBarDefine.barType === 'negative') {
      // negative模式参考风神现有数据条样式，显示坐标轴和正负数据条
      // 计算坐标轴位置
      const negativeRange = progressBarDefine.min < 0 ? -progressBarDefine.min : 0;
      const positiveRange = progressBarDefine.max > 0 ? progressBarDefine.max : 0;

      const negativeFactor = negativeRange / (negativeRange + positiveRange);
      const positiveFactor = 1 - negativeFactor;

      // 计算rate
      const positiveRate = num > 0 ? num / positiveRange : 0;
      const negativeRate = num < 0 ? -num / negativeRange : 0;

      // 绘制
      // 绘制背景
      const barMaxWidth = contentWidth;
      const barTop = barPaddingTop + contentHeight - (barHeight as number) - (barBottom as number);
      const barLeft = left + barPaddingLeft;
      const bgFillColor = getOrApply(barBgColor as any, {
        col,
        row,
        table,
        context: null,
        value,
        dataValue,
        rate: positiveRate
      });
      if (bgFillColor) {
        const barBack = createRect({
          x: barLeft,
          y: barTop,
          width: barMaxWidth,
          height: barHeight,
          fill: bgFillColor
        });
        percentCompleteBarGroup.addChild(barBack);
      }

      // 坐标轴距离左侧边界距离
      const positiveLeft = barRightToLeft ? positiveFactor * barMaxWidth : negativeFactor * barMaxWidth;

      // 绘制负值区域
      const barSizeNega = Math.min(barMaxWidth * negativeFactor * negativeRate, barMaxWidth);
      const barRectNega = barRightToLeft
        ? {
            left: barLeft + positiveLeft,
            top: barTop,
            width: barSizeNega,
            height: barHeight as number
          }
        : {
            left: barLeft + positiveLeft - barSizeNega,
            top: barTop,
            width: barSizeNega,
            height: barHeight as number
          };
      const barNagiFillColor =
        getOrApply(barNegativeColor as any, {
          col,
          row,
          table,
          context: null,
          value,
          dataValue,
          rate: negativeRate
        }) || '#20a8d8';
      const barNega = createRect({
        x: barRectNega.left,
        y: barRectNega.top,
        width: barRectNega.width,
        height: barRectNega.height,
        fill: barNagiFillColor
      });
      percentCompleteBarGroup.addChild(barNega);

      // 绘制正值区域
      const barSizePosi = Math.min(barMaxWidth * positiveFactor * positiveRate, barMaxWidth);
      const barRectPosi = barRightToLeft
        ? {
            left: barLeft + positiveLeft - barSizePosi,
            top: barTop,
            width: barSizePosi,
            height: barHeight as number
          }
        : {
            left: barLeft + positiveLeft,
            top: barTop,
            width: barSizePosi,
            height: barHeight as number
          };
      const barPosiFillColor =
        getOrApply(barPositiveColor as any, {
          col,
          row,
          table,
          context: null,
          value,
          dataValue,
          rate: positiveRate
        }) || '#20a8d8';
      const barPosi = createRect({
        x: barRectPosi.left,
        y: barRectPosi.top,
        width: barRectPosi.width,
        height: barRectPosi.height,
        fill: barPosiFillColor
      });
      percentCompleteBarGroup.addChild(barPosi);

      // 绘制坐标轴
      const lineLeft = barRightToLeft ? barRectNega.left : barRectPosi.left;
      const lineStrokeColor = getOrApply(barAxisColor as any);
      const line = createLine({
        x: 0,
        y: 0,
        stroke: lineStrokeColor,
        lineWidth: 1,
        lineDash: [2, 2],
        points: [
          { x: lineLeft, y: 0 },
          { x: lineLeft, y: height }
        ]
      });
      percentCompleteBarGroup.addChild(line);

      // 绘制mark
      if (showBarMark && (positiveRate || negativeRate)) {
        const lineWidth = barMarkWidth;
        const points = [];
        let barMarkStrokeColor;
        if (positiveRate > 0) {
          barMarkStrokeColor =
            getOrApply(barMarkPositiveColor as any, {
              col,
              row,
              table,
              context: null,
              value,
              dataValue,
              rate: positiveRate
            }) || '#20a8d8';
          if (barMarkPosition === 'right') {
            const markLeft = barRightToLeft
              ? barRectPosi.left + barMarkWidth / 2
              : barRectPosi.left + barRectPosi.width - barMarkWidth / 2;
            points.push({ x: markLeft, y: barRectPosi.top });
            points.push({ x: markLeft, y: barRectPosi.top + barRectPosi.height });
          } else if (barMarkPosition === 'bottom') {
            points.push({
              x: barRectPosi.left,
              y: barRectPosi.top + barRectPosi.height - barMarkWidth / 2
            });
            points.push({
              x: barRectPosi.left + barRectPosi.width,
              y: barRectPosi.top + barRectPosi.height - barMarkWidth / 2
            });
          }
        } else if (negativeRate > 0) {
          barMarkStrokeColor =
            getOrApply(barMarkNegativeColor as any, {
              col,
              row,
              table,
              context: null,
              value,
              dataValue,
              rate: negativeRate
            }) || '#20a8d8';
          if (barMarkPosition === 'right') {
            const markLeft = barRightToLeft
              ? barRectNega.left + barRectNega.width - barMarkWidth / 2
              : barRectNega.left + barMarkWidth / 2;
            points.push({ x: markLeft, y: barRectNega.top });
            points.push({ x: markLeft, y: barRectNega.top + barRectNega.height });
          } else if (barMarkPosition === 'bottom') {
            points.push({
              x: barRectNega.left,
              y: barRectNega.top + barRectNega.height - barMarkWidth / 2
            });
            points.push({
              x: barRectNega.left + barRectNega.width,
              y: barRectNega.top + barRectNega.height - barMarkWidth / 2
            });
          }
        }
        const barMark = createLine({
          x: 0,
          y: 0,
          stroke: barMarkStrokeColor,
          lineWidth,
          points
        });
        percentCompleteBarGroup.addChild(barMark);
      }
    } else if (progressBarDefine.barType === 'negative_no_axis') {
      // negative_no_axis模式不显示坐标轴，正负数据条同向，区分颜色
      // 计算range
      const _negativeRange = progressBarDefine.min < 0 ? -progressBarDefine.min : 0;
      const _positiveRange = progressBarDefine.max > 0 ? progressBarDefine.max : 0;
      const range = Math.max(_negativeRange, _positiveRange);

      // 计算rate
      const rate = range === 0 ? 0 : Math.abs(num) / range;

      // 绘制
      // 绘制背景
      const barMaxWidth = width - barPaddingLeft - barPaddingRight - 1; /*罫線*/
      const barSize = Math.min(barMaxWidth * rate, barMaxWidth);
      const barTop = bottom - barPaddingBottom - (barHeight as number) - (barBottom as number) - 1; /*罫線*/
      const barLeft = barRightToLeft ? right - barPaddingRight - barSize : left + barPaddingLeft;
      const barBgFillColor =
        getOrApply(barBgColor as any, {
          col,
          row,
          table,
          context: null,
          value,
          dataValue,
          rate
        }) || '#f0f3f5';
      const barBg = createRect({
        x: barLeft,
        y: barTop,
        width: barMaxWidth,
        height: barHeight,
        fill: barBgFillColor
      });
      percentCompleteBarGroup.addChild(barBg);

      // 绘制bar
      const barRect = {
        left: barLeft,
        top: barTop,
        width: barSize,
        height: barHeight as number
      };
      let barRectFillColor;
      if (num >= 0) {
        barRectFillColor =
          getOrApply(barPositiveColor as any, {
            col,
            row,
            table,
            context: null,
            value,
            rate,
            dataValue
          }) || '#20a8d8';
      } else {
        barRectFillColor =
          getOrApply(barNegativeColor as any, {
            col,
            row,
            table,
            context: null,
            value,
            dataValue,
            rate
          }) || '#20a8d8';
      }
      const bar = createRect({
        x: barRect.left,
        y: barRect.top,
        width: barRect.width,
        height: barRect.height,
        fill: barRectFillColor
      });
      percentCompleteBarGroup.addChild(bar);

      // 绘制mark
      if (showBarMark && num) {
        const lineWidth = barMarkWidth;
        const points = [];
        let barMarkStrokeColor;
        if (num >= 0) {
          barMarkStrokeColor =
            getOrApply(barMarkPositiveColor as any, {
              col,
              row,
              table,
              context: null,
              value,
              dataValue,
              rate
            }) || '#20a8d8';
        } else {
          barMarkStrokeColor =
            getOrApply(barMarkNegativeColor as any, {
              col,
              row,
              table,
              context: null,
              value,
              dataValue,
              rate
            }) || '#20a8d8';
        }
        if (barMarkPosition === 'right') {
          const markLeft = barRightToLeft
            ? barRect.left + barMarkWidth / 2
            : barRect.left + barRect.width - barMarkWidth / 2;
          points.push({ x: markLeft, y: barRect.top });
          points.push({ x: markLeft, y: barRect.top + barRect.height });
        } else if (barMarkPosition === 'bottom') {
          points.push({
            x: barRect.left,
            y: barRect.top + barRect.height - barMarkWidth / 2
          });
          points.push({
            x: barRect.left + barRect.width,
            y: barRect.top + barRect.height - barMarkWidth / 2
          });
        }
        const barMark = createLine({
          x: 0,
          y: 0,
          stroke: barMarkStrokeColor,
          lineWidth,
          points
        });
        percentCompleteBarGroup.addChild(barMark);
      }
    }
  }

  return percentCompleteBarGroup;
}
