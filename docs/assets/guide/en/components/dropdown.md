# Dropdown drop-down menu introduction

In table components, a dropdown (drop-down menu) is a common user interface element commonly used to provide a list of options for selection or action. It appears as an Expandable menu that, when the user clicks or hovers over Dropdown, displays a drop-down list from which the user can select one or more options.
Use cases such as:

- Data operations: such as modifying a piece of data, deleting and other operations, let the user select through the drop-down menu.
- Sorting options: The dropdown menu can provide sorting options that allow users to sort or filter table data based on different columns or criteria.

## Introduction to configuration items

    {
       /** 下拉菜单的相关配置。消失时机：显示后点击菜单区域外自动消失*/
      menu?: {
        /** 代替原来的option.menuType  html目前实现较完整 先默认html渲染方式*/
        renderMode?: 'canvas' | 'html';
        /** 内置下拉菜单的全局设置项 目前只针对基本表格有效 会对每个表头单元格开启默认的下拉菜单功能。代替原来的option.dropDownMenu*/
        defaultHeaderMenuItems?: MenuListItem[] | ((args: { col: number; row: number; table: BaseTableAPI }) => MenuListItem[]);
        /** 右键菜单。代替原来的option.contextmenu */
        contextMenuItems?: MenuListItem[] | ((field: string, row: number, col: number, table: BaseTableAPI) => MenuListItem[]);
        /** 设置选中状态的菜单。代替原来的option.dropDownMenuHighlight  */
        dropDownMenuHighlight?: DropDownMenuHighlightInfo[];
      };
    };

- renderMode: specifies the rendering method;
- defaultHeaderMenuItems: Specify the header default configuration item content
- contextMenuItems: specify the right-click menu list
- dropDownMenuHighlight: If the menu has a corresponding selected state, configure it here

## example

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto',
        style: {
          textAlign: 'left',
          textBaseline: 'middle',
          textOverflow: 'ellipsis',
          color: '#F66',
          fontSize: 14,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          fontStyle: 'italic'
        }
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      container: document.getElementById(CONTAINER_ID),
      records: data,
      columns,
      widthMode: 'standard',
      theme: VTable.themes.DEFAULT,
      menu: {
        renderMode: 'html',
        defaultHeaderMenuItems: [
          {
            text: '升序排序',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
            },
            selectedIcon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
            },
            stateIcon: {
              svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opacity="0.9"></path></svg>'
            },
            children: [
              {
                text: '升序规则1',
                menuKey: '升序排序1',
                icon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
                },
                selectedIcon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
                },
                stateIcon: {
                  width: 12,
                  height: 11,
                  svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opacity="0.9"></path></svg>'
                },
                menuKey: '升序规则1'
              },
              {
                text: '升序规则2',
                icon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
                },
                selectedIcon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
                },
                stateIcon: {
                  width: 12,
                  height: 11,
                  svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opacity="0.9"></path></svg>'
                },
                menuKey: '升序规则2'
              }
            ]
          },
          {
            text: '降序排序',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
            },
            selectedIcon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
            },
            stateIcon: {
              svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 38.5314L34.9864 48.5634L34.9864 4.01538H28.9864L28.9864 48.4974L18.9864 38.5014V46.9854L27.776 55.7727H27.7732L32.0158 60.0154L45.0144 47.0174V38.5314Z" fill="#161616" fill-opacity="0.9"></path></svg>'
            }
          },
          {
            text: '冻结列',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8H22V88H8V8ZM34 88V8H88V88H34ZM80 16H42V80H80V16Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
            }
          }
        ],
        contextMenuItems: ['复制', '粘贴'],
        dropDownMenuHighlight: [
          {
            field: 'Order ID',
            menuKey: '升序规则1'
          }
        ]
      }
    };
    tableInstance = new VTable.ListTable(option);
    window['tableInstance'] = tableInstance;
  });
