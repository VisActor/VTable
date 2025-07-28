# пользовательский interactive компонентs

пользовательский primitives в пользовательский rendering и пользовательский макет can use the компонентs provided по `VRender`. Currently, Следующий компонентs are supported:

## TextавтоPoptip

The `TextавтоPoptip` компонент is an interactive компонент provided по `VRender`. Its функция is that when the текст is too long и is omitted, навести over the текст и a poptip will автоmatically pop up к display the entire content из the текст.

``` javascript liveдемонстрация  template=vтаблица
// only use для website
const {createGroup, createText} = VRender;
// use this для project
// import {createGroup, createText} от '@visactor/vтаблица/es/vrender';

  const option = {
    columns:[
      {
        поле: 'тип',
        заголовок:'',
        ширина:170,
        headerStyle:{
          bgColor:'#4991e3'
        },
        style:{
          fontFamily:'Arial',
          fontWeight:600,
          bgColor:'#4991e3',
          fontSize:26,
          заполнение:20,
          lineвысота:32,
          цвет:'white'
        },
      }, 
      {
        поле: 'urgency',
        заголовок:'urgency',
        ширина:400,
        headerStyle:{
          lineвысота:50,
          fontSize:26,
          fontWeight:600,
          bgColor:'#4991e3',
          цвет:'white',
          textAlign:'центр'
        },
      пользовательскиймакет(args){
        const { ширина, высота}= args.rect;
        const {данныеValue,таблица,row } =args;
        const elements=[];
        let верх=30;
        const лево=15;

        const container = createGroup({
          высота,
          ширина,
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'центр',
          alignItems: 'центр',
          justifyContent: 'space-around',
        });

        const текст = createText({
          fill: '#000',
          fontSize: 20,
          fontWeight: 500, 
          textBaseline: 'верх',
          текст: row===1? 'important but не urgency':'не important и не urgency',

          maxLineширина: 200,
          pickable: true
        });

        container.add(текст);
        
        возврат {
          rootContainer: container,
        }
      }
    },
    {
      поле: 'not_urgency',
      заголовок:'не urgency',
      ширина:400,
      headerStyle:{
          lineвысота:50,
          bgColor:'#4991e3',
          цвет:'white',
          textAlign:'центр',
          fontSize:26,
          fontWeight:600,
      },
      style:{
        fontFamily:'Arial',
        fontSize:12,
        fontWeight:'bold'
      },
      пользовательскийRender(args){
        console.log(args);
        const { ширина, высота}= args.rect;
        const {данныеValue,таблица,row} =args;
        const elements=[];
        let верх=30;
        const лево=15;
        let maxширина=0;

        elements.push({
          тип: 'текст',
          fill: '#000',
          fontSize: 20,
          fontWeight: 500, 
          textBaseline: 'середина',
          текст: row===1? 'important but не urgency':'не important и не urgency',
          x: лево+50,
          y: верх-5,

          maxLineширина: 200,
          pickable: true
        });
        
        возврат {
          elements,
          expectedвысота:верх+20,
          expectedширина: 100,
        }
      }
    }, 
    ],
    records:[
      {
        'тип': 'important',
        "urgency": ['crisis','urgent problem','tasks that must be completed within a limited time'],
        "not_urgency": ['prсобытиеive measures','development relationship','identify новый development opportunities','establish long-term goals'],
      },
      {
        'тип': 'не\nimportant',
        "urgency": ['Receive visitors','Certain calls, reports, letters, etc','Urgent matters','Public activities'],
        "not_urgency": ['Trivial busy work','некоторые letters','некоторые phone calls','Time-killing activities','некоторые pleasant activities'],
      },
    ],
    defaultRowвысота:80,
    высотаMode:'автовысота',
    ширинаMode:'standard',
    автоWrapText:true,
    тема: Vтаблица.темаs.по умолчанию.extends({
      textPopTipStyle: {
        // заголовок: 'title'
      }
    })
  };

const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
```

к use the `TextавтоPoptip` компонент, you need к configure the corresponding `текст` primitive с `pickable: true` к включить interaction. в this time, the `TextавтоPoptip` компонент will автоmatically начало when the `текст` primitive is omitted по the `maxLineширина` attribute. If you want к отключить компонент retention interaction, you need к configure the `disableавтоClipedPoptip` attribute на the `текст` primitive к `true`.

The `poptip` style popped up по the `TextавтоPoptip` компонент can be configured в `тема.textPopTipStyle`. некоторые common свойства are as follows:

| имя | тип | Description |
| :-----| :---- | :---- |
|позиция|'авто' \| 'верх' \| 'tl' \| 'tr' \| 'низ' \| 'bl' \| 'br' \| 'лево' \| 'lt' \| 'lb ' \| 'право' \| 'rt' \| 'rb'|`poptip` is displayed relative к the позиция из the primitive|
|title|строка \| строка[] \| число \| число[]|The content из `title` в `poptip`|
|titleStyle|Partial\<ITextGraphicAttribute\>|The style из the `title` content в `poptip`|
|titleFormatMethod|(t: строка \| строка[] \| число \| число[]) => строка \| строка[] \| число \| число[]|format method для `title` content в `poptip`|
|content|строка \| строка[] \| число \| число[]|The content из `content` в `poptip`, the по умолчанию is the complete строка|
|contentStyle|Partial<ITextGraphicAttribute>|The style из the `content` content в `poptip`|
|contentFormatMethod|(t: строка \| строка[] \| число \| число[]) => строка \| строка[] \| число \| число[]|The format method из `content` в `poptip`|
|space|число|Distance between `title` и `content`|
|заполнение|заполнение|заполнение в `poptip`|
|panel|BackgroundAttributes & ISymbolGraphicAttribute & {space?:число;}|фон style в `poptip`|
|minширина|число|Maximum ширина в `poptip`|
|maxширина|число|The minimum ширина в `poptip`|
|maxширинаPercent|число|Maximum ширина percentвозраст в `poptip`|
|видимый|логический|whether `poptip` is видимый|
|visibleFunc|(graphic: IGraphic) => логический|whether `poptip` is видимый функция|
|dx|число|`poptip`x-direction offset|
|dy|число|`poptip`y direction offset|

<!-- |state|StateStyle|discription| -->