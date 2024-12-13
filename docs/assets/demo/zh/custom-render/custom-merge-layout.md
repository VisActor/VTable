---
category: examples
group: Custom
title: 单元格自定义合并
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-merge-custom.png
link: custom_define/custom_merge
option: ListTable-columns-text#customLayout
---

# 单元格自定义合并

在单元格自定义合并中，也可以通过`customRender`或`customLayout`来实现自定义合并单元格中的自定义渲染或自定义布局

## 代码演示

```javascript livedemo template=vtable
const VGroup = VTable.VGroup;
const VText = VTable.VText;
const VImage = VTable.VImage;
const VTag = VTable.VTag;

const option = {
  container: document.getElementById('container'),
  columns: [
    {
      field: 'bloggerId',
      title: 'bloggerId'
    },
    {
      field: 'bloggerName',
      title: 'bloggerName',
      width: 330
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
    },
    {},
    {}
  ],
  defaultRowHeight: 40,
  customMergeCell: (col, row, table) => {
    if (col >= 0 && col < table.colCount && row === table.rowCount - 2) {
      return {
        range: {
          start: {
            col: 0,
            row: table.rowCount - 2
          },
          end: {
            col: table.colCount - 1,
            row: table.rowCount - 2
          }
        },
        customLayout: args => {
          const { table, row, col, rect } = args;
          const { height, width } = rect || table.getCellRect(col, row);
          const container = (
            <VGroup
              attribute={{
                id: 'container',
                width,
                height,
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <VText
                attribute={{
                  id: 'text',
                  text: 'Created by ',
                  fontSize: 14,
                  fontFamily: 'sans-serif',
                  fill: 'black',
                  textAlign: 'left',
                  textBaseline: 'top',
                  boundsPadding: [0, 0, 0, 10]
                }}
              ></VText>
              <VTag
                attribute={{
                  text: 'VisActor',
                  textStyle: {
                    fontSize: 14,
                    fontFamily: 'sans-serif',
                    fill: 'rgb(51, 101, 238)'
                  },
                  panel: {
                    visible: true,
                    fill: '#e6fffb',
                    lineWidth: 1,
                    cornerRadius: 4
                  }
                }}
              ></VTag>
            </VGroup>
          );
          return {
            rootContainer: container,
            renderDefault: false
          };
        }
      };
    } else if (col >= 0 && col < table.colCount && row === table.rowCount - 1) {
      return {
        text: 'a',
        range: {
          start: {
            col: 0,
            row: table.rowCount - 1
          },
          end: {
            col: table.colCount - 1,
            row: table.rowCount - 1
          }
        },
        customRender: args => {
          const { width, height } = args.rect;
          const { dataValue, table, row } = args;
          const elements = [];
          elements.push({
            type: 'text',
            fill: '#000',
            fontSize: 12,
            fontWeight: 500,
            textBaseline: 'top',
            text: '© 2024 VisActor',
            x: width / 2 - 50,
            y: 14
          });
          return {
            elements
          };
        }
      };
    }
  }
};

const instance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = instance;
```
