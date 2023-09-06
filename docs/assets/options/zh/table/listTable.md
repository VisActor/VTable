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

基本表格和VTable数据分析透视表(enableDataAnalysis=true)支持分页，透视组合图不支持分页。

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

{{ use: common-option-secondary(
    prefix = '#',
    tableType = 'listTable'
) }}
