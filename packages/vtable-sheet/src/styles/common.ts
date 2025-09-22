import { Env } from '../tools/env';

export function importStyle() {
  if (Env.mode === 'node') {
    return;
  }
  const styleElement = document.createElement('style');
  styleElement.id = 'vtable-sheet-common-styleSheet';
  styleElement.textContent = `
/* 通用样式和变量 */
:root {
  --border-color: #e0e0e0;
  --primary-color: #1a73e8;
  --hover-color: #f5f5f5;
  --active-color: #e8f0fe;
  --text-color: #333;
  --gray-text: #666;
  --light-gray: #f8f8f8;
  --toolbar-height: 28px;
  --tab-height: 28px;

  /* 基础颜色 */
  --primary-color-light: #e8f0fe;
  --secondary-color: #4285f4;
  --success-color: #1e8e3e;
  --warning-color: #ffa000;
  --danger-color: #d93025;
  --info-color: #1a73e8;

  /* 中性色 */
  --black: #000;
  --gray-900: #212121;
  --gray-800: #424242;
  --gray-700: #616161;
  --gray-600: #757575;
  --gray-500: #9e9e9e;
  --gray-400: #bdbdbd;
  --gray-300: #e0e0e0;
  --gray-200: #eeeeee;
  --gray-100: #f5f5f5;
  --gray-50: #fafafa;
  --white: #fff;

  /* 文本颜色 */
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-700);
  --text-tertiary: var(--gray-500);
  --text-disabled: var(--gray-400);
  --text-inverse: var(--white);

  /* 边框颜色 */
  --border-color-light: var(--gray-200);
  --border-color-dark: var(--gray-400);

  /* 背景颜色 */
  --bg-default: var(--white);
  --bg-secondary: var(--gray-100);
  --bg-tertiary: var(--gray-200);
  --bg-selected: var(--primary-color-light);
  --bg-hover: var(--gray-100);

  /* 阴影 */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* 尺寸 */
  --formula-bar-height: 30px;
  --icon-size-small: 16px;
  --icon-size-medium: 20px;
  --icon-size-large: 24px;

  /* 字体 */
  --font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --font-family-mono: 'Roboto Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;

  /* 边框圆角 */
  --border-radius-sm: 2px;
  --border-radius-md: 4px;
  --border-radius-lg: 8px;
  --border-radius-full: 999px;

  /* 过渡时间 */
  --transition-fast: 0.1s;
  --transition-normal: 0.2s;
  --transition-slow: 0.3s;
}

/* 统一的文本与选择 */
.vtable-sheet-noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.vtable-sheet-allow-select {
  -webkit-touch-callout: text;
  -webkit-user-select: text;
  -khtml-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

/* 通用样式 */
.vtable-sheet-flex {
  display: flex;
}

.vtable-sheet-flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vtable-sheet-flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vtable-sheet-flex-end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.vtable-sheet-flex-column {
  display: flex;
  flex-direction: column;
}

.vtable-sheet-flex-1 {
  flex: 1;
}

.vtable-sheet-flex-grow-0 {
  flex-grow: 0;
}

.vtable-sheet-flex-shrink-0 {
  flex-shrink: 0;
}

.vtable-sheet-hidden {
  display: none !important;
}

.vtable-sheet-invisible {
  visibility: hidden !important;
}

.vtable-sheet-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 图标样式 */
.vtable-sheet-icon {
  width: var(--icon-size-medium);
  height: var(--icon-size-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-700);
}

.vtable-sheet-icon-sm {
  width: var(--icon-size-small);
  height: var(--icon-size-small);
}

.vtable-sheet-icon-lg {
  width: var(--icon-size-large);
  height: var(--icon-size-large);
}

/* 按钮样式 */
.vtable-sheet-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  background-color: var(--bg-default);
  color: var(--text-secondary);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: var(--font-family-sans);
  font-size: 13px;
  line-height: 1.5;
}

.vtable-sheet-button:hover {
  background-color: var(--bg-hover);
}

.vtable-sheet-button:active {
  background-color: var(--bg-tertiary);
}

.vtable-sheet-button-primary {
  background-color: var(--primary-color);
  color: var(--white);
  border-color: var(--primary-color);
}

.vtable-sheet-button-primary:hover {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.vtable-sheet-button-icon {
  padding: var(--spacing-xs);
  border: none;
  background: transparent;
}

.vtable-sheet-button-icon:hover {
  background-color: var(--bg-hover);
}

/* 工具提示 */
.vtable-sheet-tooltip {
  position: relative;
}

.vtable-sheet-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background-color: var(--gray-900);
  color: var(--white);
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-normal), visibility var(--transition-normal);
  z-index: 1000;
}

.vtable-sheet-tooltip:hover::after {
  opacity: 1;
  visibility: visible;
}

/* 输入框样式 */
.vtable-sheet-input {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-family: var(--font-family-sans);
  font-size: 13px;
  outline: none;
  transition: border-color var(--transition-normal);
}

.vtable-sheet-input:focus {
  border-color: var(--primary-color);
}

/* 动画和过渡 */
.vtable-sheet-fade-in {
  animation: vtable-sheet-fade-in var(--transition-normal) ease-in-out;
}

@keyframes vtable-sheet-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.vtable-sheet-fade-out {
  animation: vtable-sheet-fade-out var(--transition-normal) ease-in-out;
}

@keyframes vtable-sheet-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* 滚动条样式 */
.vtable-sheet-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--gray-400) transparent;
}

.vtable-sheet-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.vtable-sheet-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.vtable-sheet-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--gray-400);
  border-radius: 4px;
}

.vtable-sheet-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--gray-500);
} 
`;

  document.head.appendChild(styleElement);
}
