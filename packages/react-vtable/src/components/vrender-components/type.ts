import type { Ref } from 'react';
import type { IEventParamsType } from '@visactor/vtable/es/vrender';

export type GraphicProps<IGraphicGraphicAttribute, IGraphic> = {
  attribute?: IGraphicGraphicAttribute;
  ref?: Ref<IGraphic>;
} & IGraphicGraphicAttribute &
  IEventParamsType;
