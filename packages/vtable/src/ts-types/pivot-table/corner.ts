import type { IEditor } from '@visactor/vtable-editors';
import type { IImageStyleOption, ITextStyleOption, IStyleOption } from '../column';
import type { ShowColumnRowType } from '../table-engine';
import type { BaseCellInfo } from '../common';
import type { BaseTableAPI } from '../base-table';
import type { ICustomLayout, ICustomRender } from '@src/ts-types';

interface IBasicCornerDefine {
  titleOnDimension?: ShowColumnRowType; //角头标题是否显示列维度名称  否则显示行维度名称
  // headerStyle?: HeaderStyleOption | null; //角头标题的样式
  // headerType?: HeaderTypeOption | null; //角头标题的类型

  customRender?: ICustomRender;
  customLayout?: ICustomLayout;

  /** 该表头单元格不支持hover交互行为 */
  disableHeaderHover?: boolean;
  /** 该表头单元格不支持选中 */
  disableHeaderSelect?: boolean;
  /** 强制显示角头。当row或者column方向上没有维度的时候 本身是不会显示角表头的 但是某些场景下仍然需显示维度名称在角头，请配置这个字段。 */
  forceShowHeader?: boolean;
}

interface ITextCornerDefine extends IBasicCornerDefine {
  headerType?: 'text';
  headerStyle?: Omit<ITextStyleOption, 'textStick'>;
  headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
}

interface IImageCornerDefine extends IBasicCornerDefine {
  headerType: 'image';
  headerStyle?: Omit<IImageStyleOption, 'textStick'>;
  headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
}

interface ILinkCornerDefine extends IBasicCornerDefine {
  headerType: 'link';
  headerStyle?: Omit<ITextStyleOption, 'textStick'>;
  headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
}

export type ICornerDefine = IImageCornerDefine | ILinkCornerDefine | ITextCornerDefine;
