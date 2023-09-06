{{ target: sparkline-spec }}

#${prefix} type(string)

** 必填**  目前仅支持 'line'

#${prefix} xField(string|Object)

配置x轴对应字段名称，支持填写名称或者对象。对象结构定义如下：

```
{
  field: string;
  /** x轴值域，x轴对应离散轴 需逐个体现在domain数组中 */
  domain?: (string|number)[];
}
```

配置示例：

```
// 只配置field字段名，程序自动分析domain
xField: 'year'
```
or
```
xField: {
  field: 'year',
  domain: [1990, 1991,1993,1995] // 置顶x轴显示[1990, 1991,1993,1995]对应坐标点
}
```

#${prefix} yField(string|Object)

配置y轴对应字段名称，支持填写名称或者对象。对象结构定义如下：

```
{
  field: string;
  /** y轴值域，y轴对应连续轴，domain数组中只设置最大最小值即可 */
  domain?: (string|number)[];
}
```
配置示例：

```
//只配置field字段名，程序自动分析domain
yField: 'sales'
```
or
```
yField: {
  field: 'sales',
  domain: [0, 50000] // 置顶y轴最大最小值为0到50000，这个在计算y轴坐标分布时起作用
}
```

#${prefix} pointShowRule('all' | 'none' | 'isolatedPoint')

配置点显示规则：
- all表示显示所有点 
- none表示不显示点
- isolatedPoint表示只显示孤立点（即前后值为空）。


#${prefix} smooth(boolean)

线条是否平滑。

#${prefix} line(Object)

折线相关配置

##${prefix} style(ILineMarkStyle)

配置折线样式：

```
{
    /** 折线样式 */
    style: ILineMarkStyle;
};
```
ILineMarkStyle的配置项有：

###${prefix} stroke(string)

线条样式

###${prefix} strokeWidth(number)

线条宽度

###${prefix} interpolate('linear' | 'monotone')

用于指定折线的插值方式：
- 'linear'直接连接相邻数据点
- 'monotone'相邻数据点之间使用一种平滑的曲线插值方法，使得折线看起来更加平滑自然。

#${prefix} point(Object)

point折线上数据点配置 

##${prefix} style(ISymbolMarkStyle)

配置数据点样式：

```
{
    /** 数据点图形样式 */
    style: ISymbolMarkStyle;
};
```
ISymbolMarkStyle的配置项有：

###${prefix} shape('circle')

数据点图形，目前只支持'circle'

###${prefix} stroke(string)

图形描边颜色

###${prefix} strokeWidth(number)

图形描边宽度

###${prefix} fill(string)

数据点图形填充颜色

###${prefix} size(number)

数据点图形大小

##${prefix} hover

配置数据点样式：

```
{
    /** hover是数据点图形样式 */
   hover?: ISymbolMarkStyle | false;
};
```
ISymbolMarkStyle的定义请参考上述style中定义。

#${prefix} crosshair(Object)

crosshair交叉线配置 

##${prefix} style(ILineMarkStyle)

配置交叉线样式：

```
{
    /** 交叉线样式 */
    style: ILineMarkStyle;
};
```
ILineMarkStyle的配置项有：

###${prefix} stroke(string)

线条样式

###${prefix} strokeWidth(number)

线条宽度
