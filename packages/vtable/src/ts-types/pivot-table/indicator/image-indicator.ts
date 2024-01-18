import type { IImageStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnIndicator, IBasicHeaderIndicator } from './basic-indicator';

export interface IImageHeaderIndicator extends IBasicHeaderIndicator {
  headerType: 'image' | 'video'; // 指标表头类型
  headerStyle?:
    | IImageStyleOption //表头可以配置吸附;
    | ((styleArg: StylePropertyFunctionArg) => IImageStyleOption); // 指标名称在表头部分显示类型

  /** 是否保持横纵比 默认false */
  keepAspectRatio?: boolean;
  /** 是否按图片尺寸自动撑开单元格尺寸 默认false */
  imageAutoSizing?: boolean;

  /** 点击开启预览 */
  clickToPreview?: boolean;
}

export interface IImageColumnIndicator extends IBasicColumnIndicator {
  cellType: 'image' | 'video'; // body指标值显示类型
  style?: IImageStyleOption | ((styleArg: StylePropertyFunctionArg) => IImageStyleOption); // body部分指标值显示样式

  /** 是否保持横纵比 默认false */
  keepAspectRatio?: boolean;
  /** 是否按图片尺寸自动撑开单元格尺寸 默认false */
  imageAutoSizing?: boolean;

  /** 点击开启预览 */
  clickToPreview?: boolean;
}
