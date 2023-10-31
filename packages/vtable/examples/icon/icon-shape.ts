/* eslint-disable max-len */
import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  VTable.register.icon('more', {
    type: 'svg', //指定svg格式图标，其他还支持path，image，font
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 3 13" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0L2.4 1.04907e-07L2.4 2.13333L-9.3251e-08 2.13333L0 0ZM-2.33127e-07 5.33333L2.4 5.33333L2.4 7.46667L-3.26378e-07 7.46667L-2.33127e-07 5.33333ZM-4.66255e-07 10.6667L2.4 10.6667L2.4 12.8L-5.59506e-07 12.8L-4.66255e-07 10.6667Z" fill="#141414" fill-opacity="0.65"/>
    </svg>`,
    width: 16,
    height: 16,
    // funcType: VTable.TYPES.IconFuncTypeEnum.sort,//对应内部特定功能的图标，目前有sort frozen expand等
    name: 'more', //定义图标的名称，在内部会作为缓存的key值
    positionType: VTable.TYPES.IconPosition.right, // 指定位置，可以在文本的前后，或者在绝对定位在单元格的左侧右侧
    marginLeft: 10, // 左侧内容间隔 在特定位置position中起作用
    marginRight: 0, // 右侧内容间隔 在特定位置position中起作用
    visibleTime: 'always', // 显示时机， 'always' | 'mouseover_cell' | 'click_cell'
    cursor: 'pointer',
    hover: {
      // 热区大小
      width: 22,
      height: 22,
      bgColor: 'rgba(22,44,66,0.5)'
    },
    hoverSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 3 13" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0L2.4 1.04907e-07L2.4 2.13333L-9.3251e-08 2.13333L0 0ZM-2.33127e-07 5.33333L2.4 5.33333L2.4 7.46667L-3.26378e-07 7.46667L-2.33127e-07 5.33333ZM-4.66255e-07 10.6667L2.4 10.6667L2.4 12.8L-5.59506e-07 12.8L-4.66255e-07 10.6667Z" fill="#1FF414" fill-opacity="0.65"/>
      </svg>`,
    tooltip: {
      // 气泡框，按钮的的解释信息
      title: '更多操作',
      style: { bgColor: 'black', arrowMark: true, color: 'white' }
    }
  });
  const personsDataSource = [
    {
      progress: 100,
      id: 1,
      name: 'alibb',
      avatar: 'http://' + window.location.host + '/mock-data/custom-render/flower.jpg'
    },
    {
      progress: 80,
      id: 2,
      name: 'bala po',
      avatar: 'http://' + window.location.host + '/mock-data/custom-render/wolf.jpg'
    },
    {
      progress: 1,
      id: 3,
      name: 'chrtydyd gfdf',
      avatar: 'http://' + window.location.host + '/mock-data/custom-render/rabbit.jpg'
    },
    {
      progress: 55,
      id: 4,
      name: 'dimsen',
      avatar: 'http://' + window.location.host + '/mock-data/custom-render/cat.jpg'
    },
    {
      progress: 28,
      id: 5,
      name: 'elis',
      avatar: 'http://' + window.location.host + '/mock-data/custom-render/bear.jpg'
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'progress',
        fieldFormat(rec) {
          return `已完成${rec.progress}%`;
        },
        title: 'progress',
        description: '这是一个标题的详细描述',
        width: 150,
        headerIcon: [
          {
            type: 'svg', //指定svg格式图标，其他还支持path，image，font
            svg: `<svg t="1669305300496" class="icon" viewBox="0 0 1034 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3506" width="200" height="200"><path d="M1033.244444 652.8c0 6.4 0 19.2 0 32s-6.4 25.6-12.8 38.4c-6.4 12.8-12.8 25.6-19.2 32-6.4 12.8-12.8 19.2-25.6 19.2-6.4 6.4-19.2 6.4-25.6 6.4-6.4 0-12.8 0-19.2-6.4-6.4 0-19.2-6.4-25.6-6.4-12.8 0-19.2 0-32 0s-25.6 6.4-32 6.4c-12.8 6.4-19.2 12.8-32 19.2-19.2 19.2-25.6 38.4-32 64 0 25.6 0 44.8 12.8 64 6.4 12.8 6.4 32-6.4 44.8-6.4 6.4-12.8 12.8-19.2 19.2-6.4 6.4-19.2 12.8-32 19.2-12.8 6.4-25.6 6.4-38.4 12.8-12.8 0-25.6 6.4-32 6.4-6.4 0-12.8 0-19.2-6.4-6.4-6.4-12.8-12.8-12.8-19.2l0 0c-6.4-25.6-19.2-44.8-38.4-57.6-19.2-19.2-44.8-25.6-70.4-25.6S476.444444 921.6 450.844444 940.8c-19.2 19.2-32 38.4-44.8 57.6-6.4 6.4-6.4 12.8-19.2 19.2C386.844444 1024 380.444444 1024 367.644444 1024c-12.8 0-19.2 0-32-6.4-12.8-6.4-25.6-6.4-38.4-12.8-12.8-6.4-25.6-12.8-32-19.2-12.8-6.4-19.2-12.8-25.6-19.2-6.4-6.4-6.4-12.8-6.4-19.2 0-6.4 0-19.2 6.4-32 6.4-19.2 12.8-38.4 6.4-57.6 0-19.2-12.8-44.8-25.6-57.6S194.844444 780.8 182.044444 780.8c-12.8-6.4-25.6-6.4-44.8-6.4-12.8 0-32 6.4-44.8 6.4s-19.2 0-32 0c-6.4 0-12.8-12.8-25.6-19.2-6.4-12.8-12.8-25.6-19.2-38.4C9.244444 710.4 2.844444 697.6 2.844444 684.8s-6.4-25.6 0-32c0-19.2 6.4-25.6 19.2-32C54.044444 614.4 73.244444 595.2 92.444444 576s25.6-44.8 25.6-64c0-25.6-6.4-51.2-25.6-64C73.244444 422.4 54.044444 409.6 34.844444 403.2 28.444444 396.8 22.044444 390.4 15.644444 384 9.244444 377.6 9.244444 364.8 9.244444 358.4c0-6.4 0-19.2 6.4-32 0-12.8 6.4-25.6 12.8-32 6.4-12.8 12.8-19.2 19.2-32 0-6.4 6.4-12.8 12.8-19.2C66.844444 236.8 73.244444 236.8 79.644444 236.8c6.4 0 12.8 0 19.2 6.4 19.2 6.4 44.8 12.8 64 6.4 25.6-6.4 44.8-12.8 64-32 6.4-6.4 12.8-19.2 19.2-32 6.4-12.8 6.4-25.6 6.4-38.4s0-25.6 0-32c0-12.8 0-19.2 0-19.2 0-6.4 0-6.4-6.4-12.8 0-6.4 0-12.8 0-12.8 6.4-19.2 19.2-25.6 25.6-38.4 12.8-6.4 25.6-12.8 38.4-19.2C322.844444 6.4 335.644444 6.4 348.444444 0c12.8 0 25.6 0 32 0C386.844444 0 393.244444 0 399.644444 6.4c6.4 6.4 6.4 12.8 12.8 19.2C418.844444 51.2 431.644444 64 450.844444 83.2c19.2 12.8 38.4 25.6 64 25.6 25.6 0 51.2-6.4 70.4-19.2 19.2-12.8 32-32 44.8-57.6 0-6.4 6.4-12.8 12.8-19.2C649.244444 0 655.644444 0 662.044444 0c12.8 0 19.2 0 32 6.4 12.8 0 25.6 6.4 38.4 12.8 12.8 6.4 25.6 12.8 32 19.2C770.844444 44.8 777.244444 51.2 783.644444 64c6.4 6.4 6.4 12.8 6.4 19.2 0 6.4 0 12.8-6.4 12.8-6.4 19.2-12.8 44.8-6.4 64 6.4 25.6 12.8 44.8 32 64s38.4 25.6 64 32c25.6 0 51.2 0 70.4-12.8 6.4-6.4 12.8-6.4 19.2-6.4 6.4 0 12.8 6.4 19.2 12.8 12.8 12.8 19.2 25.6 32 44.8 6.4 19.2 12.8 44.8 19.2 64 0 12.8 0 19.2-6.4 32-6.4 6.4-12.8 12.8-19.2 12.8C982.044444 409.6 962.844444 422.4 950.044444 448c-19.2 19.2-25.6 44.8-25.6 70.4 0 25.6 6.4 44.8 19.2 64 12.8 19.2 32 32 51.2 38.4 6.4 0 6.4 6.4 12.8 6.4C1020.444444 633.6 1026.844444 640 1033.244444 652.8L1033.244444 652.8 1033.244444 652.8 1033.244444 652.8zM521.244444 748.8c32 0 64-6.4 96-19.2 32-12.8 57.6-32 76.8-51.2 19.2-19.2 38.4-44.8 51.2-76.8C751.644444 576 758.044444 544 758.044444 512s-6.4-64-19.2-96C726.044444 384 706.844444 364.8 687.644444 339.2 668.444444 320 642.844444 300.8 610.844444 288 585.244444 275.2 553.244444 268.8 521.244444 268.8s-64 6.4-96 19.2C399.644444 300.8 374.044444 320 348.444444 339.2 329.244444 364.8 310.044444 390.4 297.244444 416 290.844444 448 284.444444 480 284.444444 512s6.4 64 19.2 96c12.8 32 32 57.6 51.2 76.8 19.2 19.2 44.8 38.4 76.8 51.2C457.244444 742.4 489.244444 748.8 521.244444 748.8L521.244444 748.8 521.244444 748.8 521.244444 748.8z" p-id="3507"></path></svg>`,
            width: 20,
            height: 20,
            // funcType: VTable.TYPES.IconFuncTypeEnum.sort,//对应内部特定功能的图标，目前有sort frozen expand等
            name: 'setting', //定义图标的名称，在内部会作为缓存的key值
            positionType: VTable.TYPES.IconPosition.right, // 指定位置，可以在文本的前后，或者在绝对定位在单元格的左侧右侧
            marginLeft: 0, // 左侧内容间隔 在特定位置position中起作用
            marginRight: 0, // 右侧内容间隔 在特定位置position中起作用
            hover: {
              // 热区大小
              width: 22,
              height: 22,
              bgColor: 'rgba(22,44,66,0.2)'
            },
            tooltip: {
              style: { arrowMark: true },
              placement: VTable.TYPES.Placement.top,
              // 气泡框，按钮的的解释信息
              title: '对象定义形式 非注册'
            }
          }
        ]
      },
      {
        field: 'id',
        title: 'ID编号',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        },
        width: 100,
        headerIcon: ['filter']
      },
      {
        field: 'id',
        fieldFormat(rec) {
          return `这是第${rec.id}号`;
        },
        title: 'ID说明',
        description: '这是一个ID详细描述',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        },
        width: 150
      },
      {
        title: 'Name',
        headerStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'sans-serif'
        },
        field: 'name',
        width: 'auto',
        icon: {
          type: 'image',
          src: 'avatar',
          name: 'Avatar',
          shape: 'circle',
          //定义文本内容行内图标，第一个字符展示
          width: 30, // Optional
          height: 30,
          positionType: VTable.TYPES.IconPosition.contentLeft,
          marginRight: 20,
          marginLeft: 0,
          cursor: 'pointer'
        }
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2,
    heightMode: 'autoHeight',
    autoWrapText: true,
    tooltip: {
      renderMode: 'html',
      isShowOverflowTextTooltip: false,
      confine: true
    }
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(personsDataSource, {
    field: 'progress',
    order: 'desc'
  });

  let hoverIconKey;
  instance.on('mousemove_cell', args => {
    if (args.targetIcon) {
      const key = `${args.col}-${args.row}-${args.targetIcon?.name}`;
      if (args.targetIcon?.name === 'Avatar' && hoverIconKey !== key) {
        hoverIconKey = key;
        instance.showTooltip(args.col, args.row, {
          content: '你好！',
          referencePosition: { rect: args.targetIcon.position, placement: VTable.TYPES.Placement.right }, //TODO
          style: {
            bgColor: 'black',
            color: 'white',
            fontSize: 14,
            fontFamily: 'STKaiti',
            arrowMark: true
          }
        });
      }
    } else {
      hoverIconKey = '';
    }
  });
  bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
