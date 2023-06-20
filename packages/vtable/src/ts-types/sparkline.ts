export type ShapeType = 'circle';

export interface SparklineSpec {
  type: 'line';
  xField?:
    | string // 只配置field字段名，程序自动分析domain
    | {
        field: string;
        /** x轴值域，x轴对应离散轴 需逐个体现在domain数组中 */
        domain?: (number | string)[];
      };
  yField?:
    | string // 只配置field字段名，程序自动分析domain
    | {
        field: string;
        /** y轴值域，y轴对应连续轴，domain数组中只设置最大最小值即可 */
        domain?: [number, number];
      };
  /** 配置点显示规则：默认为all
   * all表示显示所有点
   * none表示不显示点
   * isolatedPoint表示只显示孤立点（即前后值为空）。
   */
  pointShowRule?: 'all' | 'none' | 'isolatedPoint';
  smooth?: boolean;
  /** 线条是否平滑 */
  /** 折线配置 */
  line?: {
    /** 折线样式 */
    style: ILineMarkStyle;
  };
  /** 数据点配置 默认不显示 */
  point?: {
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
  // interpolate?: 'linear' | 'monotone';
}

interface ISymbolMarkStyle extends IMarkStyle {
  shape: ShapeType;
  size: number;
}
