# How to display user information, such as a combination of "avatar + name," in data analysis reports or tables?

## Question Description

I would like to display both an avatar and a name in a single cell of a data report table in a simple manner. Are there any examples I can refer to?

![](/vtable/faq/9-0.png)

## Solution

In VTable, there are two ways to accomplish this. The first and simplest approach is to use icons. You can directly set the icon source as the resource field. For more details, you can refer to the demo I provided. The second approach involves custom rendering, which requires familiarity with the syntax. However, it allows for more complex effects.

## Code Example

```javascript
const columns: VTable.ColumnsDefine = [
  {
    field: "name",
    title: "name",
    width: "auto",
    cellType: "link",
    templateLink: "https://www.google.com.hk/search?q={name}",
    linkJump: true,
    icon: {
      type: "image",
      src: "image1",
      name: "Avatar",
      shape: "circle",
      //定义文本内容行内图标，第一个字符展示
      width: 30, // Optional
      height: 30,
      positionType: VTable.TYPES.IconPosition.contentLeft,
      marginRight: 20,
      marginLeft: 0,
      cursor: "pointer"
    }
  },
  ...
  ]
```

## Results

[Online demo](https://codesandbox.io/s/vtable-photo-username-ypndvm?file=/src/index.ts)

![result](/vtable/faq/9-1.png)

## Quote

- [Define icon Tutorial](https://visactor.io/vtable/guide/custom_define/custom_icon)
- [Custom cell layout demo](https://visactor.io/vtable/demo/custom-render/custom-cell-layout)
- [Related api](https://visactor.io/vtable/option/ListTable-columns-text#icon.ImageIcon.src)
- [github](https://github.com/VisActor/VTable)
