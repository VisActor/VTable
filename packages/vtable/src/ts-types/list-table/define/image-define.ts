import type { IImageStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnBodyDefine, IBasicHeaderDefine } from './basic-define';

export interface IImageHeaderDefine extends IBasicHeaderDefine {
  headerStyle?: IImageStyleOption | ((styleArg: StylePropertyFunctionArg) => IImageStyleOption);
  headerType: 'image' | 'video';

  /** 是否保持横纵比 默认false */
  keepAspectRatio?: boolean;
  /** 是否按图片尺寸自动撑开单元格尺寸 默认false */
  imageAutoSizing?: boolean;

  /** 点击开启预览 */
  clickToPreview?: boolean;
}

export interface IImageColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: IImageStyleOption | ((styleArg: StylePropertyFunctionArg) => IImageStyleOption);
  cellType: 'image' | 'video';

  /** 是否保持横纵比 默认false */
  keepAspectRatio?: boolean;
  /** 是否按图片尺寸自动撑开单元格尺寸 默认false */
  imageAutoSizing?: boolean;

  /** 点击开启预览 */
  clickToPreview?: boolean;
}
