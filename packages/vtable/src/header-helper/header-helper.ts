import type {
  ColumnDefine,
  ColumnIconOption,
  ColumnsDefine,
  ListTableAPI,
  PivotTableAPI,
  RectProps,
  SortOrder,
  SvgIcon
} from '../ts-types';
import { HierarchyState, IconFuncTypeEnum, IconPosition, InternalIconName } from '../ts-types';
import * as registerIcons from '../icons';
import { cellInRange } from '../tools/helper';
import { isMenuHighlight } from '../components/menu/dom/logic/MenuElement';
import { Style } from './style/Style';
import { ImageStyle } from './style/ImageStyle';
import { TextHeaderStyle } from './style';
import type { ListTable } from '../ListTable';
import type { BaseTableAPI, HeaderData } from '../ts-types/base-table';
import { CheckboxStyle } from './style/CheckboxStyle';
import { isValid } from '@visactor/vutils';
export class HeaderHelper {
  normalIcon: SvgIcon;
  upIcon: SvgIcon;
  downIcon: SvgIcon;
  freezeIcon: SvgIcon;
  frozenIcon: SvgIcon;
  frozenCurrentIcon: SvgIcon;
  dropDownAbsoluteIcon: SvgIcon;
  // dropDownHoverIcon: SvgIcon;

  expandIcon: SvgIcon;
  collapseIcon: SvgIcon;
  // //存储鼠标hover到的图标类型，后面需要用name判断，应该再拿个inline对象上赋值showFrozenIconIcon，绘制感应区域
  // _showFrozenIconIcon?: SvgIcon;
  // _showSortIcon?: SvgIcon;
  _table: BaseTableAPI;
  constructor(_table: BaseTableAPI) {
    this._table = _table;
    const regedIcons = registerIcons.get();
    //pin默认值
    this.freezeIcon = regedIcons[InternalIconName.freezeIconName] as SvgIcon;
    this.frozenIcon = regedIcons[InternalIconName.frozenIconName] as SvgIcon;
    this.frozenCurrentIcon = regedIcons[InternalIconName.frozenCurrentIconName] as SvgIcon;

    //sort默认值
    this.normalIcon = regedIcons[InternalIconName.normalIconName] as SvgIcon;
    this.upIcon = regedIcons[InternalIconName.upwardIconName] as SvgIcon;
    this.downIcon = regedIcons[InternalIconName.downwardIconName] as SvgIcon;
    //下拉按钮
    this.dropDownAbsoluteIcon = regedIcons[InternalIconName.dropdownIconName] as SvgIcon;
    // this.dropDownHoverIcon = regedIcons[InternalIconName.dropdownHoverIconName] as SvgIcon;
    //展开折叠按钮
    this.expandIcon = regedIcons[InternalIconName.expandIconName] as SvgIcon;
    this.collapseIcon = regedIcons[InternalIconName.collapseIconName] as SvgIcon;
  }

