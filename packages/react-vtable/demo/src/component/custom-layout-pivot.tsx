import { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import type { CustomLayoutFunctionArg } from '../../../src';
import {
  PivotColumnDimension,
  PivotRowDimension,
  PivotIndicator,
  PivotColumnHeaderTitle,
  PivotTable,
  PivotCorner,
  Tooltip,
  Group,
  Text,
  Image
} from '../../../src';
import pivotData from '../../data/pivot-data.json';
import { Avatar, Button, Card, Popover, Space, Typography } from '@arco-design/web-react';
import { IconThumbUp, IconShareInternal, IconMore } from '@arco-design/web-react/icon';
const { Meta } = Card;

import '@arco-design/web-react/dist/css/arco.css';

const HeaderCustomLayoutComponent = (props: CustomLayoutFunctionArg & { text: string }) => {
  const { table, row, col, rect, text, value } = props;
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
          text: `header-${value}-${text}`,
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
      {/* {hover && (
        // to do: component add/remove sync
        <Text
          attribute={{
            text: 'hover',
            fill: 'red',
            fontSize: 8
          }}
        />
      )} */}
    </Group>
  );
};

const UserProfileComponent = (props: CustomLayoutFunctionArg) => {
  const { table, row, col, rect, dataValue } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const record = table.getRecordByCell(col, row);

  const [hover, setHover] = useState(false);

  return (
    <Group
      attribute={{
        width,
        height,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        alignContent: 'center'
      }}
    >
      <Group
        attribute={{
          width: 190,
          height: 25,
          fill: '#e6fffb',
          lineWidth: 1,
          cornerRadius: 10,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          alignContent: 'center',
          cursor: 'pointer',
          boundsPadding: [0, 0, 0, 10],
          react: {
            pointerEvents: true,
            // container: table.bodyDomContainer, // table.headerDomContainer
            anchorType: 'bottom-left',
            element: <CardInfo record={record} hover={hover} row={row} />
          }
        }}
        onMouseEnter={(event: any) => {
          setHover(true);
          event.currentTarget.stage.renderNextFrame(); // to do: auto execute in react-vtable
        }}
        onMouseLeave={(event: any) => {
          setHover(false);
          event.currentTarget.stage.renderNextFrame();
        }}
      >
        <Text
          attribute={{
            text: 'dataValue',
            maxLineWidth: width,
            fontSize: 14,
            fontFamily: 'sans-serif',
            fill: 'rgb(51, 101, 238)',
            boundsPadding: [0, 0, 0, 10]
          }}
        />
      </Group>
    </Group>
  );
};

const CardInfo = (props: { record: any; hover: boolean; row?: number }) => {
  // const { bloggerName, bloggerAvatar, introduction, city } = props.record;
  const bloggerAvatar = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg';
  const introduction =
    'Hi everyone, I am Xiaohua, the virtual host. I am a little fairy who likes games, animation and food.';
  const city = 'Dream City';
  const bloggerName = 'Virtual Anchor Xiaohua';

  return props.hover ? (
    <Card
      className="card-with-icon-hover"
      style={{ width: 360 }}
      cover={
        <div style={{ height: '100px', overflow: 'hidden' }}>
          <img
            style={{ width: '100%', transform: 'translateY(-20px)' }}
            alt="dessert"
            // eslint-disable-next-line max-len
            src={bloggerAvatar}
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
            <Avatar size={24}>{city.slice(0, 1)}</Avatar>
            <Typography.Text>{city}</Typography.Text>
          </Space>
        }
        title={bloggerName}
        description={introduction}
      />
    </Card>
  ) : null;
};

const TestIndicatorTitle = (props: CustomLayoutFunctionArg) => {
  const { table, row, col, rect, text, value } = props;
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
        react: {
          pointerEvents: true,
          container: table.headerDomContainer, // table.headerDomContainer
          element: <div style={{ width, height, backgroundColor: 'rgba(255,0,0,0.2)' }}>testIndicatorTitle</div>
        }
      }}
      ref={groupRef}
    ></Group>
  );
};

const TestIndicatorBody = (props: CustomLayoutFunctionArg) => {
  const { table, row, col, rect, text, value } = props;
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
        react: {
          pointerEvents: true,
          container: table.bodyDomContainer, // table.headerDomContainer
          element: <div style={{ width, height, backgroundColor: 'rgba(255,255,0,0.2)' }}>testIndicatorBody</div>
        }
      }}
      ref={groupRef}
    ></Group>
  );
};

function App() {
  return (
    <PivotTable
      records={pivotData}
      indicatorTitle={'指标名称'}
      // indicatorsAsCol={false}
      // widthMode={'autoWidth'}
      defaultRowHeight={80}
      ReactDOM={ReactDOM}
      onReady={table => {
        // eslint-disable-next-line no-undef
        (window as any).tableInstance = table;
      }}
    >
      <PivotColumnDimension dimensionKey={'Category'} title={'Category'} />
      <PivotRowDimension dimensionKey={'City'} title={'City'} width={200}>
        <HeaderCustomLayoutComponent role={'header-custom-layout'} text="aaaaaaaaa" />
      </PivotRowDimension>
      <PivotIndicator indicatorKey={'Quantity'} title={'Quantity'} />
      <PivotIndicator indicatorKey={'Sales'} title={'Sales'} />
      <PivotIndicator indicatorKey={'Profit'} title={'Profit'}>
        {/* <UserProfileComponent role={'custom-layout'} renderDefault={false} /> */}
        <TestIndicatorTitle role={'header-custom-layout'} />
        <TestIndicatorBody role={'custom-layout'} />
      </PivotIndicator>
      <PivotCorner titleOnDimension={'row'} />
      {/* <Tooltip isShowOverflowTextTooltip={true} /> */}
    </PivotTable>
  );
}

export default App;
