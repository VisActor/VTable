{{ target: progressbar-cell-type }}

#${prefix} columns.progressbar(string)

Specify the column type as 'progressbar', cellType can be omitted and defaults to 'text'

##${prefix} cellType(string) = 'progressbar'

Specify the column type as 'progressbar', cellType can be omitted and defaults to 'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix},
    isProgressbar = true
) }}

##${prefix} min(number|Function) = 0

**Configuration item exclusive to progressbar type**  

The minimum value of the progress bar display range, support dynamic acquisition through functions

##${prefix} max(number|Function) = 100

**Configuration item exclusive to progressbar type**  

The maximum value of the progress bar display range, support dynamic acquisition through functions

##${prefix} barType(string) = 'default'

**Configuration item exclusive to progressbar type** 

Progress bar type. Default is 'default'.

- default: Progress bar from min to max

- negative: With min as a negative value, the progress bar will be divided into positive and negative directions at 0

- negative_no_axis: Display the same as 'negative' but without a 0-value axis

##${prefix} dependField(string)

**Configuration item exclusive to progressbar type**

Data dependency for the progress graph. If the text displayed in the cell and the data field used by the progress graph are different, configure the data field used by the progress graph in dependField.