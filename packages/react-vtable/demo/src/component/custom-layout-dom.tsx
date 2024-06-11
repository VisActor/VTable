import { useEffect, useRef, useState } from 'react';
import type { CustomLayoutFunctionArg } from '../../../src';
import { ListTable, ListColumn, CustomLayout, Group, Text } from '../../../src';
import { Avatar, Button, Card, Popover, Space, Typography } from '@arco-design/web-react';
import { IconThumbUp, IconShareInternal, IconMore } from '@arco-design/web-react/icon';
const { Meta } = Card;

import '@arco-design/web-react/dist/css/arco.css';

function Tooltip(props: { value: string }) {
  return (
    <div style={{ width: '100%', height: '100%', border: '1px solid #333', backgroundColor: '#ccc', fontSize: 10 }}>
      {`${props.value}(click to show more)`}
    </div>
  );
}

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
        alignContent: 'center',
        // react: {
        //   element: <Tooltip value={text} />
        // }
        react: {
          pointerEvents: true,
          element: (
            <Popover
              title="Title"
              content={
                <span>
                  <p>Here is the text content</p>
                  <p>Here is the text content</p>
                </span>
              }
            >
              <Avatar
                style={{
                  backgroundColor: '#14a9f8',
                  left: 10,
                  top: 10
                }}
              >
                {text}
              </Avatar>
            </Popover>
          )
        }
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

const DomCustomLayoutComponent = (props: CustomLayoutFunctionArg & { text: string }) => {
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
        react: {
          pointerEvents: true,
          container: table.bodyDomContainer, // table.headerDomContainer
          // anchorType
          element: <CardInfo text={text} />
        }
      }}
      ref={groupRef}
    ></Group>
  );
};

const CardInfo = (props: { text: string }) => {
  return (
    <Card
      className="card-with-icon-hover"
      style={{ width: 360 }}
      cover={
        <div style={{ height: '100px', overflow: 'hidden' }}>
          <img
            style={{ width: '100%', transform: 'translateY(-20px)' }}
            alt="dessert"
            // eslint-disable-next-line max-len
            src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp"
          />
        </div>
      }
      actions={[
        <span className="icon-hover" key={0}>
          <IconThumbUp />
        </span>,
        <span className="icon-hover" key={1}>
          <IconShareInternal />
        </span>,
        <span className="icon-hover" key={2}>
          <IconMore />
        </span>
      ]}
    >
      <Meta
        avatar={
          <Space>
            <Popover
              title="Title"
              content={
                <span>
                  <p>Here is the text content</p>
                  <p>Here is the text content</p>
                </span>
              }
            >
              <Avatar size={24}>A</Avatar>
            </Popover>
            <Typography.Text>{props.text}</Typography.Text>
          </Space>
        }
        title="Card Title"
        description="This is the description"
      />
    </Card>
  );
};

function App() {
  const records = new Array(2000).fill(['John', 18, 'male', '🏀']);
  const [preStr, setPreStr] = useState('vt');

  useEffect(() => {
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      setPreStr(preStr + '1');
    }, 1000);
  }, []);

  return (
    <ListTable
      records={records}
      height={900}
      defaultHeaderRowHeight={80}
      defaultRowHeight={227}
      onReady={table => {
        // eslint-disable-next-line no-undef
        (window as any).tableInstance = table;
      }}
    >
      <ListColumn field={'0'} title={'name'} />
      <ListColumn field={'1'} title={'age'} />
      <ListColumn field={'2'} title={'gender'} />
      <ListColumn field={'3'} title={'hobby'} width={362}>
        {/* <CustomLayoutComponent role={'custom-layout'} text={preStr} /> */}
        <DomCustomLayoutComponent role={'custom-layout'} text={preStr} />
      </ListColumn>
    </ListTable>
  );
}

export default App;
