import createDOMPurify from 'dompurify';

// 独立实例避免宿主的 setConfig 或 hooks 改写菜单的安全规则。
const purifier = createDOMPurify();

/** 将菜单图标限制为 HTTP(S) 图片或清洗后的静态 SVG，拒绝可执行内容与外部 SVG 引用。 */
export function createMenuIcon(source: string): SVGElement | HTMLImageElement | null {
  if (!source.trimStart().startsWith('<')) {
    try {
      const url = new URL(source);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return null;
      }
      const image = new Image();
      image.src = url.href;
      return image;
    } catch {
      return null;
    }
  }
  if (!purifier.isSupported) {
    return null;
  }
  const fragment = purifier.sanitize(source, {
    ALLOWED_TAGS: [
      'svg',
      'g',
      'path',
      'rect',
      'circle',
      'ellipse',
      'line',
      'polyline',
      'polygon',
      'defs',
      'linearGradient',
      'radialGradient',
      'stop',
      'clipPath',
      'mask',
      'title',
      'desc'
    ],
    ALLOWED_ATTR: [
      'xmlns',
      'viewBox',
      'width',
      'height',
      'x',
      'y',
      'x1',
      'x2',
      'y1',
      'y2',
      'cx',
      'cy',
      'r',
      'rx',
      'ry',
      'd',
      'points',
      'fill',
      'fill-rule',
      'fill-opacity',
      'stroke',
      'stroke-width',
      'stroke-linecap',
      'stroke-linejoin',
      'stroke-miterlimit',
      'stroke-dasharray',
      'stroke-dashoffset',
      'stroke-opacity',
      'opacity',
      'transform',
      'id',
      'clip-path',
      'clip-rule',
      'mask',
      'gradientUnits',
      'gradientTransform',
      'spreadMethod',
      'offset',
      'stop-color',
      'stop-opacity',
      'fx',
      'fy',
      'fr',
      'maskUnits',
      'maskContentUnits',
      'clipPathUnits',
      'preserveAspectRatio'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    RETURN_DOM_FRAGMENT: true
  });
  const svg = fragment.firstElementChild;
  if (svg?.localName !== 'svg' || svg.namespaceURI !== 'http://www.w3.org/2000/svg') {
    return null;
  }
  // DOMPurify 允许 SVG 颜色属性；额外限制 CSS URL、转义和变量，仅允许片段 URL。
  for (const element of [svg, ...Array.from(svg.querySelectorAll('*'))]) {
    for (const name of ['fill', 'stroke', 'clip-path', 'mask', 'stop-color']) {
      const value = element.getAttribute(name);
      if (value && /url\s*\(|var\s*\(|\\|\/\*/i.test(value) && !/^url\(#[\w.-]+\)$/.test(value)) {
        element.removeAttribute(name);
      }
    }
  }
  return svg as SVGElement;
}
