import type { IThemeSpec } from '@src/vrender';
import { Group } from '../../graphic/group';
import {
  InternalIconName,
  type CellInfo,
  type CellRange,
  type CheckboxColumnDefine,
  type CheckboxStyleOption,
  type ColumnIconOption,
  type SparklineSpec
} from '../../../ts-types';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { isObject } from '@visactor/vutils';
import type { CheckboxAttributes } from '@src/vrender';
import { CheckBox } from '@src/vrender';
import { getHierarchyOffset } from '../../utils/get-hierarchy-offset';
import { getOrApply } from '../../../tools/helper';
import type { CheckboxStyle } from '../../../body-helper/style/CheckboxStyle';
import { getProp } from '../../utils/get-prop';
import { getCellBorderStrokeWidth } from '../../utils/cell-border-stroke-width';
import { dealWithIcon, dealWithIconLayout } from '../../utils/text-icon-layout';
import { CheckboxContent } from '../../component/checkbox-content';
import { CUSTOM_CONTAINER_NAME } from '../../component/custom';
import type { ListTable } from '../../..';

export function createCheckboxCellGroup(
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
  define: CheckboxColumnDefine,
  range: CellRange | undefined,
  isAsync: boolean,
  isCheckboxTree: boolean
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
  let cellabsoluteRightIconWidth = 0;
  let cellContentLeftIcons: ColumnIconOption[] = [];
  let cellContentRightIcons: ColumnIconOption[] = [];
  if (Array.isArray(icons) && icons.length !== 0) {
    const {
      leftIconWidth,
      rightIconWidth,
      contentLeftIcons,
      contentRightIcons,
      absoluteLeftIconWidth,
      absoluteRightIconWidth
    } = dealWithIconLayout(icons, cellGroup, range, table);

    iconWidth = leftIconWidth + rightIconWidth;
    cellLeftIconWidth = leftIconWidth;
    cellRightIconWidth = rightIconWidth;
    cellContentLeftIcons = contentLeftIcons;
    cellContentRightIcons = contentRightIcons;
    cellabsoluteRightIconWidth = absoluteRightIconWidth;

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

  // checkbox
  const checkboxComponent = createCheckbox(
    col,
    row,
    colWidth - iconWidth,
    width,
    height,
    padding,
    cellTheme,
    define,
    table,
    isCheckboxTree
  );

  // 目前只支持展示折叠或者展开icons
  if (
    cellContentLeftIcons.length === 1 &&
    (cellContentLeftIcons[0].name === InternalIconName.expandIconName ||
      cellContentLeftIcons[0].name === InternalIconName.collapseIconName)
  ) {
    const checkContent = new CheckboxContent({
      x: 0,
      y: 0,
      fill: false,
      stroke: false,
      pickable: false
    });
    checkContent.name = 'checkbox-content';

    checkContent.setCheckboxContentOption({
      autoWidth: false,
      autoHeight: false,
      cellWidth: width - (padding[1] + padding[3]),
      cellHeight: height - padding[0] - padding[2],
      align: textAlign,
      baseline: textBaseline
    });

    const dealWithIconComputeVar = {
      addedHierarchyOffset: 0
    }; //为了只增加一次indent的缩进值，如果有两个icon都dealWithIcon的话

    cellContentLeftIcons.forEach(icon => {
      const iconMark = dealWithIcon(
        icon,
        undefined,
        cellGroup.col,
        cellGroup.row,
        range,
        table,
        dealWithIconComputeVar
      );
      iconMark.role = 'icon-content-left';
      iconMark.name = icon.name;
      checkContent.addLeftOccupyingIcon(iconMark);
    });

    if (checkboxComponent) {
      checkContent.addCheckbox(checkboxComponent);
    }
    cellGroup.appendChild(checkContent);
    checkContent.layout();

    const contentWidth = checkContent.AABBBounds.width();
    const contentHeight = checkContent.AABBBounds.height();

    // 内容添加后单元格的宽高
    const Awidth = false
      ? cellLeftIconWidth + contentWidth + cellRightIconWidth // + padding[1] + padding[3]
      : width - (padding[1] + padding[3]);
    const Aheight = height - (padding[0] + padding[2]);

    // 更新各个部分横向位置
    cellGroup.forEachChildren((child: any) => {
      if (child.role === 'icon-left') {
        child.setAttribute('x', child.attribute.x + padding[3]);
      } else if (child.role === 'icon-right') {
        child.setAttribute('x', child.attribute.x + Awidth - cellRightIconWidth + padding[3]);
      } else if (child.role === 'icon-absolute-right') {
        child.setAttribute('x', child.attribute.x + Awidth - cellabsoluteRightIconWidth + padding[3] + padding[1]);
      } else if (child.name === 'content' || child.name === 'checkbox-content') {
        if (textAlign === 'center' && child.type !== 'richtext') {
          child.setAttribute(
            'x',
            padding[3] + cellLeftIconWidth + (Awidth - cellLeftIconWidth - cellRightIconWidth) / 2
          );
        } else if (textAlign === 'right' && child.type !== 'richtext') {
          child.setAttribute('x', padding[3] + Awidth - cellRightIconWidth);
        } else {
          child.setAttribute('x', padding[3] + cellLeftIconWidth);
        }
      }
    });

    // 更新各个部分纵向位置
    cellGroup.forEachChildren((child: any) => {
      if (child.name === CUSTOM_CONTAINER_NAME) {
        return;
      }
      if (textBaseline === 'middle') {
        // child.setAttribute('y', padding[0] + (Aheight - child.AABBBounds.height()) / 2);
        if (child?._checkboxGroup as Group) {
          child._leftGroup.setAttribute('y', padding[0] + (Aheight - child._checkboxGroup.AABBBounds.height()) / 2);
        }
      } else if (textBaseline === 'bottom') {
        child.setAttribute('y', padding[0] + Aheight - child.AABBBounds.height());
      } else {
        child.setAttribute('y', padding[0]);
      }
    });
  } else {
    if (checkboxComponent) {
      cellGroup.appendChild(checkboxComponent);
    }

    checkboxComponent.render();
  }

  width -= padding[1] + padding[3] + iconWidth;
  height -= padding[0] + padding[2];
  if (textAlign === 'center') {
    checkboxComponent.setAttribute(
      'x',
      padding[3] + cellLeftIconWidth + (width - checkboxComponent.AABBBounds.width()) / 2
    );
  } else if (textAlign === 'right') {
    checkboxComponent.setAttribute('x', padding[3] + cellLeftIconWidth + width - checkboxComponent.AABBBounds.width());
  } else {
    checkboxComponent.setAttribute('x', padding[3] + cellLeftIconWidth);
  }

  if (textBaseline === 'middle') {
    checkboxComponent.setAttribute('y', padding[0] + (height - checkboxComponent.AABBBounds.height()) / 2);
  } else if (textBaseline === 'bottom') {
    checkboxComponent.setAttribute('y', padding[0] + height - checkboxComponent.AABBBounds.height());
  } else {
    checkboxComponent.setAttribute('y', padding[0]);
  }

  return cellGroup;
}

function createCheckbox(
  col: number,
  row: number,
  colWidth: number | 'auto',
  cellWidth: number,
  cellHeight: number,
  padding: number[],
  cellTheme: IThemeSpec,
  define: CheckboxColumnDefine,
  table: BaseTableAPI,
  isCheckboxTree: boolean
) {
  const style = table._getCellStyle(col, row) as CheckboxStyle;
  const size = getProp('size', style, col, row, table);
  const spaceBetweenTextAndIcon = getProp('spaceBetweenTextAndIcon', style, col, row, table);
  const defaultFill = getProp('defaultFill', style, col, row, table);
  const defaultStroke = getProp('defaultStroke', style, col, row, table);
  const disableFill = getProp('disableFill', style, col, row, table);
  const checkedFill = getProp('checkedFill', style, col, row, table);
  const checkedStroke = getProp('checkedStroke', style, col, row, table);
  const disableCheckedFill = getProp('disableCheckedFill', style, col, row, table);
  const disableCheckedStroke = getProp('disableCheckedStroke', style, col, row, table);
  const checkIconImage = getProp('checkIconImage', style, col, row, table);
  const indeterminateIconImage = getProp('indeterminateIconImage', style, col, row, table);

  const value = table.getCellValue(col, row) as string | { text: string; checked: boolean; disable: boolean } | boolean;
  const dataValue = table.getCellOriginValue(col, row);
  let isChecked;
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
  // 处理 rowSeriesNumbe 在record设置checkbox是否勾选与是否禁用的场景
  if (table.internalProps.layoutMap.isSeriesNumber(col, row)) {
    const checkboxSeriesNumberStyle = (table as ListTable).getFieldData(define.field, col, row);
    if (checkboxSeriesNumberStyle) {
      if (typeof checkboxSeriesNumberStyle === 'string') {
      } else if (typeof checkboxSeriesNumberStyle === 'object') {
        isChecked = checkboxSeriesNumberStyle.checked;
        isDisabled = checkboxSeriesNumberStyle.disable;
      } else if (typeof checkboxSeriesNumberStyle === 'boolean') {
        isChecked = checkboxSeriesNumberStyle;
      }
    }
  }
  isChecked = table.stateManager.syncCheckedState(col, row, define.field as string | number, isChecked);
  const hierarchyOffset = getHierarchyOffset(col, row, table);
  const cellStyle = table._getCellStyle(col, row) as CheckboxStyleOption; // to be fixed
  const autoWrapText = cellStyle.autoWrapText ?? table.internalProps.autoWrapText;
  const { lineClamp } = cellStyle;
  const { checked, disable } = define;
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
    isChecked = table.stateManager.syncCheckedState(col, row, define.field as string | number, globalChecked);
  }
  const globalDisable = getOrApply(disable as any, {
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
    dx: isCheckboxTree ? 0 : hierarchyOffset,
    whiteSpace: text.length === 1 && !autoWrapText ? 'no-wrap' : 'normal'
  };
  const testAttribute = cellTheme.text ? (Object.assign({}, cellTheme.text, attribute) as any) : attribute;
  const checkboxAttributes: CheckboxAttributes = {
    x: 0,
    y: 0,
    text: testAttribute,
    icon: {
      width: Math.floor(size / 1.4), // icon : box => 10 : 14
      height: Math.floor(size / 1.4)
    },
    box: {
      width: size,
      height: size
    },
    dx: isCheckboxTree ? hierarchyOffset : 0,
    spaceBetweenTextAndIcon,
    disabled: isDisabled ?? globalDisable ?? false
  };

  if (isChecked === 'indeterminate') {
    checkboxAttributes.checked = undefined;
    checkboxAttributes.indeterminate = true;
  } else {
    checkboxAttributes.checked = isChecked;
    checkboxAttributes.indeterminate = undefined;
  }
  defaultFill && (checkboxAttributes.box.fill = defaultFill);
  defaultStroke && (checkboxAttributes.box.stroke = defaultStroke);
  disableFill && (checkboxAttributes.box.disableFill = disableFill);
  checkedFill && (checkboxAttributes.box.checkedFill = checkedFill);
  checkedStroke && (checkboxAttributes.box.checkedStroke = checkedStroke);
  disableCheckedFill && (checkboxAttributes.box.disableCheckedFill = disableCheckedFill);
  disableCheckedStroke && (checkboxAttributes.box.disableCheckedStroke = disableCheckedStroke);
  checkIconImage && (checkboxAttributes.icon.checkIconImage = checkIconImage);
  indeterminateIconImage && (checkboxAttributes.icon.indeterminateIconImage = indeterminateIconImage);

  const checkbox = new CheckBox(checkboxAttributes);
  checkbox.name = 'checkbox';

  return checkbox;
}

export type CreateCheckboxCellGroup = typeof createCheckboxCellGroup;
