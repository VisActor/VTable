{{ target: link-dimension-type }}

#${prefix} ${dimensionHeaderType}.link(string)

Specify the column type as 'link', headerType can be omitted and defaults to 'text'

##${prefix} headerType(string) = 'link'

Specify the column type as 'link', headerType can be omitted and defaults to 'text'

{{ use: base-dimension-type(
    prefix = '##'+${prefix}
) }}

##${prefix} linkJump(boolean) = true

**Link type exclusive configuration item** Whether the link is clickable and can be redirected

##${prefix} linkDetect(boolean) = true

**Link type exclusive configuration item** Whether the link undergoes regular expression detection, and only if the link complies with the URL rules it will be displayed as a link. This configuration does not take effect if a template link is configured.

##${prefix} templateLink(string)

**Link type exclusive configuration item** Template link address, such as: 'https://www.google.com.hk/search?q={name}', where name is the data source attribute field name.