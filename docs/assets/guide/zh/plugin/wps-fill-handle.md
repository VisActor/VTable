# wps 填充柄插件

## 功能介绍

实现了仿 wps 的填充柄功能，主要支持

- 单个单元格数字递增/递减
- 两个单元格数字等差递增/递减
- 纯文本单元格内容复制填充
- 文本数字混合，最后一位数字递增/递减
- 两个以上单元格按照单个单元格间隔填充（选中 3 个单元格往下拖，则第 4 个单元格依据第 1 个内容填充，第 5 个依据第 2 个...）

## 插件说明

该插件会向 table 实例绑定鼠标按下填充柄事件和拖拽填充柄结束事件。

## 使用示例

```javascript livedemo template=vtable
import * as VTable from '@visactor/vtable';
import { WpsFillHandlePlugin } from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
import { register } from '@visactor/vtable';
import { mockData } from './mockData';

const CONTAINER_ID = 'vTable';

const mockData = [
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
    Sales: -16.448,
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
    Sales: 11.784,
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
    Sales: 272.736,
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
    Sales: 3.54,
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
    Sales: 19.536,
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
    Sales: 19.44,
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
    Sales: 12.78,
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
    Sales: 2573.82,
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
    Sales: 609.98,
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
    Sales: 5.48,
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
    Sales: 391.98,
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
    Sales: 755.96,
    Quantity: '4',
    Discount: '0',
    Profit: '204.1092'
  }
];

const generatePersons = () => {
  return [...mockData];
};

const inputEditor = new InputEditor();
register.editor('input', inputEditor);

export function createTable() {
  const records = generatePersons();
  const columns: VTable.ColumnsDefine = [
    {
      field: 'Order ID',
      key: 'Order ID',
      title: 'Order ID',
      width: 'auto',
      sort: true
    },
    {
      field: 'Customer ID',
      key: 'Customer ID',
      title: 'Customer ID',
      width: 'auto'
    },
    {
      field: 'Product Name',
      key: 'Product Name',
      title: 'Product Name',
      width: 'auto'
    },
    {
      field: 'Category',
      key: 'Category',
      title: 'Category',
      width: 'auto'
    },
    {
      field: 'Sub-Category',
      key: 'Sub-Category',
      title: 'Sub-Category',
      width: 'auto'
    },
    {
      field: 'Region',
      key: 'Region',
      title: 'Region',
      width: 'auto'
    },
    {
      field: 'City',
      key: 'City',
      title: 'City',
      width: 'auto'
    },
    {
      field: 'Order Date',
      key: 'Order Date',
      title: 'Order Date',
      width: 'auto'
    },
    {
      field: 'Quantity',
      key: 'Quantity',
      title: 'Quantity',
      width: 'auto'
    },
    {
      field: 'Sales',
      key: 'Sales',
      title: 'Sales(Number)',
      width: 'auto'
    },
    {
      field: 'Profit',
      key: 'Profit',
      title: 'Profit',
      width: 'auto'
    }
  ];
  const copyHandle = new WpsFillHandlePlugin();
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    padding: 30,
    editor: 'input',
    plugins: [copyHandle],
    excelOptions: {
      fillHandle: true
    }
  };
  const tableInstance = new VTable.ListTable(option);

  window.tableInstance = tableInstance;

  // bindDebugTool(tableInstance.scenegraph.stage, {
  //   customGrapicKeys: ['col', 'row']
  // });
}
```
