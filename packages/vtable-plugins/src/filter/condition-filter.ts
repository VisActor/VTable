import type * as VTable from '@visactor/vtable';
import type { FilterStateManager } from './filter-state-manager';
import { applyStyles, filterStyles, createElement } from './styles';
import type { FilterOperator, OperatorOption } from './types';
import { FilterActionType, FilterOperatorCategory } from './types';

/**
 * 按条件筛选组件
 */
export class ConditionFilter {
  private table: VTable.ListTable | VTable.PivotTable;
  private filterStateManager: FilterStateManager;
  private filterByConditionPanel: HTMLElement;
  private selectedField: string;
  private operatorSelect: HTMLSelectElement;
  private valueInput: HTMLInputElement;
  private valueInputMax: HTMLInputElement;
  private categorySelect: HTMLSelectElement;
  private currentCategory: FilterOperatorCategory = FilterOperatorCategory.ALL;

  // 按分类组织的操作符选项
  private operators: OperatorOption[] = [
    // 通用操作符 (全部分类中显示)
    { value: 'equals', label: '等于', category: FilterOperatorCategory.ALL },
    { value: 'notEquals', label: '不等于', category: FilterOperatorCategory.ALL },

    // 数值操作符
    { value: 'equals', label: '等于', category: FilterOperatorCategory.NUMBER },
    { value: 'notEquals', label: '不等于', category: FilterOperatorCategory.NUMBER },
    { value: 'greaterThan', label: '大于', category: FilterOperatorCategory.NUMBER },
    { value: 'lessThan', label: '小于', category: FilterOperatorCategory.NUMBER },
    { value: 'greaterThanOrEqual', label: '大于等于', category: FilterOperatorCategory.NUMBER },
    { value: 'lessThanOrEqual', label: '小于等于', category: FilterOperatorCategory.NUMBER },
    { value: 'between', label: '介于', category: FilterOperatorCategory.NUMBER },
    { value: 'notBetween', label: '不介于', category: FilterOperatorCategory.NUMBER },

    // 文本操作符
    { value: 'equals', label: '等于', category: FilterOperatorCategory.TEXT },
    { value: 'notEquals', label: '不等于', category: FilterOperatorCategory.TEXT },
    { value: 'contains', label: '包含', category: FilterOperatorCategory.TEXT },
    { value: 'notContains', label: '不包含', category: FilterOperatorCategory.TEXT },
    { value: 'startsWith', label: '开头是', category: FilterOperatorCategory.TEXT },
    { value: 'notStartsWith', label: '开头不是', category: FilterOperatorCategory.TEXT },
    { value: 'endsWith', label: '结尾是', category: FilterOperatorCategory.TEXT },
    { value: 'notEndsWith', label: '结尾不是', category: FilterOperatorCategory.TEXT },

    // 颜色操作符
    { value: 'equals', label: '等于', category: FilterOperatorCategory.COLOR },
    { value: 'notEquals', label: '不等于', category: FilterOperatorCategory.COLOR },

    // 复选框操作符
    { value: 'isChecked', label: '已选中', category: FilterOperatorCategory.CHECKBOX },
    { value: 'isUnchecked', label: '未选中', category: FilterOperatorCategory.CHECKBOX },

    // 单选框操作符
    { value: 'isChecked', label: '已选中', category: FilterOperatorCategory.RADIO },
    { value: 'isUnchecked', label: '未选中', category: FilterOperatorCategory.RADIO }
  ];

  // 分类下拉选项
  private categories = [
    { value: FilterOperatorCategory.ALL, label: '全部' },
    { value: FilterOperatorCategory.TEXT, label: '文本' },
    { value: FilterOperatorCategory.NUMBER, label: '数值' },
    { value: FilterOperatorCategory.COLOR, label: '颜色' },
    { value: FilterOperatorCategory.CHECKBOX, label: '复选框' },
    { value: FilterOperatorCategory.RADIO, label: '单选框' }
  ];

  constructor(table: VTable.ListTable | VTable.PivotTable, filterStateManager: FilterStateManager) {
    this.table = table;
    this.filterStateManager = filterStateManager;
  }

  setSelectedField(fieldId: string): void {
    this.selectedField = fieldId;
    this.updateOperatorOptions();
    this.loadCurrentFilterState();
  }

