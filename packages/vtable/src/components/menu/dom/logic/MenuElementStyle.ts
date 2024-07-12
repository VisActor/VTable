import { Env } from '../../../../tools/env'; // 导入 Env 模块

interface StyleOptions {
  fontFamily?: string;
  fontSize?: string;
}

export function importStyle(options?: StyleOptions) {
  if (Env.mode === 'node') {
    // 如果当前环境是 Node.js，则直接返回
    return;
  }

  const fontFamily = options?.fontFamily || 'Roboto'; // 获取字体族，默认值为 'Roboto'
  const fontSize = options?.fontSize || '12px'; // 获取字体大小，默认值为 '12px'

  const styleElement = document.createElement('style'); // 创建一个 style 元素
  styleElement.id = 'vtable-styleSheet'; // 设置 style 元素的 id
  styleElement.textContent = `
    @keyframes vtable__menu-element--shown-animation { // 定义 CSS 动画
      0% {
        opacity: 0; // 初始透明度为 0
      }
      100% {
        opacity: 1; // 结束透明度为 1
      }
    }
    .vtable__menu-element {
      position: absolute; // 绝对定位
      box-sizing: border-box; // 盒子模型
      border-radius: 4px; // 边框圆角
      background-color: #ffffff; // 背景颜色为白色
      padding: 6px 0; // 内边距
      user-select: none; // 禁止用户选择文本
      color: #000; // 字体颜色为黑色
      max-width: 300px; // 最大宽度为 300px
      z-index: 99999; // 层叠顺序
      border: #CCC 0.5px solid; // 边框颜色及宽度
      cursor: default; // 默认鼠标指针
      width: max-content; // 宽度自适应内容
      box-shadow: 0px 8px 16px rgba(27, 31, 35, 0.12); // 盒子阴影
    }
    .vtable__menu-element--hidden {
      opacity: 0; // 设置透明度为 0
      transition: opacity 75ms linear; // 设置透明度变换过渡效果
      z-index: -9999; // 层叠顺序
    }
    .vtable__menu-element--shown {
      opacity: 1; // 设置透明度为 1
      animation: vtable__menu-element--shown-animation 300ms ease-out; // 应用动画，时间延长到 300ms
    }
    .vtable__menu-element__item {
      height: 32px; // 高度
      padding: 0px 12px; // 内边距
      cursor: pointer; // 鼠标指针为手型
      position: relative; // 相对定位
      display: flex; // 弹性布局
      align-items: center; // 项目居中对齐
      justify-content: flex-start; // 项目从左开始排列
    }
    .vtable__menu-element__item:hover {
      background-color: rgba(27, 31, 35, 0.06); // 背景颜色变化
    }
    .vtable__menu-element__icon {
      display: flex; // 弹性布局
      margin-right: 6px; // 右外边距
    }
    .vtable__menu-element__no-event {
      pointer-events: none; // 禁止鼠标事件
    }
    .vtable__menu-element--select {
      color: #2E68CF; // 选中项颜色
    }
    .vtable__menu-element--normal {
      color: rgba(20, 20, 20, 0.9); // 普通项颜色
    }
    .vtable__menu-element__split {
      height: 0px; // 高度
      border: 1px solid rgb(209, 213, 218); // 边框颜色及宽度
      margin: 5px 0; // 外边距
    }
    .vtable__menu-element__title {
      color: rgb(149, 149, 149); // 标题颜色
    }
    .vtable__menu-element__arrow {
      position: absolute; // 绝对定位
      right: 3px; // 右边距
      font-weight: bold; // 字体加粗
      margin-top: 1px; // 上外边距
    }
    .vtable__menu-element__item-text {
      margin-right: 15px; // 右外边距
    }
    .vtable__menu-element__content,
    .vtable__cell-content {
      font-family: ${fontFamily}; // 设置字体族
      font-size: ${fontSize}; // 设置字体大小
      overflow: hidden; // 内容溢出隐藏
      display: inline-block; // 行内块级元素
      line-height: 30px; // 行高
    }
  `;

  document.head.appendChild(styleElement); // 将 style 元素添加到 document 的 head 中
}
