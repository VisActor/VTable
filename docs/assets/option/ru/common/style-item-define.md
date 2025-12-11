{{ target: common-цвет }}

```
  тип ColorPropertyDefine =
  | строка
  | ((args: StylePropertyFunctionArg) => строка)
  | ((args: StylePropertyFunctionArg) => CanvasGradient)
  | ((args: StylePropertyFunctionArg) => CanvasPattern);
```

{{ target: common-colors }}

```
тип ColorsPropertyDefine =
  | ColorPropertyDefine
  | (строка | null)[]
  | ((args: StylePropertyFunctionArg) => (строка | null)[]);
```

{{ target: common-шрифт-style }}

```
тип FontStylePropertyDefine = строка | ((args: StylePropertyFunctionArg) => строка);
```

{{ target: common-шрифт-размер }}

```
тип FontSizePropertyDefine = число | ((args: StylePropertyFunctionArg) => число)
```

{{ target: common-шрифт-family }}

```
тип FontFamilyPropertyDefine = строка | ((args: StylePropertyFunctionArg) => строка);
```

{{ target: common-шрифт-variant }}

```
тип FontVariantPropertyDefine = строка | ((args: StylePropertyFunctionArg) => строка);
```

{{ target: common-шрифт-weight }}

```
тип FontWeightPropertyDefine =
  | строка
  | число
  | ((args: StylePropertyFunctionArg) => строка | число);
```

{{ target: common-заполнение }}

```
тип PaddingPropertyDefine = число | ((args: StylePropertyFunctionArg) => число);
```

{{ target: common-paddings }}
{{ use: common-заполнение(
  prefix = ${prefix}
  ) }}

```
тип PaddingsPropertyDefine =
  | PaddingPropertyDefine
  | (число | null)[]
  | ((args: StylePropertyFunctionArg) => (число | null)[]);
```

{{ target: common-lineширина }}

```
тип LineширинаPropertyDefine = число | ((args: StylePropertyFunctionArg) => число);
```

{{ target: common-lineширинаs }}
{{ use: common-lineширина(
  prefix = ${prefix}
  ) }}

```
тип LineширинаsPropertyDefine =
  | LineширинаPropertyDefine
  | (число | null)[]
  | ((args: StylePropertyFunctionArg) => (число | null)[]);
```

{{ target: common-lineThrough }}

```
тип LineThroughPropertyDefine = логический | ((args: StylePropertyFunctionArg) => логический);
```

{{ target: common-underline }}

```
тип UnderlinePropertyDefine = логический | ((args: StylePropertyFunctionArg) => логический);
```

{{ target: common-underlineDash }}

```
тип LineDashPropertyDefine = массив<число> | ((args: StylePropertyFunctionArg) => массив<число>);
```

{{ target: common-lineDash }}

```
тип LineDashPropertyDefine =
  | массив<число>
  | ((args: StylePropertyFunctionArg) => массив<число>);
```

{{ target: common-lineDashs }}
{{ use: common-lineDash(
  prefix = ${prefix}
  ) }}

```
тип LineDashsPropertyDefine =
  | LineDashPropertyDefine
  | (массив<число> | null)[]
  | ((args: StylePropertyFunctionArg) => (массив<число> | null)[]);
```

{{ target: common-cursor }}

```
тип CursorPropertyDefine = строка | ((args: StylePropertyFunctionArg) => строка);

```

{{ target: common-marked }}

```
тип MarkedPropertyDefine = логический | MarkCellStyle | ((args: StylePropertyFunctionArg) => логический | MarkCellStyle);

тип MarkCellStyle = {
  /** 标记背景色 默认蓝色*/
  bgColor?: CanvasRenderingContext2D['fillStyle'];
  /** 标记形状 默认'sector' */
  shape?: 'rect' | 'triangle' | 'sector';
  /** 标记位置 默认'право-верх' */
  позиция?: 'лево-верх' | 'лево-низ' | 'право-верх' | 'право-низ';
  /** 标记大小 默认10 */
  размер?: число;
  /** 标记偏移量 默认0 */
  offset?: число;
};

```

{{ target: common-colorsDef }}

```
тип ColorsDef = строка | (строка | null)[];
```

{{ target: common-lineширинаsDef }}

```
тип LineширинаsDef = число | (число | null)[];
```

{{ target: common-lineDashsDef }}

```
LineDashsDef = число[] | (число[] | null)[];
```
