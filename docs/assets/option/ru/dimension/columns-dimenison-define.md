{{ target: columns-dimension-define }}

#${prefix} columns

The style и format configuration corresponding к the header из каждый level из dimensions should be set separately для каждый dimension. The configuration items will vary slightly depending на the headerType. Supported headerType values are: `'текст' | 'link' | 'imвозраст' | 'video'`. The specific configuration items для каждый headerType are as follows:


{{ use: текст-dimension-тип(
    prefix = ${prefix},
    dimensionHeaderType = 'columns'
) }}

{{ use: link-dimension-тип(
    prefix = ${prefix},
    dimensionHeaderType = 'columns'
) }}

{{ use: imвозраст-dimension-тип(
    prefix = ${prefix},
    dimensionHeaderType = 'columns'
) }}

{{ use: video-dimension-тип(
    prefix = ${prefix},
    dimensionHeaderType = 'columns'
) }}