import type { IImageStyleOption, ITextStyleOption } from '../column';

type IBasicTitleDefine = {
  /** 显示表头标题。默认为true，显示内容则由各级的维度名称组合而成，如'地区|省份'。 */
  title: true | string;
};

type ITextTitleDefine = IBasicTitleDefine & {
  headerType?: 'text';
  headerStyle: ITextStyleOption;
};

type IImageTitleDefine = IBasicTitleDefine & {
  headerType: 'image';
  headerStyle: IImageStyleOption;
};

type ILinkTitleDefine = IBasicTitleDefine & {
  headerType: 'link';
  headerStyle: ITextStyleOption;
};

export type ITitleDefine = ITextTitleDefine | IImageTitleDefine | ILinkTitleDefine;
