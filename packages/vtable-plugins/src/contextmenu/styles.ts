import { isArray } from '@visactor/vutils';
/**
 * 右键菜单的样式定义
 */

import type { ClassName, MenuItem, MenuItemClassConfig, MenuItemIcon, SvgIconConfig } from './types';

export type MenuStyleDef = { [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] };
export type MenuStyles = typeof MENU_STYLES;
export type MenuClasses = typeof MENU_CLASSES;
export type CustomMenuAttributions = {
  style?: { [K in keyof MenuStyles]?: Partial<MenuStyles[K]> };
  class?: { [K in keyof MenuClasses]?: Partial<MenuClasses[K]> };
};

export const MENU_STYLES = {
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    padding: '5px 0',
    zIndex: '1000',
    minWidth: '180px',
    maxHeight: '300px', // 设置最大高度
    overflowY: 'auto', // 添加垂直滚动
    fontSize: '12px'
  } as MenuStyleDef,
  menuItem: {
    padding: '6px 20px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  } as MenuStyleDef,
  menuItemHover: {
    backgroundColor: '#f5f5f5'
  } as MenuStyleDef,
  menuItemDisabled: {
    opacity: '0.5',
    cursor: 'not-allowed'
  } as MenuStyleDef,
  menuItemSeparator: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '5px 0'
  } as MenuStyleDef,
  menuItemIcon: {
    marginRight: '8px',
    width: '16px',
    height: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as MenuStyleDef,
  menuItemText: {
    flex: '1'
  } as MenuStyleDef,
  menuItemShortcut: {
    marginLeft: '20px',
    color: '#999',
    fontSize: '11px'
  } as MenuStyleDef,
  submenuArrow: {
    marginLeft: '5px',
    fontSize: '12px',
    color: '#666'
  } as MenuStyleDef,
  submenuContainer: {
    position: 'absolute',
    left: '100%',
    top: '0',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    padding: '5px 0',
    zIndex: '1001',
    minWidth: '180px',
    fontSize: '12px'
  } as MenuStyleDef,
  inputContainer: {
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center'
  } as MenuStyleDef,
  inputLabel: {
    marginRight: '8px',
    whiteSpace: 'nowrap'
  } as MenuStyleDef,
  inputField: {
    width: '60px',
    padding: '4px',
    border: '1px solid #ddd',
    borderRadius: '3px'
  } as MenuStyleDef,
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '5px 12px'
  } as MenuStyleDef,
  button: {
    padding: '4px 8px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px'
  } as MenuStyleDef
};

export const MENU_CLASSES = {
  menuContainer: 'vtable-context-menu-container' as ClassName,
  submenuContainer: 'vtable-context-submenu-container' as ClassName,
  menuItem: 'vtable-context-menu-item' as ClassName,
  menuItemSeparator: 'vtable-context-menu-item-separator' as ClassName,
  menuItemSubmenu: 'vtable-context-menu-item-submenu' as ClassName,
  menuItemDisabled: 'vtable-context-menu-item-disabled' as ClassName
};

/**
 * 移除用户传入的 SVG 中可能的危险元素和属性
 */
const DANGEROUS_SVG_ELEMENTS = new Set([
  'script',
  'iframe',
  'object',
  'embed',
  'form',
  'input',
  'textarea',
  'select',
  'button'
]);
const DANGEROUS_ATTR_PREFIXES = ['on'];
const DANGEROUS_URL_ATTRS = new Set(['href', 'xlink:href']);

export function sanitizeSvg(svgString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    return '';
  }
  const svg = doc.documentElement;
  if (svg.tagName.toLowerCase() !== 'svg') {
    return '';
  }
  sanitizeNode(svg);
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
}

function sanitizeNode(node: Element): void {
  const children = Array.from(node.children);
  for (const child of children) {
    if (DANGEROUS_SVG_ELEMENTS.has(child.tagName.toLowerCase())) {
      node.removeChild(child);
    } else {
      sanitizeNode(child);
    }
  }

  const attrs = Array.from(node.attributes);
  for (const attr of attrs) {
    const name = attr.name.toLowerCase();
    if (DANGEROUS_ATTR_PREFIXES.some(prefix => name.startsWith(prefix))) {
      node.removeAttribute(attr.name);
      continue;
    }
    if (DANGEROUS_URL_ATTRS.has(name)) {
      const value = attr.value.trim().toLowerCase();
      if (value.startsWith('javascript:') || value.startsWith('data:')) {
        node.removeAttribute(attr.name);
      }
    }
  }
}

/**
 * 合并用户自定义样式与默认样式
 */
