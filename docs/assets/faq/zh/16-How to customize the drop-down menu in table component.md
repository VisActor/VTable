# 表格组件中如何自定义下拉菜单？

## 问题描述

如何在表格组件的表头部分定制下拉菜单，支持配置图标和多级菜单。

## 解决方案

VTable 支持两种下拉菜单配置方式：

1. 在全局配置
   在 option 中配置 menu 属性，会在所有没有配置下拉菜单的表头中生效，其中 defaultHeaderMenuItems 中配置显示的菜单项目，支持以下配置：

- text: 菜单项目文字
- icon: 菜单项目图标
- selectedIcon: 菜单项目选中状态图标
- children: 二级菜单项目

```javascript
menu: {
  defaultHeaderMenuItems: [
    {
      text: 'ascend',
      icon: {
        svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
      },
      selectedIcon: {
        svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
      },
      children: [
        {
          text: 'ascend',
          icon: {
            svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
          },
          selectedIcon: {
            svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
          },
          menuKey: 'ascend1'
        },
        {
          text: 'descend',
          icon: {
            svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
          },
          selectedIcon: {
            svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
          },
          menuKey: 'descend1'
        }
      ]
    }
    // ......
  ];
}
```

2. 在表头中配置
   在 columns 中可以配置 dropDownMenu，项目与 defaultHeaderMenuItems 相同，该菜单只在对应的列中生效。
3. 菜单选中状态更新
   下拉菜单项目选中后，会触发"dropdownmenu_click"事件，监听事件事件通过 setDropDownMenuHighlight 接口更新下拉菜单状态，选中的项目文字和 icon 会更改样式。

```javascript
table.on('dropdownmenu_click', (args: any) => {
  console.log('dropdownmenu_click', args);
  table.setDropDownMenuHighlight([args]);
});
```

## 代码示例

```javascript
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80
  },
  {
    field: 'hobbies',
    title: 'hobbies',
    width: 200,
    dropDownMenu: ['item1', 'item2']
  }
];
const option: TYPES.ListTableConstructorOptions = {
  records,
  columns,
  heightMode: 'autoHeight',
  autoWrapText: true,
  menu: {
    defaultHeaderMenuItems: [
      {
        text: 'ascend',
        icon: {
          svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
        },
        selectedIcon: {
          svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
        },
        children: [
          {
            text: 'ascend',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
            },
            selectedIcon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
            },
            menuKey: 'ascend1'
          },
          {
            text: 'descend',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
            },
            selectedIcon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
            },
            menuKey: '降序排序1'
          }
        ]
      },
      {
        text: 'descend',
        icon: {
          svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
        },
        selectedIcon: {
          svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
        }
      },
      {
        text: 'frozen',
        icon: {
          svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8H22V88H8V8ZM34 88V8H88V88H34ZM80 16H42V80H80V16Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
        }
      }
    ]
  }
};
const table = new ListTable(document.getElementById('container'), option);
table.on('dropdownmenu_click', (args: any) => {
  console.log('dropdownmenu_click', args);
  table.setDropDownMenuHighlight([args]);
});
```

## 结果展示

[在线效果参考](https://codesandbox.io/s/vtable-dropdown-menu-wn4gl3)

![result](/vtable/faq/16-1.png)

## 相关文档

- [下拉菜单教程](https://www.visactor.io/vtable/guide/components/dropdown)
- [相关 api](https://www.visactor.io/vtable/option/ListTable-columns-text#dropDownMenu)
- [相关 api](<https://www.visactor.io/vtable/option/ListTable#menu.defaultHeaderMenuItems(MenuListItem%5B%5D)>)
- [github](https://github.com/VisActor/VTable)
