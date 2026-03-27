import { useCallback, useRef, useState } from 'react';
import { ListTable, CustomComponent } from '../../../src';
import { Button, Message, Popconfirm } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

/**
 * 该 demo 用于验证 “DOM 组件渲染到表格单元格/浮层” 的能力在 React18/React19 下是否一致可用。
 *
 * 说明：
 * - 早期 Arco 版本的 Trigger/Popover/Popconfirm 等组件会依赖 react-dom.findDOMNode，在 React19 下会报错并导致渲染失败。
 * - 通过升级 @arco-design/web-react（当前仓库统一到 2.66.12），可以验证 React19 下该类组件是否已完成适配。
 */
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
  const [confirmOpen, setConfirmOpen] = useState(false);
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
    setConfirmOpen(true);
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
          title="Click component!"
          okText="OK"
          cancelText="Cancel"
          popupVisible={confirmOpen}
          onOk={() => {
            Message.success('ok');
            setConfirmOpen(false);
            setClickCol(-1);
            setClickRow(-1);
          }}
          onCancel={() => {
            Message.info('cancel');
            setConfirmOpen(false);
            setClickCol(-1);
            setClickRow(-1);
          }}
        >
          <div style={{ width: '100%', height: '100%', padding: 6, boxSizing: 'border-box' }}>
            <Button type="primary" long onClick={() => setConfirmOpen(true)}>
              Click
            </Button>
          </div>
        </Popconfirm>
      </CustomComponent>
    </ListTable>
  );
}

export default App;
