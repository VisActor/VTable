import type { VNode } from 'vue';

export interface CustomComponentProps {
  style?: any;
  // className?: string | string[];
  className?: string;

  // for table
  displayMode: 'position' | 'cell';
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  // width?: number;
  // height?: number;
  row?: number;
  col?: number;
  anchor?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  dx?: number | string;
  dy?: number | string;
  // dx?: number;
  // dy?: number;
}

export default function CustomLayout(props: CustomComponentProps): VNode {
  return null;
}

CustomLayout.symbol = 'CustomLayout';
