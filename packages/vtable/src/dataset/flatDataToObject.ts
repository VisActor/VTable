import { isValid } from '@visactor/vutils';
import { Env } from '../tools/env';

// if (Env.mode === 'node') {
//   // eslint-disable-next-line no-global-assign
//   window = {
//     performance: {
//       now: () => -1,
//     },
//   } as any;
// }
/**
 * 针对聚合好的flat数据转为便于查询的行列树对象，每一个显示的指标值都能从一条数据记录中获得
 */
export class FlatDataToObjects {
  /**
   * 用户配置
   */
  dataConfig: {
    rows: string[]; //行维度字段数组；
    columns: string[]; //列维度字段数组；
    indicators: string[]; //具体展示指标；
    indicatorsAsCol: boolean;
    indicatorDimensionKey: string | number;
  };
  /**
   * 明细数据
   */
  records: any[];
  /**
   * 树形节点，最后的子节点对应到body部分的每个单元格 树结构： 行-列-单元格
   */
  tree: Record<string, Record<string, Record<string, any>>> = {};
  beforeChangedTree: Record<string, Record<string, { record: any; value: string }>> = {};
  private colFlatKeys = {};
  private rowFlatKeys = {};

  // //列表头的每列对应的表头键值
  // colKeys: string[][] = [];
  // //行表头的每行对应的表头键值
  // rowKeys: string[][] = [];
  // /**
  //  * 对应dataset中的rowKeys，行表头的每行表头键值，包含小计总计
  //  */
  // rowKeysPath: string[][];
  // /**
  //  * 对应dataset中的colKeys，列表头的每列表头键值，包含小计总计
  //  */
  // colKeysPath: string[][];

