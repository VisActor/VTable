# Calendar chart custom date cell

Using the relevant custom capabilities provided by VTable, you can customize the content displayed in the cell. Through the configuration transfer of tableOptions, you can use all the custom cell capabilities supported by VTable. For example, when returning renderDefault: true, the custom content can be displayed together with the original date content in the cell, just like defining a VTable table to customize the content in the calendar chart cell.

Here, the GIF image component provided by VRender is used, and a dynamic weather effect is drawn in each cell using customLayout:

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

const calendarInstance = new VTableCalendar.Calendar(document.getElementById(CONTAINER_ID), {
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

window['calendarInstance'] = calendarInstance;
```