  /**
   * 更新操作符下拉选项
   */
  private updateOperatorOptions(): void {
    if (!this.operatorSelect) {
      return;
    }
    this.operatorSelect.innerHTML = '';
    let filteredOperators: OperatorOption[];

    if (this.currentCategory === FilterOperatorCategory.ALL) {
      // 当选择"全部"时，收集所有不重复的操作符
      const uniqueOperators = new Map<string, OperatorOption>();
      this.operators.forEach(op => {
        if (!uniqueOperators.has(op.value)) {
          uniqueOperators.set(op.value, op);
        }
      });
      filteredOperators = Array.from(uniqueOperators.values());
    } else {
      // 其他类别正常筛选
      filteredOperators = this.operators.filter(op => op.category === this.currentCategory);
    }

    // 添加新选项
    filteredOperators.forEach(op => {
      const option = document.createElement('option');
      option.value = op.value;
      option.textContent = op.label;
      this.operatorSelect.appendChild(option);
    });
  }

  /**
   * 加载当前的筛选状态
   */
  private loadCurrentFilterState(): void {
    const filter = this.filterStateManager.getState().filters.get(this.selectedField);

    if (filter && filter.type === 'byCondition') {
      // 设置操作符
      if (filter.operator && this.operatorSelect) {
        this.operatorSelect.value = filter.operator;
      }

      // 设置条件值
      if (filter.condition !== undefined && this.valueInput) {
        if (Array.isArray(filter.condition)) {
          this.valueInput.value = String(filter.condition[0]);
          this.valueInputMax.value = String(filter.condition[1]);
        } else {
          this.valueInput.value = String(filter.condition);
        }
      }
    } else {
      // 重置为默认值
      if (this.operatorSelect) {
        this.operatorSelect.selectedIndex = 0;
      }
      if (this.valueInput) {
        this.valueInput.value = '';
      }
    }
  }

  /**
   * 处理分类切换
   */
  private handleCategoryChange(): void {
    if (!this.categorySelect) {
      return;
    }

    this.currentCategory = this.categorySelect.value as FilterOperatorCategory;
    this.updateOperatorOptions();
  }

  private isBooleanOperator(operator: FilterOperator): boolean {
    const booleanCondition = ['isChecked', 'isUnchecked'];
    return booleanCondition.includes(operator);
  }

  private isRangeOperator(operator: FilterOperator): boolean {
    return operator === 'between' || operator === 'notBetween';
  }

  /**
   * 应用筛选条件
   */
  applyFilter(fieldId: string = this.selectedField): void {
    if (!this.operatorSelect || !this.valueInput) {
      return;
    }

    const operator = this.operatorSelect?.value as FilterOperator;
    let conditionValue: any = this.valueInput?.value;

    // 根据所选操作符和分类尝试转换输入值
    if (this.currentCategory === FilterOperatorCategory.NUMBER) {
      conditionValue = parseFloat(conditionValue);
      if (isNaN(conditionValue)) {
        console.warn('请输入有效的数字');
        return;
      }
    }

    // 处理范围操作符的双值输入
    if (this.isRangeOperator(operator)) {
      const minValue = conditionValue;
      let maxValue: string | number = this.valueInputMax.value.trim();

      console.log('minValue', minValue);
      console.log('maxValue', maxValue);

      // 尝试将最大值也转换为数字
      if (this.currentCategory === FilterOperatorCategory.NUMBER) {
        const numMaxValue = parseFloat(maxValue);
        if (!isNaN(numMaxValue)) {
          maxValue = numMaxValue;
        } else {
          console.warn('请输入有效的最大值');
          return;
        }
      }

      // 使用数组形式传递范围值
      conditionValue = [minValue, maxValue];
      console.log('conditionValue', conditionValue);
    }

    if (!conditionValue && conditionValue !== false && conditionValue !== 0 && !this.isBooleanOperator(operator)) {
      this.clearFilter(fieldId);
      return;
    }

    // TODO：处理单元格颜色和字体颜色的筛选

    this.filterStateManager.dispatch({
      type: FilterActionType.APPLY_FILTERS,
      payload: {
        id: fieldId,
        field: fieldId,
        type: 'byCondition',
        operator,
        condition: conditionValue,
        enable: true
      }
    });

    this.hide();
  }

  /**
   * 清除筛选
   */
  clearFilter(fieldId: string): void {
    this.filterStateManager.dispatch({
      type: FilterActionType.REMOVE_FILTER,
      payload: {
        id: fieldId
      }
    });

    this.hide();
  }

