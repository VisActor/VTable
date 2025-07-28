{{ target: common-title }}
表格标题配置。

#${prefix} visible(boolean) = true
是否显示标题。

#${prefix} text(string | number | (string | number)[])
标题内容。

#${prefix} subtext(string | number | (string | number)[])
副标题内容。

#${prefix} orient( 'left' | 'top' | 'right' | 'bottom') = 'top'
标题方位。

#${prefix} minWidth(number)
模块的最小布局宽度配置。当配置了 width 时，此配置无效。

#${prefix} maxWidth(number)
模块的最大布局宽度配置。当配置了 width 时，此配置无效。

#${prefix} minHeight(number)
模块的最小布局宽度配置。当配置了 height 时，此配置无效。

#${prefix} maxHeight(number)
模块的最大布局宽度配置。当配置了 height 时，此配置无效。

#${prefix} padding(number | number[])
标题的边距留白。

#${prefix} align('left' | 'center' | 'right') = 'left'
标题文字水平对齐方式。

#${prefix} verticalAlign('top' | 'middle' | 'bottom') = 'top'
标题文字垂直对齐方式。

#${prefix} textStyle
主标题样式。
样式可配(仅参考常用配置)：

- fill:string 可配置字体颜色；
- fontSize:number 可配置字体大小；
- character:Array 富文本配置, 具体使用可参考 VChart
- fontFamily:string 可配置字体；
- textBaseline: 'top' | 'middle' | 'bottom' | 'alphabetic';
- textAlign: 'left' | 'right' | 'center' | 'start' | 'end';
- fontWeight: string | number;
- fontStyle: string;
- lineHeight: number

#${prefix} subtextStyle
副标题样式。配置项通主标题样式
