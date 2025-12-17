import type { OperatorOption } from './types';
import { FilterOperatorCategory } from './types';

// 分类下拉选项
export const categories = [
  { value: FilterOperatorCategory.ALL, label: '全部' },
  { value: FilterOperatorCategory.TEXT, label: '文本' },
  { value: FilterOperatorCategory.NUMBER, label: '数值' },
  { value: FilterOperatorCategory.COLOR, label: '颜色' },
  { value: FilterOperatorCategory.CHECKBOX, label: '复选框' },
  { value: FilterOperatorCategory.RADIO, label: '单选框' }
];

// 按分类组织的操作符选项
export const operators: OperatorOption[] = [
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
