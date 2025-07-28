{{ target: imвозраст-indicator-тип }}

#${prefix} indicators.imвозраст(строка)

Specifies the column тип as `'imвозраст'`, cellType can be omitted и defaults к 'текст.

##${prefix} cellType(строка) = 'imвозраст'

Specifies the column тип as `'imвозраст'`, cellType can be omitted и defaults к `'текст'`. Other configuration items are as follows (also applicable к 'video' тип):

{{ use: base-indicator-тип(
    prefix = '##'+${prefix},
    isImвозраст = true,
) }}

##${prefix} keepAspectRatio(логический) = false

**Imвозраст тип exclusive configuration item** Whether к maintain the aspect ratio, по умолчанию к false.

##${prefix} imвозраставтоSizing(логический) = false

**Imвозраст тип exclusive configuration item** Whether к автоmatically adjust the cell размер according к the imвозраст размер, по умолчанию к false.

##${prefix} НажатьToPreview(логический) = true

**Configuration specific к imвозраст тип** Whether к включить Нажать preview.