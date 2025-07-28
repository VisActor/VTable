# How to implement a heatmap using a table component?

## Question Description

I would like to implement a simple heatmap using a table, where the background color of each cell is determined by its value. Could you please suggest a simple way to achieve this?
![image](/vtable/faq/17-0.png)

## Solution

VTable allows flexible customization of each cell's background color and border color, and it supports custom functions for implementation.
You can find an example of a heatmap on the official website of VTable: https://visactor.io/vtable/demo/business/color-level

## Code Example

```javascript
  indicators: [
          {
            indicatorKey: '220922103859011',
            width: 200,
            showSort: false,
            format(rec){
              return Math.round(rec['220922103859011']);
            },
            style: {
              color: "white",
              bgColor: (args) => {
                return getColor(100000,2000000,args.dataValue)
              },
            },
          },
        ],
```

## Results

[Online demo]()

![result](/vtable/faq/17-1.png)

## Quote

- [Cell background color Tutorial](https://visactor.io/vtable/guide/theme_and_style/style)
- [Related api](https://visactor.io/vtable/option/PivotTable-indicators-text#style.bgColor)
- [github](https://github.com/VisActor/VTable)
