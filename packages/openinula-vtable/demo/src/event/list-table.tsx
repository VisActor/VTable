/* eslint-disable no-undef */
import { ListTable } from '../../../src';
function App() {
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
      }
    ],
    records: new Array(1000).fill(['张三', 18, '男', '🏀'])
  };
  return (
    <ListTable
      option={option}
      onClickCell={(...arg: any) => {
        console.log('onClickCell', ...arg);
      }}
    />
  );
}

export default App;
