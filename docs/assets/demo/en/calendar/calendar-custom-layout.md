---
category: examples
group: Calendar
title: Calendar
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/calendar-weather.gif
link: calendar/introduction
option: Calendar#startDate
---

# Weather Calendar

Cell custom content, implement weather calendar.

## Key Configurations

- `tableOptions` calendar table configuration (this configuration will be passed to the corresponding VTable instance for deep customization)

## Code demo

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