  stringJoinChar = String.fromCharCode(0);
  //缓存rows对应每个值是否为汇总字段
  private rowsIsTotal: boolean[] = [];
  private colsIsTotal: boolean[] = [];
  private colGrandTotalLabel: string;
  private colSubTotalLabel: string;
  private rowGrandTotalLabel: string;
  private rowSubTotalLabel: string;
  constructor(
    dataConfig: {
      rows: string[]; //行维度字段数组；
      columns: string[]; //列维度字段数组；
      indicators: string[]; //具体展示指标；
      indicatorsAsCol: boolean;
      indicatorDimensionKey: string | number;
    },
    records?: any[]
  ) {
    this.dataConfig = dataConfig;
    // this.allTotal = new SumAggregator(this.dataConfig.indicators[0]);

    if (records) {
      //处理数据
      this.records = records;
      const t0 = typeof window !== 'undefined' ? window.performance.now() : 0;
      this.setRecords(records);
      const t1 = typeof window !== 'undefined' ? window.performance.now() : 0;
      console.log('processRecords:', t1 - t0);
    }

    // delete this.rowFlatKeys;
    // delete this.colFlatKeys;
  }
  changeDataConfig(dataConfig: {
    rows: string[]; //行维度字段数组；
    columns: string[]; //列维度字段数组；
    indicators: string[]; //具体展示指标；
    indicatorsAsCol: boolean;
    indicatorDimensionKey: string | number;
  }) {
    this.dataConfig = dataConfig;
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
      this.processRecord(record);
    }
  }

  /**
   * 处理单条数据
   * @param record
   * @returns
   */
  processRecord(record: any) {
    const colKey: any[] = [];
    const rowKey: any[] = [];

    for (let l = 0, len1 = this.dataConfig.rows.length; l < len1; l++) {
      const rowAttr = this.dataConfig.rows[l];
      if (
        // record[rowAttr] !== null &&
        record[rowAttr] !== undefined &&
        rowAttr !== this.dataConfig.indicatorDimensionKey
      ) {
        rowKey.push(record[rowAttr]);
      }
    }
    for (let n = 0, len2 = this.dataConfig.columns.length; n < len2; n++) {
      const colAttr = this.dataConfig.columns[n];
      if (
        // record[colAttr] !== null &&
        record[colAttr] !== undefined &&
        colAttr !== this.dataConfig.indicatorDimensionKey
      ) {
        colKey.push(record[colAttr]);
      }
    }

    this.dataConfig.indicators?.forEach((indicatorKey: string | number) => {
      const recordValue: string | number = record[indicatorKey];
      // const indicatorName = this.dataConfig.indicators[indicatorKey];
      if (recordValue !== undefined) {
        if (this.dataConfig.indicatorsAsCol) {
          colKey.push(indicatorKey);
        } else {
          rowKey.push(indicatorKey);
        }
      }

      // record[indicatorKey] && (recordValue = record[indicatorKey]);

      // this.allTotal.push(record);

      const flatRowKey = rowKey.join(this.stringJoinChar);
      const flatColKey = colKey.join(this.stringJoinChar);

      if (rowKey.length !== 0) {
        if (!this.rowFlatKeys[flatRowKey]) {
          this.rowFlatKeys[flatRowKey] = 1;
        }
      }
      if (colKey.length !== 0) {
        if (!this.colFlatKeys[flatColKey]) {
          this.colFlatKeys[flatColKey] = 1;
        }
      }

      if (colKey.length !== 0 || rowKey.length !== 0) {
        if (!this.tree[flatRowKey]) {
          this.tree[flatRowKey] = {};
        }
        if (recordValue !== undefined) {
          this.tree[flatRowKey][flatColKey] = { value: recordValue, record };
          if (this.dataConfig.indicatorsAsCol) {
            colKey.pop();
          } else {
            rowKey.pop();
          }
        }
      }
    });
  }

  getTreeNode(
    rowKey: string[] | string = [],
    colKey: string[] | string = [],
    indicator: string,
    ifChangedValue: boolean = true
  ): Record<string, any> {
    let flatRowKey;
    let flatColKey;
    if (typeof rowKey === 'string') {
      flatRowKey = rowKey;
    } else {
      //考虑 指标key有可能在数组中间位置或者前面的可能 将其删除再添加到尾部
      let isHasIndicator = false;
      rowKey.map((key, i) => {
        if (key === indicator) {
          rowKey.splice(i, 1);
          isHasIndicator = true;
        }
      });
      isHasIndicator && rowKey.push(indicator);
      flatRowKey = rowKey.join(this.stringJoinChar);
    }

    if (typeof colKey === 'string') {
      flatColKey = colKey;
    } else {
      //考虑 指标key有可能在数组中间位置或者前面的可能 将其删除再添加到尾部
      let isHasIndicator = false;
      colKey.map((key, i) => {
        if (key === indicator) {
          colKey.splice(i, 1);
          isHasIndicator = true;
        }
      });
      isHasIndicator && colKey.push(indicator);
      flatColKey = colKey.join(this.stringJoinChar);
    }

    if (ifChangedValue) {
      return this.tree?.[flatRowKey]?.[flatColKey] ?? undefined;
    }
    if (isValid(this.beforeChangedTree[flatRowKey]?.[flatColKey])) {
      return {
        value: this.beforeChangedTree[flatRowKey][flatColKey].value,
        record: this.beforeChangedTree[flatRowKey][flatColKey].record
      };
    }
    return undefined;
  }

  changeTreeNodeValue(rowKey: string[] = [], colKey: string[] = [], indicator: string, newValue: any) {
    let flatRowKey;
    let flatColKey;
    if (typeof rowKey === 'string') {
      flatRowKey = rowKey;
    } else {
      //考虑 指标key有可能在数组中间位置或者前面的可能 将其删除再添加到尾部
      let isHasIndicator = false;
      rowKey.map((key, i) => {
        if (key === indicator) {
          rowKey.splice(i, 1);
          isHasIndicator = true;
        }
      });
      isHasIndicator && rowKey.push(indicator);
      flatRowKey = rowKey.join(this.stringJoinChar);
    }

    if (typeof colKey === 'string') {
      flatColKey = colKey;
    } else {
      //考虑 指标key有可能在数组中间位置或者前面的可能 将其删除再添加到尾部
      let isHasIndicator = false;
      colKey.map((key, i) => {
        if (key === indicator) {
          colKey.splice(i, 1);
          isHasIndicator = true;
        }
      });
      isHasIndicator && colKey.push(indicator);
      flatColKey = colKey.join(this.stringJoinChar);
    }
    const oldValue = this.tree[flatRowKey]?.[flatColKey]?.value;
    const oldRecord = Object.assign({}, this.tree[flatRowKey]?.[flatColKey]?.record);
    if (this.tree[flatRowKey]?.[flatColKey]?.record) {
      this.tree[flatRowKey][flatColKey].record[indicator] = newValue;
      this.tree[flatRowKey][flatColKey].value = newValue;
    } else {
      if (!this.tree[flatRowKey]) {
        this.tree[flatRowKey] = {};
      }
      // 没有对应数据需要添加进去
      this.tree[flatRowKey][flatColKey] = {
        record: this._buildRecord(rowKey, colKey, indicator, newValue),
        value: newValue
      };
    }
    if (!this.beforeChangedTree[flatRowKey]?.[flatColKey]) {
      this.beforeChangedTree[flatRowKey] = {};
      this.beforeChangedTree[flatRowKey][flatColKey] = { record: undefined, value: undefined };
      this.beforeChangedTree[flatRowKey][flatColKey].record = oldRecord;
      this.beforeChangedTree[flatRowKey][flatColKey].value = oldValue;
    }
  }

  _buildRecord(rowKey: string[] = [], colKey: string[] = [], indicator: string, value: any) {
    const record = {};
    const rowDimensions = this.dataConfig.rows;
    const colDimensions = this.dataConfig.columns;
    rowDimensions.forEach((dimension, index) => {
      if (dimension !== this.dataConfig.indicatorDimensionKey) {
        record[dimension] = rowKey[index];
      }
    });
    colDimensions.forEach((dimension, index) => {
      if (dimension !== this.dataConfig.indicatorDimensionKey) {
        record[dimension] = colKey[index];
      }
    });
    record[indicator] = value;
    this.records.push(record);
    return record;
  }
  addRecords(records: any[]) {
    for (let i = 0, len = records.length; i < len; i++) {
      const record = records[i];
      this.processRecord(record);
    }
    this.records.push(records);
  }
  changeRecordFieldValue(fieldName: string, oldValue: string | number, value: string | number) {
    let isIndicatorName = false;

    for (let i = 0; i < this.dataConfig.indicators.length; i++) {
      if (this.dataConfig.indicators[i] === fieldName) {
        isIndicatorName = true;
      }
    }
    if (!isIndicatorName) {
      for (let i = 0, len = this.records.length; i < len; i++) {
        const record = this.records[i];
        if (record[fieldName] === oldValue) {
          record[fieldName] = value;
        }
      }
      this.rowFlatKeys = {};
      this.colFlatKeys = {};
      this.tree = {};
      this.processRecords();
    }
  }
}
