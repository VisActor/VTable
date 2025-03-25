{{ target: common-color }}

```
  type ColorPropertyDefine =
  | string
  | ((args: StylePropertyFunctionArg) => string)
  | ((args: StylePropertyFunctionArg) => CanvasGradient)
  | ((args: StylePropertyFunctionArg) => CanvasPattern);
```

{{ target: common-colors }}

```
type ColorsPropertyDefine =
  | ColorPropertyDefine
  | (string | null)[]
  | ((args: StylePropertyFunctionArg) => (string | null)[]);
```

{{ target: common-font-style }}

```
type FontStylePropertyDefine = string | ((args: StylePropertyFunctionArg) => string);
```

{{ target: common-font-size }}

```
type FontSizePropertyDefine = number | ((args: StylePropertyFunctionArg) => number)
```

{{ target: common-font-family }}

```
type FontFamilyPropertyDefine = string | ((args: StylePropertyFunctionArg) => string);
```

{{ target: common-font-variant }}

```
type FontVariantPropertyDefine = string | ((args: StylePropertyFunctionArg) => string);
```

{{ target: common-font-weight }}

```
type FontWeightPropertyDefine =
  | string
  | number
  | ((args: StylePropertyFunctionArg) => string | number);
```

{{ target: common-padding }}

```
type PaddingPropertyDefine = number | ((args: StylePropertyFunctionArg) => number);
```

{{ target: common-paddings }}
{{ use: common-padding(
  prefix = ${prefix}
  ) }}

```
type PaddingsPropertyDefine =
  | PaddingPropertyDefine
  | (number | null)[]
  | ((args: StylePropertyFunctionArg) => (number | null)[]);
```

{{ target: common-lineWidth }}

```
type LineWidthPropertyDefine = number | ((args: StylePropertyFunctionArg) => number);
```

{{ target: common-lineWidths }}
{{ use: common-lineWidth(
  prefix = ${prefix}
  ) }}

```
type LineWidthsPropertyDefine =
  | LineWidthPropertyDefine
  | (number | null)[]
  | ((args: StylePropertyFunctionArg) => (number | null)[]);
```

{{ target: common-lineThrough }}

```
type LineThroughPropertyDefine = boolean | ((args: StylePropertyFunctionArg) => boolean);
```

{{ target: common-underline }}

```
type UnderlinePropertyDefine = boolean | ((args: StylePropertyFunctionArg) => boolean);
```

{{ target: common-underlineDash }}

```
type LineDashPropertyDefine = Array<number> | ((args: StylePropertyFunctionArg) => Array<number>);
```

{{ target: common-lineDash }}

```
type LineDashPropertyDefine =
  | Array<number>
  | ((args: StylePropertyFunctionArg) => Array<number>);
```

{{ target: common-lineDashs }}
{{ use: common-lineDash(
  prefix = ${prefix}
  ) }}

```
type LineDashsPropertyDefine =
  | LineDashPropertyDefine
  | (Array<number> | null)[]
  | ((args: StylePropertyFunctionArg) => (Array<number> | null)[]);
```

{{ target: common-cursor }}

```
type CursorPropertyDefine = string | ((args: StylePropertyFunctionArg) => string);

```

{{ target: common-marked }}

```
type MarkedPropertyDefine = boolean | MarkCellStyle | ((args: StylePropertyFunctionArg) => boolean | MarkCellStyle);

type MarkCellStyle = {
  /** 标记背景色 默认蓝色*/
  bgColor?: CanvasRenderingContext2D['fillStyle'];
  /** 标记形状 默认'sector' */
  shape?: 'rect' | 'triangle' | 'sector';
  /** 标记位置 默认'right-top' */
  position?: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  /** 标记大小 默认10 */
  size?: number;
  /** 标记偏移量 默认0 */
  offset?: number;
};

```

{{ target: common-colorsDef }}

```
type ColorsDef = string | (string | null)[];
```

{{ target: common-lineWidthsDef }}

```
type LineWidthsDef = number | (number | null)[];
```

{{ target: common-lineDashsDef }}

```
LineDashsDef = number[] | (number[] | null)[];
```
