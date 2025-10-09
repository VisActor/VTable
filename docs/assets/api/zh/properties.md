{{ target: table-properties }}

# Properties

表格实例的属性列表，包含可读写的配置属性。注意：部分属性为只读，直接赋值不会触发表格重绘，必须使用对应的更新方法才能生效。

## records

表格的数据源数组，包含所有要显示的数据记录。这是一个**只读属性**，用于获取当前表格数据，不支持直接赋值修改。

**类型：** `Array<any>`

```javascript
// ✅ 正确：使用setRecords方法更新数据
tableInstance.setRecords([
  { name: '张三', age: 25, department: '技术部' },
  { name: '李四', age: 30, department: '市场部' }
]);

```

**注意事项：**
- `records`属性是**只读的**，直接赋值不会触发表格重绘
- 要更新数据，必须使用`setRecords()`方法
- `setRecords()`会处理数据排序、状态更新、布局重计算等完整流程

## rowCount

表格的总行数，包括表头和数据行。这是一个只读属性，表示当前表格中的总行数。

**类型：** `number`

**使用示例：**
```javascript
const totalRows = tableInstance.rowCount;
console.log('表格总行数:', totalRows);

// 遍历所有行
for (let row = 0; row < tableInstance.rowCount; row++) {
  for (let col = 0; col < tableInstance.colCount; col++) {
    const value = tableInstance.getCellValue(col, row);
    console.log(`单元格[${col},${row}]:`, value);
  }
}
```

**注意事项：**
- 包含表头行和数据行
- 对于透视表，包含行表头层级
- 是动态计算的，会根据数据变化自动更新

## colCount

表格的总列数，包括行表头和数据列。这是一个只读属性，表示当前表格中的总列数。

**类型：** `number`

**使用示例：**
```javascript
const totalCols = tableInstance.colCount;
console.log('表格总列数:', totalCols);

// 检查列索引是否有效
function isValidCell(col, row) {
  return col >= 0 && col < tableInstance.colCount &&
         row >= 0 && row < tableInstance.rowCount;
}

// 获取最后一列的数据
const lastCol = tableInstance.colCount - 1;
for (let row = 0; row < tableInstance.rowCount; row++) {
  const value = tableInstance.getCellValue(lastCol, row);
  console.log(`最后一列第${row}行:`, value);
}
```

**注意事项：**
- 包含行表头列和数据列
- 对于透视表，包含列表头层级
- 是动态计算的，会根据列配置变化自动更新

## rowHeaderLevelCount

行表头的层数

## columnHeaderLevelCount

列表头的层数

## frozenColCount

冻结列数

## frozenRowCount

冻结行数

## rightFrozenColCount

右侧冻结列数

## bottomFrozenRowCount

底部冻结行数

## theme

表格的主题配置对象，控制表格的整体外观样式，包括颜色、字体、边框等。只读属性。

**类型：** `ITableThemeDefine`

**使用示例：**
```javascript
// 获取当前主题
const currentTheme = tableInstance.theme;
console.log('当前主题配置:', currentTheme);

// 使用updateTheme方法（自动刷新）
tableInstance.updateTheme({
  headerStyle: {
    bgColor: '#f0f0f0',
    fontSize: 14,
    fontWeight: 'bold'
  },
  bodyStyle: {
    bgColor: '#ffffff',
    fontSize: 12
  }
}); // 推荐方式，自动处理刷新
```

**重要注意事项：**
- ⚠️ **或者使用`updateTheme()`方法，它会自动处理刷新**
- 主题配置包含多个层级：表格级、列级、单元格级
- 修改主题会影响整个表格的外观样式

## widthMode

表格的宽度模式，控制列宽如何计算和调整。

**类型：** `'standard' | 'adaptive' | 'autoWidth'`

**默认值：** `'standard'`

**模式说明：**
- `'standard'`: 标准模式，使用配置的列宽或默认列宽
- `'adaptive'`: 自适应模式，表格宽度自动适应容器宽度
- `'autoWidth'`: 自动宽度模式，列宽根据内容自动调整

**使用示例：**
```javascript
// 获取当前宽度模式
const currentMode = tableInstance.widthMode;
console.log('当前宽度模式:', currentMode);

// 设置宽度模式（需要手动刷新才能生效）
tableInstance.widthMode = 'adaptive';
tableInstance.renderWithRecreateCells(); // 必须手动刷新！

// 批量更新多个配置时，最后统一刷新
tableInstance.widthMode = 'autoWidth';
tableInstance.heightMode = 'autoHeight';
tableInstance.autoWrapText = true;
tableInstance.renderWithRecreateCells(); // 统一刷新
```

