# Custom Layout

## Introduction

VTable CustomRender supports user-defined cells that need to render the required elements. When used, return an array of elements through the callback function, and specify the type, style and coordinates of the elements (VTable CustomRender layout capability design)

The current use method is relatively low-level. If the user wants to implement a complex style, he needs to manually calculate the position of each element, and manually handle functions such as alignment and line wrapping. It is difficult to get started and has low maintainability

Through CustomLayout, a set of simple box model layout capabilities is provided on the basis of the CustomRender API. Users can configure containers and elements to achieve basic layout capabilities such as alignment and line wrapping, which is convenient for realizing and maintaining more complex cell content
Here is a relatively complex mixed layout of text icons, implemented using CustomLayout (red for different container bounds):

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523221.png" style="flex: 0 0 50%; padding: 10px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523222.png" style="flex: 0 0 50%; padding: 10px;">
</div>
CustomLayout implementation code is as follows:

```tsx
{
  customLayout: (args) => {
    const { table, row, col, rect } = args;
    const { height, width } = rect ?? table.getCellRect(col, row);
    const record = table.getRecordByCell(col, row);

    const container = (
      <VGroup
        attribute={{
          id: 'container',
          width,
          height,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          alignContent: 'center'
        }}
      >
        <VGroup
          attribute={{
            id: 'container-left',
            width: 60,
            height,
            fill: 'red',
            opacity: 0.1,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <VImage
            attribute={{
              id: 'icon0',
              width: 50,
              height: 50,
              image: record.bloggerAvatar,
              cornerRadius: 25
            }}
          ></VImage>
        </VGroup>
        <VGroup
          id="container-right"
          attribute={{
            id: 'container-right',
            width: width - 60,
            height,
            fill: 'yellow',
            opacity: 0.1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <VGroup
            attribute={{
              id: 'container-right-top',
              fill: 'red',
              opacity: 0.1,
              width: width - 60,
              height: height / 2,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <VText
              attribute={{
                id: 'bloggerName',
                text: record.bloggerName,
                fontSize: 13,
                fontFamily: 'sans-serif',
                fill: 'black',
                textAlign: 'left',
                textBaseline: 'top',
                boundsPadding: [0, 0, 0, 10]
              }}
            ></VText>
            <VImage
              attribute={{
                id: 'location-icon',
                width: 15,
                height: 15,
                image:
                  '<svg t="1684484908497" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2429" width="200" height="200"><path d="M512 512a136.533333 136.533333 0 1 1 136.533333-136.533333 136.533333 136.533333 0 0 1-136.533333 136.533333z m0-219.272533a81.92 81.92 0 1 0 81.92 81.92 81.92 81.92 0 0 0-81.92-81.92z" fill="#0073FF" p-id="2430"></path><path d="M512 831.214933a27.306667 27.306667 0 0 1-19.2512-8.055466l-214.493867-214.357334a330.5472 330.5472 0 1 1 467.490134 0l-214.357334 214.357334a27.306667 27.306667 0 0 1-19.387733 8.055466z m0-732.091733a275.933867 275.933867 0 0 0-195.106133 471.04L512 765.269333l195.106133-195.106133A275.933867 275.933867 0 0 0 512 99.1232z" fill="#0073FF" p-id="2431"></path><path d="M514.321067 979.490133c-147.456 0-306.107733-37.000533-306.107734-118.3744 0-45.602133 51.746133-81.92 145.681067-102.4a27.306667 27.306667 0 1 1 11.605333 53.384534c-78.370133 17.066667-102.673067 41.915733-102.673066 49.015466 0 18.432 88.064 63.761067 251.4944 63.761067s251.4944-45.192533 251.4944-63.761067c0-7.3728-25.258667-32.768-106.496-49.834666a27.306667 27.306667 0 1 1 11.195733-53.384534c96.6656 20.343467 150.186667 56.9344 150.186667 103.2192-0.273067 80.964267-158.9248 118.3744-306.3808 118.3744z" fill="#0073FF" p-id="2432"></path></svg>',
                boundsPadding: [0, 0, 0, 10]
              }}
            ></VImage>
            <VText
              attribute={{
                id: 'locationName',
                text: record.city,
                fontSize: 11,
                fontFamily: 'sans-serif',
                fill: '#6f7070',
                textAlign: 'left',
                textBaseline: 'top'
              }}
            ></VText>
          </VGroup>
          <VGroup
            attribute={{
              id: 'container-right-bottom',
              fill: 'green',
              opacity: 0.1,
              width: width - 60,
              height: height / 2,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            {record?.tags?.length
              ? record.tags.map((str, i) => (
                  <VTag
                    attribute={{
                      text: str,
                      textStyle: {
                        fontSize: 10,
                        fontFamily: 'sans-serif',
                        fill: 'rgb(51, 101, 238)'
                      },
                      panel: {
                        visible: true,
                        fill: '#e6fffb',
                        lineWidth: 1,
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

    return {
      rootContainer: container,
      renderDefault: false
    };
  }

}
```

