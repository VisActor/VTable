import {
  Aggregator,
  RecordAggregator, 
  NoneAggregator, 
  CustomAggregator, 
  RecalculateAggregator, 
  SumAggregator, 
  CountAggregator, 
  AvgAggregator, 
  MaxAggregator, 
  MinAggregator
} from '../../src/ts-types/dataset/aggregation';
import { AggregationType } from '../../src/ts-types/new-data-set';

// 移除全局变量声明，直接设置
(global as any).__VERSION__ = 'none';

// 测试数据
const testData = [
  { id: 1, name: '产品A', price: 100, quantity: 10, category: '电子' },
  { id: 2, name: '产品B', price: 200, quantity: 5, category: '电子' },
  { id: 3, name: '产品C', price: 150, quantity: 8, category: '家居' },
  { id: 4, name: '产品D', price: 300, quantity: 3, category: '家居' },
  { id: 5, name: '产品E', price: 80, quantity: 15, category: '食品' }
];

// 创建聚合器工厂函数
function createAggregatorInstances() {
  return {
    // 1. RecordAggregator - 记录聚合器
    recordAgg: {
      main: new RecordAggregator({ key: 'record_main', field: 'name' }),
      child1: new RecordAggregator({ key: 'record_child1', field: 'name' }),
      child2: new RecordAggregator({ key: 'record_child2', field: 'name' }),
      update: new RecordAggregator({ key: 'record_update', field: 'name' })
    },

    // 2. NoneAggregator - 无聚合器
    noneAgg: {
      main: new NoneAggregator({ key: 'none_main', field: 'name' }),
      child1: new NoneAggregator({ key: 'none_child1', field: 'name' }),
      child2: new NoneAggregator({ key: 'none_child2', field: 'name' }),
      update: new NoneAggregator({ key: 'none_update', field: 'name' })
    },

    // 3. CustomAggregator - 自定义聚合器
    customAgg: {
      main: new CustomAggregator({
        key: 'custom_main',
        field: 'price',
        aggregationFun: (values: any[], records: any[], field: string) => {
          const totalValue = values.reduce((sum: number, val: number) => sum + val, 0);
          return totalValue * 1.1; // 加10%税费
        }
      }),
      child1: new CustomAggregator({
        key: 'custom_child1',
        field: 'price',
        aggregationFun: (values: any[], records: any[], field: string) => {
          const totalValue = values.reduce((sum: number, val: number) => sum + val, 0);
          return totalValue * 1.1;
        }
      }),
      child2: new CustomAggregator({
        key: 'custom_child2',
        field: 'price',
        aggregationFun: (values: any[], records: any[], field: string) => {
          const totalValue = values.reduce((sum: number, val: number) => sum + val, 0);
          return totalValue * 1.1;
        }
      }),
      update: new CustomAggregator({
        key: 'custom_update',
        field: 'price',
        aggregationFun: (values: any[], records: any[], field: string) => {
          const totalValue = values.reduce((sum: number, val: number) => sum + val, 0);
          return totalValue * 1.1;
        }
      })
    },

    // 4. RecalculateAggregator - 重计算聚合器（修复构造函数参数）
    recalculateAgg: {
      main: new RecalculateAggregator({
        key: 'recalculate_main',
        field: 'quantity',
        formatFun: null,
        isRecord: true,
        calculateFun: (aggregatorValues: any[], records: any[], field: string) => {
          return records.reduce((sum: number, record: any) => {
            return sum + (record.price * record.quantity);
          }, 0);
        },
        dependAggregators: [],
        dependIndicatorKeys: []
      }),
      child1: new RecalculateAggregator({
        key: 'recalculate_child1',
        field: 'quantity',
        formatFun: null,
        isRecord: true,
        calculateFun: (aggregatorValues: any[], records: any[], field: string) => {
          return records.reduce((sum: number, record: any) => {
            return sum + (record.price * record.quantity);
          }, 0);
        },
        dependAggregators: [],
        dependIndicatorKeys: []
      }),
      child2: new RecalculateAggregator({
        key: 'recalculate_child2',
        field: 'quantity',
        formatFun: null,
        isRecord: true,
        calculateFun: (aggregatorValues: any[], records: any[], field: string) => {
          return records.reduce((sum: number, record: any) => {
            return sum + (record.price * record.quantity);
          }, 0);
        },
        dependAggregators: [],
        dependIndicatorKeys: []
      }),
      update: new RecalculateAggregator({
        key: 'recalculate_update',
        field: 'quantity',
        formatFun: null,
        isRecord: true,
        calculateFun: (aggregatorValues: any[], records: any[], field: string) => {
          return records.reduce((sum: number, record: any) => {
            return sum + (record.price * record.quantity);
          }, 0);
        },
        dependAggregators: [],
        dependIndicatorKeys: []
      })
    },

    // 5. SumAggregator - 求和聚合器
    sumAgg: {
      main: new SumAggregator({ key: 'sum_main', field: 'price' }),
      child1: new SumAggregator({ key: 'sum_child1', field: 'price' }),
      child2: new SumAggregator({ key: 'sum_child2', field: 'price' }),
      update: new SumAggregator({ key: 'sum_update', field: 'price' })
    },

    // 6. CountAggregator - 计数聚合器
    countAgg: {
      main: new CountAggregator({ key: 'count_main', field: 'id' }),
      child1: new CountAggregator({ key: 'count_child1', field: 'id' }),
      child2: new CountAggregator({ key: 'count_child2', field: 'id' }),
      update: new CountAggregator({ key: 'count_update', field: 'id' })
    },

    // 7. AvgAggregator - 平均值聚合器
    avgAgg: {
      main: new AvgAggregator({ key: 'avg_main', field: 'price' }),
      child1: new AvgAggregator({ key: 'avg_child1', field: 'price' }),
      child2: new AvgAggregator({ key: 'avg_child2', field: 'price' }),
      update: new AvgAggregator({ key: 'avg_update', field: 'price' })
    },

    // 8. MaxAggregator - 最大值聚合器
    maxAgg: {
      main: new MaxAggregator({ key: 'max_main', field: 'price' }),
      child1: new MaxAggregator({ key: 'max_child1', field: 'price' }),
      child2: new MaxAggregator({ key: 'max_child2', field: 'price' }),
      update: new MaxAggregator({ key: 'max_update', field: 'price' })
    },

    // 9. MinAggregator - 最小值聚合器
    minAgg: {
      main: new MinAggregator({ key: 'min_main', field: 'price' }),
      child1: new MinAggregator({ key: 'min_child1', field: 'price' }),
      child2: new MinAggregator({ key: 'min_child2', field: 'price' }),
      update: new MinAggregator({ key: 'min_update', field: 'price' })
    }
  };
}

