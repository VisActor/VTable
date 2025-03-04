import { isArray, isNumber, isObject } from '@visactor/vutils';
import { validToString } from '../../tools/util';
import { getProp } from '../utils/get-prop';
import { CheckBox, Radio, Switch, Tag } from '@src/vrender';
import type { FullExtendStyle, RadioColumnDefine } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

const utilCheckBoxMark = new CheckBox({});
const utilRadioMark = new Radio({});
const utilButtonMark = new Tag({});

export function computeCheckboxCellHeight(
  cellValue: any,
  col: number,
  row: number,
  endCol: number,
  actStyle: FullExtendStyle,
  autoWrapText: boolean,
  iconWidth: number,
  fontSize: number,
  fontStyle: string,
  fontWeight: string,
  fontFamily: string,
  lineHeight: number,
  lineClamp: number | undefined,
  padding: [number, number, number, number],
  table: BaseTableAPI
) {
  const text = isObject(cellValue) ? (cellValue as any).text : cellValue;
  const lines = validToString(text).split('\n') || [];
  const cellWidth = table.getColsWidth(col, endCol);
  const size = getProp('size', actStyle, col, row, table);
  let maxHeight = 0;
  if (autoWrapText) {
    const spaceBetweenTextAndIcon = getProp('spaceBetweenTextAndIcon', actStyle, col, row, table);
    const maxLineWidth = cellWidth - (padding[1] + padding[3]) - iconWidth - size - spaceBetweenTextAndIcon;
    utilCheckBoxMark.setAttributes({
      text: {
        maxLineWidth,
        text: lines,
        fontSize,
        fontStyle,
        fontWeight,
        fontFamily,
        lineHeight,
        wordBreak: 'break-word',
        lineClamp
      },
      icon: {
        width: Math.floor(size / 1.4), // icon : box => 10 : 14
        height: Math.floor(size / 1.4)
      },
      box: {
        width: size,
        height: size
      },
      spaceBetweenTextAndIcon
    });
    utilCheckBoxMark.render();
    maxHeight = utilCheckBoxMark.AABBBounds.height();
  } else {
    maxHeight = Math.max(size, lines.length * lineHeight);
  }

  return maxHeight;
}

export function computeRadioCellHeight(
  cellValue: any,
  col: number,
  row: number,
  endCol: number,
  actStyle: FullExtendStyle,
  autoWrapText: boolean,
  iconWidth: number,
  fontSize: number,
  fontStyle: string,
  fontWeight: string,
  fontFamily: string,
  lineHeight: number,
  lineClamp: number | undefined,
  padding: [number, number, number, number],
  table: BaseTableAPI
) {
  if (isArray(cellValue)) {
    // multi radio
    let maxHeight = 0;
    const define = table.getBodyColumnDefine(col, row);
    const spaceBetweenRadio = getProp('spaceBetweenRadio', actStyle, col, row, table);
    const radioDirectionInCell = (define as RadioColumnDefine)?.radioDirectionInCell ?? 'vertical';
    if (radioDirectionInCell === 'vertical') {
      // sum all radio height
      cellValue.forEach((singleValue, index) => {
        const height = computeSingleRadioCellHeight(
          singleValue,
          col,
          row,
          endCol,
          actStyle,
          autoWrapText,
          iconWidth,
          fontSize,
          fontStyle,
          fontWeight,
          fontFamily,
          lineHeight,
          lineClamp,
          padding,
          table
        );
        maxHeight += height;
        if (index !== cellValue.length - 1) {
          maxHeight += spaceBetweenRadio;
        }
      });
    } else if (radioDirectionInCell === 'horizontal') {
      // get max radio height
      cellValue.forEach(singleValue => {
        const height = computeSingleRadioCellHeight(
          singleValue,
          col,
          row,
          endCol,
          actStyle,
          autoWrapText,
          iconWidth,
          fontSize,
          fontStyle,
          fontWeight,
          fontFamily,
          lineHeight,
          lineClamp,
          padding,
          table
        );
        maxHeight = Math.max(height, maxHeight);
      });
    }
    return maxHeight;
  }
  // single radio
  return computeSingleRadioCellHeight(
    cellValue,
    col,
    row,
    endCol,
    actStyle,
    autoWrapText,
    iconWidth,
    fontSize,
    fontStyle,
    fontWeight,
    fontFamily,
    lineHeight,
    lineClamp,
    padding,
    table
  );
}

