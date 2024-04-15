/* eslint-env browser */
import { ListTable, VTable } from '../../../src';
import { ArcoListEditor } from './ArcoListEditor';
function App() {
  const editor = new ArcoListEditor();
  VTable.register.editor('list-editor', editor);

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
    records: new Array(1000).fill().map(() => ['张三', 18, '男', '🏀', 'Shanghai'])
  };
  return (
    <ListTable
      onReady={(...arg: any) => {
        window.tableInstance = arg[0];
      }}
      option={option}
    />
  );
}

export default App;
