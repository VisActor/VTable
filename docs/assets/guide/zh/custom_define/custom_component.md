# 自定义交互组件

自定义渲染和自定义布局中的自定义图元，可以使用`VRender`提供的组件，目前支持的有以下组件：

## TextAutoPoptip

`TextAutoPoptip`组件是`VRender`提供的一个交互组件，它的功能是在文本过长被省略时，hover到文本上，会自动弹出一个poptip，展示文本的全部内容。

``` javascript livedemo  template=vtable
// only use for website
const {createGroup, createText} = VRender;
// use this for project
// import {createGroup, createText} from '@visactor/vtable/es/vrender';

  const option = {
    columns:[
      {
        field: 'type',
        title:'',
        width:170,
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
        title:'urgency',
        width:400,
        headerStyle:{
          lineHeight:50,
          fontSize:26,
          fontWeight:600,
          bgColor:'#4991e3',
          color:'white',
          textAlign:'center'
        },
      customLayout(args){
        const { width, height}= args.rect;
        const {dataValue,table,row } =args;
        const elements=[];
        let top=30;
        const left=15;

        const container = createGroup({
          height,
          width,
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'space-around',
        });

        const text = createText({
          fill: '#000',
          fontSize: 20,
          fontWeight: 500, 
          textBaseline: 'top',
          text: row===1? 'important but not urgency':'not important and not urgency',

          maxLineWidth: 200,
          pickable: true
        });

        container.add(text);
        
        return {
          rootContainer: container,
        }
      }
    },
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
      customRender(args){
        console.log(args);
        const { width, height}= args.rect;
        const {dataValue,table,row} =args;
        const elements=[];
        let top=30;
        const left=15;
        let maxWidth=0;

        elements.push({
          type: 'text',
          fill: '#000',
          fontSize: 20,
          fontWeight: 500, 
          textBaseline: 'middle',
          text: row===1? 'important but not urgency':'not important and not urgency',
          x: left+50,
          y: top-5,

          maxLineWidth: 200,
          pickable: true
        });
        
        return {
          elements,
          expectedHeight:top+20,
          expectedWidth: 100,
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
    theme: VTable.themes.DEFAULT.extends({
      textPopTipStyle: {
        // title: 'title'
      }
    })
  };

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```

使用`TextAutoPoptip`组件需要把相应的`text`图元配置`pickable: true`，开启交互，此时`TextAutoPoptip`组件在`text`图元被`maxLineWidth`属性省略时自动启动。如果想禁用组件保留交互，需要在`text`图元上配置`disableAutoClipedPoptip`属性为`true`。

`TextAutoPoptip`组件弹出的`poptip`样式，可以在`theme.textPopTipStyle`中配置，部分常用属性如下：

| Name | Type | Description |
| :-----| :---- | :---- |
|position|'auto' \| 'top' \| 'tl' \| 'tr' \| 'bottom' \| 'bl' \| 'br' \| 'left' \| 'lt' \| 'lb' \| 'right' \| 'rt' \| 'rb'|`poptip`显示在相对于图元的位置|
|title|string \| string[] \| number \| number[]|`poptip`中`title`内容|
|titleStyle|Partial\<ITextGraphicAttribute\>|`poptip`中`title`内容的样式|
|titleFormatMethod|(t: string \| string[] \| number \| number[]) => string \| string[] \| number \| number[]|`poptip`中`title`内容的format方法|
|content|string \| string[] \| number \| number[]|`poptip`中`content`内容，默认是完整字符串|
|contentStyle|Partial<ITextGraphicAttribute>|`poptip`中`content`内容的样式|
|contentFormatMethod|(t: string \| string[] \| number \| number[]) => string \| string[] \| number \| number[]|`poptip`中`content`内容的format方法|
|space|number|`title`和`content`距离|
|padding|Padding|`poptip`中的padding|
|panel|BackgroundAttributes & ISymbolGraphicAttribute & {space?:number;}|`poptip`中的背景样式|
|minWidth|number|`poptip`中的最大宽度|
|maxWidth|number|`poptip`中的最小宽度|
|maxWidthPercent|number|`poptip`中的最大宽度百分比|
|visible|boolean|`poptip`是否可见|
|visibleFunc|(graphic: IGraphic) => boolean|`poptip`是否可见函数|
|dx|number|`poptip`x方向偏移|
|dy|number|`poptip`y方向偏移|

<!-- |state|StateStyle|discription| -->