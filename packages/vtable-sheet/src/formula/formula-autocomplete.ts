import type { IEditor } from '@visactor/vtable-editors';
import type VTableSheet from '../components/vtable-sheet';

interface AutocompleteItem {
  type: 'function' | 'cell' | 'range';
  value: string;
  label: string;
  description?: string;
  signature?: string;
}

export class FormulaAutocomplete {
  private container: HTMLElement;
  private dropdown: HTMLElement | null = null;
  private items: AutocompleteItem[] = [];
  private selectedIndex: number = -1;
  private isVisible: boolean = false;
  private originalEditingEditor: IEditor<any, any> = null;
  private inputElement: HTMLInputElement | null = null;
  private sheet: VTableSheet;
  private onSelectCallback?: (item: AutocompleteItem) => void;

  private customPositioning?: () => void;

  constructor(container: HTMLElement, sheet: VTableSheet) {
    this.container = container;
    this.sheet = sheet;
    this.createDropdown();
  }

  /**
   * 创建下拉框元素
   */
  private createDropdown(): void {
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'vtable-formula-autocomplete';
    this.dropdown.style.display = 'none';
    this.container.appendChild(this.dropdown);
  }

  /**
   * 绑定到输入框
   */
  attachTo(input: HTMLInputElement, onSelect?: (item: AutocompleteItem) => void, customPositioning?: () => void): void {
    this.inputElement = input;
    this.onSelectCallback = onSelect;
    this.customPositioning = customPositioning;

    // 绑定事件
    input.addEventListener('input', this.handleInput.bind(this));
    input.addEventListener('keydown', this.handleKeydown.bind(this), true);
    input.addEventListener('blur', () => {
      setTimeout(() => this.hide(), 10);
    });
  }

  /**
   * 处理输入事件
   */
  private handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const cursorPos = input.selectionStart || 0;

    // 解析当前输入上下文
    const context = this.parseInputContext(value, cursorPos);

