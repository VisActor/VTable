---
title: 33. After custom rendering in the column configuration of the VTable component, the icon configuration fails. How to solve this?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question Title

After custom rendering in the column configuration of the VTable component, the icon configuration fails. How to solve this?</br>
## Problem Description

We have used the customLayout or customRender configuration for custom rendering in business scenarios, but we also want to use the icon button icon feature of VTable itself. However, after both configurations are enabled, the icon does not display correctly. Is there any way to make both configurations work properly?</br>
As shown below, only the content of customRender is displayed. The icon configuration icon is not displayed.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BloSbz1VaoStC5xeL28coNMnnFc.gif' alt='' width='2512' height='522'>

## Solution

You can solve this problem by using renderDefault of the custom rendering configuration.</br>
However, after configuration, you may find unwanted content being drawn.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/KOTybyej9oA4sExlrxzcBESZnlb.gif' alt='' width='832' height='366'>

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/OmiNbNeMdoRVevxjTPxczxWanKf.gif' alt='' width='2446' height='628'>

To solve this problem, you can use fieldFormat to directly return an empty value with this custom function, so that the default text content will not be drawn.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/QNyOb8RFfoKdLbxpPl5c7KMwnR6.gif' alt='' width='1978' height='396'>

## Code Examples

You can paste it into the official editor for testing:</br>
https://visactor.io/vtable/demo/custom-render/custom-render</br>
```
const option = {
    columns:[
    {
      field: 'not_urgency',
      title:'not urgency',
      width:400,
      headerStyle:{
          lineHeight:50,
          bgColor:'#4991e3',
          color:'white',
          textAlign:'center',
          fontSize:26,
          fontWeight:600,
      },
      style:{
        fontFamily:'Arial',
        fontSize:12,
        fontWeight:'bold'
      },
      fieldFormat:()=>'',
      icon:{
              name: 'detail',
              type: 'svg',
              svg: `<svg t="1710211168958" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3209" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M722.944 256l-153.6 153.6c-3.072 3.072-5.12 6.656-7.168 10.24-1.536 4.096-2.56 8.192-2.56 12.288v1.536c0 4.096 1.024 7.68 2.56 11.264 1.536 3.584 3.584 6.656 6.656 9.728 3.072 3.072 6.656 5.12 10.24 7.168 4.096 1.536 8.192 2.56 12.288 2.56 4.096 0 8.192-1.024 12.288-2.56 4.096-1.536 7.168-4.096 10.24-7.168l153.6-153.6v114.688c0 2.048 0 4.096 0.512 6.144 0.512 2.048 1.024 4.096 2.048 6.144 1.024 2.048 1.536 3.584 3.072 5.632 1.024 1.536 2.56 3.584 4.096 4.608 1.536 1.536 3.072 2.56 4.608 4.096 1.536 1.024 3.584 2.048 5.632 3.072 2.048 1.024 4.096 1.536 6.144 2.048 2.048 0.512 4.096 0.512 6.144 0.512 2.048 0 4.096 0 6.144-0.512 2.048-0.512 4.096-1.024 6.144-2.048 2.048-1.024 3.584-1.536 5.632-3.072 1.536-1.024 3.584-2.56 4.608-4.096 1.536-1.536 2.56-3.072 4.096-4.608 1.024-1.536 2.048-3.584 3.072-5.632 1.024-2.048 1.536-4.096 2.048-6.144 0.512-2.048 0.512-4.096 0.512-6.144V223.744c0-4.096-1.024-8.192-2.56-12.288-1.536-4.096-4.096-7.168-7.168-10.24h-0.512c-3.072-3.072-6.656-5.12-10.24-6.656-4.096-1.536-7.68-2.56-12.288-2.56h-192c-2.048 0-4.096 0-6.144 0.512-2.048 0.512-4.096 1.024-6.144 2.048-2.048 1.024-3.584 1.536-5.632 3.072-1.536 1.024-3.584 2.56-4.608 4.096-1.536 1.536-2.56 3.072-4.096 4.608-1.024 1.536-2.048 3.584-3.072 5.632-1.024 2.048-1.536 4.096-2.048 6.144-0.512 2.048-0.512 4.096-0.512 6.144s0 4.096 0.512 6.144c0.512 2.048 1.024 4.096 2.048 6.144 1.024 2.048 1.536 3.584 3.072 5.632 1.024 1.536 2.56 3.584 4.096 4.608 1.536 1.536 3.072 2.56 4.608 4.096 1.536 1.024 3.584 2.048 5.632 3.072 2.048 1.024 4.096 1.536 6.144 2.048 2.048 0.512 4.096 0.512 6.144 0.512h115.712z m-268.288 358.4l-153.6 153.6h114.688c2.048 0 4.096 0 6.144 0.512 2.048 0.512 4.096 1.024 6.144 2.048 2.048 1.024 3.584 1.536 5.632 3.072 1.536 1.024 3.584 2.56 4.608 4.096 1.536 1.536 2.56 3.072 4.096 4.608 1.024 1.536 2.048 3.584 3.072 5.632 1.024 2.048 1.536 4.096 2.048 6.144 0.512 2.048 0.512 4.096 0.512 6.144 0 2.048 0 4.096-0.512 6.144-0.512 2.048-1.024 4.096-2.048 6.144-1.024 2.048-1.536 3.584-3.072 5.632-1.024 1.536-2.56 3.584-4.096 4.608-1.536 1.536-3.072 2.56-4.608 4.096-1.536 1.024-3.584 2.048-5.632 3.072-2.048 1.024-4.096 1.536-6.144 2.048-2.048 0.512-4.096 0.512-6.144 0.512H224.256c-2.048 0-4.096 0-6.144-0.512-2.048-0.512-4.096-1.024-6.144-2.048-2.048-1.024-3.584-1.536-5.632-3.072-1.536-1.024-3.584-2.56-4.608-4.096-1.536-1.536-2.56-3.072-4.096-4.608-1.024-1.536-2.048-3.584-3.072-5.632-1.024-2.048-1.536-4.096-2.048-6.144-0.512-2.048-0.512-4.096-0.512-6.144v-192.512c0-2.048 0-4.096 0.512-6.144 0.512-2.048 1.024-4.096 2.048-6.144 1.024-2.048 1.536-3.584 3.072-5.632 1.024-1.536 2.56-3.584 4.096-4.608 1.536-1.536 3.072-2.56 4.608-4.096 1.536-1.024 3.584-2.048 5.632-3.072 2.048-1.024 4.096-1.536 6.144-2.048 2.048-0.512 4.096-0.512 6.144-0.512s4.096 0 6.144 0.512c2.048 0.512 4.096 1.024 6.144 2.048 2.048 1.024 3.584 1.536 5.632 3.072 1.536 1.024 3.584 2.56 4.608 4.096 1.536 1.536 2.56 3.072 4.096 4.608 1.024 1.536 2.048 3.584 3.072 5.632 1.024 2.048 1.536 4.096 2.048 6.144 0.512 2.048 0.512 4.096 0.512 6.144v114.688l153.6-153.6c3.072-3.072 6.656-5.12 10.24-7.168 4.096-1.536 8.192-2.56 12.288-2.56 4.096 0 8.192 1.024 12.288 2.56 4.096 1.536 7.168 3.584 10.24 6.656h0.512c3.072 3.072 5.12 6.656 7.168 10.24 1.536 4.096 2.56 8.192 2.56 12.288 0 4.096-1.024 8.192-2.56 12.288-3.072 5.12-5.12 8.704-8.192 11.264z" p-id="3210" fill="#999999"></path></svg>`,
              marginRight: 8,
              positionType: VTable.TYPES.IconPosition.absoluteRight,
              width: 16,
              height: 16,
              cursor: 'pointer',
              visibleTime: 'mouseenter_cell',
              funcType: 'record_detail',
              tooltip: {
                title:'展开详情',
                style: {
                  fontSize: 12,
                  padding: [8, 8, 8, 8],
                  bgColor: '#46484a',
                  arrowMark: true,
                  color: 'white',
                  maxHeight: 100,
                  maxWidth: 200
                },
                placement: VTable.TYPES.Placement.top
              }
            },
      customRender(args){
        const { width, height}= args.rect;
        const {dataValue,table,row} =args;
        const elements=[];
        let top=30;
        const left=15;
        let maxWidth=0;
          elements.push({
            type: 'text',
            fill: 'red',
            fontSize: 20,
            fontWeight: 500, 
            textBaseline: 'middle',
            text: row===1? 'important but not urgency':'not important and not urgency',
            x: left+50,
            y: top-5,
          });
        return {
          elements,
          expectedHeight:top+20,
          expectedWidth: 300,
          renderDefault:true
        }
      }
    }, 
    ],
    records:[
      {
        'type': 'important',
        "urgency": ['crisis','urgent problem','tasks that must be completed within a limited time'],
        "not_urgency": ['preventive measures','development relationship','identify new development opportunities','establish long-term goals'],
      },
      {
        'type': 'Not\nimportant',
        "urgency": ['Receive visitors','Certain calls, reports, letters, etc','Urgent matters','Public activities'],
        "not_urgency": ['Trivial busy work','Some letters','Some phone calls','Time-killing activities','Some pleasant activities'],
      },
    ],
    defaultRowHeight:80,
    heightMode:'autoHeight',
    widthMode:'standard',
    autoWrapText:true,
  };
  
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;</br>
```
## Relevant Documents

Related API: [https://visactor.io/vtable/option/ListTable-columns-text#customRender.renderDefault](https%3A%2F%2Fvisactor.io%2Fvtable%2Foption%2FListTable-columns-text%23customRender.renderDefault)</br>
Tutorial：https://visactor.io/vtable/demo/custom-render/custom-render</br>
github：https://github.com/VisActor/VTable</br>

