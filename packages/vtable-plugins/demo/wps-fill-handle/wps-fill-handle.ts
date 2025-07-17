import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { WpsFillHandlePlugin } from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
import { register } from '@visactor/vtable';
import { mockData } from './mockData';

const CONTAINER_ID = 'vTable';
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
