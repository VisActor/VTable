{{ target: text-dimension-type }}

#${prefix} ${dimensionHeaderType}.text(string)

Specify the column type as 'text', headerType can be omitted and the default is 'text'

##${prefix} headerType(string) = 'text'

Specify the column type as 'text', headerType can be omitted and the default is 'text'

{{ use: base-dimension-type(
    prefix = '##'+${prefix}
) }}