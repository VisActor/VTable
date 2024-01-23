export {
  VGroup,
  VSymbol,
  VRect,
  VArc,
  VArea,
  VCircle,
  VGlyph,
  VImage,
  VLine,
  VPath,
  VPolygon,
  VText,
  jsx
} from '@src/vrender';
import type { TagAttributes } from '@visactor/vrender-components';
import { Tag } from '@visactor/vrender-components';

type IDefaultGraphicParamsType<T> = {
  attribute?: T;
};

export function VTag(params: IDefaultGraphicParamsType<TagAttributes>) {
  return new Tag(params ? params.attribute : {}) as any;
}
