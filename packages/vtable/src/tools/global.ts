import type { SparklineSpec } from '../ts-types';

// export const DEFAULTFONT = '16px sans-serif'; //默认字体
export const DEFAULTFONTSIZE = 16; //默认字号
export const DEFAULTFONTFAMILY = 'Arial,sans-serif'; //默认字体
export const DEFAULTBGCOLOR = '#FFF'; //默认背景色
export const DEFAULTBORDERCOLOR = '#000'; //默认边框颜色
export const DEFAULTBORDERLINEWIDTH = 1; //默认边框线宽
export const DEFAULTBORDERLINEDASH: [] = []; //默认边框dash
export const DEFAULTFONTCOLOR = '#000'; //默认字体颜色
/**
 * 校验是否为超链接
 */
export const regUrl = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
/**
 * 调整列宽热区宽度
 */
export const ResizeColumnHotSpotSize = 16;
export const ResizeRowHotSpotSize = 16;

/** 指标维度 在行列维度分析中占位标识 */
export const IndicatorDimensionKeyPlaceholder = '$$indicator$$';

// svg path
export const DrillDown = `<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><rect x="0" y="0" width="1024" height="1024" rx="20%" ry="20%" fill="#ffffff" /><path  d="M810.666667 85.333333c70.688 0 128 57.312 128 128v597.333334c0 70.688-57.312 128-128 128H213.333333c-70.688 0-128-57.312-128-128V213.333333c0-70.688 57.312-128 128-128h597.333334z m0 85.333334H213.333333a42.666667 42.666667 0 0 0-42.613333 40.533333L170.666667 213.333333v597.333334a42.666667 42.666667 0 0 0 40.533333 42.613333L213.333333 853.333333h597.333334a42.666667 42.666667 0 0 0 42.613333-40.533333L853.333333 810.666667V213.333333a42.666667 42.666667 0 0 0-40.533333-42.613333L810.666667 170.666667zM549.333333 288a5.333333 5.333333 0 0 1 5.333334 5.333333V469.333333h176a5.333333 5.333333 0 0 1 5.333333 5.333334v74.666666a5.333333 5.333333 0 0 1-5.333333 5.333334H554.666667v176a5.333333 5.333333 0 0 1-5.333334 5.333333h-74.666666a5.333333 5.333333 0 0 1-5.333334-5.333333V554.666667H293.333333a5.333333 5.333333 0 0 1-5.333333-5.333334v-74.666666a5.333333 5.333333 0 0 1 5.333333-5.333334H469.333333V293.333333a5.333333 5.333333 0 0 1 5.333334-5.333333h74.666666z"></path></svg>`;
export const DrillUp = `<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><rect x="0" y="0" width="1024" height="1024" rx="20%" ry="20%" fill="#ffffff" /><path d="M810.666667 85.333333c70.688 0 128 57.312 128 128v597.333334c0 70.688-57.312 128-128 128H213.333333c-70.688 0-128-57.312-128-128V213.333333c0-70.688 57.312-128 128-128h597.333334z m0 85.333334H213.333333a42.666667 42.666667 0 0 0-42.613333 40.533333L170.666667 213.333333v597.333334a42.666667 42.666667 0 0 0 40.533333 42.613333L213.333333 853.333333h597.333334a42.666667 42.666667 0 0 0 42.613333-40.533333L853.333333 810.666667V213.333333a42.666667 42.666667 0 0 0-40.533333-42.613333L810.666667 170.666667zM693.333333 469.333333a42.666667 42.666667 0 1 1 0 85.333334H330.666667a42.666667 42.666667 0 1 1 0-85.333334h362.666666z"></path></svg>`;

export const DefaultSparklineSpec: SparklineSpec = {
  type: 'line'
};
