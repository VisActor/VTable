{{ target: checkbox-cell-type }}

#${prefix} columns.checkbox(string)

Specify the column type as 'checkbox', cellType can be omitted and defaults to 'text'

##${prefix} cellType(string) = 'checkbox'

Specify the column type as 'checkbox', cellType can be omitted and defaults to 'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix},
    isCheckbox = true
) }}

##${prefix} checked(boolean|Function) = false

**Configuration item exclusive to checkbox type**

Whether the checkbook is in checked status

##${prefix} disable(boolean|Function) = false

**Configuration item exclusive to checkbox type**

Whether the checkbook is in a disabled interactive state
