export type ShapeType = 'circle';

export interface SparklineSpec {
  type: 'line';
  xField?:
    | string
    | {
        field: string;
        domain?: any[];
      };
  yField?:
    | string
    | {
        field: string;
        domain?: any[];
      };
  /** all表示正常连接前后点 none表示不会只孤立点 isolatedPoint表示只绘制孤立点的点图形 默认为none */
  pointShowRule?: 'all' | 'none' | 'isolatedPoint';
  smooth?: boolean;
  /** 折线配置 */
  line?: {
    /** 折线样式 */
    style: ILineMarkStyle;
  };
  /** 数据点配置 默认不显示 */
  point?: {
    /** 折线上每个点都显示 默认false*/
    visible?: boolean;
    style: ISymbolMarkStyle;
    hover?: ISymbolMarkStyle | false;
  };
  /** crosshair交叉线配置  默认不显示*/
  crosshair?: {
    /** crosshair交叉线样式 */
    style: ILineMarkStyle;
  };

  //TODO 增加label
}
interface IMarkStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

interface ILineMarkStyle extends IMarkStyle {
  stroke?: string;
  interpolate?: 'linear' | 'monotone';
}

interface ISymbolMarkStyle extends IMarkStyle {
  shape: ShapeType;
  size: number;
}
