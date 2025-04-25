import type { ColumnsDefine } from '@visactor/vtable';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import { Gantt, VRender } from '../../src/index';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
export function createTable() {
  const records = [
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      progress: 90,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07/14/2024',
      end: '07/24/2024',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-10',
      end: '2024-07-14',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024.07.06',
      end: '2024.07.08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/09',
      end: '2024/07/11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07.24.2024',
      end: '08.04.2024',
      progress: 31,
      priority: 'P0'
    }
  ];

  const columns = [
    // {
    //   field: 'id',
    //   title: 'ID',
    //   width: 80,
    //   sort: true
    // },
    {
      field: 'title',
      title: 'title',
      width: 200,
      sort: true
    },
    {
      field: 'start',
      title: 'start',
      width: 150,
      sort: true
    },
    {
      field: 'end',
      title: 'end',
      width: 150,
      sort: true
    },
    {
      field: 'priority',
      title: 'priority',
      width: 100,
      sort: true
    },

    {
      field: 'progress',
      title: 'progress',
      width: 200,
      sort: true
    }
  ];
  const option: GanttConstructorOptions = {
    records: [],
    taskListTable: {
      columns: columns,
      tableWidth: 400,
      minTableWidth: 100,
      maxTableWidth: 600
    },
    resizeLineStyle: {
      lineColor: 'green',
      lineWidth: 3
    },

    frame: {
      verticalSplitLineMoveable: true,
      outerFrameStyle: {
        borderLineWidth: 2,
        borderColor: 'red',
        cornerRadius: 8
      },
      verticalSplitLine: {
        lineWidth: 3,
        lineColor: '#e1e4e8'
      },
      verticalSplitLineHighlight: {
        lineColor: 'green',
        lineWidth: 3
      }
    },
    grid: {
      // backgroundColor: 'gray',
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
    },
    defaultHeaderRowHeight: 60,
    defaultRowHeight: 40,
    timelineHeader: {
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      backgroundColor: '#EEF1F5',
      colWidth: 60,
      scales: [
        {
          unit: 'week',
          step: 1,
          startOfWeek: 'sunday',
          format(date) {
            return `Week ${date.dateIndex}`;
          },
          style: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'red',
            backgroundColor: '#EEF1F5'
          }
        },
        {
          unit: 'day',
          step: 1,
          format(date) {
            return date.dateIndex.toString();
          },
          style: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'red',
            backgroundColor: '#EEF1F5'
          }
        }
      ]
    },
    maxDate: '2024-06-01',
    minDate: '2024-06-01',
    // maxDate: '2024-10-15',

    taskBar: {
      startDateField: 'start',
      endDateField: 'end'
    },
    markLine: [
      {
        date: '2024-10-06',
        content: '我的啊啊得的',
        contentStyle: {
          color: '#fff'
          // fontSize: 40
        },
        style: {
          lineWidth: 1,
          lineColor: 'red'
        }
      }
    ],
    scrollStyle: {
      visible: 'scrolling'
    },
    overscrollBehavior: 'none',
    markLineCreateOptions: {
      markLineCreatable: true,
      markLineCreationHoverToolTip: {
        position: 'top',
        tipContent: '创建里程碑',
        style: {
          contentStyle: {
            fill: '#fff'
          },
          panelStyle: {
            background: '#14161c',
            cornerRadius: 4
          }
        }
      },
      markLineCreationStyle: {
        fill: '#ccc',
        size: 30,
        iconSize: 12,
        svg: '<svg t="1741145302032" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2861" width="200" height="200"><path d="M967.68 558.08v-89.6H542.72V43.52h-87.04v424.96H30.72v89.6h424.96v422.4h87.04V558.08z" fill="" p-id="2862"></path></svg>'
      }
    }
  };

  const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  window.ganttInstance = ganttInstance;
  ganttInstance.on('click_markline_create', ({ data, position }) => {
    createPopup({ date: data.startDate, content: '' }, position, value => {
      ganttInstance.addMarkLine({
        date: formatDate(data.startDate),
        content: value,
        contentStyle: {
          color: '#fff'
        },
        style: {
          lineWidth: 1,
          lineColor: 'red'
        }
      });
    });
  });
  ganttInstance.on('click_markline_content', ({ data, position }) => {
    createPopup({ date: data.date, content: data.content }, position, value => {
      ganttInstance.updateCurrentMarkLine({ date: data.date, content: value });
    });
  });
  // bindDebugTool(ganttInstance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // 补零技巧
  const day = ('0' + date.getDate()).slice(-2);
  return year + '-' + month + '-' + day;
}

function createPopup({ date, content }, position, callback) {
  const container = document.getElementById('article');

  // 创建弹窗元素
  const popup = document.createElement('div');
  popup.className = 'popup';

  // 设置定位参数
  popup.style.top = `${position.top}px`;
  popup.style.left = `${position.left}px`;
  popup.style.position = 'absolute';
  popup.style.background = '#ccc';
  popup.style.padding = '10px';
  popup.style.zIndex = '10000';

  // 日期显示格式化
  const dateString = typeof date === 'string' ? date : formatDate(date);

  // 弹窗内容
  popup.innerHTML = `
      <span class="close-btn" onclick="this.parentElement.remove()">×</span>
      <div>日期：${dateString}</div>
      <input type="text" placeholder="输入内容"  class="popup-input" value="${content}" />
      <button class="confirm-btn">确定</button>
  `;

  const confirmBtn = popup.querySelector('.confirm-btn')!;
  confirmBtn.addEventListener('click', () => {
    const inputValue = popup.querySelector('.popup-input')!.value;
    popup.remove();
    if (typeof callback === 'function') {
      callback(inputValue);
    }
  });

  // 添加弹窗到容器
  container!.appendChild(popup);
}