    if (context.shouldShowAutocomplete) {
      this.updateSuggestions(context);
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * 解析输入上下文
   */
  private parseInputContext(
    value: string,
    cursorPos: number
  ): {
    shouldShowAutocomplete: boolean;
    searchTerm: string;
    type: 'function' | 'cell' | 'all';
    insertPosition: number;
  } {
    // 如果不是公式，不显示
    if (!value.startsWith('=')) {
      return { shouldShowAutocomplete: false, searchTerm: '', type: 'all', insertPosition: 0 };
    }

    // 获取光标前的文本
    const textBeforeCursor = value.substring(1, cursorPos); // 去掉 '='

    // 查找最后一个函数或操作符
    const lastOperatorMatch = textBeforeCursor.match(/[\+\-\*\/\(\,\s]([A-Za-z0-9]*)$/);

    if (lastOperatorMatch && lastOperatorMatch[1] !== '') {
      return {
        shouldShowAutocomplete: true,
        searchTerm: lastOperatorMatch[1],
        type: /^[A-Za-z]/.test(lastOperatorMatch[1]) ? 'function' : 'cell',
        insertPosition: cursorPos - lastOperatorMatch[1].length
      };
    }

    // 公式开始位置
    if (textBeforeCursor.match(/^[A-Za-z0-9]*$/)) {
      return {
        shouldShowAutocomplete: true,
        searchTerm: textBeforeCursor,
        type: 'all',
        insertPosition: 1
      };
    }

    return { shouldShowAutocomplete: false, searchTerm: '', type: 'all', insertPosition: 0 };
  }

  /**
   * 更新建议列表
   */
  private updateSuggestions(context: any): void {
    const { searchTerm, type } = context;
    this.items = [];

    // 获取函数列表
    if (type === 'function' || type === 'all') {
      const functions = this.sheet.formulaManager.getAvailableFunctions();
      const functionItems = functions
        .filter(fn => fn.toUpperCase().startsWith(searchTerm.toUpperCase()))
        .slice(0, 10) // 限制数量
        .map(fn => ({
          type: 'function' as const,
          value: fn,
          label: fn,
          description: this.getFunctionDescription(fn),
          signature: this.getFunctionSignature(fn)
        }));
      this.items.push(...functionItems);
    }

    // 添加单元格引用建议
    if (type === 'cell' || type === 'all') {
      const cellSuggestions = this.generateCellSuggestions(searchTerm);
      this.items.push(...cellSuggestions);
    }
    this.renderDropdown();
  }

  /**
   * 生成单元格引用建议
   */
  private generateCellSuggestions(searchTerm: string): AutocompleteItem[] {
    const suggestions: AutocompleteItem[] = [];

    // 如果是有效的部分单元格地址
    const cellMatch = searchTerm.match(/^([A-Za-z]*)([0-9]*)$/);
    if (cellMatch) {
      const [, colPart, rowPart] = cellMatch;

      // 生成列建议
      if (colPart && !rowPart) {
        // A -> A1, A2, A3...
        for (let row = 1; row <= 5; row++) {
          suggestions.push({
            type: 'cell',
            value: `${colPart.toUpperCase()}${row}`,
            label: `${colPart.toUpperCase()}${row}`,
            description: '单元格引用'
          });
        }
      }

      // 生成完整单元格建议
      if (colPart && rowPart) {
        const address = `${colPart.toUpperCase()}${rowPart}`;
        suggestions.push({
          type: 'cell',
          value: address,
          label: address,
          description: '单元格引用'
        });

        // 添加范围建议
        suggestions.push({
          type: 'range',
          value: `${address}:`,
          label: `${address}:...`,
          description: '开始选择范围'
        });
      }
    }

    return suggestions.slice(0, 5); // 限制建议数量
  }

  /**
   * 获取函数描述
   */
  private getFunctionDescription(functionName: string): string {
    const descriptions: Record<string, string> = {
      SUM: '计算数值总和',
      AVERAGE: '计算平均值',
      COUNT: '计数数值单元格',
      MAX: '返回最大值',
      MIN: '返回最小值',
      IF: '条件判断',
      VLOOKUP: '垂直查找',
      CONCATENATE: '连接文本'
      // ... 更多函数描述
    };
    return descriptions[functionName] || '';
  }

  /**
   * 获取函数签名
   */
  private getFunctionSignature(functionName: string): string {
    const signatures: Record<string, string> = {
      SUM: '(number1, [number2], ...)',
      AVERAGE: '(number1, [number2], ...)',
      COUNT: '(value1, [value2], ...)',
      MAX: '(number1, [number2], ...)',
      MIN: '(number1, [number2], ...)',
      IF: '(logical_test, value_if_true, value_if_false)',
      VLOOKUP: '(lookup_value, table_array, col_index_num, [range_lookup])',
      CONCATENATE: '(text1, [text2], ...)'
      // ... 更多函数签名
    };
    return signatures[functionName] || '()';
  }

  /**
   * 渲染下拉框
   */
  private renderDropdown(): void {
    if (!this.dropdown) {
      return;
    }

    this.dropdown.innerHTML = '';

    if (this.items.length === 0) {
      // 无结果提示
      const emptyEl = document.createElement('div');
      emptyEl.className = 'vtable-formula-autocomplete-empty';
      emptyEl.textContent = '没有匹配的函数';
      this.dropdown.appendChild(emptyEl);
      return;
    }

    // 按类型分组
    const groups = this.groupItems(this.items);

    groups.forEach(group => {
      // 添加分组标题
      if (groups.length > 1) {
        const groupEl = document.createElement('div');
        groupEl.className = 'vtable-formula-autocomplete-group';
        groupEl.textContent = this.getGroupTitle(group.type);
        this.dropdown.appendChild(groupEl);
      }

      // 渲染组内项目
      group.items.forEach((item, index) => {
        const globalIndex = this.items.indexOf(item);
        const itemEl = document.createElement('div');
        itemEl.className = 'vtable-formula-autocomplete-item';

        if (globalIndex === this.selectedIndex) {
          itemEl.classList.add('selected');
        }

        // 函数名和类型标签
        const nameEl = document.createElement('div');
        nameEl.className = 'item-name';

        const labelEl = document.createElement('span');
        labelEl.textContent = item.label;
        nameEl.appendChild(labelEl);

        const typeEl = document.createElement('span');
        typeEl.className = `item-type ${item.type}`;
        typeEl.textContent = this.getTypeLabel(item.type);
        nameEl.appendChild(typeEl);

        itemEl.appendChild(nameEl);

        // 函数签名
        if (item.signature) {
          const signatureEl = document.createElement('div');
          signatureEl.className = 'item-signature';
          signatureEl.textContent = item.signature;
          itemEl.appendChild(signatureEl);
        }

        // 描述
        if (item.description) {
          const descEl = document.createElement('div');
          descEl.className = 'item-description';
          descEl.textContent = item.description;
          itemEl.appendChild(descEl);
        }

        itemEl.addEventListener('mousedown', () => this.selectItem(globalIndex));
        itemEl.addEventListener('mouseenter', () => {
          this.selectedIndex = globalIndex;
          this.renderDropdown();
        });

        this.dropdown.appendChild(itemEl);
      });
    });

    // 添加快捷键提示
    const footerEl = document.createElement('div');
    footerEl.className = 'vtable-formula-autocomplete-footer';
    footerEl.innerHTML = `
    <div class="shortcut">
      <span class="key">↑↓</span>
      <span>选择</span>
    </div>
    <div class="shortcut">
      <span class="key">Enter</span>
      <span>确认</span>
    </div>
    <div class="shortcut">
      <span class="key">Esc</span>
      <span>取消</span>
    </div>
  `;
    this.dropdown.appendChild(footerEl);

    this.positionDropdown();
  }

  /**
   * 对项目进行分组
   */
  private groupItems(items: AutocompleteItem[]): Array<{ type: string; items: AutocompleteItem[] }> {
    const groups: Record<string, AutocompleteItem[]> = {};

    items.forEach(item => {
      if (!groups[item.type]) {
        groups[item.type] = [];
      }
      groups[item.type].push(item);
    });

    // 按照优先级排序：function > cell > range
    const priority = ['function', 'cell', 'range'];
    return priority.filter(type => groups[type]).map(type => ({ type, items: groups[type] }));
  }

  /**
   * 获取分组标题
   */
  private getGroupTitle(type: string): string {
    const titles: Record<string, string> = {
      function: '函数',
      cell: '单元格',
      range: '范围'
    };
    return titles[type] || type;
  }

  /**
   * 获取类型标签
   */
  private getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      function: 'fx',
      cell: 'A1',
      range: 'A:B'
    };
    return labels[type] || type;
  }

