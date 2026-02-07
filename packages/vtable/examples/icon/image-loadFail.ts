/* eslint-disable max-len */
import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

export function createTable() {
  // register icon
  VTable.register.clearAll?.();
  VTable.register.icon('sort_normal', {
    type: 'svg',
    svg: `<svg t="1669210412838" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5700" width="200" height="200"><path d="M420.559974 72.98601l-54.855 0 0 774.336c-52.455014-69.163008-121.619046-123.762995-201.120051-157.052006l0 61.968c85.838029 41.401958 156.537958 111.337984 201.120051 198.221005l0 0.208 54.855 0 0-13.047c0.005018-0.00297 0.010035-0.005018 0.01495-0.007987-0.005018-0.010035-0.010035-0.019968-0.01495-0.030003L420.559974 72.986zM658.264986 73.385984l0-0.4L603.41 72.985984l0 877.68 54.855 0L658.265 176.524c52.457984 69.178982 121.632051 123.790029 201.149952 157.078016l0-61.961C773.560013 230.238003 702.853018 160.287027 658.264986 73.385984z" p-id="5701"></path></svg>`,
    width: 20, //其实指定的是svg图片绘制多大，实际占位是box，margin也是相对阴影范围指定的
    height: 20,
    funcType: VTable.TYPES.IconFuncTypeEnum.sort,
    name: 'sort_normal',
    positionType: VTable.TYPES.IconPosition.inlineFront,
    marginLeft: 0,
    marginRight: 0,
    hover: {
      width: 24,
      height: 24,
      bgColor: 'rgba(22,44,66,0.5)'
    },
    cursor: 'pointer'
  });
  VTable.register.icon('damage_pic', {
    type: 'svg',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.4004 3C19.1675 3.00021 20.5996 4.43301 20.5996 6.2002V9.99805H19V8.2002C16 8.20019 5.99961 8.2002 4.59961 8.2002V17.4004C4.59982 18.2839 5.31667 19 6.2002 19H10.0752V20.5996H6.2002C4.43301 20.5996 3.00021 19.1675 3 17.4004V6.2002C3 4.43288 4.43288 3 6.2002 3H17.4004Z" fill="#89909D"/>
<rect x="10.4391" y="1.77002" width="1.57141" height="7.75455" transform="rotate(30 10.4391 1.77002)" fill="#F5F5F5"/>
<rect x="16.1362" y="1.77002" width="1.57141" height="7.75455" transform="rotate(30 16.1362 1.77002)" fill="#F5F5F5"/>
<rect x="9.01111" y="18.9974" width="2.9856" height="1.60126" rx="0.800629" fill="#89909D"/>
<rect x="20.5996" y="9.0144" width="2.9856" height="1.60126" rx="0.800629" transform="rotate(90 20.5996 9.0144)" fill="#89909D"/>
<path d="M14.0118 12.3432C14.5273 12.6408 14.5273 13.3849 14.0118 13.6825L11.2737 15.2633C10.7582 15.5609 10.1139 15.1889 10.1139 14.5937L10.1139 11.432C10.1139 10.8368 10.7582 10.4648 11.2737 10.7624L14.0118 12.3432Z" fill="#89909D"/>
<path d="M17.276 13.4425C19.3471 13.4425 21.026 15.1214 21.026 17.1925C21.0259 19.2635 19.347 20.9425 17.276 20.9425C15.2052 20.9423 13.5261 19.2634 13.526 17.1925C13.526 15.1216 15.2051 13.4427 17.276 13.4425ZM19.2643 15.2052C18.972 14.9129 18.497 14.9129 18.2047 15.2052L17.275 16.1349L16.3463 15.2052C16.054 14.9131 15.58 14.9131 15.2877 15.2052C14.9956 15.4975 14.9956 15.9715 15.2877 16.2638L16.2164 17.1935L15.2877 18.1222C14.9958 18.4144 14.9958 18.8885 15.2877 19.1808C15.58 19.4727 16.0541 19.4727 16.3463 19.1808L17.275 18.2521L18.2047 19.1808C18.497 19.473 18.971 19.4729 19.2633 19.1808C19.5554 18.8885 19.5555 18.4145 19.2633 18.1222L18.3336 17.1935L19.2633 16.2638C19.5555 15.9716 19.5561 15.4976 19.2643 15.2052Z" fill="#89909D"/>
</svg>
`,
    width: 22,
    height: 22,
    name: 'damage_pic',
    positionType: VTable.TYPES.IconPosition.right,
    marginRight: 0,
    funcType: VTable.TYPES.IconFuncTypeEnum.frozen,
    hover: {
      width: 22,
      height: 22,
      bgColor: 'rgba(101, 117, 168, 0.1)'
    },
    cursor: 'pointer'
  });

  const option: VTable.ListTableConstructorOptions = {
    columns: [
      {
        field: '260115120130324',
        title: 'url_without_feature',

        cellType: 'link',
        linkDetect: true,
        linkJump: false
      },

      {
        field: '260126115409121',
        title: '视频展示',
        cellType: 'video',
        keepAspectRatio: true
      },
      {
        field: '260126120531113',
        title: '图片展示',
        cellType: 'image',
        keepAspectRatio: true
      }
    ],
    records: [
      {
        '260104175901080': 'Meeseeks',
        '260104175901129': 'NULL',
        '260115120130324': 'https://baidu.com',
        '260112162342618': 'ffdsagfjks \ngfgsa',
        '260126120531113': 'ffdsagfjks \ngfgsa',
        '260112162342767': 'zhangyu.rd',
        '260113172146138': '仪表盘编辑',
        '260113172146293': '1770350403',
        '260104175901031': '1',
        '260104215351023': '50'
      },
      {
        '260104175901080': 'Meeseeks',
        '260104175901129': 'NULL',
        '260126120531113': 'https://google.com',
        '260112162342767': 'zhangyu.rd',
        '260113172146138': '仪表盘编辑',
        '260113172146293': '1770350398',
        '260104175901031': '1',
        '260104215351023': '43'
      },
      {
        '260104175901080': '视频架构-服务架构-稳定性',
        '260104175901129': 'NULL',
        '260126120531113': 'aaff',
        '260112162342767': 'helanxin',
        '260113172146138': '仪表盘查看',
        '260113172146293': '1770360718',
        '260104175901031': '1',
        '260104215351023': '43'
      }
    ],
    showHeader: true,
    hover: {
      highlightMode: 'row'
    },
    select: {
      highlightMode: 'cell',
      headerSelectMode: 'inline'
    },
    hash: '86fd7d435bfab447bf9850d2ce037810',
    pixelRatio: 2
  };
  const instance = new ListTable(document.getElementById(CONTAINER_ID), option);

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
