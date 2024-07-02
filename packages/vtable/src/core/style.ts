import { Env } from '../tools/env';

interface MenuStyleOptions {
  fontFamily?: string; // 字体样式
  fontSize?: string; // 字体大小
}

/**
 * 动态导入样式表到文档头部，可选地设置字体和字体大小。
 * @param options 可选的样式选项，包括 fontFamily 和 fontSize。
 */
export function importStyle(options?: MenuStyleOptions) {
  // 在Node环境下不执行样式导入
  if (Env.mode === 'node') {
    return;
  }

  // 解构选项参数，提取 fontFamily 和 fontSize，如果不存在则使用默认值
  const { fontFamily = 'Roboto', fontSize = '12px' } = options || {};

  // CSS样式内容
  const styleContent = `
    @keyframes vtable__menu-element--shown-animation {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    /* 主样式类 */
    .vtable__menu-element {
      position: absolute;
      box-sizing: border-box;
      border-radius: 4px;
      background-color: #fff;
      padding: 6px 0;
      user-select: none;
      color: #000;
      max-width: 300px;
      z-index: 99999;
      border: #CCC 0.5px solid;
      cursor: default;
      width: max-content;
      box-shadow: 0px 8px 16px rgba(27, 31, 35, 0.12);
      font-family: ${fontFamily};
      font-size: ${fontSize};
    }

    /* 隐藏状态样式 */
    .vtable__menu-element--hidden {
      opacity: 0;
      transition: opacity 75ms linear;
      z-index: -9999;
    }

    /* 显示状态样式 */
    .vtable__menu-element--shown {
      opacity: 1;
      animation: vtable__menu-element--shown-animation 150ms ease-out;
    }

    /* 内容区样式 */
    .vtable__menu-element__content {
      font-family: ${fontFamily};
      font-size: ${fontSize};
      overflow: hidden;
      display: inline-block;
      line-height: 30px;
    }

    /* 单个菜单项样式 */
    .vtable__menu-element__item {
      height: 32px;
      padding: 0px 12px;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    /* 鼠标悬停样式 */
    .vtable__menu-element__item:hover {
      background-color: rgba(27, 31, 35, 0.06);
    }

    /* 菜单项图标样式 */
    .vtable__menu-element__icon {
      display: flex;
      margin-right: 6px;
    }

    /* 无事件样式 */
    .vtable__menu-element__no-event {
      pointer-events: none;
    }

    /* 选中状态样式 */
    .vtable__menu-element--select {
      color: #2E68CF;
    }

    /* 正常状态样式 */
    .vtable__menu-element--normal {
      color: rgba(20, 20, 20, 0.9);
    }

    /* 分隔线样式 */
    .vtable__menu-element__split {
      height: 0px;
      border: 1px solid rgb(209, 213, 218);
      margin: 5px 0;
    }

    /* 标题样式 */
    .vtable__menu-element__title {
      color: rgb(149, 149, 149);
    }

    /* 箭头图标样式 */
    .vtable__menu-element__arrow {
      position: absolute;
      right: 3px;
      font-weight: bold;
      margin-top: 1px;
    }

    /* 菜单项文本样式 */
    .vtable__menu-element__item-text {
      margin-right: 15px;
    }
  `;

  // 创建一个新的<style>元素并设置其内容为上面定义的样式内容
  const styleElement = document.createElement('style');
  styleElement.id = 'vtable-menu-styleSheet';
  styleElement.textContent = styleContent;

  // 将<style>元素添加到文档头部
  document.head.appendChild(styleElement);
}
