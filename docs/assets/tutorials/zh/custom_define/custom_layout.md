# 明细表格

## 简介

VTable CustomRender支持用户自定义单元格内需要渲染需要的元素，使用时通过回调函数返回元素数组，指定元素的类型、样式和坐标（VTable CustomRender 布局能力设计 ）

目前的使用方式比较底层，如果用户希望实现一个复杂的样式，需要手动计算各个元素的位置，手动处理对齐、换行等功能，上手比较困难，可维护性较低

通过CustomLayout是在CustomRender API的基础上，提供一套简单盒模型布局能力，用户通过配置容器与元素，实现对齐、折行等基础布局能力，方便实现与维护较为复杂的单元格内容
下面是一个相对复杂的文字图标混排布局，使用CustomLayout实现（红色为不同容器bounds）：

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
          fill: 'black',
          marginBottom: 10,
          marginLeft: 10,
        });
        text0.getSize(grid);

        // 矩形
        const rect0 = new VTable.CustomLayout.Rect({
          width: 30,
          height: 30,
          fill: 'black',
          cornerRadius: 10,
        });

        const text1 = new VTable.CustomLayout.Text({
          text: '分组',
          fontSize: 28,
          fontFamily: 'sans-serif',
          fill: 'black',
          marginLeft: 10,
          marginRight: 5,
          marginTop: 5,
        });
        text1.getSize(grid);

        const text2 = new VTable.CustomLayout.Text({
          text: '文字2',
          fontSize: 16,
          fontFamily: 'sans-serif',
          fill: 'rgb(51, 101, 238)',
          background: {
            fill: 'rgb(220, 240, 252)',
            cornerRadius: 5,
            expendX: 5,
            expendY: 5,
          },
          marginRight: 5,
        });
        text2.getSize(grid);

        const circle2 = new VTable.CustomLayout.Circle({
          radius: 10,
          fill: '#999',
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

## 使用方法

与customRender类似，customLayout也分为`customLayout`和`headerCustomLayout`两个接口分别配置表头和内容的自定义渲染，在columns/rows中配置

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

customLayout函数返回一个对象，其中`rootContainer`为自定义渲染内容的根节点，`renderDefault`为是否需要绘制单元格原内容的标记（与customRender一致）

## 模块

### Element

基础的自定义图元，目前支持rect circle text icon四种图元

|图元类型|基础属性|
|:----|:----|
|rect|width, height, stroke, fill, lineWidth, cornerRadius|
|circle|radius, radian, stroke, fill, lineWidth|
|text|text, fontSize, fontFamily, fill|
|icon|svg, width, height |

在基础属性外，支持hover样式和背景样式

*   hover样式和基础样式相同，被hover的元素会展示相应的样式
*   text和icon支持配置背景样式
    *   stroke
    *   fill
    *   lineWidth
    *   cornerRadius
    *   expendX
    *   expendY
        其中expendX和expendX指在原先bounds外延伸的尺寸

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a0e.jpg)

图元可以配置margin属性

*   marginLeft
*   marginRight
*   marginTop
*   marginBottom
    图元的margin会计算在图元所占的空间

### GroupElement

多个element的组合，按顺序依次摆放；可以配置子元素摆放方向，不提供折行和对齐能力
例如下面这个按钮

<div style="width:300px; height:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523223.png" alt="image" style="width:100%; height:100%;">
</div>
由两个element组成：文字（配置圆角矩形背景）、“x”icon
其中文字和图表配置margin来进行位置调整

### Container

盒模型布局容器，支持元素在其中自动布局；container的子元素可以是container，也可以是groupElement和element；需要配置以下属性

*   布局方向（水平或垂直）
*   宽度/高度（可指定像素宽度或百分比宽度）
*   对齐方式（水平左中右，垂直上中下）

## 布局能力

以此表头为例

<div style="width:500px; height:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/350c0511133d336e622523225.png" alt="image" style="width:100%; height:100%;">
</div>
分为A B CD C D五个container

<div style="width:500px; height:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/45df54929d214e7453e228f2c.png" alt="image" style="width:100%; height:100%;">
</div>

表头部分横向布局，分为三部分（A B CD）：

*   左右两侧（A B），宽度像素指定（由icon size决定），高度为单元格高度
*   中间部分（CD）高度单元格高度，指定宽度单元格宽度 - AB总宽度

中间部分纵向布局，分为两部分（C D）：

*   上部（C）指定高度（由“全部”文字样式确定），宽度为父级container宽度
*   下部（D）不指定高度，宽度为父级container宽度，实际高度由布局结果确定，超过容器部分被截断

中间下部（D）横向布局，有三个element：分组文字、省份按钮、城市按钮

<div style="width:500px; height:160px;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/45df54929d214e7453e228f2d.png" alt="image" style="width:100%; height:100%;">
</div>

其中省份按钮和城市按钮是多个element组合成的groupElement，整个container的高度由布局折行结果决定，最小高度为不换行显示为一行；最大高度为三个element都折行显示，显示为三行

## 自动行高列宽计算

使用percentCalc方法指定百分比宽高的container，在表格指定自适应宽高时，会依据内容的宽高自动计算出可以容纳所有内容的单元格宽高，作为本单元格实际内容宽高

## API

### Element

所有图元基类

|key|type|description|
|:----|:----|:----|
|id|string|id表示|
|marginLeft|number|左侧margin|
|marginRight|number|右侧margin|
|marginTop|number|上部margin|
|marginBottom|number|下部margin|
|background|{ fill?: boolean; stroke?: boolean; stroke?: string; fill?: string; lineWidth?: number; cornerRadius?: number; expendX?: number; expendY?: number;}|背景填充样式|

### Rect

矩形图元

|key|type|description|
|:----|:----|:----|
|width|number|矩形宽度|
|height|number|矩形高度|
|lineWidth|number|描边宽度|
|cornerRadius|number|角弧度|
|fill|string|填充颜色|
|stroke|string|描边颜色|

### Circle

圆形图元

|key|type|description|
|:----|:----|:----|
|radius|number|半径|
|radian|number|圆角度|
|lineWidth|number|描边宽度|
|fill|string|填充颜色|
|stroke|string|描边颜色|

### Text

文字图元

|key|type|description|
|:----|:----|:----|
|text|string|文字内容|
|fontSize|string|字号|
|fontFamily|string|字体|
|fill|string|文字颜色|

### Icon

图标图元

|key|type|description|
|:----|:----|:----|
|width|number|图表宽度|
|height|number|图表高度|
|svg|string|svg字符串|
|iconName|string|使用注册icon的name（与svg互斥）|

### GroupElement

行内分组

|key|type|description|
|:----|:----|:----|
|direction|'row' | 'column'|布局方向|
|alignItems|'start' | 'end' | 'center'|布局方向上的对齐方式|

### Container

容器

|key|type|description|
|:----|:----|:----|
|width|number | percentCalcObj|容器宽度|
|height|number | percentCalcObj|容器高度|
|direction|'row' | 'column'|布局主方向|
|justifyContent|'start' | 'end' | 'center'|布局方向上的对齐方式|
|alignItems|'start' | 'end' | 'center'|布局交叉方向上的对齐方式|
|alignContent|'start' | 'end' | 'center'|布局交叉方向上多根轴线的对齐方式|
|showBounds|boolean|是否显示bounds|
