{{ target: link-indicator-type }}

#${prefix} indicators.link(string)

Specify the column type as 'link', and the default cellType is 'text' if not specified

##${prefix} cellType(string) = 'link'

Specify the column type as 'link', and the default cellType is 'text' if not specified

{{ use: base-indicator-type(
    prefix = '##'+${prefix}
) }}

##${prefix} linkJump(boolean) = true

**Exclusive configuration for link type** Whether the link is clickable and can be redirected

##${prefix} linkDetect(boolean) = true

**Exclusive configuration for link type** Whether to perform regular detection on the link. If the link conforms to the URL rules, it will be displayed as a link. This configuration does not take effect if a template link is configured.

##${prefix} templateLink(string)

**Exclusive configuration for link type** Template link address, such as: 'https://www.google.com.hk/search?q={name}', where name is the attribute field name in the data source.