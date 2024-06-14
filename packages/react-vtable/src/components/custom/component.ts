import type { ReactElement, ReactNode, Ref, JSXElementConstructor } from 'react';
import type { VRender } from '@visactor/vtable';
type IGraphic = VRender.IGraphic;
type TagAttributes = VRender.TagAttributes;
type IEventParamsType = VRender.IEventParamsType;

type GraphicProps<IGraphicGraphicAttribute> = {
  attribute: IGraphicGraphicAttribute;
  ref?: Ref<IGraphic>;
  children?: ReactNode;
} & IEventParamsType;

export const Tag: (
  props: GraphicProps<TagAttributes>
) => ReactElement<GraphicProps<TagAttributes>, JSXElementConstructor<GraphicProps<TagAttributes>>> = 'tag' as any;
