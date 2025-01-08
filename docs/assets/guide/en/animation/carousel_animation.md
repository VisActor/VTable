# Carousel Animation

VTable provides carousel animation plugin, which can implement the carousel scrolling animation effect of the table.

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/carousel-animation.gif" style="flex: 0 0 50%; padding: 10px;">
</div>

## Carousel Animation Configuration

- `CarouselAnimationPlugin`  carousel animation plugin, can configure the following parameters:
  - `rowCount` scroll row count in a carousel animation
  - `colCount` scroll column count in a carousel animation
  - `animationDuration` The duration of a single carousel animation, in milliseconds
  - `animationDelay` The delay of a single carousel animation, in milliseconds
  - `animationEasing` The easing function of a single carousel animation
  - `replaceScrollAction` Whether to replace the scroll action, if true, the scroll action will be replaced by the carousel animation

```js
const carouselAnimationPlugin = new CarouselAnimationPlugin(tableInstance, {
  rowCount: 2,
  replaceScrollAction: true
});

carouselAnimationPlugin.play();
```

For specific usage, please refer to [demo](../../demo/animation/carousel-animation)

## Carousel Animation API

### play

Start carousel animation.
```
carouselAnimationPlugin.play()
```

### pause

Pause carousel animation.
```
carouselAnimationPlugin.pause()
```

### reset

Reset carousel animation.
```
carouselAnimationPlugin.reset()
```
