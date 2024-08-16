import type { ReactElement, JSXElementConstructor } from 'react';
import type { Tag as VTag, TagAttributes } from '@visactor/vtable/es/vrender';
import type { GraphicProps } from './type';

// component from vrender-component
export const Tag: (
  props: GraphicProps<TagAttributes, VTag>
) => ReactElement<GraphicProps<TagAttributes, VTag>, JSXElementConstructor<GraphicProps<TagAttributes, VTag>>> =
  'tag' as any;