export function mergeStyles(styles?: Partial<MenuStyles>): MenuStyles {
  if (!styles) {
    return { ...MENU_STYLES };
  }
  const result: any = {};
  for (const _key in MENU_STYLES) {
    const key = _key as keyof MenuStyles;
    if (styles[key]) {
      result[key] = { ...MENU_STYLES[key], ...styles[key] };
    } else {
      result[key] = { ...MENU_STYLES[key] };
    }
  }
  return result as MenuStyles;
}

/**
 * 合并用户自定义类名与默认类名
 */
export function mergeClasses(classes?: Partial<MenuClasses>): MenuClasses {
  if (!classes) {
    return { ...MENU_CLASSES };
  }
  const result: any = {};
  for (const _key in MENU_CLASSES) {
    const key = _key as keyof MenuClasses;
    if (classes[key]) {
      result[key] = `${MENU_CLASSES[key]} ${normalizeClassName(classes[key]).join(' ')}`;
    } else {
      result[key] = MENU_CLASSES[key];
    }
  }
  return result as MenuClasses;
}

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
export function applyStyles(
  element: HTMLElement,
  styles: { [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] }
): void {
  for (const key in styles) {
    const value = styles[key];
    if (value !== undefined) {
      element.style[key] = value;
    }
  }
}

/**
 * 创建图标元素
 */
export function createIcon(
  icon: MenuItemIcon,
  menuItem?: MenuItem,
  iconStyles: MenuStyleDef = MENU_STYLES.menuItemIcon
): HTMLElement {
  // 自定义渲染
  if (typeof icon === 'function') {
    const element = icon(menuItem!);
    applyStyles(element, iconStyles);
    return element;
  }

  // SVG 配置
  if (typeof icon === 'object' && 'svg' in icon) {
    const svgConfig = icon as SvgIconConfig;
    const iconElement = createElement('span');
    const safeSvg = sanitizeSvg(svgConfig.svg);
    if (safeSvg) {
      iconElement.innerHTML = safeSvg;
      const svgEl = iconElement.querySelector('svg');
      if (svgEl) {
        if (svgConfig.width !== undefined) {
          svgEl.setAttribute('width', String(svgConfig.width));
        }
        if (svgConfig.height !== undefined) {
          svgEl.setAttribute('height', String(svgConfig.height));
        }
      }
    }
    applyStyles(iconElement, iconStyles);
    return iconElement;
  }

  const iconName = icon as string;
  const iconElement = createElement('span');

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
    // case 'merge':
    //   iconElement.innerHTML = ;
    //   break;
    // case 'unmerge':
    //   iconElement.innerHTML = ;
    //   break;
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

  applyStyles(iconElement, iconStyles);
  return iconElement;
}

/**
 * 创建带有数字输入框的菜单项
 */
export function createNumberInputItem(
  label: string,
  defaultValue: number = 1,
  icon: MenuItemIcon | undefined,
  callback: (value: number) => void,
  styles: MenuStyles = MENU_STYLES
): HTMLElement {
  // 创建容器
  const container = createElement('div');
  applyStyles(container, styles.inputContainer);

  // 创建左侧图标容器

  // 添加图标
  if (icon) {
    const iconEl = createIcon(icon, undefined, styles.menuItemIcon);
    container.appendChild(iconEl);
  }
  // 创建标签
  const labelElement = createElement('label');
  labelElement.textContent = label;
  applyStyles(labelElement, styles.inputLabel);
  container.appendChild(labelElement);

  // 创建输入框
  const input = createElement('input') as HTMLInputElement;
  input.type = 'number';
  input.min = '1';
  input.value = defaultValue.toString();
  applyStyles(input, styles.inputField);
  container.appendChild(input);
  // 创建包装容器
  const wrapper = createElement('div');
  wrapper.appendChild(container);

  return wrapper;
}

/**
 * 格式化用户传入的类名配置
 */
export function normalizeItemClassNameConfig(classNames?: MenuItemClassConfig) {
  const normalized: MenuItemClassConfig = {};
  if (classNames) {
    Object.keys(classNames).forEach(item => {
      const className = classNames[item as keyof MenuItemClassConfig];
      if (className) {
        normalized[item as keyof MenuItemClassConfig] = normalizeClassName(className);
      }
    });
  }
  return normalized;
}

/**
 * 格式化类名，将类名统一转为数组
 */
export function normalizeClassName(className: ClassName): string[] {
  if (!className) {
    return [];
  }
  return isArray(className) ? className : className.split(' ').filter(Boolean);
}
