{{ target: common-gantt-create-mark-line }}

markLineCreateOptions 具体定义：

```
export interface IMarkLineCreateOptions {
  markLineCreatable?: boolean; // 是否允许创建标记线
  markLineCreationHoverToolTip?: {
    position?: 'top' | 'bottom'; // 提示框位置
    tipContent?: string; // 提示框内容
    style?: {
      contentStyle?: any; // 提示框内容样式
      panelStyle?: any; // 提示框样式
    };
  };
  markLineCreationStyle?: {
    fill?: string; // 填充色
    size?: number; // 大小
    iconSize?: number; // 图标大小
    svg?: string; // 自定义创建图标
  };
}
```
