---
категория: примеры
группа: компонент
заголовок: cell пользовательский компонент + dom компонент
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/react-vтаблица-dom-компонент.gif
порядок: 1-1
ссылка: пользовательский_define/react-пользовательский-компонент
---

# cell пользовательский компонент + dom компонент

Use Arкодsign в the cell pop-up window. для details, please refer к [пользовательский компонентs](../../guide/пользовательский_define/react-пользовательский-компонент)

## код демонстрация

```javascript liveдемонстрация template=vтаблица-react
// import * as ReactVтаблица от '@visactor/react-vтаблица';

const { useCallback, useRef, useState } = React;
const { списоктаблица, списокColumn, Group, текст, Imвозраст } = ReactVтаблица;
const { Avatar, Card, Space, Typography } = Arкодsign;
const { иконкаThumbUp, иконкаShareInternal, иконкаMore } = Arкодsignиконка;
const { Meta } = Card;

const UserProfileкомпонент = props => {
  const { таблица, row, col, rect, данныеValue } = props;
  if (!таблица || row === undefined || col === undefined) {
    возврат null;
  }
  const { высота, ширина } = rect || таблица.getCellRect(col, row);
  const record = таблица.getRecordByCell(col, row);

  const [навести, setHover] = useState(false);

  возврат (
    <Group
      attribute={{
        ширина,
        высота,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'центр',
        alignContent: 'центр'
      }}
    >
      <Group
        attribute={{
          ширина: 190,
          высота: 25,
          fill: '#e6fffb',
          lineширина: 1,
          cornerRadius: 10,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'центр',
          alignContent: 'центр',
          cursor: 'pointer',
          boundsPadding: [0, 0, 0, 10],
          react: {
            pointerсобытиеs: true,
            container: таблица.bodyDomContainer, // таблица.headerDomContainer
            anchorType: 'низ-право',
            element: <CardInfo record={record} навести={навести} row={row} />
          }
        }}
        onMouseEnter={событие => {
          setHover(true);
          событие.currentTarget.stвозраст.renderNextFrame(); // к do: авто execute в react-vтаблица
        }}
        onMouseLeave={событие => {
          setHover(false);
          событие.currentTarget.stвозраст.renderNextFrame();
        }}
      >
        <Imвозраст
          attribute={{
            ширина: 20,
            высота: 20,
            imвозраст: record.bloggerAvatar,
            cornerRadius: 10,
            boundsPadding: [0, 0, 0, 10],
            cursor: 'pointer'
          }}
        />
        <текст
          attribute={{
            текст: данныеValue,
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
  const { bloggerимя, bloggerAvatar, introduction, Город } = props.record;
  возврат props.навести ? (
    <Card
      classимя="card-с-иконка-навести"
      style={{ ширина: 360 }}
      cover={
        <div style={{ высота: '100px', overflow: 'скрытый' }}>
          <img
            style={{ ширина: '100%', transform: 'translateY(-20px)' }}
            alt="dessert"
            // eslint-отключить-следующий-line max-len
            src={bloggerAvatar}
          />
        </div>
      }
      // actions={[
      //   <span classимя="иконка-навести" key={0}>
      //     <иконкаThumbUp />
      //   </span>,
      //   <span classимя="иконка-навести" key={1}>
      //     <иконкаShareInternal />
      //   </span>,
      //   <span classимя="иконка-навести" key={2}>
      //     <иконкаMore />
      //   </span>
      // ]}
    >
      <Meta
        avatar={
          <Space>
            <Avatar размер={24}>{Город.slice(0, 1)}</Avatar>
            <Typography.текст>{Город}</Typography.текст>
          </Space>
        }
        title={bloggerимя}
        description={introduction}
      />
    </Card>
  ) : (
    <></>
  );
};

функция App() {
  const records = [
    {
      bloggerId: 1,
      bloggerимя: 'Virtual Anchor Xiaohua',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg',
      introduction:
        'Hi everyone, I am Xiaohua, the virtual host. I am a little fairy who likes games, animation и food. I hope к share happy moments с you through live broadcast.',
      fansCount: 400,
      worksCount: 10,
      viewCount: 5,
      Город: 'Dream Город',
      tags: ['game', 'anime', 'food']
    },
    {
      bloggerId: 2,
      bloggerимя: 'Virtual anchor little wolf',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg',
      introduction:
        'Hello everyone, I am the virtual anchor Little Wolf. I like music, travel и photography, и I hope к explore the beauty из the world с you through live broadcast.',
      fansCount: 800,
      worksCount: 20,
      viewCount: 15,
      Город: 'Город из Music',
      tags: ['music', 'travel', 'photography']
    },
    {
      bloggerId: 3,
      bloggerимя: 'Virtual anchor bunny',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg',
      introduction:
        'Hello everyone, I am the virtual anchor Xiaotu. I like painting, handicrafts и beauty makeup. I hope к share creativity и fashion с you through live broadcast.',
      fansCount: 600,
      worksCount: 15,
      viewCount: 10,
      Город: 'Город из Art',
      tags: ['painting', 'handmade', 'beauty makeup']
    },
    {
      bloggerId: 4,
      bloggerимя: 'Virtual anchor kitten',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg',
      introduction:
        'Hello everyone, I am the virtual host Kitty. I am a lazy cat who likes dancing, fitness и coхорошоing. I hope к live a healthy и happy life с everyone through the live broadcast.',
      fansCount: 1000,
      worksCount: 30,
      viewCount: 20,
      Город: 'Health Город',
      tags: ['dance', 'fitness', 'coхорошоing']
    },
    {
      bloggerId: 5,
      bloggerимя: 'Virtual anchor Bear',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg',
      introduction:
        'Hello everyone, I am the virtual host Xiaoxiong. A little wise man who likes movies, reading и philosophy, I hope к explore the meaning из life с you through live broadcast.',
      fansCount: 1200,
      worksCount: 25,
      viewCount: 18,
      Город: 'Город из Wisdom',
      tags: ['Movie', 'Literature']
    },
    {
      bloggerId: 6,
      bloggerимя: 'Virtual anchor bird',
      bloggerAvatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bird.jpeg',
      introduction:
        'Hello everyone, I am the virtual anchor Xiaoniao. I like singing, acting и variety shows. I hope к be happy с everyone through the live broadcast.',
      fansCount: 900,
      worksCount: 12,
      viewCount: 8,
      Город: 'Happy Город',
      tags: ['music', 'Производительность', 'variety']
    }
  ];

  возврат (
    <списоктаблица
      records={records}
      высота={900}
      // defaultRowвысота={80}
      onReady={таблица => {
        // eslint-отключить-следующий-line no-undef
        // (window as любой).таблицаInstance = таблица;
      }}
      ReactDOM={ReactDom}
    >
      <списокColumn поле={'bloggerId'} title={'ID'} />
      <списокColumn поле={'bloggerимя'} title={'имя'} ширина={220}>
        <UserProfileкомпонент role={'пользовательский-макет'} />
      </списокColumn>
      <списокColumn поле={'fansCount'} title={'Fan'} />
      <списокColumn поле={'worksCount'} title={'Work'} />
      <списокColumn поле={'viewCount'} title={'View'} />
    </списоктаблица>
  );
}

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(<App />);

// Релиз react instance, do не copy
window.пользовательскийРелиз = () => {
  root.unmount();
};
```
