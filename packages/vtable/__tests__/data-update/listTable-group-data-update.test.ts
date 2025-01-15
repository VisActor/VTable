// @ts-nocheck
// 有问题可对照demo unitTestListTable
import { ListTable } from '../../src';
import type * as VTable from '../../src/index';
import { createDiv } from '../dom';
import data from '../data/North_American_Superstore_data.json';

const records = data.slice(0, 30);
global.__VERSION__ = 'none';
describe('listTable-group-update-date init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';

  const columns = [
    {
      field: 'Order ID',
      title: 'Order ID',
      width: 'auto',
      sort: true
    },
    {
      field: 'Customer ID',
      title: 'Customer ID',
      width: 'auto'
      // cellType: 'checkbox'
    },
    {
      field: 'Product Name',
      title: 'Product Name',
      width: 'auto'
    },
    {
      field: 'Category',
      title: 'Category',
      width: 'auto'
    },
    {
      field: 'Sub-Category',
      title: 'Sub-Category',
      width: 'auto'
    },
    {
      field: 'Region',
      title: 'Region',
      width: 'auto'
    },
    {
      field: 'City',
      title: 'City',
      width: 'auto'
    },
    {
      field: 'Order Date',
      title: 'Order Date',
      width: 'auto'
    },
    {
      field: 'Quantity',
      title: 'Quantity',
      width: 'auto'
    },
    {
      field: 'Sales',
      title: 'Sales',
      width: 'auto'
    },
    {
      field: 'Profit',
      title: 'Profit',
      width: 'auto'
    }
  ];

  const option: VTable.ListTableConstructorOptions = {
    records: JSON.parse(JSON.stringify(records)),
    columns,
    widthMode: 'standard',
    groupBy: ['Category', 'Sub-Category'],
    rowSeriesNumber: {
      dragOrder: true,
      title: '序号',
      width: 'auto',
      headerStyle: {
        color: 'black',
        bgColor: 'pink'
      },
      style: {
        color: 'red'
      }
    }
  };
  const listTable = new ListTable(containerDom, option);

  test('delete', () => {
    expect(listTable.getRecordIndexByCell(0, 5)).toEqual([0, 0, 2]);
    listTable.deleteRecords([[0, 0, 1]]);
    expect(listTable.getRecordIndexByCell(0, 5)).toEqual([0, 1]);
  });

  test('add', () => {
    listTable.addRecords(
      [
        {
          'Row ID': '5092',
          'Order ID': 'CA-2018-156720',
          'Order Date': '2018/12/30',
          'Ship Date': '2019/1/3',
          'Ship Mode': 'Standard Class',
          'Customer ID': 'JM-15580',
          'Customer Name': 'Jill Matthias',
          Segment: 'Consumer',
          Country: 'United States',
          City: 'Loveland',
          State: 'Colorado',
          'Postal Code': '80538',
          Region: 'West',
          'Product ID': 'OFF-FA-10003472',
          Category: 'Office Supplies',
          'Sub-Category': 'Labels',
          'Product Name': 'Bagged Rubber Bands',
          Sales: '3.024',
          Quantity: '3',
          Discount: '0.2',
          Profit: '-0.6048'
        }
      ],
      [0, 0, 1]
    );
    expect(listTable.getRecordByCell(0, 7)).toEqual({
      'Row ID': '5092',
      'Order ID': 'CA-2018-156720',
      'Order Date': '2018/12/30',
      'Ship Date': '2019/1/3',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'JM-15580',
      'Customer Name': 'Jill Matthias',
      Segment: 'Consumer',
      Country: 'United States',
      City: 'Loveland',
      State: 'Colorado',
      'Postal Code': '80538',
      Region: 'West',
      'Product ID': 'OFF-FA-10003472',
      Category: 'Office Supplies',
      'Sub-Category': 'Labels',
      'Product Name': 'Bagged Rubber Bands',
      Sales: '3.024',
      Quantity: '3',
      Discount: '0.2',
      Profit: '-0.6048'
    });
  });

  test('update', () => {
    listTable.updateRecords(
      [
        {
          'Row ID': '5092',
          'Order ID': 'CA-2018-156720',
          'Order Date': '2018/12/30',
          'Ship Date': '2019/1/3',
          'Ship Mode': 'Standard Class',
          'Customer ID': 'JM-15580',
          'Customer Name': 'Jill Matthias',
          Segment: 'Consumer',
          Country: 'United States',
          City: 'Loveland',
          State: 'Colorado',
          'Postal Code': '80538',
          Region: 'West',
          'Product ID': 'OFF-FA-10003472',
          Category: 'Office Supplies',
          'Sub-Category': 'Paper',
          'Product Name': 'Bagged Rubber Bands',
          Sales: '3.024',
          Quantity: '3',
          Discount: '0.2',
          Profit: '-0.6048'
        }
      ],
      [[0, 1, 1]]
    );
    expect(listTable.getRecordByCell(0, 4)).toEqual({
      'Row ID': '5092',
      'Order ID': 'CA-2018-156720',
      'Order Date': '2018/12/30',
      'Ship Date': '2019/1/3',
      'Ship Mode': 'Standard Class',
      'Customer ID': 'JM-15580',
      'Customer Name': 'Jill Matthias',
      Segment: 'Consumer',
      Country: 'United States',
      City: 'Loveland',
      State: 'Colorado',
      'Postal Code': '80538',
      Region: 'West',
      'Product ID': 'OFF-FA-10003472',
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      'Product Name': 'Bagged Rubber Bands',
      Sales: '3.024',
      Quantity: '3',
      Discount: '0.2',
      Profit: '-0.6048'
    });
    expect(listTable.getRecordByCell(0, 7)).toEqual({
      Category: 'Office Supplies',
      City: 'Naperville',
      Country: 'United States',
      'Customer ID': 'PO-19195',
      'Customer Name': 'Phillina Ober',
      Discount: '0.2',
      'Order Date': '2015/1/4',
      'Order ID': 'CA-2015-112326',
      'Postal Code': '60540',
      'Product ID': 'OFF-LA-10003223',
      'Product Name': 'Avery 508',
      Profit: '4.2717',
      Quantity: '3',
      Region: 'Central',
      'Row ID': '740',
      Sales: '11.784',
      Segment: 'Home Office',
      'Ship Date': '2015/1/8',
      'Ship Mode': 'Standard Class',
      State: 'Illinois',
      'Sub-Category': 'Labels'
    });
  });

  test('sort-delete', () => {
    option.records = JSON.parse(JSON.stringify(records));
    listTable.updateOption(option);
    listTable.updateSortState({ field: 'Order ID', order: 'desc' });

    expect(listTable.getCellOriginValue(1, 3)).toEqual('CA-2015-167199');
    listTable.deleteRecords([[0, 0, 0]]);
    expect(listTable.getCellOriginValue(1, 3)).toEqual('CA-2015-149020');
  });

  test('sort-add', () => {
    listTable.addRecords(
      [
        {
          'Row ID': '5092',
          'Order ID': 'CA-2018-156720',
          'Order Date': '2018/12/30',
          'Ship Date': '2019/1/3',
          'Ship Mode': 'Standard Class',
          'Customer ID': 'JM-15580',
          'Customer Name': 'Jill Matthias',
          Segment: 'Consumer',
          Country: 'United States',
          City: 'Loveland',
          State: 'Colorado',
          'Postal Code': '80538',
          Region: 'West',
          'Product ID': 'OFF-FA-10003472',
          Category: 'Office Supplies',
          'Sub-Category': 'Paper',
          'Product Name': 'Bagged Rubber Bands',
          Sales: '3.024',
          Quantity: '3',
          Discount: '0.2',
          Profit: '-0.6048'
        }
      ],
      [0, 0, 0]
    );
    expect(listTable.getCellOriginValue(1, 3)).toEqual('CA-2018-156720');
  });

  test('sort-add', () => {
    listTable.updateRecords(
      [
        {
          'Row ID': '5092',
          'Order ID': 'CA-2014-156720',
          'Order Date': '2018/12/30',
          'Ship Date': '2019/1/3',
          'Ship Mode': 'Standard Class',
          'Customer ID': 'JM-15580',
          'Customer Name': 'Jill Matthias',
          Segment: 'Consumer',
          Country: 'United States',
          City: 'Loveland',
          State: 'Colorado',
          'Postal Code': '80538',
          Region: 'West',
          'Product ID': 'OFF-FA-10003472',
          Category: 'Office Supplies',
          'Sub-Category': 'Paper',
          'Product Name': 'Bagged Rubber Bands',
          Sales: '3.024',
          Quantity: '3',
          Discount: '0.2',
          Profit: '-0.6048'
        }
      ],
      [[0, 0, 0]]
    );
    expect(listTable.getCellOriginValue(1, 3)).toEqual('CA-2015-167199');
    expect(listTable.getCellOriginValue(1, 5)).toEqual('CA-2014-156720');
  });

  test('changed-value-cache-update', () => {
    option.records = JSON.parse(JSON.stringify(records));
    listTable.updateOption(option);
    listTable.changeCellValue(2, 3, 'TT-00001');

    expect(listTable.getRawFieldData('Customer ID', 2, 3)).toEqual('DP-13000');
    expect(listTable.getCellOriginValue(2, 3)).toEqual('TT-00001');

    listTable.addRecords(
      [
        {
          'Row ID': '5092',
          'Order ID': 'CA-2014-156720',
          'Order Date': '2018/12/30',
          'Ship Date': '2019/1/3',
          'Ship Mode': 'Standard Class',
          'Customer ID': 'JM-15580',
          'Customer Name': 'Jill Matthias',
          Segment: 'Consumer',
          Country: 'United States',
          City: 'Loveland',
          State: 'Colorado',
          'Postal Code': '80538',
          Region: 'West',
          'Product ID': 'OFF-FA-10003472',
          Category: 'Office Supplies',
          'Sub-Category': 'Paper',
          'Product Name': 'Bagged Rubber Bands',
          Sales: '3.024',
          Quantity: '3',
          Discount: '0.2',
          Profit: '-0.6048'
        }
      ],
      [0, 0, 0]
    );

    expect(listTable.getRawFieldData('Customer ID', 2, 3)).toEqual('JM-15580');
    expect(listTable.getRawFieldData('Customer ID', 2, 4)).toEqual('DP-13000');
    expect(listTable.getCellOriginValue(2, 4)).toEqual('TT-00001');
  });
});
