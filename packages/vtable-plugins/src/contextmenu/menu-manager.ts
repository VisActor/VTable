import type { ListTable } from '@visactor/vtable';
import {
  MENU_CONTAINER_CLASS,
  MENU_ITEM_CLASS,
  MENU_ITEM_SEPARATOR_CLASS,
  MENU_ITEM_SUBMENU_CLASS,
  MENU_STYLES,
  createElement,
  applyStyles,
  createIcon,
  createNumberInputItem,
  MENU_ITEM_DISABLED_CLASS
} from './styles';

export interface MenuClickEventArgs {
  menuKey: string;
  menuText: string;
  rowIndex?: number;
  colIndex?: number;
  cellValue?: any;
  inputValue?: number | string;
}

export interface MenuItem {
  text: string;
  menuKey: string;
  disabled?: boolean;
  shortcut?: string;
  iconName?: string;
  children?: (MenuItem | MenuItemInput | string)[];
}

export interface MenuItemInput {
  type: 'input';
  label: string;
  menuKey: string;
  defaultValue?: number;
}

export type MenuItemOrSeparator = MenuItem | MenuItemInput | string;

export type MenuClickCallback = (args: MenuClickEventArgs, table: ListTable) => void;

interface MenuContext {
  rowIndex?: number;
  colIndex?: number;
  cellType?: string;
  cellValue?: any;
}

/**
 * 菜单管理器
 */
export class MenuManager {
  private menuContainer: HTMLElement | null = null;
  private activeSubmenus: HTMLElement[] = [];
  private clickCallback: MenuClickCallback | null = null;
  private table: ListTable | null = null;
  private context: MenuContext = {};
  private hideTimeout: number | null = null;
  private submenuShowDelay = 300;
  private submenuHideDelay = 800;

  /**
   * 显示菜单
   */
  showMenu(menuItems: MenuItemOrSeparator[], x: number, y: number, context: MenuContext, table: ListTable): void {
    // 保存上下文
    this.context = context;
    this.table = table;

    // 清除之前的菜单
    this.destroy();

    // 创建菜单容器
    this.menuContainer = createElement('div', MENU_CONTAINER_CLASS);
    applyStyles(this.menuContainer, MENU_STYLES.menuContainer);
    document.body.appendChild(this.menuContainer);

    // 创建菜单项
    this.createMenuItems(menuItems, this.menuContainer);

    // 调整菜单位置
    this.positionMenu(this.menuContainer, x, y);

    // 添加全局点击事件，用于关闭菜单
    setTimeout(() => {
      document.addEventListener('click', this.handleDocumentClick);
      document.addEventListener('contextmenu', this.handleDocumentClick);
    }, 0);
  }

  /**
   * 设置菜单点击回调
   */
  setClickCallback(callback: MenuClickCallback): void {
    this.clickCallback = callback;
  }

