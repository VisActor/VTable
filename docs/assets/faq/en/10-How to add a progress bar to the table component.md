# How to add a progress bar to the table component?

## Question Description

Specify a column on the table, display the content as a progress bar based on data, and display percentage text. How to achieve this effect on VTable?
![image](/vtable/faq/10-0.png)

## Solution

You can specify the column to be progress bar type (progress chart) cell by setting `cellType` to `progressbar` in `columns`; by configuring the `style` in `columns`, you can configure the style of the progress chart:

```javascript
{
    field: "value",
    title: "progress",
    cellType: "progressbar",
    style: {
      barColor: DEFAULT_BAR_COLOR,
      barBgColor: "#ddd",
      barHeight: 30,
      barBottom: 4,
      textAlign: "right"
    },
    fieldFormat: (data: any) => {
      return data.value + "%";
    },
    width: 250
}
```

In style:

- barColor: progress bar color, which can be configured as a function to change the color of different progresses
- barBgColor: progress bar background color
- barHeight: progress bar height, supports configuration percentage
- barBottom: the height of the progress bar from the bottom, supports configuration percentage
- ......
  Through `fieldFormat`, you can modify the text content in the cell and display percentage text.
  By modifying the `barType`, the progress chart can be changed to a simple bar chart, which can be used to display content with both positive and negative data.

## Code Example

```javascript
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80
  },
  {
    field: 'value',
    title: 'progress',
    cellType: 'progressbar',
    style: {
      barColor: DEFAULT_BAR_COLOR,
      barBgColor: '#ddd',
      barHeight: 30,
      barBottom: 4,
      textAlign: 'right'
    },
    fieldFormat: (data: any) => {
      return data.value + '%';
    },
    width: 250
  },
  {
    field: 'value1',
    title: 'axis',
    cellType: 'progressbar',
    barType: 'negative',
    min: -50,
    max: 50,
    style: {
      barHeight: 30,
      barBottom: 4,
      textAlign: 'right'
    },
    width: 250
  }
];
const option: TYPES.ListTableConstructorOptions = {
  records,
  columns
};
```

## Results

[Online demo](https://codesandbox.io/s/vtable-progress-bar-l69jtk)

![result](/vtable/faq/10-1.png)

## Quote

- [Progress bar Demo](https://visactor.io/vtable/demo/cell-type/progressbar)
- [Progress bar Tutorial](https://visactor.io/vtable/guide/cell_type/progressbar)
- [github](https://github.com/VisActor/VTable)
