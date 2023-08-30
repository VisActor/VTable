{{ target: text-indicator-type }}

#${prefix} indicators.text(string)

指定列类型为'text'，columnType 缺省的话会被默认为'text'

##${prefix} columnType(string) = 'text'

指定列类型为'text'，columnType 缺省的话会被默认为'text'

{{ use: base-indicator-type(
    prefix = '##'+${prefix}
) }}
