import { useCallback, useRef, useState } from 'react';
import { Popconfirm, Message, Button } from '@arco-design/web-react';
import { ListTable, CustomComponent } from '../../../src';
import '@arco-design/web-react/dist/css/arco.css';

function Tooltip(props: { value: string }) {
  return (
    <div style={{ width: '100%', height: '100%', border: '1px solid #333', backgroundColor: '#ccc', fontSize: 10 }}>
      {`${props.value}(click to show more)`}
    </div>
  );
}
function App() {
  const [hoverCol, setHoverCol] = useState(-1);
  const [hoverRow, setHoverRow] = useState(-1);
  const [clickCol, setClickCol] = useState(-1);
  const [clickRow, setClickRow] = useState(-1);
  const [value, setValue] = useState('');
  const visible = useRef(false);
  const tableInstance = useRef(null);

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

  const updateHoverPos = useCallback((args: any) => {
    if (visible.current) {
      return;
    }
    setHoverCol(args.col);
    setHoverRow(args.row);
    const cellValue = (tableInstance.current as any)?.getCellValue(args.col, args.row);
    setValue(cellValue);
  }, []);
  const hide = useCallback(() => {
    setHoverCol(-1);
    setHoverRow(-1);
  }, []);

  const updateClickPos = useCallback((args: any) => {
    setClickCol(args.col);
    setClickRow(args.row);
  }, []);

  const ready = (instance: any, isInitial: boolean) => {
    if (isInitial) {
      tableInstance.current = instance;
    }
  };

  return (
    <ListTable
      option={option}
      onMouseEnterCell={updateHoverPos}
      onMouseLeaveTable={hide}
      onClickCell={updateClickPos}
      onReady={ready}
    >
      <CustomComponent
        width="80%"
        height="100%"
        displayMode="cell"
        col={hoverCol}
        row={hoverRow}
        anchor="bottom-right"
        dx="-80%"
      >
        <Tooltip value={value} />
      </CustomComponent>
      <CustomComponent width="100%" height="100%" displayMode="cell" col={clickCol} row={clickRow} anchor="top-left">
        <Popconfirm
          focusLock
          title="Popconfirm"
          content="Click component!"
          onOk={() => {
            Message.info({
              content: 'ok'
            });
            setClickCol(-1);
            setClickRow(-1);
          }}
          onCancel={() => {
            Message.error({
              content: 'cancel'
            });
            setClickCol(-1);
            setClickRow(-1);
          }}
          onVisibleChange={(popVisible: boolean) => {
            visible.current = popVisible;
          }}
        >
          <Button style={{ width: '100%', height: '100%' }}>Click</Button>
        </Popconfirm>
      </CustomComponent>
    </ListTable>
  );
}

export default App;
