# Link hyperlinke type

In the daily data analytics process, we often encounter some data that needs to be consulted in detail, and these details are usually on another page or site. In this case, if the relevant links can be embedded directly into the table, the work efficiency of data analytics will be greatly improved. VTable achieves this requirement through the configuration of the link hyperlinke type.

## Hyperlinke type specific configuration

Next, we will explain the configuration items unique to the link type one by one:

*   `linkJump` The default value is `true`If this is `true`The link will be clickable to jump to the specified address; if `false`, the link will not have a jump function and will only be displayed in text form.

*   `linkDetect` The default value is `true`When set to `true` The program will check the links regularly, and only links that meet the URL rules will be displayed as clickable hyperlinkes. For template link types, this configuration item does not take effect.

*   `templateLink` Used to define template link addresses. For example, configure to `'https://www.google.com.hk/search?q={name}`, in which `name` Is the field name of the data source property. This makes it easier to quickly generate link addresses. `templateLink` can also be a function `(record, col, row, table) => string`, `record` is the data record, `col` is the column index, `row` is the row index, `table` is the table instance. 

# Example of hyperlinke in table display

Next, we use a concrete example to show how the link type can be applied to a table.

Suppose we have a list of users that contains the user's name, birthday, details link, etc. We want to display this information in the table and quickly jump to the corresponding page when viewing the details. To do this, we can configure ListTable like this:

```javascript livedemo template=vtable
const option = {
  container: document.getElementById(CONTAINER_ID),
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
const tableInstance = new ListTable(option);

```

In this configuration, we include `name`,`birthdate` and `profile_url` Field. Where profile\_url`字段被设置为 link 类型，并且开启了`linkJump`和`linkDetect 'configuration. This way, when we view the table, we can see that the link to the details is displayed correctly in the cell, and we can click directly to the details page.
