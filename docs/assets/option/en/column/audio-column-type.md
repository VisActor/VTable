{{ target: audio-cell-type }}

#${prefix} columns.audio(string)

Specify the column type as `'audio'`, cellType can be omitted with the default as 'text'

##${prefix} cellType(string) = 'audio'

Specify the column type as `'audio'`, cellType can be omitted with the default as `'text'`. Audio shares media preview options such as `clickToPreview`; image-specific options such as `keepAspectRatio` and `imageAutoSizing` do not apply.

{{ use: base-cell-type(
    prefix = '##'+${prefix}
) }}

##${prefix} clickToPreview(boolean) = true

Whether to enable click preview.
