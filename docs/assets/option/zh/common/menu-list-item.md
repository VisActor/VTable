{{ target: common-menu-list-item }}

MenuListItem 定义如下：

字符串菜单项及 `text` 均为纯文本，不解析 HTML 标签或实体。例如 `<b>名称</b>` 和 `&nbsp;` 会按原文显示；标题和子菜单遵循相同规则。点击事件中的 `text` 和 `menuKey` 保持原始配置值。

HTML 菜单的 `icon.svg` 和 `selectedIcon.svg` 支持 HTTP(S) 图片地址或静态 SVG。SVG 会经过安全清洗，仅保留静态图形、渐变、裁剪及蒙版所需的元素和属性；脚本、事件属性、HTML、样式、动画和外部引用会被移除。非法或完全被清除的图标将被省略。依赖 HTML 文本、内联 CSS 或复杂 SVG 的调用方需要调整配置。

使用 `showDropDownMenu` 传入自定义 `HTMLElement` 时，该元素的内容安全由调用方负责；不要通过 `innerHTML` 拼接不可信内容。

```
type MenuListItem =
  | string
  | {
      text?: string;
      type?: 'title' | 'item' | 'split';
      menuKey?: string;
      icon?: Icon;
      selectedIcon?: Icon;
      stateIcon?: Icon;
      children?: MenuListItem[];
      disabled?: boolean;
    };
```
