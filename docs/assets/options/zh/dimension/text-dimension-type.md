{{ target: text-dimension-type }}

#${prefix} ${dimensionHeaderType}.text(string)

指定列类型为'text', headerType可缺省默认为'text'

##${prefix} headerType(string) = 'text'

指定列类型为'text', headerType可缺省默认为'text'

{{ use: base-dimension-type(
    prefix = '##'+${prefix}
) }}
