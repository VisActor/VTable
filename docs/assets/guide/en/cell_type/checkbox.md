# Checkbox Type

checkbox type cells are suitable for use in tables to provide multiple selection options and allow the user to select or deselect one or more items. Checkbox type cells are widely used in many applications, including task management, data filtering, permission settings, etc.

The advantages of selecting box cells in tables are as follows:

1. The use of checkbox type cells is very intuitive and flexible. Users can select one or more options to perform specific actions or filter data based on their needs. This interaction method enables users to control their operations more finely, improving user experience and efficiency.
2. Checkbox type cells usually use different icons or colors to indicate selected and unselected states, providing visual feedback. This way the user can easily identify which options have been selected and which have not.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/checkbox.png)

## Introduction of exclusive configuration items for checkbox

The specific configuration items of the checkbox in the configuration are as follows:

1. `checked`: Whether the cell is selected. The default value is false. Configuration functions are supported. Different cell configurations are different.
2. `disable`: Whether the cell checkbox can disable clicks. The default value is false. It supports configuration functions and has different configurations for different cells.

Example: 
```javascript
{
  cellType: 'checkbox',
  field: 'check',
  checked: true,
  disbaled: false
}
```

## Introduction of data for checkbox

The data corresponding to the checkbox supports strings or objects, in which the following attributes can be configured in the object:

* text: The text displayed in the cell checkbox
* checked: Whether the cell checkbox is selected
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

Through the above introduction, you have learned how to use the checkbox type in the VTable table for data display, I hope it will be helpful to you.