**重要注意事项：**
- ⚠️ **直接赋值不会自动触发表格重绘**
- ⚠️ **必须手动调用`renderWithRecreateCells()`方法才能生效**
- 不同模式会影响列宽的计算方式
- 在'autoWidth'模式下，列宽会根据最长内容自动调整
- 建议批量更新配置后统一刷新，避免重复渲染

## heightMode

表格的高度模式，控制行高如何计算和调整。

**类型：** `'standard' | 'adaptive' | 'autoHeight'`

**默认值：** `'standard'`

**模式说明：**
- `'standard'`: 标准模式，使用配置的行高或默认行高
- `'adaptive'`: 自适应模式，表格高度自动适应容器高度
- `'autoHeight'`: 自动高度模式，行高根据内容自动调整

**使用示例：**
```javascript
// 获取当前高度模式
const currentMode = tableInstance.heightMode;
console.log('当前高度模式:', currentMode);

// 设置高度模式（需要手动刷新才能生效）
tableInstance.heightMode = 'adaptive';
tableInstance.renderWithRecreateCells(); // 必须手动刷新！

// 批量更新多个配置时，最后统一刷新
tableInstance.widthMode = 'autoWidth';
tableInstance.heightMode = 'autoHeight';
tableInstance.autoWrapText = true;
tableInstance.renderWithRecreateCells(); // 统一刷新
```

**重要注意事项：**
- ⚠️ **直接赋值不会自动触发表格重绘**
- ⚠️ **必须手动调用`renderWithRecreateCells()`方法才能生效**
- 不同模式会影响行高的计算方式
- 在'autoHeight'模式下，行高会根据内容自动调整
- 建议批量更新配置后统一刷新，避免重复渲染

## autoWrapText

控制表格中的文字是否自动换行。当设置为true时，文字内容超出列宽时会自动换行显示。

**类型：** `boolean`

**默认值：** `false`

**使用示例：**
```javascript
// 获取当前自动换行设置
const currentWrap = tableInstance.autoWrapText;
console.log('当前自动换行:', currentWrap);

// 设置自动换行（需要手动刷新才能生效）
tableInstance.autoWrapText = true;
tableInstance.renderWithRecreateCells(); // 必须手动刷新！

// 使用updateAutoWrapText方法（自动刷新）
tableInstance.updateAutoWrapText(true); // 推荐方式，自动处理刷新

// 批量更新多个配置时，最后统一刷新
tableInstance.autoWrapText = true;
tableInstance.heightMode = 'autoHeight'; // 通常配合自动高度模式使用
tableInstance.renderWithRecreateCells(); // 统一刷新
```

**重要注意事项：**
- ⚠️ **直接赋值不会自动触发表格重绘**
- ⚠️ **必须手动调用`renderWithRecreateCells()`方法才能生效**
- ⚠️ **或者使用`updateAutoWrapText()`方法，它会自动处理刷新**
- 开启后会影响行高计算
- 通常与`heightMode = 'autoHeight'`配合使用以获得最佳效果
- 对于包含长文本的表格，开启此功能可以提高可读性

## columns

表格的列配置数组，定义每一列的显示属性、数据字段、样式等配置信息。这是一个**只读属性**，用于获取当前列配置，不支持直接赋值修改。

**类型：** `ColumnsDefine[]`

**访问示例：**
```javascript
// 获取当前列配置（只读访问）
const currentColumns = tableInstance.columns;
console.log('当前列配置:', currentColumns);
console.log('列数:', currentColumns.length);
```

```javascript
// ✅ 正确：使用updateColumns方法更新列配置
tableInstance.updateColumns([
  {
    field: 'name',
    title: '姓名',
    width: 100,
    sort: true
  },
  {
    field: 'age',
    title: '年龄',
    width: 80,
    sort: true
  }
]);

```

**注意事项：**
- `columns`属性是**只读的**，直接赋值不会触发表格重绘
- 要更新列配置，必须使用`updateColumns()`方法
- `updateColumns()`会处理布局重计算、场景图重建等完整流程
- 直接修改返回的数组不会影响表格显示

## transpose

控制表格是否转置显示。当设置为true时，行和列会互换位置，原来的列会变成行，原来的行会变成列。

**类型：** `boolean`

**默认值：** `false`

