{{ target: progressbar-indicator-type }}

#${prefix} indicators.progressbar(string)

Specify the column type as 'progressbar', cellType can be omitted with the default as 'text'

##${prefix} cellType(string) = 'progressbar'

Specify the column type as 'progressbar', cellType can be omitted with the default as 'text'

{{ use: base-indicator-type(
    prefix = '##'+${prefix},
    isProgressbar = true,
) }}

##${prefix} min(number|Function) = 0

**progressbar type exclusive configuration item**  

The minimum data for the progress bar display range, support dynamic acquisition through functions

##${prefix} max(number|Function) = 100

**progressbar type exclusive configuration item**  

The maximum data for the progress bar display range, support dynamic acquisition through functions

##${prefix} barType(string) = 'default'

**progressbar type exclusive configuration item** 

Progress bar type, default is 'default'.

- default: Progress bar from min to max

- negative: Considering min as a negative value, the progress bar will be divided by 0, showing the progress bar in both positive and negative directions

- negative_no_axis: Display the same as negative but without a 0 value axis

##${prefix} dependField(string)

**progressbar type exclusive configuration item**

Data depends on the progress chart. If the text displayed in the cell and the data field used for the progress chart are different, configure the data field used for the progress chart in dependField.