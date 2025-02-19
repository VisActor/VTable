import type { Cursor, IGraphic, IThemeSpec, Rect, Group as VGroup } from '@src/vrender';
import type { ProgressBarStyle } from '../../body-helper/style/ProgressBarStyle';
import { regUrl } from '../../tools/global';
import type {
  CellRange,
  ChartColumnDefine,
  CheckboxColumnDefine,
  ColumnDefine,
  ColumnTypeOption,
  ImageColumnDefine,
  ProgressbarColumnDefine,
  IRowSeriesNumber,
  TextColumnDefine,
  RadioColumnDefine,
  ListTableConstructorOptions,
  SwitchColumnDefine,
  ButtonColumnDefine
} from '../../ts-types';
import { dealWithCustom } from '../component/custom';
import type { Group } from '../graphic/group';
import { getProp } from '../utils/get-prop';
import type { CreateChartCellGroup } from './cell-type/chart-cell';
import type { CreateImageCellGroup } from './cell-type/image-cell';
import type { CreateProgressBarCell } from './cell-type/progress-bar-cell';
import type { CreateSparkLineCellGroup } from './cell-type/spark-line-cell';
import type { CreateTextCellGroup } from './cell-type/text-cell';
import type { CreateVideoCellGroup } from './cell-type/video-cell';
import type { BaseTableAPI, HeaderData } from '../../ts-types/base-table';
import { getCellCornerRadius, getStyleTheme } from '../../core/tableHelper';
import { getOrApply, isPromise } from '../../tools/helper';
import { dealPromiseData } from '../utils/deal-promise-data';
import type { ICartesianAxis } from '../../components/axis/axis';
import { Factory } from '../../core/factory';
import type { CreateCheckboxCellGroup } from './cell-type/checkbox-cell';
import { getHierarchyOffset } from '../utils/get-hierarchy-offset';
import { getQuadProps } from '../utils/padding';
import { updateCellContentHeight, updateCellContentWidth } from '../utils/text-icon-layout';
import { isArray, isNumber, isValid } from '@visactor/vutils';
import { breakString } from '../utils/break-string';
import type { CreateRadioCellGroup } from './cell-type/radio-cell';
import { onBeforeAttributeUpdateForInvertHighlight } from '../../plugins/invert-highlight';
import { getCellBorderStrokeWidth } from '../utils/cell-border-stroke-width';
import type { CreateSwitchCellGroup } from './cell-type/switch-cell';
import type { CreateButtonCellGroup } from './cell-type/button-cell';

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
  cellTheme: IThemeSpec,
  range: CellRange | undefined,
  customResult?: {
    elementsGroup?: VGroup;
    renderDefault: boolean;
  }
): Group {
  let isAsync = false;
  let cellGroup: Group;
  if (isPromise(value)) {
    if (table.scenegraph.highPerformanceGetCell(col, row).role !== 'cell') {
      // avoid nouse async create cell
      return cellGroup;
    }
    value = table.getCellValue(col, row);
    isAsync = true;
  }
  // let bgColorFunc: Function;
  // // 判断是否有mapping  遍历dataset中mappingRules
  // if ((table.internalProps as PivotTableProtected)?.dataConfig?.mappingRules && !table.isHeader(col, row)) {
  //   (table.internalProps as PivotTableProtected)?.dataConfig?.mappingRules?.forEach(
  //     (mappingRule: MappingRule, i: number) => {
  //       if (
  //         mappingRule.bgColor &&
  //         (table.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row) ===
  //           mappingRule.bgColor.indicatorKey
  //       ) {
  //         bgColorFunc = mappingRule.bgColor.mapping;
  //       }
  //     }
  //   );
  // }

  // customMerge&customLayout cell as text cell
  if (type === 'text' || type === 'link' || customResult) {
    if (type === 'link') {
      //如果是超链接 颜色按照linkColor绘制 TODO：放到方法_getCellStyle中
      // const columnDefine = table.getHeaderDefine(col, row);
      const cellValue = value;
      const cellOriginValue = table.getCellOriginValue(col, row);
      const headerStyle = table._getCellStyle(col, row);

      if (
        type === 'link' &&
        (('templateLink' in define && define.templateLink) ||
          !(
            'linkDetect' in define &&
            getOrApply(define.linkDetect, {
              col,
              row,
              table,
              value: cellValue,
              dataValue: cellOriginValue,
              cellHeaderPaths: undefined
            })
          ) ||
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
    // if (bgColorFunc) {
    //   const cellValue = table.getCellOriginValue(col, row);
    //   const bgColor = bgColorFunc(table, cellValue);
    //   if (bgColor) {
    //     if (cellTheme) {
    //       cellTheme.group.fill = bgColor;
    //     } else {
    //       cellTheme = {
    //         group: {
    //           fill: bgColor
    //         }
    //       };
    //     }
    //   }
    // }

    const { customElementsGroup, renderDefault } = _generateCustomElementsGroup(
      table,
      define,
      col,
      row,
      cellWidth,
      cellHeight,
      padding,
      range,
      customResult
    );

    const createTextCellGroup = Factory.getFunction('createTextCellGroup') as CreateTextCellGroup;
    cellGroup = createTextCellGroup(
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
      cellTheme,
      range,
      isAsync
    );

    const axisConfig = table.internalProps.layoutMap.getAxisConfigInPivotChart(col, row);
    if (axisConfig) {
      const CartesianAxis: ICartesianAxis = Factory.getComponent('axis');
      const axis = new CartesianAxis(
        axisConfig,
        cellGroup.attribute.width,
        cellGroup.attribute.height,
        axisConfig.__vtablePadding ?? padding,
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
  } else if (type === 'image') {
    // 创建图片单元格
    const createImageCellGroup = Factory.getFunction('createImageCellGroup') as CreateImageCellGroup;
    cellGroup = createImageCellGroup(
      columnGroup,
      0,
      y,
      col,
      row,
      cellWidth,
      cellHeight,
      (define as ImageColumnDefine).keepAspectRatio,
      (define as ImageColumnDefine).imageAutoSizing,
      padding,
      textAlign,
      textBaseline,
      mayHaveIcon,
      table,
      cellTheme,
      range,
      isAsync
    );
  } else if (type === 'video') {
    // 创建视频单元格
    const createVideoCellGroup = Factory.getFunction('createVideoCellGroup') as CreateVideoCellGroup;
    cellGroup = createVideoCellGroup(
      columnGroup,
      0,
      y,
      col,
      row,
      cellWidth,
      cellHeight,
      (define as ImageColumnDefine).keepAspectRatio,
      (define as ImageColumnDefine).imageAutoSizing,
      padding,
      textAlign,
      textBaseline,
      mayHaveIcon,
      table,
      cellTheme,
      range,
      isAsync
    );
  } else if (type === 'chart') {
    const chartInstance = table.internalProps.layoutMap.getChartInstance(col, row);
    const createChartCellGroup = Factory.getFunction('createChartCellGroup') as CreateChartCellGroup;
    cellGroup = createChartCellGroup(
      null,
      columnGroup,
      0,
      y,
      col,
      row,
      cellWidth,
      cellHeight,
      padding,
      value,
      (define as ChartColumnDefine).chartModule,
      table.internalProps.layoutMap.getChartSpec(col, row),
      chartInstance,
      table.internalProps.layoutMap.getChartDataId(col, row) ?? 'data',
      table,
      cellTheme,
      table.internalProps.layoutMap.isShareChartSpec(col, row),
      isAsync,
      table.internalProps.layoutMap.isNoChartDataRenderNothing(col, row)
    );
  } else if (type === 'progressbar') {
    const { customElementsGroup, renderDefault } = _generateCustomElementsGroup(
      table,
      define,
      col,
      row,
      cellWidth,
      cellHeight,
      padding,
      range,
      customResult
    );
    const style = table._getCellStyle(col, row) as ProgressBarStyle;
    const dataValue = table.getCellOriginValue(col, row);
    // 创建基础文字单元格
    const createTextCellGroup = Factory.getFunction('createTextCellGroup') as CreateTextCellGroup;
    cellGroup = createTextCellGroup(
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
      customElementsGroup,
      renderDefault,
      cellTheme,
      range,
      isAsync
    );

    // 创建bar group
    const createProgressBarCell = Factory.getFunction('createProgressBarCell') as CreateProgressBarCell;
    const progressBarGroup = createProgressBarCell(
      define as ProgressbarColumnDefine,
      style,
      colWidth,
      value,
      dataValue,
      col,
      row,
      padding,
      table,
      range
    );
    // 进度图插入到文字前，绘制在文字下
    if (cellGroup.firstChild) {
      cellGroup.insertBefore(progressBarGroup, cellGroup.firstChild);
    } else {
      cellGroup.appendChild(progressBarGroup);
    }
  } else if (type === 'sparkline') {
    const createSparkLineCellGroup = Factory.getFunction('createSparkLineCellGroup') as CreateSparkLineCellGroup;
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
      cellTheme,
      isAsync
    );
  } else if (type === 'checkbox') {
    const createCheckboxCellGroup = Factory.getFunction('createCheckboxCellGroup') as CreateCheckboxCellGroup;
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
      mayHaveIcon,
      table,
      cellTheme,
      define as CheckboxColumnDefine,
      range,
      isAsync
    );
  } else if (type === 'radio') {
    const createRadioCellGroup = Factory.getFunction('createRadioCellGroup') as CreateRadioCellGroup;
    cellGroup = createRadioCellGroup(
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
      define as RadioColumnDefine,
      range
    );
  } else if (type === 'switch') {
    const createSwitchCellGroup = Factory.getFunction('createSwitchCellGroup') as CreateSwitchCellGroup;
    cellGroup = createSwitchCellGroup(
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
      mayHaveIcon,
      table,
      cellTheme,
      define as SwitchColumnDefine,
      range,
      isAsync
    );
  } else if (type === 'button') {
    const createButtonCellGroup = Factory.getFunction('createButtonCellGroup') as CreateButtonCellGroup;
    cellGroup = createButtonCellGroup(
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
      mayHaveIcon,
      table,
      cellTheme,
      define as ButtonColumnDefine,
      range,
      isAsync
    );
  }

  cellGroup.onBeforeAttributeUpdate = onBeforeAttributeUpdateForInvertHighlight as any;
  return cellGroup;
}

function _generateCustomElementsGroup(
  table: BaseTableAPI,
  define: ColumnDefine,
  col: number,
  row: number,
  cellWidth: number,
  cellHeight: number,
  padding: [number, number, number, number],
  range: CellRange | undefined,
  customResult?: {
    elementsGroup?: VGroup;
    renderDefault: boolean;
  }
) {
  let customElementsGroup;
  let renderDefault = true;
  if (customResult) {
    customElementsGroup = customResult.elementsGroup;
    renderDefault = customResult.renderDefault;
  } else {
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
      const customResult = dealWithCustom(
        customLayout,
        customRender,
        col,
        row,
        cellWidth,
        cellHeight,
        false,
        table.isAutoRowHeight(row),
        padding,
        range,
        table
      );
      customElementsGroup = customResult.elementsGroup;
      renderDefault = customResult.renderDefault;
    }
  }
  return {
    customElementsGroup,
    renderDefault
  };
}

export function updateCell(
  col: number,
  row: number,
  table: BaseTableAPI,
  addNew?: boolean,
  isShadow?: boolean,
  forceFastUpdate?: boolean
) {
  // const oldCellGroup = table.scenegraph.getCell(col, row, true);
  const oldCellGroup = table.scenegraph.highPerformanceGetCell(col, row, true);
  const cellLocation = table.getCellLocation(col, row);
  let value = table.getCellValue(col, row);

  let isMerge;
  let range;
  let customStyle;
  let customResult;
  let isCustomMerge = false;
  if (table.internalProps.customMergeCell) {
    const customMerge = table.getCustomMerge(col, row);
    if (customMerge) {
      const {
        range: customMergeRange,
        text: customMergeText,
        style: customMergeStyle,
        customLayout,
        customRender
      } = customMerge;
      range = customMergeRange;
      isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
      value = customMergeText;
      customStyle = customMergeStyle;
      // if (customStyle) {
      //   cellTheme = getStyleTheme(customStyle, table, range.start.col, range.start.row, getProp).theme;
      //   cellTheme.group.cornerRadius = getCellCornerRadius(col, row, table);
      // }

      if (customLayout || customRender) {
        customResult = dealWithCustom(
          customLayout,
          customRender,
          customMergeRange.start.col,
          customMergeRange.start.row,
          table.getColsWidth(customMergeRange.start.col, customMergeRange.end.col),
          table.getRowsHeight(customMergeRange.start.row, customMergeRange.end.row),
          false,
          table.isAutoRowHeight(row),
          [0, 0, 0, 0],
          range,
          table
        );
      }

      isCustomMerge = true;
    }
  }

  // const define = cellLocation !== 'body' ? table.getHeaderDefine(col, row) : table.getBodyColumnDefine(col, row);
  let colForDefine = col;
  let rowForDefine = row;
  if (range) {
    colForDefine = range.start.col;
    rowForDefine = range.start.row;
  }
  const define: TextColumnDefine = (
    cellLocation !== 'body'
      ? table.getHeaderDefine(colForDefine, rowForDefine)
      : table.getBodyColumnDefine(colForDefine, rowForDefine)
  ) as any;

  let mayHaveIcon =
    cellLocation !== 'body'
      ? true
      : (define as IRowSeriesNumber)?.dragOrder || !!define?.icon || !!(define as ColumnDefine)?.tree;

  if (
    !range &&
    (table.internalProps.enableTreeNodeMerge || cellLocation !== 'body' || (define as TextColumnDefine)?.mergeCell)
  ) {
    // 只有表头或者column配置合并单元格后再进行信息获取
    range = table.getCellRange(col, row);
    isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
  }
  let isVtableMerge = false;
  if (table.internalProps.enableTreeNodeMerge && isMerge) {
    const rawRecord = table.getCellRawRecord(range.start.col, range.start.row);
    const { vtableMergeName, vtableMerge } = rawRecord ?? {};

    isVtableMerge = vtableMerge;
    if (vtableMerge) {
      mayHaveIcon = true;
      if ((table.options as ListTableConstructorOptions).groupTitleCustomLayout) {
        customResult = dealWithCustom(
          (table.options as ListTableConstructorOptions).groupTitleCustomLayout,
          undefined,
          range.start.col,
          range.start.row,
          table.getColsWidth(range.start.col, range.end.col),
          table.getRowsHeight(range.start.row, range.end.row),
          false,
          table.isAutoRowHeight(row),
          [0, 0, 0, 0],
          range,
          table
        );
      }
      if ((table.options as ListTableConstructorOptions).groupTitleFieldFormat) {
        value = (table.options as ListTableConstructorOptions).groupTitleFieldFormat(rawRecord, col, row, table);
      } else if (vtableMergeName) {
        value = vtableMergeName;
      }
    }
  }

  const cellStyle = customStyle || table._getCellStyle(range ? range.start.col : col, range ? range.start.row : row);
  const autoWrapText = cellStyle.autoWrapText ?? table.internalProps.autoWrapText;
  const cellTheme = getStyleTheme(
    cellStyle,
    table,
    isMerge ? range.start.col : col,
    isMerge ? range.start.row : row,
    getProp
  ).theme;

  cellTheme.group.cornerRadius = getCellCornerRadius(col, row, table);

  // fast method for text
  if (
    !addNew &&
    !isMerge &&
    !(define?.customLayout || define?.customRender || define?.headerCustomLayout || define?.headerCustomRender) &&
    (forceFastUpdate || canUseFastUpdate(col, row, oldCellGroup, autoWrapText, mayHaveIcon, table))
  ) {
    // update group
    const cellWidth = table.getColWidth(col);
    const cellHeight = table.getRowHeight(row);
    const strokeArrayWidth = getCellBorderStrokeWidth(col, row, cellTheme, table);

    oldCellGroup.setAttributes({
      width: cellWidth,
      height: cellHeight,
      // 背景相关，cell背景由cellGroup绘制
      lineWidth: cellTheme?.group?.lineWidth ?? undefined,
      fill: cellTheme?.group?.fill ?? undefined,
      stroke: cellTheme?.group?.stroke ?? undefined,
      strokeArrayWidth: strokeArrayWidth ?? undefined,
      strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
      cursor: (cellTheme?.group as any)?.cursor ?? undefined,
      cornerRadius: cellTheme?.group?.cornerRadius ?? 0,
      lineDash: cellTheme?.group?.lineDash ?? undefined,

      y: table.scenegraph.getCellGroupY(row)
    } as any);

    oldCellGroup.forEachChildren((child: IGraphic) => {
      child.setAttributes({
        dx: 0,
        dy: 0
      });
    });

    // update text
    const textMark = oldCellGroup.getChildByName('text');
    if (forceFastUpdate && textMark) {
      const attribute = {
        textBaseline: 'top'
      };
      textMark.setAttributes(cellTheme.text ? (Object.assign({}, cellTheme.text, attribute) as any) : attribute);
    } else if (textMark) {
      const text = table.getCellValue(col, row);
      const { text: textArr, moreThanMaxCharacters } = breakString(text, table);

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
        moreThanMaxCharacters,
        maxLineWidth: cellWidth - (padding[1] + padding[3] + hierarchyOffset),
        // fill: true,
        // textAlign: 'left',
        textBaseline: 'top',
        autoWrapText,
        lineClamp,
        wordBreak: 'break-word',
        // widthLimit: autoColWidth ? -1 : colWidth - (padding[1] + padding[3]),
        heightLimit: cellHeight - Math.floor(padding[0] + padding[2]),
        pickable: false,
        dx: textAlign === 'left' ? hierarchyOffset : 0,
        x
      };
      // const oldText = textMark.attribute.text;
      textMark.setAttributes(cellTheme.text ? (Object.assign({}, cellTheme.text, attribute) as any) : attribute);
      if (textMark.attribute.text) {
        const textBaseline = cellTheme.text.textBaseline;
        const height = cellHeight - (padding[0] + padding[2]);
        let y = 0;
        if (textBaseline === 'middle') {
          y = padding[0] + (height - textMark.AABBBounds.height()) / 2;
        } else if (textBaseline === 'bottom') {
          y = padding[0] + height - textMark.AABBBounds.height();
        } else {
          y = padding[0];
        }
        textMark.setAttributes({
          y
        });
      }
    }
    return oldCellGroup;
  }

  if (!addNew && oldCellGroup.role === 'empty') {
    return undefined;
  }

  const type =
    isVtableMerge || isCustomMerge
      ? 'text'
      : table.isHeader(col, row)
      ? (table._getHeaderLayoutMap(col, row) as HeaderData).headerType ?? 'text'
      : table.getBodyColumnType(col, row) ?? 'text';

  const padding = cellTheme._vtable.padding;
  const textAlign = cellTheme.text.textAlign;
  const textBaseline = cellTheme.text.textBaseline;

  let newCellGroup;
  // let bgColorFunc: Function;
  // 判断是否有mapping  遍历dataset中mappingRules
  // if ((table.internalProps as PivotTableProtected)?.dataConfig?.mappingRules && !table.isHeader(col, row)) {
  //   (table.internalProps as PivotTableProtected)?.dataConfig?.mappingRules?.forEach(
  //     (mappingRule: MappingRule, i: number) => {
  //       if (
  //         mappingRule.bgColor &&
  //         (table.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row) ===
  //           mappingRule.bgColor.indicatorKey
  //       ) {
  //         bgColorFunc = mappingRule.bgColor.mapping;
  //       }
  //     }
  //   );
  // }

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
      callUpdateCellContentForPromiseValue.bind(null, {
        type,
        value,
        define,
        table,
        col,
        row,
        // bgColorFunc,
        cellWidth,
        cellHeight,
        oldCellGroup,
        padding,
        textAlign,
        textBaseline,
        mayHaveIcon,
        addNew,
        range,
        customResult,
        customStyle
      })
    );
  } else {
    newCellGroup = updateCellContent(
      type,
      value,
      define as ColumnDefine,
      table,
      col,
      row,
      // bgColorFunc,
      cellWidth,
      cellHeight,
      oldCellGroup,
      padding,
      textAlign,
      textBaseline,
      mayHaveIcon,
      addNew,
      cellTheme,
      range,
      customResult
    );
  }

  if (isMerge) {
    // const rangeHeight = table.getRowHeight(row);
    // const rangeWidth = table.getColWidth(col);

    const { width: contentWidth } = newCellGroup.attribute;
    const { height: contentHeight } = newCellGroup.attribute;
    newCellGroup.contentWidth = contentWidth;
    newCellGroup.contentHeight = contentHeight;

    if (isShadow) {
      dealWithMergeCellSizeForShadow(
        range,
        cellWidth,
        cellHeight,
        padding,
        textAlign,
        textBaseline,
        table,
        newCellGroup
      );
    } else {
      dealWithMergeCellSize(range, cellWidth, cellHeight, padding, textAlign, textBaseline, table);
    }
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
  // bgColorFunc: Function,
  cellWidth: number,
  cellHeight: number,
  oldCellGroup: Group,
  padding: [number, number, number, number],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  mayHaveIcon: boolean,
  addNew: boolean,
  cellTheme: IThemeSpec,
  range: CellRange | undefined,
  customResult?: {
    elementsGroup?: VGroup;
    renderDefault: boolean;
  }
) {
  if (isPromise(value)) {
    value = table.getCellValue(col, row);
  }
  //解决报错 getCellByCache递归调用 死循环问题
  if (!addNew && (oldCellGroup.row !== row || oldCellGroup.col !== col)) {
    return null;
  }
  if (!addNew && oldCellGroup.parent) {
    // clear react container
    if (table.reactCustomLayout) {
      const reactGroup = oldCellGroup.getChildByName('custom-container');
      if (reactGroup) {
        const { col, row } = reactGroup;
        if (isNumber(col) && isNumber(row)) {
          table.reactCustomLayout.removeCustomCell(col, row);
        }
      }
    }
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
    cellTheme,
    range,
    customResult
  );
  if (!addNew && oldCellGroup.parent) {
    // update cell
    oldCellGroup.parent.insertAfter(newCellGroup, oldCellGroup);
    oldCellGroup.parent.removeChild(oldCellGroup);

    // update cache
    if (table.scenegraph?.proxy.cellCache.get(col)) {
      table.scenegraph?.proxy.cellCache.set(col, newCellGroup);
    }
  }
  return newCellGroup;
}

