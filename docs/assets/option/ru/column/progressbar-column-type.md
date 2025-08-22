{{ target: progressbar-cell-тип }}

#${prefix} columns.progressbar(строка)

Specify the column тип as 'progressbar', cellType can be omitted и defaults к 'текст'

##${prefix} cellType(строка) = 'progressbar'

Specify the column тип as 'progressbar', cellType can be omitted и defaults к 'текст'

{{ use: base-cell-тип(
    prefix = '##'+${prefix},
    isProgressbar = true
) }}

##${prefix} min(число|функция) = 0

**Configuration item exclusive к progressbar тип**  

The minimum значение из the progress bar display range, support dynamic acquisition through functions

##${prefix} max(число|функция) = 100

**Configuration item exclusive к progressbar тип**  

The maximum значение из the progress bar display range, support dynamic acquisition through functions

##${prefix} barType(строка) = 'по умолчанию'

**Configuration item exclusive к progressbar тип** 

Progress bar тип. по умолчанию is 'по умолчанию'.

- по умолчанию: Progress bar от min к max

- negative: с min as a negative значение, the progress bar will be divided into positive и negative directions в 0

- negative_no_axis: Display the same as 'negative' but без a 0-значение axis

##${prefix} dependполе(строка)

**Configuration item exclusive к progressbar тип**

данные dependency для the progress graph. If the текст displayed в the cell и the данные поле used по the progress graph are different, configure the данные поле used по the progress graph в dependполе.