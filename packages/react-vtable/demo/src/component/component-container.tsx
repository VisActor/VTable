import { useMemo, useState } from 'react';
import { ListTable, CustomComponent } from '../../../src';

function AAA(props: any) {
  return <div style={{ width: '100%', height: '100%', border: '1px solid red', backgroundColor: 'green' }}>123</div>;
}
function App() {
  const [col, setCol] = useState(-1);
  const [row, setRow] = useState(-1);

  const option = {
    columns: [
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

  const updatePos = useMemo(() => {
    return (args: any) => {
      setCol(args.col);
      setRow(args.row);
    };
  }, []);
  const hide = useMemo(() => {
    return () => {
      setCol(-1);
      setRow(-1);
    };
  }, []);
  return (
    <ListTable option={option} onMouseEnterCell={updatePos} onMouseLeaveTable={hide}>
      <CustomComponent width="50%" height="100%" displayMode="cell" col={col} row={row} anchor="bottom-right" dx="-50%">
        <AAA />
      </CustomComponent>
    </ListTable>
  );
}

export default App;
