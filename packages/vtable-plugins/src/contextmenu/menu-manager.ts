import type { ListTable } from '@visactor/vtable';
import { vglobal } from '@visactor/vtable/es/vrender';
import {
  MENU_STYLES,
  createElement,
  applyStyles,
  createIcon,
  MENU_CLASSES,
  normalizeItemClassNameConfig,
  normalizeClassName
} from './styles';
import type { MenuClasses, MenuStyles } from './styles';
import type { MenuItemOrSeparator, MenuKey } from './types';
import type { MenuItem } from './types';
import type { MenuClickEventArgs } from './types';

interface MenuContext {
  rowIndex?: number;
  colIndex?: number;
}

/**
 * 菜单管理器
 */
export class MenuManager {
  private menuContainer: HTMLElement | null = null;
  private activeSubmenus: HTMLElement[] = [];
  private clickCallback: Function | null = null;
  private table: ListTable | null = null;
  private context: MenuContext = {};
  private hideTimeout: any = null;
  private showTimeout: any = null;
  private submenuShowDelay = 100;
  private submenuHideDelay = 500;
  private menuInitializationDelay = 200; // 菜单初始化延迟时间（毫秒）
  private styles: MenuStyles;
  private classes: MenuClasses;

  constructor(styles?: MenuStyles, classes?: MenuClasses) {
    this.styles = styles ?? MENU_STYLES;
    this.classes = classes ?? MENU_CLASSES;
  }

