export function createElement(tagName: string, classNames?: string[]): HTMLElement {
  const element = document.createElement(tagName);
  if (classNames) {
    element.classList.add(...classNames);
  }
  return element;
}
