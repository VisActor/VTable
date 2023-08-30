# Detailed table

## Introduction

VTable CustomRender supports user-defined cells that need to render the required elements. When used, return an array of elements through the callback function, and specify the type, style and coordinates of the elements (VTable CustomRender layout capability design)

The current use method is relatively low-level. If the user wants to implement a complex style, he needs to manually calculate the position of each element, and manually handle functions such as alignment and line wrapping. It is difficult to get started and has low maintainability

Through CustomLayout, a set of simple box model layout capabilities is provided on the basis of the CustomRender API. Users can configure containers and elements to achieve basic layout capabilities such as alignment and line wrapping, which is convenient for realizing and maintaining more complex cell content
Here is a relatively complex mixed layout of text icons, implemented using CustomLayout (red for different container bounds):

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523221.png" style="flex: 0 0 50%; padding: 10px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523222.png" style="flex: 0 0 50%; padding: 10px;">
</div>
CustomLayout实现代码如下：

```typescript
{
    // ......
    headerCustomLayout: (args: VTable.TYPES.CustomRenderFunctionArg) => {
        const { grid } = args;
        const { height, width } = args.rect;
        const percentCalc = VTable.CustomLayout.percentCalc;  // 比例计算工具

        // 文字
        const text0 = new VTable.CustomLayout.Text({
          text: '全部',
          fontSize: 32,
          fontFamily: 'sans-serif',
          fillColor: 'black',
          marginBottom: 10,
          marginLeft: 10,
        });
        text0.getSize(grid);

        // 矩形
        const rect0 = new VTable.CustomLayout.Rect({
          width: 30,
          height: 30,
          fillColor: 'black',
          cornerRadius: 10,
        });

        const text1 = new VTable.CustomLayout.Text({
          text: '分组',
          fontSize: 28,
          fontFamily: 'sans-serif',
          fillColor: 'black',
          marginLeft: 10,
          marginRight: 5,
          marginTop: 5,
        });
        text1.getSize(grid);

        const text2 = new VTable.CustomLayout.Text({
          text: '文字2',
          fontSize: 16,
          fontFamily: 'sans-serif',
          fillColor: 'rgb(51, 101, 238)',
          background: {
            fillColor: 'rgb(220, 240, 252)',
            cornerRadius: 5,
            expendX: 5,
            expendY: 5,
          },
          marginRight: 5,
        });
        text2.getSize(grid);

        const circle2 = new VTable.CustomLayout.Circle({
          radius: 10,
          fillColor: '#999',
        });

        // 分组
        const group2 = new VTable.CustomLayout.GroupElement({
          direction: 'row',
          alignItems: 'center',
          marginRight: 5,
          marginTop: 10,
          marginLeft: 10,
          marginBottom: 5,
        });

        group2.add(text2);
        group2.add(circle2);
        
        // 其他分组......
        
        // 图标
        const icon0 = new VTable.CustomLayout.Icon({
          id: 'icon0',
          iconName: 'phone',
          width: 30,
          height: 30,
          // svg: `<svg width="22" height="22" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="dp-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.00053 8.78553L2.11144 4.89645C1.91618 4.70118 1.5996 4.70118 1.40433 4.89645C1.20907 5.09171 1.20907 5.40829 1.40433 5.60355L5.64698 9.84619C5.84224 10.0415 6.15882 10.0415 6.35408 9.84619L10.5967 5.60355C10.792 5.40829 10.792 5.09171 10.5967 4.89645C10.4015 4.70118 10.0849 4.70118 9.88962 4.89645L6.00053 8.78553Z" fill="#57585A"></path></svg>`,
          marginRight: 10,
          marginBottom: 50,
        });

        const icon1 = new VTable.CustomLayout.Icon({
          id: 'icon1',
          width: 30,
          height: 30,
          svg: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 4H18V18H4V30H18V44H30V30H44V18H30V4Z" fill="#3344FF" stroke="#3344FF" stroke-width="1" stroke-linejoin="round"/></svg>`,
          marginLeft: 10,
          marginBottom: 10,
        });

        const icon2 = new VTable.CustomLayout.Icon({
          id: 'icon2',
          width: 30,
          height: 30,
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1.29609 1C0.745635 1 0.444871 1.64195 0.797169 2.06491L4.64953 6.68988V9.81861C4.64953 9.89573 4.69727 9.9648 4.76942 9.99205L7.11236 10.877C7.27164 10.9372 7.4419 10.8195 7.4419 10.6492V6.68988L11.2239 2.06012C11.5703 1.63606 11.2685 1 10.721 1H1.29609Z" stroke="#141414" stroke-opacity="0.65" stroke-width="1.18463" stroke-linejoin="round"/>
          </svg>`,
          marginLeft: 10,
          marginTop: 10,
        });

        // 左侧容器
        const containerLeft = new VTable.CustomLayout.Container({
          height: percentCalc(100),
          width: 60,
          showBounds: true,
          direction: 'column',
          alignContent: 'end',
          justifyContent: 'center',
        });

        // 中央容器
        const containerMiddle = new VTable.CustomLayout.Container({
          height: percentCalc(100),
          width: percentCalc(100, -60 - 60),
          direction: 'column',
        });

        // 中上部容器
        const containerMiddleTop = new VTable.CustomLayout.Container({
          height: 100,
          width: percentCalc(100),
          showBounds: true,
          alignContent: 'end',
          // justifyContent: 'center',
          // alignItems: 'center',
        });

        // 中下容器
        const containerMiddleBottom = new VTable.CustomLayout.Container({
          height: percentCalc(100, -100),
          width: percentCalc(100),
          showBounds: true,
          alignItems: 'center',
        });

        // 右侧容器
        const containerRight = new VTable.CustomLayout.Container({
          height: percentCalc(100),
          width: 60,
          showBounds: true,
          direction: 'column',
          justifyContent: 'center',
        });

        // 根节点容器
        const container = new VTable.CustomLayout.Container({
          height,
          width,
        });

        // 容器添加节点
        container.add(containerLeft);
        container.add(containerMiddle);
        container.add(containerRight);

        containerMiddle.add(containerMiddleTop);
        containerMiddle.add(containerMiddleBottom);

        containerMiddleTop.add(text0);
        containerMiddleTop.add(rect0);
        containerMiddleBottom.add(text1);
        containerMiddleBottom.add(group2);
        containerMiddleBottom.add(group3);
        containerMiddleBottom.add(group4);
        containerMiddleBottom.add(group5);
        containerMiddleBottom.add(group6);

        containerLeft.add(icon0);
        containerRight.add(icon1);
        containerRight.add(icon2);

        return {
          rootContainer: container,
          renderDefault: false,
        };
      },
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

The customLayout function returns an object where`rootContainer`To customize the root node of the rendered content,`renderDefault`A marker for whether the original contents of the cell need to be drawn (consistent with customRender)

## module

### Elements

Basic custom primitive, currently supports four primitive of rect circle text icon

| Primitive Types | Basic Properties |
|:----|:----|
| rect | width, height, strokeColor, fillColor, lineWidth, cornerRadius |
| circle | radius, radian, strokeColor, fillColor, lineWidth |
| text | text, fontSize, fontFamily, fillColor |
| icons | svg, width, height |

In addition to basic properties, hover styles and background styles are supported

*   The hover style is the same as the base style, and the hovered element will display the corresponding style
*   Text and icon support to configure background styles
    *   strokeColor
    *   fillColor
    *   lineWidth
    *   cornerRadius
    *   Expenditure X
    *   Expenditure
        Where expendX and expendX refer to the dimensions that extend outside the original bounds

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a0e.jpg)

The primitive can configure the margin property

*   marginLeft
*   marginRight
*   marginTop
*   marginBottom
    The margin of the primitive is calculated by the space occupied by the primitive

### GroupElement

Combination of multiple elements, placed in sequence; can configure the placement direction of child elements, does not provide folding and alignment capabilities
For example the button below

<div style="width:300px; height:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523223.png" alt="image" style="width:100%; height:100%;">
</div>
由两个element组成：文字（配置圆角矩形背景）、“x”icon
其中文字和图表配置margin来进行位置调整

### Container

The box model layouts the container, and supports the automatic layout of elements in it; the child elements of the container can be containers, groupElements and elements; the following properties need to be configured

*   Layout direction (horizontal or vertical)
*   Width/Height (pixel width or percentage width can be specified)
*   Alignment (horizontal left, center right, vertical up, middle and bottom)

## Layout capability

Take this header as an example

<div style="width:500px; height:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523225.png" alt="image" style="width:100%; height:100%;">
</div>
分为A B CD C D五个container

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

The province button and the city button are groupElements composed of multiple elements. The height of the entire container is determined by the layout wrapping result. The minimum height is displayed as one line without wrapping; the maximum height is displayed as three lines for all three elements

## Automatic row height and column width calculation

Use the percentCalc method to specify the container with the percentage width and height. When the table specifies the adaptive width and height, the width and height of the cell that can hold all the content will be automatically calculated according to the width and height of the content. As the actual content width and height of this cell

## API

### Elements

All primitive base classes

| key | type | description |
|:----|:----|:----|
| id | string | id representation |
| marginLeft | number | left margin |
| marginRight | number | right margin |
| marginTop | number | upper margin |
| marginBottom | number | lower margin |
| background | {fill?: boolean; stroke?: boolean; strokeColor?: string; fillColor?: string; lineWidth?: number; cornerRadius?: number; expendX?: number; expendY?: number;} | Background fill style |

### Rect

Rectangular primitive

| key | type | description |
|:----|:----|:----|
| width | number | rectangle width |
| height | number | rectangle height |
| lineWidth | number | stroke width |
| Radians | numbers | radians |
| fillColor | string | fill color |
| strokeColor | string | Stroke Color |

### Circle

circular primitive

| key | type | description |
|:----|:----|:----|
| radius | number | radius |
| radian | number | circle angle |
| lineWidth | number | stroke width |
| fillColor | string | fill color |
| strokeColor | string | Stroke Color |

### Text

Text primitive

| key | type | description |
|:----|:----|:----|
| text | string | text content |
| fontSize | string | font size |
| fontFamily | string | font |
| fillColor | string | text color |

### Icon

icon primitive

| key | type | description |
|:----|:----|:----|
| width | number | chart width |
| height | number | chart height |
| svg | string | svg string |
| iconName | string | use the name of the registered icon (mutual exclusion with svg) |

### GroupElement

Inline Grouping

| key | type | description |
|:----|:----|:----|
| direction | 'row' | 'column' | layout direction |
| alignItems | 'start' | 'end' | 'center' | alignment in layout direction |

### Container

container

| key | type | description |
|:----|:----|:----|
| width | number | percentCalcObj | container width |
| height | number | percentCalcObj | container height |
| direction | 'row' | 'column' | layout main direction |
| justifyContent | 'start' | 'end' | 'center' | alignment in layout direction |
| alignItems | 'start' | 'end' | 'center' | alignment in layout cross direction |
| alignContent | 'start' | 'end' | 'center' | Alignment of multiple axes in layout intersection |
| showBounds | boolean | Whether to show bounds |
