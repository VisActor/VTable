# 数据过滤

VTable-Sheet提供强大的数据过滤功能，帮助用户快速找到所需数据。过滤功能支持多种过滤模式，包括按值过滤和按条件过滤。

过滤器功能的实现依赖于VTable的插件filter-plugin，在vtable-sheet中默认引入了该插件，该插件的教程请参考：[filter-plugin](../plugin/filter)。

如果想要修改插件的配置，请结合vtablePluginModules配置项来修改，具体请参考：[vtablePluginModules](../sheet/plugin)。

## 开启过滤功能

### 全局开启

可以在工作表sheet配置中启用过滤功能：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '数据表',
      filter: true,  // 为整个表格页启用过滤功能
      // ...其他配置
    }
  ]
});
```

### 针对特定列开启

也可以只为特定列启用过滤功能：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '数据表',
      columns: [
        { title: '姓名', filter: true },  // 只为姓名列启用过滤
        { title: '年龄' },                // 不启用过滤
        { title: '部门', filter: true }   // 只为部门列启用过滤
      ],
      // ...其他配置
    }
  ]
});
```

### 自定义过滤模式

默认过滤器面板中会同时支持按值过滤和按条件过滤。

可以指定支持的过滤模式：

```typescript
const sheetInstance = new VTableSheet(document.getElementById('container'), {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: '数据表',
      // 只启用条件过滤模式
      filter: { filterModes: ['byCondition'] },
      // ...其他配置
    }
  ]
});
```

支持的过滤模式有：
- `'byValue'`：基于值列表的过滤
- `'byCondition'`：基于条件的过滤

## 使用过滤功能

启用过滤功能后，表头单元格会显示过滤图标。点击图标将打开过滤菜单，用户可以选择过滤方式。

### 值列表过滤

值列表过滤显示列中的所有唯一值，用户可以通过勾选值来筛选数据：

<div style="display: flex; justify-content: center;  width:350px">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/byValue-fillter.png"  style="width: 100%; object-fit: contain; padding: 10px;">
</div>


### 条件过滤

条件过滤允许用户设置更复杂的过滤条件，如"大于"、"包含"等：

<div style="display: flex; justify-content: center;  width:350px">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/byCondition-filter.png"  style="width: 100%; object-fit: contain; padding: 10px;">
</div>

## 过滤事件监听
TODO
可以监听过滤状态变化：

```typescript
// 监听过滤器变化事件
sheetInstance.on('filterChange', (evt) => {
  console.log('过滤器变化:', evt);
  console.log('过滤列:', evt.columnKey);
  console.log('过滤条件:', evt.filter);
});

// 监听过滤器重置事件
sheetInstance.on('filterReset', () => {
  console.log('所有过滤器已重置');
});
```

## 完整过滤示例

以下是一个完整的数据过滤示例：

```javascript livedemo template=vtable
// 引入VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';
// 容器
const container = document.getElementById(CONTAINER_ID);
// 创建产品数据表
const productData = [
  ['产品', '价格', '库存', '销量', '评分'],
  ['笔记本电脑', 5999, 120, 78, 4.5],
  ['智能手机', 3999, 200, 156, 4.2],
  ['平板电脑', 2599, 150, 92, 4.0],
  ['耳机', 899, 300, 210, 4.7],
  ['鼠标', 129, 500, 310, 4.3],
  ['键盘', 239, 400, 180, 4.4],
  ['显示器', 1299, 100, 60, 4.6],
  ['摄像头', 399, 200, 85, 3.9],
  ['音箱', 599, 150, 75, 4.1],
  ['移动硬盘', 499, 250, 120, 4.2],
  ['充电器', 99, 600, 350, 4.0],
  ['手表', 1999, 80, 45, 4.8],
  ['路由器', 349, 180, 95, 4.3],
  ['打印机', 799, 70, 30, 4.0],
  ['投影仪', 3499, 40, 15, 4.5]
];

// 初始化VTableSheet
const sheet = new VTableSheet.VTableSheet(container, {
  sheets: [
    {
      sheetTitle: "产品数据",
      sheetKey: "products",
      columns: [
        { title: '产品', field: 'product' },
        { title: '价格', field: 'price' },
        { title: '库存', field: 'stock' },
        { title: '销量', field: 'sales' },
        { title: '评分', field: 'rating' }
      ], 
      data: productData,
      filter: true  //s 启用过滤功能
    }
  ]
});
window['sheetInstance'] = sheet;
```

通过这些过滤功能，用户可以快速筛选出所需数据，提高数据分析和处理的效率。