  /**
   * 显示菜单
   */
  showMenu(menuItems: MenuItemOrSeparator[], x: number, y: number, context: MenuContext, table: ListTable): void {
    // 保存上下文
    this.context = context;
    this.table = table;

    // 清除之前的菜单
    this.release();

    // 创建菜单容器
    this.menuContainer = createElement('div');
    this.menuContainer.classList.add(...normalizeClassName(this.classes.menuContainer));
    applyStyles(this.menuContainer, this.styles.menuContainer);
    document.body.appendChild(this.menuContainer);
    this.menuContainer.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault();
    });

    // 创建菜单项
    this.createMenuItems(menuItems, this.menuContainer);

    // 调整菜单位置
    this.positionMenu(this.menuContainer, x, y);

    // 临时禁用指针事件，防止位置调整后立即触发 mouseenter
    // 这可以避免菜单位置调整到鼠标下方时意外触发二级菜单
    this.menuContainer.style.pointerEvents = 'none';

    // 延迟启用指针事件
    setTimeout(() => {
      if (this.menuContainer) {
        this.menuContainer.style.pointerEvents = 'auto';
      }
    }, this.menuInitializationDelay);

    // 添加全局点击事件，用于关闭菜单
    setTimeout(() => {
      vglobal.addEventListener('click', this.handleDocumentClick);
    }, 0);
  }

  /**
   * 设置菜单点击回调
   */
  setClickCallback(callback: Function): void {
    this.clickCallback = callback;
  }

  /**
   * 创建菜单项
   */
  private createMenuItems(items: MenuItemOrSeparator[], container: HTMLElement, parentItem?: MenuItem): void {
    items.forEach(item => {
      if (typeof item === 'string' && item === '---') {
        // 创建分隔线
        const separator = createElement('div');
        separator.classList.add(...normalizeClassName(this.classes.menuItemSeparator));
        applyStyles(separator, this.styles.menuItemSeparator);
        container.appendChild(separator);
      } else if (typeof item === 'object') {
        // 创建普通菜单项
        const menuItem = item as MenuItem;
        const customClassName = normalizeItemClassNameConfig(item.customClassName);
        const menuItemElement = createElement('div');
        menuItemElement.classList.add(...normalizeClassName(this.classes.menuItem));
        if (customClassName.item) {
          menuItemElement.classList.add(...customClassName.item);
        }
        applyStyles(menuItemElement, this.styles.menuItem);

        // 创建左侧图标容器
        const leftContainer = createElement('div');
        if (customClassName.leftContainer) {
          leftContainer.classList.add(...customClassName.leftContainer);
        }
        leftContainer.style.display = 'flex';
        leftContainer.style.alignItems = 'center';

        // 添加图标（优先使用 customIcon）
        const iconValue = menuItem.customIcon ?? menuItem.iconName;
        if (iconValue) {
          const icon = createIcon(iconValue, menuItem, this.styles.menuItemIcon);
          if (customClassName.icon) {
            icon.classList.add(...customClassName.icon);
          }
          leftContainer.appendChild(icon);
        } else if (menuItem.iconPlaceholder) {
          // 占位图标，保持对齐
          const placeholder = createElement('span');
          applyStyles(placeholder, this.styles.menuItemIcon);
          leftContainer.appendChild(placeholder);
        }

        // 添加文本
        const text = createElement('span');
        if (customClassName.text) {
          text.classList.add(...customClassName.text);
        }
        text.textContent = menuItem.text;
        applyStyles(text, this.styles.menuItemText);
        leftContainer.appendChild(text);
        if (item.inputDefaultValue) {
          // 创建输入框
          const input = createElement('input') as HTMLInputElement;
          if (customClassName.input) {
            input.classList.add(...customClassName.input);
          }
          input.type = 'number';
          input.min = '1';
          input.value = item.inputDefaultValue.toString();
          applyStyles(input, this.styles.inputField);
          leftContainer.appendChild(input);
          //监听enter 回车确认
          input.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              this.handleMenuItemClick({
                menuKey: menuItem.menuKey as MenuKey,
                menuText: menuItem.text,
                inputValue: parseInt(input.value, 10),
                ...this.context
              });
            }
          });
        }

        menuItemElement.appendChild(leftContainer);

        // 创建右侧容器
        const rightContainer = createElement('div');
        if (customClassName.rightContainer) {
          rightContainer.classList.add(...customClassName.rightContainer);
        }
        rightContainer.style.display = 'flex';
        rightContainer.style.alignItems = 'center';

        // 添加快捷键
        if (menuItem.shortcut) {
          const shortcut = createElement('span');
          if (customClassName.shortcut) {
            shortcut.classList.add(...customClassName.shortcut);
          }
          shortcut.textContent = menuItem.shortcut;
          applyStyles(shortcut, this.styles.menuItemShortcut);
          rightContainer.appendChild(shortcut);
        }

        // 添加子菜单箭头
        if (menuItem.children && menuItem.children.length > 0) {
          menuItemElement.classList.add(...normalizeClassName(this.classes.menuItemSubmenu));
          const arrow = createElement('span');
          if (customClassName.arrow) {
            arrow.classList.add(...customClassName.arrow);
          }
          arrow.textContent = '▶';
          applyStyles(arrow, this.styles.submenuArrow);
          rightContainer.appendChild(arrow);
        }

        menuItemElement.appendChild(rightContainer);

        // 禁用状态
        if (menuItem.disabled) {
          menuItemElement.classList.add(...normalizeClassName(this.classes.menuItemDisabled));
          if (customClassName.itemDisabled) {
            menuItemElement.classList.add(...customClassName.itemDisabled);
          }
          applyStyles(menuItemElement, this.styles.menuItemDisabled);
        }

        // 添加事件监听
        if (!menuItem.disabled) {
          // 点击事件
          if (!menuItem.children || menuItem.children.length === 0) {
            menuItemElement.addEventListener('click', (e: MouseEvent) => {
              //判断如果点击到input 则不触发点击事件
              if (e.target instanceof HTMLInputElement) {
                return;
              }
              this.handleMenuItemClick({
                menuKey: menuItem.menuKey as MenuKey,
                menuText: menuItem.text,
                ...this.context
              });
            });
          }

          // 鼠标悬停事件
          menuItemElement.addEventListener('mouseenter', () => {
            // 添加悬停样式
            applyStyles(menuItemElement, this.styles.menuItemHover);

            // 清除隐藏定时器
            if (this.hideTimeout !== null) {
              clearTimeout(this.hideTimeout);
              this.hideTimeout = null;
            }
            if (this.showTimeout !== null) {
              clearTimeout(this.showTimeout);
              this.showTimeout = null;
            }

            // 如果有子菜单，显示子菜单
            if (menuItem.children && menuItem.children.length > 0) {
              // 关闭其他子菜单
              this.closeAllSubmenus();

              // 显示当前子菜单
              this.showTimeout = setTimeout(() => {
                if (document.body.contains(menuItemElement)) {
                  this.showSubmenu(menuItem.children, menuItemElement, menuItem);
                }
              }, this.submenuShowDelay);
            } else if (!parentItem) {
              // 没有子菜单，关闭所有子菜单
              this.closeAllSubmenus();
            }
          });

          // 鼠标离开事件
          menuItemElement.addEventListener('mouseleave', () => {
            // 移除悬停样式
            Object.keys(this.styles.menuItemHover).forEach(key => {
              (menuItemElement.style as any)[key] = '';
            });

            // 如果有子菜单，设置延迟关闭
            if (menuItem.children && menuItem.children.length > 0) {
              this.hideTimeout = setTimeout(() => {
                this.closeAllSubmenus();
              }, this.submenuHideDelay);
            }
          });
        }

        container.appendChild(menuItemElement);
      }
    });
  }

  /**
   * 显示子菜单
   */
  private showSubmenu(items: MenuItemOrSeparator[], parentElement: HTMLElement, parentItem?: MenuItem): void {
    const parentRect = parentElement.getBoundingClientRect();

    // 创建子菜单容器
    const submenu = createElement('div');
    submenu.classList.add(
      ...normalizeClassName(this.classes.menuContainer),
      ...normalizeClassName(this.classes.submenuContainer)
    );
    applyStyles(submenu, this.styles.submenuContainer);

    // 创建子菜单项
    this.createMenuItems(items, submenu, parentItem);

    // 添加到文档
    document.body.appendChild(submenu);

    // 调整子菜单位置
    const submenuRect = submenu.getBoundingClientRect();
    let left = parentRect.right;
    let top = parentRect.top;

    // 检查是否超出视窗右侧
    if (left + submenuRect.width > window.innerWidth) {
      left = parentRect.left - submenuRect.width;
    }

    // 检查是否超出视窗底部
    if (top + submenuRect.height > window.innerHeight) {
      top = window.innerHeight - submenuRect.height;
    }

    submenu.style.left = `${left}px`;
    submenu.style.top = `${top}px`;

    // 添加鼠标进入事件，清除隐藏定时器
    submenu.addEventListener('mouseenter', () => {
      if (this.hideTimeout !== null) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
    });

    // 添加鼠标离开事件，设置延迟关闭
    submenu.addEventListener('mouseleave', () => {
      this.hideTimeout = setTimeout(() => {
        this.closeAllSubmenus();
      }, this.submenuHideDelay);
    });

    // 保存子菜单引用
    this.activeSubmenus.push(submenu);
  }

  /**
   * 关闭所有子菜单
   */
  private closeAllSubmenus(): void {
    this.activeSubmenus.forEach(submenu => {
      if (submenu && submenu.parentNode) {
        submenu.parentNode.removeChild(submenu);
      }
    });
    this.activeSubmenus = [];
  }

  /**
   * 调整菜单位置
   */
  private positionMenu(menu: HTMLElement, x: number, y: number): void {
    const menuRect = menu.getBoundingClientRect();
    let left = x;
    let top = y;

    // 检查是否超出视窗右侧
    if (left + menuRect.width > window.innerWidth) {
      left = window.innerWidth - menuRect.width;
    }

    // 检查是否超出视窗底部
    if (top + menuRect.height > window.innerHeight) {
      top = window.innerHeight - menuRect.height;
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  /**
   * 处理菜单项点击
   */
  private handleMenuItemClick(args: MenuClickEventArgs): void {
    // 关闭菜单
    this.release();
    // 调用回调
    if (this.clickCallback && this.table) {
      this.clickCallback(args, this.table);
    }
  }

  /**
   * 处理文档点击，用于关闭菜单
   */
  private handleDocumentClick = (event: MouseEvent): void => {
    // 如果点击的是菜单内部，不关闭菜单
    if (
      this.menuContainer &&
      (event.target === this.menuContainer || this.menuContainer.contains(event.target as Node))
    ) {
      return;
    }

    // 如果点击的是子菜单内部，不关闭菜单
    for (const submenu of this.activeSubmenus) {
      if (event.target === submenu || submenu.contains(event.target as Node)) {
        return;
      }
    }

    // 关闭菜单
    this.release();
  };

  /**
   * 销毁菜单
   */
  release(): void {
    // 关闭所有子菜单
    this.closeAllSubmenus();

    // 移除菜单容器
    if (this.menuContainer && this.menuContainer.parentNode) {
      this.menuContainer.parentNode.removeChild(this.menuContainer);
      this.menuContainer = null;
    }

    // 清除定时器
    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    if (this.showTimeout !== null) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    // 移除全局事件监听
    vglobal.removeEventListener('click', this.handleDocumentClick);
  }
}