  getIcons(col: number, row: number): ColumnIconOption[] {
    //加入固定列图标 排序 文本中元素
    const icons: ColumnIconOption[] = [];
    if (this._table.isPivotTable()) {
      // 透视表显示排序按钮
      const { showSort, sort } = this._table.internalProps.layoutMap.getHeader(col, row) as HeaderData;
      let _showSort;
      if (typeof showSort === 'function') {
        _showSort = showSort({ col, row, table: this._table });
      } else {
        _showSort = showSort;
      }
      if (_showSort) {
        let order = (this._table as PivotTableAPI).getPivotSortState(col, row) as string;
        if (order) {
          order = order.toUpperCase();
        }
        const sortIcon = order === 'ASC' ? this.upIcon : order === 'DESC' ? this.downIcon : this.normalIcon;

        if (sortIcon) {
          icons.push(sortIcon);
        }
      } else if (sort) {
        // 处理配置了sort的情况
        const sortIcon = this.getSortIconForPivotTable(
          (this._table as PivotTableAPI).getPivotSortState(col, row),
          this._table,
          col,
          row
        );
        if (sortIcon) {
          icons.push(sortIcon);
        }
      }
    } else {
      const states = (this._table as ListTableAPI).sortState;
      let order: SortOrder | undefined;
      order = undefined;
      const range = this._table.getCellRange(col, row);
      if (states) {
        if (Array.isArray(states)) {
          for (let i = 0; i < states.length; i++) {
            const state = states[i];
            const stateRange = this._table._getHeaderCellBySortState(state);
            if (stateRange && cellInRange(range, stateRange.col, stateRange.row)) {
              ({ order } = state);
              break;
            }
          }
        } else {
          const stateRange = this._table._getHeaderCellBySortState(states);
          if (stateRange && cellInRange(range, stateRange.col, stateRange.row)) {
            ({ order } = states);
          }
        }
      }
      const sortIcon = this.getSortIcon(order, this._table, col, row);
      if (sortIcon) {
        icons.push(sortIcon);
      }
    }

    if (this._table.showFrozenIcon && col < this._table.allowFrozenColCount) {
      const pinInline = this.getFrozenIcon(col, row);
      if (pinInline) {
        icons.push(pinInline);
        // context.showIcon = this.showFrozenIconIcon;//todo 暂时去掉 需要想其他方式
      }
    }

    if (this.checkDropDownIcon(this._table, col, row)) {
      // const dropDownMenuHoverIcon = this.dropDownHoverIcon;//this.getDropDownHoverIcon(_table, col, row);
      const dropDownMenuIcon = this.dropDownAbsoluteIcon; //this.getDropDownAbsoluteIcon(_table, col, row);
      // dropDownMenuIcon.hover.image = dropDownMenuHoverIcon.svg; // to do 规范化处理
      icons.push(dropDownMenuIcon);
    }

    const dropDownStateIcons = this.getDropDownStateIcons(this._table, col, row);
    if (dropDownStateIcons.length) {
      icons.push(...dropDownStateIcons);
    }

    const { headerIcon } = this._table._getHeaderLayoutMap(col, row) as HeaderData;
    // captionIcon && icons.push(captionIcon);

    const hierarchyIcon = this.getHierarchyIcon(col, row);
    if (hierarchyIcon) {
      icons.push(hierarchyIcon);
    }

    if (headerIcon) {
      let headerIconStrs;
      if (typeof headerIcon === 'function') {
        const arg = {
          col,
          row,
          value: this._table.getCellValue(col, row),
          dataValue: this._table.getCellOriginValue(col, row),
          table: this._table
        };
        headerIconStrs = headerIcon(arg);
      } else {
        headerIconStrs = headerIcon;
      }
      const regedIcons = registerIcons.get();
      const addIcon = (headerIcon: string | ColumnIconOption) => {
        let icon;
        if (typeof headerIcon === 'string') {
          icon = regedIcons[headerIcon];
        } else {
          icon = headerIcon;
        }
        if (icon) {
          icons.push(icon);
        }
      };
      if (Array.isArray(headerIconStrs)) {
        headerIconStrs.forEach((columnIcon: string | ColumnIconOption, index: number) => {
          addIcon(columnIcon);
        });
      } else {
        addIcon(headerIconStrs);
      }
    }
    return icons;
  }

  getFrozenIcon(col: number, row: number): ColumnIconOption | null {
    // this.showFrozenIconIcon = undefined;
    if (this._table.isPivotTable() || (this._table as ListTable).transpose) {
      // 透视表和转置模式不显示冻结按钮
      return null;
    }

    if (this._table.rightFrozenColCount && col >= this._table.colCount - this._table.rightFrozenColCount) {
      return null;
    }
    const headerC = this._table.getHeaderDefine(col, row) as any;
    if (headerC.columns && headerC.columns.length > 0) {
      return null;
    }

    let frozen = this.freezeIcon;
    // 使用table.options.frozenColCount原始冻结信息获取按钮
    if (this._table.options.frozenColCount - 1 > col) {
      frozen = this.frozenIcon;
    } else if (this._table.options.frozenColCount - 1 === col) {
      frozen = this.frozenCurrentIcon;
    }
    return frozen;
  }

  getSortIcon(order: SortOrder | undefined, _table: BaseTableAPI, col: number, row: number): ColumnIconOption | null {
    // this.showSortIcon = undefined;
    const icon = order === 'asc' ? this.upIcon : order === 'desc' ? this.downIcon : this.normalIcon;

    const headerC = _table.getHeaderDefine(col, row) as any;
    let _showSort;
    if (headerC) {
      if (typeof headerC.showSort === 'function') {
        _showSort = headerC.showSort({ col, row, table: this._table });
      } else {
        _showSort = headerC.showSort;
      }
    }
    if (
      !headerC ||
      _showSort === false ||
      (!isValid(_showSort) && !headerC.sort) ||
      (headerC.columns && headerC.columns.length > 0)
    ) {
      return null;
    }
    return icon;
  }

