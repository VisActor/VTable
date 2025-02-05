import type { BaseCellInfo, CellInfo, MergeCellOption, SortOption } from '../../common';
import type { ICustomRender } from '../../customElement';
import type { ICustomLayout } from '../../customLayout';
import type { FieldDef, FieldFormat, FieldKeyDef } from '../../table-engine';
import type { ColumnIconOption } from '../../icon';
import type { MenuListItem } from '../../menu';
import type { BaseTableAPI } from '../../base-table';
import type { IEditor } from '@visactor/vtable-editors';
import type { Aggregation, CustomAggregation } from '../../new-data-set';

// eslint-disable-next-line no-unused-vars
export interface IBasicHeaderDefine {
  // 表头的标题
  title?: string | (() => string); //支持图文混合
  /** 表头Icon配置 */
  headerIcon?: string | ColumnIconOption | (string | ColumnIconOption)[];
  // | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);

  // headerStyle?: HeaderStyleOption | null;
  // style?: ColumnStyleOption | null;
  // headerType?: HeaderTypeOption | headerType.BaseHeader | null;
  /** sort排序规则 */
  sort?: SortOption;
  /** 显示sort排序icon。为了仅仅显示图标，无排序逻辑 */
  showSort?: boolean;
  /** 该列不支持hover交互行为 */
  disableHover?: boolean;
  /** 该列不支持选中 */
  disableSelect?: boolean | ((col: number, row: number, table: BaseTableAPI) => boolean);
  /** 该列表头不支持hover交互行为 */
  disableHeaderHover?: boolean;
  /** 该列表头不支持选中 */
  disableHeaderSelect?: boolean;
  /** 表头hover时的描述信息 会以tooltip形式展示出来 */
  description?: string;
  /** 下拉菜单项配置 */
  dropDownMenu?: MenuListItem[];
  /** 表头自定义渲染函数 */
  headerCustomRender?: ICustomRender;
  /** 表头自定义渲染元素定义 */
  headerCustomLayout?: ICustomLayout;
  /** 是否可以拖拽表头 */
  dragHeader?: boolean;
  /**
   * 列宽计算模式，only-header只考虑表头的内容 only-body只考虑body的内容  normal能被显示出来的所有内容
   */
  columnWidthComputeMode?: 'normal' | 'only-header' | 'only-body';
  /**
   *  是否禁用调整列宽,如果是转置表格或者是透视表的指标是行方向指定 那该配置不生效
   */
  disableColumnResize?: boolean;
  headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
}

export interface IBasicColumnBodyDefine {
  field: FieldDef;
  /** @deprecated 已不维护 */
  fieldKey?: FieldKeyDef;
  // 列的唯一标识
  key?: string;
  fieldFormat?: FieldFormat;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  //是否展示为树形结构
  tree?: boolean;
  icon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((
        args: CellInfo & { table: BaseTableAPI }
      ) => undefined | string | ColumnIconOption | (string | ColumnIconOption)[]);

  // cellType?: ColumnTypeOption | BaseColumn<T, any> | null;

  // /** 如果是绘制图表库组件的图表类型 需要将注入的组件名称 写到chartType */
  // chartModule?: string;
  // /** 如果是绘制图表库组件的图表类型 统一图表配置chartSpec */
  // chartSpec?: any | ((arg0: CellInfo) => any);
  // sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);
  // style?: ColumnStyleOption | null;
  /** 是否对相同内容合并单元格 **/
  mergeCell?: MergeCellOption;
  /** 是否隐藏 */
  hide?: boolean;
  customRender?: ICustomRender;
  customLayout?: ICustomLayout;
  editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
  aggregation?: Aggregation | CustomAggregation | (Aggregation | CustomAggregation)[];
}
