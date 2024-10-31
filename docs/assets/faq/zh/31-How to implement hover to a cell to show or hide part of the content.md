---
title: 9. VTable使用问题：如何实现hover到单元格显示或隐藏部分内容</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如果实现hover到单元格显示或隐藏部分内容</br>


## 问题描述

希望鼠标hover到单元格中时，显示或隐藏单元格中的部分元素（图标，文字等）</br>


## 解决方案 

可以使用[customLayout](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fguide%2Fcustom_define%2Fcustom_layout)来实现这个功能：在容器`Group`上监听`onMouseEnter`和`onMouseLeave`事件，在事件回调中设置相应图元的显示或隐藏。</br>


## 代码示例

```
const option = {
  columns: [
    {
      title: 'name',
      field: 'name',
    },
    {
      title: 'custom',
      field: 'custom',
      width: 120,
      customLayout: (args) => {
        const { height, width } = args.rect;
        const container = (
          <VGroup
            attribute={{
              id: 'container',
              width,
              height,
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap'
            }}
            onMouseEnter={(event) => {
              // 查找图元
              const hoverShowText = event.currentTarget.find(child => {
                return child.attribute.id === 'hover-cell-show';
              }, true);
              // 更新图元
              hoverShowText.setAttribute('opacity', 1);
              // 查找图元
              const hoverHideText = event.currentTarget.find(child => {
                return child.attribute.id === 'hover-cell-hide';
              }, true);
              hoverHideText.setAttribute('opacity', 0);
              event.currentTarget.stage.renderNextFrame();
            }}
            onMouseLeave={event => {
              // 查找图元
              const hoverShowText = event.currentTarget.find(child => {
                return child.attribute.id === 'hover-cell-show';
              }, true);
              // 更新图元
              hoverShowText.setAttribute('opacity', 0);
              // 查找图元
              const hoverHideText = event.currentTarget.find(child => {
                return child.attribute.id === 'hover-cell-hide';
              }, true);
              // 更新图元
              hoverHideText.setAttribute('opacity', 1);
              event.currentTarget.stage.renderNextFrame();
            }}
          >
            <VText
              attribute={{
                id: 'hover-cell-show',
                text: 'hover cell show',
                fill: '#000',
                boundsPadding: [0, 0, 5, 0],
                opacity: 0,
              }}
            ></VText>
            <VText
              attribute={{
                id: 'hover-cell-hide',
                text: 'hover cell hide',
                fill: '#000',
                boundsPadding: [0, 0, 5, 0],
              }}
            ></VText>
          </VGroup>
        );

        return {
            rootContainer: container,
            renderDefault: false
        };
      }
    }
  ],
  records:data,
}

const tableInstance = new VTable.ListTable(container, option);</br>
```
## 结果展示 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/MPWmb309JoyBR5x8S5IcKR6dnJh.gif' alt='' width='424' height='504'>



完整示例代码（可以粘贴到 [编辑器](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table-tree) 上尝试一下）：</br>
```
const { VGroup, VText } = VTable;
const data = [
  {
    name: '1',
    custom: '1',
  },
  {
    name: '2',
    custom: '2',
  },
  {
    name: '3',
    custom: '3',
  },
  {
    name: '4',
    custom: '4',
  },
  {
    name: '5',
    custom: '5',
  },
]
const option = {
  columns: [
    {
      title: 'name',
      field: 'name',
    },
    {
      title: 'custom',
      field: 'custom',
      width: 120,
      customLayout: (args) => {
        const { height, width } = args.rect;
        const container = (
          <VGroup
            attribute={{
              id: 'container',
              width,
              height,
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap'
            }}
            onMouseEnter={(event) => {
              const hoverShowText = event.currentTarget.find(child => {
                return child.attribute.id === 'hover-cell-show';
              }, true);
              hoverShowText.setAttribute('opacity', 1);
              const hoverHideText = event.currentTarget.find(child => {
                return child.attribute.id === 'hover-cell-hide';
              }, true);
              hoverHideText.setAttribute('opacity', 0);
              event.currentTarget.stage.renderNextFrame();
            }}
            onMouseLeave={event => {
              const hoverShowText = event.currentTarget.find(child => {
                return child.attribute.id === 'hover-cell-show';
              }, true);
              hoverShowText.setAttribute('opacity', 0);
              const hoverHideText = event.currentTarget.find(child => {
                return child.attribute.id === 'hover-cell-hide';
              }, true);
              hoverHideText.setAttribute('opacity', 1);
              event.currentTarget.stage.renderNextFrame();
            }}
          >
            <VText
              attribute={{
                id: 'hover-cell-show',
                text: 'hover cell show',
                fill: '#000',
                boundsPadding: [0, 0, 5, 0],
                opacity: 0,
              }}
            ></VText>
            <VText
              attribute={{
                id: 'hover-cell-hide',
                text: 'hover cell hide',
                fill: '#000',
                boundsPadding: [0, 0, 5, 0],
              }}
            ></VText>
          </VGroup>
        );

        return {
            rootContainer: container,
            renderDefault: false
        };
      }
    }
  ],
  records:data,
}

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);</br>
```
## 相关文档

相关api：https://www.visactor.io/vtable/guide/custom_define/custom_layout</br>
github：https://github.com/VisActor/VTable</br>



