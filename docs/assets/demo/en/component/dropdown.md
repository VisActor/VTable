---
category: examples
group: Component
title: Drop Down Menu
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/dropdown.png
order: 8-2
link: components/dropdown
option: ListTable-columns-text#dropDownMenu
---

# drop down menu

In this example, the dropDownMenu is configured in the first column of columns, and when hovered to the header cell, a drop-down menu is displayed for further operation.
At the same time through monitoring`click_cell`Event, when the mouse clicks the order icon in the first column, the interface showDropDownMenu is called to display the drop-down menu. To continue the operation according to the item clicked on the drop-down menu, you can listen to the event dropdownmenu_click.

## Key Configurations

- `dropDownMenu` Configure the drop-down menu at the header to display the content. After configuration, hover to the header cell to display the content. You can configure it separately or globally according to the header.

- `showDropDownMenu` Display the call interface for the drop-down menu

## Code demo

```javascript livedemo template=vtable
VTable.register.icon('order', {
  type: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/order.svg',
  width: 22,
  height: 22,
  name: 'order',
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 0,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});
VTable.register.icon('dropdownIcon', {
  name: 'dropdownIcon',
  type: 'svg',
  color: 'blue',
  positionType: VTable.TYPES.IconPosition.right,
  funcType: VTable.TYPES.IconFuncTypeEnum.dropDown,
  width: 20,
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
// VTable.register.icon('dropdownIcon',{
//     type: 'svg',
//     svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><rect x="2" y="1" width="20" height="20" rx="10" fill="white"/><rect x="2.5" y="1.5" width="19" height="19" rx="9.5" stroke="#959DA5"/></g><path d="M14.9492 9.39531C15.0086 9.31911 15.0165 9.21887 14.9698 9.1356C14.923 9.05234 14.8294 9 14.7273 9L9.27273 9C9.17057 9 9.07697 9.05234 9.03023 9.1356C8.98348 9.21887 8.99142 9.31911 9.0508 9.39531L11.7781 12.8953C11.8293 12.961 11.9119 13 12 13C12.0881 13 12.1707 12.961 12.2219 12.8953L14.9492 9.39531Z" fill="#4F5965"/></svg>',
//     width: 24, //其实指定的是svg图片绘制多大，实际下面的阴影是box，margin也是相对阴影范围指定的
//     height: 24,
//     funcType: VTable.TYPES.IconFuncTypeEnum.dropDown,
//     positionType: VTable.TYPES.IconPosition.absoluteRight,
//     // positionType: IconPosition.inlineEnd,
//     name: 'dropdownIcon',
//     marginRight: 0, //设计要求的是距离8px，这个些5是基于外面的box而言的
//     hover: {
//       width: 24,
//       height: 24,
//       bgColor: 'rgba(101, 117, 168, 0.1)',
//       image:
//         '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><rect x="2" y="1" width="20" height="20" rx="10" fill="#1E54C9"/><rect x="2.5" y="1.5" width="19" height="19" rx="9.5" stroke="#141414" stroke-opacity="0.2"/></g><path d="M14.9492 9.39531C15.0086 9.31911 15.0165 9.21887 14.9698 9.1356C14.923 9.05234 14.8294 9 14.7273 9L9.27273 9C9.17057 9 9.07697 9.05234 9.03023 9.1356C8.98348 9.21887 8.99142 9.31911 9.0508 9.39531L11.7781 12.8953C11.8293 12.961 11.9119 13 12 13C12.0881 13 12.1707 12.961 12.2219 12.8953L14.9492 9.39531Z" fill="white"/></svg>',
//     },
//     cursor: 'pointer',
//     visibleTime: 'mouseenter_cell',
//   }
// );

let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto',
        icon: 'order',
        dropDownMenu: [
          'default',
          {
            text: 'by Profit',
            icon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="#2e2f32" fill-opacity="0.9"></path></svg>'
              // svg: "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/order.svg",
              // width: 15,
              // height: 15,
            },
            selectedIcon: {
              svg: '<svg width="14" height="14" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 89.0005L54 71.9719L54 60L67.004 73.025L67.0032 25L75.0032 25L75.004 73.017L88 60V71.9719L71 89.0005ZM48 81V89H8V81H48ZM48 45V53H8V45H48ZM88 9V17H8V9H88Z" fill="rgb(55,145,255)" fill-opacity="0.9"></path></svg>'
            },
            stateIcon: {
              svg: '<svg width="12" height="11" viewBox="0 0 64 64" fill="#161616" xmlns="http://www.w3.org/2000/svg" class="visactor-table-action-area-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0144 38.5314L34.9864 48.5634L34.9864 4.01538H28.9864L28.9864 48.4974L18.9864 38.5014V46.9854L27.776 55.7727H27.7732L32.0158 60.0154L45.0144 47.0174V38.5314Z" fill="#161616" fill-opacity="0.9"></path></svg>'
            }
          }
        ]
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto'
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
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      allowFrozenColCount: 3,
      frozenColCount: 1
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;

    tableInstance.on('click_cell', args => {
      const { col, row, targetIcon } = args;
      if (col === 0 && row >= 1 && targetIcon?.name === 'order') {
        const { left, top, width, height, bottom, right } = targetIcon.position;
        tableInstance.showDropDownMenu(col, row, {
          content: [
            {
              type: 'title',
              text: 'action'
            },
            {
              text: 'delete',
              menuKey: 'delete',
              // icon: {
              //   svg:  "https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/order.svg",
              // },
              icon: {
                svg: '<svg t="1684643332116" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11284" width="200" height="200"><path d="M912.526651 867.741144 555.540144 510.712681l356.986507-357.000833c11.171434-11.18576 11.171434-29.257348 0-40.443108-11.20111-11.18576-29.272697-11.18576-40.444131 0L515.096013 470.267527 158.096203 113.267716c-11.187807-11.159154-29.258371-11.159154-40.444131 0-11.186783 11.186783-11.186783 29.286 0 40.47176L474.623229 510.712681 117.623419 867.741144c-11.159154 11.172457-11.159154 29.216415 0 40.443108 11.18576 11.17348 29.284977 11.17348 40.47176 0l357.000833-357.027439 356.985484 357.027439c11.171434 11.17348 29.243021 11.17348 40.444131 0C923.698085 896.957559 923.725714 878.913601 912.526651 867.741144z" fill="#5D5D5D" p-id="11285"></path></svg>',
                width: 15,
                height: 15
              }
            },
            {
              text: 'modify',
              menuKey: 'modify',
              icon: {
                width: 15,
                height: 15,
                svg: '<svg t="1684643607026" class="icon" viewBox="0 0 1069 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13141" width="200" height="200"><path d="M960.206979 1024H43.574468A43.620948 43.620948 0 0 1 0 980.425532V117.871841a43.620948 43.620948 0 0 1 43.574468-43.574468h516.421356a20.334752 20.334752 0 0 1 0 40.669504H43.574468a2.904965 2.904965 0 0 0-2.904964 2.904964v862.565311a2.904965 2.904965 0 0 0 2.904964 2.904964h916.644131a2.904965 2.904965 0 0 0 2.904964-2.904964V515.340709a20.334752 20.334752 0 0 1 40.669504 0v465.096443a43.620948 43.620948 0 0 1-43.586088 43.562848z" p-id="13142"></path><path d="M518.687228 570.418837a20.334752 20.334752 0 0 1-14.362144-34.731756L1035.120204 5.949367a20.334752 20.334752 0 0 1 28.72429 28.782389l-530.795121 529.737714a20.276652 20.276652 0 0 1-14.362145 5.949367z" p-id="13143"></path></svg>'
              }
            },
            {
              text: 'aggregation',
              menuKey: 'aggregation',
              icon: {
                width: 15,
                height: 15,
                svg: '<svg t="1684644028228" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15087" width="200" height="200"><path d="M390.208 300.5696h95.573333a32 32 0 0 1 0 64h-123.690666l-46.203734 105.169067H412.330667a32 32 0 0 1 0 64H287.773867L241.088 640h78.062933a32 32 0 1 1 0 64H212.970667l-61.8368 140.753067A21.333333 21.333333 0 0 0 170.666667 874.666667h245.969066a34.133333 34.133333 0 0 0 31.249067-20.4032L744.4352 179.242667A21.333333 21.333333 0 0 0 724.9024 149.333333h-254.3232a21.333333 21.333333 0 0 0-19.5328 12.753067L390.208 300.5696zM508.821333 874.666667H906.666667a32 32 0 1 1 0 64H170.666667c-47.1296 0-85.333333-38.203733-85.333334-85.333334a85.333333 85.333333 0 0 1 7.210667-34.321066l299.908267-682.666667A85.333333 85.333333 0 0 1 470.574933 85.333333H724.906667c47.1296 0 85.333333 38.203733 85.333333 85.333334a85.333333 85.333333 0 0 1-7.2064 34.321066L508.8256 874.666667z" fill="#333333" p-id="15088"></path></svg>'
              },
              children: [
                {
                  text: 'average',
                  menuKey: 'average'
                },
                {
                  text: 'sum',
                  menuKey: 'sum'
                }
              ]
            }
          ],
          referencePosition: {
            rect: {
              left,
              top,
              width,
              height,
              right,
              bottom
            }
          }
        });
      }
    });
    tableInstance.on('dropdown_menu_click', args => {
      console.log('dropdown_menu_click', args);
      tableInstance.setDropDownMenuHighlight([args]);
    });
  });
```
