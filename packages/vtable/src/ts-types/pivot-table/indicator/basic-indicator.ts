import type { ICustomRender } from '../../customElement';
import type { ICustomLayout } from '../../customLayout';
import type { FieldFormat } from '../../table-engine';
import type { ColumnIconOption } from '../../icon';
import type { MenuListItem } from '../../menu';
import type { BaseCellInfo, CellInfo, IDimensionInfo } from '../../common';
import type { IEditor } from '@visactor/vtable-editors';
import type { BaseTableAPI } from '../../base-table';

export interface IBasicHeaderIndicator {
  // 单种指标属性配置
  indicatorKey: string; // 指标的唯一标识 用处对应到具体数据查询阶段 flat数据
  title?: string; // 指标名
  // headerType?: HeaderTypeOption | null; //指标表头类型
  // headerStyle?: HeaderStyleOption | null; //指标名称在表头部分显示类型
  headerIcon?: (string | ColumnIconOption)[] | ((args: CellInfo) => (string | ColumnIconOption)[]);

  // linkJump?: boolean;
  // linkDetect?: boolean;
  // templateLink?: string | FieldGetter;

  // chartSpec?: any | ((arg0: CustomRenderFunctionArg) => any);
  // chartModule?: string; // 如果配置了columnType未chart，chartType来指定图表组件类型 如'vchart' 需要从预先register的图表类型获取
  // sparklineSpec?: SparklineSpec | ((arg0: CustomRenderFunctionArg) => SparklineSpec);

  dropDownMenu?: MenuListItem[] | ((args: { row: number; col: number; table: BaseTableAPI }) => MenuListItem[]); // 针对单独指标上配置下拉按钮
  /** sort排序规则 */
  sort?: boolean;
  /** 显示sort排序icon。为了仅仅显示图标，无排序逻辑 */
  showSort?: boolean | ((args: { row: number; col: number; table: BaseTableAPI }) => boolean);
  disableColumnResize?: boolean; // 是否禁用调整列宽,如果是转置表格或者是透视表的指标是行方向指定 那该配置不生效
  /** 指标隐藏 默认false */
  hide?: boolean | ((args: { dimensionPaths: IDimensionInfo[]; table: BaseTableAPI }) => boolean);
  /** 指标名称表头自定义渲染内容定义 */
  headerCustomRender?: ICustomRender; // header单元格的自定义内容
  /** 指标名称表头自定义布局元素 */
  headerCustomLayout?: ICustomLayout;
  editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);

  /** 该指标表头单元格不支持hover交互行为 */
  disableHeaderHover?: boolean;
  /** 该指标表头单元格不支持选中 */
  disableHeaderSelect?: boolean;
  /** 设置表头编辑器 */
  headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
}

export interface IBasicColumnIndicator {
  width?: string | number;
  minWidth?: number | string;
  maxWidth?: number | string;
  format?: FieldFormat; // 指标值格式化
  headerFormat?: FieldFormat; // 指标名称格式化
  // cellType?: ColumnTypeOption | BaseColumn<any, any> | null; // body指标值显示类型
  // style?: ColumnStyleOption | null; // body部分指标值显示样式
  icon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => undefined | string | ColumnIconOption | (string | ColumnIconOption)[]);

  /** 指标值body单元格自定义渲染内容定义 */
  customRender?: ICustomRender; // body单元格的自定义内容
  /** 指标值body单元格自定义布局元素 */
  customLayout?: ICustomLayout;

  /** 该指标内容不支持hover交互行为 */
  disableHover?: boolean;
  /** 该指标内容不支持选中 */
  disableSelect?: boolean | ((col: number, row: number, table: BaseTableAPI) => boolean);
}
