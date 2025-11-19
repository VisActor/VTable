import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import { isLeftOrRightAxis, isTopOrBottomAxis } from '../layout/chart-helper/get-axis-config';
import { isFunction } from '@visactor/vutils';
import * as headerStyleContents from '../header-helper/style';
import * as columnStyleContents from '../body-helper/style';
import type { BaseTableAPI, HeaderData, PivotTableProtected } from '../ts-types/base-table';
import type { ColorPropertyDefine, FullExtendStyle, MappingRule } from '../ts-types';
import { mergeStyle } from '../plugins/custom-cell-style';

const EMPTY_STYLE = {};

/**
 * 获取单元格的样式 内部逻辑使用 获取到的样式并不是计算后的
 * @param col
 * @param row
 * @returns
 */
export function getCellStyle(col: number, row: number, table: BaseTableAPI): FullExtendStyle {
  const customCellStyle = table.customCellStylePlugin?.getCustomCellStyle(col, row);
  const { layoutMap } = table.internalProps;
  const isHeader = layoutMap.isHeader(col, row);
  if (isHeader) {
    // const cacheKey = `${col}-${row}`;
    let cacheKey;
    if (table.isPivotTable() && !table.isBottomFrozenRow(row) && !table.isRightFrozenColumn(col)) {
      // use dimensionKey&indicatorKey to cache style object in pivot table
      const define = table.getHeaderDefine(col, row) as any;
      const isCorner = table.isCornerHeader(col, row);
      cacheKey = define?.dimensionKey
        ? isCorner
          ? `dim-cor-${define.dimensionKey}`
          : `dim-${define.dimensionKey}`
        : define?.indicatorKey
        ? `ind-${define.indicatorKey}`
        : `${col}-${row}`;
    } else {
      cacheKey = `${col}-${row}`;
    }
    let cacheStyle = table.headerStyleCache.get(cacheKey);
    if (cacheStyle) {
      if (customCellStyle) {
        return mergeStyle(cacheStyle, customCellStyle);
      }
      return cacheStyle;
    }
    const hd = layoutMap.getHeader(col, row);

    let paddingForAxis;
    if (
      table.isPivotChart() &&
      isTopOrBottomAxis(col, row, layoutMap as PivotHeaderLayoutMap) &&
      layoutMap.isAxisCell(col, row)
    ) {
      // get chart padding for axis cell
      const chartColumn = layoutMap.getBody(col, table.rowHeaderLevelCount);
      const padding = (chartColumn.style as any)?.padding ?? table.theme.bodyStyle.padding;
      paddingForAxis = padding;
    } else if (
      table.isPivotChart() &&
      isLeftOrRightAxis(col, row, layoutMap as PivotHeaderLayoutMap) &&
      layoutMap.isAxisCell(col, row)
    ) {
      // get chart padding for axis cell
      const chartColumn = layoutMap.getBody(table.columnHeaderLevelCount, row);
      const padding = (chartColumn.style as any)?.padding ?? table.theme.bodyStyle.padding;
      paddingForAxis = padding;
    }

    if (
      (!hd || (hd as HeaderData).isEmpty) &&
      (layoutMap.isLeftBottomCorner(col, row) ||
        layoutMap.isRightBottomCorner(col, row) ||
        layoutMap.isCornerHeader(col, row) ||
        layoutMap.isRightTopCorner(col, row))
    ) {
      return EMPTY_STYLE;
    }

    const styleClass = table.internalProps.headerHelper.getStyleClass((hd as HeaderData)?.headerType || 'text');
    if (layoutMap.isBottomFrozenRow(col, row) && table.theme.bottomFrozenStyle) {
      cacheStyle = <FullExtendStyle>headerStyleContents.of(
        paddingForAxis ? { padding: paddingForAxis } : {},
        table.theme.bottomFrozenStyle,
        {
          col,
          row,
          table: table as BaseTableAPI,
          value: table.getCellValue(col, row),
          dataValue: table.getCellOriginValue(col, row),
          cellHeaderPaths: table.getCellHeaderPaths(col, row)
        },
        styleClass,
        table.options.autoWrapText,
        table.theme
      );
    } else if (layoutMap.isRightFrozenColumn(col, row) && table.theme.rightFrozenStyle) {
      cacheStyle = <FullExtendStyle>headerStyleContents.of(
        paddingForAxis ? { padding: paddingForAxis } : {},
        table.theme.rightFrozenStyle,
        {
          col,
          row,
          table: table as BaseTableAPI,
          value: table.getCellValue(col, row),
          dataValue: table.getCellOriginValue(col, row),
          cellHeaderPaths: table.getCellHeaderPaths(col, row)
        },
        styleClass,
        table.options.autoWrapText,
        table.theme
      );
    } else {
      // let defaultStyle;
      // if (layoutMap.isColumnHeader(col, row) || layoutMap.isBottomFrozenRow(col, row)) {
      //   defaultStyle = table.theme.headerStyle;
      // } else if (table.internalProps.transpose && layoutMap.isRowHeader(col, row)) {
      //   defaultStyle = table.theme.headerStyle;
      // } else if (layoutMap.isRowHeader(col, row) || layoutMap.isRightFrozenColumn(col, row)) {
      //   defaultStyle = table.theme.rowHeaderStyle;
      // } else {
      //   defaultStyle = table.theme.cornerHeaderStyle;
      // }
      // const styleClass = hd.headerType.StyleClass; //BaseHeader文件
      // const { style } = hd;
      const style = hd?.style || {};
      if (paddingForAxis) {
        (style as any).padding = paddingForAxis;
      }
      cacheStyle = <FullExtendStyle>headerStyleContents.of(
        style,
        // defaultStyle,
        layoutMap.isColumnHeader(col, row) || layoutMap.isBottomFrozenRow(col, row)
          ? table.theme.headerStyle
          : layoutMap.isRowHeader(col, row) || layoutMap.isRightFrozenColumn(col, row)
          ? table.theme.rowHeaderStyle
          : table.theme.cornerHeaderStyle,
        {
          col,
          row,
          table: table as BaseTableAPI,
          value: table.getCellValue(col, row),
          dataValue: table.getCellOriginValue(col, row),
          cellHeaderPaths: table.getCellHeaderPaths(col, row)
        },
        styleClass,
        table.options.autoWrapText,
        table.theme
      );
    }
    table.headerStyleCache.set(cacheKey, cacheStyle);
    if (customCellStyle) {
      return mergeStyle(cacheStyle, customCellStyle);
    }
    return cacheStyle;
  }

  let bgColorFunc: ColorPropertyDefine;
  // 判断是否有mapping  遍历dataset中mappingRules
  if ((table.internalProps as PivotTableProtected)?.dataConfig?.mappingRules && !table.isHeader(col, row)) {
    (table.internalProps as PivotTableProtected)?.dataConfig?.mappingRules?.forEach(
      (mappingRule: MappingRule, i: number) => {
        if (
          mappingRule.bgColor &&
          (table.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row) ===
            mappingRule.bgColor.indicatorKey
        ) {
          bgColorFunc = mappingRule.bgColor.mapping;
        }
      }
    );
    // // 判断是否有mapping  遍历dataset中mappingRules 但这里还需要根据fieldName来判断
    // if (bgColorFunc && typeof bgColorFunc === 'function') {
    //   const cellValue = table.getCellOriginValue(col, row);
    //   bgColor = bgColorFunc(this, cellValue);
    // }
  }

  let cacheKey;
  const cellType = table.getCellType(col, row);
  const rawRecord = table.getCellOriginRecord(col, row);

  //如果是主体部分，获取相应的style
  if (rawRecord?.vtableMerge) {
    cacheKey = 'merge-title';
  } else if (table.isSeriesNumberInBody(col, row)) {
    // 如果是行序号
    cacheKey = `${col}-series-` + cellType;
  } else if (
    (table.isListTable() && !(table as any).transpose) ||
    (table.isPivotTable() && (table.internalProps.layoutMap as PivotHeaderLayoutMap).indicatorsAsCol)
  ) {
    cacheKey = col + cellType;
  } else {
    cacheKey = row + cellType;
  }
  let cacheStyle;

  if (rawRecord?.vtableMerge) {
    cacheStyle = table.bodyMergeTitleCache.get(cacheKey);
  } else if (layoutMap.isBottomFrozenRow(row)) {
    cacheStyle = table.bodyBottomStyleCache.get(cacheKey);
  } else {
    cacheStyle = table.bodyStyleCache.get(cacheKey);
  }
  if (cacheStyle) {
    if (customCellStyle) {
      return mergeStyle(cacheStyle, customCellStyle);
    }
    return cacheStyle;
  }
  const column = layoutMap.getBody(col, row);
  // const styleClass = column?.cellType?.StyleClass; //BaseColumn文件
  const styleClass = table.internalProps.bodyHelper.getStyleClass(table.getCellType(col, row));
  const style = column?.style;
  cacheStyle = <FullExtendStyle>columnStyleContents.of(
    style,
    rawRecord?.vtableMerge && table.theme.groupTitleStyle
      ? table.theme.groupTitleStyle
      : layoutMap.isBottomFrozenRow(row) && table.theme.bottomFrozenStyle
      ? table.theme.bottomFrozenStyle
      : layoutMap.isRightFrozenColumn(col) && table.theme.rightFrozenStyle
      ? table.theme.rightFrozenStyle
      : table.theme.bodyStyle,
    {
      col,
      row,
      table: table,
      value: table.getCellValue(col, row),
      dataValue: table.getCellOriginValue(col, row),
      cellHeaderPaths: table.getCellHeaderPaths(col, row)
    },
    styleClass,
    table.options.autoWrapText,
    table.theme
  );
  if (bgColorFunc) {
    cacheStyle = mergeStyle(cacheStyle as any, { bgColor: bgColorFunc });
  }
  if (!isFunction(style)) {
    if (layoutMap.isBottomFrozenRow(row)) {
      table.bodyBottomStyleCache.set(cacheKey, cacheStyle);
    } else {
      table.bodyStyleCache.set(cacheKey, cacheStyle);
    }
  }
  if (customCellStyle) {
    return mergeStyle(cacheStyle as any, customCellStyle);
  }
  return cacheStyle;
}
