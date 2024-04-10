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

Whether the checkbox is in the checked state, setting here means specifying the checkbox state of the entire column. If there is a corresponding state in the record data entry, the state in the data will be used first.

If headerType is set to `checkbox`, the status of the header checkbox will depend on this setting. If this setting is empty, it will depend on the checked status of each piece of data.

##${prefix} disable(boolean|Function) = false

**Configuration item exclusive to checkbox type**

Whether the checkbox is in a disabled interactive state
