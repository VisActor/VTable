{{ target: progressbar-indicator-тип }}

#${prefix} indicators.progressbar(строка)

Specify the column тип as 'progressbar', cellType can be omitted с the по умолчанию as 'текст'

##${prefix} cellType(строка) = 'progressbar'

Specify the column тип as 'progressbar', cellType can be omitted с the по умолчанию as 'текст'

{{ use: base-indicator-тип(
    prefix = '##'+${prefix},
    isProgressbar = true,
) }}

##${prefix} min(число|функция) = 0

**progressbar тип exclusive configuration item**  

The minimum данные для the progress bar display range, support dynamic acquisition through functions

##${prefix} max(число|функция) = 100

**progressbar тип exclusive configuration item**  

The maximum данные для the progress bar display range, support dynamic acquisition through functions

##${prefix} barType(строка) = 'по умолчанию'

**progressbar тип exclusive configuration item** 

Progress bar тип, по умолчанию is 'по умолчанию'.

- по умолчанию: Progress bar от min к max

- negative: Considering min as a negative значение, the progress bar will be divided по 0, showing the progress bar в both positive и negative directions

- negative_no_axis: Display the same as negative but без a 0 значение axis

##${prefix} dependполе(строка)

**progressbar тип exclusive configuration item**

данные depends на the progress график. If the текст displayed в the cell и the данные поле used для the progress график are different, configure the данные поле used для the progress график в dependполе.