  /**
   * 渲染条件筛选面板
   */
  render(container: HTMLElement): void {
    // 按条件筛选面板
    this.filterByConditionPanel = document.createElement('div');
    applyStyles(this.filterByConditionPanel, filterStyles.filterPanel);

    // 条件选择区域
    const conditionContainer = document.createElement('div');
    applyStyles(conditionContainer, filterStyles.conditionContainer);

    // 分类选择下拉框
    const categoryLabel = createElement('label', {}, ['筛选类型：']);
    applyStyles(categoryLabel, filterStyles.formLabel);

    this.categorySelect = createElement('select') as HTMLSelectElement;
    applyStyles(this.categorySelect, filterStyles.operatorSelect);

    // 添加分类选项
    this.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.value;
      option.textContent = category.label;
      this.categorySelect.appendChild(option);
    });

    // 操作符选择下拉框
    const operatorLabel = createElement('label', {}, ['筛选条件：']);
    applyStyles(operatorLabel, filterStyles.formLabel);

    this.operatorSelect = createElement('select') as HTMLSelectElement;
    applyStyles(this.operatorSelect, filterStyles.operatorSelect);

    // 条件值输入框
    const valueLabel = createElement('label', {}, ['筛选值：']);
    applyStyles(valueLabel, filterStyles.formLabel);

    // 一个容器来包装两个输入框和"和"字
    const rangeInputContainer = createElement('div');
    applyStyles(rangeInputContainer, filterStyles.rangeInputContainer);

    this.valueInput = createElement('input', {
      type: 'text',
      placeholder: '请输入筛选值'
    }) as HTMLInputElement;
    applyStyles(this.valueInput, filterStyles.searchInput);

    // "和"字标签
    const andLabel = createElement('span', {}, ['和']);
    applyStyles(andLabel, filterStyles.addLabel);
    andLabel.style.display = 'none'; // 默认隐藏

    // 范围筛选的最大值输入框
    this.valueInputMax = createElement('input', {
      type: 'text',
      placeholder: '最大值'
    }) as HTMLInputElement;
    applyStyles(this.valueInputMax, filterStyles.searchInput);
    this.valueInputMax.style.display = 'none'; // 默认隐藏

    // 将输入框和"和"字添加到容器中
    rangeInputContainer.appendChild(this.valueInput);
    rangeInputContainer.appendChild(andLabel);
    rangeInputContainer.appendChild(this.valueInputMax);

    // 将元素添加到容器中
    conditionContainer.appendChild(categoryLabel);
    conditionContainer.appendChild(this.categorySelect);
    conditionContainer.appendChild(operatorLabel);
    conditionContainer.appendChild(this.operatorSelect);
    conditionContainer.appendChild(valueLabel);
    conditionContainer.appendChild(rangeInputContainer);

    this.filterByConditionPanel.appendChild(conditionContainer);
    container.appendChild(this.filterByConditionPanel);

    // 默认隐藏
    this.hide();

    // 初始化操作符选项
    this.updateOperatorOptions();
    this.bindEvents();
  }

  /**
   * 绑定事件
   */
  private bindEvents(): void {
    // 输入框回车事件
    this.valueInput.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        this.applyFilter();
      }
    });

    // 最大值输入框回车事件
    this.valueInputMax.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        this.applyFilter();
      }
    });

    // 分类切换事件
    this.categorySelect.addEventListener('change', () => {
      this.handleCategoryChange();
    });

    // 操作符切换事件
    this.operatorSelect.addEventListener('change', () => {
      const selectedOperator = this.operatorSelect.value as FilterOperator;
      const andLabel = this.valueInput.nextElementSibling as HTMLElement;

      if (this.isRangeOperator(selectedOperator)) {
        this.valueInput.placeholder = '最小值';
        this.valueInputMax.style.display = 'inline-block';
        andLabel.style.display = 'inline-block';
      } else {
        this.valueInput.placeholder = '请输入筛选值';
        this.valueInputMax.style.display = 'none';
        andLabel.style.display = 'none';
      }
    });
  }

  /**
   * 显示筛选面板
   */
  show(): void {
    if (this.filterByConditionPanel) {
      this.filterByConditionPanel.style.display = 'block';
      this.loadCurrentFilterState();
    }
  }

  /**
   * 隐藏筛选面板
   */
  hide(): void {
    if (this.filterByConditionPanel) {
      this.filterByConditionPanel.style.display = 'none';
    }
  }
}
