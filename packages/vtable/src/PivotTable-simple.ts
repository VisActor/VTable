import { PivotTable } from './PivotTable';
import { registerTextCell } from './scenegraph/group-creater/cell-type';

registerTextCell();

export class PivotTableSimple extends PivotTable {}
