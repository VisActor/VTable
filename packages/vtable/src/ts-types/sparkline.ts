export type ShapeType = 'circle';

export interface SparklineSpec {
  type: 'line';
  xField?:
    | string
    | {
        field: string;
        // type: 'point' | 'linear';
        domain?: any[];
        domainMin?: number;
        domainMax?: number;
      };
  yField?:
    | string
    | {
        field: string;
        // type: 'point' | 'linear';
        domain?: any[];
        domainMin?: number;
        domainMax?: number;
      };
  /** all表示正常连接前后点 none表示不会只孤立点 isolatedPoint表示只绘制孤立点的点图形 默认为none */
  pointShowRule?: 'all' | 'none' | 'isolatedPoint';
  smooth?: boolean;
  /** 折线配置 */
  line?: {
    /** 目前该配置不生效 一定显示 */
    visible: boolean;
    /** 折线样式 */
    style: ILineMarkStyle;
    /** 折线在特定状态下的样式 */
    state?: {
      hover?: ILineMarkStyle | false;
      selected?: ILineMarkStyle | false;
    };
  };
  /** 数据点配置 默认不显示 */
  symbol?: {
    /** 默认false */
    visible: boolean;
    style: ISymbolMarkStyle;
    state?: {
      hover?: ISymbolMarkStyle | false;
      selected?: ISymbolMarkStyle | false;
    };
  };
  /** crosshair交叉线配置  默认不显示*/
  crosshair?: {
    /** crosshair交叉线样式 */
    style: ILineMarkStyle;
  };
}
interface IMarkStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

interface ILineMarkStyle extends IMarkStyle {
  stroke: string;
  interpolate?: 'linear' | 'monotone';
}

interface ISymbolMarkStyle extends IMarkStyle {
  shape: ShapeType;
  size: number;
}
