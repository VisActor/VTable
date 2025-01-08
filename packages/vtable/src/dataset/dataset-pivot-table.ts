import type {
  FilterRules,
  IPivotTableDataConfig,
  SortRule,
  AggregationRules,
  AggregationRule,
  SortRules,
  DerivedFieldRule,
  DerivedFieldRules,
  SortByIndicatorRule,
  SortByRule,
  SortTypeRule,
  SortFuncRule,
  Totals,
  MappingRules,
  SortOrder,
  IHeaderTreeDefine
} from '../ts-types';
import { AggregationType, SortType } from '../ts-types';
import type { Aggregator } from '../ts-types/dataset/aggregation';
import {
  AvgAggregator,
  CountAggregator,
  MaxAggregator,
  MinAggregator,
  SumAggregator,
  naturalSort,
  sortBy,
  typeSort
} from '../ts-types/dataset/aggregation';
/**
 * 数据处理模块
 */
export class DatasetForPivotTable {
  /**
   * 用户配置
   */
  dataConfig: IPivotTableDataConfig;
  /**
   * 明细数据
   */
  records: any[];
  /**
   * 树形节点，最后的子节点对应到body部分的每个单元格 树结构： 行-列-单元格
   */
  tree: Record<string, Record<string, Aggregator[]>> = {};
  private colFlatKeys = {};
  private rowFlatKeys = {};

  //列表头的每列对应的表头键值
  colKeys: string[][] = [];
  //行表头的每行对应的表头键值
  rowKeys: string[][] = [];
  /**
   * 对应dataset中的rowKeys，行表头的每行表头键值，包含小计总计
   */
  rowKeysPath: string[][];
  /**
   * 对应dataset中的colKeys，列表头的每列表头键值，包含小计总计
   */
  colKeysPath: string[][];
  // allTotal: SumAggregator;
  rowOrder = 'key_a_to_z';
  colOrder = 'key_a_to_z';
  //是否已排序
  sorted = false;
  //排序规则
  sortRules: SortRules;
  //过滤规则
  filterRules: FilterRules;
  //聚合规则
  aggregationRules: AggregationRules;
  //派生字段规则
  derivedFieldRules: DerivedFieldRules;
  mappingRules: MappingRules;
  //汇总配置
  totals: Totals;
  //全局统计各指标的极值
  indicatorStatistics: { max: Aggregator; min: Aggregator; total: Aggregator }[] = [];

  aggregators: {
    [key: string]: { new (dimension: string | string[], formatFun?: any, isRecord?: boolean): Aggregator };
  } = {};

