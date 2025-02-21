{{ target: switch-cell-type }}

#${prefix} columns.switch(string)

指定该列或该行单元格类型为'switch'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'switch'

指定该列或该行单元格类型为'switch'，cellType 缺省的话会被默认为'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix},
    isSwitch = true
) }}

##${prefix} checked(boolean|Function) = false

**switch 类型专属配置项**

switch 是否处于 checked 状态，在这里设置即指定整列的单选框状态，record 数据条目中如果有对应的状态，则优先采用数据中状态

##${prefix} disable(boolean|Function) = false

**switch 类型专属配置项**

switch 是否处于禁止交互状态

##${prefix} checkedText(string)

**switch 类型专属配置项**

switch 处于 checked 状态时的文本内容

##${prefix} uncheckedText(string)

**switch 类型专属配置项**

switch 处于 unchecked 状态时的文本内容
