import type { Cursor, IThemeSpec } from '@visactor/vrender';
import type { ProgressBarStyle } from '../../body-helper/style/ProgressBarStyle';
import { regUrl } from '../../tools/global';
import type {
  CellRange,
  ChartColumnDefine,
  CheckboxColumnDefine,
  ColumnDefine,
  ColumnTypeOption,
  ICustomRender,
  ImageColumnDefine,
  MappingRule,
  ProgressbarColumnDefine,
  TextColumnDefine
} from '../../ts-types';
import { dealWithCustom } from '../component/custom';
import type { Group } from '../graphic/group';
import { getProp } from '../utils/get-prop';
import { createChartCellGroup } from './cell-type/chart-cell';
import { createImageCellGroup } from './cell-type/image-cell';
import { createProgressBarCell } from './cell-type/progress-bar-cell';
import { createSparkLineCellGroup } from './cell-type/spark-line-cell';
import { createCellGroup } from './cell-type/text-cell';
import { createVideoCellGroup } from './cell-type/video-cell';
import type { ICustomLayoutFuc } from '../../ts-types/customLayout';
import type { BaseTableAPI, PivotTableProtected } from '../../ts-types/base-table';
import { getStyleTheme } from '../../core/tableHelper';
import { isPromise } from '../../tools/helper';
import { dealPromiseData } from '../utils/deal-promise-data';
import { CartesianAxis } from '../../components/axis/axis';
import { createCheckboxCellGroup } from './cell-type/checkbox-cell';
// import type { PivotLayoutMap } from '../../layout/pivot-layout';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import { resizeCellGroup } from './column-helper';
import { getHierarchyOffset } from '../utils/get-hierarchy-offset';
import { getQuadProps } from '../utils/padding';
import { convertInternal } from '../../tools/util';

