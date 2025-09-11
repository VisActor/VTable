import { Env } from '../tools/env';

export function importStyle() {
  if (Env.mode === 'node') {
    return;
  }
  const styleElement = document.createElement('style');
  styleElement.id = 'vtable-sheet-menu-styleSheet';
  styleElement.textContent = `
.vtable-sheet-main-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 30px;
  padding: 0;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  background-color: #fff;
  width: 50px;
  /* 内容居中 */
  justify-content: center;
  flex-shrink: 0; /* 防止菜单被压缩 */
}
.vtable-sheet-main-menu:hover {
  background-color: #f0f0f0;
}

.vtable-sheet-main-menu-button {
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
  height: 30px;
}

/* 菜单项容器 */
.vtable-sheet-main-menu-container {
  position: absolute;
  top: 100%; /* 显示在按钮下方 */
  left: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: none;
}

.vtable-sheet-main-menu-container.active {
  display: block;
}

/* 菜单项列表（ul） */
.vtable-sheet-main-menu-items {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  min-width: 80px;
  /* 删除以下两行 */
  /* max-height: 300px; */
  /* overflow-y: hidden; */
}

/* 当内容超出时显示滚动条 */
.vtable-sheet-main-menu-items.scrollable {
  overflow-y: auto;
}

/* 单个菜单项（li） */
.vtable-sheet-main-menu-item {
  padding: 6px 12px;
  margin: 0; /* 清除默认外边距 */
  line-height: 1.5; /* 统一行高 */
  cursor: pointer;
  white-space: nowrap;
  color: #333;                 /* 文字颜色 */
  font-size: 12px;             /* 字体大小 */
  transition: background 0.2s; /* 悬停动画 */
  
  /* 禁用文本选中 */
  user-select: none;
  -webkit-user-select: none;
}

/* 悬停和激活状态 */
.vtable-sheet-main-menu-item:hover,
.vtable-sheet-main-menu-item:focus {
  background-color: #f5f5f5;   /* 浅灰色背景 */
}

.vtable-sheet-main-menu-item:active {
  background-color: #e0e0e0;   /* 点击时深灰色 */
}

/* 分隔线（可选） */
.vtable-sheet-main-menu-item.divider {
  border-top: 1px solid #e0e0e0;
  margin: 4px 0;
  padding: 0;
  height: 1px;
  cursor: default;
}

.vtable-sheet-main-menu-item-has-children {
  position: relative;
}

.vtable-sheet-main-menu-item-has-children::after {
  content: '>';
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 10px;
}
/* 子菜单容器 */
.vtable-sheet-submenu-container {
  position: absolute;
  left: 100%; /* 默认向右展开 */
  top: 0;
  min-width: 120px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 200; /* 高于主菜单 */
  display: none;
}

/* 激活时显示 */
.vtable-sheet-main-menu-item:hover .vtable-sheet-submenu-container {
  display: block;
}

/* 子菜单项 */
.vtable-sheet-submenu-item {
  position: relative; /* 为箭头定位 */
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.vtable-sheet-submenu-item:hover {
  background: #f5f5f5;
}

/* 嵌套子菜单箭头 */
.submenu-arrow {
  position: absolute;
  right: 8px;
  font-size: 10px;
  color: #999;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .vtable-sheet-submenu-container {
    left: auto !important;
    right: 100%; /* 小屏幕改为向左展开 */
  }
}
`;

  document.head.appendChild(styleElement);
}
