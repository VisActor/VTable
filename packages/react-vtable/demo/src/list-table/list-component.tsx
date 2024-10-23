import { useEffect, useState } from 'react';
import { ListTableSimple, ListColumn, Title } from '../../../src';
import * as VTable from '@visactor/vtable';
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
    <ListTableSimple
      records={records}
      theme={VTable.themes.DARK.extends({
        headerStyle: {
          bgColor: '#5071f9'
        }
      })}
    >
      <Title text={'title'} />
      <ListColumn field={'0'} title={'名称'} />
      <ListColumn field={'1'} title={'年龄'} />
      <ListColumn field={'2'} title={'性别'} />
      <ListColumn field={'3'} title={'爱好'} />
    </ListTableSimple>
  );
}

export default App;
