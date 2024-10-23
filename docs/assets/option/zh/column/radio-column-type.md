{{ target: radio-cell-type }}

#${prefix} columns.radio(string)

指定该列或该行单元格类型为'radio'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'radio'

指定该列或该行单元格类型为'radio'，cellType 缺省的话会被默认为'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix},
    isRadio = true
) }}

##${prefix} checked(boolean|Function) = false

**radio 类型专属配置项**

radio是否处于checked状态，在这里设置即指定整列的单选框状态，record数据条目中如果有对应的状态，则优先采用数据中状态

##${prefix} disable(boolean|Function) = false

**radio 类型专属配置项**

radio是否处于禁止交互状态

##${prefix} radioCheckType('cell' | 'column') = 'column'

**radio 类型专属配置项**

单选框唯一的范围，默认值为`column`

  * `column`: 单选框在一列中唯一选中
  * `cell`: 单选框在一个单元格中唯一选中

##${prefix} radioDirectionInCell('vertical' | 'horizontal') = 'vertical'

**radio 类型专属配置项**

单选框类型单元格中有多个单选框时，单选框排布的方向，默认值为`vertical`：

  * `vertical`: 单选框垂直排布
  * `horizontal`: 单选框水平排布