```

### defaultHeaderMenuItems example:

This example is configured with defaultHeaderMenuItems, when the mouse hover to the table header that is the drop-down menu, if you want to change the drop-down menu icon can be overwritten by registration:

      VTable.register.icon('dropdownIcon',{
              ......
              },
      );

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    VTable.register.icon('dropdownIcon', {
      name: 'dropdownIcon',
      type: 'svg',
      color: 'blue',
      positionType: VTable.TYPES.IconPosition.right,
      funcType: VTable.TYPES.IconFuncTypeEnum.dropDown,
      width: 20,
      visibleTime: 'always',
      height: 20,
      svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/dropdown.svg',
      marginLeft: 10,
      tooltip: {
        style: { arrowMark: true, font: 10, bgColor: 'white', color: 'black' },
        // 气泡框，按钮的的解释信息
        title: 'sort data',
        placement: VTable.TYPES.Placement.right
      }
    });
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto',
        style: {
          textAlign: 'left',
          textBaseline: 'middle',
          textOverflow: 'ellipsis',
          color: '#F66',
          fontSize: 14,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          fontStyle: 'italic'
        }
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      container: document.getElementById(CONTAINER_ID),
      records: data,
      columns,
      widthMode: 'standard',
      theme: VTable.themes.DEFAULT,
      menu: {
        renderMode: 'html',
        defaultHeaderMenuItems: [
          {
            text: '升序排序',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
            },
            selectedIcon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
            },
            stateIcon: {
              svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opacity="0.9"></path></svg>'
            },
            children: [
              {
                text: '升序规则1',
                icon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
                },
                selectedIcon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
                },
                stateIcon: {
                  width: 12,
                  height: 11,
                  svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opacity="0.9"></path></svg>'
                },
                menuKey: '升序规则1'
              },
              {
                text: '升序规则2',
                icon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
                },
                selectedIcon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
                },
                stateIcon: {
                  width: 12,
                  height: 11,
                  svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opacity="0.9"></path></svg>'
                },
                menuKey: '升序规则2'
              }
            ]
          },
          {
            text: '降序排序',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
            },
            selectedIcon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
            },
            stateIcon: {
              svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 38.5314L34.9864 48.5634L34.9864 4.01538H28.9864L28.9864 48.4974L18.9864 38.5014V46.9854L27.776 55.7727H27.7732L32.0158 60.0154L45.0144 47.0174V38.5314Z" fill="#161616" fill-opacity="0.9"></path></svg>'
            }
          },
          {
            text: '冻结列',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8H22V88H8V8ZM34 88V8H88V88H34ZM80 16H42V80H80V16Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
            }
          }
        ],
        contextMenuItems: ['复制', '粘贴']
      }
    };
    tableInstance = new VTable.ListTable(option);
    window['tableInstance'] = tableInstance;
  });
```

### contextMenuItems example right-click menu:

In this example, contextMenuItems is configured, and a drop-down menu pops up after the right mouse button:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/ffc3a9b5518762d274121ff08.png)

Other reference demo: https://visactor.io/vtable/demo/interaction/context-menu

### dropDownMenuHighlight menu initial selection status example:

     dropDownMenuHighlight: [
            {
              field:'Order ID',
              menuKey: '升序规则1'
            }
          ]

Subsequent clicks to switch states are available through the interface:

    setDropDownMenuHighlight(
    [
            {
              field:'Order ID',
              menuKey: '升序规则1'
            }
          ]
    )

## Global & Local Configuration

- Globally specifies the drop-down menu displayed on the header, the configuration form in the above example;

- Local configuration means that it can be configured on the header of a column.

In the example below, the drop-down menu is only configured on the first column:

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto',
        dropDownMenu: [
          {
            text: '升序排序',
            menuKey: '升序排序',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
            },
            selectedIcon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
            },
            stateIcon: {
              svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opacity="0.9"></path></svg>'
            },
            children: [
              {
                text: '升序规则1',
                menuKey: '升序规则1',
                icon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
                },
                selectedIcon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
                },
                stateIcon: {
                  width: 12,
                  height: 11,
                  svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opacity="0.9"></path></svg>'
                },
                menuKey: '升序规则1'
              },
              {
                text: '升序规则2',
                icon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
                },
                selectedIcon: {
                  svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 24L88 41.0286V53.0005L74.996 39.9755L74.9968 88.0005H66.9968L66.996 39.9835L54 53.0005V41.0286L71 24ZM48 80V88H8V80H48ZM48 44V52H8V44H48ZM88 8V16H8V8H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
                },
                stateIcon: {
                  width: 12,
                  height: 11,
                  svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 25.4994L34.9864 15.4674L34.9864 60.0154H28.9864L28.9864 15.5334L18.9864 25.5294V17.0454L27.776 8.25802H27.7732L32.0158 4.01538L45.0144 17.0134V25.4994Z" fill="#161616" fill-opacity="0.9"></path></svg>'
                },
                menuKey: '升序规则2'
              }
            ]
          },
          {
            text: '降序排序',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
            },
            selectedIcon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
            },
            stateIcon: {
              svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 38.5314L34.9864 48.5634L34.9864 4.01538H28.9864L28.9864 48.4974L18.9864 38.5014V46.9854L27.776 55.7727H27.7732L32.0158 60.0154L45.0144 47.0174V38.5314Z" fill="#161616" fill-opacity="0.9"></path></svg>'
            }
          },
          {
            text: '冻结列',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8H22V88H8V8ZM34 88V8H88V88H34ZM80 16H42V80H80V16Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
            }
          }
        ]
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto',
        style: {
          textAlign: 'left',
          textBaseline: 'middle',
          textOverflow: 'ellipsis',
          color: '#F66',
          fontSize: 14,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          fontStyle: 'italic'
        }
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      container: document.getElementById(CONTAINER_ID),
      records: data,
      columns,
      widthMode: 'standard',
      theme: VTable.themes.DEFAULT
    };
    tableInstance = new VTable.ListTable(option);
    window['tableInstance'] = tableInstance;
  });
```
