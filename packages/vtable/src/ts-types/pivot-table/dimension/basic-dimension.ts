import type { ICustomRender, ICustomRenderFuc } from '../../customElement';
import type { ICustomLayout } from '../../customLayout';
import type { FieldFormat } from '../../table-engine';
import type { ColumnIconOption } from '../../icon';
import type { MenuListItem } from '../../menu';
import type { BaseCellInfo, CellInfo, SortOption } from '../../common';
import type { IEditor } from '@visactor/vtable-editors';
import type { BaseTableAPI } from '../../base-table';

export interface IBasicDimension {
  /** 维度的唯一标识 对应数据集的字段名称 */
  dimensionKey: string; //
  /** 维度名称 角头可配置显示维度名称 */
  title: string;
  /** 维度值的format */
  headerFormat?: FieldFormat;
  /** 定义表头上的icon */
  headerIcon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => undefined | string | ColumnIconOption | (string | ColumnIconOption)[]);
  /** 维度作为行表头时起作用，表示该维度单元格的宽度 */
  width?: number | string;
  /** 维度作为行表头时起作用，表示该维度单元格的最小宽度 */
  minWidth?: number | string;
  /** 维度作为行表头时起作用，表示该维度单元格的最大宽度 */
  maxWidth?: number | string;

  // indicators?: IIndicator[]; //维度下的指标具体展示配置

  /** 显示向下钻取图标 点击后会有对应事件 */
  drillDown?: boolean;
  /** 显示向上钻取图标 点击后会有对应事件 */
  drillUp?: boolean;
  /** 单元格显示下拉按钮及下拉菜单*/
  dropDownMenu?: MenuListItem[] | ((args: { row: number; col: number; table: BaseTableAPI }) => MenuListItem[]);
  /** 角头单元格显示下拉按钮及下拉菜单*/
  cornerDropDownMenu?: MenuListItem[];
  /** sort排序规则 */
  sort?: SortOption;
  /** 显示sort排序icon。为了仅仅显示图标，无排序逻辑 */
  showSort?: boolean | ((args: { row: number; col: number; table: BaseTableAPI }) => boolean);
  /** 在角头的维度名称单元格中是否显示排序 */
  showSortInCorner?: boolean;
  /** 是否可以拖拽表头换位置 */
  dragHeader?: boolean;
  /** 表头自定义渲染内容定义 */
  headerCustomRender?: ICustomRender;
  /** 表头自定义布局元素 */
  headerCustomLayout?: ICustomLayout;

  /**
   * 描述信息 hover时提示信息
   */
  description?: string | ((args: CellInfo) => string);
  /**
   * 描述信息 hover时提示信息
   */
  cornerDescription?: string;

  /** 该维度单元格不支持hover交互行为 */
  disableHeaderHover?: boolean;
  /** 该维度单元格不支持选中 */
  disableHeaderSelect?: boolean;
  /** 设置表头编辑器 */
  headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
  /** 定义角头维度名称对应的icon */
  cornerHeaderIcon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => undefined | string | ColumnIconOption | (string | ColumnIconOption)[]);
}
