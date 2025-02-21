import type { IThemeSpec } from '@src/vrender';
import { Group } from '../../graphic/group';
import type { CellRange, RadioColumnDefine, RadioStyleOption } from '../../../ts-types';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { cos, isArray, isBoolean, isNumber, isObject, isValid, merge } from '@visactor/vutils';
import type { RadioAttributes } from '@src/vrender';
import { Radio } from '@src/vrender';
import { getHierarchyOffset } from '../../utils/get-hierarchy-offset';
import { getOrApply } from '../../../tools/helper';
import type { RadioStyle } from '../../../body-helper/style/RadioStyle';
import { getProp } from '../../utils/get-prop';
import { getCellBorderStrokeWidth } from '../../utils/cell-border-stroke-width';

export function createRadioCellGroup(
  cellGroup: Group | null,
  columnGroup: Group,
  xOrigin: number,
  yOrigin: number,
  col: number,
  row: number,
  colWidth: number | 'auto',
  width: number,
  height: number,
  padding: number[],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  table: BaseTableAPI,
  cellTheme: IThemeSpec,
  define: RadioColumnDefine,
  range: CellRange
) {
  // cell
  if (!cellGroup) {
    const strokeArrayWidth = getCellBorderStrokeWidth(col, row, cellTheme, table);
    cellGroup = new Group({
      x: xOrigin,
      y: yOrigin,
      width,
      height,

      // 背景相关，cell背景由cellGroup绘制
      lineWidth: cellTheme?.group?.lineWidth ?? undefined,
      fill: cellTheme?.group?.fill ?? undefined,
      stroke: cellTheme?.group?.stroke ?? undefined,

      strokeArrayWidth: strokeArrayWidth,
      strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
      cursor: (cellTheme?.group as any)?.cursor ?? undefined,
      lineDash: cellTheme?.group?.lineDash ?? undefined,

      lineCap: 'butt',

      clip: true,

      cornerRadius: cellTheme.group.cornerRadius
    } as any);
    cellGroup.role = 'cell';
    cellGroup.col = col;
    cellGroup.row = row;
    // columnGroup?.addChild(cellGroup);
    columnGroup?.addCellGroup(cellGroup);
  }

  // radio
  const { width: radioWidth, height: radioHeight } = createRadio(
    col,
    row,
    colWidth,
    width,
    height,
    padding,
    cellTheme,
    define,
    cellGroup,
    range,
    table
  );

  // align in cell
  width -= padding[1] + padding[3];
  height -= padding[0] + padding[2];
  cellGroup.forEachChildren((radioComponent: Radio) => {
    if (textAlign === 'center') {
      radioComponent.setAttribute('x', padding[3] + radioComponent.attribute.x + (width - radioWidth) / 2);
    } else if (textAlign === 'right') {
      radioComponent.setAttribute('x', padding[3] + radioComponent.attribute.x + width - radioWidth);
    } else {
      radioComponent.setAttribute('x', padding[3] + radioComponent.attribute.x);
    }

    if (textBaseline === 'middle') {
      radioComponent.setAttribute('y', padding[0] + radioComponent.attribute.y + (height - radioHeight) / 2);
    } else if (textBaseline === 'bottom') {
      radioComponent.setAttribute('y', padding[0] + radioComponent.attribute.y + height - radioHeight);
    } else {
      radioComponent.setAttribute('y', padding[0] + radioComponent.attribute.y);
    }
  });

  return cellGroup;
}

export type CreateRadioCellGroup = typeof createRadioCellGroup;