function canUseFastUpdate(
  col: number,
  row: number,
  oldCellGroup: Group,
  autoWrapText: boolean,
  mayHaveIcon: boolean,
  table: BaseTableAPI
) {
  // return false;
  // const define = table.getBodyColumnDefine(col, row);
  // const mayHaveIcon = !!define?.icon || !!(define as ColumnDefine)?.tree || (define as IRowSeriesNumber)?.dragOrder;
  const cellType = table.getBodyColumnType(col, row);
  const autoRowHeight = table.isAutoRowHeight(row);
  const value = table.getCellValue(col, row);

  if (
    !table.isHeader(col, row) &&
    oldCellGroup.role === 'cell' &&
    cellType === 'text' &&
    !autoWrapText &&
    !autoRowHeight &&
    !mayHaveIcon &&
    oldCellGroup.firstChild?.type === 'text' && // judgement for none text
    !isPromise(value)
  ) {
    return true;
  }
  return false;
}
function callUpdateCellContentForPromiseValue(updateCellArgs: any) {
  const {
    type,
    value,
    define,
    table,
    col,
    row,
    cellWidth,
    cellHeight,
    oldCellGroup,
    padding,
    textAlign,
    textBaseline,
    mayHaveIcon,
    addNew,
    range,
    customResult,
    customStyle
  } = updateCellArgs;
  const cellStyle = customStyle || table._getCellStyle(range ? range.start.col : col, range ? range.start.row : row);
  const cellTheme = getStyleTheme(
    cellStyle,
    table,
    range ? range.start.col : col,
    range ? range.start.row : row,
    getProp
  ).theme;

  cellTheme.group.cornerRadius = getCellCornerRadius(col, row, table);
  updateCellContent(
    type,
    value,
    define,
    table,
    col,
    row,
    // bgColorFunc,
    cellWidth,
    cellHeight,
    oldCellGroup,
    padding,
    textAlign,
    textBaseline,
    mayHaveIcon,
    addNew,
    cellTheme,
    range,
    customResult
  );
}
export function dealWithMergeCellSize(
  range: CellRange,
  cellWidth: number,
  cellHeight: number,
  padding: [number, number, number, number],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  table: BaseTableAPI
) {
  for (let col = range.start.col; col <= range.end.col; col++) {
    for (let row = range.start.row; row <= range.end.row; row++) {
      // const cellGroup = table.scenegraph.getCell(col, row, true);
      const cellGroup = table.scenegraph.highPerformanceGetCell(col, row, true);

      if (cellGroup.role !== 'cell') {
        continue;
      }

      if (range.start.row !== range.end.row && cellGroup.contentHeight !== cellHeight) {
        updateCellContentHeight(
          cellGroup,
          cellHeight,
          cellHeight,
          table.isAutoRowHeight(row),
          padding,
          textAlign,
          textBaseline,
          table
          // 'middle'
        );
      }
      if (range.start.col !== range.end.col && cellGroup.contentWidth !== cellWidth) {
        updateCellContentWidth(
          cellGroup,
          cellWidth,
          cellHeight,
          0,
          table.isAutoRowHeight(row),
          padding,
          textAlign,
          textBaseline,
          table.scenegraph
        );
      }

      cellGroup.contentWidth = cellWidth;
      cellGroup.contentHeight = cellHeight;

      const rangeHeight = table.getRowHeight(row);
      const rangeWidth = table.getColWidth(col);

      resizeCellGroup(cellGroup, rangeWidth, rangeHeight, range, table);
    }
  }
}

