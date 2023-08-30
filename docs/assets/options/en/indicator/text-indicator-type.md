{{ target: text-indicator-type }}

#${prefix} indicators.text(string)

Specifies the column type as 'text'，columnType can be omitted and defaults to 'text'

##${prefix} columnType(string) = 'text'

Specifies the column type as 'text'，columnType can be omitted and defaults to 'text'

{{ use: base-indicator-type(
    prefix = '##'+${prefix}
) }}