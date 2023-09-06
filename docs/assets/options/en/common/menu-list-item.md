{{ target: common-menu-list-item }}

MenuListItem definition is as follows:

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
    };
```