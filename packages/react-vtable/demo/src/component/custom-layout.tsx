import { useEffect, useRef, useState } from 'react';
import type { CustomLayoutFunctionArg } from '../../../src';
import { ListTable, ListColumn, CustomLayout, Group, Text } from '../../../src';

type FieldData = { value: string; label: string };

const CustomLayoutComponent = (props: CustomLayoutFunctionArg & { text: string }) => {
  const { table, row, col, rect, text } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const [hover, setHover] = useState(false);
  // const row = 3;
  // const width = 100;
  // const height = 100;
  const fieldData = [
    {
      value: 'a',
      label: 'a'
    },
    {
      value: 'b',
      label: 'b'
    }
  ];

  const groupRef = useRef(null);

  // useEffect(() => {
  //   flash(col, row, this);
  // }, [hover]);

  return (
    <Group
      attribute={{
        width,
        height,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center'
      }}
      ref={groupRef}
    >
      {fieldData.map(item => {
        return (
          row !== 2 && (
            <Text
              key={item.value}
              attribute={{
                text: `${text}-${row}`,
                fill: hover ? 'red' : '#000'
              }}
              // stateProxy={(stateName: any) => {
              //   if (stateName === 'hover') {
              //     return {
              //       fill: 'red'
              //     };
              //   }
              // }}
              onMouseEnter={(event: any) => {
                // eslint-disable-next-line no-console, no-undef
                console.log('groupRef', groupRef.current);
                setHover(true);
                event.currentTarget.stage.renderNextFrame(); // to do: auto execute in react-vtable
              }}
              onMouseLeave={(event: any) => {
                setHover(false);
                event.currentTarget.stage.renderNextFrame();
              }}
            ></Text>
          )
        );
      })}
      {hover && (
        <Text
          attribute={{
            text: 'hover',
            fill: 'blue',
            fontSize: 8
          }}
        />
      )}
    </Group>
  );
};

const HeaderCustomLayoutComponent = (props: CustomLayoutFunctionArg & { text: string }) => {
  const { table, row, col, rect, text } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const [hover, setHover] = useState(false);

  const groupRef = useRef(null);

  return (
    <Group
      attribute={{
        width,
        height,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center'
      }}
      ref={groupRef}
    >
      <Text
        attribute={{
          text: `header-${text}`,
          fill: hover ? 'green' : '#000'
        }}
        onMouseEnter={(event: any) => {
          // eslint-disable-next-line no-console, no-undef
          console.log('groupRef-header', groupRef.current);
          setHover(true);
          event.currentTarget.stage.renderNextFrame();
        }}
        onMouseLeave={(event: any) => {
          setHover(false);
          event.currentTarget.stage.renderNextFrame();
        }}
      ></Text>
      {hover && (
        <Text
          attribute={{
            text: 'hover',
            fill: 'red',
            fontSize: 8
          }}
        />
      )}
    </Group>
  );
};

function App() {
  const records = new Array(1000).fill(['John', 18, 'male', '🏀']);
  const [preStr, setPreStr] = useState('vt');

  useEffect(() => {
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      setPreStr(preStr + '1');
    }, 1000);
  }, []);

  return (
    <ListTable records={records} height={500} defaultRowHeight={80}>
      <ListColumn field={'0'} title={'name'} />
      <ListColumn field={'1'} title={'age'} />
      <ListColumn field={'2'} title={'gender'} />
      <ListColumn field={'3'} title={'hobby'}>
        <CustomLayoutComponent role={'custom-layout'} text={preStr} />
        <HeaderCustomLayoutComponent role={'header-custom-layout'} text={preStr} />
      </ListColumn>
    </ListTable>
  );
}

export default App;
