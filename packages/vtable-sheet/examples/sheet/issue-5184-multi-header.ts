import { VTableSheet } from '../../src/index';

const CONTAINER_ID = 'vTable';

const columns = [
  { title: '计划编码', field: 'planningCode', width: 120 },
  {
    title: '采购类别',
    field: 'type',
    width: 120,
    fieldFormat: (data: any) => {
      const typeMap: Record<string, string> = {
        'type1-1': '类型1-1',
        'type1-2': '类型1-2',
        'type1-2-1': '类型1-2-1',
        'type1-2-2': '类型1-2-2',
        type2: '类型2',
        type3: '类型3'
      };
      return typeMap[data.type] || data.type;
    }
  },
  { title: '责任人', field: 'personChargeName', width: 120 },
  { title: '采购名称', field: 'procurementName', width: 120 },
  {
    title: '采购进度',
    field: 'completeRate',
    width: 180,
    cellType: 'progressbar',
    style: {
      barColor: 'red',
      barHeight: 24,
      barBottom: 4,
      textAlign: 'right'
    },
    fieldFormat: (data: any) => (data.completeRate ? `${data.completeRate}%` : '')
  },
  { title: '对外价格（不含税）', field: 'totalExternalPrice', width: 200 },
  { title: '投标成本总价(不含税)', field: 'totalBidCost', width: 220 },
  { title: '指导价/限价(不含税)', field: 'priceLimit', width: 220 },
  {
    title: '采购需求计划完成时间',
    columns: [
      { title: '计划完成时间', field: 'demandPlanningTime', width: 150 },
      { title: '实际完成时间', field: 'demandActualTime', width: 150 }
    ]
  },
  {
    title: '采购谈判计划完成时间',
    columns: [
      { title: '计划完成时间', field: 'comparisonPlanningTime', width: 150 },
      { title: '实际完成时间', field: 'comparisonActualTime', width: 150 }
    ]
  },
  {
    title: '合同签订计划完成时间',
    columns: [
      { title: '计划完成时间', field: 'contractPlanningTime', width: 150 },
      { title: '实际完成时间', field: 'contractActualTime', width: 150 }
    ]
  },
  { title: '签订合同金额（不含税）', field: 'contractNoTaxAmount', width: 220 },
  { title: '签订合同金额（含税）', field: 'contractTaxAmount', width: 220 },
  {
    title: '成本偏差',
    columns: [
      { title: '对外(不含税)', field: 'actualTotalExternalPrice', width: 140 },
      { title: '投标(不含税)', field: 'actualTotalBidCost', width: 140 },
      { title: '指导价/限价(不含税)', field: 'actualPriceLimit', width: 200 }
    ]
  },
  {
    title: '盈亏率',
    field: 'lossRate',
    width: 120,
    fieldFormat: (data: any) => `${data.lossRate}%`
  },
  { title: '合同编号', field: 'contractNum', width: 120 },
  { title: '备注', field: 'description', width: 120 }
];

const data = Array.from({ length: 12 }, (_, index) => ({
  planningCode: `PC-${String(index + 1).padStart(3, '0')}`,
  type: index % 2 ? 'type2' : 'type1-1',
  personChargeName: index % 2 ? '李四' : '张三',
  procurementName: `采购项目${index + 1}`,
  completeRate: 20 + index * 6,
  totalExternalPrice: 100000 + index * 1000,
  totalBidCost: 86000 + index * 800,
  priceLimit: 120000 + index * 1200,
  demandPlanningTime: '2026-06-20',
  demandActualTime: '2026-06-21',
  comparisonPlanningTime: '2026-06-25',
  comparisonActualTime: '2026-06-26',
  contractPlanningTime: '2026-07-01',
  contractActualTime: '2026-07-02',
  contractNoTaxAmount: 98000 + index * 900,
  contractTaxAmount: 106000 + index * 950,
  actualTotalExternalPrice: 1200 + index * 10,
  actualTotalBidCost: 900 + index * 10,
  actualPriceLimit: 1500 + index * 10,
  lossRate: 8 + index,
  contractNum: `HT-${String(index + 1).padStart(3, '0')}`,
  description: `第 ${index + 1} 行`
}));

export function createTable() {
  const container = document.getElementById(CONTAINER_ID)!;

  window.sheetInstance = new VTableSheet(container, {
    showFormulaBar: false,
    showSheetTab: false,
    defaultRowHeight: 32,
    defaultColWidth: 120,
    sheets: [
      {
        sheetKey: 'multiHeaderSheet',
        sheetTitle: 'Issue 5184',
        columns,
        data: data as any,
        active: true
      }
    ]
  });
}
