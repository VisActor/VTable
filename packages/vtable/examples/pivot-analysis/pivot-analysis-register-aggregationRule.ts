import * as VTable from '../../src';
import type { BaseTableAPI } from '../../src/ts-types/base-table';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

class AvgPriceAggregator extends VTable.TYPES.Aggregator {
  sales_sum: number = 0;
  number_sum: number = 0;
  constructor(config: { key: string; field: string; formatFun?: any }) {
    super(config);
    this.key = config.key;
    this.formatFun = config.formatFun;
  }
  push(record: any): void {
    if (record) {
      if (record.isAggregator) {
        this.records.push(...record.records);
      } else {
        this.records.push(record);
      }

      if (record.isAggregator) {
        this.sales_sum += record.sales_sum;
        this.number_sum += record.number_sum;
      } else {
        record.sales && (this.sales_sum += parseFloat(record.sales));
        record.number && (this.number_sum += parseFloat(record.number));
      }
    }
    this.clearCacheValue();
  }
  deleteRecord: (record: any) => void;
  updateRecord: (oldRecord: any, newRecord: any) => void;
  recalculate: () => any;
  clearCacheValue() {
    this._formatedValue = undefined;
  }
  value() {
    return this.records?.length >= 1 ? this.sales_sum / this.number_sum : undefined;
  }
  reset() {
    super.reset();
    this.sales_sum = 0;
    this.number_sum = 0;
  }
}
VTable.register.aggregator('avgPrice', AvgPriceAggregator);
const sumNumberFormat = VTable.DataStatistics.numberFormat({
  suffix: '元'
});
const countNumberFormat = VTable.DataStatistics.numberFormat({
  digitsAfterDecimal: 0,
  thousandsSep: '',
  suffix: '单'
});
export function createTable() {
  const option: VTable.PivotTableConstructorOptions = {
    rows: ['province', 'city'],
    columns: ['category', 'sub_category'],
    indicators: [
      '商品均价（注册聚合类）',
      {
        indicatorKey: '商品均价（计算字段）',
        title: '商品均价（计算字段）',
        format: sumNumberFormat
      }
    ],

    indicatorTitle: '指标名称',
    indicatorsAsCol: false,
    dataConfig: {
      aggregationRules: [
        //做聚合计算的依据，如销售额如果没有配置则默认按聚合sum计算结果显示单元格内容

        {
          indicatorKey: '商品均价（注册聚合类）', //指标名称
          field: 'sales', //指标依据字段
          aggregationType: 'avgPrice', //计算类型
          formatFun: sumNumberFormat
        }
      ],
      calculatedFieldRules: [
        {
          key: '商品均价（计算字段）',
          dependIndicatorKeys: ['number', 'sales'],
          calculateFun: (dependValue: any) => {
            return dependValue.sales / dependValue.number;
          }
        }
      ]
    },
    corner: { titleOnDimension: 'row' },
    records: [
      {
        sales: 891,
        number: 7789,
        province: '浙江省',
        city: '杭州市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 1891,
        number: 7789,
        province: '浙江省',
        city: '杭州市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 792,
        number: 2367,
        province: '浙江省',
        city: '绍兴市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 893,
        number: 3877,
        province: '浙江省',
        city: '宁波市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 1094,
        number: 4342,
        province: '浙江省',
        city: '舟山市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 1295,
        number: 5343,
        province: '浙江省',
        city: '杭州市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 496,
        number: 632,
        province: '浙江省',
        city: '绍兴市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 1097,
        number: 7234,
        province: '浙江省',
        city: '宁波市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 998,
        number: 834,
        province: '浙江省',
        city: '舟山市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 766,
        number: 945,
        province: '浙江省',
        city: '杭州市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 990,
        number: 1304,
        province: '浙江省',
        city: '绍兴市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 891,
        number: 1145,
        province: '浙江省',
        city: '宁波市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 792,
        number: 1432,
        province: '浙江省',
        city: '舟山市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 745,
        number: 1343,
        province: '浙江省',
        city: '杭州市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 843,
        number: 1354,
        province: '浙江省',
        city: '绍兴市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 895,
        number: 1523,
        province: '浙江省',
        city: '宁波市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 965,
        number: 1634,
        province: '浙江省',
        city: '舟山市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 776,
        number: 1723,
        province: '四川省',
        city: '成都市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 634,
        number: 1822,
        province: '四川省',
        city: '绵阳市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 909,
        number: 1943,
        province: '四川省',
        city: '南充市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 399,
        number: 2330,
        province: '四川省',
        city: '乐山市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 478,
        number: 1900,
        province: '四川省',
        city: '乐山市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 700,
        number: 2451,
        province: '四川省',
        city: '成都市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 689,
        number: 2244,
        province: '四川省',
        city: '绵阳市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 500,
        number: 2333,
        province: '四川省',
        city: '南充市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 800,
        number: 2445,
        province: '四川省',
        city: '乐山市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 1044,
        number: 2335,
        province: '四川省',
        city: '成都市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 689,
        number: 245,
        province: '四川省',
        city: '绵阳市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 794,
        number: 2457,
        province: '四川省',
        city: '南充市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 566,
        number: 2458,
        province: '四川省',
        city: '乐山市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 876,
        number: 1458,
        province: '四川省',
        city: '乐山市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 865,
        number: 4004,
        province: '四川省',
        city: '成都市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 999,
        number: 3077,
        province: '四川省',
        city: '绵阳市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 999,
        number: 3551,
        province: '四川省',
        city: '南充市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 999,
        number: 352,
        province: '四川省',
        city: '乐山市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 891,
        number: 7789,
        province: '浙江省',
        city: '杭州市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 1891,
        number: 7789,
        province: '浙江省',
        city: '杭州市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 792,
        number: 2367,
        province: '浙江省',
        city: '绍兴市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 893,
        number: 3877,
        province: '浙江省',
        city: '宁波市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 1094,
        number: 4342,
        province: '浙江省',
        city: '舟山市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 1295,
        number: 5343,
        province: '浙江省',
        city: '杭州市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 496,
        number: 632,
        province: '浙江省',
        city: '绍兴市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 1097,
        number: 7234,
        province: '浙江省',
        city: '宁波市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 998,
        number: 834,
        province: '浙江省',
        city: '舟山市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 766,
        number: 945,
        province: '浙江省',
        city: '杭州市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 990,
        number: 1304,
        province: '浙江省',
        city: '绍兴市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 891,
        number: 1145,
        province: '浙江省',
        city: '宁波市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 792,
        number: 1432,
        province: '浙江省',
        city: '舟山市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 745,
        number: 1343,
        province: '浙江省',
        city: '杭州市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 843,
        number: 1354,
        province: '浙江省',
        city: '绍兴市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 895,
        number: 1523,
        province: '浙江省',
        city: '宁波市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 965,
        number: 1634,
        province: '浙江省',
        city: '舟山市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 776,
        number: 1723,
        province: '四川省',
        city: '成都市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 634,
        number: 1822,
        province: '四川省',
        city: '绵阳市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 909,
        number: 1943,
        province: '四川省',
        city: '南充市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 399,
        number: 2330,
        province: '四川省',
        city: '乐山市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 478,
        number: 1900,
        province: '四川省',
        city: '乐山市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 700,
        number: 2451,
        province: '四川省',
        city: '成都市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 689,
        number: 2244,
        province: '四川省',
        city: '绵阳市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 500,
        number: 2333,
        province: '四川省',
        city: '南充市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 800,
        number: 2445,
        province: '四川省',
        city: '乐山市',
        category: '家具',
        sub_category: '沙发'
      },
      {
        sales: 1044,
        number: 2335,
        province: '四川省',
        city: '成都市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 689,
        number: 245,
        province: '四川省',
        city: '绵阳市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 794,
        number: 2457,
        province: '四川省',
        city: '南充市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 566,
        number: 2458,
        province: '四川省',
        city: '乐山市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 876,
        number: 1458,
        province: '四川省',
        city: '乐山市',
        category: '办公用品',
        sub_category: '笔'
      },
      {
        sales: 865,
        number: 4004,
        province: '四川省',
        city: '成都市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 999,
        number: 3077,
        province: '四川省',
        city: '绵阳市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 999,
        number: 3551,
        province: '四川省',
        city: '南充市',
        category: '办公用品',
        sub_category: '纸张'
      },
      {
        sales: 999,
        number: 352,
        province: '四川省',
        city: '乐山市',
        category: '办公用品',
        sub_category: '纸张'
      }
    ],
    widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
  };

  const instance = new PivotTable(document.getElementById(CONTAINER_ID)!, option);
}
