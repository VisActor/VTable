import type { VNode } from 'vue';

//需要等待更新，修改interface中的any为具体的类型
export interface TagProps {
  attribute?: any;
  children?: string;
  textStyle?: any;
  panelStyle?: any;
  padding?: any;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
}

export default function Tag(props: TagProps): VNode {
  return null;
}

Tag.symbol = 'Tag';