function createRadio(
  col: number,
  row: number,
  colWidth: number | 'auto',
  cellWidth: number,
  cellHeight: number,
  padding: number[],
  cellTheme: IThemeSpec,
  define: RadioColumnDefine,
  cellGroup: Group,
  range: CellRange,
  table: BaseTableAPI
) {
  const style = table._getCellStyle(col, row) as RadioStyle;
  let size = getProp('size', style, col, row, table);
  let innerRadius = getProp('innerRadius', style, col, row, table);
  let outerRadius = getProp('outerRadius', style, col, row, table);
  const spaceBetweenTextAndIcon = getProp('spaceBetweenTextAndIcon', style, col, row, table);
  const spaceBetweenRadio = getProp('spaceBetweenRadio', style, col, row, table);
  const defaultFill = getProp('defaultFill', style, col, row, table);
  const defaultStroke = getProp('defaultStroke', style, col, row, table);
  const disableFill = getProp('disableFill', style, col, row, table);
  const checkedFill = getProp('checkedFill', style, col, row, table);
  const checkedStroke = getProp('checkedStroke', style, col, row, table);
  const disableCheckedFill = getProp('disableCheckedFill', style, col, row, table);
  const disableCheckedStroke = getProp('disableCheckedStroke', style, col, row, table);

  // deal width actual size
  if (isNumber(outerRadius)) {
    size = outerRadius * 2;
  } else {
    outerRadius = Math.round(size / 2);
  }
  if (!isNumber(innerRadius) || innerRadius < 0) {
    innerRadius = Math.round((outerRadius / 7) * 3);
  }

  const value = table.getCellValue(col, row) as
    | string
    | boolean
    | string[]
    | { text: string; checked?: boolean; disable?: boolean }
    | { text: string; checked?: boolean; disable?: boolean }[];
  const dataValue = table.getCellOriginValue(col, row);
  const hierarchyOffset = getHierarchyOffset(col, row, table);
  const cellStyle = table._getCellStyle(col, row) as RadioStyleOption; // to be fixed
  const autoWrapText = cellStyle.autoWrapText ?? table.internalProps.autoWrapText;
  const { lineClamp } = cellStyle;
  const autoColWidth = colWidth === 'auto';
  const autoRowHeight = table.isAutoRowHeight();

  const attribute = {
    // text: text.length === 1 ? text[0] : text,
    maxLineWidth: autoColWidth
      ? Infinity
      : cellWidth - (padding[1] + padding[3] + hierarchyOffset) - size - spaceBetweenTextAndIcon,
    // fill: true,
    textAlign: 'left',
    textBaseline: 'top',
    autoWrapText,
    lineClamp,
    wordBreak: 'break-word',
    // widthLimit: autoColWidth ? -1 : colWidth - (padding[1] + padding[3]),
    heightLimit: autoRowHeight ? -1 : cellHeight - Math.floor(padding[0] + padding[2]),
    pickable: false,
    dx: hierarchyOffset
    // whiteSpace: text.length === 1 && !autoWrapText ? 'no-wrap' : 'normal'
  };
  const testAttribute = cellTheme.text ? (Object.assign({}, cellTheme.text, attribute) as any) : attribute;
  const radioAttributes: RadioAttributes = {
    x: 0,
    y: 0,
    text: testAttribute,
    circle: {
      innerRadius,
      outerRadius
    },
    spaceBetweenTextAndIcon
  };

  defaultFill && (radioAttributes.circle.fill = defaultFill);
  defaultStroke && (radioAttributes.circle.stroke = defaultStroke);
  disableFill && (radioAttributes.circle.disableFill = disableFill);
  checkedFill && (radioAttributes.circle.checkedFill = checkedFill);
  checkedStroke && (radioAttributes.circle.checkedStroke = checkedStroke);
  disableCheckedFill && (radioAttributes.circle.disableCheckedFill = disableCheckedFill);
  disableCheckedStroke && (radioAttributes.circle.disableCheckedStroke = disableCheckedStroke);

  let width = 0;
  let height = 0;
  const direction = define.radioDirectionInCell ?? 'vertical';
  if (isArray(value)) {
    value.forEach((item, index) => {
      const radioComponent = createSingleRadio(
        item,
        dataValue,
        index,
        col,
        row,
        define,
        autoWrapText,
        radioAttributes,
        table
      );
      if (radioComponent) {
        cellGroup.appendChild(radioComponent);
      }
      radioComponent.id = `radio-${range?.start.col ?? col}-${range?.start.row ?? row}-${index}`;

      radioComponent.render();
      const bounds = radioComponent.AABBBounds;
      if (direction === 'vertical') {
        radioComponent.setAttribute('y', height);
        height += bounds.height() + (index !== value.length - 1 ? spaceBetweenRadio : 0);
        width = Math.max(width, bounds.width());
      } else if (direction === 'horizontal') {
        radioComponent.setAttribute('x', width);
        width += bounds.width() + (index !== value.length - 1 ? spaceBetweenRadio : 0);
        height = Math.max(height, bounds.height());
      }
    });
  } else {
    const radioComponent = createSingleRadio(
      value,
      dataValue,
      undefined,
      col,
      row,
      define,
      autoWrapText,
      radioAttributes,
      table
    );
    if (radioComponent) {
      cellGroup.appendChild(radioComponent);
    }
    radioComponent.id = `radio-${range?.start.col ?? col}-${range?.start.row ?? row}`;
    radioComponent.render();
    const bounds = radioComponent.AABBBounds;
    width = bounds.width();
    height = bounds.height();
  }

  return { width, height };
}

