{{ target: common-theme }}

表格主题，其中内置主题名称有DEFAULT, ARCO, BRIGHT, DARK, SIMPLIFY，具体配置方式可用内置类型或者直接使用字符串名称配置：
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

同时可以基于内置主题进行扩展，例如想基于ARCO主题改变字体:

```
VTable.themes.ARCO.extend({
  fontSize: '14px',
  fontFamily: 'PingFangSC'
})
```

或者直接自定义一套专属主题：

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
表格绘制范围外的canvas上填充的颜色

#${prefix} bodyStyle(Object)

body单元格的样式配置

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} headerStyle(Object)

列表头单元格的样式配置

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} rowHeaderStyle(Object)

行表头单元格的样式配置

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} cornerHeaderStyle(Object)

角表头单元格的样式配置

{{ use: common-theme-style(
  prefix = '#' + ${prefix},
) }}

#${prefix} defaultStyle(Object)

公共样式，如果headerStyle，rowHeaderStyle, defaultStyle都没有配置的项，则使用这个里面的配置项

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

#${prefix} selectionStyle(Object)

选择框样式

##${prefix} cellBgColor(string)
选择框底色，需要设置透明度

##${prefix} cellBorderColor(string)
选择框边框颜色

##${prefix} cellBorderLineWidth(number)
选择框边框粗细

#${prefix} 示例：[TODO](xxxx)