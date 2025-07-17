import type * as VTable from '@visactor/vtable';
import type { FilterStateManager } from './filter-state-manager';
import { applyStyles, filterStyles, createElement } from './styles';
import type { FilterOperator } from './types';
import { FilterActionType, ColumnDefinition } from './types';

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
  private columnType: string = 'string'; // 默认为字符串类型

  // 不同数据类型支持的操作符
  private operatorsByType: Record<string, { value: FilterOperator; label: string }[]> = {
    string: [
      { value: 'equals', label: '等于' },
      { value: 'notEquals', label: '不等于' },
      { value: 'contains', label: '包含' },
      { value: 'startsWith', label: '开头是' },
      { value: 'endsWith', label: '结尾是' }
    ],
    number: [
      { value: 'equals', label: '等于' },
      { value: 'notEquals', label: '不等于' },
      { value: 'greaterThan', label: '大于' },
      { value: 'lessThan', label: '小于' },
      { value: 'greaterThanOrEqual', label: '大于等于' },
      { value: 'lessThanOrEqual', label: '小于等于' }
    ],
    boolean: [
      { value: 'equals', label: '等于' },
      { value: 'notEquals', label: '不等于' }
    ],
    date: [
      { value: 'equals', label: '等于' },
      { value: 'notEquals', label: '不等于' },
      { value: 'greaterThan', label: '晚于' },
      { value: 'lessThan', label: '早于' },
      { value: 'greaterThanOrEqual', label: '不早于' },
      { value: 'lessThanOrEqual', label: '不晚于' }
    ]
  };

  constructor(table: VTable.ListTable | VTable.PivotTable, filterStateManager: FilterStateManager) {
    this.table = table;
    this.filterStateManager = filterStateManager;
  }

  setSelectedField(fieldId: string): void {
    this.selectedField = fieldId;
    this.detectColumnType(fieldId);
    this.updateOperatorOptions();
    this.loadCurrentFilterState();
  }

  /**
   * 检测当前列的数据类型
   */
  private detectColumnType(fieldId: string): void {
    // 因为配置中没有指定类型，因此尝试从数据中推断
    const records = this.table.internalProps.dataSource.source || [];
    if (records.length > 0 && Array.isArray(records)) {
      // TODO: 待优化，需要进一步调研
      const firstRecord = records[0];
      const value = firstRecord[fieldId];

      if (value instanceof Date) {
        this.columnType = 'date';
      } else if (typeof value === 'number') {
        this.columnType = 'number';
      } else if (typeof value === 'boolean') {
        this.columnType = 'boolean';
      } else {
        this.columnType = 'string';
      }
    }
  }

  /**
   * 渲染操作符下拉选项
   */
  private updateOperatorOptions(): void {
    if (!this.operatorSelect) {
      return;
    }

    // 清空现有选项
    this.operatorSelect.innerHTML = '';

    // 添加新选项
    const operators = this.operatorsByType[this.columnType] || this.operatorsByType.string;
    operators.forEach(op => {
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
        if (this.columnType === 'date' && filter.condition instanceof Date) {
          // 日期类型需要格式化为YYYY-MM-DD格式
          const date = filter.condition;
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          this.valueInput.value = `${year}-${month}-${day}`;
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
   * 应用筛选条件
   */
  applyFilter(fieldId: string = this.selectedField): void {
    const operator = this.operatorSelect?.value as FilterOperator;
    let conditionValue: any = this.valueInput?.value;

    // 根据列类型转换输入值
    if (this.columnType === 'number') {
      conditionValue = parseFloat(conditionValue);
      if (isNaN(conditionValue)) {
        console.warn('请输入有效的数字');
        return;
      }
    } else if (this.columnType === 'boolean') {
      if (conditionValue.toLowerCase() === 'true') {
        conditionValue = true;
      } else if (conditionValue.toLowerCase() === 'false') {
        conditionValue = false;
      } else {
        console.warn('请输入true或false');
        return;
      }
    } else if (this.columnType === 'date') {
      try {
        conditionValue = new Date(conditionValue);
        if (isNaN(conditionValue.getTime())) {
          console.warn('请输入有效的日期');
          return;
        }
      } catch (e) {
        console.warn('请输入有效的日期');
        return;
      }
    }

    if (!conditionValue && conditionValue !== false && conditionValue !== 0) {
      // 未输入条件值，移除筛选
      this.clearFilter(fieldId);
      return;
    }

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
    // 创建按条件筛选面板
    this.filterByConditionPanel = document.createElement('div');
    applyStyles(this.filterByConditionPanel, filterStyles.filterPanel);

    // 创建条件选择区域
    const conditionContainer = document.createElement('div');
    applyStyles(conditionContainer, filterStyles.conditionContainer);

    // 创建操作符选择下拉框
    const operatorLabel = createElement('label', {}, ['筛选条件：']);
    applyStyles(operatorLabel, filterStyles.formLabel);

    this.operatorSelect = createElement('select') as HTMLSelectElement;
    applyStyles(this.operatorSelect, filterStyles.operatorSelect);

    // 添加操作符选项 (在setSelectedField中会更新)

    // 创建条件值输入框
    const valueLabel = createElement('label', {}, ['筛选值：']);
    applyStyles(valueLabel, filterStyles.formLabel);

    this.valueInput = createElement('input', {
      type: 'text',
      placeholder: '请输入筛选值'
    }) as HTMLInputElement;

    applyStyles(this.valueInput, filterStyles.searchInput);

    // 将元素添加到容器中
    conditionContainer.appendChild(operatorLabel);
    conditionContainer.appendChild(this.operatorSelect);
    conditionContainer.appendChild(valueLabel);
    conditionContainer.appendChild(this.valueInput);

    this.filterByConditionPanel.appendChild(conditionContainer);
    container.appendChild(this.filterByConditionPanel);

    // 默认隐藏
    this.hide();

    // 绑定事件
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
  }

  /**
   * 显示筛选面板
   */
  show(): void {
    if (this.filterByConditionPanel) {
      this.filterByConditionPanel.style.display = 'block';
      // 加载当前筛选状态
      this.loadCurrentFilterState();
      // 聚焦到输入框
      setTimeout(() => this.valueInput.focus(), 0);
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
