---
category: examples
group: Custom
title: 单元格自定义布局
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-cell-layout.png
order: 7-1
link: '/guide/custom_define/custom_layout'
---

# 单元格自定义布局

自定义单元格内容，可实现图文混排效果

## 关键配置

- `customLayout` 配置该API 返回需要渲染的内容

## 代码演示

```javascript livedemo template=vtable
VTable.register.icon('location',{
  type:'svg',
  name:'location',
  positionType:VTable.TYPES.IconPosition.left,
  svg:"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/location.svg",
})
VTable.register.icon('favorite',{
  type:'svg',
  name:'favorite',
  positionType:VTable.TYPES.IconPosition.left,
  width:20,
  height:20,
  cursor: 'pointer',
  tooltip:{
    placement:VTable.TYPES.Placement.top,
    title:'follow',
    style:{
      font:'10px Arial',
      bgColor:'white',
      color:'#333',
      arrowMark:true,
    }
  },
  svg:"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/favorite.svg",
})

VTable.register.icon('message',{
  type:'svg',
  name:'message',
  positionType:VTable.TYPES.IconPosition.left,
  width:20,
  height:20,
  marginLeft:10,
  cursor: 'pointer',
  tooltip:{
    placement:VTable.TYPES.Placement.top,
    title:'send message',
    style:{
      font:'10px Arial',
      bgColor:'white',
      color:'#333',
      arrowMark:true
    }
  },
  svg:"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/message.svg",
})

  const option = {
    parentElement: document.getElementById(CONTAINER_ID),
    columns:[
      {
        field: 'bloggerId',
        caption:'order number'
      }, 
      {
        field: 'bloggerName',
        caption:'anchor nickname',
        width:330,
         style:{
        fontFamily:'Arial',
        fontWeight:500
         },
      customLayout: (args) => {
        const { table,row,col,rect } = args;
        const record = table.getRecordByRowCol(col,row);
       const  {height, width } = rect ?? table.getCellRect(col,row);
       const percentCalc = VTable.CustomLayout.percentCalc;

        const container = new VTable.CustomLayout.Container({
          height,
          width,
        });
        const containerLeft = new VTable.CustomLayout.Container({
          height: percentCalc(100),
          width: 60,
          showBounds: false,
          direction: 'column',
          alignContent: 'center',
          justifyContent: 'center',
        });
        container.add(containerLeft);

        const icon0 = new VTable.CustomLayout.Image({
          id: 'icon0',
          width: 50,
          height: 50,
          src:record.bloggerAvatar,
          shape:'circle',
          marginLeft:10,
        });
        containerLeft.add(icon0);


        const containerRight = new VTable.CustomLayout.Container({
          height: percentCalc(100),
          width: 200,
          showBounds: false,
          direction: 'column',
          justifyContent: 'center',
        });
        container.add(containerRight);

        const containerRightTop = new VTable.CustomLayout.Container({
          height: percentCalc(50),
          width: percentCalc(100),
          showBounds: false,
          alignContent: 'bottom',
       });

        const containerRightBottom = new VTable.CustomLayout.Container({
          height: percentCalc(50),
          width: percentCalc(100),
          showBounds: false,
          alignContent: 'center',
        });

        containerRight.add(containerRightTop);
        containerRight.add(containerRightBottom);

        const bloggerName = new VTable.CustomLayout.Text({
          text:record.bloggerName,
          fontSize: 13,
          fontFamily: 'sans-serif',
          fill: 'black',
          marginLeft:10
        });
        bloggerName.getSize(table);
        containerRightTop.add(bloggerName)

        const location = new VTable.CustomLayout.Icon({
          id: 'location',
          iconName: 'location',
          width: 15,
          height: 15,
          marginLeft:10
        });
        containerRightTop.add(location);

        const locationName = new VTable.CustomLayout.Text({
          text:record.city,
          fontSize: 11,
          fontFamily: 'sans-serif',
          fill: '#6f7070',
        });
        bloggerName.getSize(table);
        containerRightTop.add(locationName)

      for(let i = 0;i < record?.tags?.length ?? 0;i++){
        const tag = new VTable.CustomLayout.Text({
          text: record.tags[i],
          fontSize: 10,
          fontFamily: 'sans-serif',
          fill: 'rgb(51, 101, 238)',
          background: {
            fill: '#f4f4f2',
            cornerRadius: 5,
            expandX: 5,
            expandY: 5,
          },
          marginLeft: 5,
        });
        tag.getSize(table);
        containerRightBottom.add(tag);
      }
        return {
          rootContainer: container,
          renderDefault: false,
        };
      }
    },
    {
      field: 'fansCount',
      caption:'fansCount',
      fieldFormat(rec){
        return rec.fansCount + 'w'
      },
      style:{
        fontFamily:'Arial',
        fontSize:12,
        fontWeight:'bold'
      }
    }, 
    {
      field: 'worksCount',
      caption:'worksCount',
      style:{
        fontFamily:'Arial',
        fontSize:12,
        fontWeight:'bold'
      }
    }, 
    {
      field: 'viewCount',
      caption:'viewCount',
      fieldFormat(rec){
        return rec.fansCount + 'w'
      },
      style:{
        fontFamily:'Arial',
        fontSize:12,
        fontWeight:'bold'
      }
    }, 
    {
      field: 'viewCount',
      caption:'viewCount',
      fieldFormat(rec){
        return rec.fansCount + 'w'
      },
      style:{
        fontFamily:'Arial',
        fontSize:12,
        fontWeight:'bold'
      }
    }, 
    {
      field: '',
      caption:'operation',
      width:100,
      icon:['favorite','message']
    }, 
    ],
   records:[
  {
    'bloggerId': 1,
    "bloggerName": "Virtual Anchor Xiaohua",
    "bloggerAvatar": "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg",
    "introduction": "Hi everyone, I am Xiaohua, the virtual host. I am a little fairy who likes games, animation and food. I hope to share happy moments with you through live broadcast.",
    "fansCount": 400,
    "worksCount": 10,
    "viewCount": 5,
    "city": "Dream City",
    "tags": ["game", "anime", "food"]
    },
    {
      'bloggerId': 2,
    "bloggerName": "Virtual anchor little wolf",
    "bloggerAvatar": "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg",
    "introduction": "Hello everyone, I am the virtual anchor Little Wolf. I like music, travel and photography, and I hope to explore the beauty of the world with you through live broadcast.",
    "fansCount": 800,
    "worksCount": 20,
    "viewCount": 15,
    "city": "City of Music",
    "tags": ["music", "travel", "photography"]
    },
    {
      'bloggerId': 3,
    "bloggerName": "Virtual anchor bunny",
    "bloggerAvatar": "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg",
    "introduction": "Hello everyone, I am the virtual anchor Xiaotu. I like painting, handicrafts and beauty makeup. I hope to share creativity and fashion with you through live broadcast.",
    "fansCount": 600,
    "worksCount": 15,
    "viewCount": 10,
    "city": "City of Art",
    "tags": ["painting", "handmade", "beauty makeup"]
    },
    {
      'bloggerId': 4,
    "bloggerName": "Virtual anchor kitten",
    "bloggerAvatar": "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg",
    "introduction": "Hello everyone, I am the virtual host Kitty. I am a lazy cat who likes dancing, fitness and cooking. I hope to live a healthy and happy life with everyone through the live broadcast.",
    "fansCount": 1000,
    "worksCount": 30,
    "viewCount": 20,
    "city": "Health City",
    "tags": ["dance", "fitness", "cooking"]
    },
    {
      'bloggerId': 5,
    "bloggerName": "Virtual anchor Bear",
    "bloggerAvatar": "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg",
    "introduction": "Hello everyone, I am the virtual host Xiaoxiong. A little wise man who likes movies, reading and philosophy, I hope to explore the meaning of life with you through live broadcast.",
    "fansCount": 1200,
    "worksCount": 25,
    "viewCount": 18,
    "city": "City of Wisdom",
    "tags": ["Movie", "Literature"]
    },
    {
      'bloggerId': 6,
    "bloggerName": "Virtual anchor bird",
    "bloggerAvatar": "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bird.jpeg",
    "introduction": "Hello everyone, I am the virtual anchor Xiaoniao. I like singing, acting and variety shows. I hope to be happy with everyone through the live broadcast.",
    "fansCount": 900,
    "worksCount": 12,
    "viewCount": 8,
    "city": "Happy City",
    "tags": ["music", "performance", "variety"]
    }
    ],
    defaultRowHeight:80
  };
  
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
```

## 相关教程

[性能优化](link)
