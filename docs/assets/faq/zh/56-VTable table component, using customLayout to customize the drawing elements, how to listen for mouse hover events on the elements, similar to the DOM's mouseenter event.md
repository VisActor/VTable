---
title: 34. VTable表格组件，使用customLayout自定义了绘制图元怎么监听鼠标hover到图元的事件，类似dom的mouseenter事件？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable表格组件，使用customLayout自定义了绘制图元怎么监听鼠标hover到图元的事件，类似dom的mouseenter事件？</br>
## 问题描述

使用customLayout自定义单元格内容，包括Text，Image等，希望hover到Image的时候，有一些自定义逻辑，目前鼠标进入单元格事件，区分不了具体的target。</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/QwvobWmv2oJYXoxgACucHSuNnfb.gif' alt='' width='336' height='284'>

对于JavaScript中的DOM元素来说，mouseenter事件只在鼠标指针进入（移动到）元素上时触发一次。想请教一下，有没有类似mouseenter_cell这种事件，来监听自定义单元格中指定内容呢？</br>
## 解决方案 

可以在自定义布局`customLayout`的图元上绑定 `mouseenter` 和 `mouseleave` 事件</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/ONDybjC3Co6zidxRl8tcx0fAnDb.gif' alt='' width='2542' height='628'>

## 代码示例  

可以粘贴到官网编辑器上进行测试：https://visactor.io/vtable/demo/custom-render/custom-cell-layout-jsx</br>
```
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
      width: 330,
      customLayout: args => {
        const { table, row, col, rect } = args;
        const { height, width } = rect || table.getCellRect(col, row);
        const record = table.getRecordByRowCol(col, row);
        // const jsx = jsx;
        const container = (
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
          >
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
                    fill: 'black',
                    textAlign: 'left',
                    textBaseline: 'top',
                    boundsPadding: [0, 0, 0, 10]
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
                    cursor: 'pointer'
                  }}
                  stateProxy={stateName => {
                    if (stateName === 'hover') {
                      return {
                        background: {
                          fill: 'green',
                          cornerRadius: 5,
                          expandX: 1,
                          expandY: 1
                        }
                      };
                    }
                  }}
                  onPointerEnter={event => {
                    event.currentTarget.addState('hover', true, false);
                    event.currentTarget.stage.renderNextFrame();
                  }}
                  onPointerLeave={event => {
                    event.currentTarget.removeState('hover', false);
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
            </VGroup>
          </VGroup>
        );

        // decode(container)
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

const instance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
// 只为了方便控制太调试用，不要拷贝
window.tableInstance = instance;</br>
```
## 相关文档

demo: https://visactor.io/vtable/demo/custom-render/custom-cell-layout-jsx</br>
相关api：https://visactor.io/vtable/option/ListTable-columns-text#customLayout</br>
教程：https://visactor.io/vtable/guide/custom_define/custom_layout</br>
github：https://github.com/VisActor/VTable</br>



