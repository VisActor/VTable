/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
import { LinearScale } from '@visactor/vscale';

(window as any).LinearScale = LinearScale;
const CONTAINER_ID = 'vTable';
const IFRAME_CONTAINER_ID = 'vTableIframe';

VTable.register.chartModule('vchart', VChart);

// 创建iframe并初始化VTable
function createIframeAndInitTable() {
  // 获取主容器
  const mainContainer = document.getElementById(CONTAINER_ID);
  if (!mainContainer) {
    console.error(`Container ${CONTAINER_ID} not found`);
    return;
  }

  // 清空主容器
  mainContainer.innerHTML = '';

  // 创建iframe容器
  const iframeContainer = document.createElement('div');
  iframeContainer.id = IFRAME_CONTAINER_ID;
  iframeContainer.style.cssText = `
    width: 800px;
    height: 600px;
    border: 2px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  `;

  // 创建iframe
  const iframe = document.createElement('iframe');
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
  `;
  iframeContainer.appendChild(iframe);
  mainContainer.appendChild(iframeContainer);

  // 等待iframe加载完成后初始化VTable
  iframe.onload = () => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      console.error('Cannot access iframe document');
      return;
    }

    // 在iframe中创建HTML结构
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
            #${CONTAINER_ID} {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
        <div style="position: relative; height: 500px; width: 600px; overflow: hidden">
          <div id="vvv" style="position: relative; height: 100%; width: 100%; overflow: hidden"></div>
          </div>
          </body>
      </html>
    `);
    iframeDoc.close();

    // 在iframe中初始化VTable
    const iframeWindow = iframe.contentWindow;
    if (!iframeWindow) {
      console.error('Cannot access iframe window');
      return;
    }

    // 将必要的依赖注入到iframe的window对象
    (iframeWindow as any).LinearScale = LinearScale;

    // 等待DOM完全加载后再初始化VTable
    // write/close 后需要等待文档解析完成
    const initVTable = () => {
      const container = iframeDoc.getElementById('vvv');
      if (!container) {
        console.warn(`Container ${CONTAINER_ID} not found, retrying...`);
        // 如果容器还不存在，再等待一段时间
        setTimeout(initVTable, 50);
        return;
      }
      console.log('Container found, initializing VTable in iframe');
      // VChart已经在主模块中注册，可以直接使用
      // 在iframe中创建VTable实例
      initTableInIframe(iframeWindow, iframeDoc);
    };

    // 使用 setTimeout 确保 write/close 后的文档已经解析完成
    // 给一个小的延迟让浏览器有时间解析 DOM
    setTimeout(initVTable, 10);
  };

  // 设置iframe的src（使用about:blank避免跨域问题）
  iframe.src = 'about:blank';
}

