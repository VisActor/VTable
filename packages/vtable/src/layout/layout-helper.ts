import { isArray, isString } from '@visactor/vutils';
import type { PivotTable } from '../PivotTable';
import { AggregationType } from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';
import type {
  Aggregation,
  IHeaderTreeDefine,
  IIndicator,
  ListTableConstructorOptions,
  PivotTableConstructorOptions
} from '../ts-types';
import type { ColumnData } from '../ts-types/list-table/layout-map/api';
import type { IChartColumnIndicator } from '../ts-types/pivot-table/indicator/chart-indicator';
import type { SimpleHeaderLayoutMap } from './simple-header-layout';
import type { IImageDimension } from '../ts-types/pivot-table/dimension/image-dimension';
import type { IImageColumnIndicator, IImageHeaderIndicator } from '../ts-types/pivot-table/indicator/image-indicator';
import type { IImageColumnBodyDefine, IImageHeaderDefine } from '../ts-types/list-table/define/image-define';
import type { ITreeLayoutHeadNode, LayouTreeNode } from './tree-helper';
import { deleteTreeHideNode, DimensionTree } from './tree-helper';
import type { ISparklineColumnIndicator } from '../ts-types/pivot-table/indicator/sparkline-indicator';

export function checkHasAggregation(layoutMap: SimpleHeaderLayoutMap) {
  const columnObjects = layoutMap.columnObjects;
  for (let i = 0; i < columnObjects.length; i++) {
    const column = columnObjects[i];
    if ((column as ColumnData)?.aggregation) {
      return true;
    }
  }
  return false;
}

export function checkHasAggregationOnTop(layoutMap: SimpleHeaderLayoutMap) {
  const columnObjects = layoutMap.columnObjects;
  let count = 0;
  for (let i = 0; i < columnObjects.length; i++) {
    const column = columnObjects[i];
    if ((column as ColumnData)?.aggregation) {
      if (Array.isArray((column as ColumnData)?.aggregation)) {
        count = Math.max(
          count,
          ((column as ColumnData).aggregation as Array<Aggregation>).filter(item => item.showOnTop).length
        );
      } else if (((column as ColumnData).aggregation as Aggregation).showOnTop) {
        count = Math.max(count, 1);
      }
    }
  }
  return count;
}

export function checkHasAggregationOnBottom(layoutMap: SimpleHeaderLayoutMap) {
  const columnObjects = layoutMap.columnObjects;
  let count = 0;
  for (let i = 0; i < columnObjects.length; i++) {
    const column = columnObjects[i];
    if ((column as ColumnData)?.aggregation) {
      if (Array.isArray((column as ColumnData)?.aggregation)) {
        count = Math.max(
          count,
          ((column as ColumnData).aggregation as Array<Aggregation>).filter(item => !item.showOnTop).length
        );
      } else if (!((column as ColumnData).aggregation as Aggregation).showOnTop) {
        count = Math.max(count, 1);
      }
    }
  }
  return count;
}

export function checkHasTreeDefine(layoutMap: SimpleHeaderLayoutMap) {
  if (layoutMap._table.options.groupBy) {
    return true;
  }
  const { columns } = layoutMap._table.options as ListTableConstructorOptions;
  if (isArray(columns) && columns.length > 0) {
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (isString(column)) {
        continue;
      }
      if (column.tree) {
        return true;
      }
    }
  }
  return false;
}

