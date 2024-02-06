{{ target: table-listTable }}

# ListTable

基本表格，配置对应的类型 ListTableConstructorOptions，具体配置项如下：

{{ use: common-option-important(
    prefix = '#',
    tableType = 'listTable'
) }}

## records(Array)

表格数据。
目前支持的数据格式，以人的信息为例：

```
[
  {"name": "张三","age": 20,"sex": "male","phone": "123456789","address": "北京市海淀区"},
  {"name": "李四","age": 30,"sex": "female","phone": "23456789","address": "北京市海淀区"},
  {"name": "王五","age": 40,"sex": "male","phone": "3456789","address": "北京市海淀区"}
]
```

{{ use: column-define( prefix = '#',) }}

## transpose(boolean) = false

是否转置 默认 false

## showHeader(boolean) = true

是否显示表头。

## pagination(IPagination)

分页配置。

基本表格和VTable数据分析透视表支持分页，透视组合图不支持分页。

IPagination 的具体类型如下：

### totalCount (number)

数据总条数。

非必传！透视表中这个字段VTable会自动补充，帮助用户获取到总共数据条数

### perPageCount (number)

每页显示数据条数。

注意! 透视表中perPageCount会自动修正为指标数量的整数倍。

### currentPage (number)

当前页码。

## sortState(SortState | SortState[])

排序状态。SortState 定义如下：

```
SortState {
  /** 排序依据字段 */
  field: string;
  /** 排序规则 */
  order: 'desc' | 'asc' | 'normal';
}
```

## editor (string|Object|Function)

全局配置单元格编辑器
```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```
其中IEditor是@visactor/vtable-editors中定义的编辑器接口，具体可以参看源码：https://github.com/VisActor/VTable/blob/main/packages/vtable-editors/src/types.ts。

${prefix} headerEditor (string|Object|Function)

全局配置表头显示标题title的编辑器
```
headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```

{{ use: common-option-secondary(
    prefix = '#',
    tableType = 'listTable'
) }}

## hierarchyIndent(number)

展示为树形结构时，每层内容缩进值。

## hierarchyExpandLevel(number)

展示为树形结构时，默认展开层数。默认为1只显示根节点，配置为`Infinity`则全部展开。


## frozenColDragHeaderMode(string) = 'fixedFrozenCount'

拖拽表头移动位置 针对冻结部分的规则  默认为fixedFrozenCount

- "disabled"（禁止调整冻结列位置）：不允许其他列的表头移入冻结列，也不允许冻结列移出，冻结列保持不变。
- "adjustFrozenCount"（根据交互结果调整冻结数量）：允许其他列的表头移入冻结列，及冻结列移出，并根据拖拽的动作调整冻结列的数量。当其他列的表头被拖拽进入冻结列位置时，冻结列数量增加；当其他列的表头被拖拽移出冻结列位置时，冻结列数量减少。
- "fixedFrozenCount"（可调整冻结列，并维持冻结数量不变）：允许自由拖拽其他列的表头移入或移出冻结列位置，同时保持冻结列的数量不变。