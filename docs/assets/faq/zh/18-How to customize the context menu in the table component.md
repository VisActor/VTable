# 表格组件中如何自定义右键菜单？

## 问题描述

如何在表格组件的表头部分定制右键，支持不同单元格显示不同菜单项目。

## 解决方案

在 option 中配置 menu 属性中，配置 contextMenuItems，支持两种配置模式：

1. 配置项目数组，右键表格区域会显示相同的菜单项目

```javascript
menu: {
  contextMenuItems: [
    { text: '复制表头', menuKey: '复制表头$1' },
    { text: '复制单元格', menuKey: '复制单元格$1' }
  ];
}
```

2. 配置回调函数，右键表格区域会按照回调函数返回的不同项目显示不同的菜单

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

菜单项目配置：

- text: 菜单项目的文字
- menuKey: 菜单项目的唯一标识符

下拉菜单项目选中后，会触发"dropdownmenu_click"事件，可以监听事件事件执行相关操作。

```javascript
table.on('dropdownmenu_click', (args: any) => {
  console.log('menu_click', args);
});
```

## 代码示例

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

## 结果展示

[在线效果参考](https://codesandbox.io/s/vtable-context-menu-m8vx7v)

![result](/vtable/faq/18-0.png)

## 相关文档

- [github](https://github.com/VisActor/VTable)
