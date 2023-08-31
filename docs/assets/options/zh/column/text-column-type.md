{{ target: text-column-type }}

#${prefix} columns.text(string)

指定列类型为'text'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'text'

指定列类型为'text'，cellType 缺省的话会被默认为'text'

{{ use: base-column-type(
    prefix = '##'+${prefix}
) }}

##${prefix} mergeCell(boolean) = false

**text 类型专属配置项** 是否对相同内容合并单元格

可参考示例：[TODO](url)
