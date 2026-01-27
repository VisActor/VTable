import type VTableSheet from '../components/vtable-sheet';
import type { MainMenuItem } from '../ts-types/base';
import { MainMenuItemKey } from '../ts-types/base';

export class MenuManager {
  private sheet: VTableSheet;
  private menuContainer: HTMLElement;
  private clickOutsideHandler: (e: MouseEvent) => void;
  constructor(sheet: VTableSheet) {
    this.sheet = sheet;
    this.createMainMenu();
  }

  createMainMenu(): HTMLElement {
    const menuIcon = `<svg t="1754379519717" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1496" width="24" height="24"><path d="M510.435876 67.959811c-245.428735 0-444.382996 198.954261-444.382996 444.373787 0 245.420549 198.954261 444.373787 444.382996 444.373787 245.410316 0 444.372763-198.953238 444.372763-444.373787C954.807616 266.914072 755.846192 67.959811 510.435876 67.959811zM510.435876 901.156184c-214.743876 0-388.831796-174.08792-388.831796-388.822586 0-214.743876 174.088944-388.831796 388.831796-388.831796 214.732619 0 388.822586 174.08792 388.822586 388.831796C899.257439 727.068264 725.167472 901.156184 510.435876 901.156184zM666.028561 329.355193 337.411171 329.355193c-15.117302 0-27.384697 15.60235-27.384697 34.844599 0 19.259646 12.267395 34.861996 27.384697 34.861996l328.618413 0c15.124466 0 27.375487-15.60235 27.375487-34.861996C693.404048 344.957543 681.15405 329.355193 666.028561 329.355193zM666.028561 486.191194 337.411171 486.191194c-15.117302 0-27.384697 15.601326-27.384697 34.852786 0 19.25146 12.267395 34.853809 27.384697 34.853809l328.618413 0c15.124466 0 27.375487-15.601326 27.375487-34.853809C693.404048 501.792521 681.15405 486.191194 666.028561 486.191194zM666.028561 625.604384 337.411171 625.604384c-15.117302 0-27.384697 15.60235-27.384697 34.845623 0 19.25146 12.267395 34.861996 27.384697 34.861996l328.618413 0c15.124466 0 27.375487-15.611559 27.375487-34.861996C693.404048 641.206734 681.15405 625.604384 666.028561 625.604384z" fill="#8a8a8a" p-id="1497"></path></svg>`;
    // const menuIcon = `<svg t="1754379884941" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M41.79704403125004 158.46048700694445l588.8681891302084 0 0 117.0003645451389-588.8681891302084 0 0-117.0003645451389Z" p-id="5684" fill="#8a8a8a"></path><path d="M41.79704403124998 394.9996354548611l588.8681891302086 0 0 117.0003645451389-588.8681891302086 0 0-117.0003645451389Z" p-id="5685" fill="#8a8a8a"></path><path d="M41.79704403124998 629.4749666302083l588.8681891302084 0 0 117.0003645451389-588.8681891302084 0 0-117.0003645451389Z" p-id="5686" fill="#8a8a8a"></path><path d="M831.596434 638.445854 642.224412 384.604518 1023.977999 384.604518Z" p-id="5687" fill="#8a8a8a"></path></svg>`;
    const menu = document.createElement('div');
    menu.className = 'vtable-sheet-main-menu';
    menu.style.position = 'relative'; // 关键：为子菜单提供定位基准

    // 菜单按钮
    const menuButton = document.createElement('span');
    menuButton.className = 'vtable-sheet-main-menu-button';
    menuButton.innerHTML = menuIcon;
    menu.appendChild(menuButton);

    // 菜单项容器（直接作为 menu 的子元素）
    const menuContainer = document.createElement('div');
    menuContainer.className = 'vtable-sheet-main-menu-container';
    menu.appendChild(menuContainer); // 挂载到 menu 内部

    // 菜单项列表
    const menuItems = document.createElement('ul');
    menuItems.className = 'vtable-sheet-main-menu-items';
    menuContainer.appendChild(menuItems);

    // 动态生成菜单项
    this.sheet.getOptions().mainMenu?.items?.forEach(item => {
      const li = document.createElement('li');
      li.className = 'vtable-sheet-main-menu-item';
      li.textContent = item.name;
      li.title = item.description || ''; //title提示
      if (item.items) {
        li.classList.add('vtable-sheet-main-menu-item-has-children');
        li.onmouseenter = () => {
          const subMenu = this.createSubMenu(item.items);
          li.appendChild(subMenu);
        };
        li.onmouseleave = () => {
          li.classList.remove('vtable-sheet-main-menu-item-has-children-hover');
          if (li.querySelector('.vtable-sheet-main-menu-sub-menu')) {
            li.removeChild(li.querySelector('.vtable-sheet-main-menu-sub-menu'));
          }
        };
      }
      li.addEventListener('click', () => {
        if (item.onClick) {
          item.onClick();
          return;
        }
        if (item.menuKey) {
          this.handleMenuClick(item.menuKey);
        }
      });
      menuItems.appendChild(li);
    });

    // 点击事件逻辑
    menuButton.addEventListener('click', e => {
      e.stopPropagation();
      menuContainer.classList.toggle('active');
    });

    // 点击外部关闭菜单
    this.clickOutsideHandler = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        menuContainer.classList.remove('active');
      }
    };
    document.addEventListener('click', this.clickOutsideHandler);
    this.menuContainer = menuContainer;
    return menu;
  }
  //TODO 需要重新逻辑，需要支持多级菜单
  private createSubMenu(items: MainMenuItem[]): HTMLElement {
    // 创建子菜单容器
    const subMenuContainer = document.createElement('div');
    subMenuContainer.className = 'vtable-sheet-submenu-container';

    // 创建子菜单列表
    const subMenuList = document.createElement('ul');
    subMenuList.className = 'vtable-sheet-main-menu-items';

    // 动态生成子菜单项
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'vtable-sheet-submenu-item';
      li.textContent = item.name;
      li.title = item.description || '';

      // 绑定点击事件
      li.addEventListener('click', e => {
        e.stopPropagation();
        if (item.onClick) {
          item.onClick();
        } else if (item.menuKey) {
          this.handleMenuClick(item.menuKey);
        }
        this.hideAllSubMenus(); // 点击后关闭所有子菜单
      });

      // 如果有嵌套子菜单
      if (item.items?.length) {
        // li.classList.add('has-submenu');
        li.classList.add('vtable-sheet-main-menu-item-has-children');
        // const arrowIcon = document.createElement('span');
        // arrowIcon.className = 'submenu-arrow';
        // arrowIcon.innerHTML = '▶';
        // li.appendChild(arrowIcon);

        // 鼠标悬停显示嵌套子菜单
        li.addEventListener('mouseenter', () => {
          this.hideAllSubMenus(li); // 先关闭其他子菜单
          const nestedSubMenu = this.createSubMenu(item.items);
          li.appendChild(nestedSubMenu);
          this.adjustSubMenuPosition(nestedSubMenu); // 调整定位
        });
      }

      subMenuList.appendChild(li);
    });

    subMenuContainer.appendChild(subMenuList);
    return subMenuContainer;
  }

  // 调整子菜单定位（避免超出视口）
  private adjustSubMenuPosition(subMenu: HTMLElement) {
    const rect = subMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      subMenu.style.left = 'auto';
      subMenu.style.right = '100%'; // 改为向左展开
    }
    if (rect.bottom > window.innerHeight) {
      subMenu.style.top = 'auto';
      subMenu.style.bottom = '0'; // 向上对齐
    }
  }

  // 关闭所有子菜单（保留当前激活项）并隐藏主菜单
  private hideAllSubMenus(exceptElement?: HTMLElement) {
    document.querySelectorAll('.vtable-sheet-submenu-container').forEach(menu => {
      if (menu !== exceptElement?.closest('.vtable-sheet-submenu-container')) {
        menu.remove();
      }
    });
    this.menuContainer.classList.remove('active');
  }
  handleMenuClick(menuKey: MainMenuItemKey) {
    const tableInstance = this.sheet.getActiveSheet().tableInstance;
    const eventManager = this.sheet.getSpreadSheetEventManager();

    switch (menuKey) {
      case MainMenuItemKey.IMPORT:
        if (this.sheet.importFileToSheet) {
          this.sheet.importFileToSheet();
        }
        break;

      case MainMenuItemKey.EXPORT_CURRENT_SHEET_CSV:
        try {
          // 触发导出开始事件
          eventManager.emitExportStart('csv', false);

          if ((tableInstance as any)?.exportToCsv) {
            (tableInstance as any).exportToCsv();
            // 触发导出完成事件
            eventManager.emitExportCompleted('csv', false, 1);
          } else {
            console.warn('Please configure TableExportPlugin in VTablePluginModules');
            // 触发导出失败事件
            eventManager.emitExportError('csv', false, 'TableExportPlugin not configured');
          }
        } catch (error) {
          // 触发导出失败事件
          const errorMessage = error instanceof Error ? error.message : String(error);
          eventManager.emitExportError('csv', false, errorMessage);
          console.warn('Export to CSV failed:', errorMessage);
        }
        break;

      case MainMenuItemKey.EXPORT_CURRENT_SHEET_XLSX:
        try {
          // 触发导出开始事件
          eventManager.emitExportStart('xlsx', false);

          if ((tableInstance as any)?.exportToExcel) {
            (tableInstance as any).exportToExcel();
            // 触发导出完成事件
            eventManager.emitExportCompleted('xlsx', false, 1);
          } else {
            console.warn('Please configure TableExportPlugin in VTablePluginModules');
            // 触发导出失败事件
            eventManager.emitExportError('xlsx', false, 'TableExportPlugin not configured');
          }
        } catch (error) {
          // 触发导出失败事件
          const errorMessage = error instanceof Error ? error.message : String(error);
          eventManager.emitExportError('xlsx', false, errorMessage);
          console.warn('Export to Excel failed:', errorMessage);
        }
        break;

      case MainMenuItemKey.EXPORT_ALL_SHEETS_XLSX:
        try {
          // 触发导出开始事件
          eventManager.emitExportStart('xlsx', true);

          // 多 sheet 导出走 vtable-plugins 的导出工具，不依赖向 tableInstance 注入 exportToExcel
          if (this.sheet.exportAllSheetsToExcel) {
            this.sheet.exportAllSheetsToExcel();
            // 触发导出完成事件
            const sheetCount = this.sheet.getSheetCount();
            eventManager.emitExportCompleted('xlsx', true, sheetCount);
          } else {
            console.warn('Export all sheets method not available');
            // 触发导出失败事件
            eventManager.emitExportError('xlsx', true, 'Export all sheets method not available');
          }
        } catch (error) {
          // 触发导出失败事件
          const errorMessage = error instanceof Error ? error.message : String(error);
          eventManager.emitExportError('xlsx', true, errorMessage);
          console.warn('Export all sheets failed:', errorMessage);
        }
        break;

      default:
        break;
    }
  }

  /**
   * 清理菜单管理器，移除全局事件监听器
   */
  release(): void {
    if (this.clickOutsideHandler) {
      document.removeEventListener('click', this.clickOutsideHandler);
      this.clickOutsideHandler = null;
    }
  }
}
