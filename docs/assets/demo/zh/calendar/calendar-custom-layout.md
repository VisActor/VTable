---
category: examples
group: Calendar
title: Calendar
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/calendar-weather.gif
link: calendar/introduction
option: Calendar#startDate
---

# 天气日历图

自定义单元格，实现天气日历图

## 关键配置

- `tableOptions` 日历表格的配置（这里的配置会被传给对应的VTable实例，用于深度自定义）

## 代码演示

```javascript livedemo template=vtable
// import * as VRender from '@visactor/vtable/es/vrender';

const {
  createGroup,
  GifImage,
  container,
  gifImageModule,
  gifImageCanvasPickModule
} = VRender;

const gifs = [
  '/icons8-雨.gif',
  '/icons8-夏季.gif',
  '/icons8-多云兼雨.gif',
  '/icons8-有风的天气.gif',
  '/icons8-冬季.gif',
  '/icons8-小雨2.gif',
  '/icons8-瓢泼大雨.gif',
  '/icons8-白天晴间多云.gif'
];

container.load(gifImageModule);
container.load(gifImageCanvasPickModule);

const calendar = new VTableCalendar.Calendar(document.getElementById(CONTAINER_ID), {
  rangeDays: 20,
  tableOptions: {
    customLayout: args => {
      const { table, row, col, rect } = args;
      const record = table.getCellOriginRecord(col, row);
      const { height, width } = rect ?? table.getCellRect(col, row);

      const container = createGroup({
        height,
        width,
        // fill: 'yellow',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap'
      });

      const gif = gifs[Math.floor(Math.random() * gifs.length)];
      const image = new GifImage({
        width: 50,
        height: 50,
        gifImage: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media' + gif
      });

      container.add(image);

      return {
        rootContainer: container,
        renderDefault: true
      };
    }
  }
});

window['calendar'] = calendar;
```
