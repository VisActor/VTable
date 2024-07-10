/* eslint-disable max-len */
// @ts-nocheck
// 有问题可对照demo unitTestListTable
import { ListTable } from '../../src';
import * as VTable from '../../src/index';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable-custom-layout init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';

  VTable.register.icon('location', {
    type: 'svg',
    name: 'location',
    positionType: VTable.TYPES.IconPosition.left,
    svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/location.svg'
  });
  VTable.register.icon('favorite', {
    type: 'svg',
    name: 'favorite',
    positionType: VTable.TYPES.IconPosition.left,
    width: 20,
    height: 20,
    cursor: 'pointer',
    tooltip: {
      placement: VTable.TYPES.Placement.top,
      title: 'follow',
      style: {
        font: '10px Arial',
        bgColor: 'white',
        color: '#333',
        arrowMark: true
      }
    },
    svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/favorite.svg'
  });

  VTable.register.icon('message', {
    type: 'svg',
    name: 'message',
    positionType: VTable.TYPES.IconPosition.left,
    width: 20,
    height: 20,
    marginLeft: 10,
    cursor: 'pointer',
    tooltip: {
      placement: VTable.TYPES.Placement.top,
      title: 'send message',
      style: {
        font: '10px Arial',
        bgColor: 'white',
        color: '#333',
        arrowMark: true
      }
    },
    svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/message.svg'
  });

  const option = {
    columns: [
      {
        field: 'bloggerId',
        title: 'order number'
      },
      {
        field: 'bloggerName',
        title: 'anchor nickname',
        width: 330,
        style: {
          fontFamily: 'Arial',
          fontWeight: 500
        },
        customLayout: args => {
          const { table, row, col, rect } = args;
          const record = table.getRecordByCell(col, row);
          const { height, width } = rect ?? table.getCellRect(col, row);
          const percentCalc = VTable.CustomLayout.percentCalc;

          const container = new VTable.CustomLayout.Container({
            height,
            width
          });
          const containerLeft = new VTable.CustomLayout.Container({
            height: percentCalc(100),
            width: 60,
            showBounds: false,
            direction: 'column',
            alignItems: 'center',
            justifyContent: 'space-around'
          });
          container.add(containerLeft);

          const icon0 = new VTable.CustomLayout.Image({
            id: 'icon0',
            width: 50,
            height: 50,
            image: record.bloggerAvatar,
            shape: 'circle'
            // marginLeft: 10
          });
          containerLeft.add(icon0);

          const containerRight = new VTable.CustomLayout.Container({
            height: percentCalc(100),
            width: percentCalc(100 - 60),
            showBounds: false,
            direction: 'column'
            // justifyContent: 'center'
          });
          container.add(containerRight);

          const containerRightTop = new VTable.CustomLayout.Container({
            height: percentCalc(50),
            width: percentCalc(100),
            showBounds: false,
            alignItems: 'flex-end'
          });

          const containerRightBottom = new VTable.CustomLayout.Container({
            height: percentCalc(50),
            width: percentCalc(100),
            showBounds: false,
            alignContent: 'center'
          });

          containerRight.add(containerRightTop);
          containerRight.add(containerRightBottom);

          const bloggerName = new VTable.CustomLayout.Text({
            text: record.bloggerName,
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: 'black',
            marginLeft: 10
          });
          // bloggerName.getSize(table);
          containerRightTop.add(bloggerName);

          const location = new VTable.CustomLayout.Image({
            id: 'location',
            image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/location.svg',
            width: 15,
            height: 15,
            boundsPadding: [0, 0, 0, 10]
          });
          containerRightTop.add(location);

          const locationName = new VTable.CustomLayout.Text({
            text: record.city,
            fontSize: 11,
            fontFamily: 'sans-serif',
            fill: '#6f7070'
          });
          // bloggerName.getSize(table);
          containerRightTop.add(locationName);

          for (let i = 0; i < record?.tags?.length ?? 0; i++) {
            const tag = new VTable.CustomLayout.Tag({
              text: record.tags[i],
              textStyle: {
                fontSize: 10,
                fontFamily: 'sans-serif',
                fill: 'rgb(51, 101, 238)'
              },
              panel: {
                visible: true,
                fill: '#f4f4f2',
                cornerRadius: 5
              },
              space: 5,
              boundsPadding: [0, 0, 0, 5]
            });
            // tag.getSize(table);
            containerRightBottom.add(tag);
          }
          return {
            rootContainer: container,
            renderDefault: false
          };
        }
      },
      {
        field: 'fansCount',
        title: 'fansCount',
        fieldFormat(rec) {
          return rec.fansCount + 'w';
        },
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        field: 'worksCount',
        title: 'worksCount',
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        field: 'viewCount',
        title: 'viewCount',
        fieldFormat(rec) {
          return rec.fansCount + 'w';
        },
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        field: 'viewCount',
        title: 'viewCount',
        fieldFormat(rec) {
          return rec.fansCount + 'w';
        },
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        field: '',
        title: 'operation',
        width: 100,
        icon: ['favorite', 'message']
      }
    ],
    records: [
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
    ],
    defaultRowHeight: 80
  };

  const listTable = new ListTable(containerDom, option);
  test('listTable-custom-layout getCellOverflowText', () => {
    expect(listTable.scenegraph.getCell(1, 2).children[0].children.length).toBe(2);
    const rectBound = listTable.getCellRect(1, 2);
    expect(rectBound.left).toBe(80);
    expect(rectBound.right).toBe(410);
    expect(rectBound.top).toBe(160);
    expect(rectBound.bottom).toBe(240);
    listTable.release();
  });
});
