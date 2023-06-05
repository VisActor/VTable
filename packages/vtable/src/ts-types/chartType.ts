export type ShapeType = 'circle';

export interface SparklineSpec {
  type: 'line';
  xField:
    | string
    | {
        field: string;
        type: 'point' | 'linear';
        domain?: any[];
        domainMin?: number;
        domainMax?: number;
      };
  yField:
    | string
    | {
        field: string;
        type: 'point' | 'linear';
        domain?: any[];
        domainMin?: number;
        domainMax?: number;
      };
  pointShowRule: 'all' | 'none' | 'isolatedPoint';
  smooth?: boolean;
  line: {
    visible: boolean;
    // interactive: boolean;
    style: ILineMarkStyle;
    state?: {
      hover?: ILineMarkStyle | false;
      selected?: ILineMarkStyle | false;
    };
  };
  symbol: {
    visible: boolean;
    // interactive: boolean;
    style: ISymbolMarkStyle;
    state?: {
      hover?: ISymbolMarkStyle | false;
      selected?: ISymbolMarkStyle | false;
    };
  };
  crosshair: {
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
