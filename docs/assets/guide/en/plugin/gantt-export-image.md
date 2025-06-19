# Gantt Chart Export Plugin

## Feature Introduction

`ExportGanttPlugin` is a plugin written to support the full export of Gantt charts and to adapt to the size of the Gantt chart.

This plugin will take effect when the Gantt chart is being `constructor`

When you need to export an image, you can execute`exportGanttPlugin.exportToImage` to do so.

However, since the current implementation principle is to create a container large enough to hold the entire gantt component, and then put our gantt component in it and export it using the toDataURL, there will be a size limit, which may lead to export failure

## Plugin Configuration

When you call`exportGanttPlugin.exportToImage`,it also needs to accept the following parameters to change the export image settings
```
fileName: 'Gantt chart export test',
type: formatSelect.value as 'png' | 'jpeg',
// resolution ratio
scale: Number(scaleSelect.value),
backgroundColor: bgColorInput.value,
// The quality of the exported pictures
quality: 1
```

## Plugin example
Initialize the plugin object and add it to the plugins in the Gantt configuration
```
const exportGanttPlugin = new ExportGanttPlugin();
const option = {
  records,
  columns,
  padding: 30,
  plugins: [exportGanttPlugin]
};
```

```javascript livedemo template=vtable
//  使用时需要引入插件包@visactor/vtable-plugins
//  import * as VTablePlugins from '@visactor/vtable-plugins';
const EXPORT_PANEL_ID = 'gantt-export-panel';
const exportGanttPlugin = new VTablePlugins.ExportGanttPlugin();
const records = [
  {
    id: 1,
    title: 'Task 1',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-24',
    end: '2024-07-26',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    title: 'Task 2',
    developer: 'liufangfang.jane@bytedance.com',
    start: '07/24/2024',
    end: '08/04/2024',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    title: 'Task 3',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-08-04',
    end: '2024-08-04',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 4,
    title: 'Task 4',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-26',
    end: '2024-07-28',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 5,
    title: 'Task 5',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-26',
    end: '2024-07-28',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 6,
    title: 'Task 6',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-29',
    end: '2024-08-11',
    progress: 100,
    priority: 'P1'
  }
];

const columns = [
  {
    field: 'title',
    title: 'title',
    width: 'auto',
    sort: true,
    tree: true,
    editor: 'input'
  },
  {
    field: 'start',
    title: 'start',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  },
  {
    field: 'end',
    title: 'end',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  }
];
const option = {
  overscrollBehavior: 'none',
  records,
  taskListTable: {
    columns,
    tableWidth: 250,
    minTableWidth: 100,
    maxTableWidth: 600,
    theme: {
      headerStyle: {
        borderColor: '#e1e4e8',
        borderLineWidth: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        bgColor: '#EEF1F5'
      },
      bodyStyle: {
        borderColor: '#e1e4e8',
        borderLineWidth: [1, 0, 1, 0],
        fontSize: 16,
        color: '#4D4D4D',
        bgColor: '#FFF'
      }
    }
    //rightFrozenColCount: 1
  },
  frame: {
    outerFrameStyle: {
      borderLineWidth: 2,
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 3
    },
    horizontalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 3
    },
    verticalSplitLineMoveable: true,
    verticalSplitLineHighlight: {
      lineColor: 'green',
      lineWidth: 3
    }
  },
  grid: {
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
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    resizable: true,
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    labelText: '{title}  complete {progress}%',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'left',
      textOverflow: 'ellipsis'
    },
    barStyle: {
      width: 20,
      /** 任务条的颜色 */
      barColor: '#ee8800',
      /** 已完成部分任务条的颜色 */
      completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 8,
      /** 任务条的边框 */
      borderLineWidth: 1,
      /** 边框颜色 */
      borderColor: 'black'
    }
  },
  timelineHeader: {
    colWidth: 100,
    backgroundColor: '#EEF1F5',
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
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
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom',
          backgroundColor: '#EEF1F5',
          textStick: true
          // padding: [0, 30, 0, 20]
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
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom',
          backgroundColor: '#EEF1F5'
        }
      }
    ]
  },
  markLine: [
    {
      date: '2024/8/02',
      scrollToMarkLine: true,
      position: 'left',
      style: {
        lineColor: 'red',
        lineWidth: 1
      }
    }
  ],
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true,
    headerStyle: {
      bgColor: '#EEF1F5',
      borderColor: '#e1e4e8'
    },
    style: {
      borderColor: '#e1e4e8'
    }
  },
  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    visible: 'scrolling',
    width: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  },
  plugins: [exportGanttPlugin]
};

const container = document.getElementById(CONTAINER_ID);

// 创建一个包装容器
const wrapper = document.createElement('div');
wrapper.style.height = '100%';
wrapper.style.width = '100%';
wrapper.style.position = 'relative';
container.appendChild(wrapper);

// 创建导出面板，放入包装容器
const exportPanel = document.createElement('div');
exportPanel.id = EXPORT_PANEL_ID;
exportPanel.style.cssText = 'padding: 2px; background-color: #f6f6f6; margin-bottom: 2px; position: absolute; z-index: 1; border: 1px solid black; opacity: 0.5;';
wrapper.appendChild(exportPanel);

// 创建甘特图容器，放入包装容器
const ganttContainer = document.createElement('div');
ganttContainer.style.height = '100%';
ganttContainer.style.width = '100%';
ganttContainer.style.position = 'relative'; 
wrapper.appendChild(ganttContainer);

// 文件格式选择
const formatSelect = document.createElement('select');
formatSelect.innerHTML = `
<option value="png">PNG</option>
`;
formatSelect.style.marginRight = '5px';

// 缩放比例选择
const scaleSelect = document.createElement('select');
scaleSelect.innerHTML = `
<option value="1">1x</option>
<option value="2">2x</option>
<option value="3">3x</option>
`;
scaleSelect.style.marginRight = '5px';

// 背景色选择
const bgColorInput = document.createElement('input');
bgColorInput.type = 'color';
bgColorInput.value = '#ffffff';
bgColorInput.style.marginRight = '5px';

// 导出按钮
const exportButton = document.createElement('button');
exportButton.textContent = '导出甘特图';
exportButton.style.marginLeft = '5px';

// 获取 Base64 按钮
const getBase64Button = document.createElement('button');
getBase64Button.textContent = '获取 Base64';
getBase64Button.style.marginLeft = '5px';
getBase64Button.style.backgroundColor = '#e8f4ff';

const base64Result = document.createElement('div');
base64Result.style.marginTop = '10px';
base64Result.style.fontSize = '12px';
base64Result.style.color = '#666';
base64Result.style.display = 'none';
base64Result.style.padding = '5px';
base64Result.style.backgroundColor = '#f8f8f8';
base64Result.style.borderRadius = '3px';
base64Result.style.maxWidth = '100%';
base64Result.style.overflow = 'hidden';
base64Result.style.textOverflow = 'ellipsis';
base64Result.style.whiteSpace = 'nowrap';

// 说明文本
const infoText = document.createElement('div');
infoText.innerHTML = '导出功能会直接捕获完整的甘特图和任务列表，即使部分内容在滚动区域外。';
infoText.style.marginTop = '10px';
infoText.style.fontSize = '12px';
infoText.style.color = '#666';

// 添加控件到面板
exportPanel.appendChild(document.createTextNode('格式: '));
exportPanel.appendChild(formatSelect);
exportPanel.appendChild(document.createTextNode('缩放: '));
exportPanel.appendChild(scaleSelect);
exportPanel.appendChild(document.createTextNode('背景色: '));
exportPanel.appendChild(bgColorInput);
exportPanel.appendChild(exportButton);
exportPanel.appendChild(getBase64Button);
exportPanel.appendChild(infoText);
exportPanel.appendChild(base64Result);

// 创建甘特图实例
const gantt = new VTableGantt.Gantt(ganttContainer, option);

// 绑定导出事件
exportButton.onclick = async () => {
  try {
    exportButton.disabled = true;
    exportButton.textContent = '导出中...';
    
    await exportGanttPlugin.exportToImage({
        fileName: '甘特图导出测试',
        type: 'png',
        scale: Number(scaleSelect.value),
        backgroundColor: bgColorInput.value,
        quality: 1
    });

    exportButton.textContent = '导出成功！';
    setTimeout(() => {
        exportButton.disabled = false;
        exportButton.textContent = '导出甘特图';
    }, 2000);
  } catch (error) {
    exportButton.textContent = '导出失败';
    setTimeout(() => {
        exportButton.disabled = false;
        exportButton.textContent = '导出甘特图';
    }, 2000);
  }
};


getBase64Button.onclick = async () => {
  try {
    getBase64Button.disabled = true;
    getBase64Button.textContent = '获取中...';
    base64Result.style.display = 'none';

    // 使用相同的导出逻辑，但设置download为false
    const base64Data = await exportGanttPlugin.exportToImage({
      type: 'png',
      scale: Number(scaleSelect.value),
      backgroundColor: bgColorInput.value,
      quality: 1,
      download: false // 不触发下载
    });

    // 显示结果
    if (base64Data) {
      const displayText = base64Data.substring(0, 64) + '...';
      base64Result.textContent = displayText;
      base64Result.style.display = 'block';
      base64Result.title = base64Data; // 鼠标悬停可以看到完整数据
      
      // 尝试复制到剪贴板
      try {
        await navigator.clipboard.writeText(base64Data);
        getBase64Button.textContent = '已复制到剪贴板';
      } catch (clipboardError) {
        getBase64Button.textContent = '获取成功';
        console.warn('无法复制到剪贴板:', clipboardError);
      }
      
      // 添加点击事件以查看完整数据
      base64Result.style.cursor = 'pointer';
    } else {
      base64Result.textContent = '获取Base64数据失败';
      base64Result.style.display = 'block';
      getBase64Button.textContent = '获取失败';
    }
    
    // 恢复按钮状态
    setTimeout(() => {
      getBase64Button.disabled = false;
      if (getBase64Button.textContent === '获取中...' || getBase64Button.textContent === '获取失败' || getBase64Button.textContent === '已复制到剪贴板') {
        getBase64Button.textContent = '获取 Base64';
      }
    }, 3000);
  } catch (error) {
    console.error('获取Base64失败:', error);
    base64Result.textContent = `获取失败: ${error instanceof Error ? error.message : '未知错误'}`;
    base64Result.style.display = 'block';
    getBase64Button.textContent = '获取失败';
    
    setTimeout(() => {
      getBase64Button.disabled = false;
      getBase64Button.textContent = '获取 Base64';
    }, 2000);
  }
};
```
# This document was contributed by:

[Abstract chips](https://github.com/Violet2314)