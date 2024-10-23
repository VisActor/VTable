{{ target: radio-cell-type }}

#${prefix} columns.radio(string)

Specify the column type as 'radio', cellType can be omitted and defaults to 'text'

##${prefix} cellType(string) = 'radio'

Specify the column type as 'radio', cellType can be omitted and defaults to 'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix},
    isRadio = true
) }}

##${prefix} checked(boolean|Function) = false

**Configuration item exclusive to radio type**

Whether the checkbox is in the checked state, setting here means specifying the checkbox state of the entire column. If there is a corresponding state in the record data entry, the state in the data will be used first.

##${prefix} disable(boolean|Function) = false

**Configuration item exclusive to radio type**

Whether the checkbox is in a disabled interactive state

##${prefix} radioCheckType('cell' | 'column') = 'column'

**Configuration item exclusive to radio type**

 The only range of the radio button, the default value is `column`:

  * `column`: The radio button is the only one selected in a column
  * `cell`: The radio button is uniquely selected in a cell

##${prefix} radioDirectionInCell('vertical' | 'horizontal') = 'vertical'

**Configuration item exclusive to radio type**

When there are multiple radio button boxes in a radio button type cell, the direction in which the radio button boxes are arranged. The default value is `vertical`:

  * `vertical`: The radio buttons are arranged vertically
  * `horizontal`: horizontal arrangement of radio buttons

