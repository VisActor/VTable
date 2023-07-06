---
category: examples
group: Cell Type
title: 单元格内容类型
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/multi-type.png
order: 2-1
---

# 单元格内容类型

通过columnType指定单元格内容类型。图片视频来源：https://birdsoftheworld.org/bow/home

## 关键配置

headerType: 'text' | 'link' | 'image' | 'video';

columnType:
    'text'
    | 'link'
    | 'image'
    | 'video'
    | 'sparkline'
    | 'progressbar'
    | 'chart';

## 代码演示

```javascript livedemo template=vtable

const records = [
  {
   "name":"鸽子",
   "introduction":"鸽子是一种常见的城市鸟类，具有灰色的羽毛和短而粗壮的喙",
   "image":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/pigeon.jpeg",
   "vedio":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/pigeon.mp4",
   "YoY":50,
   "QoQ":10,
   "trend":[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  //  "trend":[1500,1480,1520,1550,1600],
  },
  {
   "name":"燕子",
   "introduction":"燕子是一种善于飞行的鸟类，通常栖息在房屋和建筑物的附近。",
   "image":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/swallow.jpeg",
   "vedio":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/swallow.mp4",
   "YoY":10,
   "QoQ":-10,
   "trend":[{x:1,y:800},{x:2,y:780},{x:3,y:700},{x:4,y:800},{x:5,y:900}],
  },
   {
   "name":"喜鹊",
   "introduction":"喜鹊是一种常见的小型鸟类，主要分布在亚洲地区。它们体型较小，具有黑色的头部和喉咙、灰色的背部和白色的腹部。喜鹊是群居动物，常常在树林中或城市公园中筑巢繁殖，以昆虫、果实和种子为食。它们还具有很高的智商和社交性，被认为是一种聪明、有趣的鸟类。",
   "image":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/Magpie.jpeg",
   "vedio":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/Magpie.mp4",
   "YoY":-10,
   "QoQ":-10,
   "trend":[{x:1,y:500},{x:2,y:680},{x:3,y:400},{x:4,y:600},{x:5,y:800}],
  },
   {
   "name":"孔雀",
   "introduction":"孔雀是一种美丽的大型鸟类，拥有灿烂的蓝绿色羽毛和长长的尾羽。主要生活在南亚地区，以昆虫、水果和种子为食。",
   "image":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/peacock.jpeg",
   "vedio":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/peacock.mp4",
   "YoY":-10,
   "QoQ":-10,
   "trend":[{x:1,y:500},{x:2,y:680},{x:3,y:400},{x:4,y:600},{x:5,y:800}],
  },
   {
   "name":"孔雀",
   "introduction":"火烈鸟是一种美丽的粉红色鸟类，长腿长颈，善游泳，是热带地区的常见鸟类。",
   "image":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/flamingo.jpeg",
   "vedio":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/flamingo.mp4",
   "YoY":-1,
   "QoQ":-6,
   "trend":[{x:1,y:980},{x:2,y:880},{x:3,y:900},{x:4,y:1600},{x:5,y:1800}],
  },
   {
   "name":"鸵鸟",
   "introduction":"鸵鸟是一种大型鸟类，不能飞行，奔跑速度快，是世界上最大的鸟类之一",
   "image":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/ostrich.jpeg",
   "vedio":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/ostrich.mp4",
   "YoY":-3,
   "QoQ":10,
   "trend":[{x:1,y:560},{x:2,y:680},{x:3,y:5500},{x:4,y:600},{x:5,y:900}],
  },
   {
   "name":"鸳鸯",
   "introduction":"鸳鸯是一种双翼鸟类，雄鸟头部蓝色，雌鸟头部褐色，通常成双栖息和交配，是中华文化中的象征之一。",
   "image":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/Mandarin.jpeg",
   "vedio":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/Mandarin.mp4",
   "YoY":10,
   "QoQ":16,
   "trend":[{x:1,y:500},{x:2,y:480},{x:3,y:400},{x:4,y:500},{x:5,y:800}],
  }
];

const columns = [
  {
    field: 'name',
    caption: 'name',
    columnType: 'link',
    templateLink: 'https://www.google.com.hk/search?q={name}',
    linkJump: true,
    width:100
  },
  {
    field: 'introduction',
    caption: 'introduction',
    columnType: 'text',
    width:200
  },
  {
    field: 'image',
    caption: 'bird image',
    columnType: 'image',
    width:150,
    // imageSizing : 'keep-aspect-ratio',
  },
  {
    field: 'vedio',
    caption: 'bird video',
    columnType: 'video',
    width:150,
    // imageSizing : 'keep-aspect-ratio',
  },
  {
    field: 'YoY',
    caption: 'count Year-over-Year',
    columnType: 'progressbar',
    width:200,
    fieldFormat(){
      return '';
    },
    barType:'negative',
    min:-20,
    max:60,
    style: {
        barHeight: 20,
        barBottom:'30%',
      },
  },
  {
    field: 'QoQ',
    caption: 'count Quarter-over-Quarter',
    fieldFormat(rec){return rec['QoQ']+'%'},
    style:{
      textAlign:'center'
    },
    icon(args){
      const { dataValue } = args;
      if (dataValue > 0) {
        return {
          type: 'svg',
          svg: "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/up-arrow.svg",
          width: 12,
          height: 12,
          name: 'up-green',
          positionType:'inlineEnd',
        };
      } else if (dataValue < 0)
        return {
          type: 'svg',
          svg: "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/down-arrow.svg",
          width: 14,
          height: 14,
          name: 'down-red',
          positionType: 'contentRight',
        };
      return '';
    },
    width:150
  },
  {
    field: 'trend',
    caption: 'bird count',
    columnType: 'sparkline',
    width:300,
    sparklineSpec: {
        type: 'line',
        xField: 'x',
        yField: 'y',
        pointShowRule: 'none',
        smooth: true,
        line: {
          style: {
            stroke: '#2E62F1',
            strokeWidth: 2,
          },
        },
        point: {
          hover: {
              stroke: 'blue',
              strokeWidth: 1,
              fill: 'red',
              shape: 'circle',
              size: 4,
          },
          style: {
            stroke: 'red',
            strokeWidth: 1,
            fill: 'yellow',
            shape: 'circle',
            size: 2,
          },
        },
        crosshair: {
          style: {
            stroke: 'gray',
            strokeWidth: 1,
          },
        },
      },
  },
];
const option = {
  parentElement: document.getElementById(CONTAINER_ID),
  records,
  columns,
  autoWrapText:true,
  defaultRowHeight:120
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
```

## 相关教程

[性能优化](link)