## How to use

Similar to customRender, customLayout is also divided into`customLayout`and`headerCustomLayout`Two interfaces configure custom rendering of table headers and content respectively, configured in columns/rows

```typescript
const option = {
    columns: [
        {
            // ......
            customLayout: (args: VTable.TYPES.CustomRenderFunctionArg) => {
                // ......
            }
        }
    ]
}
```

The customLayout function returns an object, where `rootContainer` is the root node of the custom rendered content, and `renderDefault` is a flag indicating whether the original content of the cell needs to be drawn (consistent with customRender).
`VTable` uses the primitives and layout capabilities provided by `VRender` to implement the `customLayout` function. Currently, it is recommended to use JSX writing method, which has a clearer hierarchical structure. [Reference example](../../demo/custom-render/custom-cell-layout-jsx)

## Layout capability

Take this header as an example

<div style="width:500px; height:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523225.png" alt="image" style="width:100%; height:100%;">
</div>
Divided into five containers A B CD C D

<div style="width:500px; height:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/45df54929d214e7453e228f2c.png" alt="image" style="width:100%; height:100%;">
</div>

The header part is laid out horizontally and is divided into three parts (A B CD):

*   Left and right sides (A B), width pixel specified (determined by icon size), height is cell height
*   Middle Part (CD) Height Cell Height, Specify Width Cell Width - AB Total Width

The middle part is arranged vertically and is divided into two parts (C D):

*   Top (C) Specifies the height (determined by the "All" text style) and the width is the width of the parent container
*   The lower part (D) does not specify the height, the width is the width of the parent container, the actual height is determined by the layout result, and the part exceeding the container is truncated

Lower middle (D) horizontal layout, there are three elements: group text, province button, city button

<div style="width:500px; height:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/45df54929d214e7453e228f2d.png" alt="image" style="width:100%; height:100%;">
</div>

The province button and the city button are composed of multiple elements. The height of the entire container is determined by the layout wrapping result. The minimum height is displayed as one line without wrapping; the maximum height is displayed as three lines for all three elements

## Automatic row height and column width calculation

Use the percentCalc method to specify the container with the percentage width and height. When the table specifies the adaptive width and height, the width and height of the cell that can hold all the content will be automatically calculated according to the width and height of the content. As the actual content width and height of this cell

## JSX Elements

### Basic Elements

Basic custom primitive, currently supports `VRect` `VCircle` `VText` `VImage` 

| Primitive Types | Basic Properties |
|:----|:----|
|rect|width, height, stroke, fill, lineWidth, cornerRadius...|
|circle|radius, startAngle, endAngle, stroke, fill, lineWidth...|
|text|text, fontSize, fontFamily, fill...|
|image|image, width, height |

Basic custom component, currently supports `VTag`
| Primitive Types | Basic Properties |
|:----|:----|
|tag|text, textStyle, shape, padding...|

Background Style
*   Image support to configure background styles
    *   stroke
    *   fill
    *   lineWidth
    *   cornerRadius
    *   expendX
    *   expendY

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a0e.jpg)

Graph elements can be configured with the `boundsPadding` attribute to achieve margin effects.
`boundsPadding: [marginLeft, marginRight, marginTop, marginBottom]`
The margin of the primitive will be calculated in the space occupied by the primitive.

