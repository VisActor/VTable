---
title: VTable usage issue: How to implement text type buttons</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to implement text type buttons</br>


## Problem description

Hope to display text type buttons in the cell, click to operate.</br>


## Solution

You can use the `customLayout `feature to customize button elements and bind corresponding events</br>


## Code example

```
import {createGroup, createText} from '@visactor/vtable/es/vrender';

  const option: VTable.ListTableConstructorOptions = {
    columns: [
      // ......
      {
        field: 'worksCount',
        title: 'operation',
        width: 110,
        customLayout: (args: VTable.TYPES.CustomRenderFunctionArg) => {
          const { table, row, col, rect } = args;
          const { height, width } = rect ?? table.getCellRect(col, row);

          const container = createGroup({
            height,
            width,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          });

          const editText = createText({
            text: '编辑',
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: '#2440b3', // #315efb
            boundsPadding: [10, 0, 0, 10],
            underline: 0,
            cursor: 'pointer'
          });
          editText.stateProxy = (stateName: string) => {
            if (stateName === 'hover') {
              return {
                fill: '#315efb',
                underline: 1
              };
            }
          };
          editText.addEventListener('mouseenter', e => {
            editText.addState('hover', true, false);
            table.scenegraph.updateNextFrame();
          });
          editText.addEventListener('mouseleave', e => {
            editText.removeState('hover', false);
            table.scenegraph.updateNextFrame();
          });
          editText.addEventListener('click', e => {
            console.log('edit click');
          });
          container.add(editText);

          return {
            rootContainer: container,
            renderDefault: false
          };
        }
      }
    ],
    // ......
  };</br>
```
## Results show

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/UK7fbpamQorpNnxaMjtcO3Genpe.gif' alt='' width='384' height='564'>



Complete sample code (you can try pasting it into the [editor ](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table-tree)):</br>
```
import {createGroup, createText} from '@visactor/vtable/es/vrender';

  const option = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'bloggerId',
        title: 'index'
      },
      {
        field: 'worksCount',
        title: 'operation',
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold'
        },
        width: 110,
        customLayout: (args) => {
          const { table, row, col, rect } = args;
          const { height, width } = rect ?? table.getCellRect(col, row);

          const container = createGroup({
            height,
            width,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          });

          const editText = createText({
            text: '编辑',
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: '#2440b3', // #315efb
            boundsPadding: [10, 0, 0, 10],
            underline: 0,
            cursor: 'pointer'
          });
          editText.stateProxy = (stateName) => {
            if (stateName === 'hover') {
              return {
                fill: '#315efb',
                underline: 1
              };
            }
          };
          editText.addEventListener('mouseenter', e => {
            editText.addState('hover', true, false);
            table.scenegraph.updateNextFrame();
          });
          editText.addEventListener('mouseleave', e => {
            editText.removeState('hover', false);
            table.scenegraph.updateNextFrame();
          });
          editText.addEventListener('click', e => {
            console.log('edit click');
          });
          container.add(editText);

          const deleteText = createText({
            text: '删除',
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: '#2440b3', // #315efb
            boundsPadding: [10, 0, 0, 10],
            underline: 0,
            cursor: 'pointer'
          });
          deleteText.stateProxy = (stateName) => {
            if (stateName === 'hover') {
              return {
                fill: '#315efb',
                underline: 1
              };
            }
          };
          deleteText.addEventListener('mouseenter', e => {
            deleteText.addState('hover', true, false);
            table.scenegraph.updateNextFrame();
          });
          deleteText.addEventListener('mouseleave', e => {
            deleteText.removeState('hover', false);
            table.scenegraph.updateNextFrame();
          });
          deleteText.addEventListener('click', e => {
            console.log('delete click');
          });
          container.add(deleteText);

          return {
            rootContainer: container,
            renderDefault: false
          };
        }
      }
    ],
    records: [
      {
        bloggerId: 1,
      },
      {
        bloggerId: 2,
      },
      {
        bloggerId: 3,
      },
      {
        bloggerId: 4,
      },
      {
        bloggerId: 5,
      },
      {
        bloggerId: 6,
      }
    ],
    defaultRowHeight: 40
  };

  const instance = new VTable.ListTable(option);</br>
```
## Related Documents

Related api: https://www.visactor.io/vtable/guide/custom_define/custom_layout</br>
github：https://github.com/VisActor/VTable</br>



