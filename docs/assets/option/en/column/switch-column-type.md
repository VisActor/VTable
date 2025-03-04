{{ target: switch-cell-type }}

#${prefix} columns.switch(string)

Specifies the cell type of this column or row as 'switch'. If cellType is not specified, it defaults to 'text'

##${prefix} cellType(string) = 'switch'

Specifies the cell type of this column or row as 'switch'. If cellType is not specified, it defaults to 'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix},
    isSwitch = true
) }}

##${prefix} checked(boolean|Function) = false

**Switch type specific configuration**

Determines whether the switch is in checked state. Setting this here specifies the state for the entire column. If there is a corresponding state in the record data entry, the data state takes precedence

##${prefix} disable(boolean|Function) = false

**Switch type specific configuration**

Determines whether the switch is in a disabled state (preventing interaction)

##${prefix} checkedText(string)

**Switch type specific configuration**

The text content displayed when the switch is in checked state

##${prefix} uncheckedText(string)

**Switch type specific configuration**

The text content displayed when the switch is in unchecked state