export function dealWithMergeCellSizeForShadow(
  range: CellRange,
  cellWidth: number,
  cellHeight: number,
  padding: [number, number, number, number],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  table: BaseTableAPI,
  cellGroup: Group
) {
  const { col, row } = cellGroup;
  if (range.start.row !== range.end.row && cellGroup.contentHeight !== cellHeight) {
    updateCellContentHeight(
      cellGroup,
      cellHeight,
      cellHeight,
      table.isAutoRowHeight(row),
      padding,
      textAlign,
      textBaseline,
      table
      // 'middle'
    );
  }
  if (range.start.col !== range.end.col && cellGroup.contentWidth !== cellWidth) {
    updateCellContentWidth(
      cellGroup,
      cellWidth,
      cellHeight,
      0,
      table.isAutoRowHeight(row),
      padding,
      textAlign,
      textBaseline,
      table.scenegraph
    );
  }

  cellGroup.contentWidth = cellWidth;
  cellGroup.contentHeight = cellHeight;

  const rangeHeight = table.getRowHeight(row);
  const rangeWidth = table.getColWidth(col);

  resizeCellGroup(cellGroup, rangeWidth, rangeHeight, range, table);
}

export function resizeCellGroup(
  cellGroup: Group,
  rangeWidth: number,
  rangeHeight: number,
  range: CellRange,
  table: BaseTableAPI
) {
  const { col, row } = cellGroup;
  const dx = -table.getColsWidth(range.start.col, col - 1);
  let dy = 0;
  if (table.options.customConfig?._disableColumnAndRowSizeRound) {
    // temply fix for fs merge position; bugserverId: 673af513801d3000b3cd9e8f
    for (let i = range.start.row; i <= row - 1; i++) {
      dy -= table.getRowHeight(i);
    }
  } else {
    dy = -table.getRowsHeight(range.start.row, row - 1);
  }

  cellGroup.forEachChildren((child: IGraphic) => {
    // 利用_dx hack解决掉 合并单元格的范围内的格子依次执行该方法 如果挨个调用updateCell的话 执行多次后dx累计问题
    if (typeof child._dx === 'number') {
      child.skipMergeUpdate = true;
      child.setAttributes({
        dx: (child._dx ?? 0) + dx
      });
      child.skipMergeUpdate = false;
    } else {
      child.skipMergeUpdate = true;
      child._dx = child.attribute.dx ?? 0;
      child.setAttributes({
        dx: (child.attribute.dx ?? 0) + dx
      });
      child.skipMergeUpdate = false;
    }

    if (typeof child._dy === 'number') {
      child.skipMergeUpdate = true;
      child.setAttributes({
        dy: (child._dy ?? 0) + dy
      });
      child.skipMergeUpdate = false;
    } else {
      child._dy = child.attribute.dy ?? 0;
      child.skipMergeUpdate = true;
      child.setAttributes({
        dy: (child.attribute.dy ?? 0) + dy
      });
      child.skipMergeUpdate = false;
    }
  });

  const lineWidth = (cellGroup.attribute as any).strokeArrayWidth ?? cellGroup.attribute.lineWidth;
  const isLineWidthArray = isArray(lineWidth);
  const newLineWidth = [0, 0, 0, 0];

  if (col === range.start.col) {
    newLineWidth[3] = isLineWidthArray ? lineWidth[3] : lineWidth;
  }
  if (row === range.start.row) {
    newLineWidth[0] = isLineWidthArray ? lineWidth[0] : lineWidth;
  }
  if (col === range.end.col) {
    newLineWidth[1] = isLineWidthArray ? lineWidth[1] : lineWidth;
  }
  if (row === range.end.row) {
    newLineWidth[2] = isLineWidthArray ? lineWidth[2] : lineWidth;
  }

  const widthChange = rangeWidth !== cellGroup.attribute.width;
  const heightChange = rangeHeight !== cellGroup.attribute.height;

  (cellGroup as any).skipMergeUpdate = true;
  cellGroup.setAttributes({
    width: rangeWidth,
    height: rangeHeight,
    strokeArrayWidth: newLineWidth
  } as any);
  (cellGroup as any).skipMergeUpdate = false;

  cellGroup.mergeStartCol = range.start.col;
  cellGroup.mergeStartRow = range.start.row;
  cellGroup.mergeEndCol = range.end.col;
  cellGroup.mergeEndRow = range.end.row;

  return {
    widthChange,
    heightChange
  };
}