function createSingleRadio(
  value: any,
  dataValue: any,
  indexInCell: number | undefined,
  col: number,
  row: number,
  define: RadioColumnDefine,
  autoWrapText: boolean,
  cellRadioAttributes: RadioAttributes,
  table: BaseTableAPI
) {
  const isChecked = getChecked(value, dataValue, indexInCell, col, row, define, table);
  const isDisabled = getDisable(value, dataValue, col, row, define, table);
  const text = isObject(value) ? (value as any).text : isBoolean(value) ? '' : value ?? '';

  const radioAttributes = merge({}, cellRadioAttributes, {
    checked: isChecked,
    disabled: isDisabled,
    text: {
      text: text.length === 1 ? text[0] : text,
      whiteSpace: text.length === 1 && !autoWrapText ? 'no-wrap' : 'normal'
    },
    boundsPadding: 0
  });
  const radio = new Radio(radioAttributes);
  radio.name = 'radio';

  return radio;
}

function getChecked(
  value: any,
  dataValue: any,
  indexInCell: number | undefined,
  col: number,
  row: number,
  define: RadioColumnDefine,
  table: BaseTableAPI
) {
  const radioType = define.radioCheckType ?? 'column';
  let isChecked;
  let globalChecked;
  if (isObject(value)) {
    isChecked = (value as any).checked;
  } else if (typeof value === 'boolean') {
    isChecked = value;
  }
  isChecked = table.stateManager.syncRadioState(
    col,
    row,
    define.field as string | number,
    radioType,
    indexInCell,
    isChecked
  );
  if (isChecked === undefined || isChecked === null || typeof isChecked === 'function') {
    //isChecked无效值 取全局设置的值
    globalChecked = getOrApply(define.checked as any, {
      col,
      row,
      table,
      context: null,
      value,
      dataValue
    });
    isChecked = table.stateManager.syncRadioState(
      col,
      row,
      define.field as string | number,
      radioType,
      indexInCell,
      globalChecked
    );
  }

  return isChecked ?? globalChecked ?? false;
}

function getDisable(
  value: any,
  dataValue: any,
  col: number,
  row: number,
  define: RadioColumnDefine,
  table: BaseTableAPI
) {
  let isDisabled;
  if (isObject(value)) {
    isDisabled = (value as any).disable;
  }
  const globalDisable = getOrApply(define.disable as any, {
    col,
    row,
    table,
    context: null,
    value,
    dataValue
  });

  return isDisabled ?? globalDisable ?? false;
}
