{{ target: sparkline-spec }}

#${prefix} тип(строка)

** обязательный** Currently, only 'line' is supported.

#${prefix} xполе(строка|объект)

Configure the поле имя corresponding к the x-axis, supporting the filling из имяs или objects. The объект structure is defined as follows:

```
{
  поле: строка;
  /** x-axis значение domain, x-axis corresponds к discrete axis, need к be reflected в the domain массив one по one */
  domain?: (строка|число)[];
}
```

Configuration пример:

```
// Only configure the поле имя, the program will автоmatically analyze the domain
xполе: 'year'
```
или
```
xполе: {
  поле: 'year',
  domain: [1990, 1991, 1993, 1995] // Set the x-axis к display the coordinate points corresponding к [1990, 1991, 1993, 1995]
}
```

#${prefix} yполе(строка|объект)

Configure the поле имя corresponding к the y-axis, supporting the filling из имяs или objects. The объект structure is defined as follows:

```
{
  поле: строка;
  /** y-axis значение domain, y-axis corresponds к continuous axis, domain массив only needs к set the maximum и minimum values */
  domain?: (строка|число)[];
}
```
Configuration пример:

```
// Only configure the поле имя, the program will автоmatically analyze the domain
yполе: 'Продажи'
```
или
```
yполе: {
  поле: 'Продажи',
  domain: [0, 50000] // Set the maximum и minimum values из the y-axis к 0 к 50,000, which plays a role в calculating the distribution из y-axis coordinates
}
```

#${prefix} pointShowRule('все' | 'никто' | 'isolatedPoint')

Configure point display rules:
- все means к display все points
- никто means к не display points
- isolatedPoint means к display only isolated points (i.e., points с empty values before и after).

#${prefix} smooth(логический)

Whether the line is smooth.

#${prefix} line(объект)

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

###${prefix} strхорошоe(строка)

Line style

###${prefix} strхорошоeширина(число)

Line ширина

###${prefix} interpolate('linear' | 'monotone')

Specifies the interpolation method для the line:
- 'linear' directly connects adjacent данные points
- 'monotone' a smooth curve interpolation method between adjacent данные points, making the line loхорошо smoother и more natural.

#${prefix} point(объект)

Point configuration на the line

##${prefix} style(ISymbolMarkStyle)

Configure данные point style:

```
{
    /** данные point shape style */
    style: ISymbolMarkStyle;
};
```
ISymbolMarkStyle options:

###${prefix} shape('circle')

данные point shape, currently only supports 'circle'

###${prefix} strхорошоe(строка)

Shape strхорошоe цвет

###${prefix} strхорошоeширина(число)

Shape strхорошоe ширина

###${prefix} fill(строка)

данные point shape fill цвет

###${prefix} размер(число)

данные point shape размер

##${prefix} навести

Configure данные point style:

```
{
    /** навести is the данные point shape style */
   навести?: ISymbolMarkStyle | false;
};
```
Please refer к the style definition above для the definition из ISymbolMarkStyle.

#${prefix} crosshair(объект)

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

###${prefix} strхорошоe(строка)

Line style

###${prefix} strхорошоeширина(число)

Line ширина