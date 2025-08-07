import { VTableSheet } from '../../src/index';

const CONTAINER_ID = 'vTable';

export function createTable() {
  const sheetInstance = new VTableSheet(document.getElementById(CONTAINER_ID)!, {
    showFormulaBar: true,
    showSheetTab: true,
    defaultRowHeight: 25,
    defaultColWidth: 120,
    sheets: [
      {
        sheetKey: 'filter-demo',
        sheetTitle: '筛选测试',
        filter: true,
        columns: [
          { title: '姓名', sort: true, width: 100, filter: false },
          { title: '年龄', sort: true, width: 80, filter: false },
          { title: '部门', sort: true, width: 100 },
          { title: '薪资', sort: true, width: 100 },
          { title: '入职日期', sort: true, width: 120 },
          { title: '状态', sort: true, width: 80 }
        ],
        data: [
          ['张三', 25, '技术部', 8000, '2023-01-15', '在职'],
          ['李四', 30, '产品部', 12000, '2022-06-20', '在职'],
          ['王五', 28, '技术部', 9500, '2023-03-10', '在职'],
          ['赵六', 35, '市场部', 15000, '2021-09-05', '离职'],
          ['孙七', 26, '技术部', 7500, '2023-05-12', '在职'],
          ['周八', 32, '产品部', 13000, '2022-02-28', '在职'],
          ['吴九', 29, '市场部', 11000, '2022-11-18', '在职'],
          ['郑十', 27, '技术部', 8500, '2023-04-22', '离职'],
          ['钱一', 33, '产品部', 14000, '2021-12-08', '在职'],
          ['孙二', 24, '市场部', 6500, '2023-07-01', '在职'],
          ['李三', 31, '技术部', 10000, '2022-08-15', '在职'],
          ['王四', 36, '市场部', 16000, '2020-05-20', '在职'],
          ['张五', 25, '产品部', 7800, '2023-02-14', '离职'],
          ['赵六', 28, '技术部', 9200, '2022-10-30', '在职'],
          ['孙七', 30, '市场部', 12500, '2021-11-12', '在职']
        ],
        active: true,
        showHeader: true
      },
      {
        sheetKey: 'number-test',
        sheetTitle: '数值筛选',
        filter: true,
        columns: [
          { title: '产品名称', sort: true, width: 120 },
          { title: '价格', sort: true, width: 80 },
          { title: '库存', sort: true, width: 80 },
          { title: '评分', sort: true, width: 80 }
        ],
        data: [
          ['iPhone 15', 5999, 50, 4.8],
          ['Samsung S24', 4999, 30, 4.6],
          ['小米14', 3999, 80, 4.5],
          ['华为P60', 4599, 25, 4.7],
          ['OPPO Find X7', 3799, 60, 4.4],
          ['vivo X100', 3599, 70, 4.3],
          ['OnePlus 12', 4299, 40, 4.5],
          ['Realme GT5', 2999, 90, 4.2]
        ],
        showHeader: true
      },
      {
        sheetKey: 'text-test',
        sheetTitle: '文本筛选',
        filter: false,
        columns: [
          { title: '城市', sort: true, width: 100 },
          { title: '区域', sort: true, width: 100 },
          { title: '邮编', sort: true, width: 100 }
        ],
        data: [
          ['北京', '朝阳区', '100000'],
          ['上海', '浦东新区', '200000'],
          ['广州', '天河区', '510000'],
          ['深圳', '南山区', '518000'],
          ['杭州', '西湖区', '310000'],
          ['成都', '锦江区', '610000']
        ],
        showHeader: true
      }
    ]
  });

  window.sheetInstance = sheetInstance;

  return sheetInstance;
}
