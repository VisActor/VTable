import { Calendar } from '../../src';
import { Icon } from '@visactor/vtable';
import { createGroup } from '@visactor/vtable/es/vrender';
const CONTAINER_ID = 'vTable';

const gifs = [
  '/gif/icons8-雨.gif',
  '/gif/icons8-夏季.gif',
  '/gif/icons8-多云兼雨.gif',
  '/gif/icons8-有风的天气.gif',
  '/gif/icons8-冬季.gif',
  '/gif/icons8-小雨2.gif',
  '/gif/icons8-瓢泼大雨.gif',
  '/gif/icons8-白天晴间多云.gif'
];

export function createTable() {
  const calendar = new Calendar(document.getElementById(CONTAINER_ID), {
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
        const image = new Icon({
          width: 50,
          height: 50,
          image: gif,
          gif: gif,
          isGif: true
        });

        container.add(image);

        return {
          rootContainer: container,
          renderDefault: true
        };
      }
    }
  });

  window.calendar = calendar;
}
