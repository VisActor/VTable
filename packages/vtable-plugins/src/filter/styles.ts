/**
 * 筛选组件样式定义
 */
export const filterStyles = {
  // 筛选菜单
  filterMenu: {
    display: 'none',
    position: 'absolute',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    zIndex: '100'
  },

  // 筛选面板
  filterPanel: {
    padding: '10px',
    display: 'block'
  },

  // 搜索容器
  searchContainer: {
    padding: '5px'
  },

  // 搜索输入框
  searchInput: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },

  // 选项容器
  optionsContainer: {
    maxHeight: '200px',
    overflowY: 'auto',
    marginTop: '10px'
  },

  // 筛选选项项
  optionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 5px'
  },

  // 筛选选项标签
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    flexGrow: '1',
    fontWeight: 'normal'
  },

  // 复选框
  checkbox: {
    marginRight: '10px'
  },

  // 计数标签
  countSpan: {
    color: '#888',
    fontSize: '12px'
  },

  // 标签容器
  tabsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    borderBottom: '1px solid #e0e0e0'
  },

  // 标签样式
  tabStyle: (isActive: boolean) => ({
    backgroundColor: 'transparent',
    border: 'none',
    flex: '1',
    padding: '10px 15px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#007bff' : '#666',
    borderBottom: isActive ? '3px solid #007bff' : '2px solid transparent'
  }),

  // 页脚容器
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f8f9fa'
  },

  footerButton: (isPrimary: boolean) => ({
    padding: '6px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '5px',
    backgroundColor: isPrimary ? '#007bff' : 'white',
    color: isPrimary ? 'white' : '#333',
    borderColor: isPrimary ? '#007bff' : '#ccc'
  }),

  // 清除链接
  clearLink: {
    color: '#007bff',
    textDecoration: 'none'
  },

  // 按钮样式
  buttonStyle: (isPrimary: boolean = false) => ({
    padding: '6px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '5px',
    backgroundColor: isPrimary ? '#007bff' : 'white',
    color: isPrimary ? 'white' : '#333',
    borderColor: isPrimary ? '#007bff' : '#ccc'
  }),

  // === 条件筛选相关样式 ===

  // 条件筛选容器
  conditionContainer: {
    marginBottom: '15px',
    padding: '10px'
  },

  // 表单标签样式
  formLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold'
  },

  // 操作符选择框样式
  operatorSelect: {
    width: '100%',
    padding: '8px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },

  rangeInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  addLabel: {
    display: 'none',
    padding: '0 5px'
  }
};

/**
 * 应用样式到DOM元素
 */
export function applyStyles(element: HTMLElement, styles: Record<string, string>) {
  Object.entries(styles).forEach(([prop, value]) => {
    element.style[prop as any] = value;
  });
}

/**
 * 创建DOM元素的辅助函数
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Record<string, string> = {},
  children: (HTMLElement | string)[] = []
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}
