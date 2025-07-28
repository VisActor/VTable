# Table entry animation

VTable provides entry animation function, supports displaying the gradual entry effect when the table is initialized, and supports configuring the animation direction, duration, delay, etc.

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/appear-animation.gif" style="flex: 0 0 50%; padding: 10px;">
</div>

## Entry animation configuration items

In option, `animationAppear` is the configuration item for the entry animation, and currently supports the following configurations:

You can configure true to enable the default animation, or you can configure the animation parameters:
- `type` The type of the entry animation, currently supports `all` and `one-by-one`, and the default is `one-by-one`
- `direction` The direction of the entry animation, currently supports `row` and `column`, and the default is `row`
- `duration` The duration of a single animation, in milliseconds, for `one-by-one`, it is the duration of one animation, and the default is 500
- `delay` The delay of the animation, in milliseconds; for `one-by-one`, it is the time difference between the two animations, for `all`, it is the delay of all animations, and the default is 0

For specific usage, please refer to [demo](../../demo/animation/appear-animation)