import { useRef } from 'react';
import type * as VTable from '../../../../vtable/src/index';
import { ListTable, register } from '../../../src';
import type { IVTable } from '../../../src/tables/base-table';
import { useDragHandle } from './fillHandleUtils/useDragHandle';
import data from '../../data/list-data.json';
import { InputEditor } from '../../../../vtable-editors/src';

const input_editor = new InputEditor({});
register.editor('input', input_editor);

const columns = [
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
    title: 'Sales',
    width: 'auto'
  },
  {
    field: 'Profit',
    key: 'Profit',
    title: 'Profit',
    width: 'auto'
  }
];

function App() {
  const tableRef = useRef<IVTable>(null);
  const { handleStartDrag, handleEndDrag } = useDragHandle({ tableInstance: tableRef });
  const records = data.slice(0, 10);
  const options: VTable.ListTableConstructorOptions = {
    records: records,
    columns,
    widthMode: 'standard',
    excelOptions: {
      fillHandle: true
    }
  };
  return (
    <ListTable
      {...options}
      editor={'input'}
      onMousedownFillHandle={handleStartDrag}
      onDragFillHandleEnd={handleEndDrag}
      onReady={(table: IVTable) => {
        tableRef.current = table;
      }}
    />
  );
}

export default App;