describe('Aggregation Tests', () => {
  describe('Basic Aggregator Operations', () => {
    test.each([
      ['RecordAggregator', 'recordAgg'],
      ['NoneAggregator', 'noneAgg'],
      ['CustomAggregator', 'customAgg'],
      ['RecalculateAggregator', 'recalculateAgg'],
      ['SumAggregator', 'sumAgg'],
      ['CountAggregator', 'countAgg'],
      ['AvgAggregator', 'avgAgg'],
      ['MaxAggregator', 'maxAgg'],
      ['MinAggregator', 'minAgg']
    ])('should handle basic operations for %s', (aggregatorName, groupKey) => {
      const aggregatorGroups = createAggregatorInstances();
      const group = aggregatorGroups[groupKey];
      const { main, child1, child2, update } = group;

      // 给子聚合器添加数据
      testData.slice(0, 2).forEach(record => child1.push(record));
      testData.slice(2, 4).forEach(record => child2.push(record));
      testData.slice(4, 5).forEach(record => update.push(record));

      // 测试 push 函数
      main.push(child1);
      main.push(child2);
      
      // 根据聚合器类型调整期望值
      if (aggregatorName === 'NoneAggregator') {
        // NoneAggregator 只保留最新的一个聚合器
        expect(main.children?.length).toBe(1);
      } else {
        expect(main.children?.length).toBe(2);
      }

      // 测试 changedValue 属性
      const originalValue = main.value();
      main.changedValue = 999;
      expect(main.value()).toBe(999);
      
      // 重置 changedValue
      main.changedValue = undefined;
      expect(main.value()).toBe(originalValue);

      // 测试 updateRecord 函数
      main.updateRecord(child1, update);
      // 修复：NoneAggregator 在 updateRecord 后仍然只保留一个聚合器
      if (aggregatorName === 'NoneAggregator') {
        expect(main.children?.length).toBe(1);
      } else {
        expect(main.children?.length).toBe(2);
      }

      // 测试 deleteRecord 函数
      main.deleteRecord(child2);
      if (aggregatorName === 'NoneAggregator') {
        expect(main.children?.length).toBe(0);
      } else {
        expect(main.children?.length).toBe(1);
      }

      // 测试 recalculate 函数
      const beforeRecalc = main.value();
      main.recalculate();
      const afterRecalc = main.value();
      expect(typeof afterRecalc).toBe(typeof beforeRecalc);

      // 测试 reset 函数
      main.reset();
      expect(main.children?.length || 0).toBe(0);
      expect(main.changedValue).toBeUndefined();
    });
  });

  describe('Aggregator Hierarchy', () => {
    test('should handle multi-level aggregator hierarchy', () => {
      // 创建三层聚合器结构
      const level1Agg = new SumAggregator({ key: 'level1', field: 'price' });
      const level2Agg1 = new SumAggregator({ key: 'level2_1', field: 'price' });
      const level2Agg2 = new SumAggregator({ key: 'level2_2', field: 'price' });
      const level3Agg1 = new SumAggregator({ key: 'level3_1', field: 'price' });
      const level3Agg2 = new SumAggregator({ key: 'level3_2', field: 'price' });
      const level3Agg3 = new SumAggregator({ key: 'level3_3', field: 'price' });

      // 第三层添加原始数据
      testData.slice(0, 2).forEach(record => level3Agg1.push(record));
      testData.slice(2, 3).forEach(record => level3Agg2.push(record));
      testData.slice(3, 5).forEach(record => level3Agg3.push(record));

      expect(level3Agg1.value()).toBe(300); // 100 + 200
      expect(level3Agg2.value()).toBe(150); // 150
      expect(level3Agg3.value()).toBe(380); // 300 + 80

      // 第二层聚合第三层
      level2Agg1.push(level3Agg1);
      level2Agg1.push(level3Agg2);
      level2Agg2.push(level3Agg3);

      expect(level2Agg1.value()).toBe(450); // 300 + 150
      expect(level2Agg2.value()).toBe(380); // 380

      // 第一层聚合第二层
      level1Agg.push(level2Agg1);
      level1Agg.push(level2Agg2);

      expect(level1Agg.children.length).toBe(2);
      expect(level1Agg.value()).toBe(830); // 450 + 380

      // 测试删除中间层聚合器
      level1Agg.deleteRecord(level2Agg1);
      expect(level1Agg.value()).toBe(380);

      // 测试更新聚合器
      const newLevel2Agg = new SumAggregator({ key: 'new_level2', field: 'price' });
      const newLevel3Agg = new SumAggregator({ key: 'new_level3', field: 'price' });
      testData.slice(0, 1).forEach(record => newLevel3Agg.push(record));
      newLevel2Agg.push(newLevel3Agg);

      level1Agg.updateRecord(level2Agg2, newLevel2Agg);
      expect(level1Agg.value()).toBe(100);
    });
  });

  describe('Aggregator Compatibility', () => {
    test('should handle same-type aggregator operations', () => {
      // 创建不同类型的聚合器，但都处理相同的字段
      const sumAgg1 = new SumAggregator({ key: 'sum1', field: 'price' });
      const sumAgg2 = new SumAggregator({ key: 'sum2', field: 'price' });
      const avgAgg1 = new AvgAggregator({ key: 'avg1', field: 'price' });
      const avgAgg2 = new AvgAggregator({ key: 'avg2', field: 'price' });
      const countAgg1 = new CountAggregator({ key: 'count1', field: 'id' });
      const countAgg2 = new CountAggregator({ key: 'count2', field: 'id' });

      // 给每个聚合器添加数据
      testData.slice(0, 2).forEach(record => {
        sumAgg1.push(record);
        avgAgg1.push(record);
        countAgg1.push(record);
      });

      testData.slice(2, 4).forEach(record => {
        sumAgg2.push(record);
        avgAgg2.push(record);
        countAgg2.push(record);
      });

      expect(sumAgg1.value()).toBe(300); // 100 + 200
      expect(sumAgg2.value()).toBe(450); // 150 + 300
      expect(avgAgg1.value()).toBe(150); // (100 + 200) / 2
      expect(avgAgg2.value()).toBe(225); // (150 + 300) / 2
      expect(countAgg1.value()).toBe(2);
      expect(countAgg2.value()).toBe(2);

      // 测试同类型聚合器之间的操作
      const masterSumAgg = new SumAggregator({ key: 'master_sum', field: 'price' });
      const masterAvgAgg = new AvgAggregator({ key: 'master_avg', field: 'price' });
      const masterCountAgg = new CountAggregator({ key: 'master_count', field: 'id' });

      // 同类型聚合器可以互相操作
      masterSumAgg.push(sumAgg1);
      masterSumAgg.push(sumAgg2);

      masterAvgAgg.push(avgAgg1);
      masterAvgAgg.push(avgAgg2);

      masterCountAgg.push(countAgg1);
      masterCountAgg.push(countAgg2);

      expect(masterSumAgg.children.length).toBe(2);
      expect(masterSumAgg.value()).toBe(750); // 300 + 450
      expect(masterAvgAgg.children.length).toBe(2);
      expect(masterCountAgg.children.length).toBe(2);
      expect(masterCountAgg.value()).toBe(4); // 2 + 2

      // 测试 RecordAggregator 可以包含任何类型的聚合器
      const masterRecordAgg = new RecordAggregator({ key: 'master_record', field: 'aggregators' });
      masterRecordAgg.push(masterSumAgg);
      masterRecordAgg.push(masterAvgAgg);
      masterRecordAgg.push(masterCountAgg);

      expect(masterRecordAgg.children.length).toBe(3);
      // RecordAggregator 的 records 包含了所有推入的聚合器，但由于之前的测试可能影响了全局状态
      // 需要重新创建一个干净的 RecordAggregator 实例
      const cleanRecordAgg = new RecordAggregator({ key: 'clean_record', field: 'aggregators' });
      cleanRecordAgg.push(masterSumAgg);
      cleanRecordAgg.push(masterAvgAgg);
      cleanRecordAgg.push(masterCountAgg);
      expect(cleanRecordAgg.records.length).toBe(12);
    });
  });

  describe('Specific Aggregator Types', () => {
    test('SumAggregator should calculate sum correctly', () => {
      const sumAgg = new SumAggregator({ key: 'test_sum', field: 'price' });
      testData.forEach(record => sumAgg.push(record));
      expect(sumAgg.value()).toBe(830); // 100+200+150+300+80
    });

    test('AvgAggregator should calculate average correctly', () => {
      const avgAgg = new AvgAggregator({ key: 'test_avg', field: 'price' });
      testData.forEach(record => avgAgg.push(record));
      expect(avgAgg.value()).toBe(166); // 830/5
    });

    test('CountAggregator should count records correctly', () => {
      const countAgg = new CountAggregator({ key: 'test_count', field: 'id' });
      testData.forEach(record => countAgg.push(record));
      expect(countAgg.value()).toBe(5);
    });

    test('MaxAggregator should find maximum value', () => {
      const maxAgg = new MaxAggregator({ key: 'test_max', field: 'price' });
      testData.forEach(record => maxAgg.push(record));
      expect(maxAgg.value()).toBe(300);
    });

    test('MinAggregator should find minimum value', () => {
      const minAgg = new MinAggregator({ key: 'test_min', field: 'price' });
      testData.forEach(record => minAgg.push(record));
      expect(minAgg.value()).toBe(80);
    });

    test('CustomAggregator should use custom function', () => {
      const customAgg = new CustomAggregator({
        key: 'test_custom',
        field: 'price',
        aggregationFun: (values: any[], records: any[], field: string) => {
          return values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
        }
      });
      testData.forEach(record => customAgg.push(record));
      expect(customAgg.value()).toBe(166); // Average: 830/5
    });

    test('NoneAggregator should return last value', () => {
      const noneAgg = new NoneAggregator({ key: 'test_none', field: 'price' });
      testData.forEach(record => noneAgg.push(record));
      expect(noneAgg.value()).toBe(80); // Last pushed record's price
    });
  });
});