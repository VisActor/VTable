// 改case测试的是合并单元格，自定义合并单元格
// widthMode heightMode 为 adaptive
// widthAdaptiveMode heightAdaptiveMode 为only-body

import * as VTable from '@visactor/vtable';
import { MasterDetailPlugin } from '../../src';
const CONTAINER_ID = 'vTable';

// 直接使用用户提供的前20条数据并初始化表格
export function createTable(): VTable.ListTable {
  // 静态数据（前20条示例）
  const data = [
    {
      'Row ID': '7981',
      'Order ID': 'CA-2015-103800',
      'Order Date': '2015/1/3',
      'Ship Date': '2015/1/7',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'DP-13000',
      'Customer Name': 'Darren Powers',
      Segment: 'Consumer',
      Country: 'United States',
      City: 'Houston',
      State: 'Texas',
      'Postal Code': '77095',
      Region: 'Central',
      'Product ID': 'OFF-PA-10000174',
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      'Product Name': 'Message Book, Wirebound, Four 5 1/2" X 4" Forms/Pg., 200 Dupl. Sets/Book',
      Sales: '16.448',
      Quantity: '2',
      Discount: '0.2',
      Profit: '5.5512'
    },
    {
      'Row ID': '740',
      'Order ID': 'CA-2015-112326',
      'Order Date': '2015/1/4',
      'Ship Date': '2015/1/8',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'PO-19195',
      'Customer Name': 'Phillina Ober',
      Segment: 'Home Office',
      Country: 'United States',
      City: 'Naperville',
      State: 'Illinois',
      'Postal Code': '60540',
      Region: 'Central',
      'Product ID': 'OFF-LA-10003223',
      Category: 'Office Supplies',
      'Sub-Category': 'Labels',
      'Product Name': 'Avery 508',
      Sales: '11.784',
      Quantity: '3',
      Discount: '0.2',
      Profit: '4.2717'
    },
    {
      'Row ID': '741',
      'Order ID': 'CA-2015-112326',
      'Order Date': '2015/1/4',
      'Ship Date': '2015/1/8',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'PO-19195',
      'Customer Name': 'Phillina Ober',
      Segment: 'Home Office',
      Country: 'United States',
      City: 'Naperville',
      State: 'Illinois',
      'Postal Code': '60540',
      Region: 'Central',
      'Product ID': 'OFF-ST-10002743',
      Category: 'Office Supplies',
      'Sub-Category': 'Storage',
      'Product Name': 'SAFCO Boltless Steel Shelving',
      Sales: '272.736',
      Quantity: '3',
      Discount: '0.2',
      Profit: '-64.7748'
    },
    {
      'Row ID': '742',
      'Order ID': 'CA-2015-112326',
      'Order Date': '2015/1/4',
      'Ship Date': '2015/1/8',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'PO-19195',
      'Customer Name': 'Phillina Ober',
      Segment: 'Home Office',
      Country: 'United States',
      City: 'Naperville',
      State: 'Illinois',
      'Postal Code': '60540',
      Region: 'Central',
      'Product ID': 'OFF-BI-10004094',
      Category: 'Office Supplies',
      'Sub-Category': 'Binders',
      'Product Name': 'GBC Standard Plastic Binding Systems Combs',
      Sales: '3.54',
      Quantity: '2',
      Discount: '0.8',
      Profit: '-5.487'
    },
    {
      'Row ID': '1760',
      'Order ID': 'CA-2015-141817',
      'Order Date': '2015/1/5',
      'Ship Date': '2015/1/12',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'MB-18085',
      'Customer Name': 'Mick Brown',
      Segment: 'Consumer',
      Country: 'United States',
      City: 'Philadelphia',
      State: 'Pennsylvania',
      'Postal Code': '19143',
      Region: 'East',
      'Product ID': 'OFF-AR-10003478',
      Category: 'Office Supplies',
      'Sub-Category': 'Art',
      'Product Name': 'Avery Hi-Liter EverBold Pen Style Fluorescent Highlighters, 4/Pack',
      Sales: '19.536',
      Quantity: '3',
      Discount: '0.2',
      Profit: '4.884'
    },
    {
      'Row ID': '5328',
      'Order ID': 'CA-2015-130813',
      'Order Date': '2015/1/6',
      'Ship Date': '2015/1/8',
      'Ship Mode': 'Second Class',
      'Customer ID': 'LS-17230',
      'Customer Name': 'Lycoris Saunders',
      Segment: 'Consumer',
      Country: 'United States',
      City: 'Los Angeles',
      State: 'California',
      'Postal Code': '90049',
      Region: 'West',
      'Product ID': 'OFF-PA-10002005',
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      'Product Name': 'Xerox 225',
      Sales: '19.44',
      Quantity: '3',
      Discount: '0',
      Profit: '9.3312'
    },
    {
      'Row ID': '7181',
      'Order ID': 'CA-2015-106054',
      'Order Date': '2015/1/6',
      'Ship Date': '2015/1/7',
      'Ship Mode': 'First Class',
      'Customer ID': 'JO-15145',
      'Customer Name': "Jack O'Briant",
      Segment: 'Corporate',
      Country: 'United States',
      City: 'Athens',
      State: 'Georgia',
      'Postal Code': '30605',
      Region: 'South',
      'Product ID': 'OFF-AR-10002399',
      Category: 'Office Supplies',
      'Sub-Category': 'Art',
      'Product Name': 'Dixon Prang Watercolor Pencils, 10-Color Set with Brush',
      Sales: '12.78',
      Quantity: '3',
      Discount: '0',
      Profit: '5.2398'
    },
    {
      'Row ID': '7475',
      'Order ID': 'CA-2015-167199',
      'Order Date': '2015/1/6',
      'Ship Date': '2015/1/10',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'ME-17320',
      'Customer Name': 'Maria Etezadi',
      Segment: 'Home Office',
      Country: 'United States',
      City: 'Henderson',
      State: 'Kentucky',
      'Postal Code': '42420',
      Region: 'South',
      'Product ID': 'FUR-CH-10004063',
      Category: 'Furniture',
      'Sub-Category': 'Chairs',
      'Product Name': "Global Deluxe High-Back Manager's Chair",
      Sales: '2573.82',
      Quantity: '9',
      Discount: '0',
      Profit: '746.4078'
    },
    {
      'Row ID': '7476',
      'Order ID': 'CA-2015-167199',
      'Order Date': '2015/1/6',
      'Ship Date': '2015/1/10',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'ME-17320',
      'Customer Name': 'Maria Etezadi',
      Segment: 'Home Office',
      Country: 'United States',
      City: 'Henderson',
      State: 'Kentucky',
      'Postal Code': '42420',
      Region: 'South',
      'Product ID': 'OFF-BI-10004632',
      Category: 'Office Supplies',
      'Sub-Category': 'Binders',
      'Product Name': 'Ibico Hi-Tech Manual Binding System',
      Sales: '609.98',
      Quantity: '2',
      Discount: '0',
      Profit: '274.491'
    },
    {
      'Row ID': '7477',
      'Order ID': 'CA-2015-167199',
      'Order Date': '2015/1/6',
      'Ship Date': '2015/1/10',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'ME-17320',
      'Customer Name': 'Maria Etezadi',
      Segment: 'Home Office',
      Country: 'United States',
      City: 'Henderson',
      State: 'Kentucky',
      'Postal Code': '42420',
      Region: 'South',
      'Product ID': 'OFF-AR-10001662',
      Category: 'Office Supplies',
      'Sub-Category': 'Art',
      'Product Name': 'Rogers Handheld Barrel Pencil Sharpener',
      Sales: '5.48',
      Quantity: '2',
      Discount: '0',
      Profit: '1.4796'
    },
    {
      'Row ID': '7478',
      'Order ID': 'CA-2015-167199',
      'Order Date': '2015/1/6',
      'Ship Date': '2015/1/10',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'ME-17320',
      'Customer Name': 'Maria Etezadi',
      Segment: 'Home Office',
      Country: 'United States',
      City: 'Henderson',
      State: 'Kentucky',
      'Postal Code': '42420',
      Region: 'South',
      'Product ID': 'TEC-PH-10004977',
      Category: 'Technology',
      'Sub-Category': 'Phones',
      'Product Name': 'GE 30524EE4',
      Sales: '391.98',
      Quantity: '2',
      Discount: '0',
      Profit: '113.6742'
    },
    {
      'Row ID': '7479',
      'Order ID': 'CA-2015-167199',
      'Order Date': '2015/1/6',
      'Ship Date': '2015/1/10',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'ME-17320',
      'Customer Name': 'Maria Etezadi',
      Segment: 'Home Office',
      Country: 'United States',
      City: 'Henderson',
      State: 'Kentucky',
      'Postal Code': '42420',
      Region: 'South',
      'Product ID': 'TEC-PH-10004539',
      Category: 'Technology',
      'Sub-Category': 'Phones',
      'Product Name': 'Wireless Extenders zBoost YX545 SOHO Signal Booster',
      Sales: '755.96',
      Quantity: '4',
      Discount: '0',
      Profit: '204.1092'
    },
    {
      'Row ID': '7480',
      'Order ID': 'CA-2015-167199',
      'Order Date': '2015/1/6',
      'Ship Date': '2015/1/10',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'ME-17320',
      'Customer Name': 'Maria Etezadi',
      Segment: 'Home Office',
      Country: 'United States',
      City: 'Henderson',
      State: 'Kentucky',
      'Postal Code': '42420',
      Region: 'South',
      'Product ID': 'OFF-FA-10001883',
      Category: 'Office Supplies',
      'Sub-Category': 'Fasteners',
      'Product Name': 'Alliance Super-Size Bands, Assorted Sizes',
      Sales: '31.12',
      Quantity: '4',
      Discount: '0',
      Profit: '0.3112'
    },
    {
      'Row ID': '7481',
      'Order ID': 'CA-2015-167199',
      'Order Date': '2015/1/6',
      'Ship Date': '2015/1/10',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'ME-17320',
      'Customer Name': 'Maria Etezadi',
      Segment: 'Home Office',
      Country: 'United States',
      City: 'Henderson',
      State: 'Kentucky',
      'Postal Code': '42420',
      Region: 'South',
      'Product ID': 'OFF-PA-10000955',
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      'Product Name': 'Southworth 25% Cotton Granite Paper & Envelopes',
      Sales: '6.54',
      Quantity: '1',
      Discount: '0',
      Profit: '3.0084'
    },
    {
      'Row ID': '7661',
      'Order ID': 'CA-2015-105417',
      'Order Date': '2015/1/7',
      'Ship Date': '2015/1/12',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'VS-21820',
      'Customer Name': 'Vivek Sundaresam',
      Segment: 'Consumer',
      Country: 'United States',
      City: 'Huntsville',
      State: 'Texas',
      'Postal Code': '77340',
      Region: 'Central',
      'Product ID': 'FUR-FU-10004864',
      Category: 'Furniture',
      'Sub-Category': 'Furnishings',
      'Product Name': 'Howard Miller 14-1/2" Diameter Chrome Round Wall Clock',
      Sales: '76.728',
      Quantity: '3',
      Discount: '0.6',
      Profit: '-53.7096'
    },
    {
      'Row ID': '7662',
      'Order ID': 'CA-2015-105417',
      'Order Date': '2015/1/7',
      'Ship Date': '2015/1/12',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'VS-21820',
      'Customer Name': 'Vivek Sundaresam',
      Segment: 'Consumer',
      Country: 'United States',
      City: 'Huntsville',
      State: 'Texas',
      'Postal Code': '77340',
      Region: 'Central',
      'Product ID': 'OFF-BI-10003708',
      Category: 'Office Supplies',
      'Sub-Category': 'Binders',
      'Product Name': 'Acco Four Pocket Poly Ring Binder with Label Holder, Smoke, 1"',
      Sales: '10.43',
      Quantity: '7',
      Discount: '0.8',
      Profit: '-18.2525'
    },
    {
      'Row ID': '593',
      'Order ID': 'CA-2015-135405',
      'Order Date': '2015/1/9',
      'Ship Date': '2015/1/13',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'MS-17830',
      'Customer Name': 'Melanie Seite',
      Segment: 'Consumer',
      Country: 'United States',
      City: 'Laredo',
      State: 'Texas',
      'Postal Code': '78041',
      Region: 'Central',
      'Product ID': 'OFF-AR-10004078',
      Category: 'Office Supplies',
      'Sub-Category': 'Art',
      'Product Name': 'Newell 312',
      Sales: '9.344',
      Quantity: '2',
      Discount: '0.2',
      Profit: '1.168'
    },
    {
      'Row ID': '594',
      'Order ID': 'CA-2015-135405',
      'Order Date': '2015/1/9',
      'Ship Date': '2015/1/13',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'MS-17830',
      'Customer Name': 'Melanie Seite',
      Segment: 'Consumer',
      Country: 'United States',
      City: 'Laredo',
      State: 'Texas',
      'Postal Code': '78041',
      Region: 'Central',
      'Product ID': 'TEC-AC-10001266',
      Category: 'Technology',
      'Sub-Category': 'Accessories',
      'Product Name': 'Memorex Micro Travel Drive 8 GB',
      Sales: '31.2',
      Quantity: '3',
      Discount: '0.2',
      Profit: '9.75'
    },
    {
      'Row ID': '866',
      'Order ID': 'CA-2015-149020',
      'Order Date': '2015/1/10',
      'Ship Date': '2015/1/15',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'AJ-10780',
      'Customer Name': 'Anthony Jacobs',
      Segment: 'Corporate',
      Country: 'United States',
      City: 'Springfield',
      State: 'Virginia',
      'Postal Code': '22153',
      Region: 'South',
      'Product ID': 'OFF-LA-10004272',
      Category: 'Office Supplies',
      'Sub-Category': 'Labels',
      'Product Name': 'Avery 482',
      Sales: '2.89',
      Quantity: '1',
      Discount: '0',
      Profit: '1.3583'
    },
    {
      'Row ID': '867',
      'Order ID': 'CA-2015-149020',
      'Order Date': '2015/1/10',
      'Ship Date': '2015/1/15',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'AJ-10780',
      'Customer Name': 'Anthony Jacobs',
      Segment: 'Corporate',
      Country: 'United States',
      City: 'Springfield',
      State: 'Virginia',
      'Postal Code': '22153',
      Region: 'South',
      'Product ID': 'FUR-FU-10000965',
      Category: 'Furniture',
      'Sub-Category': 'Furnishings',
      'Product Name': 'Howard Miller 11-1/2" Diameter Ridgewood Wall Clock',
      Sales: '51.94',
      Quantity: '1',
      Discount: '0',
      Profit: '21.2954'
    }
  ];

  const columns = [
    {
      field: 'Category',
      title: 'Category',
      width: 'auto',
      sort: true,

      style: { textStick: true, textAlign: 'right' }
    },
    { field: 'Sub-Category', title: 'Sub-Category', width: 'auto', sort: true, mergeCell: true },
    { field: 'Order ID', title: 'Order ID', width: 'auto' },
    { field: 'Customer ID', title: 'Customer ID', width: 'auto' },
    { field: 'Product Name', title: 'Product Name', width: 'auto', headerStyle: { textStick: true } },
    { field: 'Region', title: 'Region', width: 'auto' },
    { field: 'City', title: 'City', width: 'auto' },
    { field: 'Order Date', title: 'Order Date', width: 'auto' },
    { field: 'Quantity', title: 'Quantity', width: 'auto' },
    { field: 'Sales', title: 'Sales', width: 'auto' },
    { field: 'Profit', title: 'Profit', width: 'auto' }
  ];

  // 为每条记录生成子表数据
  function attachChildren(records: unknown[]) {
    if (!Array.isArray(records)) {
      return records;
    }
    return records.map((r: any, i: number) => ({
      ...r,
      children: [
        { task: `子任务 ${i + 1}-A`, status: 'open' },
        { task: `子任务 ${i + 1}-B`, status: 'done' }
      ]
    }));
  }

  const masterDetailPlugin = new MasterDetailPlugin({
    id: 'master-detail-static-2',
    detailGridOptions: {
      columns: [
        { field: 'task', title: '任务名', width: 220 },
        { field: 'status', title: '状态', width: 120 }
      ],
      defaultRowHeight: 30,
      defaultHeaderRowHeight: 30,
      style: { margin: 12, height: 160 },
      theme: VTable.themes.BRIGHT
    }
  });

  const option: any = {
    container: document.getElementById(CONTAINER_ID),
    records: attachChildren(data),
    columns,
    rowResizeMode: 'all',
    widthMode: 'adaptive',
    heightMode: 'adaptive',
    widthAdaptiveMode: 'only-body',
    heightAdaptiveMode: 'only-body',
    hover: { highlightMode: 'row' },
    sortState: { field: 'Category', order: 'asc' },
    plugins: [masterDetailPlugin],
    customMergeCell: (col, row, table) => {
      if (col >= 0 && col < table.colCount && row === table.rowCount - 2) {
        return {
          text: '总结栏：此数据为一份人员基本信息',
          range: {
            start: {
              col: 0,
              row: table.rowCount - 2
            },
            end: {
              col: table.colCount - 1,
              row: table.rowCount - 2
            }
          },
          style: {
            borderLineWidth: [6, 1, 1, 1],
            borderColor: ['gray']
          }
        };
      }
    }
  };

  const container = document.getElementById(CONTAINER_ID) as HTMLElement | null;
  if (!container) {
    throw new Error(`container with id ${CONTAINER_ID} not found`);
  }

  const tableInstance = new VTable.ListTable(container, option);
  // 暴露到 window 方便调试
  (window as any).tableInstance = tableInstance;
  setTimeout(() => {
    if (masterDetailPlugin.expandRow) {
      masterDetailPlugin.expandRow(1);
    }
  }, 100);
  return tableInstance;
}

// 自动在页面上初始化（如果容器存在）
if (document.getElementById(CONTAINER_ID)) {
  // 尝试创建表格，忽略运行时错误
  try {
    createTable();
  } catch (e) {
    // ignore
  }
}
