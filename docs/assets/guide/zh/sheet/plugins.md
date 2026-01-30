# 插件功能

VTable-Sheet中目前使用到了VTable的几个插件，具体包括：
- [filter-plugin](../plugin/filter) 筛选插件
- [auto-fill-plugin](../plugin/auto-fill) 自动填充插件
- [table-series-number-plugin](../plugin/table-series-number) 表格序号插件
- [highlight-header-when-select-cell-plugin](../plugin/header-highlight) 选中高亮表头插件
- [context-menu-plugin](../plugin/context-menu) 右键菜单插件
- [table-export-plugin](../plugin/table-export) 表格导出插件
- [excel-import-plugin](../plugin/excel-import) 表格导入插件

原理主要是因为每个sheet是个VTable实例，所以可以像VTable一样使用其插件。

也因为如此，所以插件只能作用到单个的sheet上，不能作用到整个VTableSheet上。像导入导出这种能力，导入excel文件只能导入到当前的sheet中，而不是将文件中所有sheet都导入到VTableSheet中，导出时也只能导出当前的sheet。

**后续会为VTableSheet提供插件扩展的能力，而不必拘泥于单个sheet的限制。 也希望大家能贡献一些插件，来丰富VTableSheet的功能。**


## 配置插件

除了上面提到的VTableSheet中已经内置集成的插件，VTableSheet还支持用户通过VTablePluginModules配置插件，来扩展VTableSheet的表格插件功能。

引用插件前一定要确保@visactor/vtable-plugins和VTableSheet引用的版本一致，否则可能会出现插件不生效的情况。且熟知插件使用教程，具体可以参考[VTable插件使用教程](../plugin/usage.md)。如果想要扩展VTable的插件，可以参考[VTable插件贡献](../plugin/contribute.md)。

配置示例：在VTableSheet初始化时配置循环滚动动画插件，来实现表格的循环滚动：

```javascript livedemo template=vtable
// 引入所需插件包 需要确保版本和VTableSheet中引用的版本一致
// import * as VTablePlugins from '@visactor/vtable-plugins';

// 引入VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';

 const container = document.getElementById(CONTAINER_ID);
// 创建VTableSheet实例并配置插件
const sheetInstance = new VTableSheet.VTableSheet(container, {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    {
      sheetKey: "employees",
      sheetTitle: "员工信息",
      rowCount: 35,
      columns: [
        { title: '姓名', width: 100 },
        { title: '年龄', width: 80 },
        { title: '部门', width: 120 }
      ],
      data: [
        ['赵一', 25, '技术部'],
        ['钱二', 26, '技术部'],
        ['张三', 28, '技术部'],
        ['李四', 32, '市场部'],
        ['王五', 25, '技术部'],
        ['赵六', 26, '技术部'],
        ['孙七', 27, '技术部'],
        ['周八', 28, '技术部'],
        ['吴九', 29, '技术部'],
        ['郑十', 30, '技术部'],
        ['陈十一', 31, '技术部'],
        ['魏十二', 32, '技术部'],
        ['陆十三', 33, '技术部'],
        ['侯十四', 34, '技术部'],
        ['穆十五', 35, '技术部'],
        ['杨十六', 36, '技术部'],
        ['段十七', 37, '技术部'],
        ['洪十八', 38, '技术部'],
        ['屠十九', 39, '技术部'],
        ['虞二十', 40, '技术部'],
        ['卢二十一', 41, '技术部'],
        ['邬二十二', 42, '技术部'],
        ['乔二十三', 43, '技术部'],
        ['湛二十四', 44, '技术部'],
        ['成二十五', 45, '技术部'],
        ['尤二十六', 46, '技术部'],
        ['汪二十七', 47, '技术部'],
        ['祁二十八', 48, '技术部'],
        ['毛二十九', 49, '技术部'],
        ['狄三十', 50, '技术部'],
        ['纪三十一', 51, '技术部'],
        ['赖三十二', 52, '技术部'],
        ['简三十三', 53, '技术部'],
        ['干三十四', 54, '技术部'],
        ['翁三十五', 55, '技术部'],
      ],
      active: true
    }
  ],
  VTablePluginModules: [
    // Excel导入插件
    {
      module: VTablePlugins.TableCarouselAnimationPlugin,
      moduleOptions:
      {
        rowCount: 10,
        animationDuration: 1000,
        animationDelay: 1000,
        animationEasing: 'linear',
        autoPlay: true,
        autoPlayDelay: 1000,
      }
    },
   
  ]
});
```

## 修改内置插件的配置

VTableSheet中内置的插件，可以通过VTablePluginModules配置插件，来修改插件的配置，内置插件有默认的配置项，用户配置会覆盖内置的默认配置，具体插件初始化代码逻辑地址：https://github.com/VisActor/VTable/blob/develop/packages/vtable-sheet/src/core/table-plugins.ts

具体以修改表格序号插件颜色为例：

