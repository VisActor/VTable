{{ target: common-menu-list-item }}

MenuListItem definition is as follows:

String items and `text` are plain text: HTML tags and entities are not interpreted. For example, `<b>Name</b>` and `&nbsp;` are displayed literally. The same rule applies to titles and submenu items. Click events retain the original `text` and `menuKey` values.

For HTML menus, `icon.svg` and `selectedIcon.svg` accept HTTP(S) image URLs or static SVG. SVG is sanitized to retain only elements and attributes for static shapes, gradients, clipping and masks. Scripts, event attributes, HTML, styles, animations and external references are removed. Invalid or fully removed icons are omitted. Applications relying on HTML labels, inline CSS or complex SVG must adjust their configuration.

When passing a custom `HTMLElement` to `showDropDownMenu`, the caller is responsible for its content security. Do not concatenate untrusted content into `innerHTML`.

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
