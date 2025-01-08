---
category: examples
group: Cell Type
title: 自定义函数指定单元格类型
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/cellType-function.png
order: 2-1
link: cell_type/cellType
option: ListTable-columns-function#cellType
---

# 单元格内容类型

通过 cellType 的函数形式指定单元格内容类型。图片来源：https://birdsoftheworld.org/bow/home

## 关键配置

cellType: (arg: CellInfo) => ColumnTypeOption;

## 代码演示

```javascript livedemo template=vtable
const records = [
  {
    name: 'pigeon',
    introduction: 'The pigeon is a common urban bird with gray plumage and a short, stout beak',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/pigeon.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/pigeon.mp4',
    YoY: 50,
    QoQ: 10,
    trend: [
      { x: 1, y: 1500 },
      { x: 2, y: 1480 },
      { x: 3, y: 1520 },
      { x: 4, y: 1550 },
      { x: 5, y: 1600 }
    ]
    // "trend":[1500,1480,1520,1550,1600],
  },
  {
    name: 'Swallow',
    introduction: 'Swallow is a kind of bird that is good at flying, usually perches near houses and buildings.',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/swallow.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/swallow.mp4',
    YoY: 10,
    QoQ: -10,
    trend: [
      { x: 1, y: 800 },
      { x: 2, y: 780 },
      { x: 3, y: 700 },
      { x: 4, y: 800 },
      { x: 5, y: 900 }
    ]
  },
  {
    name: 'Magpie',
    introduction:
      'The magpie is a common small bird mainly found in Asia. They are small in size with a black head and throat, gray back and white belly. Magpies are social animals and often live in woods Breeding nests in China or in urban parks, feeding on insects, fruit and seeds. They are also highly intelligent and social, and are considered an intelligent, playful bird.',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/Magpie.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/Magpie.mp4',
    YoY: -10,
    QoQ: -10,
    trend: [
      { x: 1, y: 500 },
      { x: 2, y: 680 },
      { x: 3, y: 400 },
      { x: 4, y: 600 },
      { x: 5, y: 800 }
    ]
  },
  {
    name: 'Peacock',
    introduction:
      'The peacock is a large, beautiful bird with brilliant blue-green plumage and a long tail. Native to South Asia, it feeds on insects, fruit, and seeds.',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/peacock.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/peacock.mp4',
    YoY: -10,
    QoQ: -10,
    trend: [
      { x: 1, y: 500 },
      { x: 2, y: 680 },
      { x: 3, y: 400 },
      { x: 4, y: 600 },
      { x: 5, y: 800 }
    ]
  },
  {
    name: 'Peacock',
    introduction:
      'The flamingo is a beautiful pink bird with long legs and neck, good at swimming, and is a common bird in tropical areas.',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/flamingo.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/flamingo.mp4',
    YoY: -1,
    QoQ: -6,
    trend: [
      { x: 1, y: 980 },
      { x: 2, y: 880 },
      { x: 3, y: 900 },
      { x: 4, y: 1600 },
      { x: 5, y: 1800 }
    ]
  },
  {
    name: 'ostrich',
    introduction:
      'The ostrich is a large bird that cannot fly and runs fast. It is one of the largest birds in the world',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/ostrich.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/ostrich.mp4',
    YoY: -3,
    QoQ: 10,
    trend: [
      { x: 1, y: 560 },
      { x: 2, y: 680 },
      { x: 3, y: 5500 },
      { x: 4, y: 600 },
      { x: 5, y: 900 }
    ]
  },
  {
    name: 'Mandarin Duck',
    introduction:
      'Mandarin duck is a kind of two-winged bird. The head of the male bird is blue and the head of the female bird is brown. It usually perches and mates in pairs. It is one of the symbols in Chinese culture.',
    image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/Mandarin.jpeg',
    video: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/Mandarin.mp4',
    YoY: 10,
    QoQ: 16,
    trend: [
      { x: 1, y: 500 },
      { x: 2, y: 480 },
      { x: 3, y: 400 },
      { x: 4, y: 500 },
      { x: 5, y: 800 }
    ]
  }
];

const columns = [
  {
    field: 'name',
    title: 'name',
    cellType: 'link',
    templateLink: 'https://www.google.com.hk/search?q={name}',
    linkJump: true,
    width: 100
  },
  {
    field: 'introduction',
    title: 'introduction',
    cellType: 'text',
    width: 200
  },
  {
    field: 'image',
    title: 'bird image',
    // cellType:'image',
    cellType(args) {
      if (args.row % 3 === 1) return 'image';
      else if (args.row % 3 === 2) return 'link';
      return 'text';
    },
    fieldFormat(record) {
      debugger;
      if (record.name === 'Magpie') return 'Magpie 的访问地址：' + record.image;
      return record.image;
    },
    width: 'auto',
    keepAspectRatio: true
  }
];
const option = {
  records,
  columns,
  defaultHeaderRowHeight: 40,
  defaultRowHeight: 140
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
