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
  const generatePersons = count => {
    return Array.from(new Array(count)).map((_, i) => ({
      id: i + 1,
      email1: `${i + 1}@xxx.com`,
      name: `小明${i + 1}`,
      lastName: '王',
      date1: '2022年9月1日',
      tel: '000-0000-0000',
      sex: i % 2 === 0 ? 'boy' : 'girl',
      work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
      city: 'beijing'
    }));
  };

  const records = generatePersons(100);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 'auto',
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      // width: 200,
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name'
          // width: 200
        },
        {
          field: 'name',
          title: 'Last Name'
          // width: 200
        }
      ]
    },
    {
      field: 'date1',
      title: 'birthday'
      // width: 200
    },
    {
      field: 'sex',
      title: 'sex'
      // width: 100
    },
    {
      field: 'tel',
      title: 'telephone'
      // width: 150
    },
    {
      field: 'work',
      title: 'job'
      // width: 200
    },
    {
      field: 'city',
      title: 'city'
      // width: 150
    }
  ];
  const option = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns
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

  const tableInstance = new VTable.ListTable(finalOption as any);

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
