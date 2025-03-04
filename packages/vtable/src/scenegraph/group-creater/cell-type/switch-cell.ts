import { Switch } from '@src/vrender';
import type { IThemeSpec, SwitchAttributes } from '@src/vrender';
import type { CellRange, SwitchStyle, SwitchColumnDefine, SwitchStyleOption } from '../../../ts-types';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { Group } from '../../graphic/group';
import { getCellBorderStrokeWidth } from '../../utils/cell-border-stroke-width';
import { getProp } from '../../utils/get-prop';
import { isObject } from '@visactor/vutils';
import { getOrApply } from '../../../tools/helper';
import { getHierarchyOffset } from '../../utils/get-hierarchy-offset';
import { dealWithIconLayout } from '../../utils/text-icon-layout';

export function createSwitchCellGroup(
  cellGroup: Group | null,
  columnGroup: Group,
  xOrigin: number,
  yOrigin: number,
  col: number,
  row: number,
  colWidth: number,
  width: number,
  height: number,
  padding: number[],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  mayHaveIcon: boolean,
  table: BaseTableAPI,
  cellTheme: IThemeSpec,
  define: SwitchColumnDefine,
  range: CellRange | undefined,
  isAsync: boolean
) {
  // cell
  if (!cellGroup) {
    const strokeArrayWidth = getCellBorderStrokeWidth(col, row, cellTheme, table);

    if (isAsync) {
      cellGroup = table.scenegraph.highPerformanceGetCell(col, row, true);
      if (cellGroup && cellGroup.role === 'cell') {
        cellGroup.setAttributes({
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
      }
    }
    if (!cellGroup || cellGroup.role !== 'cell') {
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
      columnGroup?.addCellGroup(cellGroup);
    }
  }

  let icons;
  if (mayHaveIcon) {
    let iconCol = col;
    let iconRow = row;
    if (range) {
      iconCol = range.start.col;
      iconRow = range.start.row;
    }
    icons = table.getCellIcons(iconCol, iconRow);
  }

  let iconWidth = 0;
  let cellLeftIconWidth = 0;
  let cellRightIconWidth = 0;
  if (Array.isArray(icons) && icons.length !== 0) {
    const { leftIconWidth, rightIconWidth, absoluteLeftIconWidth, absoluteRightIconWidth } = dealWithIconLayout(
      icons,
      cellGroup,
      range,
      table
    );

    iconWidth = leftIconWidth + rightIconWidth;
    cellLeftIconWidth = leftIconWidth;
    cellRightIconWidth = rightIconWidth;

    // 更新各个部分横向位置
    cellGroup.forEachChildren((child: any) => {
      if (child.role === 'icon-left') {
        child.setAttribute('x', child.attribute.x + padding[3]);
      } else if (child.role === 'icon-right') {
        child.setAttribute('x', child.attribute.x + width - rightIconWidth - padding[1]);
      } else if (child.role === 'icon-absolute-right') {
        child.setAttribute('x', child.attribute.x + width - absoluteRightIconWidth - padding[1]);
      }
    });

    // 更新各个部分纵向位置
    cellGroup.forEachChildren((child: any) => {
      if (textBaseline === 'middle') {
        child.setAttribute('y', (height - child.AABBBounds.height()) / 2);
      } else if (textBaseline === 'bottom') {
        child.setAttribute('y', height - child.AABBBounds.height() - padding[2]);
      } else {
        child.setAttribute('y', padding[0]);
      }
    });
  }

  const switchComponent = createSwitch(
    col,
    row,
    colWidth - iconWidth,
    width,
    height,
    padding,
    cellTheme,
    define,
    table
  );
  if (switchComponent) {
    cellGroup.appendChild(switchComponent);
  }

  switchComponent.render();

  width -= padding[1] + padding[3] + iconWidth;
  height -= padding[0] + padding[2];
  if (textAlign === 'center') {
    switchComponent.setAttribute(
      'x',
      padding[3] + cellLeftIconWidth + (width - switchComponent.AABBBounds.width()) / 2
    );
  } else if (textAlign === 'right') {
    switchComponent.setAttribute('x', padding[3] + cellLeftIconWidth + width - switchComponent.AABBBounds.width());
  } else {
    switchComponent.setAttribute('x', padding[3] + cellLeftIconWidth);
  }

  if (textBaseline === 'middle') {
    switchComponent.setAttribute('y', padding[0] + (height - switchComponent.AABBBounds.height()) / 2);
  } else if (textBaseline === 'bottom') {
    switchComponent.setAttribute('y', padding[0] + height - switchComponent.AABBBounds.height());
  } else {
    switchComponent.setAttribute('y', padding[0]);
  }

  return cellGroup;
}

function createSwitch(
  col: number,
  row: number,
  colWidth: number | 'auto',
  cellWidth: number,
  cellHeight: number,
  padding: number[],
  cellTheme: IThemeSpec,
  define: SwitchColumnDefine,
  table: BaseTableAPI
) {
  const style = table._getCellStyle(col, row) as SwitchStyle;

  const spaceBetweenTextAndCircle = getProp('spaceBetweenTextAndCircle', style, col, row, table);
  const circleRadius = getProp('circleRadius', style, col, row, table);
  const boxWidth = getProp('boxWidth', style, col, row, table);
  const boxHeight = getProp('boxHeight', style, col, row, table);
  const checkedFill = getProp('checkedFill', style, col, row, table);
  const uncheckedFill = getProp('uncheckedFill', style, col, row, table);
  const disableCheckedFill = getProp('disableCheckedFill', style, col, row, table);
  const disableUncheckedFill = getProp('disableUncheckedFill', style, col, row, table);
  const circleFill = getProp('circleFill', style, col, row, table);

  const value = table.getCellValue(col, row) as string | { text: string; checked: boolean; disable: boolean } | boolean;
  const dataValue = table.getCellOriginValue(col, row);
  let isChecked: boolean;
  let isDisabled;
  let text = (value as string) ?? '';
  if (isObject(value)) {
    isChecked = value.checked;
    isDisabled = value.disable;
    text = value.text ?? '';
  } else if (typeof value === 'boolean') {
    isChecked = value;
    text = '';
  }
  isChecked = table.stateManager.syncCheckedState(col, row, define.field as string | number, isChecked) as boolean;
  const hierarchyOffset = getHierarchyOffset(col, row, table);
  const cellStyle = table._getCellStyle(col, row) as SwitchStyleOption; // to be fixed
  const autoWrapText = cellStyle.autoWrapText ?? table.internalProps.autoWrapText;
  const { lineClamp } = cellStyle;
  const { checked, disable, uncheckedText, checkedText } = define;
  if (isChecked === undefined || isChecked === null || typeof isChecked === 'function') {
    //isChecked无效值 取全局设置的值
    const globalChecked = getOrApply(checked as any, {
      col,
      row,
      table,
      context: null,
      value,
      dataValue
    });
    isChecked = table.stateManager.syncCheckedState(
      col,
      row,
      define.field as string | number,
      globalChecked
    ) as boolean;
  }
  const globalDisable = getOrApply(disable as any, {
    col,
    row,
    table,
    context: null,
    value,
    dataValue
  });
  const checkedTextString = getOrApply(checkedText as any, {
    col,
    row,
    table,
    context: null,
    value,
    dataValue
  });
  const uncheckedTextString = getOrApply(uncheckedText as any, {
    col,
    row,
    table,
    context: null,
    value,
    dataValue
  });
  const autoColWidth = colWidth === 'auto';
  const autoRowHeight = table.isAutoRowHeight(row);

  const attribute = {
    text: text.length === 1 ? text[0] : text,
    maxLineWidth: autoColWidth
      ? Infinity
      : cellWidth - (padding[1] + padding[3] + hierarchyOffset) - circleRadius * 2 - spaceBetweenTextAndCircle,
    // fill: true,
    textAlign: 'left',
    textBaseline: 'top',
    autoWrapText,
    lineClamp,
    wordBreak: 'break-word',
    // widthLimit: autoColWidth ? -1 : colWidth - (padding[1] + padding[3]),
    heightLimit: autoRowHeight ? -1 : cellHeight - Math.floor(padding[0] + padding[2]),
    pickable: false,
    dx: hierarchyOffset,
    whiteSpace: text.length === 1 && !autoWrapText ? 'no-wrap' : 'normal',

    checkedText: checkedTextString,
    uncheckedText: uncheckedTextString
  };
  const testAttribute = cellTheme.text ? (Object.assign({}, cellTheme.text, attribute) as any) : attribute;
  const switchAttributes: SwitchAttributes = {
    x: 0,
    y: 0,
    text: testAttribute,
    circle: {
      radius: circleRadius
    },
    box: {
      width: boxWidth,
      height: boxHeight
    },
    spaceBetweenTextAndCircle,
    disabled: isDisabled ?? globalDisable ?? false
  };
  switchAttributes.checked = isChecked;

  uncheckedFill && (switchAttributes.box.uncheckedFill = uncheckedFill);
  disableUncheckedFill && (switchAttributes.box.disableUncheckedFill = disableUncheckedFill);
  checkedFill && (switchAttributes.box.checkedFill = checkedFill);
  disableCheckedFill && (switchAttributes.box.disableCheckedFill = disableCheckedFill);
  circleFill && (switchAttributes.circle.fill = circleFill);

  const switchComponent = new Switch(switchAttributes);
  switchComponent.name = 'switch';
  return switchComponent;
}

export type CreateSwitchCellGroup = typeof createSwitchCellGroup;
