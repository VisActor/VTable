import type { ReactElement, JSXElementConstructor } from 'react';
import type { CheckboxAttributes, CheckBox as VCheakbox } from '@visactor/vtable/es/vrender';
import type { GraphicProps } from './type';

export const Checkbox: (
  props: GraphicProps<CheckboxAttributes, VCheakbox>
) => ReactElement<
  GraphicProps<CheckboxAttributes, VCheakbox>,
  JSXElementConstructor<GraphicProps<CheckboxAttributes, VCheakbox>>
> = 'checkbox' as any;
