---
category: examples
group: component
title: 单元格自定义组件+dom组件
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/react-vtable-dom-component.gif
order: 1-1
link: custom_define/react-custom-component
---

# 单元格自定义组件+dom 组件

在单元格弹窗使用 ArcoDesign，具体可以参考[自定义组件](../../guide/custom_define/react-custom-component)

## 代码演示

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';

const { useCallback, useRef, useState } = React;
const { ListTable, ListColumn, Group, Text, Image } = ReactVTable;
const { Avatar, Card, Space, Typography } = ArcoDesign;
const { IconThumbUp, IconShareInternal, IconMore } = ArcoDesignIcon;
const { Meta } = Card;

const UserProfileComponent = props => {
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
            container: table.bodyDomContainer, // table.headerDomContainer
            anchorType: 'bottom-right',
            element: <CardInfo record={record} hover={hover} row={row} />
          }
        }}
        onMouseEnter={event => {
          setHover(true);
          event.currentTarget.stage.renderNextFrame(); // to do: auto execute in react-vtable
        }}
        onMouseLeave={event => {
          setHover(false);
          event.currentTarget.stage.renderNextFrame();
        }}
      >
        <Image
          attribute={{
            width: 20,
            height: 20,
            image: record.bloggerAvatar,
            cornerRadius: 10,
            boundsPadding: [0, 0, 0, 10],
            cursor: 'pointer'
          }}
        />
        <Text
          attribute={{
            text: dataValue,
            fontSize: 14,
            fontFamily: 'sans-serif',
            fill: 'rgb(51, 101, 238)',
            boundsPadding: [0, 0, 0, 10],
            cursor: 'pointer'
          }}
        />
      </Group>
    </Group>
  );
};

const CardInfo = props => {
  const { bloggerName, bloggerAvatar, introduction, city } = props.record;
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
      // actions={[
      //   <span className="icon-hover" key={0}>
      //     <IconThumbUp />
      //   </span>,
      //   <span className="icon-hover" key={1}>
      //     <IconShareInternal />
      //   </span>,
      //   <span className="icon-hover" key={2}>
      //     <IconMore />
      //   </span>
      // ]}
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
  ) : (
    <></>
  );
};

function App() {
  const records = [
    {
      bloggerId: 1,
      bloggerName: 'Virtual Anchor Xiaohua',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg',
      introduction:
        'Hi everyone, I am Xiaohua, the virtual host. I am a little fairy who likes games, animation and food. I hope to share happy moments with you through live broadcast.',
      fansCount: 400,
      worksCount: 10,
      viewCount: 5,
      city: 'Dream City',
      tags: ['game', 'anime', 'food']
    },
    {
      bloggerId: 2,
      bloggerName: 'Virtual anchor little wolf',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg',
      introduction:
        'Hello everyone, I am the virtual anchor Little Wolf. I like music, travel and photography, and I hope to explore the beauty of the world with you through live broadcast.',
      fansCount: 800,
      worksCount: 20,
      viewCount: 15,
      city: 'City of Music',
      tags: ['music', 'travel', 'photography']
    },
    {
      bloggerId: 3,
      bloggerName: 'Virtual anchor bunny',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg',
      introduction:
        'Hello everyone, I am the virtual anchor Xiaotu. I like painting, handicrafts and beauty makeup. I hope to share creativity and fashion with you through live broadcast.',
      fansCount: 600,
      worksCount: 15,
      viewCount: 10,
      city: 'City of Art',
      tags: ['painting', 'handmade', 'beauty makeup']
    },
    {
      bloggerId: 4,
      bloggerName: 'Virtual anchor kitten',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg',
      introduction:
        'Hello everyone, I am the virtual host Kitty. I am a lazy cat who likes dancing, fitness and cooking. I hope to live a healthy and happy life with everyone through the live broadcast.',
      fansCount: 1000,
      worksCount: 30,
      viewCount: 20,
      city: 'Health City',
      tags: ['dance', 'fitness', 'cooking']
    },
    {
      bloggerId: 5,
      bloggerName: 'Virtual anchor Bear',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
      introduction:
        'Hello everyone, I am the virtual host Xiaoxiong. A little wise man who likes movies, reading and philosophy, I hope to explore the meaning of life with you through live broadcast.',
      fansCount: 1200,
      worksCount: 25,
      viewCount: 18,
      city: 'City of Wisdom',
      tags: ['Movie', 'Literature']
    },
    {
      bloggerId: 6,
      bloggerName: 'Virtual anchor bird',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bird.jpeg',
      introduction:
        'Hello everyone, I am the virtual anchor Xiaoniao. I like singing, acting and variety shows. I hope to be happy with everyone through the live broadcast.',
      fansCount: 900,
      worksCount: 12,
      viewCount: 8,
      city: 'Happy City',
      tags: ['music', 'performance', 'variety']
    }
  ];

  return (
    <ListTable
      records={records}
      height={900}
      // defaultRowHeight={80}
      onReady={table => {
        // eslint-disable-next-line no-undef
        // (window as any).tableInstance = table;
      }}
      ReactDOM={ReactDom}
    >
      <ListColumn field={'bloggerId'} title={'ID'} />
      <ListColumn field={'bloggerName'} title={'Name'} width={220}>
        <UserProfileComponent role={'custom-layout'} />
      </ListColumn>
      <ListColumn field={'fansCount'} title={'Fan'} />
      <ListColumn field={'worksCount'} title={'Work'} />
      <ListColumn field={'viewCount'} title={'View'} />
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
