// export const Group = 'group';
// export const Rect = 'rect';
// export const Text = 'text';

import type { ReactElement, ReactNode, Ref, JSXElementConstructor } from 'react';
import type { VRender } from '@visactor/vtable';

type IGraphic = VRender.IGraphic;
type IGroupGraphicAttribute = VRender.IGroupGraphicAttribute;
type ITextGraphicAttribute = VRender.ITextGraphicAttribute;
type IEventParamsType = VRender.IEventParamsType;
type IArcGraphicAttribute = VRender.IArcGraphicAttribute;
type ICircleGraphicAttribute = VRender.ICircleGraphicAttribute;
type IImageGraphicAttribute = VRender.IImageGraphicAttribute;
type ILineGraphicAttribute = VRender.ILineGraphicAttribute;
type IPathGraphicAttribute = VRender.IPathGraphicAttribute;
type IRectGraphicAttribute = VRender.IRectGraphicAttribute;
type ISymbolGraphicAttribute = VRender.ISymbolGraphicAttribute;
type IRichTextGraphicAttribute = VRender.IRichTextGraphicAttribute;
type IPolygonGraphicAttribute = VRender.IPolygonGraphicAttribute;

type GraphicProps<IGraphicGraphicAttribute> = {
  attribute: IGraphicGraphicAttribute;
  ref?: Ref<IGraphic>;
  children?: ReactNode;
} & IEventParamsType;

export const Group: (
  props: GraphicProps<IGroupGraphicAttribute>
) => ReactElement<GraphicProps<IGroupGraphicAttribute>, JSXElementConstructor<GraphicProps<IGroupGraphicAttribute>>> =
  'group' as any;

export const Text: (
  props: GraphicProps<ITextGraphicAttribute>
) => ReactElement<GraphicProps<ITextGraphicAttribute>, JSXElementConstructor<GraphicProps<ITextGraphicAttribute>>> =
  'text' as any;

export const Arc: (
  props: GraphicProps<IArcGraphicAttribute>
) => ReactElement<GraphicProps<IArcGraphicAttribute>, JSXElementConstructor<GraphicProps<IArcGraphicAttribute>>> =
  'arc' as any;

export const Circle: (
  props: GraphicProps<ICircleGraphicAttribute>
) => ReactElement<GraphicProps<ICircleGraphicAttribute>, JSXElementConstructor<GraphicProps<ICircleGraphicAttribute>>> =
  'circle' as any;

export const Image: (
  props: GraphicProps<IImageGraphicAttribute>
) => ReactElement<GraphicProps<IImageGraphicAttribute>, JSXElementConstructor<GraphicProps<IImageGraphicAttribute>>> =
  'image' as any;

export const Line: (
  props: GraphicProps<ILineGraphicAttribute>
) => ReactElement<GraphicProps<ILineGraphicAttribute>, JSXElementConstructor<GraphicProps<ILineGraphicAttribute>>> =
  'line' as any;

export const Path: (
  props: GraphicProps<IPathGraphicAttribute>
) => ReactElement<GraphicProps<IPathGraphicAttribute>, JSXElementConstructor<GraphicProps<IPathGraphicAttribute>>> =
  'path' as any;

export const Rect: (
  props: GraphicProps<IRectGraphicAttribute>
) => ReactElement<GraphicProps<IRectGraphicAttribute>, JSXElementConstructor<GraphicProps<IRectGraphicAttribute>>> =
  'rect' as any;

export const Symbol: (
  props: GraphicProps<ISymbolGraphicAttribute>
) => ReactElement<GraphicProps<ISymbolGraphicAttribute>, JSXElementConstructor<GraphicProps<ISymbolGraphicAttribute>>> =
  'symbol' as any;

export const RichText: (
  props: GraphicProps<IRichTextGraphicAttribute>
) => ReactElement<
  GraphicProps<IRichTextGraphicAttribute>,
  JSXElementConstructor<GraphicProps<IRichTextGraphicAttribute>>
> = 'richtext' as any;

export const Polygon: (
  props: GraphicProps<IPolygonGraphicAttribute>
) => ReactElement<
  GraphicProps<IPolygonGraphicAttribute>,
  JSXElementConstructor<GraphicProps<IPolygonGraphicAttribute>>
> = 'polygon' as any;
