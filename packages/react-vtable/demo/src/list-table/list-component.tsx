import { useEffect, useState } from 'react';
import { ListTable, ListColumn } from '../../../src';
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
    ]
  };
  const records = new Array(10).fill(['张三', 18, '男', '🏀']);
  // const [data, setData] = useState(records);

  // useEffect(() => {
  //   debugger;
  //   const records = new Array(15).fill(['李四', 16, '男', 'icon']);
  //   setData(records);
  // }, [setData]);

  return (
    <ListTable records={records}>
      <ListColumn field={'0'} caption={'名称'} />
      <ListColumn field={'1'} caption={'年龄'} />
      <ListColumn field={'2'} caption={'性别'} />
      <ListColumn field={'3'} caption={'爱好'} />
    </ListTable>
  );
}

export default App;
