import type { ReactElement, JSXElementConstructor } from 'react';
import type { Radio as VRadio, RadioAttributes } from '@visactor/vtable/es/vrender';
import type { GraphicProps } from './type';

// component from vrender-component
export const Radio: (
  props: GraphicProps<RadioAttributes, VRadio>
) => ReactElement<GraphicProps<RadioAttributes, VRadio>, JSXElementConstructor<GraphicProps<RadioAttributes, VRadio>>> =
  'radio' as any;
