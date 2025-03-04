---
category: examples
group: gantt
title: 隐藏底部时间刻度
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-hide-hour-scale.png
link: gantt/introduction
option: Gantt#timelineHeader.scales
---

# 隐藏底部时间刻度，实现任务时间可小于最小时间单元

通过设置 scales 的 visible 为 false 来隐藏底部时间刻度，从而实现任务时间可小于最小时间单元的模拟效果。

如果想将网格线的纵向线条绘制效果与表头时间刻度一致，可以通过配置 `grid.verticalLineDependenceOnTimeScale` 来实现。如在本例中，将 `grid.verticalLineDependenceOnTimeScale` 设置为 `day`，即可将网格线的纵向线条绘制效果与表头时间刻度中的 `day` 时间刻度一致。

## 关键配置

- `Gantt`
- `Gantt#timelineHeader.scales`
- `Gantt#grid.verticalLineDependenceOnTimeScale`

## 代码演示

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
// import { VTable } from '@visactor/vtable-gantt';
let ganttInstance;
const flag = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#e16531" xmlns="http://www.w3.org/2000/svg">
<path d="M5 15h15.415a1.5 1.5 0 0 0 1.303-2.244l-2.434-4.26a1 1 0 0 1 0-.992l2.434-4.26A1.5 1.5 0 0 0 20.415 1H5a2 
2 0 0 0-2 2v19a1 1 0 0 0 2 .003V15Z" fill="#e16531"/>
</svg>
`;
const report = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD43C" xmlns="http://www.w3.org/2000/svg">
<path d="M13.732 2c-.77-1.333-2.694-1.333-3.464 0L.742 19c-.77 1.334.192 3 1.732 3h19.052c1.54 0 2.502-1.666 
1.733-3L13.732 2ZM10.75 8.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75h-1a.75.75 0 0 
1-.75-.75v-6Zm0 8.5a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1-.75-.75v-1Z" 
fill="#FFD43C"/>
</svg>
`;
const flagIcon = {
  type: 'svg',
  svg: flag,
  width: 20,
  height: 20,
  name: 'flag',
  positionType: VTable.TYPES.IconPosition.left,
  cursor: 'pointer'
};
const reportIcon = {
  type: 'svg',
  svg: report,
  width: 20,
  height: 20,
  name: 'report',
  positionType: VTable.TYPES.IconPosition.left,
  cursor: 'pointer'
};
VTable.register.icon('flag', flagIcon);
VTable.register.icon('report', reportIcon);
const popup = document.createElement('div');
Object.assign(popup.style, {
  position: 'fixed',
  width: '300px',
  backgroundColor: '#f1f1f1',
  border: '1px solid #ccc',
  padding: '20px',
  textAlign: 'left'
});
function showTooltip(infoList, x, y) {
  popup.innerHTML = '';
  popup.id = 'popup';
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
  const heading = document.createElement('h4');
  heading.textContent = '任务信息';
  heading.style.margin = '0px';
  popup.appendChild(heading);
  const keys = {
    name: '名称',
    planFinishCalendar: '计划开始',
    planStartCalendar: '计划结束'
  };
  for (const key in infoList) {
    if (!keys[key]) {
      continue;
    }
    const info = infoList[key];
    const info1 = document.createElement('p');
    info1.textContent = keys[key] + ': ' + info;
    popup.appendChild(info1);
  }

  // 将弹出框添加到文档主体中
  document.body.appendChild(popup);
}

function hideTooltip() {
  if (document.body.contains(popup)) {
    document.body.removeChild(popup);
  }
}
const customLayout = args => {
  const { width, height, taskRecord } = args;
  const container = new VTableGantt.VRender.Group({
    width,
    height,
    cornerRadius: 10,
    fill: taskRecord?.timeConflict
      ? '#f0943a'
      : taskRecord?.keyNode
      ? '#446eeb'
      : taskRecord?.confirmed
      ? '#63bb5c'
      : '#ebeced',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    boundsPadding: 10
  });

  if (taskRecord?.timeConflict) {
    const reportIcon = new VTableGantt.VRender.Image({
      width: 20,
      height: 20,
      image: report
    });
    container.add(reportIcon);
  }

  if (taskRecord?.keyNode) {
    const reportIcon = new VTableGantt.VRender.Image({
      width: 20,
      height: 20,
      image: flag
    });
    container.add(reportIcon);
  }

  const name = new VTableGantt.VRender.Text({
    text: taskRecord.name,
    fill: taskRecord?.keyNode ? '#fff' : '#0f2819',
    suffixPosition: 'end',
    fontSize: 14,
    boundsPadding: 10
  });

  container.add(name);

  container.addEventListener('mouseenter', event => {
    const container = document.getElementById(CONTAINER_ID);
    const containerRect = container.getBoundingClientRect();
    const targetY = event.target.globalAABBBounds.y2;
    const targetX = event.target.globalAABBBounds.x1;
    showTooltip(taskRecord, event.client.x, targetY + containerRect.top);
  });

  container.addEventListener('mouseleave', () => {
    hideTooltip();
  });

  return {
    rootContainer: container
  };
};

