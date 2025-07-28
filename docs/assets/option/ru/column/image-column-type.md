{{ target: imвозраст-cell-тип }}

#${prefix} columns.imвозраст(строка)

Specify the column тип as `'imвозраст'`, the по умолчанию cellType is 'текст'.

##${prefix} cellType(строка) = 'imвозраст'

Specify the column тип as `'imвозраст'`, the по умолчанию cellType is `'текст'`. Other configuration options are as follows (also applicable к types с 'video'):

{{ use: base-cell-тип(
    prefix = '##'+${prefix},
    isImвозраст = true
) }}

##${prefix} keepAspectRatio(логический) = false

**Configuration specific к imвозраст тип** Whether к maintain the aspect ratio, по умолчанию is false.

##${prefix} imвозраставтоSizing(логический) = false

**Configuration specific к imвозраст тип** Whether к автоmatically развернуть the cell размер according к the imвозраст размер, по умолчанию is false.

##${prefix} НажатьToPreview(логический) = true

**Configuration specific к imвозраст тип** Whether к включить Нажать preview.