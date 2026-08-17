{{ target: audio-indicator-type }}

#${prefix} indicators.audio(string)

Specifies the column type as `'audio'`, cellType can be omitted with default as 'text'

##${prefix} cellType(string) = 'audio'

Specifies the column type as `'audio'`, cellType can be omitted with default as `'text'`. Audio shares media preview options such as `clickToPreview`; image-specific options such as `keepAspectRatio` and `imageAutoSizing` do not apply.

{{ use: base-indicator-type(
    prefix = '##'+${prefix}
) }}

##${prefix} clickToPreview(boolean) = true

Whether to enable click preview.