export function createCell(
  type: ColumnTypeOption,
  value: string,
  define: ColumnDefine,
  table: BaseTableAPI,
  col: number,
  row: number,
  colWidth: number,
  cellWidth: number,
  cellHeight: number,
  columnGroup: Group,
  y: number,
  padding: [number, number, number, number],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  mayHaveIcon: boolean,
  cellTheme: IThemeSpec
): Group {
  if (isPromise(value)) {
    value = table.getCellValue(col, row);
  }
  let bgColorFunc: Function;
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
  }
  let cellGroup: Group;
  if (type === 'text' || type === 'link') {
    if (type === 'link') {
      //如果是超链接 颜色按照linkColor绘制 TODO：放到方法_getCellStyle中
      // const columnDefine = table.getHeaderDefine(col, row);
      const cellValue = value;
      const headerStyle = table._getCellStyle(col, row);

      if (
        type === 'link' &&
        (('templateLink' in define && define.templateLink) ||
          !('linkDetect' in define && define.linkDetect) ||
          regUrl.test(cellValue))
      ) {
        if (cellTheme) {
          cellTheme.text.fill = getProp('linkColor', headerStyle, col, row, table);
          (cellTheme as any).group.cursor = 'pointer';
        } else {
          cellTheme = {
            text: {
              fill: getProp('linkColor', headerStyle, col, row, table)
            },
            group: {
              cursor: 'pointer' as Cursor
            }
          };
        }
      }
    }
    // 判断是否有mapping  遍历dataset中mappingRules 但这里还需要根据fieldName来判断
    if (bgColorFunc) {
      const cellValue = table.getCellOriginValue(col, row);
      const bgColor = bgColorFunc(table, cellValue);
      if (bgColor) {
        if (cellTheme) {
          cellTheme.group.fill = bgColor;
        } else {
          cellTheme = {
            group: {
              fill: bgColor
            }
          };
        }
      }
    }

    let customElementsGroup;
    let renderDefault = true;
    let customRender;
    let customLayout;
    const cellLocation = table.getCellLocation(col, row);
    if (cellLocation !== 'body') {
      customRender = define?.headerCustomRender;
      customLayout = define?.headerCustomLayout;
    } else {
      customRender = define?.customRender || table.customRender;
      customLayout = define?.customLayout;
    }

    if (customLayout || customRender) {
      // const { autoRowHeight } = table.internalProps;
      const customResult = dealWithCustom(
        customLayout,
        customRender,
        col,
        row,
        cellWidth,
        cellHeight,
        false,
        table.heightMode === 'autoHeight',
        table
      );
      customElementsGroup = customResult.elementsGroup;
      renderDefault = customResult.renderDefault;
    }
    cellGroup = createCellGroup(
      table,
      value,
      columnGroup,
      0,
      y,
      col,
      row,
      colWidth,
      cellWidth,
      cellHeight,
      padding,
      textAlign,
      textBaseline,
      mayHaveIcon,
      customElementsGroup,
      renderDefault,
      cellTheme
    );

    const axisConfig = table.internalProps.layoutMap.getAxisConfigInPivotChart(col, row);
    if (axisConfig) {
      const spec = table.internalProps.layoutMap.getRawChartSpec(col, row);
      const axis = new CartesianAxis(
        axisConfig,
        cellGroup.attribute.width,
        cellGroup.attribute.height,
        padding,
        spec?.theme,
        table
      );
      cellGroup.clear();
      cellGroup.appendChild(axis.component);
      axis.overlap();
    } else if (table.internalProps.layoutMap.isEmpty(col, row)) {
      cellGroup.setAttributes({
        fill: false,
        stroke: false
      });
      cellGroup.clear();
    } else if (table.internalProps.layoutMap.isAxisCell(col, row)) {
      cellGroup.clear();
    }

    // if ((define as any)?.isAxis && cellLocation === 'columnHeader') {
    //   cellGroup.setAttribute('clip', false);
    //   const axis = new CartesianAxis(
    //     {
    //       orient: 'top',
    //       type: 'band',
    //       data: ['A', 'B', 'C'],
    //       title: {
    //         visible: true,
    //         text: 'X Axis'
    //       }
    //     },
    //     cellGroup.attribute.width,
    //     cellGroup.attribute.height,
    //     table
    //   );
    //   cellGroup.clear();
    //   // axis.component.setAttribute('y', 40);
    //   cellGroup.appendChild(axis.component);
    // } else if ((define as any)?.isAxis && cellLocation === 'rowHeader') {
    //   cellGroup.setAttribute('clip', false);
    //   const axis = new CartesianAxis(
    //     {
    //       orient: 'left',
    //       type: 'linear',
    //       range: { min: 0, max: 30 },
    //       label: {
    //         flush: true
    //       },
    //       grid: {
    //         visible: true
    //       },
    //       title: {
    //         visible: true,
    //         text: 'Y Axis'
    //       }
    //     },
    //     cellGroup.attribute.width,
    //     cellGroup.attribute.height,
    //     table
    //   );
    //   cellGroup.clear();
    //   // axis.component.setAttribute('x', 80);
    //   cellGroup.appendChild(axis.component);
    //   axis.overlap();
    // }
  } else if (type === 'image') {
    // 创建图片单元格
    cellGroup = createImageCellGroup(
      columnGroup,
      0,
      y,
      col,
      row,
      table.getColWidth(col),
      table.getRowHeight(row),
      (define as ImageColumnDefine).keepAspectRatio,
      (define as ImageColumnDefine).imageAutoSizing,
      padding,
      textAlign,
      textBaseline,
      table,
      cellTheme
    );
  } else if (type === 'video') {
    // 创建视频单元格
    cellGroup = createVideoCellGroup(
      columnGroup,
      0,
      y,
      col,
      row,
      table.getColWidth(col),
      table.getRowHeight(row),
      (define as ImageColumnDefine).keepAspectRatio,
      (define as ImageColumnDefine).imageAutoSizing,
      padding,
      textAlign,
      textBaseline,
      table,
      cellTheme
    );
  } else if (type === 'chart') {
    const chartInstance = table.internalProps.layoutMap.getChartInstance(col, row);
    cellGroup = createChartCellGroup(
      null,
      columnGroup,
      0,
      y,
      col,
      row,
      table.getColWidth(col),
      table.getRowHeight(row),
      padding,
      value,
      (define as ChartColumnDefine).chartModule,
      table.isPivotChart()
        ? (table.internalProps.layoutMap as PivotHeaderLayoutMap).getChartSpec(col, row)
        : (define as ChartColumnDefine).chartSpec,
      chartInstance,
      (table.internalProps.layoutMap as PivotHeaderLayoutMap)?.getChartDataId(col, row) ?? 'data',
      table,
      cellTheme
    );
  } else if (type === 'progressbar') {
    const style = table._getCellStyle(col, row) as ProgressBarStyle;
    const dataValue = table.getCellOriginValue(col, row);
    // 创建基础文字单元格
    cellGroup = createCellGroup(
      table,
      value,
      columnGroup,
      0,
      y,
      col,
      row,
      colWidth,
      cellWidth,
      cellHeight,
      padding,
      textAlign,
      textBaseline,
      false,
      null,
      true,
      cellTheme
    );

    // 创建bar group
    const progressBarGroup = createProgressBarCell(
      define as ProgressbarColumnDefine,
      style,
      colWidth,
      value,
      dataValue,
      col,
      row,
      padding,
      table
    );
    // 进度图插入到文字前，绘制在文字下
    if (cellGroup.firstChild) {
      cellGroup.insertBefore(progressBarGroup, cellGroup.firstChild);
    } else {
      cellGroup.appendChild(progressBarGroup);
    }
  } else if (type === 'sparkline') {
    cellGroup = createSparkLineCellGroup(
      null,
      columnGroup,
      0,
      y,
      col,
      row,
      cellWidth,
      cellHeight,
      padding,
      table,
      cellTheme
    );
  } else if (type === 'checkbox') {
    cellGroup = createCheckboxCellGroup(
      null,
      columnGroup,
      0,
      y,
      col,
      row,
      colWidth,
      cellWidth,
      cellHeight,
      padding,
      textAlign,
      textBaseline,
      table,
      cellTheme,
      define as CheckboxColumnDefine
    );
  }

  return cellGroup;
}

