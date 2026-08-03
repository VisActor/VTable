import { ListTable } from '../../../src';

declare const globalThis: any;

const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 120
  },
  {
    field: 'name',
    title: 'Name',
    width: 200
  },
  {
    field: 'age',
    title: 'Age',
    width: 120
  }
];

const records = [
  { id: 1, name: 'Alice', age: 28 },
  { id: 2, name: 'Bob', age: 31 },
  { id: 3, name: 'Carol', age: 24 }
];

export default function Issue5203ViteReact19() {
  return (
    <ListTable
      records={records}
      columns={columns}
      width={'100%'}
      height={'100%'}
      onReady={table => {
        (globalThis as any).tableInstance = table;
        (globalThis as any).__issue5203Ready = true;
      }}
      onError={error => {
        (globalThis as any).__issue5203Error = error;
      }}
    />
  );
}
