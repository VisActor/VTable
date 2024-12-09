import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import type { CustomLayoutFunctionArg } from '../../../src';
import {
  ListTable,
  ListColumn,
  CustomLayout,
  Group,
  Text,
  Tag,
  Checkbox,
  Radio,
  Button,
  Link,
  Avatar,
  Image,
  Popover
} from '../../../src';

type FieldData = { value: string; label: string };

const CustomLayoutButton = (props: CustomLayoutFunctionArg & { text: string }) => {
  const { table, row, col, rect, text } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const groupRef = useRef(null);
  const record = table.getCellOriginRecord(col, row);

  return (
    <Group
      attribute={{
        width,
        height,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-around'
      }}
      ref={groupRef}
    >
      <Button
        disabled={true}
        onClick={e => {
          // console.log('button click');
        }}
      >
        {'button-' + (record ? record[0] : 'undefined')}
      </Button>
      <Button
        onClick={e => {
          // console.log('button click');
        }}
      >
        {'button-' + row}
      </Button>
    </Group>
  );
};

const CustomLayoutLink = (props: CustomLayoutFunctionArg & { text: string }) => {
  const { table, row, col, rect, text } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const groupRef = useRef(null);

  return (
    <Group
      attribute={{
        width,
        height,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-around'
      }}
      ref={groupRef}
    >
      <Link href="#">{'link-' + text}</Link>
      <Link href="#" disabled>
        {'link-' + text}
      </Link>
      <Link icon href="#">
        {'link-' + text}
      </Link>
    </Group>
  );
};

const CustomLayoutAvatar = (props: CustomLayoutFunctionArg & { text: string }) => {
  const { table, row, col, rect, text } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const groupRef = useRef(null);

  const [popupVisible, setPopupVisible] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setPopupVisible(!popupVisible);
  //   }, 1000);
  // }, []);

  return (
    <Group
      attribute={{
        width,
        height,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-around'
      }}
      ref={groupRef}
    >
      <Popover
        content={
          <span>
            <p>Here is the text content</p>
          </span>
        }
        panelStyle={{
          backgroundColor: 'rgba(255, 0, 255, 1)'
        }}
        arrowStyle={{
          backgroundColor: 'rgba(255, 0, 255, 1)'
        }}
        // popupVisible={popupVisible}
      >
        <Avatar>{'A-' + text}</Avatar>
      </Popover>
      <Avatar shape={'square'}>{'A-' + text}</Avatar>
      <Avatar>
        <Image
          attribute={{
            image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg'
          }}
        />
      </Avatar>
    </Group>
  );
};

const CustomLayoutComponentMulti = (props: CustomLayoutFunctionArg & { text: string }) => {
  const { table, row, col, rect, text } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const groupRef = useRef(null);

  return (
    <Group
      attribute={{
        width,
        height,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-around'
      }}
      ref={groupRef}
    >
      {/* <Tag
        text={text}
        textStyle={{
          fontSize: 10,
          fontFamily: 'sans-serif',
          fill: 'rgb(51, 101, 238)'
          // textAlign: 'left',
          // textBaseline: 'rop',
        }}
        panel={{
          visible: true,
          fill: '#e6fffb',
          lineWidth: 1,
          cornerRadius: 4
        }}
      ></Tag> */}
      <Checkbox text={{ text }} />
      <Radio text={{ text }} />
    </Group>
  );
};

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
  const [records, setRecords] = useState<any[]>([]);
  // const records = );
  const [preStr, setPreStr] = useState('vt');
  const tableRef = useRef<any>(null);

  useEffect(() => {
    const records1 = [];
    for (let i = 0; i < 300; i++) {
      records1.push(['John' + i, i, 'male', '🏀']);
    }
    setRecords([...records1]);
    // eslint-disable-next-line no-undef
    // setTimeout(() => {
    //   // setPreStr(preStr + '1');
    //   // const records2 = records1.splice(298, 1);
    //   // // const records2 = [];
    //   // // for (let i = 0; i < 10; i++) {
    //   // //   records2.push(['John' + i, i, 'male', '🏀']);
    //   // // }
    //   // setRecords([...records1]);

    // }, 1000);
    // window.update = () => {
    //   console.log('tableRef', tableRef.current);
    //   setPreStr(preStr + '1');
    //   tableRef.current?.deleteRecords([298]);
    // };
  }, []);

  // eslint-disable-next-line no-undef
  window.tableRef = tableRef;

  return (
    <ListTable
      ref={tableRef}
      records={records}
      height={900}
      defaultRowHeight={200}
      defaultHeaderRowHeight={80}
      ReactDOM={ReactDOM}
      // bottomFrozenRowCount={1}
      rowSeriesNumber={{ cellType: 'checkbox' }}
      emptyTip={true}
    >
      <ListColumn field={'0'} title={'name'} />
      <ListColumn field={'1'} title={'age'} />
      <ListColumn field={'2'} title={'button'} width={120}>
        <CustomLayoutButton role={'custom-layout'} text={preStr} />
      </ListColumn>
      <ListColumn field={'2'} title={'link'} width={120}>
        <CustomLayoutLink role={'custom-layout'} text={preStr} />
      </ListColumn>
      <ListColumn field={'2'} title={'avatar'} width={120}>
        <CustomLayoutAvatar role={'custom-layout'} text={preStr} />
      </ListColumn>
      <ListColumn field={'2'} title={'gender'} width={120}>
        <CustomLayoutComponentMulti role={'custom-layout'} text={preStr} />
      </ListColumn>
      <ListColumn field={'3'} title={'hobby'}>
        <CustomLayoutComponent role={'custom-layout'} text={preStr} />
        <HeaderCustomLayoutComponent role={'header-custom-layout'} text={preStr} />
      </ListColumn>
    </ListTable>
  );
}

export default App;
