/**
 * 右键菜单的样式定义
 */

export const MENU_CONTAINER_CLASS = 'vtable-context-menu-container';
export const MENU_ITEM_CLASS = 'vtable-context-menu-item';
export const MENU_ITEM_DISABLED_CLASS = 'vtable-context-menu-item-disabled';
export const MENU_ITEM_SEPARATOR_CLASS = 'vtable-context-menu-item-separator';
export const MENU_ITEM_SUBMENU_CLASS = 'vtable-context-menu-item-submenu';

export const MENU_STYLES = {
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    padding: '5px 0',
    zIndex: 1000,
    minWidth: '180px',
    maxHeight: '300px', // 设置最大高度
    overflowY: 'auto', // 添加垂直滚动
    fontSize: '12px'
  },
  menuItem: {
    padding: '6px 20px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  menuItemHover: {
    backgroundColor: '#f5f5f5'
  },
  menuItemDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  menuItemSeparator: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '5px 0'
  },
  menuItemIcon: {
    marginRight: '8px',
    width: '16px',
    height: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuItemText: {
    flex: 1
  },
  menuItemShortcut: {
    marginLeft: '20px',
    color: '#999',
    fontSize: '11px'
  },
  submenuArrow: {
    marginLeft: '5px',
    fontSize: '12px',
    color: '#666'
  },
  submenuContainer: {
    position: 'absolute',
    left: '100%',
    top: '0',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    padding: '5px 0',
    zIndex: 1001,
    minWidth: '180px',
    fontSize: '12px'
  },
  inputContainer: {
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center'
  },
  inputLabel: {
    marginRight: '8px',
    whiteSpace: 'nowrap'
  },
  inputField: {
    width: '60px',
    padding: '4px',
    border: '1px solid #ddd',
    borderRadius: '3px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '5px 12px'
  },
  button: {
    padding: '4px 8px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px'
  }
};

/**
 * 创建DOM元素
 */
export function createElement(tag: string, className?: string, styles?: Record<string, any>): HTMLElement {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (styles) {
    applyStyles(element, styles);
  }
  return element;
}

/**
 * 应用样式到元素
 */
export function applyStyles(element: HTMLElement, styles: Record<string, any>): void {
  Object.entries(styles).forEach(([key, value]) => {
    (element.style as any)[key] = value;
  });
}

/**
 * 创建图标元素
 */
export function createIcon(iconName: string): HTMLElement {
  const iconElement = createElement('span');

  // 根据图标名称设置不同的内容
  switch (iconName) {
    case 'copy':
      iconElement.innerHTML = '📋';
      break;
    case 'paste':
      iconElement.innerHTML = '📌';
      break;
    case 'cut':
      iconElement.innerHTML = '✂️';
      break;
    case 'delete':
      iconElement.innerHTML = '🗑️';
      break;
    case 'insert':
      iconElement.innerHTML = '➕';
      break;
    case 'sort':
      iconElement.innerHTML = '🔃';
      break;
    case 'merge':
      iconElement.innerHTML = '🔗';
      break;
    case 'protect':
      iconElement.innerHTML = '🔒';
      break;
    case 'hide':
      iconElement.innerHTML = '👁️';
      break;
    case 'freeze':
      iconElement.innerHTML = '❄️';
      break;
    case 'up-arrow':
      iconElement.innerHTML = '🔼';
      break;
    case 'down-arrow':
      iconElement.innerHTML = '🔽';
      break;
    case 'left-arrow':
      iconElement.innerHTML = '◀️';
      break;
    case 'right-arrow':
      iconElement.innerHTML = '▶️';
      break;
    default:
      iconElement.innerHTML = '•';
  }

  applyStyles(iconElement, MENU_STYLES.menuItemIcon);
  return iconElement;
}

/**
 * 创建带有数字输入框的菜单项
 */
export function createNumberInputItem(
  label: string,
  defaultValue: number = 1,
  iconName: string,
  callback: (value: number) => void
): HTMLElement {
  // 创建容器
  const container = createElement('div');
  applyStyles(container, MENU_STYLES.inputContainer);

  // 创建左侧图标容器

  // 添加图标
  if (iconName) {
    const icon = createIcon(iconName);
    container.appendChild(icon);
  }
  // 创建标签
  const labelElement = createElement('label');
  labelElement.textContent = label;
  applyStyles(labelElement, MENU_STYLES.inputLabel);
  container.appendChild(labelElement);

  // 创建输入框
  const input = createElement('input') as HTMLInputElement;
  input.type = 'number';
  input.min = '1';
  input.value = defaultValue.toString();
  applyStyles(input, MENU_STYLES.inputField);
  container.appendChild(input);
  // 创建包装容器
  const wrapper = createElement('div');
  wrapper.appendChild(container);

  return wrapper;
}