const records = [
  {
    key: '0',
    check: {
      checked: false,
      disable: true
    },
    name: 'FA账期关闭',
    planStartCalendar: '2025-01-01 10:00:00',
    planFinishCalendar: '2025-01-03 00:00:00',
    hierarchyState: 'expand',
    keyNode: false,
    timeConflict: false,
    confirmed: false,
    children: [
      {
        key: '0,0',
        check: {
          checked: false,
          disable: true
        },
        name: 'FA账期关闭',
        planStartCalendar: '2025-01-02 13:30',
        planFinishCalendar: '2025-01-02 15:00',
        hierarchyState: 'expand',
        keyNode: true,
        timeConflict: false,
        confirmed: false,
        children: [
          {
            key: '0,0,0',
            check: {
              checked: false,
              disable: true
            },
            name: '负责人',
            // planStartCalendar: '2025-01-02 13:30',
            // planFinishCalendar: '2025-01-02 15:00',
            keyNode: false,
            timeConflict: true,
            confirmed: false
          }
        ]
      }
    ]
  },
  {
    key: '1',
    check: {
      checked: false,
      disable: true
    },
    name: 'GL资金结账',
    planStartCalendar: '2025-01-01 10:00:00',
    planFinishCalendar: '2025-01-05 00:00:00',
    hierarchyState: 'expand',
    keyNode: false,
    timeConflict: false,
    confirmed: false,
    children: [
      {
        key: '1,0',
        check: {
          checked: false,
          disable: true
        },
        name: '第三方提现中转核对',
        planStartCalendar: '2025-01-02 10:30',
        planFinishCalendar: '2025-01-03 12:00',
        hierarchyState: 'expand',
        keyNode: false,
        timeConflict: false,
        confirmed: false,
        children: [
          {
            key: '1,0,0',
            check: {
              checked: false,
              disable: true
            },
            name: '负责人',
            planStartCalendar: '2025-01-02 10:30',
            planFinishCalendar: '2025-01-03 12:00',
            keyNode: false,
            timeConflict: false,
            confirmed: false
          }
        ]
      },
      {
        key: '1,1',
        check: {
          checked: false,
          disable: true
        },
        name: '红包提现流水入账',
        planStartCalendar: '2025-01-03 10:30',
        planFinishCalendar: '2025-01-03 12:00',
        hierarchyState: 'expand',
        keyNode: false,
        timeConflict: false,
        confirmed: false,
        children: [
          {
            key: '1,1,0',
            check: {
              checked: false,
              disable: true
            },
            name: '负责人',
            planStartCalendar: '2025-01-03 10:30',
            planFinishCalendar: '2025-01-03 12:00',
            keyNode: false,
            timeConflict: false,
            confirmed: false
          }
        ]
      },
      {
        key: '1,2',
        check: {
          checked: false,
          disable: true
        },
        name: '资金中转对平',
        planStartCalendar: '2025-01-03 16:00',
        planFinishCalendar: '2025-01-03 19:00',
        hierarchyState: 'expand',
        keyNode: false,
        timeConflict: false,
        confirmed: false,
        children: [
          {
            key: '1,2,0',
            check: {
              checked: false,
              disable: true
            },
            name: '负责人',
            planStartCalendar: '2025-01-03 16:00',
            planFinishCalendar: '2025-01-03 19:00',
            keyNode: false,
            timeConflict: false,
            confirmed: false
          }
        ]
      },
      {
        key: '1,3',
        check: {
          checked: false,
          disable: true
        },
        name: '投资组完成境内流水认款',
        planStartCalendar: '2025-01-03 10:00',
        planFinishCalendar: '2025-01-03 19:00',
        hierarchyState: 'expand',
        keyNode: false,
        timeConflict: false,
        confirmed: false,
        children: [
          {
            key: '1,3,0',
            check: {
              checked: false,
              disable: true
            },
            name: '负责人',
            planStartCalendar: '2025-01-03 10:00',
            planFinishCalendar: '2025-01-03 19:00',
            keyNode: false,
            timeConflict: false,
            confirmed: false
          }
        ]
      }
    ]
  }
];
const columns = [
 
  {
    field: 'name',
    title: '任务',
    width: 220,
    tree: true,
    icon: ({ table, col, row }) => {
      const record = table.getCellOriginRecord(col, row);
      if (record.keyNode) {
        return 'flag';
      }
    },
    style: ({ table, col, row }) => {
      const record = table.getCellOriginRecord(col, row);
      return {
        // - 已确认-绿底；未确认-白底
        bgColor: record?.timeConflict ? '#f0943a' : record.confirmed ? '#63bb5c' : undefined
      };
    }
  },
  {
    field: 'planStartCalendar',
    title: '计划开始',
    width: 'auto'
  },
  {
    field: 'planFinishCalendar',
    title: '计划完成',
    width: 'auto'
  }
];
const option = {
  overscrollBehavior: 'none',
  records,
  taskListTable: {
    enableTreeNodeMerge: true,
    columns,
    tableWidth: 'auto',
    theme: VTable.themes.ARCO.extends({
      // 表格外边框设置
      frameStyle: {
        borderLineWidth: 0,
        shadowBlur: 0
      },
      headerStyle: {
        hover: {
          cellBgColor: '#eef1f5'
        }
      },
      bodyStyle: {
        bgColor: '#fff',
        hover: {
          cellBgColor: 'rgba(0,0,0,0.03)'
        }
      },
      tooltipStyle: { color: '#fff', bgColor: '#202328' }
    }),
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    menu: {
      contextMenuItems: ['编辑']
    },
    frozenColCount: 1
  },
  frame: {
    outerFrameStyle: {
      borderLineWidth: 1,
      borderColor: '#e1e4e8',
      cornerRadius: 0
    },
    verticalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 1
    },
    horizontalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 1
    },
    verticalSplitLineMoveable: true,
    verticalSplitLineHighlight: {
      lineColor: 'green',
      lineWidth: 1
    }
  },
  grid: {
    // verticalLineDependenceOnTimeScale: 'day',
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    }
  },
  headerRowHeight: 40,
  rowHeight: 40,
  taskBar: {
    startDateField: 'planStartCalendar',
    endDateField: 'planFinishCalendar',
    progressField: 'progress',
    resizable: true,
    moveable: true,
    scheduleCreatable: true,
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 14,
      textAlign: 'right',
      textOverflow: 'ellipsis',
      textBaseline: 'bottom'
    },
    barStyle: {
      width: 30,
      /** 任务条的圆角 */
      cornerRadius: 10,
      /** 任务条的边框 */
      borderLineWidth: 0,
      /** 边框颜色 */
      borderColor: 'black'
    },
    hoverBarStyle: {
      /** 任务条的颜色 */
      barOverlayColor: 'rgba(0,0,0,0.15)'
    },
    selectedBarStyle: {
      /** 任务条的颜色 */
      borderColor: '#000000',
      borderLineWidth: 0
    },
    scheduleCreation: {
      maxWidth: 100,
      minWidth: 40
    },
    customLayout
  },
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
    colWidth: 20,
    scales: [
      {
        unit: 'day',
        step: 1,
        startOfWeek: 'sunday',
        format(date) {
          const day = VTableGantt.tools.formatDate(new Date(date.startDate), 'yyyy-mm-dd');
          return day;
        },
        style: {
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      {
        unit: 'hour',
        step: 1,
        visible: false,
        style: {
          fontSize: 14,
          fontWeight: 'normal'
        }
      }
    ]
  },
  markLine: [
    {
      date: '2025-01-02 13:30:00',
      scrollToMarkLine: true,
      position: 'middle',
      style: {
        lineColor: 'red',
        lineWidth: 1,
        lineDash: [5, 5]
      }
    }
  ],
  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    visible: 'scrolling',
    width: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#c0c0c0'
  }
};
ganttInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['ganttInstance'] = ganttInstance;
```