  stringJoinChar = String.fromCharCode(0);
  //缓存rows对应每个值是否为汇总字段
  private rowsIsTotal: boolean[] = [];
  private colsIsTotal: boolean[] = [];
  private colGrandTotalLabel: string;
  private colSubTotalLabel: string;
  private rowGrandTotalLabel: string;
  private rowSubTotalLabel: string;
  rows: string[];
  columns: string[];
  indicatorKeys: string[];
  constructor(
    dataConfig: IPivotTableDataConfig,
    rows: string[],
    columns: string[],
    indicators: string[],
    records: any[],
    customColTree?: IHeaderTreeDefine[],
    customRowTree?: IHeaderTreeDefine[]
  ) {
    this.registerAggregators();
    this.dataConfig = dataConfig;
    // this.allTotal = new SumAggregator(this.indicators[0]);
    this.sortRules = this.dataConfig?.sortRules;
    this.aggregationRules = this.dataConfig?.aggregationRules;
    this.derivedFieldRules = this.dataConfig?.derivedFieldRules;
    this.mappingRules = this.dataConfig?.mappingRules;
    this.totals = this.dataConfig?.totals;
    this.rows = rows;
    this.columns = columns;
    this.indicatorKeys = indicators;
    this.colGrandTotalLabel = this.totals?.column?.grandTotalLabel ?? '总计';
    this.colSubTotalLabel = this.totals?.column?.subTotalLabel ?? '小计';
    this.rowGrandTotalLabel = this.totals?.row?.grandTotalLabel ?? '总计';
    this.rowSubTotalLabel = this.totals?.row?.subTotalLabel ?? '小计';
    // for (let i = 0; i < this.indicators?.length; i++) {
    //   this.indicatorStatistics.push({
    //     max: new this.aggregators[AggregationType.MAX](this.indicators[i]),
    //     min: new this.aggregators[AggregationType.MIN](this.indicators[i]),
    //     total: new this.aggregators[AggregationType.SUM](this.indicators[i]),
    //   });
    // }
    this.rowsIsTotal = new Array(this.rows.length).fill(false);
    this.colsIsTotal = new Array(this.columns.length).fill(false);
    for (let i = 0, len = this.totals?.row?.subTotalsDimensions?.length; i < len; i++) {
      const dimension = this.totals.row.subTotalsDimensions[i];
      const dimensionIndex = this.rows.indexOf(dimension);
      this.rowsIsTotal[dimensionIndex] = true;
    }
    for (let i = 0, len = this.totals?.column?.subTotalsDimensions?.length; i < len; i++) {
      const dimension = this.totals.column.subTotalsDimensions[i];
      const dimensionIndex = this.columns.indexOf(dimension);
      this.colsIsTotal[dimensionIndex] = true;
    }
    if (records) {
      //处理数据
      this.records = records;
      const t0 = typeof window !== 'undefined' ? window.performance.now() : 0;
      this.setRecords(records);
      const t1 = typeof window !== 'undefined' ? window.performance.now() : 0;
      console.log('processRecords:', t1 - t0);

      // 处理汇总
      const t4 = typeof window !== 'undefined' ? window.performance.now() : 0;
      this.totalStatistics();
      const t5 = typeof window !== 'undefined' ? window.performance.now() : 0;
      console.log('totalStatistics:', t5 - t4);

      //对维度排序
      const t2 = typeof window !== 'undefined' ? window.performance.now() : 0;
      this.sortKeys();
      const t3 = typeof window !== 'undefined' ? window.performance.now() : 0;
      console.log('sortKeys:', t3 - t2);
      //转为树形
      // const t4 = typeof window !== 'undefined' ? window.performance.now() : 0;
      // this.madeTree(this.rowKeys);
      // const t41 = typeof window !== 'undefined' ? window.performance.now() : 0;
      // console.log('madeTree:', t41 - t4);

      const t7 = typeof window !== 'undefined' ? window.performance.now() : 0;
      if (customRowTree) {
        this.rowKeysPath = this.TreeToArr2(customRowTree);
      } else {
        this.rowKeysPath = this.TreeToArr(
          this.ArrToTree(
            this.rowKeys,
            this.rowsIsTotal,
            this?.totals?.row?.showGrandTotals || this.columns.length === 0,
            this.rowGrandTotalLabel,
            this.rowSubTotalLabel
          )
        );
      }
      if (customColTree) {
        this.colKeysPath = this.TreeToArr2(customColTree);
      } else {
        this.colKeysPath = this.TreeToArr(
          this.ArrToTree(
            this.colKeys,
            this.colsIsTotal,
            this.totals?.column?.showGrandTotals || this.rows.length === 0,
            this.colGrandTotalLabel,
            this.colSubTotalLabel
          )
        );
      }
      const t8 = typeof window !== 'undefined' ? window.performance.now() : 0;
      console.log('TreeToArr:', t8 - t7);
    }

    delete this.rowFlatKeys;
    delete this.colFlatKeys;
  }
  //将聚合类型注册 收集到aggregators
  registerAggregator(type: string, aggregator: any) {
    this.aggregators[type] = aggregator;
  }
  //将聚合类型注册
  registerAggregators() {
    this.registerAggregator(AggregationType.SUM, SumAggregator);
    this.registerAggregator(AggregationType.COUNT, CountAggregator);
    this.registerAggregator(AggregationType.MAX, MaxAggregator);
    this.registerAggregator(AggregationType.MIN, MinAggregator);
    this.registerAggregator(AggregationType.AVG, AvgAggregator);
  }
  setRecords(records: any[]) {
    this.processRecords();
  }
  /**
   * 处理数据,遍历所有条目，过滤和派生字段的处理有待优化TODO
   */
  processRecords() {
    for (let i = 0, len = this.records.length; i < len; i++) {
      const record = this.records[i];
      if (this.filterRecord(record)) {
        this.processRecord(record);
      }
    }
  }
  filterRecord(record: any) {
    let isReserved = true;
    for (let i = 0; i < this.dataConfig?.filterRules?.length; i++) {
      const filterRule = this.dataConfig?.filterRules[i];
      if (!filterRule.filterFunc?.(record)) {
        isReserved = false;
        break;
      }
    }
    return isReserved;
  }
  /**
   * 处理单条数据
   * @param record
   * @returns
   */
  processRecord(record: any) {
    //这个派生字段的计算位置有待确定，是否应该放到filter之前
    this.derivedFieldRules?.forEach((derivedFieldRule: DerivedFieldRule, i: number) => {
      record[derivedFieldRule.fieldName] = derivedFieldRule.derivedFunc(record);
    });
    const colKey = [];
    const rowKey = [];

    for (let l = 0, len1 = this.rows.length; l < len1; l++) {
      const rowAttr = this.rows[l];
      rowKey.push(record[rowAttr]);
    }
    for (let n = 0, len2 = this.columns.length; n < len2; n++) {
      const colAttr = this.columns[n];
      colKey.push(record[colAttr]);
    }

    // this.allTotal.push(record);

    const flatRowKey = rowKey.join(this.stringJoinChar);
    const flatColKey = colKey.join(this.stringJoinChar);

    // 此方法判断效率很低
    // if (this.rowKeys.indexOf(rowKey) === -1) this.rowKeys.push(rowKey);
    // if (this.colKeys.indexOf(colKey) === -1) this.colKeys.push(colKey);

    // rowTotals colTotals原本汇总的每行每列的总计，当columns或者rows不配置的时候 可以用这个值展示，现在放到了tree上 'total'作为默认键值
    if (rowKey.length !== 0) {
      if (!this.rowFlatKeys[flatRowKey]) {
        this.rowKeys.push(rowKey);
        this.rowFlatKeys[flatRowKey] = 1;
      }
      //如有需要显示总计 或者columns配置空
      // if (this.totals?.row?.showGrandTotals || !(this.dataConfig?.columns?.length > 0))
      //   for (let i = 0; i < this.indicators?.length; i++) {
      //     if (!this.rowTotals[flatRowKey][i]) {
      //       const aggRule = this.getAggregatorRule(this.indicators[i]);
      //       this.rowTotals[flatRowKey][i] = new this.aggregators[
      //         aggRule?.aggregationType ?? AggregationType.SUM
      //       ](aggRule?.field ?? this.indicators[i], aggRule?.formatFun);
      //     }
      //     this.rowTotals[flatRowKey][i].push(record);
      //   }
    }
    if (colKey.length !== 0) {
      if (!this.colFlatKeys[flatColKey]) {
        this.colKeys.push(colKey);
        this.colFlatKeys[flatColKey] = 1;
      }
      //如有需要显示总计 或者rows配置空
      // if (this.totals?.column?.showGrandTotals || !(this.dataConfig?.rows?.length > 0))
      //   for (let i = 0; i < this.indicators?.length; i++) {
      //     if (!this.colTotals[flatColKey][i]) {
      //       const aggRule = this.getAggregatorRule(this.indicators[i]);
      //       this.colTotals[flatColKey][i] = new this.aggregators[
      //         aggRule?.aggregationType ?? AggregationType.SUM
      //       ](aggRule?.field ?? this.indicators[i], aggRule?.formatFun);
      //     }
      //     this.colTotals[flatColKey][i].push(record);
      //   }
    }

    //组织树结构： 行-列-单元格  行key为flatRowKey如’山东青岛‘  列key为flatColKey如’家具椅子‘
    if (colKey.length !== 0 || rowKey.length !== 0) {
      if (!this.tree[flatRowKey]) {
        this.tree[flatRowKey] = {};
      }
      //这里改成数组 因为可能是多个指标值 遍历indicators 生成对应类型的聚合对象
      if (!this.tree[flatRowKey]?.[flatColKey]) {
        this.tree[flatRowKey][flatColKey] = [];
      }
      for (let i = 0; i < this.indicatorKeys.length; i++) {
        if (!this.tree[flatRowKey]?.[flatColKey]?.[i]) {
          const aggRule = this.getAggregatorRule(this.indicatorKeys[i]);
          this.tree[flatRowKey][flatColKey][i] = new this.aggregators[aggRule?.aggregationType ?? AggregationType.SUM](
            aggRule?.field ?? this.indicatorKeys[i],
            aggRule?.formatFun
          );
        }
        //push融合了计算过程
        this.tree[flatRowKey]?.[flatColKey]?.[i].push(record);
      }
    }
    //统计整体的最大最小值和总计值 共mapping使用
    if (this.mappingRules) {
      for (let i = 0; i < this.indicatorKeys.length; i++) {
        if (!this.indicatorStatistics[i]) {
          const aggRule = this.getAggregatorRule(this.indicatorKeys[i]);
          this.indicatorStatistics[i] = {
            max: new this.aggregators[AggregationType.MAX](this.indicatorKeys[i]),
            min: new this.aggregators[AggregationType.MIN](this.indicatorKeys[i]),
            total: new this.aggregators[aggRule?.aggregationType ?? AggregationType.SUM](
              aggRule?.field ?? this.indicatorKeys[i],
              aggRule?.formatFun
            )
          };
        }
        //push融合了计算过程
        this.indicatorStatistics[i].max.push(this.tree[flatRowKey]?.[flatColKey]?.[i].value());
        this.indicatorStatistics[i].min.push(this.tree[flatRowKey]?.[flatColKey]?.[i].value());
        this.indicatorStatistics[i].total.push(record);
      }
    }
  }
  /**
   * 全量更新排序规则 对数据重新排序 生成行列paths
   * @param sortRules
   */
  updateSortRules(sortRules: SortRules) {
    this.sorted = false;
    this.sortRules = sortRules;
    this.sortKeys();
    this.rowKeysPath = this.TreeToArr(
      this.ArrToTree(
        this.rowKeys,
        this.rowsIsTotal,
        this?.totals?.row?.showGrandTotals || this.columns.length === 0,
        this.rowGrandTotalLabel,
        this.rowSubTotalLabel
      )
    );
    this.colKeysPath = this.TreeToArr(
      this.ArrToTree(
        this.colKeys,
        this.colsIsTotal,
        this.totals?.column?.showGrandTotals || this.rows.length === 0,
        this.colGrandTotalLabel,
        this.colSubTotalLabel
      )
    );
  }
  private getAggregatorRule(indicatorKey: string): AggregationRule<AggregationType> | undefined {
    return this.aggregationRules?.find((value: AggregationRule<AggregationType>, index: number) => {
      return indicatorKey === value.indicatorKey;
    });
  }
  /**
   * 根据行列的维度key 获取聚合对象
   * @param rowKey
   * @param colKey
   * @param indicator
   * @returns
   */
  getAggregator(rowKey: string[] | string = [], colKey: string[] | string = [], indicator: string): Aggregator {
    const indicatorIndex = this.indicatorKeys.indexOf(indicator);
    let agg;
    let flatRowKey;
    let flatColKey;
    if (typeof rowKey === 'string') {
      flatRowKey = rowKey;
    } else {
      flatRowKey = rowKey.join(this.stringJoinChar);
    }

    if (typeof colKey === 'string') {
      flatColKey = colKey;
    } else {
      flatColKey = colKey.join(this.stringJoinChar);
    }

    if (rowKey.length === 0 && colKey.length === 0) {
      // agg = this.allTotal;
      // } else if (rowKey.length === 0) {
      //   // agg = this.tree.total[flatColKey]?.[sortByIndicatorIndex];
      //   agg = this.colTotals[flatColKey]?.[sortByIndicatorIndex];
      // } else if (colKey.length === 0) {
      //   // agg = this.tree[flatRowKey].total?.[sortByIndicatorIndex];
      //   agg = this.rowTotals[flatRowKey]?.[sortByIndicatorIndex];
    } else {
      agg = this.tree[flatRowKey]?.[flatColKey]?.[indicatorIndex];
    }
    return agg
      ? agg
      : {
          records: [],
          key: '',
          push() {
            // do nothing
          },
          deleteRecord() {
            // do nothing
          },
          updateRecord() {
            // do nothing
          },
          recalculate() {
            // do nothing
          },
          value(): any {
            return null;
          },
          formatValue() {
            return '';
          },
          reset() {
            // do nothing
          },
          clearCacheValue() {
            // do nothing
          }
        };
  }
  /**
   * 根据排序规则 对维度keys排序
   */
  sortKeys() {
    const that = this;
    if (!this.sorted) {
      this.sorted = true;
      // const getValue = function (rowKey: any, colKey: any) {
      //   return that.getAggregator(rowKey, colKey, '').value();
      // };

      // switch (this.rowOrder) {
      //   case 'value_a_to_z':
      //     this.rowKeys.sort(function (a, b) {
      //       return naturalSort(getValue(a, []), getValue(b, []));
      //     });
      //     break;
      //   case 'value_z_to_a':
      //     this.rowKeys.sort(function (a, b) {
      //       return -naturalSort(getValue(a, []), getValue(b, []));
      //     });
      //     break;
      //   default:
      this.rowKeys.sort(this.arrSort(this.rows, true));
      // }
      // switch (this.colOrder) {
      //   case 'value_a_to_z':
      //     this.colKeys.sort(function (a, b) {
      //       return naturalSort(getValue([], a), getValue([], b));
      //     });
      //     break;
      //   case 'value_z_to_a':
      //     this.colKeys.sort(function (a, b) {
      //       return -naturalSort(getValue([], a), getValue([], b));
      //     });
      //     break;
      //   default:
      const sortfun = this.arrSort(this.columns, false);
      this.colKeys.sort(sortfun);
      // }
    }
  }
  /**
   * 生成排序函数 综合配置的多条排序规则
   * @param fieldArr 排序维度名称 如行rows 列columns
   * @returns
   */
  arrSort(fieldArr: string[], isRow: boolean) {
    let field;
    const that = this;
    const sortersArr: any[] = function (_this: any) {
      const results = [];
      for (let l = 0, len1 = fieldArr.length; l < len1; l++) {
        field = fieldArr[l];
        let isHasSortRule = false;
        if (that.sortRules) {
          for (let m = 0, len2 = that.sortRules.length; m < len2; m++) {
            if (that.sortRules[m].sortField === field) {
              isHasSortRule = true;
              results.push({
                field,
                fieldIndex: l,
                sortRule: that.sortRules[m],
                func: that.getSort(that.sortRules[m], isRow)
              });

              // if (that.sortRules[m].sortByIndicator) {
              //   isHasSortRule = true;
              //   results.push({
              //     field,
              //     fieldIndex: l,
              //     sortRule: that.sortRules[m],
              //     func: that.getSort(that.sortRules[m], field),
              //   });
              // }
            }
          }
        }
        if (!isHasSortRule) {
          results.push({ field, fieldIndex: l, func: naturalSort });
        }
      }
      return results;
    }.call(this);
    return function (a: string[], b: string[]) {
      let comparison;
      let sorter;
      for (let i = 0; i < sortersArr.length; i++) {
        sorter = sortersArr[i];
        if (sorter.sortRule?.sortByIndicator) {
          let aChanged = a;
          let bChanged = b;
          if (sorter.fieldIndex < fieldArr.length - 1) {
            aChanged = a.slice(0, sorter.fieldIndex + 1);
            aChanged.push(isRow ? that.totals?.row?.subTotalLabel : that.totals?.column?.subTotalLabel);
            bChanged = b.slice(0, sorter.fieldIndex + 1);
            bChanged.push(isRow ? that.totals?.row?.subTotalLabel : that.totals?.column?.subTotalLabel);
          }
          comparison = sorter.func(aChanged, bChanged, sorter.sortRule?.sortType);
        } else {
          comparison = sorter.func(a[sorter.fieldIndex], b[sorter.fieldIndex], sorter.sortRule?.sortType);
        }
        if (comparison !== 0) {
          return comparison * (sorter.sortRule?.sortType === SortType.DESC ? -1 : 1);
        }
      }
      return 0;
    };
  }
  /**
   * 根据具体排序 获取不同的排序函数
   * @param sortRule
   * @returns
   */
  getSort(sortRule: SortRule, isSortRow: boolean) {
    const that = this;

    if ((<SortByIndicatorRule>sortRule).sortByIndicator) {
      return (a: string[], b: string[], sortType?: SortType) => {
        /**
         * 根据rowKey和colKey获取tree上对应的聚合值
         * @param rowKey
         * @param colKey
         * @returns
         */
        const getValue = function (rowKey: any, colKey: any) {
          //如果rowKey提供的不全 如 [地区,省,城市] 只提供了如[华东,山东] 会补全为[华东,山东,小计]
          if (
            rowKey.length < that.rows.length &&
            rowKey[rowKey.length - 1] !== that.rowSubTotalLabel &&
            rowKey[rowKey.length - 1] !== that.rowGrandTotalLabel
          ) {
            rowKey.push(that.rowSubTotalLabel);
          }
          if (
            colKey.length < that.columns.length &&
            colKey[colKey.length - 1] !== that.colSubTotalLabel &&
            colKey[colKey.length - 1] !== that.colGrandTotalLabel
          ) {
            colKey.push(that.colSubTotalLabel);
          }
          return that.getAggregator(rowKey, colKey, (<SortByIndicatorRule>sortRule).sortByIndicator).value();
        };
        if (isSortRow) {
          return naturalSort(
            getValue(a, (<SortByIndicatorRule>sortRule).query),
            getValue(b, (<SortByIndicatorRule>sortRule).query),
            sortType
          );
        }
        return naturalSort(
          getValue((<SortByIndicatorRule>sortRule).query, a),
          getValue((<SortByIndicatorRule>sortRule).query, b),
          sortType
        );
      };
    } else if ((<SortByRule>sortRule).sortBy) {
      return sortBy((<SortByRule>sortRule).sortBy);
    }
    if ((<SortTypeRule>sortRule).sortType) {
      return typeSort;
    }
    if ((<SortFuncRule>sortRule).sortFunc) {
      return (<SortFuncRule>sortRule).sortFunc;
    }
    return naturalSort;
  }
  /**
   * 汇总小计
   */
  totalStatistics() {
    const that = this;
    if (
      (that?.totals?.column?.showSubTotals && that?.totals?.column?.subTotalsDimensions?.length >= 1) ||
      (that?.totals?.row?.showSubTotals && that?.totals?.row?.subTotalsDimensions?.length >= 1) ||
      that?.totals?.column?.showGrandTotals ||
      that?.totals?.row?.showGrandTotals ||
      that.rows.length === 0 ||
      that.columns.length === 0
    ) {
      const rowTotalKeys: string[] = [];
      /**
       * 计算每一行的所有列的汇总值
       * @param flatRowKey
       * @param flatColKey
       */
      const colCompute = (flatRowKey: string, flatColKey: string) => {
        const colKey = flatColKey.split(this.stringJoinChar);
        for (let i = 0, len = that.totals?.column?.subTotalsDimensions?.length; i < len; i++) {
          const dimension = that.totals.column.subTotalsDimensions[i];
          const dimensionIndex = that.columns.indexOf(dimension);
          if (dimensionIndex >= 0) {
            const colTotalKey = colKey.slice(0, dimensionIndex + 1);
            colTotalKey.push(that.totals?.column?.subTotalLabel ?? '小计');
            const flatColTotalKey = colTotalKey.join(this.stringJoinChar);
            if (!this.tree[flatRowKey][flatColTotalKey]) {
              this.tree[flatRowKey][flatColTotalKey] = [];
            }
            for (let i = 0; i < this.indicatorKeys.length; i++) {
              if (!this.tree[flatRowKey][flatColTotalKey][i]) {
                const aggRule = this.getAggregatorRule(this.indicatorKeys[i]);
                this.tree[flatRowKey][flatColTotalKey][i] = new this.aggregators[
                  aggRule?.aggregationType ?? AggregationType.SUM
                ](aggRule?.field ?? this.indicatorKeys[i], aggRule?.formatFun);
              }
              this.tree[flatRowKey][flatColTotalKey][i].push(that.tree[flatRowKey]?.[flatColKey]?.[i]);
            }
          }
        }
        if (that.totals?.column?.showGrandTotals || this.rows.length === 0) {
          const flatColTotalKey = that.colGrandTotalLabel;
          if (!this.tree[flatRowKey][flatColTotalKey]) {
            this.tree[flatRowKey][flatColTotalKey] = [];
          }
          for (let i = 0; i < this.indicatorKeys.length; i++) {
            if (!this.tree[flatRowKey][flatColTotalKey][i]) {
              const aggRule = this.getAggregatorRule(this.indicatorKeys[i]);
              this.tree[flatRowKey][flatColTotalKey][i] = new this.aggregators[
                aggRule?.aggregationType ?? AggregationType.SUM
              ](aggRule?.field ?? this.indicatorKeys[i], aggRule?.formatFun);
            }
            this.tree[flatRowKey][flatColTotalKey][i].push(that.tree[flatRowKey]?.[flatColKey]?.[i]);
          }
        }
      };
      Object.keys(that.tree).forEach(flatRowKey => {
        const rowKey = flatRowKey.split(this.stringJoinChar);
        Object.keys(that.tree[flatRowKey]).forEach(flatColKey => {
          for (let i = 0, len = that.totals?.row?.subTotalsDimensions?.length; i < len; i++) {
            const dimension = that.totals.row.subTotalsDimensions[i];
            const dimensionIndex = that.rows.indexOf(dimension);
            if (dimensionIndex >= 0) {
              const rowTotalKey = rowKey.slice(0, dimensionIndex + 1);
              rowTotalKey.push(that.totals?.row?.subTotalLabel ?? '小计');
              const flatRowTotalKey = rowTotalKey.join(this.stringJoinChar);
              if (!this.tree[flatRowTotalKey]) {
                this.tree[flatRowTotalKey] = {};
                rowTotalKeys.push(flatRowTotalKey);
              }
              if (!this.tree[flatRowTotalKey][flatColKey]) {
                this.tree[flatRowTotalKey][flatColKey] = [];
                for (let i = 0; i < this.indicatorKeys.length; i++) {
                  if (!this.tree[flatRowTotalKey][flatColKey][i]) {
                    const aggRule = this.getAggregatorRule(this.indicatorKeys[i]);
                    this.tree[flatRowTotalKey][flatColKey][i] = new this.aggregators[
                      aggRule?.aggregationType ?? AggregationType.SUM
                    ](aggRule?.field ?? this.indicatorKeys[i], aggRule?.formatFun);
                  }
                  this.tree[flatRowTotalKey][flatColKey][i].push(that.tree[flatRowKey]?.[flatColKey]?.[i]);
                }
              }
            }
            if (that.totals?.row?.showGrandTotals || this.columns.length === 0) {
              const flatRowTotalKey = that.rowGrandTotalLabel;
              if (!this.tree[flatRowTotalKey]) {
                this.tree[flatRowTotalKey] = {};
                rowTotalKeys.push(flatRowTotalKey);
              }
              if (!this.tree[flatRowTotalKey][flatColKey]) {
                this.tree[flatRowTotalKey][flatColKey] = [];
              }
              for (let i = 0; i < this.indicatorKeys.length; i++) {
                if (!this.tree[flatRowTotalKey][flatColKey][i]) {
                  const aggRule = this.getAggregatorRule(this.indicatorKeys[i]);
                  this.tree[flatRowTotalKey][flatColKey][i] = new this.aggregators[
                    aggRule?.aggregationType ?? AggregationType.SUM
                  ](aggRule?.field ?? this.indicatorKeys[i], aggRule?.formatFun);
                }
                this.tree[flatRowTotalKey][flatColKey][i].push(that.tree[flatRowKey]?.[flatColKey]?.[i]);
              }
            }
            colCompute(flatRowKey, flatColKey);
          }
        });
      });
      //增加出来的rowTotalKeys 再遍历一次 汇总小计的小计 如 东北小计（row）-办公用品小计（col）所指单元格的值
      rowTotalKeys.forEach(flatRowKey => {
        Object.keys(that.tree[flatRowKey]).forEach(flatColKey => {
          colCompute(flatRowKey, flatColKey);
        });
      });
    }
  }
  /**
   * 将rowKeys和colKeys 转为树形结构
   * @param arr
   * @param subTotalFlags 标志小计的维度
   * @returns
   */
  private ArrToTree(
    arr: string[][],
    subTotalFlags: boolean[],
    isGrandTotal: boolean,
    grandTotalLabel: string,
    subTotalLabel: string
  ) {
    /**
     *
     * @param {string} s 父级id
     * @param {number} n 需转换数字
     */
    // const getId = (pId: any, curId: any) => `${pId}$${curId}`;
    const result: any[] = []; // 结果
    const concatStr = this.stringJoinChar; // 连接符(随便写，保证key唯一性就OK)
    const map = new Map(); // 存储根节点 主要提升性能
    function addList(list: any) {
      const path: any[] = []; // 路径
      let node: any; // 当前节点
      list.forEach((value: any, index: number) => {
        path.push(value);
        const flatKey = path.join(concatStr);
        //id的值可以每次生成一个新的 这里用的path作为id 方便layout对象获取
        let item: { id: string; children: any[] } = map.get(flatKey); // 当前节点
        if (!item) {
          item = {
            // name: value,
            id: flatKey, //getId(node?.id ?? '', (node?.children?.length ?? result.length) + 1),
            children: []
          };
          if (subTotalFlags[index]) {
            let curChild = item.children;
            for (let i = index; i < list.length - 1; i++) {
              const totalChild: { id: string; children: any[] } = {
                id: `${flatKey}${concatStr}${subTotalLabel}`, // getId(item?.id, 1),
                children: []
              };
              curChild.push(totalChild);
              curChild = totalChild.children;
            }
          }
          map.set(flatKey, item); // 存储路径对应的节点
          if (node) {
            //为了确保汇总小计放到最后 使用splice插入到倒数第二个位置。如果小计放前面 直接push就行
            if (subTotalFlags[index - 1]) {
              node.children.splice(node.children.length - 1, 0, item);
            } else {
              node.children.push(item);
            }
          } else {
            result.push(item);
          }
        }
        node = item; // 更新当前节点
      });
    }

    arr.forEach(item => addList(item));
    //最后将总计的节点加上
    if (isGrandTotal) {
      const node: { id: string; children: any[] } = {
        id: grandTotalLabel, // getId(item?.id, 1),
        children: []
      };
      let curChild = node.children;
      for (let i = 1; i < subTotalFlags.length; i++) {
        const totalChild: { id: string; children: any[] } = {
          id: grandTotalLabel, // getId(item?.id, 1),
          children: []
        };
        curChild.push(totalChild);
        curChild = totalChild.children;
      }
      result.push(node);
    }
    return result;
  }
  //将树形结构转为二维数组 值为node.id
  private TreeToArr(tree: any) {
    const result: any[] = []; // 结果
    function getPath(node: any, arr: any) {
      arr.push(node.id);
      if (node.children.length > 0) {
        // 存在多个节点就递归
        node.children?.forEach((childItem: any) => getPath(childItem, [...arr]));
      } else {
        result.push(arr);
      }
    }
    tree.forEach((treeNode: any) => getPath(treeNode, []));
    return result;
  }
  private TreeToArr2(tree: any) {
    const result: any[] = []; // 结果
    function getPath(node: any, arr: any) {
      arr.push(arr.length > 0 ? [arr[arr.length - 1], node.value].join(String.fromCharCode(0)) : node.value);
      if (node.children?.length > 0) {
        // 存在多个节点就递归
        node.children?.forEach((childItem: any) => getPath(childItem, [...arr]));
      } else {
        result.push(arr);
      }
    }
    tree.forEach((treeNode: any) => getPath(treeNode, []));
    return result;
  }
}
