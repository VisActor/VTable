/* eslint-disable max-len */
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import type { CustomLayoutFunctionArg } from '../../../../src';
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
} from '../../../../src';

const UserProfileComponent = (props: any) => {
  const { table, row, col, rect, dataValue, align } = props;
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
        alignItems: align,
        justifyContent: 'center',
        flexDirection: 'column',
        flexWrap: 'nowrap'
      }}
    >
      <Group
        attribute={{
          // boundsPadding: [0, 10],
          // stroke: 'red',
          // lineWidth: 1,
          // display: 'flex',
          // // background: style?.bgColor
          // background: 'pink'
          boundsPadding: [0, 10],
          stroke: '#16a34a',
          lineWidth: 1,
          display: 'flex',
          cornerRadius: 10,
          background: '#ccc'
        }}
      >
        <Text
          attribute={{
            text: dataValue,
            fontSize: 12,
            // fill: style?.textColor,
            fill: 'blue',
            boundsPadding: 3,
            cursor: 'pointer',
            backgroundCornerRadius: 8
          }}
        />
      </Group>
    </Group>
  );
};

function App() {
  const [col, setCol] = useState([
    { title: 'ID', field: 'bloggerId' },
    { title: 'Name', field: 'bloggerName' }
  ]);
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

  const columns = [];
  const handleChange = () => {
    setCol([
      { title: 'ID', field: 'bloggerId' },
      { title: 'Name', field: 'bloggerName' }
    ]);
  };
  return (
    <div>
      <button onClick={handleChange}>更新columns</button>
      <ListTable
        records={records}
        // theme={VTable.themes.ARCO}
        height={900}
        // defaultRowHeight={80}
        onReady={(table: any) => {
          // eslint-disable-next-line no-undef
          (window as any).tableInstance = table;
        }}
        // ReactDOM={ReactDom}
      >
        {col.map((item, i) => {
          return (
            <ListColumn key={i} field={'bloggerName'} title={'Name'} width={220}>
              <UserProfileComponent align="center" role={'custom-layout'} />
            </ListColumn>
          );
        })}
      </ListTable>
    </div>
  );
}

export default App;
