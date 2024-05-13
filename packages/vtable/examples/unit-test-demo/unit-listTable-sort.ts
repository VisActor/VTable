import * as VTable from '../../src';
import records from './marketsales.json';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';
export function createTable() {
  const containerDom: HTMLElement = document.getElementById(CONTAINER_ID) as HTMLElement;
  // containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';

  const columns = [
    {
      field: '订单 ID',
      caption: '订单 ID',
      sort: true,
      width: 'auto',
      description: '这是订单的描述信息',
      style: {
        fontFamily: 'Arial',
        fontSize: 14
      }
    },
    {
      field: '订单日期',
      caption: '订单日期'
    },
    {
      field: '发货日期',
      caption: '发货日期'
    },
    {
      field: '客户名称',
      caption: '客户名称',
      style: {
        padding: [10, 0, 10, 60]
      }
    },
    {
      field: '邮寄方式',
      caption: '邮寄方式'
    },
    {
      field: '省/自治区',
      caption: '省/自治区'
    },
    {
      field: '产品名称',
      caption: '产品名称'
    },
    {
      field: '类别',
      caption: '类别'
    },
    {
      field: '子类别',
      caption: '子类别'
    },
    {
      field: '销售额',
      caption: '销售额'
    },
    {
      field: '数量',
      caption: '数量'
    },
    {
      field: '折扣',
      caption: '折扣'
    },
    {
      field: '利润',
      caption: '利润'
    }
  ];
  const option = {
    columns,
    defaultColWidth: 150,
    allowFrozenColCount: 5,
    sortState: {
      field: '订单 ID',
      order: 'desc'
    }
  };

  option.container = containerDom;
  option.records = records;
  const tableInstance = new ListTable(option);

  window.tableInstance = tableInstance;

  setTimeout(() => {
    console.log(tableInstance.getCellValue(6, 3));
  }, 3000);
}