export function computeSingleRadioCellHeight(
  cellValue: any,
  col: number,
  row: number,
  endCol: number,
  actStyle: FullExtendStyle,
  autoWrapText: boolean,
  iconWidth: number,
  fontSize: number,
  fontStyle: string,
  fontWeight: string,
  fontFamily: string,
  lineHeight: number,
  lineClamp: number | undefined,
  padding: [number, number, number, number],
  table: BaseTableAPI
) {
  const text = isObject(cellValue) ? (cellValue as any).text : cellValue;
  const lines = validToString(text).split('\n') || [];
  const cellWidth = table.getColsWidth(col, endCol);
  const size = getProp('size', actStyle, col, row, table);
  let outerRadius = getProp('outerRadius', actStyle, col, row, table);
  const circleSize = isNumber(outerRadius) ? outerRadius * 2 : size;
  let maxHeight = 0;
  if (autoWrapText) {
    const spaceBetweenTextAndIcon = getProp('spaceBetweenTextAndIcon', actStyle, col, row, table);
    const maxLineWidth = cellWidth - (padding[1] + padding[3]) - iconWidth - circleSize - spaceBetweenTextAndIcon;
    if (!isNumber(outerRadius)) {
      outerRadius = Math.round(size / 2);
    }
    utilRadioMark.setAttributes({
      text: {
        maxLineWidth,
        text: lines,
        fontSize,
        fontStyle,
        fontWeight,
        fontFamily,
        lineHeight,
        wordBreak: 'break-word',
        lineClamp
      },
      circle: {
        outerRadius
      },
      spaceBetweenTextAndIcon
    });
    utilRadioMark.render();
    maxHeight = utilRadioMark.AABBBounds.height();
  } else {
    maxHeight = Math.max(size, lines.length * lineHeight);
  }

  return maxHeight;
}

export function computeSwitchCellHeight(
  cellValue: any,
  col: number,
  row: number,
  endCol: number,
  actStyle: FullExtendStyle,
  autoWrapText: boolean,
  iconWidth: number,
  fontSize: number,
  fontStyle: string,
  fontWeight: string,
  fontFamily: string,
  lineHeight: number,
  lineClamp: number | undefined,
  padding: [number, number, number, number],
  table: BaseTableAPI
) {
  const boxWidth = getProp('boxWidth', actStyle, col, row, table);

  return boxWidth;
}

export function computeButtonCellHeight(
  cellValue: any,
  col: number,
  row: number,
  endCol: number,
  actStyle: FullExtendStyle,
  autoWrapText: boolean,
  iconWidth: number,
  fontSize: number,
  fontStyle: string,
  fontWeight: string,
  fontFamily: string,
  lineHeight: number,
  lineClamp: number | undefined,
  padding: [number, number, number, number],
  table: BaseTableAPI
) {
  const text = isObject(cellValue) ? (cellValue as any).text : cellValue;
  const lines = validToString(text).split('\n') || [];
  const cellWidth = table.getColsWidth(col, endCol);
  const buttonPadding = getProp('buttonPadding', actStyle, col, row, table);
  const buttonLineWidth = getProp('buttonLineWidth', actStyle, col, row, table);
  let maxHeight = 0;
  if (autoWrapText) {
    const maxLineWidth = cellWidth - (padding[1] + padding[3]);
    utilButtonMark.setAttributes({
      text: lines,
      textStyle: {
        maxLineWidth,
        fontSize,
        fontStyle,
        fontWeight,
        fontFamily,
        lineHeight,
        wordBreak: 'break-word',
        lineClamp
      },
      padding: buttonPadding,
      panel: {
        visible: true,
        fill: 'red',
        stroke: 'red',
        lineWidth: buttonLineWidth
      }
    });
    utilRadioMark.render();
    maxHeight = utilRadioMark.AABBBounds.height();
  } else {
    maxHeight = lines.length * lineHeight + buttonPadding * 2;
  }

  return maxHeight;
}
