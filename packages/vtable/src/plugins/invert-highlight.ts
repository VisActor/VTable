import type { Group, Rect } from '@src/vrender';
import { isValid } from '@visactor/vutils';

export function onBeforeAttributeUpdateForInvertHighlight(val: Record<string, any>, attribute: any) {
  // @ts-ignore
  const graphic = this as any;
  if (graphic.shadowRoot && graphic.shadowRoot.childrenCount && (isValid(val.width) || isValid(val.height))) {
    const shadowRect = (graphic.shadowRoot as Group).findChildrenByName('shadow-rect')[0] as Rect;
    if (shadowRect) {
      shadowRect.setAttributes({
        width: val.width ?? shadowRect.attribute.width,
        height: val.height ?? shadowRect.attribute.height
      });
    }
  }
}
