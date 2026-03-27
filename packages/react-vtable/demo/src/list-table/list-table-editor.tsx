/* eslint-env browser */
import { ListTable } from '../../../src';
import * as VTable from '@visactor/vtable';
import { ArcoListEditor } from './ArcoListEditor';
function App() {
  const editor = new ArcoListEditor();
  VTable.register.editor('list-editor', editor as any);

  const option = {
    header: [
      {
        field: '0',
        caption: '名称'
      },
      {
        field: '1',
        caption: '年龄'
      },
      {
        field: '2',
        caption: '性别'
      },
      {
        field: '3',
        caption: '爱好'
      },
      {
        field: '4',
        caption: '城市',
        editor: 'list-editor',
        width: 150
      }
    ],
    records: new Array(1000).fill(null).map(() => ['张三', 18, '男', '🏀', 'Shanghai'])
  };
  return (
    <ListTable
      onReady={(...arg: any) => {
        (window as any).tableInstance = arg[0];
      }}
      option={option}
    />
  );
}

export default App;
