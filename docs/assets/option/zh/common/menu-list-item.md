{{ target: common-menu-list-item }}

MenuListItem 定义如下：

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
