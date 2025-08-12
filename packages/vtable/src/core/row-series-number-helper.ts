import {
  InternalIconName,
  type ColumnIconOption,
  type ListTableAPI,
  type PivotTableAPI,
  type RectProps,
  type SortOrder,
  type SvgIcon
} from '../ts-types';
import * as registerIcons from '../icons';

import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../ts-types/base-table';
export class RowSeriesNumberHelper {
  dragReorderIconName: SvgIcon;

  _table: BaseTableAPI;
  constructor(_table: BaseTableAPI) {
    this._table = _table;
    const regedIcons = registerIcons.get();

    this.dragReorderIconName = regedIcons[InternalIconName.dragReorderIconName] as SvgIcon;
  }

  getIcons(col: number, row: number): ColumnIconOption[] {
    return [this.dragReorderIconName];
  }
}
