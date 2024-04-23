# checkbox type

Checkbox type cells are suitable for use in tables to provide multiple selection options and allow the user to select or deselect one or more items. Checkbox type cells are widely used in many applications, including task management, data filtering, permission settings, etc.

The advantages of checkbox cells in tables are as follows:

1. The use of checkbox type cells is very intuitive and flexible. Users can select one or more options to perform specific actions or filter data based on their needs. This interaction method enables users to control their operations more finely, improving user experience and efficiency.
2. Checkbox type cells usually use different icons or colors to indicate selected and unselected states, providing visual feedback. This way the user can easily identify which options have been selected and which have not.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/checkbox.png)

## Introduction to the exclusive configuration items of checkbox

The unique configuration items of the checkbox checkbox type in the configuration are as follows:

1. `checked`: Whether the cell is selected. The default value is false. Configuration functions are supported. Different cell configurations are different.
2. `disable`: Whether the cell check box can disable clicks. The default value is false. It supports configuration functions. Different cell configurations are different.

Example:
```javascript
{
  headerType: 'checkbox', //Specify the header cell to be displayed as a checkbox
  cellType: 'checkbox',//The specified body cell is displayed as a check box
  field: 'check',
  checked: true,
  disabled: false
}
```

## Introduction to the exclusive data type of checkbox

The data corresponding to the checkbox supports `boolean`, `string` or `Object`, or it defaults to false if the value is not set.

1. Among the three types, it is more common to set the `boolean` type. For example, the check field is set as follows:
```
const columns=[
  {
    headerType: 'checkbox', //Specify the header cell to be displayed as a checkbox
    cellType: 'checkbox',//The specified body cell is displayed as a check box
    field: 'check',
  }
]
const records = [
  {
    product: 'a',
    check: true
  },
  {
     product: 'b',
    check: false
  },
  {
     product: 'c',
    check: false
  }
]
```

2. If set to `string` type, the text will be displayed on the right side of the checkbox, and the checkbox will be unselected by default. For example, the product field is set as follows:
```
const columns=[
  {
    headerType: 'checkbox', //Specify the header cell to be displayed as a checkbox
    cellType: 'checkbox',//The specified body cell is displayed as a check box
    field: 'product',
  }
]
const records = [
  {
    product: 'a',
  },
  {
     product: 'b',
  },
  {
     product: 'c',
  }
]
```

3. If each state of the data item is different, you can set the Object object.

The Object object supports configuring the following properties:

* text: The text displayed in the check box of this cell
* checked: Whether the cell check box is selected
* disable: whether the cell checkbox is disabled

Example:
```javasxript
const records = [
  {
    percent: '100%',
    check: {
      text: 'unchecked',
      checked: false,
      disable: false
    }
  },
  {
    percent: '80%',
    check: {
      text: 'checked',
      checked: true,
      disable: false
    }
  }
];
```

`checked` and `disable` support configuration in both data and `column`. The priority of configuration in data is higher than the configuration in `column`.

## Get the data selection status through the interface

Get the selected status of all data in the checkbox under a certain field.

Note: The order corresponds to the original incoming data records and does not correspond to the status value of the row displayed in the table.
```
getCheckboxState(field?: string | number): Array
```

Through the above introduction, you have learned how to use the checkbox checkbox type to display data in the VTable table. I hope it will be helpful to you.