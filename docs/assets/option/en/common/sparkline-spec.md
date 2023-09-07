{{ target: sparkline-spec }}

#${prefix} type(string)

** Required** Currently, only 'line' is supported.

#${prefix} xField(string|Object)

Configure the field name corresponding to the x-axis, supporting the filling of names or objects. The object structure is defined as follows:

```
{
  field: string;
  /** x-axis value domain, x-axis corresponds to discrete axis, need to be reflected in the domain array one by one */
  domain?: (string|number)[];
}
```

Configuration example:

```
// Only configure the field name, the program will automatically analyze the domain
xField: 'year'
```
or
```
xField: {
  field: 'year',
  domain: [1990, 1991, 1993, 1995] // Set the x-axis to display the coordinate points corresponding to [1990, 1991, 1993, 1995]
}
```

#${prefix} yField(string|Object)

Configure the field name corresponding to the y-axis, supporting the filling of names or objects. The object structure is defined as follows:

```
{
  field: string;
  /** y-axis value domain, y-axis corresponds to continuous axis, domain array only needs to set the maximum and minimum values */
  domain?: (string|number)[];
}
```
Configuration example:

```
// Only configure the field name, the program will automatically analyze the domain
yField: 'sales'
```
or
```
yField: {
  field: 'sales',
  domain: [0, 50000] // Set the maximum and minimum values of the y-axis to 0 to 50,000, which plays a role in calculating the distribution of y-axis coordinates
}
```

#${prefix} pointShowRule('all' | 'none' | 'isolatedPoint')

Configure point display rules:
- all means to display all points
- none means to not display points
- isolatedPoint means to display only isolated points (i.e., points with empty values before and after).

#${prefix} smooth(boolean)

Whether the line is smooth.

#${prefix} line(Object)

Line-related configuration

##${prefix} style(ILineMarkStyle)

Configure line style:

```
{
    /** Line style */
    style: ILineMarkStyle;
};
```
ILineMarkStyle options:

###${prefix} stroke(string)

Line style

###${prefix} strokeWidth(number)

Line width

###${prefix} interpolate('linear' | 'monotone')

Specifies the interpolation method for the line:
- 'linear' directly connects adjacent data points
- 'monotone' a smooth curve interpolation method between adjacent data points, making the line look smoother and more natural.

#${prefix} point(Object)

Point configuration on the line

##${prefix} style(ISymbolMarkStyle)

Configure data point style:

```
{
    /** Data point shape style */
    style: ISymbolMarkStyle;
};
```
ISymbolMarkStyle options:

###${prefix} shape('circle')

Data point shape, currently only supports 'circle'

###${prefix} stroke(string)

Shape stroke color

###${prefix} strokeWidth(number)

Shape stroke width

###${prefix} fill(string)

Data point shape fill color

###${prefix} size(number)

Data point shape size

##${prefix} hover

Configure data point style:

```
{
    /** hover is the data point shape style */
   hover?: ISymbolMarkStyle | false;
};
```
Please refer to the style definition above for the definition of ISymbolMarkStyle.

#${prefix} crosshair(Object)

Crosshair configuration

##${prefix} style(ILineMarkStyle)

Configure crosshair style:

```
{
    /** Crosshair style */
    style: ILineMarkStyle;
};
```
ILineMarkStyle options:

###${prefix} stroke(string)

Line style

###${prefix} strokeWidth(number)

Line width