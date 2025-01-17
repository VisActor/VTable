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

基本表格和 VTable 数据分析透视表支持分页，透视组合图不支持分页。

IPagination 的具体类型如下：

### totalCount (number)

数据总条数。

非必传！透视表中这个字段 VTable 会自动补充，帮助用户获取到总共数据条数

### perPageCount (number)

每页显示数据条数。

注意! 透视表中 perPageCount 会自动修正为指标数量的整数倍。

### currentPage (number)

当前页码。

## multipleSort (boolean)

启用多列排序。

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

{{ use: common-option-secondary(
    prefix = '#',
    tableType = 'listTable'
) }}

## hierarchyIndent(number)

展示为树形结构时，每层内容缩进值。

## hierarchyExpandLevel(number)

展示为树形结构时，默认展开层数。默认为 1 只显示根节点，配置为`Infinity`则全部展开。

## hierarchyTextStartAlignment(boolean) = false

同层级的结点是否按文字对齐 如没有收起展开图标的节点和有图标的节点文字对齐 默认 false

## frozenColDragHeaderMode(string) = 'fixedFrozenCount'

拖拽表头移动位置 针对冻结部分的规则 默认为 fixedFrozenCount

- "disabled"（禁止调整冻结列位置）：不允许其他列的表头移入冻结列，也不允许冻结列移出，冻结列保持不变。
- "adjustFrozenCount"（根据交互结果调整冻结数量）：允许其他列的表头移入冻结列，及冻结列移出，并根据拖拽的动作调整冻结列的数量。当其他列的表头被拖拽进入冻结列位置时，冻结列数量增加；当其他列的表头被拖拽移出冻结列位置时，冻结列数量减少。
- "fixedFrozenCount"（可调整冻结列，并维持冻结数量不变）：允许自由拖拽其他列的表头移入或移出冻结列位置，同时保持冻结列的数量不变。

## aggregation(Aggregation|CustomAggregation|Array|Function)

数据聚合汇总分析配置，全局配置每一列都将有聚合逻辑，也可以在列（columns）定义中配置，列中配置的优先级更高。

```
aggregation?:
    | Aggregation
    | CustomAggregation
    | (Aggregation | CustomAggregation)[]
    | ((args: {
        col: number;
        field: string;
      }) => Aggregation | CustomAggregation | (Aggregation | CustomAggregation)[] | null);
```

其中：

```
type Aggregation = {
  aggregationType: AggregationType;
  showOnTop?: boolean;
  formatFun?: (value: number, col: number, row: number, table: BaseTableAPI) => string | number;
};

type CustomAggregation = {
  aggregationType: AggregationType.CUSTOM;
  aggregationFun: (values: any[], records: any[]) => any;
  showOnTop?: boolean;
  formatFun?: (value: number, col: number, row: number, table: BaseTableAPI) => string | number;
};
```

## groupBy(string|string[])

开启分组展示功能，用于展示数据中分组字段的层级结构。值为分组字段名称，可以配置一个字段，也可以配置多个字段组成的数组。

## enableTreeStickCell(boolean) = false

开启分组标题吸附功能。

## groupTitleFieldFormat(Function)

自定义分组标题。

## groupTitleCustomLayout(CustomLayout)

分组标题自定义布局。

## customComputeRowHeight(Function)

代码 VTable 内部计算行高的方法，用户可以自定义计算行高的方法。如果返回 number 则是行高，如果返回 auto 则是自动行高，返回 undefined 则是默认行高。

```
customComputeRowHeight?: (computeArgs: { row: number; table: ListTableAPI }) => number|'auto'|undefined;
```

## tableSizeAntiJitter(boolean) = false

当表格出现抖动情况，请排查是否上层 dom 容器的宽高是小数引起的。如果不能保证是整数，请配置这个配置项为 true
