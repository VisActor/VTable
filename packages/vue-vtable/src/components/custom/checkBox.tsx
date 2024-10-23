import type { VNode } from 'vue';

////需要等待更新，修改interface中的any为具体的类型
export interface CheckboxProps {
  children?: string;
  textStyle?: any;
  boxStyle?: any;
  iconStyle?: any;
  checked?: boolean;
  indeterminate?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  disableCursor?: any;
  spaceBetweenTextAndIcon?: number;
  visible?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function CheckBox(props: CheckboxProps): VNode {
  return null;
}

CheckBox.symbol = 'CheckBox';
