{{ target: common-emptyTip }}

#${prefix} text(string)
空数据描述内容。

#${prefix} textStyle(object)
描述文字样式。

- color:string 可配置字体颜色；
- fontSize:number 可配置字体大小；
- fontFamily:string 可配置字体；
- fontWeight: string | number;
- fontVariant?: string;字体粗细
- lineHeight?: number 行高
- underline?: number; 下划线
- lineThrough?: number; 中划线

#${prefix} icon(object)
空数据图标。

- width?: number;icon 的高度
- height?: number; icon 的高度
- image?: string;图片地址 或者 内联 SVG 内容

#${prefix} displayMode('basedOnTable' | 'basedOnContainer')
空数据描述内容的展示模式。

- basedOnTable: 基于表格范围展示空数据描述内容；
- basedOnContainer: 基于容器范围展示空数据描述内容；