In addition to basic attributes, status updates can be used to achieve interactive effects such as hover:
```tsx
<VImage
    attribute={{
      id: 'row-down',
      image: collapseDown,
      width: 20,
      height: 20,
      cursor: 'pointer'
    }}
    stateProxy={(stateName: string) => {
      if (stateName === 'hover') {
        return {
          background: {
            fill: '#ccc',
            cornerRadius: 5,
            expandX: 1,
            expandY: 1
          }
        };
      }
    }}
    onMouseEnter={event => {
      event.currentTarget.addState('hover', true, false);
      event.currentTarget.stage.renderNextFrame();
    }}
    onMouseLeave={event => {
      event.currentTarget.removeState('hover', false);
      event.currentTarget.stage.renderNextFrame();
    }}
></VImage>
```
By binding events, the status of the primitives is updated to achieve the effect of interactively updating the primitive styles

### Container Elememt

The container primitive `VGroup` is a box model layout container that supports automatic layout of elements in it; the child elements of `VGroup` can be `VGroup` or basic primitives; the layout supports the configuration of the following attributes

* display: layout mode (`flex` turns on flex layout mode)
* flexDirection: direction of the main axis
* flexWrap: Single line display or multi-line display
* justifyContent: Row-oriented axis allocates space rules between and around content elements
* alignItems: alignment rules on the cross axis
* alignContent: Alignment rules on the main axis

## API

### VRect

rect element

|key|type|description|
|:----|:----|:----|
|width|number|rect width|
|height|number|rect height|
|lineWidth|number|stroke width|
|cornerRadius|number|corner radius|
|fill|string|fill color|
|stroke|string|stroke color|

### VCircle

circle element

|key|type|description|
|:----|:----|:----|
|radius|number|circle radius|
|startAngle|number|start radius|
|endAngle|number|end radius|
|lineWidth|number|stroke width|
|fill|string|fill color|
|stroke|string|stroke color|

### VText

text element

|key|type|description|
|:----|:----|:----|
|text|string|text content|
|fontSize|string|font size|
|fontFamily|string|font family|
|fill|string|text color|

### VImage

image element

|key|type|description|
|:----|:----|:----|
|width|number|image width|
|height|number|image height|
|image|string | HTMLImageElement | HTMLCanvasElement|image content|

### VGroup

container

|key|type|description|
|:----|:----|:----|
|width|number | percentCalcObj|container width|
|height|number | percentCalcObj|container height|
|display|'relative' \| 'flex'|layout mode (`flex` turns on flex layout mode)|
|flexDirection|'row' \| 'row-reverse' \| 'column' \| 'column-reverse'|direction of the main axis|
|flexWrap|'nowrap' \| 'wrap'|Single line display or multi-line display|
|justifyContent|'flex-start' \| 'flex-end' \| 'center' \| 'space-between' \| 'space-around'|Row-oriented axis allocates space rules between and around content elements|
|alignItems|'flex-start' \| 'flex-end' \| 'center'|alignment rules on the cross axis|
|alignContent|'flex-start' \| 'center' \| 'space-between' \| 'space-around'|Alignment rules on the main axis|

## CustomLayout Element
The primitives supported by the old version of customLayout are implemented in the same way as jsx primitives, but the writing method is different. You need to create the primitives through `new VTable.CustomLayout.XXX`, for example:
```ts
const text1 = new VTable.CustomLayout.Text({
  text: 'text',
  fontSize: 28,
  fontFamily: 'sans-serif',
  fill: 'black'
});

const container = new VTable.CustomLayout.Container({
  height,
  width,
});
containerRight.add(text1);

return {
  rootContainer: container,
  renderDefault: false,
};
```

Commonly used primitives are the same as jsx primitives, and the naming comparison is as follows:
|JSX Element|CustomLayout Element|
|:----|:----|
|VRect|CustomLayout.Rect|
|VCircle|CustomLayout.Circle|
|VText|CustomLayout.Text|
|VImage|CustomLayout.Image|
|VGroup|CustomLayout.Group / CustomLayout.Container|
|VGroup(flexWrap: 'no-wrap')|CustomLayout.GroupElement|