  /**
   * 定位下拉框
   */
  private positionDropdown(): void {
    if (this.customPositioning) {
      this.customPositioning();
      return;
    }
    if (!this.dropdown || !this.inputElement) {
      return;
    }

    const inputRect = this.inputElement.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    this.dropdown.style.position = 'absolute';
    this.dropdown.style.left = `${inputRect.left - containerRect.left}px`;
    this.dropdown.style.top = `${inputRect.bottom - containerRect.top + 2}px`;
    this.dropdown.style.width = `${Math.max(300, inputRect.width)}px`;
  }

  /**
   * 处理键盘事件
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (!this.isVisible) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.items.length - 1);
        this.renderDropdown();
        this.scrollToSelectedItem();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.renderDropdown();
        this.scrollToSelectedItem();
        break;
      case 'Enter':
        if (this.selectedIndex >= 0) {
          event.preventDefault();
          this.selectItem(this.selectedIndex);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.hide();
        // 确保输入框重新获得焦点
        if (this.inputElement) {
          this.inputElement.focus();
        }
        break;
      case 'Tab':
        if (this.selectedIndex >= 0) {
          event.preventDefault();
          this.selectItem(this.selectedIndex);
        } else {
          this.hide();
        }
        break;
    }
  }

  /**
   * 滚动到选中的项目
   */
  private scrollToSelectedItem(): void {
    if (!this.dropdown || this.selectedIndex < 0) {
      return;
    }

    const items = this.dropdown.querySelectorAll('.vtable-formula-autocomplete-item');
    if (items[this.selectedIndex]) {
      const selectedItem = items[this.selectedIndex] as HTMLElement;
      selectedItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  /**
   * 选择项目
   */
  private selectItem(index: number): void {
    const item = this.items[index];
    if (!item || !this.inputElement) {
      return;
    }

    if (this.onSelectCallback) {
      this.onSelectCallback(item);
    } else {
      // 默认插入行为
      const value = this.inputElement.value;
      const cursorPos = this.inputElement.selectionStart || 0;
      const context = this.parseInputContext(value, cursorPos);

      const newValue =
        value.substring(0, context.insertPosition) +
        item.value +
        (item.type === 'function' ? '(' : '') +
        value.substring(cursorPos);

      this.inputElement.value = newValue;

      // 设置光标位置
      const newCursorPos = context.insertPosition + item.value.length + (item.type === 'function' ? 1 : 0);
      this.inputElement.setSelectionRange(newCursorPos, newCursorPos);

      // 触发input事件以同步到其他组件
      const inputEvent = new Event('input', { bubbles: true });
      this.inputElement.dispatchEvent(inputEvent);
    }

    this.hide();

    // 确保输入框重新获得焦点
    if (this.inputElement) {
      setTimeout(() => {
        this.inputElement.focus();
      }, 50);
    }
  }

  /**
   * 显示下拉框
   */
  private show(): void {
    if (this.dropdown && this.items.length > 0) {
      this.originalEditingEditor = this.sheet.getActiveSheet().tableInstance.editorManager.editingEditor;
      this.sheet.getActiveSheet().tableInstance.editorManager.editingEditor = null;
      this.dropdown.style.display = 'block';
      this.isVisible = true;
      this.selectedIndex = 0;
      this.renderDropdown();
    }
  }

  /**
   * 隐藏下拉框
   */
  private hide(): void {
    if (this.originalEditingEditor) {
      this.sheet.getActiveSheet().tableInstance.editorManager.editingEditor = this.originalEditingEditor;
      this.originalEditingEditor = null;
    }
    if (this.dropdown) {
      this.dropdown.style.display = 'none';
      this.isVisible = false;
      this.selectedIndex = -1;
    }
  }

  /**
   * 销毁组件
   */
  release(): void {
    if (this.dropdown && this.dropdown.parentNode) {
      this.dropdown.parentNode.removeChild(this.dropdown);
    }
  }
}
