---
title: 25. 使用VTable表格组件的自定义渲染写法时，怎么让文本根据单元格宽度自动省略？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

使用VTable表格组件的自定义渲染写法时，怎么让文本根据单元格宽度自动省略？</br>
## 问题描述

产品中使用到了VTable的自定义渲染，其中单元格包括了icon和text元素，期望在初始时列宽可以根据内容自动计算，如果手动拖拽列宽当缩小列宽时文字可以自动省略。而不是按钮悬浮在文字上，不知道怎么写才可以缩小列宽使文字变成`...`省略符</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/M1kcbqs1ZoIwcDxBgvych63unGb.gif' alt='' width='934' height='764'>

## 解决方案 

我们使用VTable提供的customLayout写法，这种自定义写法可以自动布局，且有自动测量宽度使适应单元格宽度的效果。具体写法如下：</br>
```
import {createGroup, createText, createImage} from '@visactor/vtable/es/vrender';

  customLayout: (args) => {
        const { table,row,col,rect } = args;
        const record = table.getRecordByCell(col,row);
        const  {height, width } = rect ?? table.getCellRect(col,row);
        const container = createGroup({
          height,
          width,
          display: 'flex',
          flexWrap:'no-wrap',
          alignItems: 'center',
          justifyContent: 'flex-front'
       });
        const bloggerAvatar = createImage({
          id: 'icon0',
          width: 20,
          height: 20,
          image:record.bloggerAvatar,
          cornerRadius: 10,
        });
        container.add(bloggerAvatar);
        const bloggerName = createText({
          text:record.bloggerName,
          fontSize: 13,
          x:20,
          fontFamily: 'sans-serif',
          fill: 'black',
          maxLineWidth:width===null?undefined:width-20+1
        });
        container.add(bloggerName);
        return {
          rootContainer: container,
          renderDefault: false,
        };
      }</br>
```
customLayout需要返回一个rootContainer，通常是一个Group类型的对象来作为承载其他内容的容器。这里这点设置了`flexWrap`内部元素（icon和text）不换行，水平和垂直对齐方式`alignItems` 和 `justifyContent`。Group中有个图片和文本`Image`和`Text`。如果需要文本空间被压缩是能自动省略出现...，则需要配置上`maxLineWidth`，这里有个特殊的点是，当`column`设置的`width`是`'auto'` 的情况下，`customLayout`函数接收到的参数单元格宽度`width`的值是`null`，所以这里需要判断是否为`null`，如果`null`则设置`maxLineWidth`为`undefined`来让单元格的宽度自动撑开，非`null`的话那就根据`width`这个值来设置`maxLineWidth`，这里减掉20是避让了图片的宽度，另外+1是缓冲值可以忽略。</br>
## 代码示例  

```
import {createGroup, createText, createImage} from '@visactor/vtable/es/vrender';

  const option = {
    columns:[
      {
        field: 'bloggerId',
        title:'order number'
      }, 
      {
        field: 'bloggerName',
        title:'anchor nickname',
        width:'auto',
        style:{
          fontFamily:'Arial',
          fontWeight:500
        },
      customLayout: (args) => {
        const { table,row,col,rect } = args;
        const record = table.getRecordByCell(col,row);
        const  {height, width } = rect ?? table.getCellRect(col,row);
        const container = createGroup({
          height,
          width,
          display: 'flex',
          flexWrap:'no-wrap',
          alignItems: 'center',
          justifyContent: 'flex-front'
       });
        const bloggerAvatar = createImage({
          id: 'icon0',
          width: 20,
          height: 20,
          image:record.bloggerAvatar,
          cornerRadius: 10,
        });
        container.add(bloggerAvatar);
        const bloggerName = createText({
          text:record.bloggerName,
          fontSize: 13,
          x:20,
          fontFamily: 'sans-serif',
          fill: 'black',
          maxLineWidth:width===null?undefined:width-20+1
        });
        container.add(bloggerName);
        return {
          rootContainer: container,
          renderDefault: false,
        };
      }
    },
    {
      field: 'fansCount',
      title:'fansCount',
      fieldFormat(rec){
        return rec.fansCount + 'w'
      },
      style:{
        fontFamily:'Arial',
        fontSize:12,
        fontWeight:'bold'
      }
    }, 
    ],
   records:[
   {
      'bloggerId': 1,
      "bloggerName": "Virtual Anchor Xiaohua duoduo",
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
      }
    ],
    defaultRowHeight:30
  };
  
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;</br>
```
## 结果展示 

直接将示例代码中代码粘贴到官网编辑器中即可呈现。</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/UdDMbnncsoQDpNxvljUclN9UnmJ.gif' alt='' width='388' height='142'>

## 相关文档

customLayout用法教程：https://visactor.io/vtable/guide/custom_define/custom_layout</br>
customLayout用法demo：https://visactor.io/vtable/demo/custom-render/custom-cell-layout</br>
相关api：https://visactor.io/vtable/option/ListTable-columns-text#customLayout</br>
github：https://github.com/VisActor/VTable</br>

