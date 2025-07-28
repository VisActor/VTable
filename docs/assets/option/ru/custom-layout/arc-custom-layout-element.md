{{ target: arc-custom-layout-element }}

{{ use: base-custom-layout-element(
    prefix = ${prefix},
) }}

${prefix}radius (number) 

**Required**

Arc radius.

${prefix}startDegree (number)

Arc start angle, in degrees.

${prefix}endDegree (number)

Arc end angle, in degrees.

${prefix}clockWise (boolean) = true

Arc direction, true means clockwise, false means counterclockwise. Default is true.

${prefix}lineWidth (number)

Border width.

${prefix}fill (string)

Fill color.

${prefix}stroke (string)

Stroke color.