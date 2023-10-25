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

checkbook是否处于checked状态

##${prefix} disable(boolean|Function) = false

**checkbox 类型专属配置项**

checkbook是否处于禁止交互状态
