{{ target: checkbox-cell-type }}

#${prefix} columns.checkbox(string)

指定该列或该行单元格类型为'checkbox'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'checkbox'

指定该列或该行单元格类型为'checkbox'，cellType 缺省的话会被默认为'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix},
    isCheckbox = true
) }}

##${prefix} checked(boolean|Function) = false

**checkbox 类型专属配置项**

checkbox是否处于checked状态，在这里设置即指定整列的复选框状态，record数据条目中如果有对应的状态，则优先采用数据中状态

如果设置了headerType为`checkbox`，表头复选框的状态会取决于该设置，如果该设置为空，取决于每条数据的checked状态。

##${prefix} disable(boolean|Function) = false

**checkbox 类型专属配置项**

checkbox是否处于禁止交互状态
