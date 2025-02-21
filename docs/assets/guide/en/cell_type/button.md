# Button Cell Type

Button cell type is suitable for providing button interactions in tables, allowing users to click buttons for specific operations. The interactive capability provided by button cell type is widely used in many applications.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/button.png)

## Button-specific Configuration Options

The button cell type has the following specific configuration options:

1. `disable`: Whether the button can be disabled for clicking, default value is false. Supports function configuration, can be different for different cells.
2. `text`: Button text, supports function configuration. If not configured, the button text will be the value corresponding to the `field`.

Example:

```javascript
{
  field: 'button',
  cellType: 'button',
  text: 'Select'
}
```

## Button Click Event

When the button is clicked, it triggers the `VTable.ListTable.EVENT_TYPE.BUTTON_CLICK` event.

```javascript
instance.on(VTable.ListTable.EVENT_TYPE.BUTTON_CLICK, e => {
  console.log(VTable.ListTable.EVENT_TYPE.BUTTON_CLICK, e.col, e.row);
});
```

[Click to view complete example](../../demo/cell-type/button)
Through the above introduction, you have learned how to use button cell type for data display in VTable. We hope this helps.
