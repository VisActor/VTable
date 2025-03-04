# Switch Cell Type

Switch cell type is suitable for providing switch states in tables, allowing users to select or deselect one or more items. The interactive capability provided by switch cell type is widely used in many applications.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/switch.png)

## Switch-specific Configuration Options

The switch cell type has the following specific configuration options:

1. `checked`: Whether the cell is in checked state, default value is false. Supports function configuration, can be different for different cells.
2. `disable`: Whether the switch can be disabled for clicking, default value is false. Supports function configuration, can be different for different cells.
3. `checkedText`: Specifies the text for checked state, supports function configuration.
4. `uncheckedText`: Specifies the text for unchecked state, supports function configuration.

Example:

```javascript
{
  field: 'switch', // Specify the cell's field
  cellType: 'switch', // Specify the cell to display as switch type
  checked: true,
  disable: false,
  checkedText: 'on', // Specify text for checked state, supports function configuration
  uncheckedText: 'off', // Specify text for unchecked state, supports function configuration
  style: {
    // Specify text style
    color: '#FFF',
    // ......
    // Specify switch style
    switchStyle: {
      boxWidth: 40, // Specify switch width
      boxHeight: 20, // Specify switch height
      // ......
    }
  }
}
```

## Switch Data Types

The switch cell type supports `boolean` or `Object` data types, or defaults to false if no value is set.

1. Setting `boolean` type is most common among the three types. Example switch field configuration:

```javascript
const columns = [
  // ......
  {
    field: 'switch',
    cellType: 'switch'
  }
];
const records = [
  { name: 'a', switch: true },
  { name: 'b', switch: false }
];
```

2. Setting `Object` type supports configuring `checked` and `disable`. Example switch field configuration:

```javascript
const columns = [
  // ......
  {
    field: 'switch',
    cellType: 'switch'
  }
];
const records = [
  { name: 'a', switch: { checked: true, disable: false } },
  { name: 'b', switch: { checked: false, disable: true } }
];
```

- checked: Whether the cell's switch is checked
- disable: Whether the cell's switch is disabled

Both `checked` and `disable` can be configured in data or in `column`. Configuration in data takes higher priority than configuration in `column`.

## Switch State Update Event

When the switch state is updated, it triggers the `VTable.ListTable.EVENT_TYPE.SWITCH_STATE_CHANGE` event.

```javascript
instance.on(VTable.ListTable.EVENT_TYPE.SWITCH_STATE_CHANGE, e => {
  console.log(VTable.ListTable.EVENT_TYPE.SWITCH_STATE_CHANGE, e.col, e.row, e.checked);
});
```

## Getting Switch States via API

1. Get switch states for all data under a specific field.

Note: The order corresponds to the original input records data, not the table display row state values

```
getSwitchState(field?: string | number): Array
```

2. Get switch state for a specific cell.

```
getCellSwitchState(col: number, row: number): boolean
```

## Setting Switch States via API

Set switch state for a specific cell.

```
setCellSwitchState(col: number, row: number, checked: boolean)
```

[Click to view complete example](../../demo/cell-type/switch)
Through the above introduction, you have learned how to use switch cell type for data display in VTable. We hope this helps.
