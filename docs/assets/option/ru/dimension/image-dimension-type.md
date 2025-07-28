{{ target: image-dimension-type }}

#${prefix} ${dimensionHeaderType}.image(string)

Specify the column type as `'image'`, headerType can be omitted and defaults to 'text

##${prefix} headerType(string) = 'image'

Specify the column type as `'image'`, headerType can be omitted and defaults to `'text'`. Other configuration items are as follows (also applicable to type 'video'):

{{ use: base-dimension-type(
    prefix = '##'+${prefix},
    isImage = true,
) }}

##${prefix} keepAspectRatio(boolean) = false

**Configuration item exclusive to image type** Whether to keep the aspect ratio, default is false

##${prefix} imageAutoSizing(boolean) = false

**Configuration item exclusive to image type** Whether to automatically expand the cell size according to the image size, default is false

##${prefix} clickToPreview(boolean) = true

**Configuration specific to image type** Whether to enable click preview.