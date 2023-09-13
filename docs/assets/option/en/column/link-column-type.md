{{ target: link-cell-type }}

#${prefix} columns.link(string)

Specify the column type as 'link', cellType can be omitted and defaults to 'text'

##${prefix} cellType(string) = 'link'

Specify the column type as 'link', cellType can be omitted and defaults to 'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix}
) }}

##${prefix} linkJump(boolean) = true

**link type exclusive configuration item**  Whether the link can be clicked to jump

##${prefix} linkDetect(boolean) = true

**link type exclusive configuration item**  Whether the link undergoes regular detection, and displays as link only if the link conforms to the url rules. This configuration does not take effect if a template link is configured.

##${prefix} templateLink(string)

**link type exclusive configuration item**  Template link address, such as: 'https://www.google.com.hk/search?q={name}', where name is the attribute field name of the data source.