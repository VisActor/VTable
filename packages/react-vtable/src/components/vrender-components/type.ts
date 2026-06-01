import type { Ref } from 'react';
import type { IEventParamsType, StateDefinitionsInput } from '@visactor/vtable/es/vrender';

export type GraphicProps<IGraphicGraphicAttribute extends Record<string, unknown>, IGraphicElement> = {
  attribute?: IGraphicGraphicAttribute;
  ref?: Ref<IGraphicElement>;
  states?: StateDefinitionsInput<IGraphicGraphicAttribute>;
  sharedStateDefinitions?: StateDefinitionsInput<Record<string, unknown>>;
} & IGraphicGraphicAttribute &
  IEventParamsType;
