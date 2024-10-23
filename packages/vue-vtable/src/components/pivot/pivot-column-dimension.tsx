import type { VNode } from 'vue';
import type { IDimension } from '@visactor/vtable';

interface ObjectHandler {
  objectHandler?: string | Array<string>;
}

export type PivotColumnDimensionProps = IDimension & ObjectHandler;

export default function PivotColumnDimension(props: PivotColumnDimensionProps): VNode {
  return null;
}

PivotColumnDimension.symbol = 'PivotColumnDimension';
