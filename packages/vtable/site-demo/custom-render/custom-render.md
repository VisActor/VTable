---
category: examples
group: Custom
title: 单元格自定义内容
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-render.png
order: 7-4
link: '/guide/custom_define/custom_render'
---

# 单元格自定义内容

通过列配置项customRender，设置当前自定义函数

## 关键配置

- `customRender` 配置该API 返回需要渲染的内容

## 代码演示

```javascript livedemo template=vtable

  const option = {
    parentElement: document.getElementById(CONTAINER_ID),
    columns:[
      {
        field: 'type',
        caption:'',
        width:70,
        headerStyle:{
          bgColor:'#4991e3'
        },
        style:{
          fontFamily:'Arial',
          fontWeight:600,
          bgColor:'#4991e3',
          fontSize:26,
          padding:20,
          lineHeight:32,
          color:'white'
        },
      }, 
      {
        field: 'urgency',
        caption:'紧急',
        width:'260',
        headerStyle:{
          lineHeight:50,
          fontSize:26,
          fontWeight:600,
          bgColor:'#4991e3',
          color:'white',
          textAlign:'center'
        },
      customRender(args){
        const { width, height}= args.rect;
        const {dataValue,table,row } =args;
        const elements=[];
        let top=30;
        const left=15;
        let maxWidth=0;
        elements.push({
            type: 'rect',
            fill: '#4991e3',
            x: left+20,
            y: top-15,
            width: row===1?160:180,
            height:28
          });
          elements.push({
            type: 'text',
            fill: 'white',
            fontSize: 20,
            fontWeight: 500, 
            textBaseline: 'middle',
            text: row===1? '重要且紧急':'不重要但紧急',
            x: left+50,
            y: top,
          });
        dataValue.forEach((
          item,i
        )=>{
          top+=35;
          if(row===1)
          elements.push({
            type: 'icon',
            svg:'<svg t="1687586728544" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1480" width="200" height="200"><path d="M576.4 203.3c46.7 90.9 118.6 145.5 215.7 163.9 97.1 18.4 111.5 64.9 43.3 139.5s-95.6 162.9-82.3 265.2c13.2 102.3-24.6 131-113.4 86.2s-177.7-44.8-266.6 0-126.6 16-113.4-86.2c13.2-102.3-14.2-190.7-82.4-265.2-68.2-74.6-53.7-121.1 43.3-139.5 97.1-18.4 169-73 215.7-163.9 46.6-90.9 93.4-90.9 140.1 0z" fill="#733FF1" p-id="1481"></path></svg>',
            x: left-6,
            y: top-6,
            width: 12,
            height: 12,
          });
          else
          elements.push({
            type: 'circle',
            stroke: '#000',
            fill: 'yellow',
            x: left,
            y: top,
            radius: 3,
          });
          elements.push({
            type: 'text',
            color: 'blue',
            font: '14px sans-serif',
            textBaseline: 'middle',
            text: item,
            x: left+6,
            y: top,
          });
          maxWidth=Math.max(maxWidth, table.measureText(item,{fontSize:"15",}).width);
        })
        return {
          elements,
          expectedHeight:top+20,
          expectedWidth: maxWidth+20,
        }
      }
    },
    {
      field: 'not_urgency',
      caption:'不紧急',
      width:'auto',
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
      customRender(args){
        console.log(args);
        const { width, height}= args.rect;
        const {dataValue,table,row} =args;
        const elements=[];
        let top=30;
        const left=15;
        let maxWidth=0;

        elements.push({
            type: 'rect',
            fill: '#4991e3',
            x: left+20,
            y: top-15,
            width: row===1?160:180,
            height:28
          });
          elements.push({
            type: 'text',
            fill: 'white',
            fontSize: 20,
            fontWeight: 500, 
            textBaseline: 'middle',
            text: row===1? '重要不紧急':'不重要不紧急',
            x: left+50,
            y: top,
          });
        dataValue.forEach((
          item,i
        )=>{
          top+=35;
          elements.push({
            type: 'rect',
            stroke: '#000',
            fill: 'blue',
            x: left-3,
            y: top-3,
            width: 6,
            height: 6,
          });
          
          elements.push({
            type: 'text',
            color: 'blue',
            font: '14px sans-serif',
            textBaseline: 'middle',
            text: item,
            x: left+6,
            y: top,
          });
          maxWidth=Math.max(maxWidth, table.measureText(item,{fontSize:"15",}).width);
        })
        return {
          elements,
          expectedHeight:top+20,
          expectedWidth: 300,
        }
      }
    }, 
    ],
    records:[
      {
        'type':'重要',
        "urgency": ['危机','迫切问题','在限定时间内容必须完成的任务'],
        "not_urgency": ['预防性措施','发展关系','明确新的发展机会','制定长期目标'],
      },
      {
        'type':'不重要',
        "urgency": ['接待访客','某些电话、报告，信件等','迫切需要解决的事务','公共活动'],
        "not_urgency": ['琐碎忙碌的工作','某些信件','某些电话','消磨时间的活动','某些令人愉悦的活动'],
      },
    ],
    defaultRowHeight:80,
    autoRowHeight:true,
    widthMode:'standard',
    autoWrapText:true,
  };
  
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
```

## 相关教程

[性能优化](link)
