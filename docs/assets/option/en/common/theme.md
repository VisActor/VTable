{{ target: common-theme }}

Table theme, which has built-in theme names DEFAULT, ARCO, BRIGHT, DARK, SIMPLIFY. The configuration can be made using built-in types or directly with string names:

- `VTable.themes.DEFAULT`
- `VTable.themes.ARCO;`
- `VTable.themes.BRIGHT`
- `VTable.themes.DARK`
- `VTable.themes.SIMPLIFY`

or

- `'default'`
- `'arco'`
- `'bright'`
- `'dark'`
- `'simplify'`

You can also extend built-in themes, for example, change the font based on the ARCO theme:

```
VTable.themes.ARCO.extend({
  fontSize: '14px',
  fontFamily: 'PingFangSC'
})
```

Or you can directly define a custom theme:

```
{
  defaultStyle:{
    borderLineWidth:0,
  },
  headerStyle:{
    frameStyle:{
      borderColor:'blue',
      borderLineWidth:[0,0,1,0]
    }
  },
  rowHeaderStyle:{
    frameStyle:{
      borderColor:'blue',
      borderLineWidth:[0,1,0,0]
    }
  },
  cornerHeaderStyle:{
    frameStyle:{
      borderColor:'blue',
      borderLineWidth:[0,1,1,0]
    }
  }
}
```

#${prefix} underlayBackgroundColor(string)
The color filled in the canvas outside the table drawing area

#${prefix} cellInnerBorder(boolean)
Whether the cell draws an inner border. If false, the border of the border cell close to the border will be hidden.

#${prefix} bodyStyle(Object)

Body cell style configuration

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} headerStyle(Object)

List header cell style configuration

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} rowHeaderStyle(Object)

Row header cell style configuration

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} cornerHeaderStyle(Object)

Corner header cell style configuration

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} cornerLeftBottomCellStyle(Object)

Corner left bottom cell style configuration

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} cornerRightBottomCellStyle(Object)

Corner right bottom cell style configuration

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} bottomFrozenStyle(Object)

Bottom frozen area style configuration

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} rightFrozenStyle(Object)

Right frozen area style configuration

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} cornerRightTopCellStyle(Object)

Corner right top cell style configuration

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} groupTitleStyle(Object)

Group title style configuration in grouping display mode

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} defaultStyle(Object)

Common style, if the items in headerStyle, rowHeaderStyle, and defaultStyle are not configured, the items in this will be used for configuration

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

{{ use: common-table-frame-style(
  prefix = ${prefix}
  ) }}

{{ use: common-column-resize-style(
  prefix = ${prefix}
  ) }}

{{ use: common-drag-header-line-style(
  prefix = ${prefix}
  ) }}

{{ use: common-frozen-column-line-style (
  prefix = ${prefix}
  ) }}

{{ use: common-scroll-style (
  prefix = ${prefix}
  ) }}

{{ use: common-tooltip-style (
  prefix = ${prefix}
  ) }}

{{ use: common-checkbox-style (
  prefix = ${prefix}
  ) }}

{{ use: common-radio-style (
  prefix = ${prefix}
  ) }}

{{ use: common-switch-style (
  prefix = ${prefix}
  ) }}

{{ use: common-button-style (
  prefix = ${prefix}
  ) }}

#${prefix} selectionStyle(Object)

Selection box style

##${prefix} cellBgColor(string)
Selection box background color, requires transparency setting

##${prefix} cellBorderColor(string)
Selection box border color

##${prefix} cellBorderLineWidth(number)
Selection box border thickness

##${prefix} inlineRowBgColor(ColorPropertyDefine)
The highlight color of the entire row when selected
{{ use: common-color(
prefix = ${prefix}
) }}

##${prefix} inlineColumnBgColor(ColorPropertyDefine)
The highlight color of the entire column when selected
{{ use: common-color(
prefix = ${prefix}
) }}

##${prefix} selectionFillMode(boolean)
Fill color rules for the selected area

- `overlay`: The fill color of the selected area will cover the background color of the cell (usually a color value with transparency)
- `replace`: The fill color of the selected area will replace the background color of the cell
  {{ use: common-color(
    prefix = ${prefix}
    ) }}

##${prefix} functionalIconsStyle(Object)
VTable internal functional button icon color and size configuration. If the icon is not clear, it can be adjusted according to the actual situation. If the size is not suitable, it can be adjusted appropriately.

```
  functionalIconsStyle?: {
    sort_color?: string;
    sort_color_opacity?: string;
    sort_color_2?: string;
    sort_color_opacity_2?: string;
    sort_size?: number;
    sort_size_2?: number;
    frozen_color?: string;
    frozen_color_opacity?: string;
    frozen_color_2?: string;
    frozen_color_opacity_2?: string;
    frozen_size?: number;
    frozen_size_2?: number;
    collapse_color?: string;
    collapse_color_opacity?: string;
    collapse_size?: number;
    collapse_size_2?: number;
    expand_color?: string;
    expand_color_opacity?: string;
    expand_size?: number;
    expand_size_2?: number;
    dragReorder_color?: string;
    dragReorder_color_opacity?: string;
    dragReorder_size?: number;
  };
```
