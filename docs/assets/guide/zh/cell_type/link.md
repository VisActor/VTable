# link超链接类型

在日常数据分析过程中，我们经常会遇到一些需要查阅详情的数据，而且这些详情通常是另一个页面或者站点上的。在这种情况下，如果能把相关链接直接嵌入到表格中，将大大提高数据分析的工作效率。VTable 通过 link 超链接类型的配置实现了这一需求。

## 超链接类型特有配置

接下来，我们将逐一讲解 link 类型独有的配置项：

- `linkJump` 默认值为 `true`。如果此项为 `true`链接将可点击跳转到指定地址；若为 `false`，链接将不具跳转功能，仅以文本形式展。

- `linkDetect` 默认值为 `true`。当设置为 `true` 时，程序会对链接进行正则检测，只有符合 URL 规则的链接才会被展示成可点击的超链接。为模板链接类型，此配置项不生效。

- `templateLink` 用于定义模板链接地址。例如，配置为 `'https://www.google.com.hk/search?q={name}`，其中 `name` 是数据源属性字段名。这样可以更方便地快速生成链接地址。也可以配置为函数：`(record, col, row, table) => string`，其中 `record` 是当前行数据，`col` 是当前列索引，`row` 是当前行索引，`table` 是当前表格实例。

# 超链接在表格展示的示例

接下来，我们通过一个具体示例，来展示 link 类型如何应用在表格中。

假设我们拥有一个用户列表，其中包含了用户的姓名、生日、详细资料链接等信息。我们希望在表格中展示这些信息，并在查看详细资料时快速跳转到对应的页面。为此，我们可以样配置 ListTable：

```javascript livedemo template=vtable
const option = {
  columns: [
    {
      field: 'name',
      title: 'name',
      cellType: 'link',
      templateLink: 'https://www.google.com.hk/search?q={name}',
      linkJump: true,
      width: 'auto'
    },
    {
      field: 'link',
      title: 'persional link',
      cellType: 'link',
      linkJump: true,
      width: 'auto',
      fieldFormat(rec) {
        return rec['name'] + '\'s link'
      }
    },
    {
      "field": "age",
      "title": "age"
    },
    {
      "field": "sex",
      "title": "sex"
    },
    {
      "field": "phone",
      "title": "phone"
    },
    {
      "field": "address",
      "title": "address"
    },
  ],
  "records": [
    { "name": "zhang_san", "age": 20, "sex": "female", "phone": "123456789", "address": "beijing haidian", "link": 'https://www.google.com.hk' },
    { "name": "li_si", "age": 30, "sex": "female", "phone": "23456789", "address": "beijing chaoyang", "link": 'https://www.google.com.hk' },
    { "name": "wang_wu", "age": 40, "sex": "male", "phone": "3456789", "address": "beijing fengtai", "link": 'https://www.google.com.hk' }
  ]
}
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);

```

在这个配置中，我们包含了 `name`、`birthdate` 和 `profile_url` 字段。其中profile_url` 字段被设置为 link 类型，并且开启了 `linkJump` 和 `linkDetect` 配置。这样，当我们查看表格时，就可以看到详细资料的链接被正确显示在单元格中，并可以直接点击进入详情页面。
