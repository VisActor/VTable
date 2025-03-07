{{ target: common-gantt-create-mark-line }}

markLineCreateOptions specific definition:

```
export interface IMarkLineCreateOptions {
  markLineCreatable?: boolean; // enable create mark line
  markLineCreationHoverToolTip?: {
    position?: 'top' | 'bottom'; // tooltip position
    tipContent?: string; // tooltip content
    style?: {
      contentStyle?: any; // tooltip content style
      panelStyle?: any; // tooltip style
    };
  };
  markLineCreationStyle?: {
    fill?: string; //   fill color
    size?: number; // create area size
    iconSize?: number; //  icon size
    svg?: string; // custom create icon
  };
}
```
