import { DataView } from '@visactor/vdataset';

export function isDataView(obj: any): obj is DataView {
  return obj instanceof DataView;
}

export function isHTMLElement(obj: any): obj is Element {
  try {
    return obj instanceof Element;
  } catch {
    // 跨端 plan B
    const htmlElementKeys: (keyof Element)[] = [
      'children',
      'innerHTML',
      'classList',
      'setAttribute',
      'tagName',
      'getBoundingClientRect'
    ];
    const keys = Object.keys(obj);
    return htmlElementKeys.every(key => keys.includes(key));
  }
}
