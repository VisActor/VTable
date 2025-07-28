---
category: examples
group: component
title: cell custom component
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-cell-layout-jsx.png
order: 1-1
link: custom_define/react-custom-component
---

# cell custom component

Like customLayout, you can use react components to customize layout. For details, please refer to [Custom Components](../../guide/custom_define/react-custom-component)

## code demo

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';

const VGroup = ReactVTable.Group;
const VText = ReactVTable.Text;
const VImage = ReactVTable.Image;
const VTag = ReactVTable.Tag;

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

const CustomLayoutComponent = props => {
  const { table, row, col, rect, text } = props;
  if (!table || row === undefined || col === undefined) {
    return null;
  }
  const { height, width } = rect || table.getCellRect(col, row);
  const record = table.getRecordByRowCol(col, row);

  const [hoverTitle, setHoverTitle] = React.useState(false);
  const [hoverIcon, setHoverIcon] = React.useState(false);
  const groupRef = React.useRef(null);

  return (
    <VGroup
      attribute={{
        id: 'container',
        width,
        height,
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignContent: 'center'
      }}
      ref={groupRef}
    >
      <VGroup
        attribute={{
          id: 'container-left',
          width: 60,
          height,
          fill: 'red',
          opacity: 0.1,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        <VImage
          attribute={{
            id: 'icon0',
            width: 50,
            height: 50,
            image: record.bloggerAvatar,
            cornerRadius: 25
          }}
        ></VImage>
      </VGroup>
      <VGroup
        id="container-right"
        attribute={{
          id: 'container-right',
          width: width - 60,
          height,
          fill: 'yellow',
          opacity: 0.1,
          display: 'flex',
          flexWrap: 'nowrap',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        <VGroup
          attribute={{
            id: 'container-right-top',
            fill: 'red',
            opacity: 0.1,
            width: width - 60,
            height: height / 2,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <VText
            attribute={{
              id: 'bloggerName',
              text: record.bloggerName,
              fontSize: 13,
              fontFamily: 'sans-serif',
              fill: hoverTitle ? 'red' : 'black',
              textAlign: 'left',
              textBaseline: 'top',
              boundsPadding: [0, 0, 0, 10]
            }}
            onMouseEnter={event => {
              setHoverTitle(true);
              event.currentTarget.stage.renderNextFrame();
            }}
            onMouseLeave={event => {
              setHoverTitle(false);
              event.currentTarget.stage.renderNextFrame();
            }}
          ></VText>
          <VImage
            attribute={{
              id: 'location-icon',
              width: 15,
              height: 15,
              image:
                '<svg t="1684484908497" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2429" width="200" height="200"><path d="M512 512a136.533333 136.533333 0 1 1 136.533333-136.533333 136.533333 136.533333 0 0 1-136.533333 136.533333z m0-219.272533a81.92 81.92 0 1 0 81.92 81.92 81.92 81.92 0 0 0-81.92-81.92z" fill="#0073FF" p-id="2430"></path><path d="M512 831.214933a27.306667 27.306667 0 0 1-19.2512-8.055466l-214.493867-214.357334a330.5472 330.5472 0 1 1 467.490134 0l-214.357334 214.357334a27.306667 27.306667 0 0 1-19.387733 8.055466z m0-732.091733a275.933867 275.933867 0 0 0-195.106133 471.04L512 765.269333l195.106133-195.106133A275.933867 275.933867 0 0 0 512 99.1232z" fill="#0073FF" p-id="2431"></path><path d="M514.321067 979.490133c-147.456 0-306.107733-37.000533-306.107734-118.3744 0-45.602133 51.746133-81.92 145.681067-102.4a27.306667 27.306667 0 1 1 11.605333 53.384534c-78.370133 17.066667-102.673067 41.915733-102.673066 49.015466 0 18.432 88.064 63.761067 251.4944 63.761067s251.4944-45.192533 251.4944-63.761067c0-7.3728-25.258667-32.768-106.496-49.834666a27.306667 27.306667 0 1 1 11.195733-53.384534c96.6656 20.343467 150.186667 56.9344 150.186667 103.2192-0.273067 80.964267-158.9248 118.3744-306.3808 118.3744z" fill="#0073FF" p-id="2432"></path></svg>',
              boundsPadding: [0, 0, 0, 10],
              cursor: 'pointer',
              background: hoverIcon
                ? {
                    fill: '#ccc',
                    cornerRadius: 5,
                    expandX: 1,
                    expandY: 1
                  }
                : undefined
            }}
            onMouseEnter={event => {
              setHoverIcon(true);
              event.currentTarget.stage.renderNextFrame();
            }}
            onMouseLeave={event => {
              setHoverIcon(false);
              event.currentTarget.stage.renderNextFrame();
            }}
          ></VImage>
          <VText
            attribute={{
              id: 'locationName',
              text: record.city,
              fontSize: 11,
              fontFamily: 'sans-serif',
              fill: '#6f7070',
              textAlign: 'left',
              textBaseline: 'top'
            }}
          ></VText>
        </VGroup>
        <VGroup
          attribute={{
            id: 'container-right-bottom',
            fill: 'green',
            opacity: 0.1,
            width: width - 60,
            height: height / 2,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          {record.tags.length
            ? record.tags.map((str, i) => (
                // <VText attribute={{
                //   text: str,
                //   fontSize: 10,
                //   fontFamily: 'sans-serif',
                //   fill: 'rgb(51, 101, 238)',
                //   textAlign: 'left',
                //   textBaseline: 'rop',
                // boundsPadding: [0, 0, 0, 10],
                // }}></VText>
                <VTag
                  key={i}
                  textStyle={{
                    fontSize: 10,
                    fontFamily: 'sans-serif',
                    fill: 'rgb(51, 101, 238)'
                    // textAlign: 'left',
                    // textBaseline: 'rop',
                  }}
                  panelStyle={{
                    visible: true,
                    fill: '#e6fffb',
                    lineWidth: 1,
                    cornerRadius: 4
                  }}
                  boundsPadding={[0, 0, 0, 10]}
                >
                  {str}
                </VTag>
              ))
            : null}
        </VGroup>
      </VGroup>
    </VGroup>
  );
};

const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
root.render(
  <ReactVTable.ListTable records={records} defaultRowHeight={80} height={'500px'}>
    <ReactVTable.ListColumn field={'bloggerId'} title={'bloggerId'} />
    <ReactVTable.ListColumn field={'bloggerName'} title={'bloggerName'} width={330} disableHover={true}>
      <CustomLayoutComponent role={'custom-layout'} />
    </ReactVTable.ListColumn>
    <ReactVTable.ListColumn field={'fansCount'} title={'fansCount'} />
    <ReactVTable.ListColumn field={'worksCount'} title={'worksCount'} />
    <ReactVTable.ListColumn field={'viewCount'} title={'viewCount'} />
  </ReactVTable.ListTable>
);

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
