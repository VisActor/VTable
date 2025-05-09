import { ExportGanttPlugin } from '../../src';
import * as VTableGantt from '@visactor/vtable-gantt';

const CONTAINER_ID = 'vTable';
const EXPORT_PANEL_ID = 'gantt-export-panel';
const exportGanttPlugin = new ExportGanttPlugin();

export function createTable() {
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
        },
        {
            id: 7,
            title: 'Task 7',
            developer: 'liufangfang.jane@bytedance.com',
            start: '2024-07-25',
            end: '2024-07-28',
            progress: 45,
            priority: 'P0'
          },
          {
            id: 8,
            title: 'Task 8',
            developer: 'liufangfang.jane@bytedance.com',
            start: '07/26/2024',
            end: '07/30/2024',
            progress: 82,
            priority: 'P1'
          },
          {
            id: 9,
            title: 'Task 9',
            developer: 'liufangfang.jane@bytedance.com',
            start: '2024-07-27',
            end: '2024-07-30',
            progress: 15,
            priority: 'P0'
          },
          {
            id: 10,
            title: 'Task 10',
            developer: 'liufangfang.jane@bytedance.com',
            start: '07/28/2024',
            end: '08/02/2024',
            progress: 67,
            priority: 'P0'
          },
          {
            id: 11,
            title: 'Task 11',
            developer: 'liufangfang.jane@bytedance.com',
            start: '2024-07-29',
            end: '2024-08-03',
            progress: 93,
            priority: 'P0'
          },
          {
            id: 12,
            title: 'Task 12',
            developer: 'liufangfang.jane@bytedance.com',
            start: '2024-07-30',
            end: '08/04/2024',
            progress: 28,
            priority: 'P1'
          },
          {
            id: 13,
            title: 'Task 13',
            developer: 'liufangfang.jane@bytedance.com',
            start: '07/31/2024',
            end: '2024-08-05',
            progress: 76,
            priority: 'P0'
          },
          {
            id: 14,
            title: 'Task 14',
            developer: 'liufangfang.jane@bytedance.com',
            start: '2024-08-01',
            end: '2024-08-06',
            progress: 50,
            priority: 'P0'
          },
          {
            id: 15,
            title: 'Task 15',
            developer: 'liufangfang.jane@bytedance.com',
            start: '08/02/2024',
            end: '08/07/2024',
            progress: 11,
            priority: 'P1'
          },
          {
            id: 16,
            title: 'Task 16',
            developer: 'liufangfang.jane@bytedance.com',
            start: '2024-08-03',
            end: '2024-08-08',
            progress: 64,
            priority: 'P0'
          },
          {
            id: 17,
            title: 'Task 17',
            developer: 'liufangfang.jane@bytedance.com',
            start: '08/04/2024',
            end: '2024-08-09',
            progress: 89,
            priority: 'P0'
          },
          {
            id: 18,
            title: 'Task 18',
            developer: 'liufangfang.jane@bytedance.com',
            start: '2024-08-05',
            end: '08/10/2024',
            progress: 33,
            priority: 'P1'
          },
          {
            id: 19,
            title: 'Task 19',
            developer: 'liufangfang.jane@bytedance.com',
            start: '08/06/2024',
            end: '2024-08-11',
            progress: 72,
            priority: 'P0'
          },
          {
            id: 20,
            title: 'Task 20',
            developer: 'liufangfang.jane@bytedance.com',
            start: '2024-08-07',
            end: '2024-08-12',
            progress: 55,
            priority: 'P0'
          },
          {
            id: 21,
            title: 'Task 21',
            developer: 'liufangfang.jane@bytedance.com',
            start: '08/08/2024',
            end: '08/13/2024',
            progress: 98,
            priority: 'P1'
          },
          {
            id: 22,
            title: 'Task 22',
            developer: 'liufangfang.jane@bytedance.com',
            start: '2024-08-09',
            end: '2024-08-14',
            progress: 20,
            priority: 'P0'
          },
          {
            id: 23,
            title: 'Task 23',
            developer: 'liufangfang.jane@bytedance.com',
            start: '08/10/2024',
            end: '2024-08-15',
            progress: 63,
            priority: 'P0'
          },
          {
            id: 24,
            title: 'Task 24',
            developer: 'liufangfang.jane@bytedance.com',
            start: '2024-08-11',
            end: '08/16/2024',
            progress: 42,
            priority: 'P1'
          },
          {
            id: 25,
            title: 'Task 25',
            developer: 'liufangfang.jane@bytedance.com',
            start: '08/12/2024',
            end: '2024-08-17',
            progress: 85,
            priority: 'P0'
          },
          {
            id: 26,
            title: 'Task 26',
            developer: 'liufangfang.jane@bytedance.com',
            start: '2024-08-13',
            end: '2024-08-18',
            progress: 37,
            priority: 'P0'
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
            tableWidth: 300,
            minTableWidth: 100,
            maxTableWidth: 1000,
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

    // 获取或创建容器
    const container = document.getElementById(CONTAINER_ID)!;

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
    ganttContainer.style.height = '100%'; // 减去导出面板的高度
    ganttContainer.style.width = '100%';
    ganttContainer.style.position = 'relative'; 
    wrapper.appendChild(ganttContainer);

    // 文件格式选择
    const formatSelect = document.createElement('select');
    formatSelect.innerHTML = `
    <option value="png">PNG</option>
    <option value="jpeg">JPEG</option>
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
    exportPanel.appendChild(infoText);

    // 创建甘特图实例
    const gantt = new VTableGantt.Gantt(ganttContainer, option);

    // 绑定导出事件
    exportButton.onclick = async () => {
        try {
            exportButton.disabled = true;
            exportButton.textContent = '导出中...';
            
            await exportGanttPlugin.exportToImage({
                fileName: '甘特图导出测试',
                type: formatSelect.value as 'png' | 'jpeg',
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
            console.error('导出失败:', error);
            exportButton.textContent = '导出失败';
            setTimeout(() => {
                exportButton.disabled = false;
                exportButton.textContent = '导出甘特图';
            }, 2000);
        }
    };

    return gantt;
}