{{ target: button-cell-type }}

#${prefix} columns.button(string)

指定该列或该行单元格类型为'button'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'button'

指定该列或该行单元格类型为'button'，cellType 缺省的话会被默认为'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix},
    isButton = true
) }}

##${prefix} text(string)

按钮文本内容

##${prefix} disable(boolean|Function) = false

按钮是否处于禁止交互状态
