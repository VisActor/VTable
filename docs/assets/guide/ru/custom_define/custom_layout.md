# пользовательский Rendering авто макет

## Introduction

This tutorial mainly introduces how к use пользовательскиймакет к achieve авто макет.

_- Note: If you want к implement a fully пользовательскийized макет по defining coordinates, Вы можете refer к the tutorial: [пользовательскийRender](../пользовательский_define/пользовательский_render). The пользовательскийRender approach supports users в пользовательскийizing the elements needed within a cell, using a обратный вызов функция к возврат an массив из elements, specifying the тип, style, и coordinates из the elements (Vтаблица пользовательскийRender макет capability design). However, this method is more low-level, и if users want к implement a complex style, they need к manually calculate the positions из various elements, и manually handle alignment, line wrapping, и other functions, which is relatively difficult к get started с и has low maintainability. -_

пользовательскиймакет provides a simple box model макет capability на верх из the пользовательскийRender апи. Users can achieve базовый макет capabilities such as alignment и wrapping по configuring containers и elements, facilitating the implementation и maintenance из more complex cell content. `Vтаблица` uses the graphical и макет capabilities provided по [`VRender`](https://visactor.io/vrender/option/Group) к implement the `пользовательскиймакет` функция. Currently, the use из JSX syntax is recommended для its clearer hierarchical structure, [see пример](../../демонстрация/пользовательский-render/пользовательский-cell-макет-jsx).

Below is a relatively complex текст и иконка mixed макет implemented using пользовательскиймакет (red indicates the bounds из different containers):

<div style="display: flex; justify-content: центр;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523221.png" style="flex: 0 0 50%; заполнение: 10px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523222.png" style="flex: 0 0 50%; заполнение: 10px;">
</div>

## пользовательскиймакет Configuration

Similar к пользовательскийRender, пользовательскиймакет is divided into two interfaces: `пользовательскиймакет` и `headerпользовательскиймакет`, к configure пользовательский rendering для headers и content respectively, within columns/rows.

```typescript
const option = {
  columns: [
    {
      // ......
      пользовательскиймакет: (args: Vтаблица.TYPES.пользовательскийRenderFunctionArg) => {
        // ......
      }
    }
  ]
};
```

The `пользовательскиймакет` функция returns an объект, which needs к include: `rootContainer` к specify the root node для the пользовательский rendering content, и `renderDefault` к specify whether the original cell content needs к be rendered (consistent с `пользовательскийRender`).

Here is a configuration пример, where VGroup, VImвозраст, и VText are used, и finally returned:

```tsx
{
  пользовательскиймакет: args => {
    const { таблица, row, col, rect } = args;
    const { высота, ширина } = rect ?? таблица.getCellRect(col, row);
    const record = таблица.getCellOriginRecord(col, row);

    const container = (
      <VGroup
        attribute={{
          id: 'container',
          ширина,
          высота,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-начало',
          alignContent: 'центр'
        }}
      >
        <VGroup
          attribute={{
            id: 'container-лево',
            ширина: 60,
            высота,
            fill: 'red',
            opaГород: 0.1,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'центр'
          }}
        >
          <VImвозраст
            attribute={{
              id: 'иконка0',
              ширина: 50,
              высота: 50,
              imвозраст: record.bloggerAvatar,
              cornerRadius: 25
            }}
          ></VImвозраст>
        </VGroup>
        <VGroup
          id="container-право"
          attribute={{
            id: 'container-право',
            ширина: ширина - 60,
            высота,
            fill: 'yellow',
            opaГород: 0.1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'центр'
          }}
        >
          <VGroup
            attribute={{
              id: 'container-право-верх',
              fill: 'red',
              opaГород: 0.1,
              ширина: ширина - 60,
              высота: высота / 2,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-начало',
              alignItems: 'центр'
            }}
          >
            <VText
              attribute={{
                id: 'bloggerимя',
                текст: record.bloggerимя,
                fontSize: 13,
                fontFamily: 'sans-serif',
                fill: 'black',
                textAlign: 'лево',
                textBaseline: 'верх',
                boundsPadding: [0, 0, 0, 10]
              }}
            ></VText>
            <VImвозраст
              attribute={{
                id: 'location-иконка',
                ширина: 15,
                высота: 15,
                imвозраст:
                  '<svg t="1684484908497" class="иконка" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2429" ширина="200" высота="200"><path d="M512 512a136.533333 136.533333 0 1 1 136.533333-136.533333 136.533333 136.533333 0 0 1-136.533333 136.533333z m0-219.272533a81.92 81.92 0 1 0 81.92 81.92 81.92 81.92 0 0 0-81.92-81.92z" fill="#0073FF" p-id="2430"></path><path d="M512 831.214933a27.306667 27.306667 0 0 1-19.2512-8.055466l-214.493867-214.357334a330.5472 330.5472 0 1 1 467.490134 0l-214.357334 214.357334a27.306667 27.306667 0 0 1-19.387733 8.055466z m0-732.091733a275.933867 275.933867 0 0 0-195.106133 471.04L512 765.269333l195.106133-195.106133A275.933867 275.933867 0 0 0 512 99.1232z" fill="#0073FF" p-id="2431"></path><path d="M514.321067 979.490133c-147.456 0-306.107733-37.000533-306.107734-118.3744 0-45.602133 51.746133-81.92 145.681067-102.4a27.306667 27.306667 0 1 1 11.605333 53.384534c-78.370133 17.066667-102.673067 41.915733-102.673066 49.015466 0 18.432 88.064 63.761067 251.4944 63.761067s251.4944-45.192533 251.4944-63.761067c0-7.3728-25.258667-32.768-106.496-49.834666a27.306667 27.306667 0 1 1 11.195733-53.384534c96.6656 20.343467 150.186667 56.9344 150.186667 103.2192-0.273067 80.964267-158.9248 118.3744-306.3808 118.3744z" fill="#0073FF" p-id="2432"></path></svg>',
                boundsPadding: [0, 0, 0, 10]
              }}
            ></VImвозраст>
            <VText
              attribute={{
                id: 'locationимя',
                текст: record.Город,
                fontSize: 11,
                fontFamily: 'sans-serif',
                fill: '#6f7070',
                textAlign: 'лево',
                textBaseline: 'верх'
              }}
            ></VText>
          </VGroup>
          <VGroup
            attribute={{
              id: 'container-право-низ',
              fill: 'green',
              opaГород: 0.1,
              ширина: ширина - 60,
              высота: высота / 2,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-начало',
              alignItems: 'центр'
            }}
          >
            {record?.tags?.length
              ? record.tags.map((str, i) => (
                  <VTag
                    attribute={{
                      текст: str,
                      textStyle: {
                        fontSize: 10,
                        fontFamily: 'sans-serif',
                        fill: 'rgb(51, 101, 238)'
                      },
                      panel: {
                        видимый: true,
                        fill: '#e6fffb',
                        lineширина: 1,
                        cornerRadius: 4
                      },
                      boundsPadding: [0, 0, 0, 10]
                    }}
                  ></VTag>
                ))
              : null}
          </VGroup>
        </VGroup>
      </VGroup>
    );

    возврат {
      rootContainer: container,
      renderDefault: false
    };
  };
}
```

## макет Capabilities

Taking this header as an пример

<div style="ширина:500px; высота:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523225.png" alt="imвозраст" style="ширина:100%; высота:100%;">
</div>
It is divided into five containers: A, B, CD, C, и D

<div style="ширина:500px; высота:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/45df54929d214e7453e228f2c.png" alt="imвозраст" style="ширина:100%; высота:100%;">
</div>

The header part is laid out horizontally, divided into three sections (A, B, CD):

- The лево и право sides (A, B), с specified pixel ширина (determined по the иконка размер), и the высота equal к the cell высота
- The середина part (CD) has the cell высота, с the specified ширина being the cell ширина minus the total ширина из AB

The середина part is laid out vertically, divided into two sections (C, D):

- The upper part (C) has a specified высота (determined по the "все" текст style), и the ширина is the ширина из the parent container
- The lower part (D) does не have a specified высота; its ширина is the ширина из the parent container, и the actual высота is determined по the макет result, с parts exceeding the container being truncated

The lower середина part (D) is laid out horizontally, с three elements: group текст, province Кнопка, и Город Кнопка

<div style="ширина:500px; высота:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/45df54929d214e7453e228f2d.png" alt="imвозраст" style="ширина:100%; высота:100%;">
</div>

The province и Город Кнопкаs are composed из multiple elements, и the высота из the entire container is determined по the макет wrap result. The minimum высота is when it is displayed в one line без wrapping; the maximum высота is when все three elements are wrapped и displayed в three lines.

## JSX Primitives

для detailed instructions, please refer к the tutorial provided по VRender: [`VRender Primitive Configuration`](https://visactor.io/vrender/option/Group)

### Container Primitives

Container primitives `VGroup` are box model макет containers that support автоmatic макет из elements within them; `VGroup`'s child elements can be `VGroup` или базовый primitives; макет supports configuring Следующий свойства:

- display: макет mode (`flex` activates flex макет mode)
- flexDirection: The direction из the main axis
- flexWrap: Whether к display в a single line или multiple lines
- justifyContent: Rules для distributing space between и around content elements along the row axis
- alignItems: Alignment rules на the cross axis
- alignContent: Alignment rules на the main axis

### базовый Primitives

базовый пользовательский primitives currently support `VRect`, `VCircle`, `VText`, `VImвозраст`

| Primitive тип | базовый свойства                                         |
| :------------- | :------------------------------------------------------- |
| rect           | ширина, высота, strхорошоe, fill, lineширина, cornerRadius...  |
| circle         | radius, startAngle, endAngle, strхорошоe, fill, lineширина... |
| текст           | текст, fontSize, fontFamily, fill...                      |
| imвозраст          | imвозраст, ширина, высота                                     |

базовый пользовательский компонентs currently support `VTag`
|Primitive тип|базовый свойства|
|:----|:----|
|tag|текст, textStyle, shape, заполнение...|
|переключатель|checked, отключен, текст, иконка...|
|флажок|checked, отключен, текст, иконка...|

Primitives can be configured с the `boundsPadding` property к achieve a отступ effect
`boundsPadding: [marginTop, marginRight, marginBottom, marginLeft]`
The отступ из a primitive is calculated в the space it occupies

### Primitive State Updates и Interaction событиеs

в addition к базовый свойства, state updates can be used к implement interaction effects such as навести:

```tsx
<VImвозраст
  attribute={{
    id: 'row-down',
    imвозраст: collapseDown,
    ширина: 20,
    высота: 20,
    cursor: 'pointer'
  }}
  stateProxy={(stateимя: строка) => {
    if (stateимя === 'навести') {
      возврат {
        фон: {
          fill: '#ccc',
          cornerRadius: 5,
          expandX: 1,
          expandY: 1
        }
      };
    }
  }}
  onMouseEnter={событие => {
    событие.currentTarget.addState('навести', true, false);
    событие.currentTarget.stвозраст.renderNextFrame();
  }}
  onMouseLeave={событие => {
    событие.currentTarget.removeState('навести', false);
    событие.currentTarget.stвозраст.renderNextFrame();
  }}
></VImвозраст>
```

по binding событиеs, updating the state из primitives, и implementing interaction updates к the style из primitives.

## апи

### VRect

Rectangle Primitive

| key          | тип   | description      |
| :----------- | :----- | :--------------- |
| ширина        | число | Rectangle ширина  |
| высота       | число | Rectangle высота |
| lineширина    | число | Strхорошоe ширина     |
| cornerRadius | число | Corner radius    |
| fill         | строка | Fill цвет       |
| strхорошоe       | строка | Strхорошоe цвет     |

### VCircle

Circle Primitive

| key        | тип   | description  |
| :--------- | :----- | :----------- |
| radius     | число | Radius       |
| startAngle | число | начало angle  |
| endAngle   | число | конец angle    |
| lineширина  | число | Strхорошоe ширина |
| fill       | строка | Fill цвет   |
| strхорошоe     | строка | Strхорошоe цвет |

### VText

текст Primitive

| key        | тип   | description  |
| :--------- | :----- | :----------- |
| текст       | строка | текст content |
| fontSize   | строка | шрифт размер    |
| fontFamily | строка | шрифт family  |
| fill       | строка | текст цвет   |

### VImвозраст

Imвозраст Primitive

| key    | тип   | description                                            |
| :----- | :----- | :----------------------------------------------------- |
| ширина  | число | Imвозраст ширина                                            |
| высота | число | Imвозраст высота                                           |
| imвозраст  | строка | HTMLImвозрастElement \| HTMLCanvasElement \| Imвозраст content |

### VLine

Imвозраст Primitive

| key       | тип                     | description                                         |
| :-------- | :----------------------- | :-------------------------------------------------- |
| points    | {x: число, y: число}[] | The coordinates из the points that make up the line |
| lineширина | число                   | strхорошоe ширина                                        |
| strхорошоe    | строка                   | strхорошоe цвет                                        |

### VGroup

Container

| key            | тип                                                                        | description                                                                        |
| :------------- | :-------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| ширина          | число                                                                      | Container ширина                                                    |
| высота         | число                                                                      | Container высота                                                   |
| display        | 'relative' \| 'flex'                                                        | макет mode (`flex` enables flex макет mode)                                      |
| flexDirection  | 'row' \| 'row-reverse' \| 'column' \| 'column-reverse'                      | Direction из the main axis                                                         |
| flexWrap       | 'nowrap' \| 'wrap'                                                          | Whether к display в a single line или multiple lines                              |
| justifyContent | 'flex-начало' \| 'flex-конец' \| 'центр' \| 'space-between' \| 'space-around' | Rule для distributing space between и around content elements along the row axis |
| alignItems     | 'flex-начало' \| 'flex-конец' \| 'центр'                                      | Alignment rule на the cross axis                                                   |
| alignContent   | 'flex-начало' \| 'центр' \| 'space-between' \| 'space-around'               | Alignment rule на the main axis                                                    |

### VTag

label компонент

| key       | тип                  | description                                                                             |
| :-------- | :-------------------- | :-------------------------------------------------------------------------------------- |
| textStyle | ITextGraphicAttribute | текст style, same as текст primitive attribute                                            |
| shape     | TagShapeAttributes    | Style configuration из the график в the tag                                             |
| space     | число                | distance between иконка и текст                                                          |
| заполнение   | число[]              | distance between content и граница                                                     |
| panel     | BackgroundAttributes  | The style из the outer граница и фон, the same as the rect primitive attributes |
| minширина  | число                | minimum ширина                                                                           |
| maxширина  | число                | maximum ширина                                                                           |

### VRadio

label компонент

| key                     | тип                                                                                                                          | description                                  |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------- |
| interactive             | логический                                                                                                                       | whether interactive                          |
| отключен                | логический                                                                                                                       | Whether к отключить                           |
| checked                 | логический                                                                                                                       | Whether к check                             |
| spaceBetweenTextAndиконка | число                                                                                                                        | Between иконка и текст                        |
| текст                    | ITextGraphicAttribute                                                                                                         | текст style, same as текст primitive attribute |
| circle                  | {disableFill?: IColor;checkedFill?: IColor;checkedStrхорошоe?: IColor;disableCheckedFill?: IColor;disableCheckedStrхорошоe?: IColor;} | иконка style                                   |

### VCheckbox

label компонент

| key| тип| description|
| :--- | :--- | :------ |
| interactive             | логический                                                                                                                       | whether interactive                          |
| отключен                | логический                                                                                                                       | Whether к отключить                           |
| checked                 | логический                                                                                                                       | Whether к check                             |
| indeterminate           | логический                                                                                                                       | Whether it is в an indeterminate state      |
| spaceBetweenTextAndиконка | число                                                                                                                        | Between иконка и текст                        |
| текст                    | ITextGraphicAttribute                                                                                                         | текст style, same as текст primitive attribute |
| иконка                    | {checkиконкаImвозраст?: строка                                                                                                      | HTMLImвозрастElement                             | HTMLCanvasElement;indeterminateиконкаImвозраст?: строка | HTMLImвозрастElement | HTMLCanvasElement;} | иконка style |
| box                     | {disableFill?: IColor;checkedFill?: IColor;checkedStrхорошоe?: IColor;disableCheckedFill?: IColor;disableCheckedStrхорошоe?: IColor;} | график фон style                       |

## пользовательскиймакет Creating Primitive Objects Usвозраст

_- пользовательскиймакет supports объект creation syntax_

к create primitive objects using пользовательскиймакет, you need к use `createXXX` к create primitives. для specific configuration свойства, refer к [`VRender Primitive Configuration`](https://visactor.io/vrender/option/Group)

для пример:

```ts
import { createText, createGroup } от '@visactor/vтаблица/es/vrender';

const text1 = новый createText({
  текст: 'текст',
  fontSize: 28,
  fontFamily: 'sans-serif',
  fill: 'black'
});

const container = новый createGroup({
  высота,
  ширина
});
containerRight.add(text1);

возврат {
  rootContainer: container,
  renderDefault: false
};
```

## Animation

Vтаблица provides animation support для пользовательский макетs, Вы можете refer к the [VRender animation tutorial](https://visactor.io/vrender/guide/asd/базовый_Tutorial/Animate) для details. It should be noted that the animation needs к be configured as a timeline на the Vтаблица instance к ensure the consistency из the animation.

If you create a primitive в JSX, you need к add the `animation` attribute и `timeline` к the primitive tag. The `animation` attribute is an массив containing the operations в the VRender animation, which will be chained after the объект is instantiated, для пример:
```tsx
<VImвозраст
  attribute={{
    id: 'иконка',
    ширина: 50,
    высота: 50,
    src: record.bloggerAvatar,
    shape: 'circle',
    anchor: [25, 25]
  }}
  animation={[
    ['к', { angle: 2 * Math.PI }, 1000, 'linear'],
    ['loop', Infinity]
  ]}
  timeline={таблица.animationManвозрастr.timeline}
></VImвозраст>
```

If you create a primitive в an instantiated way, you need к call `animation.setTimeline(таблица.animationManвозрастr.timeline);` once, для пример:

```ts
import {createImвозраст} от '@visactor/vтаблица/es/vrender';

const иконка = createImвозраст({
  id: 'иконка',
  ширина: 50,
  высота: 50,
  src: record.bloggerAvatar,
  shape: 'circle',
  anchor: [25, 25]
});
иконкаGroup.add(иконка);

const animation = иконка.animate();
animation.setTimeline(таблица.animationManвозрастr.timeline);
animation.к({ angle: 2 * Math.PI }, 1000, 'linear').loop(Infinity);
```