  /**
   * 创建菜单项
   */
  private createMenuItems(items: MenuItemOrSeparator[], container: HTMLElement): void {
    items.forEach(item => {
      if (typeof item === 'string' && item === '---') {
        // 创建分隔线
        const separator = createElement('div', MENU_ITEM_SEPARATOR_CLASS);
        applyStyles(separator, MENU_STYLES.menuItemSeparator);
        container.appendChild(separator);
      } else if (typeof item === 'object' && 'type' in item && item.type === 'input') {
        // 创建输入框菜单项
        const inputItem = item as MenuItemInput;
        const wrapper = createNumberInputItem(inputItem.label, inputItem.defaultValue || 1, (value: number) => {
          this.handleMenuItemClick({
            menuKey: inputItem.menuKey,
            menuText: inputItem.label,
            inputValue: value,
            ...this.context
          });
        });
        container.appendChild(wrapper);
      } else if (typeof item === 'object') {
        // 创建普通菜单项
        const menuItem = item as MenuItem;
        const menuItemElement = createElement('div', MENU_ITEM_CLASS);
        applyStyles(menuItemElement, MENU_STYLES.menuItem);

        // 创建左侧图标容器
        const leftContainer = createElement('div');
        leftContainer.style.display = 'flex';
        leftContainer.style.alignItems = 'center';

        // 添加图标
        if (menuItem.iconName) {
          const icon = createIcon(menuItem.iconName);
          leftContainer.appendChild(icon);
        } else {
          // 占位图标，保持对齐
          const placeholder = createElement('span');
          applyStyles(placeholder, MENU_STYLES.menuItemIcon);
          leftContainer.appendChild(placeholder);
        }

        // 添加文本
        const text = createElement('span');
        text.textContent = menuItem.text;
        applyStyles(text, MENU_STYLES.menuItemText);
        leftContainer.appendChild(text);

        menuItemElement.appendChild(leftContainer);

        // 创建右侧容器
        const rightContainer = createElement('div');
        rightContainer.style.display = 'flex';
        rightContainer.style.alignItems = 'center';

        // 添加快捷键
        if (menuItem.shortcut) {
          const shortcut = createElement('span');
          shortcut.textContent = menuItem.shortcut;
          applyStyles(shortcut, MENU_STYLES.menuItemShortcut);
          rightContainer.appendChild(shortcut);
        }

        // 添加子菜单箭头
        if (menuItem.children && menuItem.children.length > 0) {
          menuItemElement.classList.add(MENU_ITEM_SUBMENU_CLASS);
          const arrow = createElement('span');
          arrow.textContent = '▶';
          applyStyles(arrow, MENU_STYLES.submenuArrow);
          rightContainer.appendChild(arrow);
        }

        menuItemElement.appendChild(rightContainer);

        // 禁用状态
        if (menuItem.disabled) {
          menuItemElement.classList.add(MENU_ITEM_DISABLED_CLASS);
          applyStyles(menuItemElement, MENU_STYLES.menuItemDisabled);
        }

        // 添加事件监听
        if (!menuItem.disabled) {
          // 点击事件
          if (!menuItem.children || menuItem.children.length === 0) {
            menuItemElement.addEventListener('click', () => {
              this.handleMenuItemClick({
                menuKey: menuItem.menuKey,
                menuText: menuItem.text,
                ...this.context
              });
            });
          }

          // 鼠标悬停事件
          menuItemElement.addEventListener('mouseenter', () => {
            // 添加悬停样式
            applyStyles(menuItemElement, MENU_STYLES.menuItemHover);

            // 清除隐藏定时器
            if (this.hideTimeout !== null) {
              clearTimeout(this.hideTimeout);
              this.hideTimeout = null;
            }

            // 如果有子菜单，显示子菜单
            if (menuItem.children && menuItem.children.length > 0) {
              // 关闭其他子菜单
              this.closeAllSubmenus();

              // 显示当前子菜单
              setTimeout(() => {
                if (document.body.contains(menuItemElement)) {
                  this.showSubmenu(menuItem.children!, menuItemElement);
                }
              }, this.submenuShowDelay);
            } else {
              // 没有子菜单，关闭所有子菜单
              this.closeAllSubmenus();
            }
          });

          // 鼠标离开事件
          menuItemElement.addEventListener('mouseleave', () => {
            // 移除悬停样式
            const computedStyle = window.getComputedStyle(menuItemElement);
            const originalBackgroundColor = computedStyle.backgroundColor;
            menuItemElement.style.backgroundColor = originalBackgroundColor;

            // 如果有子菜单，设置延迟关闭
            if (menuItem.children && menuItem.children.length > 0) {
              this.hideTimeout = window.setTimeout(() => {
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
  private showSubmenu(items: (MenuItem | MenuItemInput | string)[], parentElement: HTMLElement): void {
    const parentRect = parentElement.getBoundingClientRect();

    // 创建子菜单容器
    const submenu = createElement('div', MENU_CONTAINER_CLASS);
    applyStyles(submenu, MENU_STYLES.submenuContainer);

    // 创建子菜单项
    this.createMenuItems(items, submenu);

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
      this.hideTimeout = window.setTimeout(() => {
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
    this.destroy();

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
    this.destroy();
  };

  /**
   * 销毁菜单
   */
  destroy(): void {
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

    // 移除全局事件监听
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('contextmenu', this.handleDocumentClick);
  }
}
