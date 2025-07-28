---
category: examples
group: component
title: cell custom dom component
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-vtable-cell-dom-component.jpeg
order: 1-1
link: '../../guide/custom_define/react-custom-component'
---

# cell custom dom component

Use ArcoDesign in cells. For details, please refer to [Custom Components](../../guide/custom_define/react-custom-component)

## code demo

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';

const { useCallback, useRef, useState } = React;
const { ListTable, ListColumn, Group } = ReactVTable;
const { 
  Avatar,
  Comment,
  Card,
  Popover,
  Space,
  Button,
  Popconfirm,
  Message,
  Notification
 } = ArcoDesign;
const { IconHeart, IconMessage, IconStar, IconStarFill, IconHeartFill } = ArcoDesignIcon;

const CommentComponent = (props) => {
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

const CommentReactComponent = (props) => {
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

const OperationComponent = (props) => {
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

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function App() {
  const records = [];
  for (let i = 0; i < 50; i++) {
    records.push({
      id: i,
      name: generateRandomString(8)
    });
  }

  return (
    <ListTable
      records={records}
      height={900}
      defaultRowHeight={110}
      onReady={table => {
        // eslint-disable-next-line no-undef
        // (window as any).tableInstance = table;
      }}
      ReactDOM={ReactDom}
    >
      <ListColumn field={'id'} title={'ID'} />
      <ListColumn field={'name'} title={'Comment'} width={300}>
        <CommentComponent role={'custom-layout'} />
      </ListColumn>
      <ListColumn field={''} title={'Operation'} width={160}>
        <OperationComponent role={'custom-layout'} />
      </ListColumn>
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
