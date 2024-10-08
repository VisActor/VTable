import type { VNode } from 'vue';
import type { IDimension } from '@visactor/vtable';

interface ObjectHandler {
  objectHandler?: string | Array<string>;
}

export type PivotColumnDimensionProps = IDimension & ObjectHandler;

export default function PivotRowDimension(props: PivotColumnDimensionProps): VNode {
  return null;
}

PivotRowDimension.symbol = 'PivotRowDimension';