```javascript livedemo template=vtable
// 引入所需插件包 需要确保版本和VTableSheet中引用的版本一致
// import * as VTablePlugins from '@visactor/vtable-plugins';

// 引入VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';

 const container = document.getElementById(CONTAINER_ID);
// 创建VTableSheet实例并配置插件
const sheetInstance = new VTableSheet.VTableSheet(container, {
  sheets: [
    {
      sheetKey: "employees",
      sheetTitle: "员工信息",
      rowCount: 35,
      columns: [
        { title: '姓名', width: 100 },
        { title: '年龄', width: 80 },
        { title: '部门', width: 120 }
      ],
      data: [
        ['赵一', 25, '技术部'],
        ['钱二', 26, '技术部'],
        ['张三', 28, '技术部'],
        ['李四', 32, '市场部']
      ],
      active: true
    }
  ],
  VTablePluginModules: [
   {
        module: VTablePlugins.TableSeriesNumber,
        moduleOptions: {
        rowSeriesNumberCellStyle: {
         text: {
            fontSize: 14,
            fill: 'red',
            pickable: false,
            textAlign: 'left',
            textBaseline: 'middle',
            padding: [2, 4, 2, 4]
          },
          borderLine: {
            stroke: '#D9D9D9',
            lineWidth: 1,
            pickable: false
          }
        }
      }
    }
  ]
});
```

## 禁用内置插件

如果想要禁用内置插件，可以通过VTablePluginModules配置插件，来禁用内置插件。
如禁用表格右键插件：

```javascript 
VTablePluginModules: [
  {
    module: VTablePlugins.ContextMenuPlugin,
    disabled: true
  }
]
```

## 插件与菜单的组合使用

插件与菜单的组合使用，具体菜单的配置可以参考[菜单配置](./menu.md)。

这里主要介绍说明菜单中增加导入导出的功能，在配置VTablePluginModules中需要明确配置所需的`ExcelImportPlugin`及`TableExportPlugin`插件。

下面示例中配置了mainMenu，UI左上角将出现主菜单按钮，点击主菜单按钮将出现导入导出功能，如图所示：

<div style="display: flex; justify-content: center;  width: 50%;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/mainMenu.png"  style="width: 100%; object-fit: contain; padding: 10px;">
</div>

具体demo如：

```javascript livedemo template=vtable
// 引入所需插件包 需要确保版本和VTableSheet中引用的版本一致
// import * as VTablePlugins from '@visactor/vtable-plugins';

// 引入VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';

 const container = document.getElementById(CONTAINER_ID);
// 创建VTableSheet实例并配置插件
const sheetInstance = new VTableSheet.VTableSheet(container, {
  sheets: [
    {
      sheetKey: "employees",
      sheetTitle: "员工信息",
      rowCount: 35,
      columns: [
        { title: '姓名', width: 100 },
        { title: '年龄', width: 80 },
        { title: '部门', width: 120 }
      ],
      data: [
        ['赵一', 25, '技术部'],
        ['钱二', 26, '技术部'],
        ['张三', 28, '技术部'],
        ['李四', 32, '市场部']
      ],
      active: true
    }
  ],
  // 基本配置...
  VTablePluginModules: [
    // Excel导入插件
    {
      module: VTablePlugins.ExcelImportPlugin,
      moduleOptions: {
        // id: 'excel-import-plugin',
        // exportData: true,  // 是否支持导出功能
        // importData: true,  // 是否支持导入功能
        // fileTypes: ['xlsx', 'csv']  // 支持的文件类型
      }
    },
    // 表格导出插件
    {
      module: VTablePlugins.TableExportPlugin
    }
  ],
  
  // 配置主菜单中的导入导出选项
  mainMenu: {
    show: true,
    items: [
      {
        name: '导入',
        menuKey: 'import',
        description: '导入数据替换到当前sheet'
      },
      {
        name: '导出',
        items: [
          {
            name: '导出CSV',
            menuKey: 'export-current-sheet-csv',
            description: '导出当前sheet数据到csv'
          },
          {
            name: '导出XLSX',
            menuKey: 'export-current-sheet-xlsx',
            description: '导出当前sheet数据到xlsx'
          },
          {
            name: '导出所有表格',
            menuKey: 'export-all-sheets-xlsx',
            description: '导出所有表格页到xlsx'
          }
        ]
      }
    ]
  },
  dragOrder: {
    enableDragColumnOrder: true,
    enableDragRowOrder: true
  }
});
```


示例中的MenuKey是VTableSheet内部定义的菜单键值。

```typescript
export enum MenuKey {
  /** 需要插件支持，请在plugins中配置 ExcelImportPlugin */
  IMPORT = 'import',
  /** 需要插件支持，请在plugins中配置 TableExportPlugin */
  EXPORT_CURRENT_SHEET_CSV = 'export-current-sheet-csv',
  /** 需要插件支持，请在plugins中配置 TableExportPlugin */
  EXPORT_CURRENT_SHEET_XLSX = 'export-current-sheet-xlsx'
}
```

上面的导入导出功能，也可以通过API调用，初始化成功后的VTableSheet示例提供以下API来调用导入导出功能：
- exportSheetToFile
- importFileToSheet

通过插件系统，可以极大地扩展VTable-Sheet的功能，满足各种复杂的业务需求。如果想要自定义插件可以参考[插件贡献](../plugin/contribute.md)

