---
title: VTable usage issue: How to implement hover to a cell to show or hide part of the content</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to implement hover to a cell to show or hide part of the content</br>


## Problem description

When you want to hover the mouse over a cell, show or hide some elements (icons, text, etc.) in the cell.</br>


## Solution

You can use [customLayout ](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fguide%2Fcustom_define%2Fcustom_layout)to do this: listen to the `onMouseEnter `and `onMouseLeave `events on the container `Group `, and set the corresponding primitive to show or hide in the event callback.</br>


## Code example

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
## Results show

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/PyaGbK31PoBxOGxQWkxci1T3nKb.gif' alt='' width='424' height='504'>



Full sample code (you can try pasting it into the [editor ](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table-tree)):</br>
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
## Related Documents

Related api: https://www.visactor.io/vtable/guide/custom_define/custom_layout</br>
github：https://github.com/VisActor/VTable</br>



