import type * as VTable from '@visactor/vtable';
import type { FilterStateManager } from './filter-state-manager';
import { applyStyles, filterStyles } from './styles';
import { FilterActionType } from './types';

/**
 * 按条件筛选组件
 */
export class ConditionFilter {
  private table: VTable.ListTable | VTable.PivotTable;
  private filterStateManager: FilterStateManager;
  private filterByConditionPanel: HTMLElement;
  private selectedField: string;

  constructor(table: VTable.ListTable | VTable.PivotTable, filterStateManager: FilterStateManager) {
    this.table = table;
    this.filterStateManager = filterStateManager;
  }

  setSelectedField(fieldId: string): void {
    this.selectedField = fieldId;
  }

  applyFilter(fieldId: string): void {
    this.filterStateManager.dispatch({
      type: FilterActionType.ADD_FILTER,
      payload: {
        id: fieldId
      }
    });

    this.hide();
  }

  clearFilter(fieldId: string): void {
    this.filterStateManager.dispatch({
      type: FilterActionType.REMOVE_FILTER,
      payload: {
        id: fieldId
      }
    });

    this.hide();
  }

  render(container: HTMLElement): void {
    // 按条件筛选面板（待开发功能）
    this.filterByConditionPanel = document.createElement('div');
    applyStyles(this.filterByConditionPanel, filterStyles.filterPanel);

    // 添加占位内容
    const placeholderText = document.createElement('p');
    placeholderText.textContent = '按条件筛选功能待开发。';
    applyStyles(placeholderText, {
      margin: '10px',
      color: '#999',
      textAlign: 'center'
    });

    this.filterByConditionPanel.appendChild(placeholderText);
    container.appendChild(this.filterByConditionPanel);

    // 默认隐藏
    this.hide();
  }

  show(): void {
    if (this.filterByConditionPanel) {
      this.filterByConditionPanel.style.display = 'block';
    }
  }

  hide(): void {
    if (this.filterByConditionPanel) {
      this.filterByConditionPanel.style.display = 'none';
    }
  }
}
