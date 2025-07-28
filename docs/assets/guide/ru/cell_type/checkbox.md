# Checkbox Cell Type

Checkbox cell type is suitable for providing multiple-choice options in tables, allowing users to select or deselect one or more items. Checkbox cells are widely used in many applications, including task management, data filtering, permission settings, and more.

The advantages of checkbox cells in tables are:

1. Checkbox cells are intuitive and flexible to use. Users can select one or multiple options based on their needs to perform specific operations or filter data. This interaction method allows users to have more precise control over their operations, improving user experience and efficiency.
2. Checkbox cells typically use different icons or colors to represent checked and unchecked states, providing visual feedback. This makes it easy for users to identify which options have been selected and which haven't.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/checkbox.png)

## Checkbox-specific Configuration Options

The checkbox type has the following specific configuration options:

1. `checked`: Determines whether the cell is in a checked state. Default value is false. Supports function configuration for different cells.
2. `disable`: Determines whether the checkbox can be disabled. Default value is false. Supports function configuration for different cells.

Example:

```javascript
{
  headerType: 'checkbox', // Specify header cell to display as checkbox
  cellType: 'checkbox', // Specify body cell to display as checkbox
  field: 'check',
  checked: true,
  disbaled: false
}
```

## Checkbox Data Types

Checkbox data supports `boolean`, `string`, or `Object` types, or defaults to false if no value is set.

1. Setting `boolean` type is most common. Example with check field:

```javascript
const columns = [
  {
    headerType: 'checkbox', // Specify header cell to display as checkbox
    cellType: 'checkbox', // Specify body cell to display as checkbox
    field: 'check'
  }
];
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
];
```

2. If set as a `string` type, the text will be displayed to the right of the checkbox, with the checkbox defaulting to unchecked. Example with product field:

```javascript
const columns = [
  {
    headerType: 'checkbox', // Specify header cell to display as checkbox
    cellType: 'checkbox', // Specify body cell to display as checkbox
    field: 'product'
  }
];
const records = [
  {
    product: 'a'
  },
  {
    product: 'b'
  },
  {
    product: 'c'
  }
];
```

3. If each data entry has different states, you can set an Object.

The Object supports the following properties:

- text: The text displayed in the checkbox cell
- checked: Whether the checkbox is checked
- disable: Whether the checkbox is disabled

Example:

```javascript
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

Both `checked` and `disable` can be configured in the data or in the `column`. Configurations in the data take precedence over configurations in the `column`.

## Getting Checkbox States Through APIs

1. Get the checked states of all checkboxes under a specific field.

Note: The order corresponds to the original input records data, not the table display row states

```javascript
getCheckboxState(field?: string | number): Array
```

2. Get the checked state of a specific cell's checkbox.

```javascript
getCellCheckboxState(col: number, row: number): boolean
```

## Setting Checkbox States Through APIs

Set the checked state of a specific cell's checkbox.

```javascript
setCellCheckboxState(col: number, row: number, checked: boolean | 'indeterminate')
```

With the above introduction, you've learned how to use checkbox cell types for data display in VTable. We hope this helps!
