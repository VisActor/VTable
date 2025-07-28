# Custom interactive components

Custom primitives in custom rendering and custom layout can use the components provided by `VRender`. Currently, the following components are supported:

## TextAutoPoptip

The `TextAutoPoptip` component is an interactive component provided by `VRender`. Its function is that when the text is too long and is omitted, hover over the text and a poptip will automatically pop up to display the entire content of the text.

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

To use the `TextAutoPoptip` component, you need to configure the corresponding `text` primitive with `pickable: true` to enable interaction. At this time, the `TextAutoPoptip` component will automatically start when the `text` primitive is omitted by the `maxLineWidth` attribute. If you want to disable component retention interaction, you need to configure the `disableAutoClipedPoptip` attribute on the `text` primitive to `true`.

The `poptip` style popped up by the `TextAutoPoptip` component can be configured in `theme.textPopTipStyle`. Some common properties are as follows:

| Name | Type | Description |
| :-----| :---- | :---- |
|position|'auto' \| 'top' \| 'tl' \| 'tr' \| 'bottom' \| 'bl' \| 'br' \| 'left' \| 'lt' \| 'lb ' \| 'right' \| 'rt' \| 'rb'|`poptip` is displayed relative to the position of the primitive|
|title|string \| string[] \| number \| number[]|The content of `title` in `poptip`|
|titleStyle|Partial\<ITextGraphicAttribute\>|The style of the `title` content in `poptip`|
|titleFormatMethod|(t: string \| string[] \| number \| number[]) => string \| string[] \| number \| number[]|format method for `title` content in `poptip`|
|content|string \| string[] \| number \| number[]|The content of `content` in `poptip`, the default is the complete string|
|contentStyle|Partial<ITextGraphicAttribute>|The style of the `content` content in `poptip`|
|contentFormatMethod|(t: string \| string[] \| number \| number[]) => string \| string[] \| number \| number[]|The format method of `content` in `poptip`|
|space|number|Distance between `title` and `content`|
|padding|Padding|padding in `poptip`|
|panel|BackgroundAttributes & ISymbolGraphicAttribute & {space?:number;}|Background style in `poptip`|
|minWidth|number|Maximum width in `poptip`|
|maxWidth|number|The minimum width in `poptip`|
|maxWidthPercent|number|Maximum width percentage in `poptip`|
|visible|boolean|whether `poptip` is visible|
|visibleFunc|(graphic: IGraphic) => boolean|whether `poptip` is visible function|
|dx|number|`poptip`x-direction offset|
|dy|number|`poptip`y direction offset|

<!-- |state|StateStyle|discription| -->