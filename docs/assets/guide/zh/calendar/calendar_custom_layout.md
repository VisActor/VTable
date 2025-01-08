# 日历图自定义日期单元格

使用VTable提供的相关自定义能力，可以定制单元格内展示的内容。通过tableOptions的配置传递，可以使用VTable支持的所有自定义单元格能力，以customLayout自定义函数来说，在返回renderDefault: true时，就可以将自定义内容和单元格里原有的日期内容一起显示，像定义VTable表格一样来定制日历图单元格中的内容。

这里使用VRender提供的GIF图组件，使用customLayout在每个单元格内绘制了一个动态天气效果：

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
