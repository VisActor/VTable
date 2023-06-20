import type { IImageStyleOption, ITextStyleOption, IStyleOption } from '../column';
import type { ShowColumnRowType } from '../table-engine';

interface IBasicCornerDefine {
  titleOnDimension?: ShowColumnRowType; //角头标题是否显示列维度名称  否则显示行维度名称
  // headerStyle?: HeaderStyleOption | null; //角头标题的样式
  // headerType?: HeaderTypeOption | null; //角头标题的类型
}

interface ITextCornerDefine extends IBasicCornerDefine {
  headerType?: 'text';
  headerStyle?: ITextStyleOption;
}

interface IImageCornerDefine extends IBasicCornerDefine {
  headerType: 'image';
  headerStyle?: IImageStyleOption;
}

interface ILinkCornerDefine extends IBasicCornerDefine {
  headerType: 'link';
  headerStyle?: ITextStyleOption;
}

export type ICornerDefine = IImageCornerDefine | ILinkCornerDefine | ITextCornerDefine;
