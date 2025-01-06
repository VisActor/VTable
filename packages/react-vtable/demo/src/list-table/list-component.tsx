import { useEffect, useRef, useState } from 'react';
import { ListTableSimple, ListColumn, Title } from '../../../src';
import * as VTable from '@visactor/vtable';
const data = new Array(10).fill(['张三', 18, '男', '🏀', 'ddd']);
function App() {
  const [title, setTitle] = useState('title');
  const [records, setRecords] = useState(data);
  const [update, setUpdate] = useState(false);
  const theme = useRef<VTable.Theme>(
    VTable.themes.DARK.extends({
      headerStyle: {
        bgColor: '#5071f9'
      }
    })
  );

  // useEffect(() => {
  //   debugger;
  //   const records = new Array(15).fill(['李四', 16, '男', 'icon']);
  //   setData(records);
  // }, [setData]);

  return (
    <>
      <ListTableSimple height={800} records={records} theme={theme.current} keepColumnWidthChange={true}>
        <Title text={title} />
        {update ? <ListColumn field={'4'} title={'ddd'} key={'column-4'} /> : null}
        <ListColumn field={'0'} title={'名称'} key={'column-0'} />
        <ListColumn field={'1'} title={'年龄'} key={'column-1'} />
        <ListColumn field={'2'} title={'性别'} key={'column-2'} />
        <ListColumn field={'3'} title={'爱好'} key={'column-3'} />
      </ListTableSimple>
      <button
        onClick={() => {
          // setTitle('title' + Math.floor(10 * Math.random()));
          const records = new Array(15).fill(['李四', 16, '男', 'icon']);
          setRecords(records);

          // setUpdate(!update);
        }}
      >
        点击
      </button>
    </>
  );
}

export default App;