export function updateCell(col: number, row: number, table: BaseTableAPI, addNew?: boolean) {
  // const oldCellGroup = table.scenegraph.getCell(col, row, true);
  const oldCellGroup = table.scenegraph.highPerformanceGetCell(col, row, true);
  const cellStyle = table._getCellStyle(col, row);
  const autoWrapText = cellStyle.autoWrapText ?? table.internalProps.autoWrapText;
  const cellLocation = table.getCellLocation(col, row);
  const define = cellLocation !== 'body' ? table.getHeaderDefine(col, row) : table.getBodyColumnDefine(col, row);

  let isMerge;
  let range;
  if (cellLocation !== 'body' || (define as TextColumnDefine)?.mergeCell || table.internalProps.customMergeCell) {
    // 只有表头或者column配置合并单元格后再进行信息获取
    range = table.getCellRange(col, row);
    isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
  }

  let cellTheme = getStyleTheme(
    cellStyle,
    table,
    isMerge ? range.start.col : col,
    isMerge ? range.start.row : row,
    getProp
  ).theme;

  // fast method for text
  if (!addNew && !isMerge && canUseFastUpdate(col, row, oldCellGroup, autoWrapText, table)) {
    // update group
    const cellWidth = table.getColWidth(col);
    const cellHeight = table.getRowHeight(row);
    oldCellGroup.setAttributes({
      width: cellWidth,
      height: cellHeight,
      // 背景相关，cell背景由cellGroup绘制
      lineWidth: cellTheme?.group?.lineWidth ?? undefined,
      fill: cellTheme?.group?.fill ?? undefined,
      stroke: cellTheme?.group?.stroke ?? undefined,
      strokeArrayWidth: (cellTheme?.group as any)?.strokeArrayWidth ?? undefined,
      strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
      cursor: (cellTheme?.group as any)?.cursor ?? undefined
    } as any);

    // update text
    const textMark = oldCellGroup.getChildByName('text');
    if (textMark) {
      const text = table.getCellValue(col, row);
      const textArr = convertInternal(text).replace(/\r?\n/g, '\n').replace(/\r/g, '\n').split('\n');
      const hierarchyOffset = getHierarchyOffset(col, row, table);
      const lineClamp = cellStyle.lineClamp;
      const padding = getQuadProps(getProp('padding', cellStyle, col, row, table)) ?? [0, 0, 0, 0];

      const textAlign = cellTheme.text.textAlign;
      let x = 0;
      if (textAlign === 'center') {
        x = padding[3] + (cellWidth - (padding[1] + padding[3])) / 2;
      } else if (textAlign === 'right') {
        x = padding[3] + cellWidth - (padding[1] + padding[3]);
      } else {
        x = padding[3];
      }

      const attribute = {
        text: textArr.length === 1 && !autoWrapText ? textArr[0] : textArr, // 单行(no-autoWrapText)为字符串，多行(autoWrapText)为字符串数组
        maxLineWidth: cellWidth - (padding[1] + padding[3] + hierarchyOffset),
        // fill: true,
        // textAlign: 'left',
        textBaseline: 'top',
        autoWrapText,
        lineClamp,
        wordBreak: 'break-word',
        // widthLimit: autoColWidth ? -1 : colWidth - (padding[1] + padding[3]),
        heightLimit: cellHeight - (padding[0] + padding[2]),
        pickable: false,
        dx: hierarchyOffset,
        x
      };
      textMark.setAttributes(cellTheme.text ? (Object.assign({}, cellTheme.text, attribute) as any) : attribute);
    }
    return oldCellGroup;
  }

  if (!addNew && oldCellGroup.role === 'empty') {
    return undefined;
  }

  const type = table.isHeader(col, row)
    ? table._getHeaderLayoutMap(col, row).headerType
    : table.getBodyColumnType(col, row);
  let value = table.getCellValue(col, row);

  let customStyle;
  if (table.internalProps.customMergeCell) {
    const customMerge = table.getCustomMerge(col, row);
    if (customMerge) {
      const { range: customMergeRange, text: customMergeText, style: customMergeStyle } = customMerge;
      range = customMergeRange;
      isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
      value = customMergeText;
      customStyle = customMergeStyle;
      cellTheme = getStyleTheme(customStyle, table, range.start.col, range.start.row, getProp).theme;
    }
  }

  let newCellGroup;
  const mayHaveIcon = cellLocation !== 'body' ? true : !!define?.icon || !!define?.tree;
  const padding = cellTheme._vtable.padding;
  const textAlign = cellTheme._vtable.textAlign;
  const textBaseline = cellTheme._vtable.textBaseline;

  let bgColorFunc: Function;
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
  }

  let customRender;
  let customLayout;
  if (cellLocation !== 'body') {
    customRender = define?.headerCustomRender;
    customLayout = define?.headerCustomLayout;
  } else {
    customRender = define?.customRender || table.customRender;
    customLayout = define?.customLayout;
  }

  let cellWidth;
  let cellHeight;
  if (range) {
    cellWidth = table.getColsWidth(range.start.col, range.end.col);
    cellHeight = table.getRowsHeight(range.start.row, range.end.row);
  } else {
    cellWidth = table.getColWidth(col);
    cellHeight = table.getRowHeight(row);
  }

  // deal with promise data
  if (isPromise(value)) {
    // clear cell content sync
    oldCellGroup.removeAllChild();

    // update cell content async
    dealPromiseData(
      value,
      table,
      updateCellContent.bind(
        null,
        type,
        value,
        define,
        table,
        col,
        row,
        bgColorFunc,
        cellWidth,
        cellHeight,
        oldCellGroup,
        padding,
        textAlign,
        textBaseline,
        mayHaveIcon,
        addNew,
        cellTheme
      )
    );
  } else {
    newCellGroup = updateCellContent(
      type,
      value,
      define,
      table,
      col,
      row,
      bgColorFunc,
      cellWidth,
      cellHeight,
      oldCellGroup,
      padding,
      textAlign,
      textBaseline,
      mayHaveIcon,
      addNew,
      cellTheme
    );
  }

  if (isMerge) {
    const rangeHeight = table.getRowHeight(row);
    const rangeWidth = table.getColWidth(col);

    const { width: contentWidth } = newCellGroup.attribute;
    const { height: contentHeight } = newCellGroup.attribute;
    newCellGroup.contentWidth = contentWidth;
    newCellGroup.contentHeight = contentHeight;

    resizeCellGroup(newCellGroup, rangeWidth, rangeHeight, range, table);
  }

  return newCellGroup;
}

