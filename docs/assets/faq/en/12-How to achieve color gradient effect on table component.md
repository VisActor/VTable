# How to achieve color gradient effect on table component?

## Question Description

The background of the cells on the table is displayed in different colors according to different data, realizing a color scale effect. How to achieve this effect on VTable?

![image](/vtable/faq/12-0.png)

## Solution

You can achieve the color scale effect by setting `bgColor` in `style` as a function in `columns` and returning different color values based on different data:

```javascript
const BG_COLOR = (args: TYPES.StylePropertyFunctionArg): string => {
  const num = args.value;
  if (Number(num) > 80) {
    return '#6690FF';
  }
  if (Number(num) > 50) {
    return '#84A9FF';
  }
  if (Number(num) > 20) {
    return '#ADC8FF';
  }
  return '#D6E4FF';
};

const columns = [
  {
    style: {
      bgColor: BG_COLOR
    }
  }
];
```

## Code Example

```javascript
const BG_COLOR = (args: TYPES.StylePropertyFunctionArg): string => {
  const num = args.value;
  if (Number(num) > 80) {
    return '#6690FF';
  }
  if (Number(num) > 50) {
    return '#84A9FF';
  }
  if (Number(num) > 20) {
    return '#ADC8FF';
  }
  return '#D6E4FF';
};

const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80
  },
  {
    field: 'value',
    title: 'progress',
    style: {
      bgColor: BG_COLOR
    },
    width: 250
  }
];
const option: TYPES.ListTableConstructorOptions = {
  records,
  columns
};
new ListTable(document.getElementById('container'), option);
```

## Results

[Online demo](https://codesandbox.io/s/vtable-color-step-n9ngjq)

![result](/vtable/faq/12-1.png)

## Quote

- [Color step Demo](https://visactor.io/vtable/demo/business/color-level)
- [Background Color api](https://visactor.io/vtable/option/ListTable-columns-text#style.bgColor)
- [github](https://github.com/VisActor/VTable)
