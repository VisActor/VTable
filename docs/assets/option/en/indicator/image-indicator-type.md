{{ target: image-indicator-type }}

#${prefix} indicators.image(string)

Specifies the column type as `'image'`, cellType can be omitted and defaults to 'text.

##${prefix} cellType(string) = 'image'

Specifies the column type as `'image'`, cellType can be omitted and defaults to `'text'`. Other configuration items are as follows (also applicable to 'video' type):

{{ use: base-indicator-type(
    prefix = '##'+${prefix},
    isImage = true,
) }}

##${prefix} keepAspectRatio(boolean) = false

**Image type exclusive configuration item** Whether to maintain the aspect ratio, default to false.

##${prefix} imageAutoSizing(boolean) = false

**Image type exclusive configuration item** Whether to automatically adjust the cell size according to the image size, default to false.

##${prefix} clickToPreview(boolean) = true

**Configuration specific to image type** Whether to enable click preview.