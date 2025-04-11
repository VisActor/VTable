# 行列新增插件

## 功能介绍

AddRowColumnPlugin 是为了扩展VTable支持动态新增行列而写的插件。

该插件监听了`vTable`实例的 `MOUSEENTER_CELL`, `MOUSELEAVE_CELL`, `MOUSELEAVE_TABLE`事件!

当鼠标hover到table的cell时，会显示添加行和列的dot和加号；当鼠标离开table的cell时，会隐藏添加行和列的dot和加号。

## 插件配置

添加行和列的插件的配置选项：

```ts
export interface AddRowColumnOptions {
  /**
   * 是否启用添加列
   */
  addColumnEnable?: boolean;
  /**
   * 是否启用添加行
   */
  addRowEnable?: boolean;
  /**
   * 添加列的回调函数
   */
  addColumnCallback?: (col: number) => void;
  /**
   * 添加行的回调函数
   */
  addRowCallback?: (row: number) => void;
}
```

## 插件示例
初始化插件对象，添加到vTable配置的plugins中。
```
const addRowColumn = new AddRowColumnPlugin();
const option = {
  records,
  columns,
  padding: 30,
  plugins: [addRowColumn]
};
```
为了能控制新增行数据的内容，以及控制新增列后数据的更新以及columns的信息，可以使用插件提供的配置项来优化使用，在初始化插件对象时提供新增行列的勾子函数，在函数中赋值新增的行数据或者列信息。
```ts
 const addRowColumn = new AddRowColumnPlugin({
    addColumnCallback: col => {
      columns.splice(addColIndex, 0, {
          field: ``,
          title: `New Column ${col}`,
          width: 100
        });
      this.table.updateColumns(columns);
      const newRecords = tableInstance.records.map(record => {
        if (Array.isArray(record)) {
          record.splice(col - 1, 0, '');
        }
        return record;
      });
      tableInstance.setRecords(newRecords);
    },
    addRowCallback: row => {
      tableInstance.addRecord([], row - tableInstance.columnHeaderLevelCount);
    }
  });
```