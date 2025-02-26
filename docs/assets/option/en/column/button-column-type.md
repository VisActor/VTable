{{ target: button-cell-type }}

#${prefix} columns.button(string)

Specifies the cell type of this column or row as 'button'. If cellType is not specified, it defaults to 'text'

##${prefix} cellType(string) = 'button'

Specifies the cell type of this column or row as 'button'. If cellType is not specified, it defaults to 'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix},
    isButton = true
) }}

##${prefix} text(string)

The button text content

##${prefix} disable(boolean|Function) = false

Determines whether the button is in a disabled state (preventing interaction)
