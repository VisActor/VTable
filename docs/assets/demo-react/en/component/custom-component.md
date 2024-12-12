---
category: examples
group: component
title: Custom Component
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-component.png
order: 1-1
link: Developer_Ecology/react
---

# Custom Component

The `CustomComponent` component facilitates overlaying external components on React-VTable components.

## Code Example

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';

const { useCallback, useRef, useState } = React;
const { ListTable, CustomComponent } = ReactVTable;
const { Popconfirm, Message, Button } = ArcoDesign;

function Tooltip(props) {
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
        title: 'name'
      },
      {
        field: '1',
        title: 'age'
      },
      {
        field: '2',
        title: 'gender'
      },
      {
        field: '3',
        title: 'hobby'
      }
    ],
    records: new Array(1000).fill(['John', 18, 'male', '🏀'])
  };

  const updateHoverPos = useCallback(args => {
    if (visible.current) {
      return;
    }
    setHoverCol(args.col);
    setHoverRow(args.row);
    const cellValue = tableInstance.current.getCellValue(args.col, args.row);
    setValue(cellValue);
  }, []);
  const hide = useCallback(() => {
    setHoverCol(-1);
    setHoverRow(-1);
  }, []);

  const updateClickPos = useCallback(args => {
    setClickCol(args.col);
    setClickRow(args.row);
  }, []);

  const ready = (instance, isInitial) => {
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
          onVisibleChange={popVisible => {
            visible.current = popVisible;
          }}
        >
          <Button style={{ width: '100%', height: '100%' }}>Click</Button>
        </Popconfirm>
      </CustomComponent>
    </ListTable>
  );
}

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<App />);

// release react instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
