export function createDiv(container: HTMLElement = document.body): HTMLElement {
  const div = document.createElement('div');

  container.appendChild(div);

  return div;
}

export function createCanvas(container: HTMLElement = document.body, style?: CSSStyleSheet): HTMLCanvasElement {
  const canvas = document.createElement('canvas');

  container.appendChild(canvas);

  return canvas;
}

export function removeDom(dom: HTMLElement) {
  const parent = dom.parentNode;

  if (parent) {
    parent.removeChild(dom);
  }
}
