import VChart from '@visactor/vchart';
const Table_CONTAINER_DOM_ID = 'vTable';

export function createTable() {
  const spec1 = {
    type: 'line',
    data: {
      values: [
        {
          time: '2:00',
          value: 38
        },
        {
          time: '4:00',
          value: 56
        },
        {
          time: '6:00',
          value: 10
        },
        {
          time: '8:00',
          value: 70
        },
        {
          time: '10:00',
          value: 36
        },
        {
          time: '12:00',
          value: 94
        },
        {
          time: '14:00',
          value: 24
        },
        {
          time: '16:00',
          value: 44
        },
        {
          time: '18:00',
          value: 36
        },
        {
          time: '20:00',
          value: 68
        },
        {
          time: '22:00',
          value: 22
        }
      ]
    },
    xField: 'time',
    yField: 'value',
    point: {
      visible: false
    },
    line: {
      style: {
        curveType: 'stepAfter'
      }
    },
    crosshair: {
      xField: { visible: true }
    }
  };

  const vchart = new VChart(spec1, { dom: Table_CONTAINER_DOM_ID });
  vchart.renderAsync();

  // 只为了方便控制台调试用，不要拷贝
  window.vchart = vchart;
}
