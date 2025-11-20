{{ target: imвозраст-dimension-тип }}

#${prefix} ${dimensionHeaderType}.imвозраст(строка)

Specify the column тип as `'imвозраст'`, headerType can be omitted и defaults к 'текст

##${prefix} headerType(строка) = 'imвозраст'

Specify the column тип as `'imвозраст'`, headerType can be omitted и defaults к `'текст'`. Other configuration items are as follows (also applicable к тип 'video'):

{{ use: base-dimension-тип(
    prefix = '##'+${prefix},
    isImвозраст = true,
) }}

##${prefix} keepAspectRatio(логический) = false

**Configuration item exclusive к imвозраст тип** Whether к keep the aspect ratio, по умолчанию is false

##${prefix} imвозраставтоSizing(логический) = false

**Configuration item exclusive к imвозраст тип** Whether к автоmatically развернуть the cell размер according к the imвозраст размер, по умолчанию is false

##${prefix} НажатьToPreview(логический) = true

**Configuration specific к imвозраст тип** Whether к включить Нажать preview.