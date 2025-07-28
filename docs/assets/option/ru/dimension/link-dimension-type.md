{{ target: link-dimension-type }}

#${prefix} ${dimensionHeaderType}.link(string)

Specify the column type as 'link', headerType can be omitted and defaults to 'text'

##${prefix} headerType(string) = 'link'

Specify the column type as 'link', headerType can be omitted and defaults to 'text'

{{ use: base-dimension-type(
    prefix = '##'+${prefix}
) }}

##${prefix} linkJump(boolean|Function) = true

**Link type exclusive configuration item** Whether the link is clickable and can be redirected

##${prefix} linkDetect(boolean|Function) = true

**Link type exclusive configuration item** Whether the link undetrrgoes regular expression detection, and only if the link complies with the URL rules it will be displayed as a link. This configuration does not take effect if a template link is configured.

##${prefix} templateLink(string | (record: any, col: number, row: number, table: BaseTableAPI) => string)

**Link type exclusive configuration item** Template link address, such as: 'https://www.google.com.hk/search?q={name}', where name is the data source attribute field name.

##${prefix} linkTarget(string)

**link type exclusive configuration item** Specifying the name of the browsing context the resource is being loaded into, is the second parameter of window.open(), and defaults to '\_blank'.

##${prefix} linkWindowFeatures(string)

**link type exclusive configuration item** A string containing a comma-separated list of window features, which is the third parameter of window.open().
