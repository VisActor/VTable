import type { VNode } from 'vue';

//需要等待更新，修改interface中的any为具体的类型
export interface RadioProps {
  children?: string;
  textStyle?: any;
  circleStyle?: any;
  checked?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  disableCursor?: any;
  spaceBetweenTextAndIcon?: number;
  visible?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Radio(props: RadioProps): any {
  return null;
}

Radio.symbol = 'Radio';
