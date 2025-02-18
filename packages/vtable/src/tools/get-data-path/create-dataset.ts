import { Dataset } from '../../dataset/dataset';
import { supplementIndicatorNodesForCustomTree } from '../../layout/layout-helper';
import type { ITreeLayoutHeadNode } from '../../layout/tree-helper';
import { DimensionTree } from '../../layout/tree-helper';
import type {
  AggregationRule,
  AggregationRules,
  CollectValueBy,
  IIndicator,
  PivotChartConstructorOptions,
  IPivotChartDataConfig
} from '../../ts-types';
import { AggregationType } from '../../ts-types';
import type { IChartColumnIndicator } from '../../ts-types/pivot-table/indicator/chart-indicator';

export function createDataset(options: PivotChartConstructorOptions) {
  const layoutNodeId = { seqId: 0 };
  const dataConfig: IPivotChartDataConfig = { isPivotChart: true };
  let columnDimensionTree;
  let rowDimensionTree;
  let columnTree;
  let rowTree;
  if (options.columnTree) {
    if (options.indicatorsAsCol !== false) {
      columnTree = supplementIndicatorNodesForCustomTree(options.columnTree, options.indicators);
    }
    columnDimensionTree = new DimensionTree((options.columnTree as ITreeLayoutHeadNode[]) ?? [], layoutNodeId);
  }
  if (options.rowTree) {
    if (options.indicatorsAsCol === false) {
      rowTree = supplementIndicatorNodesForCustomTree(options.rowTree, options.indicators);
    }
    rowDimensionTree = new DimensionTree((options.rowTree as ITreeLayoutHeadNode[]) ?? [], layoutNodeId);
  }
  const rowKeys = rowDimensionTree.dimensionKeys?.count
    ? rowDimensionTree.dimensionKeys.valueArr()
    : options.rows?.reduce((keys, rowObj) => {
        if (typeof rowObj === 'string') {
          keys.push(rowObj);
        } else {
          keys.push(rowObj.dimensionKey);
        }
        return keys;
      }, []) ?? [];
  const columnKeys = columnDimensionTree.dimensionKeys?.count
    ? columnDimensionTree.dimensionKeys.valueArr()
    : options.columns?.reduce((keys, columnObj) => {
        if (typeof columnObj === 'string') {
          keys.push(columnObj);
        } else {
          keys.push(columnObj.dimensionKey);
        }
        return keys;
      }, []) ?? [];
  const indicatorKeys =
    options.indicators?.reduce((keys, indicatorObj) => {
      if (typeof indicatorObj === 'string') {
        keys.push(indicatorObj);
      } else {
        keys.push(indicatorObj.indicatorKey);
      }
      return keys;
    }, []) ?? [];

  dataConfig.collectValuesBy = _generateCollectValuesConfig(options, columnKeys, rowKeys);
  dataConfig.aggregationRules = _generateAggregationRules(options);

  const dataset = new Dataset(
    dataConfig,
    // null,
    rowKeys,
    columnKeys,
    indicatorKeys,
    options.indicators,
    options.indicatorsAsCol ?? true,
    options.records,
    undefined,
    undefined,
    columnTree || options.columnTree,
    rowTree || options.rowTree,
    true
  );

  return { dataset, columnDimensionTree, rowDimensionTree, layoutNodeId };
}