export function getCustomCellMergeCustom(col: number, row: number, cellGroup: Group, table: BaseTableAPI) {
  if (table.internalProps.customMergeCell) {
    const customMerge = table.getCustomMerge(col, row);
    if (customMerge) {
      const {
        range: customMergeRange,
        text: customMergeText,
        style: customMergeStyle,
        customLayout: customMergeLayout,
        customRender: customMergeRender
      } = customMerge;

      if (customMergeLayout || customMergeRender) {
        const customResult = dealWithCustom(
          customMergeLayout,
          customMergeRender,
          customMergeRange.start.col,
          customMergeRange.start.row,
          table.getColsWidth(customMergeRange.start.col, customMergeRange.end.col),
          table.getRowsHeight(customMergeRange.start.row, customMergeRange.end.row),
          false,
          table.isAutoRowHeight(row),
          [0, 0, 0, 0],
          customMergeRange,
          table
        );

        const customElementsGroup = customResult.elementsGroup;

        if (cellGroup.childrenCount > 0 && customElementsGroup) {
          cellGroup.insertBefore(customElementsGroup, cellGroup.firstChild);
        } else if (customElementsGroup) {
          cellGroup.appendChild(customElementsGroup);
        }

        const rangeHeight = table.getRowHeight(row);
        const rangeWidth = table.getColWidth(col);

        const { width: contentWidth } = cellGroup.attribute;
        const { height: contentHeight } = cellGroup.attribute;
        cellGroup.contentWidth = contentWidth;
        cellGroup.contentHeight = contentHeight;

        resizeCellGroup(cellGroup, rangeWidth, rangeHeight, customMergeRange, table);

        return customMergeRange;
      }
    }
  }

  return undefined;
}
