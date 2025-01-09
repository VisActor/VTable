import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import type { CustomLayoutFunctionArg } from '../../../src';
import { ListTable, ListColumn, CustomLayout, Group, Text, Tag, Image } from '../../../src';
import {
  Avatar,
  Comment,
  Card,
  Popover,
  Space,
  Typography,
  Button,
  Popconfirm,
  Message,
  Notification
} from '@arco-design/web-react';
import { IconHeart, IconMessage, IconStar, IconStarFill, IconHeartFill } from '@arco-design/web-react/icon';
const { Meta } = Card;

import '@arco-design/web-react/dist/css/arco.css';

const CommentComponent = (props: CustomLayoutFunctionArg) => {
  const { table, row, col, rect, dataValue } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const record = table.getRecordByCell(col, row);

  return (
    <Group
      attribute={{
        width,
        height,
        react: {
          pointerEvents: true,
          penetrateEventList: ['wheel'],
          container: table.bodyDomContainer, // table.headerDomContainer
          // anchorType: 'bottom-right',
          element: <CommentReactComponent name={dataValue} />
        }
      }}
    ></Group>
  );
};

const CommentReactComponent = (props: { name: string }) => {
  const { name } = props;
  const [like, setLike] = useState();
  const [star, setStar] = useState();
  const actions = [
    <button className="custom-comment-action" key="heart" onClick={() => setLike(!like)}>
      {like ? <IconHeartFill style={{ color: '#f53f3f' }} /> : <IconHeart />}
      {83 + (like ? 1 : 0)}
    </button>,
    <button className="custom-comment-action" key="star" onClick={() => setStar(!star)}>
      {star ? <IconStarFill style={{ color: '#ffb400' }} /> : <IconStar />}
      {3 + (star ? 1 : 0)}
    </button>,
    <button className="custom-comment-action" key="reply">
      <IconMessage /> Reply
    </button>
  ];
  return (
    <Comment
      actions={actions}
      author={name}
      avatar={
        <Popover
          title={name}
          content={
            <span>
              <p>Here is the description of this user.</p>
            </span>
          }
        >
          <Avatar>{name.slice(0, 1)}</Avatar>
        </Popover>
      }
      content={<div>Comment body content.</div>}
      datetime="1 hour"
      style={{ marginTop: 10, marginLeft: 10 }}
    />
  );
};

const OperationComponent = (props: CustomLayoutFunctionArg) => {
  const { table, row, col, rect, dataValue } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const record = table.getRecordByCell(col, row);

  return (
    <Group
      attribute={{
        width,
        height,
        react: {
          pointerEvents: true,
          container: table.bodyDomContainer, // table.headerDomContainer
          // anchorType: 'bottom-right',
          element: <OperationReactComponent />
        }
      }}
    ></Group>
  );
};

const OperationReactComponent = () => {
  return (
    <Space size="small" style={{ marginLeft: 10, marginTop: 40 }}>
      <Button
        onClick={() =>
          Notification.info({
            title: 'Normal',
            content: 'This is an error Notification!'
          })
        }
        type="primary"
      >
        Info
      </Button>
      <Popconfirm
        focusLock
        title="Confirm"
        content="Are you sure you want to delete?"
        onOk={() => {
          Message.info({
            content: 'ok'
          });
        }}
        onCancel={() => {
          Message.error({
            content: 'cancel'
          });
        }}
      >
        <Button>Delete</Button>
      </Popconfirm>
    </Space>
  );
};

function generateRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const HeaderCustomLayoutComponent = props => {
  const { table, row, col, rect, dataValue } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const record = table.getRecordByCell(col, row);

  return (
    <Group
      attribute={{
        width,
        height,
        fill: 'red',
        react: {
          pointerEvents: true,
          container: table.headerDomContainer, // table.headerDomContainer
          // anchorType: 'bottom-right',
          element: <span>自定义</span>
        }
      }}
    ></Group>
  );
};

function App() {
  const records = [];
  for (let i = 0; i < 20; i++) {
    records.push({
      id: i,
      name: generateRandomString(8)
    });
  }

  return (
    <ListTable
      records={records}
      height={500}
      width={1200}
      defaultRowHeight={110}
      // allowFrozenColCount={4}
      // frozenColCount={2}
      // rightFrozenColCount={1}
      // bottomFrozenRowCount={1}
      onReady={table => {
        // eslint-disable-next-line no-undef
        (window as any).tableInstance = table;
      }}
      ReactDOM={ReactDOM}
    >
      <ListColumn field={'id'} title={'ID'} />
      <ListColumn field={'name'} title={'Comment'} width={500}>
        {/* <HeaderCustomLayoutComponent role={'header-custom-layout'} /> */}
        <CommentComponent role={'custom-layout'} />
      </ListColumn>
      <ListColumn field={'name'} title={'name'} width={200} />
      <ListColumn field={'name'} title={'name'} width={200} />
      <ListColumn field={'name'} title={'name'} width={200} />
      <ListColumn field={'name'} title={'name'} width={200} />
      <ListColumn field={''} title={'Operation'} width={300}>
        <OperationComponent role={'custom-layout'} />
      </ListColumn>
    </ListTable>
  );
}

export default App;
