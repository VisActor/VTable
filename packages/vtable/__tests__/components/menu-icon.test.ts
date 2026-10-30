import DOMPurify from 'dompurify';
import { execFileSync } from 'child_process';
import path from 'path';
import { createMenuIcon } from '../../src/components/menu/dom/logic/menu-icon';

describe('菜单图标安全边界', () => {
  test('保留静态 SVG 的颜色、尺寸和渐变引用', () => {
    // 合法图标应保持外观需要的属性，并保留片段引用。
    const icon = createMenuIcon(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><defs>' +
        '<linearGradient id="menu-gradient"><stop offset="0" stop-color="#123456"/></linearGradient>' +
        '</defs><path d="M0 0L16 16" fill="url(#menu-gradient)" stroke="currentColor"/></svg>'
    );
    expect(icon.getAttribute('viewBox')).toBe('0 0 16 16');
    expect(icon.querySelector('linearGradient')).not.toBeNull();
    expect(icon.querySelector('path').getAttribute('fill')).toBe('url(#menu-gradient)');
    expect(icon.querySelector('path').getAttribute('stroke')).toBe('currentColor');
  });

  test('移除脚本、事件、HTML、样式、动画和链接', () => {
    // 用多个可执行入口验证严格白名单，而非仅针对报告中的 img 载荷。
    const icon = createMenuIcon(
      '<svg xmlns="http://www.w3.org/2000/svg" onload="window.__menuXss=1">' +
        '<script>window.__menuXss=1</script><style>body{display:none}</style>' +
        '<foreignObject><img src="/missing-menu-image" onerror="window.__menuXss=1"/></foreignObject>' +
        '<a href="javascript:window.__menuXss=1"><text>link</text></a>' +
        '<use href="https://example.invalid/icon.svg#x"/>' +
        '<path style="fill:red" onclick="window.__menuXss=1" d="M0 0L1 1">' +
        '<animate attributeName="fill" values="red;blue"/></path></svg>'
    );
    expect(icon.localName).toBe('svg');
    expect(icon.querySelector('script,style,foreignObject,img,a,use,animate')).toBeNull();
    expect(icon.querySelector('[onload],[onclick],[style],[href]')).toBeNull();
    expect(icon.hasAttribute('onload')).toBe(false);
    expect(icon.querySelector('path')).not.toBeNull();
  });

  test.each([
    'url(https://example.invalid/x)',
    'u\\72l(https://example.invalid/x)',
    'url(/*comment*/https://example.invalid/x)',
    'var(--external-paint)'
  ])('移除外部颜色引用 %s', value => {
    // SVG 颜色属性也不能借 CSS 引用加载外部内容。
    const icon = createMenuIcon(`<svg xmlns="http://www.w3.org/2000/svg"><path fill="${value}"/></svg>`);
    expect(icon.querySelector('path').hasAttribute('fill')).toBe(false);
  });

  test.each([
    '',
    '<script>window.__menuXss=1</script>',
    '<img src=x onerror="window.__menuXss=1">',
    'javascript:window.__menuXss=1',
    'data:image/svg+xml,<svg onload="window.__menuXss=1"/>',
    'file:///tmp/icon.svg',
    'ftp://example.invalid/icon.svg'
  ])('非法或空图标不插入 DOM：%s', source => {
    // 被完全清除的图标必须安全省略，不能因设置尺寸而抛错。
    expect(createMenuIcon(source)).toBeNull();
  });

  test('URL 使用图片属性赋值，不能闭合为事件属性', () => {
    // 不拼接 HTML，即使 URL 包含引号也不会创建 onerror 属性。
    const icon = createMenuIcon('https://example.invalid/icon.svg?x=" onerror="window.__menuXss=1');
    expect(icon.localName).toBe('img');
    expect(icon.hasAttribute('onerror')).toBe(false);
  });

  test('清洗器不受支持时拒绝原始 SVG', () => {
    // 在真实的无 DOM 子进程中加载源码，兼顾 SSR 导入及不支持清洗时的安全降级。
    execFileSync(
      process.execPath,
      [
        '-r',
        'ts-node/register/transpile-only',
        '-e',
        `
      const assert = require('assert');
      const { createMenuIcon } = require('./src/components/menu/dom/logic/menu-icon');
      assert.strictEqual(typeof window, 'undefined');
      assert.strictEqual(createMenuIcon('<svg xmlns="http://www.w3.org/2000/svg"/>'), null);
    `
      ],
      {
        cwd: path.resolve(__dirname, '../..'),
        env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', TS_NODE_COMPILER_OPTIONS: '{"module":"commonjs"}' },
        timeout: 15000
      }
    );
  });

  test('宿主 DOMPurify 配置和 hooks 不能修改菜单清洗规则', () => {
    // 使用者可能为其他内容放宽策略，菜单必须始终使用自己的实例。
    DOMPurify.setConfig({ ADD_TAGS: ['script'], ADD_ATTR: ['onload'], RETURN_DOM_FRAGMENT: true });
    DOMPurify.addHook('afterSanitizeAttributes', node => node.setAttribute('onload', 'window.__menuXss=1'));
    try {
      const icon = createMenuIcon(
        '<svg xmlns="http://www.w3.org/2000/svg" onload="window.__menuXss=1">' +
          '<script>window.__menuXss=1</script><path d="M0 0L1 1"/></svg>'
      );
      expect(icon.localName).toBe('svg');
      expect(icon.hasAttribute('onload')).toBe(false);
      expect(icon.querySelector('script,[onload]')).toBeNull();
    } finally {
      DOMPurify.clearConfig();
      DOMPurify.removeAllHooks();
    }
  });
});