// 在iframe中初始化VTable
function initTableInIframe(iframeWindow: Window, iframeDoc: Document) {
  // 将VTable和VChart注入到iframe的window对象，以便调试
  (iframeWindow as any).VTable = VTable;

  const theme = {
    bodyStyle: {
      borderColor: 'gray',
      borderLineWidth: [1, 0, 0, 1]
    },
    headerStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [0, 0, 0, 1],
      hover: {
        cellBgColor: '#CCE0FF'
      }
    },
    rowHeaderStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [1, 0, 1, 0],
      hover: {
        cellBgColor: ''
      }
    },
    cornerHeaderStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [0, 0, 1, 0],
      hover: {
        cellBgColor: ''
      }
    },
    cornerRightTopCellStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [0, 0, 1, 1],
      hover: {
        cellBgColor: ''
      }
    },
    cornerLeftBottomCellStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [1, 1, 0, 0],
      hover: {
        cellBgColor: ''
      }
    },
    cornerRightBottomCellStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [1, 0, 0, 1],
      hover: {
        cellBgColor: ''
      }
    },
    rightFrozenStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [1, 0, 1, 1],
      hover: {
        cellBgColor: ''
      }
    },
    bottomFrozenStyle: {
      borderColor: 'gray',
      borderLineWidth: [1, 1, 0, 1],
      hover: {
        cellBgColor: ''
      }
    },
    // selectionStyle: {
    //   cellBgColor: '',
    //   cellBorderColor: ''
    // },
    frameStyle: {
      borderLineWidth: 0
    },
    underlayBackgroundColor: '#ddd'
    // axisStyle: {
    //   defaultAxisStyle: {
    //     title: {
    //       style: {
    //         fill: 'red'
    //       }
    //     }
    //   },
    //   leftAxisStyle: {
    //     label: {
    //       style: {
    //         fill: 'yellow'
    //       }
    //     }
    //   }
    // }
  };

  const option = {
    animation: true,
    rows: [],
    columns: [],
    indicators: [
      {
        indicatorKey: 'sales-and-profit',
        title: '',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'bar',
          direction: 'vertical',
          xField: '__Dim_X__',
          yField: '__MeaValue__sales-and-profit',
          seriesField: '__Dim_ColorId__',
          padding: 0,
          region: [
            {
              clip: true
            }
          ],
          animation: true,
          bar: {
            state: {
              selected: {
                fill: 'yellow'
              },
              selected_reverse: {
                // fill: '#ddd',
                opacity: 0.2
              }
            }
          },
          brush: {
            // disableDimensionHoverWhenBrushing: true,
            visible: true,
            brushType: 'x',
            inBrush: {
              colorAlpha: 1
            },
            outOfBrush: {
              colorAlpha: 0.2
            }
          },
          stackInverse: true,
          color: {
            type: 'ordinal',
            domain: ['sales', 'profit', 'rateOfReturn'],
            range: [
              '#8D72F6',
              '#5766EC',
              '#66A3FE',
              '#51D5E6',
              '#4EC0B3',
              '#F9DF90',
              '#F9AD71',
              '#ED8888',
              '#E9A0C3',
              '#D77DD3'
            ]
          },
          background: 'transparent',
          data: {
            id: 'sales-and-profit',
            fields: {
              __Dim_Angle__: {
                sortIndex: 0
              },
              __Dim_X__: {
                sortIndex: 0
              },
              __Dim_ColorId__: {
                sortIndex: 0
              }
            }
          },
          large: false,
          largeThreshold: null,
          progressiveStep: 400,
          progressiveThreshold: null
        },
        style: {
          padding: [1, 1, 0, 1]
        }
      },
      {
        indicatorKey: 'ratio',
        title: '',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'bar',
          direction: 'vertical',
          xField: '__Dim_X__',
          yField: '__MeaValue__ratio',
          seriesField: '__Dim_ColorId__',
          padding: 0,
          region: [
            {
              clip: true
            }
          ],
          animation: true,
          brush: {
            // disableDimensionHoverWhenBrushing: true,
            visible: true,
            brushType: 'x',
            inBrush: {
              colorAlpha: 1
            },
            outOfBrush: {
              colorAlpha: 0.2
            }
          },
          stackInverse: true,
          color: {
            type: 'ordinal',
            domain: ['sales', 'profit', 'rateOfReturn'],
            range: [
              '#8D72F6',
              '#5766EC',
              '#66A3FE',
              '#51D5E6',
              '#4EC0B3',
              '#F9DF90',
              '#F9AD71',
              '#ED8888',
              '#E9A0C3',
              '#D77DD3'
            ]
          },
          background: 'transparent',
          data: {
            id: 'ratio',
            fields: {
              __Dim_Angle__: {
                sortIndex: 0
              },
              __Dim_X__: {
                sortIndex: 0
              },
              __Dim_ColorId__: {
                sortIndex: 0
              }
            }
          },
          large: false,
          largeThreshold: null,
          progressiveStep: 400,
          progressiveThreshold: null,
          bar: {
            style: {
              visible: true,
              fillOpacity: 1,
              lineWidth: 1
            },
            state: {
              hover: {
                fillOpacity: 0.6
              }
            }
          }
        },
        style: {
          padding: [1, 1, 0, 1]
        }
      }
    ],
    records: {
      'sales-and-profit': [
        {
          date: '2019',
          __OriginalData__: {
            date: '2019',
            profit: 10,
            sales: 20,

            rateOfReturn: 0.1
          },
          sales: 20,
          __MeaId__: 'sales',
          __MeaName__: 'sales',
          '__MeaValue__sales-and-profit': 20,
          __Dim_X__: '2019',
          __Dim_Color__: 'sales',
          __Dim_Detail__: 'sales',
          __Dim_ColorId__: 'sales'
        },
        {
          date: '2019',
          __OriginalData__: {
            date: '2019',
            profit: 10,
            sales: 20,
            rateOfReturn: 0.1
          },
          profit: 10,
          __MeaId__: 'profit',
          __MeaName__: '利润',
          '__MeaValue__sales-and-profit': 10,
          __Dim_X__: '2019',
          __Dim_Color__: 'profit',
          __Dim_Detail__: 'profit',
          __Dim_ColorId__: 'profit'
        },
        {
          date: '2020',
          __OriginalData__: {
            date: '2020',
            profit: 20,
            sales: 40,
            rateOfReturn: 0.2
          },
          sales: 40,
          __MeaId__: 'sales',
          __MeaName__: 'sales',
          '__MeaValue__sales-and-profit': 40,
          __Dim_X__: '2020',
          __Dim_Color__: 'sales',
          __Dim_Detail__: 'sales',
          __Dim_ColorId__: 'sales'
        },
        {
          date: '2020',
          __OriginalData__: {
            date: '2020',
            profit: 20,
            sales: 40,
            rateOfReturn: 0.2
          },
          profit: 20,
          __MeaId__: 'profit',
          __MeaName__: '利润',
          '__MeaValue__sales-and-profit': 20,
          __Dim_X__: '2020',
          __Dim_Color__: 'profit',
          __Dim_Detail__: 'profit',
          __Dim_ColorId__: 'profit'
        },
        {
          date: '2021',
          __OriginalData__: {
            date: '2021',
            profit: 30,
            sales: 60,
            rateOfReturn: 0.3
          },
          sales: 60,
          __MeaId__: 'sales',
          __MeaName__: 'sales',
          '__MeaValue__sales-and-profit': 60,
          __Dim_X__: '2021',
          __Dim_Color__: 'sales',
          __Dim_Detail__: 'sales',
          __Dim_ColorId__: 'sales'
        },
        {
          date: '2021',
          __OriginalData__: {
            date: '2021',
            profit: 30,
            sales: 60,
            rateOfReturn: 0.3
          },
          profit: 30,
          __MeaId__: 'profit',
          __MeaName__: '利润',
          '__MeaValue__sales-and-profit': 30,
          __Dim_X__: '2021',
          __Dim_Color__: 'profit',
          __Dim_Detail__: 'profit',
          __Dim_ColorId__: 'profit'
        },
        {
          date: '2022',
          __OriginalData__: {
            date: '2022',
            profit: 40,
            sales: 80,
            rateOfReturn: 0.4
          },
          sales: 80,
          __MeaId__: 'sales',
          __MeaName__: 'sales',
          '__MeaValue__sales-and-profit': 80,
          __Dim_X__: '2022',
          __Dim_Color__: 'sales',
          __Dim_Detail__: 'sales',
          __Dim_ColorId__: 'sales'
        },
        {
          date: '2022',
          __OriginalData__: {
            date: '2022',
            profit: 40,
            sales: 80,
            rateOfReturn: 0.4
          },
          profit: 40,
          __MeaId__: 'profit',
          __MeaName__: '利润',
          '__MeaValue__sales-and-profit': 40,
          __Dim_X__: '2022',
          __Dim_Color__: 'profit',
          __Dim_Detail__: 'profit',
          __Dim_ColorId__: 'profit'
        },
        {
          date: '2023',
          __OriginalData__: {
            date: '2023',
            profit: 50,
            sales: 100,
            rateOfReturn: 0.5
          },
          sales: 100,
          __MeaId__: 'sales',
          __MeaName__: 'sales',
          '__MeaValue__sales-and-profit': 100,
          __Dim_X__: '2023',
          __Dim_Color__: 'sales',
          __Dim_Detail__: 'sales',
          __Dim_ColorId__: 'sales'
        },
        {
          date: '2023',
          __OriginalData__: {
            date: '2023',
            profit: 50,
            sales: 100,
            rateOfReturn: 0.5
          },
          profit: 50,
          __MeaId__: 'profit',
          __MeaName__: '利润',
          '__MeaValue__sales-and-profit': 50,
          __Dim_X__: '2023',
          __Dim_Color__: 'profit',
          __Dim_Detail__: 'profit',
          __Dim_ColorId__: 'profit'
        }
      ],
      ratio: [
        {
          date: '2019',
          __OriginalData__: {
            date: '2019',
            profit: 10,
            sales: 20,
            rateOfReturn: 0.1
          },
          rateOfReturn: 0.1,
          __MeaId__: 'rateOfReturn',
          __MeaName__: '回报率',
          __MeaValue__ratio: 0.1,
          __Dim_X__: '2019',
          __Dim_Color__: 'rateOfReturn',
          __Dim_Detail__: 'rateOfReturn',
          __Dim_ColorId__: 'rateOfReturn'
        },
        {
          date: '2020',
          __OriginalData__: {
            date: '2020',
            profit: 20,
            sales: 40,
            rateOfReturn: 0.2
          },
          rateOfReturn: 0.2,
          __MeaId__: 'rateOfReturn',
          __MeaName__: '回报率',
          __MeaValue__ratio: 0.2,
          __Dim_X__: '2020',
          __Dim_Color__: 'rateOfReturn',
          __Dim_Detail__: 'rateOfReturn',
          __Dim_ColorId__: 'rateOfReturn'
        },
        {
          date: '2021',
          __OriginalData__: {
            date: '2021',
            profit: 30,
            sales: 60,
            rateOfReturn: 0.3
          },
          rateOfReturn: 0.3,
          __MeaId__: 'rateOfReturn',
          __MeaName__: '回报率',
          __MeaValue__ratio: 0.3,
          __Dim_X__: '2021',
          __Dim_Color__: 'rateOfReturn',
          __Dim_Detail__: 'rateOfReturn',
          __Dim_ColorId__: 'rateOfReturn'
        },
        {
          date: '2022',
          __OriginalData__: {
            date: '2022',
            profit: 40,
            sales: 80,
            rateOfReturn: 0.4
          },
          rateOfReturn: 0.4,
          __MeaId__: 'rateOfReturn',
          __MeaName__: '回报率',
          __MeaValue__ratio: 0.4,
          __Dim_X__: '2022',
          __Dim_Color__: 'rateOfReturn',
          __Dim_Detail__: 'rateOfReturn',
          __Dim_ColorId__: 'rateOfReturn'
        },
        {
          date: '2023',
          __OriginalData__: {
            date: '2023',
            profit: 50,
            sales: 100,
            rateOfReturn: 0.5
          },
          rateOfReturn: 0.5,
          __MeaId__: 'rateOfReturn',
          __MeaName__: '回报率',
          __MeaValue__ratio: 0.5,
          __Dim_X__: '2023',
          __Dim_Color__: 'rateOfReturn',
          __Dim_Detail__: 'rateOfReturn',
          __Dim_ColorId__: 'rateOfReturn'
        }
      ]
    },
    widthMode: 'standard',
    autoFillWidth: true,
    defaultHeaderColWidth: 'auto',
    defaultColWidth: 240,
    heightMode: 'standard',
    // "autoFillHeight": true,
    defaultRowHeight: 480,
    defaultHeaderRowHeight: 'auto',
    indicatorsAsCol: false,
    select: {
      highlightMode: 'cell',
      headerSelectMode: 'inline'
    },
    hover: {
      highlightMode: 'cross'
    },
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    corner: {
      titleOnDimension: 'row'
    },
    animationAppear: {
      duration: 600,
      type: 'all',
      direction: 'row'
    },
    theme: {
      underlayBackgroundColor: 'rgba(0,0,0,0)',
      bodyStyle: {
        borderColor: '#e3e5eb',
        color: '#141414',
        bgColor: 'rgba(0,0,0,0)',
        hover: {
          cellBgColor: 'transparent'
        }
      },
      headerStyle: {
        borderColor: '#e3e5eb',
        fontSize: 12,
        color: '#21252c',
        textAlign: 'center',
        bgColor: 'transparent',
        hover: {
          cellBgColor: 'rgba(0,0,0,0)',
          inlineRowBgColor: 'rgba(0,0,0,0)',
          inlineColumnBgColor: 'rgba(0,0,0,0)'
        }
      },
      rowHeaderStyle: {
        borderColor: '#e3e5eb',
        fontSize: 12,
        color: '#21252c',
        padding: [0, 12, 0, 4],
        bgColor: 'transparent',
        hover: {
          cellBgColor: 'rgba(0,0,0,0)',
          inlineRowBgColor: 'rgba(0,0,0,0)',
          inlineColumnBgColor: 'rgba(0,0,0,0)'
        }
      },
      cornerHeaderStyle: {
        borderColor: '#e3e5eb',
        textAlign: 'center',
        fontSize: 12,
        color: '#21252c',
        padding: [0, 12, 0, 4],
        fontWeight: 'bold',
        borderLineWidth: [0, 1, 1, 0],
        bgColor: 'transparent',
        frameStyle: {
          borderColor: '#e3e5eb'
        },
        hover: {
          cellBgColor: 'rgba(0,0,0,0)',
          inlineRowBgColor: 'rgba(0,0,0,0)',
          inlineColumnBgColor: 'rgba(0,0,0,0)'
        }
      },
      cornerLeftBottomCellStyle: {
        borderColor: '#e3e5eb',
        borderLineWidth: [0, 0, 0, 0],
        bgColor: 'transparent',
        frameStyle: {
          borderColor: '#e3e5eb',
          borderLineWidth: [1, 0, 0, 0]
        },
        hover: {
          cellBgColor: 'rgba(0,0,0,0)'
        }
      },
      cornerRightTopCellStyle: {
        borderColor: '#e3e5eb',
        borderLineWidth: [0, 0, 1, 1],
        frameStyle: {
          borderColor: '#e3e5eb',
          borderLineWidth: 0
        },
        bgColor: 'transparent',
        hover: {
          cellBgColor: 'rgba(0,0,0,0)'
        }
      },
      rightFrozenStyle: {
        borderColor: '#e3e5eb',
        bgColor: 'transparent',
        frameStyle: {
          borderLineWidth: 0
        },
        hover: {
          borderLineWidth: 0,
          cellBgColor: 'rgba(0,0,0,0)'
        }
      },
      cornerRightBottomCellStyle: {
        borderColor: '#e3e5eb',
        bgColor: 'transparent',
        borderLineWidth: [1, 0, 0, 1],
        frameStyle: {
          borderColor: '#e3e5eb',
          borderLineWidth: [1, 0, 0, 1]
        },
        hover: {
          cellBgColor: 'rgba(0,0,0,0)'
        }
      },
      bottomFrozenStyle: {
        borderColor: '#e3e5eb',
        borderLineWidth: [1, 0, 0, 1],
        bgColor: 'transparent',
        hover: {
          cellBgColor: 'rgba(0,0,0,0)'
        }
      },
      selectionStyle: {
        cellBgColor: '',
        cellBorderColor: ''
      },
      frameStyle: {
        borderColor: '#e3e5eb',
        cornerRadius: 0,
        borderLineWidth: 0
      },
      axisStyle: {
        leftAxisStyle: {
          cellPaddingLeft: 10
        },
        bottomAxisStyle: {
          cellPaddingBottom: 4
        },
        rightAxisStyle: {
          cellPaddingRight: 4
        }
      },
      scrollStyle: {
        visible: 'scrolling',
        hoverOn: false
      }
    },
    title: {
      text: 'dsagf',
      align: 'center',
      subtext: '这是一个子标题\ndsag反馈第三个国际服大教室',
      orient: 'top',
      padding: 40
    },

    legends: {
      padding: 0,
      visible: true,
      type: 'discrete',
      orient: 'bottom',
      position: 'start',
      maxCol: 1,
      maxRow: 1,
      data: [
        {
          label: 'sales',
          shape: {
            outerBorder: {
              stroke: '#8D72F6',
              distance: 3,
              lineWidth: 1
            },
            fill: '#8D72F6'
          }
        },
        {
          label: 'profit',
          shape: {
            outerBorder: {
              stroke: '#5766EC',
              distance: 3,
              lineWidth: 1
            },
            fill: '#5766EC'
          }
        },
        {
          label: 'rateOfReturn',
          shape: {
            outerBorder: {
              stroke: '#66A3FE',
              distance: 3,
              lineWidth: 1
            },
            fill: '#66A3FE'
          }
        }
      ],
      item: {
        focus: true,
        maxWidth: '30%',
        focusIconStyle: {
          size: 14,
          fill: '#606773',
          fontWeight: 400
        },
        shape: {
          space: 6,
          style: {
            symbolType: 'rectRound',
            size: 8
          }
        },
        label: {
          style: {
            fontSize: 12,
            fill: '#606773',
            fontWeight: 400
          }
        },
        background: {
          state: {
            selectedHover: {
              fill: '#606773',
              fillOpacity: 0.05
            }
          }
        }
      }
    },
    chartDimensionLinkage: {
      showTooltip: true,
      listenBrushChange: true,
      brushChangeDelay: 100,
      clearChartState() {
        console.log('----clearChartState');
        (iframeWindow as any).xValues = [];
        // tableInstance将在后面定义，这里先留空，后面会重新设置
      },
      inBrushStateFilter: datum => {
        const match = getXValues().includes(datum['__Dim_X__']);
        // console.log('inBrushStateFilter,!!!!!', datum.__MeaName__, getXValues())
        return match;
      },
      outOfBrushStateFilter: datum => {
        const match = getXValues().includes(datum['__Dim_X__']);
        // console.log('outOfBrushStateFilter,!!!!!', datum.__MeaName__, getXValues())
        return getXValues().length ? !match : false;
      }
    }
  };

  // 确保容器元素存在
  const containerElement = iframeDoc.getElementById('vvv');
  if (!containerElement) {
    console.error(`Container element ${CONTAINER_ID} not found in iframe document`);
    console.error('iframeDoc:', iframeDoc);
    console.error('iframe document body:', iframeDoc.body);
    console.error('iframeDoc readyState:', iframeDoc.readyState);
    return;
  }

  console.log('Creating VTable instance with container:', containerElement);
  console.log('Container element type:', containerElement.constructor.name);
  console.log('Container is HTMLElement:', containerElement instanceof HTMLElement);
  console.log('Container nodeName:', containerElement.nodeName);
  console.log('Container tagName:', containerElement.tagName);

  // 确保 containerElement 是一个有效的 DOM 元素
  if (!containerElement || !containerElement.nodeName) {
    console.error('Invalid container element');
    return;
  }
  debugger;
  // 将 container 放在 options 中，使用这种方式更可靠
  // 这样可以避免 instanceof 检查的问题
  const finalOption = {
    ...option,
    container: containerElement
  };
  debugger;
  console.log('Final option container:', finalOption.container);
  console.log('Final option container type:', typeof finalOption.container);

  const tableInstance = new VTable.PivotChart(finalOption as any);

  // 更新clearChartState以使用tableInstance
  if (option.chartDimensionLinkage) {
    option.chartDimensionLinkage.clearChartState = () => {
      console.log('----clearChartState');
      (iframeWindow as any).xValues = [];
      tableInstance.enableTooltipToAllChartInstances();
    };
  }

  (iframeWindow as any).xValues = [];
  function getXValues() {
    return (iframeWindow as any).xValues || [];
  }
  // tableInstance.onVChartEvent('brushEnd', params => {
  //   iframeWindow.xValues = params?.value?.inBrushData.map(v => v['__Dim_X__']);
  //   setTimeout(()=> {
  //     tableInstance.updateOption({
  //         ...option,
  //       records: {
  //         'sales-and-profit': option.records['sales-and-profit'].filter(v => ['2019', '2022'].includes(v['__Dim_X__'])),
  //         'ratio': option.records['ratio'].filter(v => ['2019', '2022'].includes(v['__Dim_X__']))
  //       }
  //     })
  // }, 1000)
  // });
  tableInstance.onVChartEvent('brushStart', params => {
    console.log('----brushStart');
    tableInstance.disableTooltipToAllChartInstances();
  });
  tableInstance.onVChartEvent('brushChange', params => {
    (iframeWindow as any).xValues = params?.value?.inBrushData.map(v => v['__Dim_X__']);
    // console.log('brushChange')
  });

  (iframeWindow as any).tableInstance = tableInstance;

  (iframeWindow as any).update = () => {
    theme.cornerLeftBottomCellStyle.borderColor = 'red';
    tableInstance.updateTheme(theme);
  };
  // setTimeout(() => {
  //   tableInstance.updateOption({
  //             ...option,
  //           records: {
  //             'sales-and-profit': option.records['sales-and-profit'].filter(v => ['2019', '2022'].includes(v['__Dim_X__'])),
  //             'ratio': option.records['ratio'].filter(v => ['2019', '2022'].includes(v['__Dim_X__']))
  //           }
  //         })
  // }, 10000);
}

export function createTable() {
  createIframeAndInitTable();
}
