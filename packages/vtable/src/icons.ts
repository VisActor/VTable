/* eslint-disable max-len */
/*eslint-disable camelcase*/

import type { ColumnIconOption, ImageIcon, ITableThemeDefine, SvgIcon } from './ts-types';
import { IconPosition, IconFuncTypeEnum } from './ts-types';
import { extend } from './tools/helper';
import { icons as plugins } from './plugins/icons';
import { DrillDown, DrillUp } from './tools/global';
let sort_color: string;
let sort_color_opacity: string;
let sort_color_2: string;
let sort_color_opacity_2: string;
let sort_size: number;
let sort_size_2: number;
let frozen_color: string;
let frozen_color_opacity: string;
let freeze_color_opacity: string;
let frozen_color_2: string;
let frozen_color_opacity_2: string;
let frozen_size: number;
let frozen_size_2: number;
let collapse_color: string;
let collapse_color_opacity: string;
let collapse_size: number;
let collapse_size_2: number;
let expand_color: string;
let expand_color_opacity: string;
let expand_size: number;
let expand_size_2: number;
let dragReorder_color: string;
let dragReorder_color_opacity: string;
let dragReorder_size: number;
export function setIconColor(themeIconsColor: ITableThemeDefine['functionalIconsStyle']) {
  sort_color = themeIconsColor?.sort_color ?? '#282F38';
  sort_color_opacity = themeIconsColor?.sort_color_opacity ?? '0.35';
  sort_color_2 = themeIconsColor?.sort_color_2 ?? '#416EFF';
  sort_color_opacity_2 = themeIconsColor?.sort_color_opacity_2 ?? '1';
  sort_size = themeIconsColor?.sort_size ?? 16;
  sort_size_2 = themeIconsColor?.sort_size_2 ?? 22;
  frozen_color = themeIconsColor?.frozen_color ?? '#282F38';
  frozen_color_opacity = themeIconsColor?.frozen_color_opacity ?? '0.35';
  freeze_color_opacity = themeIconsColor?.frozen_color_opacity ?? '0.2'; //之前是个0.2  为了不让bugServer错误太多
  frozen_color_2 = themeIconsColor?.frozen_color_2 ?? '#416EFF';
  frozen_color_opacity_2 = themeIconsColor?.frozen_color_opacity_2 ?? '1';
  frozen_size = themeIconsColor?.frozen_size ?? 22;
  frozen_size_2 = themeIconsColor?.frozen_size_2 ?? 22;
  collapse_color = themeIconsColor?.collapse_color ?? '#141414';
  collapse_color_opacity = themeIconsColor?.collapse_color_opacity ?? '0.65';
  collapse_size = themeIconsColor?.collapse_size ?? 16;
  collapse_size_2 = themeIconsColor?.frozen_size_2 ?? 22;
  expand_color = themeIconsColor?.expand_color ?? '#141414';
  expand_color_opacity = themeIconsColor?.expand_color_opacity ?? '0.65';
  expand_size = themeIconsColor?.expand_size ?? 16;
  expand_size_2 = themeIconsColor?.expand_size_2 ?? 22;
  dragReorder_color = themeIconsColor?.dragReorder_color ?? '#666666';
  dragReorder_color_opacity = themeIconsColor?.dragReorder_color_opacity ?? '1';
  dragReorder_size = themeIconsColor?.dragReorder_size ?? 20;
}
const builtins = {
  get sort_downward(): SvgIcon {
    return {
      type: 'svg',
      svg:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        ` <path d="M4.6665 9H11.3332L7.99984 13.1667L4.6665 9Z" fill="${sort_color_2}"  fill-opacity="${sort_color_opacity_2}"/>` +
        `<path d="M11.3335 7L4.66683 7L8.00016 2.83333L11.3335 7Z" fill="${sort_color}" fill-opacity="${sort_color_opacity}"/>` +
        '</svg> ',
      width: sort_size, //其实指定的是svg图片绘制多大，实际下面的阴影是box，margin也是相对阴影范围指定的
      height: sort_size,
      funcType: IconFuncTypeEnum.sort,
      name: 'sort_downward',
      // positionType: IconPosition.inlineEnd,
      positionType: IconPosition.contentRight,
      marginLeft: 3, //设计要求的是距离8px，这个些5是基于外面的box而言的
      hover: {
        width: sort_size_2,
        height: sort_size_2,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      },
      cursor: 'pointer'
    };
  },
  get sort_upward(): SvgIcon {
    return {
      type: 'svg',
      svg:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        `<path d="M4.6665 9H11.3332L7.99984 13.1667L4.6665 9Z" fill="${sort_color}"  fill-opacity="${sort_color_opacity}"/>` +
        `<path d="M11.3335 7L4.66683 7L8.00016 2.83333L11.3335 7Z" fill="${sort_color_2}"  fill-opacity="${sort_color_opacity_2}"/>` +
        ' </svg>',
      width: sort_size,
      height: sort_size,
      funcType: IconFuncTypeEnum.sort,
      // positionType: IconPosition.inlineEnd,
      positionType: IconPosition.contentRight,
      name: 'sort_upward',
      marginLeft: 3,
      hover: {
        width: sort_size_2,
        height: sort_size_2,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      },
      cursor: 'pointer'
    };
  },
  get sort_normal(): SvgIcon {
    return {
      type: 'svg',
      svg:
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        `<path d="M4.6665 9H11.3332L7.99984 13.1667L4.6665 9Z" fill="${sort_color}" fill-opacity="${sort_color_opacity}"/>` +
        `<path d="M11.3335 7L4.66683 7L8.00016 2.83333L11.3335 7Z" fill="${sort_color}" fill-opacity="${sort_color_opacity}"/>` +
        '</svg> ',
      width: sort_size,
      height: sort_size,
      funcType: IconFuncTypeEnum.sort,
      // positionType: IconPosition.inlineEnd,
      positionType: IconPosition.contentRight,
      name: 'sort_normal',
      marginLeft: 3,
      hover: {
        width: sort_size_2,
        height: sort_size_2,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      },
      cursor: 'pointer'
    };
  },

  get freeze(): SvgIcon {
    return {
      type: 'svg',
      svg:
        '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<g clip-path="url(#clip0)">' +
        `<path d="M17.1313 8.42047C17.1932 8.48238 17.2423 8.55587 17.2759 8.63676C17.3094 8.71764 17.3266 8.80434 17.3266 8.89189C17.3266 8.97944 17.3094 9.06613 17.2759 9.14702C17.2423 9.2279 17.1932 9.3014 17.1313 9.3633L13.3843 13.1103C13.7007 14.3048 13.5305 15.4443 12.8388 16.2395C12.8104 16.2781 12.7778 16.3136 12.7417 16.3451L12.712 16.3755C12.6501 16.4374 12.5766 16.4865 12.4957 16.52C12.4148 16.5535 12.3281 16.5707 12.2406 16.5707C12.153 16.5707 12.0663 16.5535 11.9854 16.52C11.9046 16.4865 11.8311 16.4374 11.7692 16.3755L9.17633 13.7826L6.05316 16.9058L5.11983 17.0925C5.09291 17.0979 5.06508 17.0965 5.03881 17.0886C5.01254 17.0806 4.98863 17.0663 4.96923 17.0469C4.94982 17.0275 4.9355 17.0036 4.92755 16.9773C4.9196 16.951 4.91827 16.9232 4.92366 16.8963L5.11033 15.963L8.23333 12.8396L5.64066 10.2471C5.57875 10.1852 5.52964 10.1117 5.49614 10.0309C5.46263 9.94997 5.44539 9.86327 5.44539 9.77572C5.44539 9.68817 5.46263 9.60148 5.49614 9.52059C5.52964 9.43971 5.57875 9.36621 5.64066 9.3043C5.65066 9.2943 5.66066 9.2843 5.67099 9.27464C5.70266 9.2383 5.73833 9.20547 5.77766 9.17664C6.57283 8.48564 7.71199 8.31564 8.90599 8.63197L12.6528 4.88497C12.7147 4.82306 12.7882 4.77395 12.8691 4.74045C12.95 4.70694 13.0367 4.6897 13.1242 4.6897C13.2118 4.6897 13.2985 4.70694 13.3794 4.74045C13.4603 4.77395 13.5338 4.82306 13.5957 4.88497L17.1312 8.42047H17.1313ZM15.7172 8.8918L13.1243 6.29914L9.56483 9.8588C9.47574 9.94788 9.36323 10.0099 9.24034 10.0376C9.11746 10.0654 8.98922 10.0578 8.87049 10.0156C8.22783 9.78764 7.63899 9.7553 7.17749 9.89814L12.1182 14.8388C12.261 14.3771 12.2287 13.7885 12.0007 13.146C11.9585 13.0272 11.9509 12.899 11.9787 12.7761C12.0064 12.6532 12.0684 12.5407 12.1575 12.4516L15.7172 8.89164V8.8918Z" fill="${frozen_color}" fill-opacity="${freeze_color_opacity}"/>` +
        '</g>' +
        '<defs>' +
        '<clipPath id="clip0">' +
        '<rect width="22" height="22" fill="white"/>' +
        '</clipPath>' +
        '</defs>' +
        '</svg>',
      width: frozen_size,
      height: frozen_size,
      name: 'freeze',
      funcType: IconFuncTypeEnum.frozen,
      positionType: IconPosition.right,
      marginRight: 0,
      hover: {
        width: frozen_size_2,
        height: frozen_size_2,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      },
      cursor: 'pointer'
    };
  },
  get frozen(): SvgIcon {
    return {
      type: 'svg',
      svg:
        '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        `<path d="M8.49975 3.66663C8.32294 3.66663 8.15337 3.73686 8.02835 3.86189C7.90332 3.98691 7.83309 4.15648 7.83309 4.33329V9.63246C6.76475 10.2533 6.07942 11.1795 6.00625 12.2308C5.99892 12.2786 5.99692 12.3268 6.00009 12.3741L5.99975 12.4166C5.99975 12.5934 6.06999 12.763 6.19501 12.888C6.32004 13.0131 6.48961 13.0833 6.66642 13.0833H10.3333L10.3331 17.5L10.8611 18.292C10.8763 18.3148 10.8969 18.3335 10.9211 18.3464C10.9453 18.3594 10.9723 18.3662 10.9998 18.3662C11.0272 18.3662 11.0542 18.3594 11.0784 18.3464C11.1026 18.3335 11.1232 18.3148 11.1384 18.292L11.6664 17.5L11.6666 13.0833H15.3331C15.5099 13.0833 15.6795 13.0131 15.8045 12.888C15.9295 12.763 15.9998 12.5934 15.9998 12.4166C15.9998 12.4025 15.9998 12.3883 15.9994 12.3741C16.0028 12.3263 16.0008 12.2776 15.9933 12.2295C15.9196 11.1786 15.2343 10.2528 14.1664 9.63229V4.33329C14.1664 4.15648 14.0962 3.98691 13.9712 3.86189C13.8461 3.73686 13.6766 3.66663 13.4998 3.66663H8.49975Z" fill="${frozen_color}" fill-opacity="${frozen_color_opacity}"/>` +
        '</svg>',
      width: frozen_size,
      height: frozen_size,
      name: 'frozen',
      funcType: IconFuncTypeEnum.frozen,
      positionType: IconPosition.right,
      marginRight: 0,
      hover: {
        width: frozen_size_2,
        height: frozen_size_2,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      },
      cursor: 'pointer'
    };
  },
  get frozenCurrent(): SvgIcon {
    return {
      type: 'svg',
      svg:
        '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        `<path d="M8.49975 3.66663C8.32294 3.66663 8.15337 3.73686 8.02835 3.86189C7.90332 3.98691 7.83309 4.15648 7.83309 4.33329V9.63246C6.76475 10.2533 6.07942 11.1795 6.00625 12.2308C5.99892 12.2786 5.99692 12.3268 6.00009 12.3741L5.99975 12.4166C5.99975 12.5934 6.06999 12.763 6.19501 12.888C6.32004 13.0131 6.48961 13.0833 6.66642 13.0833H10.3333L10.3331 17.5L10.8611 18.292C10.8763 18.3148 10.8969 18.3335 10.9211 18.3464C10.9453 18.3594 10.9723 18.3662 10.9998 18.3662C11.0272 18.3662 11.0542 18.3594 11.0784 18.3464C11.1026 18.3335 11.1232 18.3148 11.1384 18.292L11.6664 17.5L11.6666 13.0833H15.3331C15.5099 13.0833 15.6795 13.0131 15.8045 12.888C15.9295 12.763 15.9998 12.5934 15.9998 12.4166C15.9998 12.4025 15.9998 12.3883 15.9994 12.3741C16.0028 12.3263 16.0008 12.2776 15.9933 12.2295C15.9196 11.1786 15.2343 10.2528 14.1664 9.63229V4.33329C14.1664 4.15648 14.0962 3.98691 13.9712 3.86189C13.8461 3.73686 13.6766 3.66663 13.4998 3.66663H8.49975Z"  fill="${frozen_color_2}" fill-opacity="${frozen_color_opacity_2}"/>` +
        '</svg>',
      width: frozen_size,
      height: frozen_size,
      funcType: IconFuncTypeEnum.frozen,
      positionType: IconPosition.right,
      name: 'frozenCurrent',
      marginRight: 0,
      // marginLeft: 6,
      hover: {
        width: frozen_size_2,
        height: frozen_size_2,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      },
      cursor: 'pointer'
    };
  },

  // get dropdownIcon_hover(): SvgIcon {
  //   return {
  //     type: 'svg',
  //     svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><rect x="2" y="1" width="20" height="20" rx="10" fill="#1E54C9"/><rect x="2.5" y="1.5" width="19" height="19" rx="9.5" stroke="#141414" stroke-opacity="0.2"/></g><path d="M14.9492 9.39531C15.0086 9.31911 15.0165 9.21887 14.9698 9.1356C14.923 9.05234 14.8294 9 14.7273 9L9.27273 9C9.17057 9 9.07697 9.05234 9.03023 9.1356C8.98348 9.21887 8.99142 9.31911 9.0508 9.39531L11.7781 12.8953C11.8293 12.961 11.9119 13 12 13C12.0881 13 12.1707 12.961 12.2219 12.8953L14.9492 9.39531Z" fill="white"/></svg>',
  //     width: 24, //其实指定的是svg图片绘制多大，实际下面的阴影是box，margin也是相对阴影范围指定的
  //     height: 24,
  //     funcType: IconFuncTypeEnum.dropDown,
  //     positionType: IconPosition.absoluteRight,
  //     name: 'dropdownIcon_hover',
  //     marginRight: 0, //设计要求的是距离8px，这个些5是基于外面的box而言的
  //     hover: {
  //       width: 24,
  //       height: 24,
  //       bgColor: 'rgba(101, 117, 168, 0.1)',
  //     },
  //     cursor: 'pointer',
  //   };
  // },

  get dropdownIcon(): SvgIcon {
    return {
      type: 'svg',
      svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><rect x="2" y="1" width="20" height="20" rx="10" fill="white"/><rect x="2.5" y="1.5" width="19" height="19" rx="9.5" stroke="#959DA5"/></g><path d="M14.9492 9.39531C15.0086 9.31911 15.0165 9.21887 14.9698 9.1356C14.923 9.05234 14.8294 9 14.7273 9L9.27273 9C9.17057 9 9.07697 9.05234 9.03023 9.1356C8.98348 9.21887 8.99142 9.31911 9.0508 9.39531L11.7781 12.8953C11.8293 12.961 11.9119 13 12 13C12.0881 13 12.1707 12.961 12.2219 12.8953L14.9492 9.39531Z" fill="#4F5965"/></svg>',
      width: 24, //其实指定的是svg图片绘制多大，实际下面的阴影是box，margin也是相对阴影范围指定的
      height: 24,
      funcType: IconFuncTypeEnum.dropDown,
      positionType: IconPosition.absoluteRight,
      // positionType: IconPosition.inlineEnd,
      name: 'dropdownIcon',
      marginRight: 0, //设计要求的是距离8px，这个些5是基于外面的box而言的
      hover: {
        width: 24,
        height: 24,
        bgColor: 'rgba(101, 117, 168, 0.1)',
        image:
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><rect x="2" y="1" width="20" height="20" rx="10" fill="#1E54C9"/><rect x="2.5" y="1.5" width="19" height="19" rx="9.5" stroke="#141414" stroke-opacity="0.2"/></g><path d="M14.9492 9.39531C15.0086 9.31911 15.0165 9.21887 14.9698 9.1356C14.923 9.05234 14.8294 9 14.7273 9L9.27273 9C9.17057 9 9.07697 9.05234 9.03023 9.1356C8.98348 9.21887 8.99142 9.31911 9.0508 9.39531L11.7781 12.8953C11.8293 12.961 11.9119 13 12 13C12.0881 13 12.1707 12.961 12.2219 12.8953L14.9492 9.39531Z" fill="white"/></svg>'
      },
      cursor: 'pointer',
      visibleTime: 'mouseenter_cell'
    };
  },

  get play(): SvgIcon {
    return {
      type: 'svg',
      svg: '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01" /><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="none" stroke="#686a6e" stroke-width="4" stroke-linejoin="round" stroke-opacity="0.7" /><path d="M20 24V17.0718L26 20.5359L32 24L26 27.4641L20 30.9282V24Z" fill="none" stroke="#686a6e" stroke-width="4" stroke-linejoin="round" stroke-opacity="0.7" /></svg>',
      width: 24, //其实指定的是svg图片绘制多大，实际下面的阴影是box，margin也是相对阴影范围指定的
      height: 24,
      funcType: IconFuncTypeEnum.play,
      positionType: IconPosition.right,
      name: 'play',
      marginRight: 0, //设计要求的是距离8px，这个些5是基于外面的box而言的
      hover: {
        width: 24,
        height: 24,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      },
      cursor: 'pointer'
    };
  },

  get damage_pic(): SvgIcon {
    return {
      type: 'svg',
      svg: '<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10V38C5 39.1046 5.89543 40 7 40H14H18L15 29L22 27L21 20L29 16L27 13L30 8H7C5.89543 8 5 8.89543 5 10Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M43 38V10C43 8.89543 42.1046 8 41 8H38L34 14L37 19L28 23L29 31L22 33L24 40H41C42.1046 40 43 39.1046 43 38Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 18C15.3284 18 16 17.3284 16 16.5C16 15.6716 15.3284 15 14.5 15C13.6716 15 13 15.6716 13 16.5C13 17.3284 13.6716 18 14.5 18Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      width: 24, //其实指定的是svg图片绘制多大，实际下面的阴影是box，margin也是相对阴影范围指定的
      height: 24,
      funcType: IconFuncTypeEnum.damagePic,
      positionType: IconPosition.left,
      name: 'damage_pic',
      marginRight: 0, //设计要求的是距离8px，这个些5是基于外面的box而言的
      hover: {
        width: 24,
        height: 24,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      },
      cursor: 'pointer'
    };
  },
  get loading_pic(): SvgIcon {
    return {
      type: 'svg',
      svg: '<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="50" y="65" width="301" height="170"><path d="M350.3 65H50v169.8h300.3V65Z" fill="#fff"/></mask><g mask="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M58.3 233.2h32.8v-36.8H58.3v36.8Z" fill="#C7DEFF"/><path d="M91.1 224.5v8.8H58.3M82.4 196.2H58.3" stroke="#071F4D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M305.4 182.5s-2.7 12.6 0 17.4c2.7 4.8 8.3 6.7 12.4 4.4 4.2-2.4 5.3-8.1 2.6-12.9-2.7-4.8-15-8.9-15-8.9ZM336 204.7c4.3 2 9.7-.4 12-5.4 2.3-5-1.5-17.3-1.5-17.3s-11.8 5.1-14.1 10.1c-2.3 5-.7 10.6 3.6 12.6Z" fill="#00E4E5"/><path fill-rule="evenodd" clip-rule="evenodd" d="M326.7 174s-10 11.8-10 18.6c0 6.7 4.5 12.2 10 12.2s10-5.5 10-12.3c0-6.8-10-18.5-10-18.5Z" fill="#00E4E5"/><path d="M332.3 181.5c2.3 3.6 4.4 7.8 4.4 10.9M316.7 192.5c0-3.1 2.1-7.2 4.3-10.8" stroke="#071F4D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M343.1 227.3v-9.7h-34v9.7c0 3.7 3 6.6 6.6 6.6h20.9c3.6 0 6.5-2.9 6.5-6.6Z" fill="#071F4D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M350.4 220.8V198H302v22.8c0 5.9 4.8 10.7 10.7 10.7h26.9c5.9 0 10.7-4.8 10.8-10.7Z" fill="#C7DEFF"/><path fill-rule="evenodd" clip-rule="evenodd" d="M331.7 74.2H117.8L87.4 203h213.8l30.5-128.8Z" fill="#fff"/><path fill-rule="evenodd" clip-rule="evenodd" d="M337 74.2h-6.2l-30.6 129.2h6.2L337 74.2Z" fill="#fff"/><path fill-rule="evenodd" clip-rule="evenodd" d="M303.8 203.5h2.4l30.7-129.3h-1.8l-31.3 129.3Z" fill="#C7DEFF"/><path d="m337 74.2-30.6 129.2h-5.9" stroke="#071F4D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M229.9 202.1h-47.6l2 9.6h47.3l-1.7-9.6Z" fill="#C7DEFF"/><path fill-rule="evenodd" clip-rule="evenodd" d="M94.7 172.6 87.4 203h213.1l7.8-30.4H94.7Z" fill="#006EFF"/><path fill-rule="evenodd" clip-rule="evenodd" d="M94.7 172.6 87.4 203h213.1l7.8-30.4H94.7Z" fill="#006EFF"/><path d="M138.5 74.2h193.2l-23.4 98.6M94.5 172.7l11-46.3M104.8 155.4l-2.3 11.5h6.7M316 112.1l1.1-4.5" stroke="#071F4D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M148.3 138.1h97V119h-97v19.1Z" fill="#00E4E5"/><path d="M303.1 80.6h20.3l-4.6 19.6M228.3 234.3c3.6 0 6.3-3.2 5.7-6.8l-4.1-24.1" stroke="#071F4D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M226.2 229.5h-68.9v1.2c0 2 1.6 3.7 3.7 3.7h60.1c2.8 0 5-2.2 5.1-4.9Z" fill="#C7DEFF"/><path d="M180.699 226.8h-19.9c-2.8 0-4.6 3-3.3 5.5m0 0c.6 1.2 1.9 2 3.3 2h57.8M175.9 203.4l3.6 17.6M241.2 234.3h65.1M104.6 234.3h41.3" stroke="#071F4D"/><path d="M206.2 234.3h14.9c3.1 0 5.5-2.8 5-5.9l-4.3-24.9M160.7 226.8h46M62.2 226.1h-9.5c-1.2 0-2.2-1-2.2-2.2v-18.3c0-1.2 1-2.2 2.2-2.2h9.5" stroke="#071F4D"/><path d="M53.4 171.7H68c2.1 0 3.7 1.7 3.7 3.7v16.1M79.1 192v-21.8c0-2.5 2-4.6 4.6-4.6h2.2c2.5 0 4.5-2 4.5-4.5m0 0c0-2.5-2-4.5-4.5-4.5H56.1c-2.4 0-4.3-1.9-4.3-4.3V148M71.2 165.2h-18M64 181.7v10.1" stroke="#C7DEFF"/><path fill-rule="evenodd" clip-rule="evenodd" d="M85.7 120H124c4.3 0 7.7-3.5 7.7-7.7V65.5H94.2c-4.7 0-8.5 4.9-8.5 11V120Z" fill="#C7DEFF"/><path d="M85.7 110.7V73c0-4.1 3.4-7.5 7.5-7.5h38.5M146.2 73.8v-2.5c0-3.2-2-5.8-5.8-5.8-2.8 0-6 1.1-6 5.8v42.4c0 4.7-3.8 8.5-8.5 8.5h-15.6" stroke="#071F4D"/><path d="M119.7 122.3H87c-6.1 0-11.1-5-11.1-11.1m0 0h39M126.1 122.3c-6.1 0-11.1-5-11.1-11.1" stroke="#071F4D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M85.4 122.1h37.2c-6.5-1.8-8-10.5-8-10.5H76.2c.6 8.8 9.2 10.5 9.2 10.5Z" fill="#071F4D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M95.8 102.9h4.8V83.6h-4.8v19.3ZM106.6 102.9h4.8V77.6h-4.8v25.3ZM117.3 102.9h4.8V89.1h-4.8v13.8Z" fill="#fff"/><path d="M273.2 195.9h16.9M261.2 195.9h5" stroke="#fff"/><path d="M62.4 201.9v2.9M62.4 224.5v2.9" stroke="#071F4D"/><path d="m153.6 138.1 9.7-19.1M168.8 138.1l9.7-19.1M184.1 138.1l9.7-19.1M199.4 138.1l9.7-19.1M214.6 138.1l9.8-19.1M229.9 138.1l9.7-19.1" stroke="#fff"/><path d="M148.3 138.1h121.6V119H148.3v19.1Z" stroke="#071F4D"/></g></svg>',
      width: 400,
      height: 300,
      name: 'loading_pic',
      positionType: IconPosition.left
    };
  },
  //展开状态的按钮 向下三角
  get expand(): SvgIcon {
    return {
      type: 'svg',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4.64988 6.81235C4.38797 6.48497 4.62106 6 5.04031 6L10.9597 6C11.3789 6 11.612 6.48497 11.3501 6.81235L8.39043 10.512C8.19027 10.7622 7.80973 10.7622 7.60957 10.512L4.64988 6.81235Z" fill="${expand_color}" fill-opacity="${expand_color_opacity}"/>
      </svg>`,
      width: expand_size, //其实指定的是svg图片绘制多大，实际占位是box，margin也是相对阴影范围指定的
      height: expand_size,
      funcType: IconFuncTypeEnum.expand,
      name: 'expand',
      positionType: IconPosition.contentLeft,
      marginLeft: 0,
      marginRight: 4,
      hover: {
        width: expand_size_2,
        height: expand_size_2,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      },
      cursor: 'pointer'
    };
  },
  //折叠状态的按钮 向右三角
  get collapse(): SvgIcon {
    return {
      type: 'svg',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5.81235 11.3501C5.48497 11.612 5 11.3789 5 10.9597L5 5.04031C5 4.62106 5.48497 4.38797 5.81235 4.64988L9.51196 7.60957C9.76216 7.80973 9.76216 8.19027 9.51196 8.39044L5.81235 11.3501Z"  fill="${collapse_color}" fill-opacity="${collapse_color_opacity}"/>
      </svg>`,
      width: collapse_size, //其实指定的是svg图片绘制多大，实际占位是box，margin也是相对阴影范围指定的
      height: collapse_size,
      funcType: IconFuncTypeEnum.collapse,
      name: 'collapse',
      positionType: IconPosition.contentLeft,
      marginLeft: 0,
      marginRight: 4,
      hover: {
        width: collapse_size_2,
        height: collapse_size_2,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      },
      cursor: 'pointer'
    };
  },
  // //loading状态按钮
  // get loading(): ImageIcon {
  //   return {
  //     type: 'image',
  //     // hack fo url test
  //     src: 'https://lf9-dp-fe-cms-tos.' + 'byt' + 'eorg.com/obj/bit-cloud/VTable/media/loading-circle.gif',
  //     width: collapse_size,
  //     height: collapse_size,
  //     name: 'loading',
  //     positionType: IconPosition.contentLeft,
  //     marginLeft: 0,
  //     marginRight: 4,
  //     hover: {
  //       width: collapse_size_2,
  //       height: collapse_size_2,
  //       bgColor: 'rgba(101,117,168,0.1)'
  //     },
  //     // cursor: 'pointer',

  //     isGif: true
  //   };
  // },

  // drill按钮
  get drillDown(): SvgIcon {
    return {
      name: 'drillDown',
      type: 'svg',
      positionType: IconPosition.absolute,
      funcType: IconFuncTypeEnum.drillDown,
      svg: DrillDown,
      width: 13,
      height: 13,
      cursor: 'pointer'
    };
  },
  get drillUp(): SvgIcon {
    return {
      name: 'drillUp',
      type: 'svg',
      positionType: IconPosition.absolute,
      funcType: IconFuncTypeEnum.drillUp,
      svg: DrillUp,
      width: 13,
      height: 13,
      cursor: 'pointer'
    };
  },
  get dragReorder(): SvgIcon {
    return {
      type: 'svg',
      svg: `<svg t="1710129136961" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5166" width="200" height="200"><path d="M362.666667 192m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="${dragReorder_color}"  fill-opacity="${dragReorder_color_opacity}" p-id="5167"></path><path d="M661.333333 192m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="${dragReorder_color}"  fill-opacity="${dragReorder_color_opacity}" p-id="5168"></path><path d="M362.666667 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="${dragReorder_color}"  fill-opacity="${dragReorder_color_opacity}" p-id="5169"></path><path d="M661.333333 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="${dragReorder_color}"  fill-opacity="${dragReorder_color_opacity}" p-id="5170"></path><path d="M362.666667 832m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="${dragReorder_color}"  fill-opacity="${dragReorder_color_opacity}" p-id="5171"></path><path d="M661.333333 832m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="${dragReorder_color}"  fill-opacity="${dragReorder_color_opacity}" p-id="5172"></path></svg>`,
      width: dragReorder_size, //其实指定的是svg图片绘制多大，实际下面的阴影是box，margin也是相对阴影范围指定的
      height: dragReorder_size,
      funcType: IconFuncTypeEnum.dragReorder,
      positionType: IconPosition.left,
      name: 'dragReorder',
      marginLeft: -10,
      marginRight: 10,
      cursor: 'grab'
    };
  }
};

export function get(): { [key: string]: ColumnIconOption } {
  return extend(builtins, plugins);
}