function _generateCollectValuesConfig(
  option: PivotChartConstructorOptions,
  columnKeys: string[],
  rowKeys: string[]
): Record<string, CollectValueBy> {
  const collectValuesBy: Record<string, CollectValueBy> = {};

  for (let i = 0, len = option.indicators?.length; i < len; i++) {
    if (typeof option.indicators[i] !== 'string' && (option.indicators[i] as IChartColumnIndicator).chartSpec) {
      if (option.indicatorsAsCol === false) {
        const indicatorDefine = option.indicators[i] as IIndicator;
        // 收集指标值的范围
        collectValuesBy[indicatorDefine.indicatorKey] = {
          by: rowKeys,
          range: true,
          // 判断是否需要匹配维度值相同的进行求和计算
          sumBy:
            (indicatorDefine as IChartColumnIndicator).chartSpec?.stack !== false &&
            columnKeys.concat((indicatorDefine as IChartColumnIndicator).chartSpec?.xField)
        };
        if ((indicatorDefine as IChartColumnIndicator).chartSpec.series) {
          (indicatorDefine as IChartColumnIndicator).chartSpec.series.forEach((chartSeries: any) => {
            const xField = typeof chartSeries.xField === 'string' ? chartSeries.xField : chartSeries.xField[0];
            collectValuesBy[xField] = {
              by: columnKeys,
              type: chartSeries.direction !== 'horizontal' ? 'xField' : undefined,
              range: chartSeries.direction === 'horizontal',
              sortBy:
                chartSeries.direction !== 'horizontal'
                  ? chartSeries?.data?.fields?.[xField]?.domain ??
                    (indicatorDefine as IChartColumnIndicator).chartSpec?.data?.fields?.[xField]?.domain
                  : undefined
            };

            const yField = chartSeries.yField;
            collectValuesBy[yField] = {
              by: rowKeys,
              range: chartSeries.direction !== 'horizontal', // direction默认为'vertical'
              sumBy: chartSeries.stack !== false && columnKeys.concat(chartSeries?.xField), // 逻辑严谨的话 这个concat的值也需要结合 chartSeries.direction来判断是xField还是yField
              sortBy:
                chartSeries.direction === 'horizontal'
                  ? chartSeries?.data?.fields?.[yField]?.domain ??
                    (indicatorDefine as IChartColumnIndicator).chartSpec?.data?.fields?.[yField]?.domain
                  : undefined
            };
          });
        } else {
          const xField =
            typeof (indicatorDefine as IChartColumnIndicator).chartSpec.xField === 'string'
              ? (indicatorDefine as IChartColumnIndicator).chartSpec.xField
              : (indicatorDefine as IChartColumnIndicator).chartSpec.xField[0];
          collectValuesBy[xField] = {
            by: columnKeys,
            type:
              (indicatorDefine as IChartColumnIndicator).chartSpec.direction !== 'horizontal' ? 'xField' : undefined,
            range: (indicatorDefine as IChartColumnIndicator).chartSpec.direction === 'horizontal',
            sortBy:
              (indicatorDefine as IChartColumnIndicator).chartSpec.direction !== 'horizontal'
                ? (indicatorDefine as IChartColumnIndicator).chartSpec?.data?.fields?.[xField]?.domain
                : undefined
          };
          //下面这个收集的值 应该是和收集的 collectValuesBy[indicatorDefine.indicatorKey] 相同
          const yField = (indicatorDefine as IChartColumnIndicator).chartSpec.yField;
          collectValuesBy[yField] = {
            by: rowKeys,
            range: (option.indicators[i] as IChartColumnIndicator).chartSpec.direction !== 'horizontal', // direction默认为'vertical'
            sumBy:
              (indicatorDefine as IChartColumnIndicator).chartSpec.stack !== false &&
              columnKeys.concat((indicatorDefine as IChartColumnIndicator).chartSpec?.xField), // 逻辑严谨的话 这个concat的值也需要结合 chartSeries.direction来判断是xField还是yField
            sortBy:
              (indicatorDefine as IChartColumnIndicator).chartSpec.direction === 'horizontal'
                ? (indicatorDefine as IChartColumnIndicator).chartSpec?.data?.fields?.[yField]?.domain
                : undefined
          };
        }
      } else {
        const indicatorDefine = option.indicators[i] as IIndicator;
        // 收集指标值的范围
        collectValuesBy[indicatorDefine.indicatorKey] = {
          by: columnKeys,
          range: true,
          // 判断是否需要匹配维度值相同的进行求和计算
          sumBy:
            (indicatorDefine as IChartColumnIndicator).chartSpec?.stack !== false &&
            rowKeys.concat((indicatorDefine as IChartColumnIndicator).chartSpec?.yField)
        };
        if ((indicatorDefine as IChartColumnIndicator).chartSpec.series) {
          (indicatorDefine as IChartColumnIndicator).chartSpec.series.forEach((chartSeries: any) => {
            const yField = typeof chartSeries.yField === 'string' ? chartSeries.yField : chartSeries.yField[0];
            collectValuesBy[yField] = {
              by: rowKeys,
              type: chartSeries.direction === 'horizontal' ? 'yField' : undefined,
              range: chartSeries.direction !== 'horizontal',
              sortBy:
                chartSeries.direction === 'horizontal'
                  ? chartSeries?.data?.fields?.[yField]?.domain ??
                    (indicatorDefine as IChartColumnIndicator).chartSpec?.data?.fields?.[yField]?.domain
                  : undefined
            };

            const xField = chartSeries.xField;
            collectValuesBy[xField] = {
              by: columnKeys,
              range: chartSeries.direction === 'horizontal', // direction默认为'vertical'
              sumBy: chartSeries.stack !== false && rowKeys.concat(chartSeries?.yField),
              sortBy:
                chartSeries.direction !== 'horizontal'
                  ? chartSeries?.data?.fields?.[xField]?.domain ??
                    (indicatorDefine as IChartColumnIndicator).chartSpec?.data?.fields?.[xField]?.domain
                  : undefined
            };
          });
        } else {
          const yField =
            typeof (indicatorDefine as IChartColumnIndicator).chartSpec.yField === 'string'
              ? (indicatorDefine as IChartColumnIndicator).chartSpec.yField
              : (indicatorDefine as IChartColumnIndicator).chartSpec.yField[0];
          collectValuesBy[yField] = {
            by: rowKeys,
            type:
              (indicatorDefine as IChartColumnIndicator).chartSpec.direction === 'horizontal' ? 'yField' : undefined,
            range: (indicatorDefine as IChartColumnIndicator).chartSpec.direction !== 'horizontal',
            sortBy:
              (indicatorDefine as IChartColumnIndicator).chartSpec.direction === 'horizontal'
                ? (indicatorDefine as IChartColumnIndicator).chartSpec?.data?.fields?.[yField]?.domain
                : undefined
          };
          //下面这个收集的值 应该是和收集的 collectValuesBy[indicatorDefine.indicatorKey] 相同
          const xField = (indicatorDefine as IChartColumnIndicator).chartSpec.xField;
          collectValuesBy[xField] = {
            by: columnKeys,
            range: (option.indicators[i] as IChartColumnIndicator).chartSpec.direction === 'horizontal', // direction默认为'vertical'
            sumBy:
              (indicatorDefine as IChartColumnIndicator).chartSpec.stack !== false &&
              rowKeys.concat((indicatorDefine as IChartColumnIndicator).chartSpec?.yField),
            sortBy:
              (indicatorDefine as IChartColumnIndicator).chartSpec.direction !== 'horizontal'
                ? (indicatorDefine as IChartColumnIndicator).chartSpec?.data?.fields?.[xField]?.domain
                : undefined
          };
        }
      }
    }
  }

  return collectValuesBy;
}

