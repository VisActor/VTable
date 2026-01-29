import type VTableSheet from './vtable-sheet';
import { showSnackbar } from '../tools/ui/snackbar';
import { checkTabTitle } from '../tools';

/**
 * Sheet Tab Event Handler
 * 专门处理sheet标签页相关的事件逻辑
 */
export class SheetTabEventHandler {
  private vTableSheet: VTableSheet;

  constructor(vTableSheet: VTableSheet) {
    this.vTableSheet = vTableSheet;
  }

  /**
   * 处理sheet标签双击事件
   * 双击sheet标签后，将标签设为可编辑状态。输入完成后进行重命名。
   * @param sheetKey 工作表key
   * @param originalTitle 原始名称
   */
  handleSheetTabDblClick(sheetKey: string, originalTitle: string): void {
    const targetTab = this.getSheetTabElementByKey(sheetKey);
    if (!targetTab) {
      return;
    }
    // 将原文本节点设为可编辑
    targetTab.setAttribute('contenteditable', 'true');
    targetTab.setAttribute('spellcheck', 'false');
    targetTab.classList.add('editing'); // 添加编辑状态样式
    // 选中所有文本
    const range = document.createRange();
    range.selectNodeContents(targetTab);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    const onBlur = () => {
      finishInput(true);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        finishInput(true);
      } else if (e.key === 'Escape') {
        finishInput(false);
      }
    };
    const finishInput = (commit: boolean) => {
      targetTab.removeEventListener('blur', onBlur);
      targetTab.removeEventListener('keydown', onKeyDown);
      targetTab.classList.remove('editing');
      targetTab.setAttribute('contenteditable', 'false');
      const newTitle = targetTab.textContent?.trim();
      if (!commit || newTitle === originalTitle || !this.renameSheet(sheetKey, newTitle)) {
        targetTab.textContent = originalTitle;
        return;
      }
    };
    targetTab.addEventListener('blur', onBlur);
    targetTab.addEventListener('keydown', onKeyDown);
  }

  /**
   * 重命名sheet
   * @param sheetKey 工作表key
   * @param newTitle 新名称
   * @returns 是否成功
   */
  private renameSheet(sheetKey: string, newTitle: string): boolean {
    const sheet = this.vTableSheet.getSheetManager().getSheet(sheetKey);
    if (!sheet) {
      return false;
    }
    const error = checkTabTitle(newTitle);
    if (error) {
      showSnackbar(error, 1300);
      return false;
    }
    const isExist = this.vTableSheet
      .getSheetManager()
      .getAllSheets()
      .find(s => s.sheetKey !== sheetKey && s.sheetTitle.toLowerCase() === newTitle.toLowerCase());
    if (isExist) {
      showSnackbar('工作表名称已存在，请重新输入', 1300);
      return false;
    }

    this.vTableSheet.getSheetManager().renameSheet(sheetKey, newTitle);
    this.vTableSheet.workSheetInstances.get(sheetKey)?.setTitle(newTitle);

    // 更新公式引擎中的工作表标题映射
    this.vTableSheet.getFormulaManager().updateSheetTitle(sheetKey, newTitle);

    this.vTableSheet.updateSheetTabs();
    this.vTableSheet.updateSheetMenu();
    return true;
  }

  /**
   * 获取指定sheetKey的标签元素
   */
  private getSheetTabElementByKey(sheetKey: string): HTMLElement | null {
    const tabsContainer = this.vTableSheet
      .getSheetTabElement()
      ?.querySelector('.vtable-sheet-tabs-container') as HTMLElement;
    return tabsContainer?.querySelector(`.vtable-sheet-tab[data-key="${sheetKey}"]`) as HTMLElement;
  }

  /**
   * 激活sheet标签并滚动到可见区域
   */
  activeSheetTab(): void {
    const tabs = this.vTableSheet
      .getSheetTabElement()
      ?.querySelectorAll('.vtable-sheet-tab') as NodeListOf<HTMLElement>;
    let activeTab: HTMLElement | null = null;
    tabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.key === this.vTableSheet.getActiveSheet()?.getKey()) {
        tab.classList.add('active');
        activeTab = tab;
      }
    });
    // 确保激活的标签可见
    setTimeout(() => {
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }

  /**
   * 更新渐变效果
   * @param tabsContainer 标签容器
   * @param fadeLeft 左侧渐变效果
   * @param fadeRight 右侧渐变效果
   */
  updateFadeEffects(tabsContainer: HTMLElement, fadeLeft: HTMLElement, fadeRight: HTMLElement): void {
    // 显示/隐藏左侧渐变
    if (tabsContainer.scrollLeft > 10) {
      fadeLeft.style.display = 'block';
    } else {
      fadeLeft.style.display = 'none';
    }

    // 显示/隐藏右侧渐变
    const maxScroll = tabsContainer.scrollWidth - tabsContainer.clientWidth;
    if (tabsContainer.scrollLeft < maxScroll - 10) {
      fadeRight.style.display = 'block';
    } else {
      fadeRight.style.display = 'none';
    }
  }

  /**
   * 滚动sheet标签
   * @param direction 滚动方向
   * @param tabsContainer 标签容器
   */
  scrollSheetTabs(direction: 'left' | 'right', tabsContainer: HTMLElement): void {
    const scrollAmount = 200; // 每次滚动的像素数
    const currentScroll = tabsContainer.scrollLeft;

    if (direction === 'left') {
      tabsContainer.scrollTo({
        left: Math.max(0, currentScroll - scrollAmount),
        behavior: 'smooth'
      });
    } else {
      tabsContainer.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  /**
   * 滚动以确保标签可见
   * @param tab 标签
   * @param container 容器
   */
  scrollTabIntoView(tab: HTMLElement, container: HTMLElement): void {
    const tabRect = tab.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (tabRect.left < containerRect.left) {
      // 标签在可见区域左侧
      container.scrollLeft += tabRect.left - containerRect.left - 10;
    } else if (tabRect.right > containerRect.right) {
      // 标签在可见区域右侧
      container.scrollLeft += tabRect.right - containerRect.right + 10;
    }
  }

  /**
   * 显示工作表菜单
   */
  toggleSheetMenu(event: MouseEvent): void {
    const menuContainer = this.vTableSheet
      .getSheetTabElement()
      ?.querySelector('.vtable-sheet-menu-list') as HTMLElement;
    menuContainer.classList.toggle('active');

    // 如果菜单被打开，添加点击外部关闭的监听器
    if (menuContainer.classList.contains('active')) {
      this.addClickOutsideListener();
    } else {
      this.removeClickOutsideListener();
    }
  }

  /**
   * 添加点击外部关闭菜单的监听器
   */
  private clickOutsideHandler = (event: MouseEvent): void => {
    const menuContainer = this.vTableSheet
      .getSheetTabElement()
      ?.querySelector('.vtable-sheet-menu-list') as HTMLElement;
    const menuButton = this.vTableSheet.getSheetTabElement()?.querySelector('.vtable-sheet-menu-button') as HTMLElement;

    // 如果点击的不是菜单容器和菜单按钮，则关闭菜单
    if (
      menuContainer &&
      menuButton &&
      !menuContainer.contains(event.target as Node) &&
      !menuButton.contains(event.target as Node)
    ) {
      menuContainer.classList.remove('active');
      this.removeClickOutsideListener();
    }
  };

  /**
   * 添加点击外部监听器
   */
  addClickOutsideListener(): void {
    document.addEventListener('click', this.clickOutsideHandler);
  }

  /**
   * 移除点击外部监听器
   */
  removeClickOutsideListener(): void {
    document.removeEventListener('click', this.clickOutsideHandler);
  }

  /**
   * 更新sheet列表
   */
  updateSheetMenu(): void {
    const menuContainer = this.vTableSheet
      .getSheetTabElement()
      ?.querySelector('.vtable-sheet-menu-list') as HTMLElement;
    menuContainer.innerHTML = '';
    const sheets = this.vTableSheet.getSheetManager().getAllSheets();
    sheets.forEach(sheet => {
      // li
      const li = document.createElement('li');
      li.className = 'vtable-sheet-menu-item';
      li.dataset.key = sheet.sheetKey;
      // title
      const title = document.createElement('span');
      title.className = 'vtable-sheet-menu-item-title';
      title.innerText = sheet.sheetTitle;
      li.appendChild(title);
      // delete button
      const div = document.createElement('div');
      div.className = 'vtable-sheet-menu-delete-button';
      div.innerHTML =
        '<svg class="x-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';
      div.addEventListener('click', e => {
        this.vTableSheet.removeSheet(sheet.sheetKey);
        e.stopPropagation();
      });
      li.addEventListener('click', () => this.vTableSheet.activateSheet(sheet.sheetKey));
      li.appendChild(div);
      menuContainer.appendChild(li);
    });
    this.activeSheetMenuItem();
    // 确保激活的标签可见
    setTimeout(() => {
      const activeItem = menuContainer.querySelector('.vtable-sheet-main-menu-item.active');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }

  /**
   * 激活sheet菜单项并滚动到可见区域
   */
  activeSheetMenuItem(): void {
    const menuItems = this.vTableSheet
      .getSheetTabElement()
      ?.querySelectorAll('.vtable-sheet-main-menu-item') as NodeListOf<HTMLElement>;
    let activeItem: HTMLElement | null = null;
    menuItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.key === this.vTableSheet.getActiveSheet()?.getKey()) {
        item.classList.add('active');
        activeItem = item;
      }
    });
    setTimeout(() => {
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }
}
