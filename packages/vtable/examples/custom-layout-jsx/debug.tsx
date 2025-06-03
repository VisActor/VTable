import { PivotTable } from '../../src';
import { PivotTableConstructorOptions } from '../../src';

import { InputEditor } from "../../../vtable-editors/src";
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
export function createTable() {
  const inputEditor = new InputEditor();

  const option : PivotTableConstructorOptions= {
    rows: ["region", "province"],
    columns: ["year", "quarter"],
    container: document.getElementById(CONTAINER_ID),
    // 指标
    // indicators: ["sales", "profit"],
    indicators: [
      {
        indicatorKey: "sales",
        title: "销售额",
        editor: inputEditor,
      },
    ],
    // 指标是否作为列头
    indicatorsAsCol: false,
    corner: {
      titleOnDimension: "none",
    },

    dataConfig: {
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          grandTotalLabel: "行总计",
          subTotalLabel: "小计",
          // showGrandTotalsOnTop: true, //汇总值显示在上
        },
        column: {
          showGrandTotals: true,
          showSubTotals: true,
          grandTotalLabel: "列总计",
          subTotalLabel: "小计",
        },
      },
      updateAggregationOnEditCell: true,
    },

    records: [
      {
        region: "中南",
        province: "广东",
        year: "2016",
        quarter: "2016-Q1",
        sales: 1243,
        profit: 546,
      },
      {
        region: "中南",
        province: "广东",
        year: "2016",
        quarter: "2016-Q2",
        sales: 2243,
        profit: 169,
      },
      {
        region: "中南",
        province: "广西",
        year: "2016",
        quarter: "2016-Q1",
        sales: 3043,
        profit: 1546,
      },
      {
        region: "中南",
        province: "广西",
        year: "2016",
        quarter: "2016-Q2",
        sales: 1463,
        profit: 609,
      },
      {
        region: "华东",
        province: "上海",
        year: "2016",
        quarter: "2016-Q1",
        sales: 4003,
        profit: 1045,
      },
      {
        region: "华东",
        province: "上海",
        year: "2016",
        quarter: "2016-Q2",
        sales: 5243,
        profit: 3169,
      },
      {
        region: "华东",
        province: "山东",
        year: "2016",
        quarter: "2016-Q1",
        sales: 4543,
        profit: 3456,
      },
      {
        region: "华东",
        province: "山东",
        year: "2016",
        quarter: "2016-Q2",
        sales: 6563,
        profit: 3409,
      },
      {
        region: "华东",
        province: "山东",
        year: "2016",
        quarter: "2016-Q3",
        sales: 6563,
        profit: 3409,
      },
      {
        region: "华东",
        province: "北京",
        year: "2017",
        quarter: "2017-Q1",
        sales: 6563,
        profit: 3409,
      },
    ],

  };

  const instance = new PivotTable(option);
  window.tableInstance = instance;
  // }, []);

};

// export default Demo1; // 修改导出
