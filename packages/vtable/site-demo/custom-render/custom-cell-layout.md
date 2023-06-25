---
category: examples
group: table-type list-table
title: 自定义内容布局绘制
cover:
---

# 基本表格

自定义单元格内容，可实现图文混排效果

## 关键配置

- `customLayout` 配置该API 返回需要渲染的内容

## 代码演示

```ts
VTable.register.icon('location',{
  type:'svg',
  name:'location',
  positionType:VTable.TYPES.IconPosition.left,
  svg:'http://' + window.location.host + "/mock-data/location.svg",
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
    title:'关注博主',
    style:{
      font:'10px Arial',
      bgColor:'white',
      color:'#333',
      arrowMark:true,
    }
  },
  svg:'http://' + window.location.host + "/mock-data/favorite.svg",
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
    title:'发消息',
    style:{
      font:'10px Arial',
      bgColor:'white',
      color:'#333',
      arrowMark:true
    }
  },
  svg:'http://' + window.location.host + "/mock-data/message.svg",
})

  const option = {
    parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
    columns:[
      {
        field: 'bloggerId',
        caption:'序号'
      }, 
      {
        field: 'bloggerName',
        caption:'主播昵称',
        width:'260',
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
      caption:'粉丝数',
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
      caption:'作品数',
      style:{
        fontFamily:'Arial',
        fontSize:12,
        fontWeight:'bold'
      }
    }, 
    {
      field: 'viewCount',
      caption:'播放量',
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
      caption:'播放量',
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
      caption:'操作',
      width:100,
      icon:['favorite','message']
    }, 
    ],
    records:[
  {
    'bloggerId':1,
    "bloggerName": "虚拟主播小花",
    "bloggerAvatar": 'http://' + window.location.host + "/mock-data/custom-render/flower.jpg",
    "introduction": "大家好，我是虚拟主播小花。喜欢游戏、动漫和美食的小仙女，希望通过直播和大家分享快乐时光。",
    "fansCount": 400,
    "worksCount": 10,
    "viewCount": 5,
    "city": "梦幻之都",
    "tags": ["游戏", "动漫", "美食"]
    },
    {
      'bloggerId':2,
    "bloggerName": "虚拟主播小狼",
    "bloggerAvatar":'http://' + window.location.host + "/mock-data/custom-render/wolf.jpg",
    "introduction": "大家好，我是虚拟主播小狼。喜欢音乐、旅行和摄影的小狼人，希望通过直播和大家一起探索世界的美好。",
    "fansCount": 800,
    "worksCount": 20,
    "viewCount": 15,
    "city": "音乐之城",
    "tags": ["音乐", "旅行", "摄影"]
    },
    {
      'bloggerId':3,
    "bloggerName": "虚拟主播小兔",
    "bloggerAvatar": 'http://' + window.location.host + "/mock-data/custom-render/rabbit.jpg",
    "introduction": "大家好，我是虚拟主播小兔。喜欢绘画、手工和美妆的小可爱，希望通过直播和大家一起分享创意和时尚。",
    "fansCount": 600,
    "worksCount": 15,
    "viewCount": 10,
    "city": "艺术之都",
    "tags": ["绘画", "手工", "美妆"]
    },
    {
      'bloggerId':4,
    "bloggerName": "虚拟主播小猫",
    "bloggerAvatar": 'http://' + window.location.host + "/mock-data/custom-render/cat.jpg",
    "introduction": "大家好，我是虚拟主播小猫。喜欢舞蹈、健身和烹饪的小懒猫，希望通过直播和大家一起健康快乐地生活。",
    "fansCount": 1000,
    "worksCount": 30,
    "viewCount": 20,
    "city": "健康之城",
    "tags": ["舞蹈", "健身", "烹饪"]
    },
    {
      'bloggerId':5,
    "bloggerName": "虚拟主播小熊",
    "bloggerAvatar":'http://' + window.location.host + "/mock-data/custom-render/bear.jpg",
    "introduction": "大家好，我是虚拟主播小熊。喜欢电影、读书和哲学的小智者，希望通过直播和大家一起探索人生的意义。",
    "fansCount": 1200,
    "worksCount": 25,
    "viewCount": 18,
    "city": "智慧之城",
    "tags": ["电影", "文学"]
    },
    {
      'bloggerId':6,
    "bloggerName": "虚拟主播小鸟",
    "bloggerAvatar": 'http://' + window.location.host + "/mock-data/custom-render/bird.jpeg",
    "introduction": "大家好，我是虚拟主播小鸟。喜欢唱歌、表演和综艺的小嗨鸟，希望通过直播和大家一起嗨翻天。",
    "fansCount": 900,
    "worksCount": 12,
    "viewCount": 8,
    "city": "快乐之城",
    "tags": ["音乐", "表演", "综艺"]
    }
    ],
    defaultRowHeight:80
  };
  
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
```

## 相关教程

[性能优化](link)