function updateCellContent(
  type: ColumnTypeOption,
  value: string,
  define: ColumnDefine,
  table: BaseTableAPI,
  col: number,
  row: number,
  bgColorFunc: Function,
  cellWidth: number,
  cellHeight: number,
  oldCellGroup: Group,
  padding: [number, number, number, number],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  mayHaveIcon: boolean,
  addNew: boolean,
  cellTheme?: IThemeSpec
) {
  if (isPromise(value)) {
    value = table.getCellValue(col, row);
  }
  //解决报错 getCellByCache递归调用 死循环问题
  if (oldCellGroup.row !== row || oldCellGroup.col !== col) {
    return null;
  }
  const newCellGroup = createCell(
    type,
    value,
    define,
    table,
    col,
    row,
    table.getColWidth(col),
    cellWidth,
    cellHeight,
    // oldCellGroup.parent,
    addNew ? table.scenegraph.getColGroup(col) : oldCellGroup.parent,
    // oldCellGroup.attribute.y,
    addNew ? 0 : table.scenegraph.getCellGroupY(row), // y
    padding,
    textAlign,
    textBaseline,
    mayHaveIcon,
    cellTheme
  );
  if (!addNew && oldCellGroup.parent) {
    oldCellGroup.parent.insertAfter(newCellGroup, oldCellGroup);
    oldCellGroup.parent.removeChild(oldCellGroup);

    // update cache
    if (table.scenegraph?.proxy.cellCache.get(col)) {
      table.scenegraph?.proxy.cellCache.set(col, newCellGroup);
    }
  }
  return newCellGroup;
}

function canUseFastUpdate(col: number, row: number, oldCellGroup: Group, autoWrapText: boolean, table: BaseTableAPI) {
  const define = table.getBodyColumnDefine(col, row);
  const mayHaveIcon = !!define?.icon || !!define?.tree;
  const cellType = table.getBodyColumnType(col, row);
  const autoRowHeight = table.heightMode === 'autoHeight';
  const value = table.getCellValue(col, row);

  if (
    !table.isHeader(col, row) &&
    oldCellGroup.role === 'cell' &&
    cellType === 'text' &&
    !autoWrapText &&
    !autoRowHeight &&
    !mayHaveIcon &&
    oldCellGroup.firstChild?.type === 'text' &&
    !isPromise(value)
  ) {
    return true;
  }
  return false;
}
