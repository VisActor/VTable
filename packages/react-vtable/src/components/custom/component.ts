import type { ReactElement, ReactNode, Ref, JSXElementConstructor } from 'react';
import type { VRender } from '@visactor/vtable';
type IGraphic = VRender.IGraphic;
type TagAttributes = VRender.TagAttributes;
type RadioAttributes = VRender.RadioAttributes;
type CheckboxAttributes = VRender.CheckboxAttributes;
type IEventParamsType = VRender.IEventParamsType;

type GraphicProps<IGraphicGraphicAttribute> = {
  attribute: IGraphicGraphicAttribute;
  ref?: Ref<IGraphic>;
  children?: ReactNode;
} & IEventParamsType;

export const Tag: (
  props: GraphicProps<TagAttributes>
) => ReactElement<GraphicProps<TagAttributes>, JSXElementConstructor<GraphicProps<TagAttributes>>> = 'tag' as any;

export const Radio: (
  props: GraphicProps<RadioAttributes>
) => ReactElement<GraphicProps<RadioAttributes>, JSXElementConstructor<GraphicProps<RadioAttributes>>> = 'radio' as any;

export const Checkbox: (
  props: GraphicProps<CheckboxAttributes>
) => ReactElement<GraphicProps<CheckboxAttributes>, JSXElementConstructor<GraphicProps<CheckboxAttributes>>> =
  'checkbox' as any;
