{{ target: text-indicator-type }}

#${prefix} indicators.text(string)

指定列类型为'text'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'text'

指定列类型为'text'，cellType 缺省的话会被默认为'text'

{{ use: base-indicator-type(
    prefix = '##'+${prefix}
) }}