export function hasAutoImageColumn(table: BaseTableAPI) {
  const { columns, rows, indicators } = table.options as PivotTableConstructorOptions;
  if (table.isPivotTable()) {
    // pivot table
    if (isArray(columns) && columns.length > 0) {
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (isString(column)) {
          continue;
        }
        if (
          (column.headerType === 'image' || column.headerType === 'video' || typeof column.headerType === 'function') &&
          (column as IImageDimension).imageAutoSizing
        ) {
          return true;
        }
      }
    }
    if (isArray(rows) && rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (isString(row)) {
          continue;
        }
        if (
          (row.headerType === 'image' || row.headerType === 'video' || typeof row.headerType === 'function') &&
          (row as IImageDimension).imageAutoSizing
        ) {
          return true;
        }
      }
    }
    if (isArray(indicators) && indicators.length > 0) {
      for (let i = 0; i < indicators.length; i++) {
        const indicator = indicators[i];
        if (isString(indicator)) {
          continue;
        }
        if (
          ((indicator.cellType === 'image' ||
            indicator.cellType === 'video' ||
            typeof indicator.cellType === 'function') &&
            (indicator as IImageColumnIndicator).imageAutoSizing) ||
          ((indicator.headerType === 'image' ||
            indicator.headerType === 'video' ||
            typeof indicator.headerType === 'function') &&
            (indicator as IImageHeaderIndicator).imageAutoSizing)
        ) {
          return true;
        }
      }
    }
  } else {
    // list table
    if (isArray(columns) && columns.length > 0) {
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i] as unknown as ListTableConstructorOptions['columns'][0];
        if (
          ((column.cellType === 'image' || column.cellType === 'video' || typeof column.cellType === 'function') &&
            (column as IImageColumnBodyDefine).imageAutoSizing) ||
          ((column.headerType === 'image' ||
            column.headerType === 'video' ||
            typeof column.headerType === 'function') &&
            (column as IImageHeaderDefine).imageAutoSizing)
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

export function parseColKeyRowKeyForPivotTable(table: PivotTable, options: PivotTableConstructorOptions) {
  let columnDimensionTree;
  let rowDimensionTree;
  // let isNeedResetColumnDimensionTree = true;
  // let isNeedResetRowDimensionTree = true;
  if (options.columnTree) {
    if (table.options.indicatorsAsCol !== false && table.options.supplementIndicatorNodes !== false) {
      table.internalProps.columnTree = supplementIndicatorNodesForCustomTree(
        table.internalProps.columnTree,
        options.indicators
      );
    }
    columnDimensionTree = new DimensionTree(
      (table.internalProps.columnTree as ITreeLayoutHeadNode[]) ?? [],
      table.layoutNodeId,
      table.options.columnHierarchyType,
      table.options.columnHierarchyType !== 'grid' ? table.options.columnExpandLevel ?? 1 : undefined
    );

    // if (
    //   table.options.supplementIndicatorNodes !== false &&
    //   table.options.indicatorsAsCol !== false &&
    //   !columnDimensionTree.dimensionKeys.contain(IndicatorDimensionKeyPlaceholder) &&
    //   options.indicators?.length >= 1
    // ) {
    //   isNeedResetColumnDimensionTree = true;
    // } else {
    //   isNeedResetColumnDimensionTree = false;
    // }
    // } else {
    //   if (options.indicatorsAsCol !== false) {
    //     table.internalProps.columnTree = supplementIndicatorNodesForCustomTree([], options.indicators);
    //   }
  }
  if (options.rowTree) {
    if (table.options.indicatorsAsCol === false && table.options.supplementIndicatorNodes !== false) {
      table.internalProps.rowTree = supplementIndicatorNodesForCustomTree(
        table.internalProps.rowTree,
        options.indicators
      );
    }
    rowDimensionTree = new DimensionTree(
      (table.internalProps.rowTree as ITreeLayoutHeadNode[]) ?? [],
      table.layoutNodeId,
      table.options.rowHierarchyType,
      table.options.rowHierarchyType !== 'grid' ? table.options.rowExpandLevel ?? 1 : undefined
    );
    // if (
    //   table.options.supplementIndicatorNodes !== false &&
    //   table.options.indicatorsAsCol === false &&
    //   !rowDimensionTree.dimensionKeys.contain(IndicatorDimensionKeyPlaceholder) &&
    //   options.indicators?.length >= 1
    // ) {
    //   isNeedResetRowDimensionTree = true;
    // } else {
    //   isNeedResetRowDimensionTree = false;
    // }
    // } else {
    //   if (options.indicatorsAsCol === false) {
    //     table.internalProps.rowTree = supplementIndicatorNodesForCustomTree([], options.indicators);
    //   }
  }
  const rowKeys = rowDimensionTree?.dimensionKeys?.count
    ? rowDimensionTree.dimensionKeys.valueArr()
    : options.rows?.reduce((keys: string[], rowObj) => {
        if (typeof rowObj === 'string') {
          keys.push(rowObj);
        } else {
          keys.push(rowObj.dimensionKey);
        }
        return keys;
      }, []) ?? [];
  const columnKeys = columnDimensionTree?.dimensionKeys?.count
    ? columnDimensionTree.dimensionKeys.valueArr()
    : options.columns?.reduce((keys: string[], columnObj) => {
        if (typeof columnObj === 'string') {
          keys.push(columnObj);
        } else {
          keys.push(columnObj.dimensionKey);
        }
        return keys;
      }, []) ?? [];
  const indicatorKeys =
    options.indicators?.reduce((keys: string[], indicatorObj) => {
      if (typeof indicatorObj === 'string') {
        keys.push(indicatorObj);
      } else {
        keys.push(indicatorObj.indicatorKey);
        if (
          (indicatorObj as IChartColumnIndicator).chartSpec ||
          (indicatorObj as ISparklineColumnIndicator).sparklineSpec
        ) {
          if (table.internalProps.dataConfig?.aggregationRules) {
            if (
              !table.internalProps.dataConfig.aggregationRules.find(aggregation => {
                return aggregation.indicatorKey === indicatorObj.indicatorKey;
              })
            ) {
              table.internalProps.dataConfig.aggregationRules.push({
                field: indicatorObj.indicatorKey,
                indicatorKey: indicatorObj.indicatorKey,
                aggregationType: AggregationType.NONE
              });
            }
          } else if (table.internalProps.dataConfig) {
            table.internalProps.dataConfig.aggregationRules = [
              {
                field: indicatorObj.indicatorKey,
                indicatorKey: indicatorObj.indicatorKey,
                aggregationType: AggregationType.NONE
              }
            ];
          } else {
            table.internalProps.dataConfig = {
              aggregationRules: [
                {
                  field: indicatorObj.indicatorKey,
                  indicatorKey: indicatorObj.indicatorKey,
                  aggregationType: AggregationType.NONE
                }
              ]
            };
          }
        }
      }
      return keys;
    }, []) ?? [];
  if (options.rowHierarchyType !== 'grid' && (options.extensionRows?.length ?? 0) >= 1) {
    options.extensionRows?.forEach(extensionRow => {
      const extension_rowKeys: string[] = [];
      extensionRow.rows.forEach(row => {
        if (typeof row === 'string') {
          extension_rowKeys.push(row);
        } else {
          extension_rowKeys.push(row.dimensionKey);
        }
      });
      rowKeys.push(...extension_rowKeys);
    });
  }
  return {
    rowKeys,
    columnKeys,
    indicatorKeys,
    // isNeedResetColumnDimensionTree,
    // isNeedResetRowDimensionTree,
    columnDimensionTree,
    rowDimensionTree
  };
}

export function supplementIndicatorNodesForCustomTree(
  customTree: IHeaderTreeDefine[],
  indicators: (string | IIndicator)[]
) {
  const checkNode = (nodes: IHeaderTreeDefine[], isHasIndicator: boolean) => {
    nodes.forEach((node: IHeaderTreeDefine) => {
      if (
        !node.indicatorKey &&
        !isHasIndicator &&
        (!(node.children as IHeaderTreeDefine[])?.length || !node.children)
      ) {
        node.children = indicators?.map((indicator: IIndicator | string): { indicatorKey: string; value: string } => {
          if (typeof indicator === 'string') {
            return { indicatorKey: indicator, value: indicator };
          }
          return { indicatorKey: indicator.indicatorKey, value: indicator.title ?? indicator.indicatorKey };
        });
      } else if (node.children && Array.isArray(node.children)) {
        checkNode(node.children, isHasIndicator || !!node.indicatorKey);
      }
    });
  };
  if (customTree?.length) {
    checkNode(customTree, false);
  } else {
    customTree = indicators?.map((indicator: IIndicator | string): { indicatorKey: string; value: string } => {
      if (typeof indicator === 'string') {
        return { indicatorKey: indicator, value: indicator };
      }
      return { indicatorKey: indicator.indicatorKey, value: indicator.title ?? indicator.indicatorKey };
    });
  }
  return customTree;
}

export function deleteHideIndicatorNode(
  treeNodeChildren: LayouTreeNode[],
  indicators: (string | IIndicator)[],
  hasHideNode: boolean,
  table: PivotTable
) {
  const hasHideSettingIndicators: IIndicator[] = [];
  for (let i = 0; i < indicators?.length; i++) {
    const indicator = indicators[i];
    if ((indicator as IIndicator)?.hide) {
      hasHideSettingIndicators.push(indicator as IIndicator);
    }
  }
  if (hasHideSettingIndicators.length || hasHideNode) {
    deleteTreeHideNode(treeNodeChildren, [], hasHideSettingIndicators, hasHideNode, table);
  }
}
