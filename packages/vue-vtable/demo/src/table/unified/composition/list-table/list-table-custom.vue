<template>
  <vue-list-table :options="option"/>
</template>

<script setup >
import * as VTable from '../../../../../../../vtable/src/index';

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
        const record = table.getCellOriginRecord(col, row);
        const { height, width } = rect ?? table.getCellRect(col, row);
        const percentCalc = VTable.CustomLayout.percentCalc;

        const container = new VTable.CustomLayout.Group({
          height,
          width,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap'
        });
        const containerLeft = new VTable.CustomLayout.Group({
          height: percentCalc(100),
          width: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around'
        });
        container.add(containerLeft);

        const icon0 = new VTable.CustomLayout.Image({
          id: 'icon0',
          width: 50,
          height: 50,
          image: record.bloggerAvatar,
          cornerRadius: 25
        });
        containerLeft.add(icon0);

        const containerRight = new VTable.CustomLayout.Group({
          height: percentCalc(100),
          width: percentCalc(100, -60),
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap'
        });
        container.add(containerRight);

        const containerRightTop = new VTable.CustomLayout.Group({
          height: percentCalc(50),
          width: percentCalc(100),
          display: 'flex',
          alignItems: 'flex-end'
        });

        const containerRightBottom = new VTable.CustomLayout.Group({
          height: percentCalc(50),
          width: percentCalc(100),
          display: 'flex',
          alignItems: 'center'
        });

        containerRight.add(containerRightTop);
        containerRight.add(containerRightBottom);

        const bloggerName = new VTable.CustomLayout.Text({
          text: record.bloggerName,
          fontSize: 13,
          fontFamily: 'sans-serif',
          fill: 'black'
        });
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
      title: '选项',
      width: 200,
      customLayout: args => {
        const { table, row, col, rect } = args;
        const { height, width } = rect ?? table.getCellRect(col, row);

        const container = new VTable.CustomLayout.Group({
          height,
          width,
          display: 'flex',
          flexDirection: 'column',
          // alignItems: 'center',
          justifyContent: 'center'
        });

        const checkboxGroup = new VTable.CustomLayout.Group({
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'no-wrap',
          boundsPadding: [5, 0, 5, 10],
          justifyContent: 'center'
        });
        container.appendChild(checkboxGroup);

        const checkboxText = new VTable.CustomLayout.Text({
          text: 'operate: ',
          fontSize: 12,
          boundsPadding: [0, 10, 0, 0]
        });
        checkboxGroup.appendChild(checkboxText);

        const checkbox1 = new VTable.CustomLayout.CheckBox({
          text: {
            text: 'like',
            fontSize: 12
          },
          spaceBetweenTextAndIcon: 2,
          boundsPadding: [0, 10, 0, 0]
        });
        checkbox1.render();
        checkboxGroup.appendChild(checkbox1);
        checkbox1.addEventListener('checkbox_state_change', e => {
          console.log('checkbox_state_change', e);
        });

        const checkbox2 = new VTable.CustomLayout.CheckBox({
          text: {
            text: 'collect',
            fontSize: 12
          },
          spaceBetweenTextAndIcon: 2
          // boundsPadding: [10, 0, 0, 10]
        });
        checkbox2.render();
        checkboxGroup.appendChild(checkbox2);
        checkbox2.addEventListener('checkbox_state_change', e => {
          console.log('checkbox_state_change', e);
        });

        const radioGroup = new VTable.CustomLayout.Group({
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'no-wrap',
          boundsPadding: [5, 0, 5, 10]
        });
        container.appendChild(radioGroup);

        const radioText = new VTable.CustomLayout.Text({
          text: 'type: ',
          fontSize: 12,
          boundsPadding: [0, 10, 0, 0]
        });
        radioGroup.appendChild(radioText);

        const radio1 = new VTable.CustomLayout.Radio({
          text: {
            text: 'normal',
            fontSize: 12
          },
          checked: true,
          spaceBetweenTextAndIcon: 2,
          boundsPadding: [0, 10, 0, 0]
        });
        radio1.render();
        radioGroup.appendChild(radio1);
        radio1.addEventListener('radio_checked', () => {
          if (radio2.attribute.checked) {
            radio2.setAttribute('checked', false);
            table.scenegraph.updateNextFrame();
          }
        });

        const radio2 = new VTable.CustomLayout.Radio({
          text: {
            text: 'special',
            fontSize: 12
          },
          spaceBetweenTextAndIcon: 2
        });
        radio2.render();
        radioGroup.appendChild(radio2);
        radio2.addEventListener('radio_checked', () => {
          if (radio1.attribute.checked) {
            radio1.setAttribute('checked', false);
            table.scenegraph.updateNextFrame();
          }
        });

        return {
          rootContainer: container,
          renderDefault: false
        };
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

// console.log(option);
</script>