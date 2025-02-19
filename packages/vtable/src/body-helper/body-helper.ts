import type { ColumnIconOption, ImageIcon, ListTableAPI, SvgIcon } from '../ts-types';
import { HierarchyState, InternalIconName } from '../ts-types';
import * as registerIcons from '../icons';
import { Style } from './style/Style';
import { TextStyle } from './style/MultilineTextStyle';
import { ProgressBarStyle } from './style/ProgressBarStyle';
import { ImageStyle } from './style/ImageStyle';
import type { BaseTableAPI } from '../ts-types/base-table';
import * as icons from '../tools/icons';
import { obj } from '../tools/helper';
import { CheckboxStyle } from './style/CheckboxStyle';
import { RadioStyle } from './style/RadioStyle';
import { isValid } from '@visactor/vutils';
import { SwitchStyle } from './style/SwitchStyle';
import { ButtonStyle } from './style/ButtonStyle';
export class BodyHelper {
  expandIcon: SvgIcon;
  collapseIcon: SvgIcon;
  _table: BaseTableAPI;
  constructor(_table: BaseTableAPI) {
    this._table = _table;
    const regedIcons = registerIcons.get();
    //展开折叠按钮
    this.expandIcon = regedIcons[InternalIconName.expandIconName] as SvgIcon;
    this.collapseIcon = regedIcons[InternalIconName.collapseIconName] as SvgIcon;
  }
  getIcons(
    col: number,
    row: number,
    cellValue: any,
    dataValue: any,
    context: CanvasRenderingContext2D
  ): ColumnIconOption[] {
    //加入固定列图标 排序 文本中元素
    const iconArr: ColumnIconOption[] = [];

    const hierarchyIcon = this.getHierarchyIcon(col, row);
    if (hierarchyIcon) {
      iconArr.push(hierarchyIcon);
    }

    const { icon: iconDefine } = this._table.getBodyColumnDefine(col, row);

    if (iconDefine) {
      let iconResults;
      if (typeof iconDefine === 'function') {
        const arg = {
          col,
          row,
          value: cellValue,
          dataValue,
          table: this._table
        };
        iconResults = iconDefine(arg);
      } else {
        iconResults = iconDefine;
      }
      const regedIcons = registerIcons.get();
      const addIcon = (columnIcon: string | ColumnIconOption) => {
        let icon;
        if (typeof columnIcon === 'string') {
          icon = regedIcons[columnIcon];
        } else {
          icon = columnIcon;
        }
        if (icon) {
          iconArr.push(icon);
        }
      };
      if (Array.isArray(iconResults)) {
        iconResults.forEach((columnIcon: string | ColumnIconOption, index: number) => {
          addIcon(columnIcon);
        });
      } else {
        addIcon(iconResults);
      }
    }

    context &&
      iconArr.forEach((i, index) => {
        if ((i as any).content || (<ImageIcon>i).src) {
          iconArr[index] = this.getCellIconFromRecordValue(i, col, row);
          // if ((<FontIcon>i).font)
          //   helper.testFontLoad((<FontIcon>i).font, (<FontIcon>i).content, col, row);
        }
      });

    return iconArr;
  }
  getStyleClass(
    cellType:
      | 'text'
      | 'link'
      | 'image'
      | 'video'
      | 'chart'
      | 'sparkline'
      | 'progressbar'
      | 'chart'
      | 'checkbox'
      | 'radio'
      | 'switch'
      | 'button'
  ) {
    switch (cellType) {
      case 'text':
        return TextStyle;
      case 'image':
        return ImageStyle;
      case 'video':
        return ImageStyle;
      case 'link':
        return TextStyle;
      case 'chart':
        return Style;
      case 'sparkline':
        return Style;
      case 'progressbar':
        return ProgressBarStyle;
      case 'checkbox':
        return CheckboxStyle;
      case 'radio':
        return RadioStyle;
      case 'switch':
        return SwitchStyle;
      case 'button':
        return ButtonStyle;
    }
    return TextStyle;
  }
  getCellIconFromRecordValue(icon: ColumnIconOption, col: number, row: number): ColumnIconOption;
  getCellIconFromRecordValue(icon: ColumnIconOption[], col: number, row: number): ColumnIconOption[];
  getCellIconFromRecordValue(
    icon: ColumnIconOption | ColumnIconOption[],
    col: number,
    row: number
  ): ColumnIconOption | ColumnIconOption[];
  getCellIconFromRecordValue(
    icon: ColumnIconOption | ColumnIconOption[],
    col: number,
    row: number
  ): ColumnIconOption | ColumnIconOption[] {
    if (Array.isArray(icon)) {
      return icon.map(i => this.getCellIconFromRecordValue(i, col, row));
    }
    // icon.positionType = IconPosition.inlineFront;
    if (!obj.isObject(icon) || typeof icon === 'function') {
      return (this._table as ListTableAPI).getFieldData(icon, col, row);
    }
    // 新建对象 挨个属性赋值
    const retIcon: any = {};
    const iconOpt: any = icon;
    icons.iconPropKeys.forEach(k => {
      if (typeof iconOpt[k] !== 'undefined') {
        const f = (this._table as ListTableAPI).getFieldData(iconOpt[k], col, row);
        if (isValid(f)) {
          retIcon[k] = f;
        } else if (!this._table._hasField?.(iconOpt[k], col, row)) {
          retIcon[k] = iconOpt[k];
        }
      }
    });
    return retIcon;
  }

  getHierarchyIcon(col: number, row: number) {
    const hierarchyState = this._table.getHierarchyState(col, row);
    if (hierarchyState === HierarchyState.expand) {
      //展开状态 应该显示-号
      return this.expandIcon;
    } else if (hierarchyState === HierarchyState.collapse) {
      //折叠状态 应该显示-号
      return this.collapseIcon;
    }
    return undefined;
  }
  getHierarchyIconWidth() {
    return this.expandIcon.width + (this.expandIcon.marginLeft ?? 0) + (this.expandIcon.marginRight ?? 0);
  }
}