  getSortIconForPivotTable(
    order: SortOrder | undefined,
    _table: BaseTableAPI,
    col: number,
    row: number
  ): ColumnIconOption | null {
    const headerC = _table.getHeaderDefine(col, row) as any;
    let _showSort;
    if (headerC) {
      if (typeof headerC.showSort === 'function') {
        _showSort = headerC.showSort({ col, row, table: this._table });
      } else {
        _showSort = headerC.showSort;
      }
    }
    if (
      !headerC ||
      _showSort === false ||
      (!isValid(_showSort) && !headerC.sort) ||
      (headerC.columns && headerC.columns.length > 0)
    ) {
      return null;
    }
    const icon =
      order?.toUpperCase() === 'ASC' ? this.upIcon : order?.toUpperCase() === 'DESC' ? this.downIcon : this.normalIcon;
    // const icon = order === 'ASC' ? this.downIcon : this.upIcon;
    return icon;
  }

  private getDropDownStateIcons(_table: BaseTableAPI, col: number, row: number): ColumnIconOption[] {
    const headerC = _table.getHeaderDefine(col, row) as ColumnDefine;
    const headerL = _table._getHeaderLayoutMap(col, row) as HeaderData;
    let { dropDownMenu } = headerL as HeaderData;
    if (typeof dropDownMenu === 'function') {
      dropDownMenu = dropDownMenu({ row, col, table: _table });
    }
    let globalDropDownMenu = _table.globalDropDownMenu;
    if (typeof globalDropDownMenu === 'function') {
      globalDropDownMenu = globalDropDownMenu({ row, col, table: _table });
    }
    const results: ColumnIconOption[] = [];
    if (
      (Array.isArray(dropDownMenu) && dropDownMenu.length) || // header中配置dropDownMenu
      (Array.isArray(globalDropDownMenu) && globalDropDownMenu.length && !headerC?.columns?.length) // 全局配置dropDownMenu，只在最下级表头展示
    ) {
      const menus = dropDownMenu || globalDropDownMenu;
      let highlightIndex = -1;
      let subHighlightIndex = -1;
      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];
        // 优先判断子元素
        if (typeof menu === 'object' && menu.children && menu.children.length) {
          for (let j = 0; j < menu.children.length; j++) {
            const childItem = menu.children[j];
            if (
              _table.stateManager.menu?.dropDownMenuHighlight &&
              isMenuHighlight(
                _table,
                _table.stateManager.menu?.dropDownMenuHighlight,
                typeof childItem === 'object' ? childItem?.menuKey : childItem,
                col,
                row,
                i
              )
            ) {
              highlightIndex = i;
              subHighlightIndex = j;
              break;
            }
          }
        }
        if (_table._dropDownMenuIsHighlight(col, row, i)) {
          highlightIndex = i;
          break;
        }
      }
      // const highlightIndex = _table._dropDownMenuIsHighlight(col, row);
      if (highlightIndex !== -1) {
        let menu;
        if (subHighlightIndex !== -1) {
          menu = (menus[highlightIndex] as any).children[subHighlightIndex];
        } else {
          menu = menus[highlightIndex];
        }

        if (menu.stateIcon) {
          if (menu.stateIcon.svg) {
            results.push({
              type: 'svg',
              name: menu.stateIcon.src || menu.stateIcon.svg,
              width: menu.stateIcon.width || 22,
              height: menu.stateIcon.height || 22,
              // dropDownIndex: highlightIndex,
              svg: menu.stateIcon.svg,
              positionType: IconPosition.right,
              marginRight: 0,
              funcType: IconFuncTypeEnum.dropDownState,
              interactive: false
              // hover: {
              //   width: menu.stateIcon.width || 22,
              //   height: menu.stateIcon.height || 22,
              //   bgColor: 'rgba(101, 117, 168, 0.1)',
              // },
            });
          } else if (menu.stateIcon.src) {
            results.push({
              type: 'image',
              name: menu.stateIcon.src || menu.stateIcon.svg,
              width: menu.stateIcon.width || 22,
              height: menu.stateIcon.height || 22,
              // dropDownIndex: highlightIndex,
              src: menu.stateIcon.src,
              positionType: IconPosition.right,
              marginRight: 0,
              funcType: IconFuncTypeEnum.dropDownState,
              interactive: false
              // hover: {
              //   width: menu.stateIcon.width || 22,
              //   height: menu.stateIcon.height || 22,
              //   bgColor: 'rgba(101, 117, 168, 0.1)',
              // },
            });
          }
        }
      }
    }
    return results;
  }
  /**
   * 内置dropDownIcon的位置信息
   * @param cellRect
   * @param marginTop
   * @param baseline
   * @returns
   */
  getDropDownIconRect(cellRect: RectProps, marginTop: number, baseline?: string): RectProps {
    // const left = cellRect.right - (this.downIcon.box?.width || 0) - marginRight;
    // const right = cellRect.right - marginRight;
    const iconW = this.downIcon.hover?.width ?? this.downIcon?.width ?? 0;
    const iconH = this.downIcon.hover?.height ?? this.downIcon?.height ?? 0;
    const left = cellRect.right - 2 - iconW;
    const right = cellRect.right - 2;
    let top;
    if (baseline === 'middle') {
      top = cellRect.top + cellRect.height / 2 - iconW / 2;
    } else if (baseline === 'top') {
      top = cellRect.top + marginTop / 2;
    } else if (baseline === 'bottom') {
      top = cellRect.bottom - marginTop * 2;
    } else {
      top = cellRect.top;
    }
    const bottom = iconH + top;

    return {
      left,
      right,
      top,
      bottom,
      width: iconW,
      height: iconH
    };
  }

  getHierarchyIcon(col: number, row: number) {
    const { hierarchyState } = this._table._getHeaderLayoutMap(col, row) as HeaderData;
    if (hierarchyState) {
      if (hierarchyState === HierarchyState.expand) {
        //展开状态 应该显示-号
        return this.expandIcon;
      } else if (hierarchyState === HierarchyState.collapse) {
        //折叠状态 应该显示-号
        return this.collapseIcon;
      }
    }
    return undefined;
  }
  getHierarchyIconWidth() {
    return this.expandIcon.width + (this.expandIcon.marginLeft ?? 0) + (this.expandIcon.marginRight ?? 0);
  }
  private checkDropDownIcon(_table: BaseTableAPI, col: number, row: number) {
    /*
     * dropDownMenu有三种状态：
     * 1. header中未配置 =》 使用globalDropDownMenu，icon展示
     * 2. header中配置 =》 使用header中的dropDownMenu，icon展示
     * 3. header中dropDownMenu为空数组 =》 icon不展示
     */
    if (_table.isPivotTable()) {
      const headerC = _table._getHeaderLayoutMap(col, row) as HeaderData;
      let dropDownMenu = headerC.dropDownMenu;
      if (typeof dropDownMenu === 'function') {
        dropDownMenu = dropDownMenu({ row, col, table: _table });
      }
      if (
        Array.isArray(dropDownMenu) &&
        dropDownMenu.length // header中配置dropDownMenu
      ) {
        return true;
      }
    } else {
      const headerC = _table.getHeaderDefine(col, row) as ColumnDefine;
      const dropDownMenu = headerC.dropDownMenu;
      let globalDropDownMenu = _table.globalDropDownMenu;
      if (typeof globalDropDownMenu === 'function') {
        globalDropDownMenu = globalDropDownMenu({ row, col, table: _table });
      }
      if (
        (Array.isArray(dropDownMenu) && dropDownMenu.length) || // header中配置dropDownMenu
        ((!Array.isArray(headerC.dropDownMenu) || headerC.dropDownMenu.length !== 0) && // header中dropDownMenu为空数组，不显示
          Array.isArray(globalDropDownMenu) &&
          globalDropDownMenu.length && // 全局配置dropDownMenu
          !headerC?.columns?.length) // 只在最下级表头展示
      ) {
        return true;
      }
    }

    return false;
  }

  getStyleClass(headerType: 'text' | 'image' | 'video' | 'link' | 'checkbox') {
    switch (headerType) {
      case 'text':
        return TextHeaderStyle;
      case 'image':
        return ImageStyle;
      case 'video':
        return ImageStyle;
      case 'link':
        return TextHeaderStyle;
      case 'checkbox':
        return CheckboxStyle;
    }
  }

  setTableColumnsEditor() {
    const setEditor = (colDefines: ColumnsDefine, setColumns: ColumnsDefine) => {
      colDefines?.forEach((colDefine, index) => {
        if (colDefine.editor) {
          setColumns[index].editor = colDefine.editor;
        }
        if (colDefine.columns) {
          setEditor(colDefine.columns, setColumns[index].columns);
        }
      });
    };
    setEditor((this._table as ListTable).options.columns, (this._table as ListTable).internalProps.columns);
  }
}
