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
import type { CheckboxAttributes, RadioAttributes, TagAttributes } from '@visactor/vrender-components';
import { Tag, CheckBox, Radio } from '@visactor/vrender-components';

type IDefaultGraphicParamsType<T> = {
  attribute?: T;
};

export function VTag(params: IDefaultGraphicParamsType<TagAttributes>) {
  return new Tag(params ? params.attribute : {}) as any;
}

export function VCheckBox(params: IDefaultGraphicParamsType<CheckboxAttributes>) {
  return new CheckBox(params ? params.attribute : {}) as any;
}

export function VRadio(params: IDefaultGraphicParamsType<RadioAttributes>) {
  return new Radio(params ? params.attribute : {}) as any;
}
