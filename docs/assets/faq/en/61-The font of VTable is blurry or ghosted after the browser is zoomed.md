---
title: 39. VTable font appears blurry or ghosted after browser zoom
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---

## Question Title

How to fix blurry or ghosted fonts in VTable after browser zooming?

## Problem Description

When using the VTable component and zooming in the browser, the fonts become blurry, usually caused by adaptive height (flex-1).

## Solution

VTable provides the `setPixelRatio` API, combined with size change monitoring of the outer wrapping DOM to solve the problem.
The core solution is to set the wrapped height to the table's height (without decimal points) and ensure it's an integer divisible by the zoom ratio. This means the table height needs to be reduced when zoomed.

### Code Implementation (Vue3 Example)

```html
<div class="flex flex-1 overflow-hidden relative" ref="tableWrapperRef">
  <ListTable :style="tableHeight ? { height: `${tableHeight}px` } : {}" @onReady="onReady" ... />
</div>

<script setup>
  const tableWrapperRef = shallowRef<HTMLDivElement>();
  const tableInstance = shallowRef<any>();
  const tableHeight = ref<number>(0);

  const resizeObserver = new ResizeObserver(([entry]) => {
    if (window.devicePixelRatio < 1) {
      const height = entry.target.clientHeight;
      const ratio = Math.round(window.devicePixelRatio * 100) / 100;
      tableHeight.value = height - (height % 10);
      setTimeout(() => {
        tableInstance.value.setPixelRatio(window.devicePixelRatio > 0.7 ? ratio : 1);
      }, 400);
    }
  });
  const onReady = (instance) => {
    tableInstance.value = instance;
    resizeObserver.observe(tableWrapperRef.value);
  };

  onBeforeUnmount(() => {
    resizeObserver.unobserve(tableWrapperRef.value);
  });
</script>
```

### Effect Demonstration

<img src="/vtable/faq/61-1.gif" alt="Description" height="500">

## Related Documents

Related API: https://visactor.io/vtable/api/Methods#setPixelRatio
GitHub: https://github.com/VisActor/VTable
