# How to customize the context menu in the table component?

## Question Description

How to customize the context in the header part of the table component to support different cells displaying different menu items.

## Solution

In the menu attribute configuration option, configure contextMenuItems, which supports two configuration modes:

1. Configure the item array, right-clicking the table area will display the same menu items

```javascript
menu: {
  contextMenuItems: [
    { text: '复制表头', menuKey: '复制表头$1' },
    { text: '复制单元格', menuKey: '复制单元格$1' }
  ];
}
```

2. Configure the callback function. Right-clicking the table area will display different menus according to the different items returned by the callback function

```javascript
menu: {
  contextMenuItems: (field: string, row: number) => {
    console.log(field, row);
    return [
      { text: '复制表头', menuKey: '复制表头$1' },
      { text: '复制单元格', menuKey: '复制单元格$1' }
    ];
  };
}
```

Menu item configuration:

- text: the text of the menu item
- menuKey: unique identifier of the menu item

After the drop-down menu item is selected, the "dropdownmenu_click" event will be triggered, and you can listen to the event and perform related operations.

```javascript
table.on('dropdownmenu_click', (args: any) => {
  console.log('menu_click', args);
});
```

## Code Example

```javascript
const option: TYPES.ListTableConstructorOptions = {
  records,
  columns,
  heightMode: 'autoHeight',
  autoWrapText: true,
  menu: {
    contextMenuItems: (field: string, row: number) => {
      console.log(field, row);
      return [
        { text: 'copy header', menuKey: 'copy header$1' },
        { text: 'copy cell', menuKey: 'copy cell$1' }
      ];
    }
  }
};
const table = new ListTable(document.getElementById('container'), option);
table.on('dropdownmenu_click', (args: any) => {
  console.log('menu_click', args);
});
```

## Results

[Online demo](https://codesandbox.io/s/vtable-context-menu-m8vx7v)

![result](/vtable/faq/18-0.png)

## Quote

- [github](https://github.com/VisActor/VTable)
