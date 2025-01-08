{{ target: link-dimension-type }}

#${prefix} ${dimensionHeaderType}.link(string)

指定列类型为'link', headerType可缺省默认为'text'

##${prefix} headerType(string) = 'link'

指定列类型为'link', headerType可缺省默认为'text'

{{ use: base-dimension-type(
    prefix = '##'+${prefix}
) }}

##${prefix} linkJump(boolean) = true

**link类型专属配置项**  链接是否可点击跳转

##${prefix} linkDetect(boolean) = true

**link类型专属配置项**  链接是否进行正则检测，如果链接符合url规则才展示成为link。如果配置了模板链接该配置不生效。

##${prefix} templateLink(string | (record: any, col: number, row: number, table: BaseTableAPI) => string)

**link类型专属配置项**  模板链接地址，如：'https://www.google.com.hk/search?q={name}'，name是数据源属性字段名。

##${prefix} linkTarget(string)

**link 类型专属配置项** 指定加载资源的浏览上下文的名称，是window.open()的第二个参数，默认为'_blank'。

##${prefix} linkWindowFeatures(string)

**link 类型专属配置项** 窗口特性列表，是window.open()的第三个参数。