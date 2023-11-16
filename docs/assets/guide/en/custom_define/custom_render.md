# Custom rendering

In the field of data analytics, in order to display data more intuitively, we often use charts or grids to render. In some specific scenarios, we want to add a more expressive and personalized display effect to some cells of the table. At this time, the custom rendering function of table cell content is particularly important. Through cell content custom rendering, we can achieve the following types of scene requirements:

1.  Rich Text Display. Display text with multiple styles and arrangements within cells for users to quickly access key information.

2.  Mixed graphics. Display pictures or icons based on data in cells to make data more intuitive.

3.  Display data graphically. Display data graphically, such as circles, rectangles, etc., making data comparison and analysis more intuitive.

4.  Cell custom typography layout. Arrange custom render elements arbitrarily within cells to achieve special layout requirements.

In the VTable library, we can define`表格单元格内容自定义渲染`To achieve the above scenario requirements. Because it is more flexible, it can be customized and displayed according to business data, but the cost for the access party is also large, and it is necessary to calculate the location by itself.(While drawing custom content, default content is allowed to be drawn according to the internal logic of VTable. Please set renderDefault to true.)

## Case study

We will take the realization of the effect of the following figure as an example to explain the implementation process.
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/364e85f0a2e6efbc39057a002.png)

### Prepare data:

There are two rows in the body data cell part of the table above, which correspond to the two data in our records.

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
        ]

### content teardown

Analyze the display content composition of each cell:

*   title
*   list of matters
*   Title background rectangle
*   List symbols (circles, rectangles, stars)

So here we need to use a variety of custom primitive:

*   Title corresponding to use [Text](../../option/ListTable#customRender.elements.text.type)type
*   Item list text part use [Text](../../option/ListTable#customRender.elements.text.type)
*   Title background rectangle to use [Rect](../../option/ListTable#customRender.elements.rect.type)primitive
*   List symbols (circles, rectangles, stars) correspond respectively [Circle](../../option/ListTable#customRender.elements.circle.type), [Rect](../../option/ListTable#customRender.elements.rect.type), [icon](../../option/ListTable#customRender.elements.icon.type)type

### How to use the custom rendering interface

In VTable, we can define custom rendering in two ways:

*   `customRender` Globally set custom rendering, if the layout of each column is basically the same, it is recommended to use the global method;
*   `columns.customRender` Set custom rendering by column. If the layout of each column is different, it is recommended to configure each column separately;

Configuration content supports two forms:

*   object form
*   functional form

For specific parameter descriptions, please refer to the API description.[customRender](http://10.3.213.155:3011/zh/option.html#ListTable.customRender)

As can be seen from the above example renderings`紧急`and`不紧急`The layout of the two columns is the same, so I use the global setting here.

```javascript livedemo
const option = {
    container: document.getElementById(CONTAINER_ID),
    columns:[
      {
        field: 'type',
        title:'',
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
        title:'紧急',
        width:'300',
        headerStyle:{
          lineHeight:50,
          fontSize:26,
          fontWeight:600,
          bgColor:'#4991e3',
          color:'white',
          textAlign:'center'
        },
      
    },
    {
      field: 'not_urgency',
      title:'不紧急',
      width:'260',
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
    customRender(args){
        if(args.row===0||args.col===0) return null;
        console.log(args);
        const { width, height}= args.rect;
        const {dataValue,table,row,col } =args;
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
            baseline: 'top',
            text:col===1?( row===1? '重要且紧急':'不重要但紧急'):(row===1? '重要不紧急':'不重要不紧急'),
            x: left+50,
            y: top,
          });
        dataValue.forEach((
          item,i
        )=>{
          top+=35;
          if(col==1){
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
          }
          else{
            elements.push({
            type: 'rect',
            stroke: '#000',
            fill: 'blue',
            x: left-3,
            y: top-3,
            width: 6,
            height: 6,
          });
          }
          elements.push({
            type: 'text',
            color: 'blue',
            font: '14px sans-serif',
            baseline: 'top',
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
  };
  
const tableInstance = new VTable.ListTable(option);
```