function _generateAggregationRules(options: PivotChartConstructorOptions) {
  const aggregationRules: AggregationRules = [];
  // indicatorFromChartSpec = true;
  options.indicators?.forEach((indicator: IIndicator | string) => {
    if (typeof indicator === 'string') {
      aggregationRules.push({
        indicatorKey: indicator, //field转为指标key
        field: indicator, //指标依据字段
        aggregationType: AggregationType.RECORD //计算类型
      } as AggregationRule<AggregationType.RECORD>);
    } else {
      if ((indicator as IChartColumnIndicator).chartSpec?.series) {
        // 如果chartSpec配置了组合图 series 则需要考虑 series中存在的多个指标
        const fields: string[] = [];
        (indicator as IChartColumnIndicator).chartSpec?.series.forEach((seriesSpec: any) => {
          const seriesField = options.indicatorsAsCol === false ? seriesSpec.yField : seriesSpec.xField;
          if (fields.indexOf(seriesField) === -1) {
            fields.push(seriesField);
          }
        });
        aggregationRules.push({
          indicatorKey: indicator.indicatorKey, //field转为指标key
          field: fields, //指标依据字段
          aggregationType: AggregationType.RECORD //计算类型
        });
      } else {
        const field =
          options.indicatorsAsCol === false
            ? (indicator as IChartColumnIndicator).chartSpec.yField
            : (indicator as IChartColumnIndicator).chartSpec.xField;
        aggregationRules.push({
          indicatorKey: indicator.indicatorKey, //field转为指标key
          field: field ?? indicator.indicatorKey, //指标依据字段
          aggregationType: AggregationType.RECORD //计算类型
        });
      }
    }
  });

  return aggregationRules;
}
