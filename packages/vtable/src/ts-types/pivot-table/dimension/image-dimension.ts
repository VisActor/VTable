import type { IImageStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicDimension } from './basic-dimension';

export interface IImageDimension extends IBasicDimension {
  headerType: 'image' | 'video';
  headerStyle?:
    | IImageStyleOption //表头可以配置吸附;
    | ((styleArg: StylePropertyFunctionArg) => IImageStyleOption); //该维度层级表头部分的样式

  // 目前autoWrapText和lineClamp还在style中定义
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;

  /** 是否保持横纵比 默认false */
  keepAspectRatio?: boolean;
  /** 是否按图片尺寸自动撑开单元格尺寸 默认false */
  imageAutoSizing?: boolean; // 是否自动撑开单元格尺寸

  /** 点击开启预览 */
  clickToPreview?: boolean;
}
