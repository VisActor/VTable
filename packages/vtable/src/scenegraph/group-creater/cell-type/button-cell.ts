import { Tag } from '@src/vrender';
import type { IThemeSpec, TagAttributes } from '@src/vrender';
import type { CellRange, ButtonColumnDefine, ButtonStyleOption, ButtonStyle } from '../../../ts-types';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { Group } from '../../graphic/group';
import { getCellBorderStrokeWidth } from '../../utils/cell-border-stroke-width';
import { getProp } from '../../utils/get-prop';
import { isObject } from '@visactor/vutils';
import { getOrApply } from '../../../tools/helper';
import { getHierarchyOffset } from '../../utils/get-hierarchy-offset';
import { dealWithIconLayout } from '../../utils/text-icon-layout';

export function createButtonCellGroup(
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
  define: ButtonColumnDefine,
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

  const buttonComponent = createButton(
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
  if (buttonComponent) {
    cellGroup.appendChild(buttonComponent);
  }

  // buttonComponent.render();

  width -= padding[1] + padding[3] + iconWidth;
  height -= padding[0] + padding[2];
  if (textAlign === 'center') {
    buttonComponent.setAttribute(
      'x',
      padding[3] + cellLeftIconWidth + (width - buttonComponent.AABBBounds.width()) / 2
    );
  } else if (textAlign === 'right') {
    buttonComponent.setAttribute('x', padding[3] + cellLeftIconWidth + width - buttonComponent.AABBBounds.width());
  } else {
    buttonComponent.setAttribute('x', padding[3] + cellLeftIconWidth);
  }

  if (textBaseline === 'middle') {
    buttonComponent.setAttribute('y', padding[0] + (height - buttonComponent.AABBBounds.height()) / 2);
  } else if (textBaseline === 'bottom') {
    buttonComponent.setAttribute('y', padding[0] + height - buttonComponent.AABBBounds.height());
  } else {
    buttonComponent.setAttribute('y', padding[0]);
  }

  return cellGroup;
}

function createButton(
  col: number,
  row: number,
  colWidth: number | 'auto',
  cellWidth: number,
  cellHeight: number,
  padding: number[],
  cellTheme: IThemeSpec,
  define: ButtonColumnDefine,
  table: BaseTableAPI
) {
  const style = table._getCellStyle(col, row) as ButtonStyle;
  const buttonColor = getProp('buttonColor', style, col, row, table);
  const buttonBorderColor = getProp('buttonBorderColor', style, col, row, table);
  const buttonLineWidth = getProp('buttonLineWidth', style, col, row, table);
  const buttonBorderRadius = getProp('buttonBorderRadius', style, col, row, table);
  const buttonHoverColor = getProp('buttonHoverColor', style, col, row, table);
  const buttonHoverBorderColor = getProp('buttonHoverBorderColor', style, col, row, table);
  const buttonPadding = getProp('buttonPadding', style, col, row, table);
  const buttonTextHoverColor = getProp('buttonTextHoverColor', style, col, row, table);
  const buttonDisableColor = getProp('buttonDisableColor', style, col, row, table);
  const buttonDisableBorderColor = getProp('buttonDisableBorderColor', style, col, row, table);
  const buttonTextDisableColor = getProp('buttonTextDisableColor', style, col, row, table);

  const value = table.getCellValue(col, row) as string | { text: string; checked: boolean; disable: boolean } | boolean;
  const dataValue = table.getCellOriginValue(col, row);
  const hierarchyOffset = getHierarchyOffset(col, row, table);
  const cellStyle = table._getCellStyle(col, row) as ButtonStyleOption; // to be fixed
  const autoWrapText = cellStyle.autoWrapText ?? table.internalProps.autoWrapText;
  const { lineClamp } = cellStyle;
  const autoColWidth = colWidth === 'auto';
  const autoRowHeight = table.isAutoRowHeight(row);

  const { disable, text } = define;
  const isDisable = getOrApply(disable as any, {
    col,
    row,
    table,
    context: null,
    value,
    dataValue
  });
  const buttonTextValue = getOrApply(text as any, {
    col,
    row,
    table,
    context: null,
    value,
    dataValue
  });

  const buttonText = buttonTextValue ?? (value as string) ?? '';

  const attribute = {
    maxLineWidth: autoColWidth ? Infinity : cellWidth - (padding[1] + padding[3] + hierarchyOffset),
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
    whiteSpace: buttonText.length === 1 && !autoWrapText ? 'no-wrap' : 'normal'
  };
  const testAttribute = cellTheme.text ? (Object.assign({}, cellTheme.text, attribute) as any) : attribute;

  const buttonAttributes: TagAttributes = {
    x: 0,
    y: 0,
    cursor: isDisable ? 'not-allowed' : 'pointer',
    disable: isDisable,
    childrenPickable: false,
    text: buttonText.length === 1 ? buttonText[0] : buttonText,
    textStyle: testAttribute,
    padding: buttonPadding,
    panel: {
      visible: true,
      fill: isDisable ? buttonDisableColor : buttonColor,
      stroke: isDisable ? buttonDisableBorderColor : buttonBorderColor,
      lineWidth: buttonLineWidth,
      cornerRadius: buttonBorderRadius
    },
    state: {
      text: {},
      panel: {
        hover: {
          fill: buttonHoverColor,
          stroke: buttonHoverBorderColor
        }
      }
    }
  } as any;
  buttonTextDisableColor && (buttonAttributes.state.text.fill = buttonTextDisableColor);
  buttonTextHoverColor && (buttonAttributes.state.text.hover.fill = buttonTextHoverColor);

  const buttonComponent = new Tag(buttonAttributes);
  buttonComponent.name = 'button';

  if (!isDisable) {
    buttonComponent.addEventListener('mouseenter', () => {
      buttonComponent.addState('hover', true, false);
      buttonComponent.stage.renderNextFrame();
    });
    buttonComponent.addEventListener('mouseleave', () => {
      buttonComponent.removeState('hover', false);
      buttonComponent.stage.renderNextFrame();
    });
  }

  return buttonComponent;
}

export type CreateButtonCellGroup = typeof createButtonCellGroup;