**使用示例：**
```javascript
// 获取当前转置状态
const isTransposed = tableInstance.transpose;
console.log('是否转置:', isTransposed);

// 开启转置
tableInstance.transpose = true;

// 关闭转置
tableInstance.transpose = false;

// 切换转置状态
tableInstance.transpose = !tableInstance.transpose;
```

**注意事项：**
- 修改后会完全改变表格的显示结构
- 会影响所有与行列相关的操作
- 在透视表中使用时要特别注意维度的变化

## rowHierarchyType

控制透视表中行层次结构的显示方式，支持平铺和树形两种模式。只读属性。

**类型：** `'grid' | 'tree'`

**默认值：** `'grid'`

**透视表专有**

**模式说明：**
- `'grid'`: 平铺模式，所有层次结构在同一级别展开显示
- `'tree'`: 树形模式，层次结构以树形结构显示，支持展开收起

**使用示例：**
```javascript
// 获取当前层次结构类型
const hierarchyType = tableInstance.rowHierarchyType;
console.log('行层次结构类型:', hierarchyType);
```

**注意事项：**
- 仅在透视表中有效
- 树形模式下需要配合展开收起功能使用

## scrollLeft

表格横向滚动条的位置，表示表格内容在水平方向上滚动的像素距离。这是一个可读写属性，可以直接赋值设置滚动位置。

**类型：** `number`

**默认值：** `0`

**使用示例：**
```javascript
// 获取当前横向滚动位置
const currentScrollLeft = tableInstance.scrollLeft;
console.log('当前横向滚动位置:', currentScrollLeft);

// 设置横向滚动位置（支持直接赋值）
tableInstance.scrollLeft = 200; // 滚动到200像素位置

// 滚动到最右侧
const maxScrollLeft = tableInstance.getAllColsWidth() - tableInstance.tableNoFrameWidth;
tableInstance.scrollLeft = maxScrollLeft;

// 使用scrollTo方法（推荐方式）
tableInstance.scrollTo({ col: 5, row: 0 }); // 滚动到第6列
```

**重要注意事项：**
- ✅ **支持直接赋值**，赋值后会自动触发表格重绘
- 数值单位是像素，表示滚动的距离
- 可以配合`scrollToCell`或`scrollTo`方法使用
- 设置值超出范围时会自动调整到有效范围内


## scrollTop

表格纵向滚动条的位置，表示表格内容在垂直方向上滚动的像素距离。这是一个可读写属性，可以直接赋值设置滚动位置。

**类型：** `number`

**默认值：** `0`

**使用示例：**
```javascript
// 获取当前纵向滚动位置
const currentScrollTop = tableInstance.scrollTop;
console.log('当前纵向滚动位置:', currentScrollTop);

// 设置纵向滚动位置（支持直接赋值）
tableInstance.scrollTop = 150; // 滚动到150像素位置

// 滚动到最底部
const maxScrollTop = tableInstance.getAllRowsHeight() - tableInstance.tableNoFrameHeight;
tableInstance.scrollTop = maxScrollTop;

// 使用scrollTo方法（推荐方式）
tableInstance.scrollTo({ col: 0, row: 10 }); // 滚动到第11行
```

**重要注意事项：**
- ✅ **支持直接赋值**，赋值后会自动触发表格重绘
- 数值单位是像素，表示滚动的距离
- 可以配合`scrollToCell`或`scrollTo`方法使用
- 设置值超出范围时会自动调整到有效范围内


## pixelRatio

画布的像素比，控制表格在高DPI屏幕上的显示清晰度。只读属性。

**类型：** `number`

**默认值：** `window.devicePixelRatio || 1`

**使用示例：**
```javascript
// 获取当前像素比
const currentPixelRatio = tableInstance.pixelRatio;
console.log('当前像素比:', currentPixelRatio);

// 设置像素比以提高显示清晰度（支持直接赋值）
tableInstance.setPixelRatio(2); // 设置为2倍像素比

// 根据设备自动调整
const dpr = window.devicePixelRatio || 1;
tableInstance.setPixelRatio(dpr);

// 批量更新配置时统一刷新
const originalPixelRatio = tableInstance.pixelRatio;
tableInstance.setPixelRatio(1.5);
```

**重要注意事项：**
- 数值越大，显示越清晰，但性能消耗也越大
- 通常设置为`window.devicePixelRatio`以获得最佳显示效果,如果浏览器进行了缩放，则需要设置为浏览器缩放后的像素比
- 修改后会影响整个表格的渲染质量
- 在Retina屏幕等高DPI设备上建议设置为2或更高
