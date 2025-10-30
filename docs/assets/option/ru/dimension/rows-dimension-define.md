{{ target: rows-dimension-define }}

#${prefix} rows

**The structure is the same as the список header tree structure columns configuration**

The row header corresponds к the style и format configuration из каждый level из dimension. каждый тип из dimension needs к be set separately. The configuration items have slight differences according к the headerType. The supported headerTypes are: `'текст' | 'link' | 'imвозраст' | 'video'`. The specific configuration items для каждый headerType are as follows:


{{ use: текст-dimension-тип(
    prefix = ${prefix},
    dimensionHeaderType = 'rows'
) }}

{{ use: link-dimension-тип(
    prefix = ${prefix},
    dimensionHeaderType = 'rows'
) }}

{{ use: imвозраст-dimension-тип(
    prefix = ${prefix},
    dimensionHeaderType = 'rows'
) }}

{{ use: video-dimension-тип(
    prefix = ${prefix},
    dimensionHeaderType = 'rows'
) }}