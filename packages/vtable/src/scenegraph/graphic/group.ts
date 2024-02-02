import type { IGraphic, IColor, IRect, INode } from '@src/vrender';
import { Group as VRenderGroup } from '@src/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { InteractionState } from '../../ts-types';
import type { AABBBounds } from '@visactor/vutils';

export class Group extends VRenderGroup {
  role?: string;
  col?: number;
  row?: number;
  mergeStartCol?: number;
  mergeStartRow?: number;
  mergeEndCol?: number;
  mergeEndRow?: number;
  contentWidth?: number;
  contentHeight?: number;
  rowNumber?: number; // row number of the column group
  colHeight?: number; // current height of the column group
  border?: IRect; // table/header/body的border mark，挂载在这里方便更新
  needUpdate?: boolean;

  needUpdateWidth?: boolean;
  needUpdateHeight?: boolean;

  /**
   * @description: 清空Group下全部子元素
   * @return {*}
   */
  clear() {
    this.removeAllChild();
  }

  getChildByName(name: string, deep?: boolean): any {
    // for (let i = 0, j = this.children.length; i < j; i++) {
    //   if (this.children[i].name === name) {
    //     return this.children[i] as unknown as T;
    //   }
    // }
    let result = null;
    this.forEachChildren((child: IGraphic) => {
      if (child.name === name) {
        result = child;
        return true; // 提前退出循环
      }
      return false;
    });

    if (deep) {
      // for (let i = 0, j = this.children.length; i < j; i++) {
      //   const child = this.children[i] as Group;

      //   if (!child.getChildByName) {
      //     continue;
      //   }

      //   const target = child.getChildByName(name, true);

      //   if (target) {
      //     return target;
      //   }
      // }
      this.forEachChildren((child: IGraphic) => {
        if ((child as Group).getChildByName) {
          const target = (child as Group).getChildByName(name, true);
          if (target) {
            result = target;
            return true;
          }
        }
        return false;
      });
    }

    return result;
  }

  get width() {
    let width = this.AABBBounds.width();
    if (width === Infinity || width === -Infinity) {
      width = 0;
    }
    return Math.max(width, this.attribute.width ?? 0);
  }

  get height() {
    let height = this.AABBBounds.height();
    if (height === Infinity || height === -Infinity) {
      height = 0;
    }
    return Math.max(height, this.attribute.height ?? 0);
  }

  setDeltaWidth(deltaX: number) {
    if (deltaX === 0) {
      return;
    }
    this.setAttribute('width', (this.attribute.width ?? 0) + deltaX);
    if (this.border) {
      this.border.setAttribute('width', this.border.attribute.width + deltaX);

      if (this.border.type === 'group') {
        (this.border.firstChild as IRect).setAttribute(
          'width',
          (this.border.firstChild as IRect).attribute.width + deltaX
        );
      }
    }
  }

  setDeltaHeight(deltaY: number) {
    if (deltaY === 0) {
      return;
    }
    this.setAttribute('height', (this.attribute.height ?? 0) + deltaY);
    if (this.border) {
      this.border.setAttribute('height', this.border.attribute.height + deltaY);
      if (this.border.type === 'group') {
        (this.border.firstChild as IRect).setAttribute(
          'width',
          (this.border.firstChild as IRect).attribute.height + deltaY
        );
      }
    }
  }

  setDeltaX(deltaX: number) {
    if (deltaX === 0) {
      return;
    }
    this.setAttribute('x', this.attribute.x + deltaX);
  }

  setDeltaY(deltaY: number) {
    if (deltaY === 0) {
      return;
    }
    this.setAttribute('y', this.attribute.y + deltaY);
  }

  /**
   * @description: 遍历所有子节点，跳过部分节点，默认跳过group的border
   * @return {*}
   */
  forEachChildrenSkipChild<T extends INode = INode>(
    cb: (item: T, index: number) => void | boolean,
    skipChildName = 'border-rect',
    reverse = false
  ) {
    if (reverse) {
      let child = this._lastChild;
      let i = 0;
      while (child) {
        if (child.name !== skipChildName) {
          const breakTag = cb(child as T, i++);
          if (breakTag) {
            return;
          }
        }
        child = child._prev;
      }
    } else {
      let child = this._firstChild;
      let i = 0;
      while (child) {
        if (child.name !== skipChildName) {
          const breakTag = cb(child as T, i++);
          if (breakTag) {
            return;
          }
        }
        child = child._next;
      }
    }
  }

  getColGroup(col: number) {
    let c = this._firstChild as Group;
    if (!c) {
      return null;
    }
    for (let i = 0; i < this.childrenCount; i++) {
      if (c.col === col) {
        return c;
      }
      c = c._next as Group;
    }
    return null;
  }

  getRowGroup(row: number) {
    let c = this._firstChild as Group;
    if (!c) {
      return null;
    }
    for (let i = 0; i < this.childrenCount; i++) {
      if (c.row === row) {
        return c;
      }
      c = c._next as Group;
    }
    return null;
  }

  addCellGroup(cellGroup: Group) {
    if (this.childrenCount === 0 || (this.lastChild as Group).row === cellGroup.row - 1) {
      this.addChild(cellGroup);
    } else {
      // for promise cell row order in column
      let c = this._firstChild as Group;
      for (let i = 0; i < this.childrenCount; i++) {
        if (c.row === cellGroup.row - 1) {
          this.insertAfter(cellGroup, c);
          return;
        }
        c = c._next as Group;
      }
      this.addChild(cellGroup);
    }
  }

  getChildAt(index: number) {
    const child = super.getChildAt(index);
    if (child && child.name === 'border-rect') {
      return child._next;
    }
    return child;
  }

  protected tryUpdateAABBBounds(): AABBBounds {
    if (this.role === 'cell') {
      if (!this.shouldUpdateAABBBounds()) {
        return this._AABBBounds;
      }
      // application.graphicService.beforeUpdateAABBBounds(this, this.stage, true, this._AABBBounds);
      const selfChange = this.shouldSelfChangeUpdateAABBBounds();
      // const selfChange = true;
      const bounds = this.doUpdateAABBBounds();
      this.addUpdateLayoutTag();
      // application.graphicService.afterUpdateAABBBounds(this, this.stage, this._AABBBounds, this, selfChange);
      after(this, selfChange);

      return bounds;
    }
    return super.tryUpdateAABBBounds();
  }

  // 目前优化方案会导致合并单元格无法正常更新列宽（因为合并单元格更新bounds不会触发父节点bounds更新），暂时关闭优化方案
  // shouldUpdateAABBBoundsForRowMerge(): boolean {

  // }

  // shouldUpdateAABBBounds(): boolean {
  //   return this.shouldSelfChangeUpdateAABBBounds();
  //   // // 检索自己是否需要更新
  //   // if (super.shouldUpdateAABBBounds()) {
  //   //   return true;
  //   // }
  //   // // 检索叶子节点是否有更新（如果children是叶子节点的话）
  //   // if (this._childUpdateTag & UpdateTag.UPDATE_BOUNDS) {
  //   //   return true;
  //   // }
  //   // // 检索是否子group需要更新
  //   // let needUpdate = false;
  //   // this.forEachChildren((node: IGraphic) => {
  //   //   // 只查找group层级
  //   //   if (node.isContainer && (node as Group).shouldUpdateAABBBounds()) {
  //   //     needUpdate = true;
  //   //     return true;
  //   //   }
  //   //   return false;
  //   // });
  //   // return needUpdate;
  // }

  protected doUpdateAABBBounds(): any {
    // const groupTheme = getTheme(this).group;
    // debugger;
    if (this.role === 'cell') {
      const attribute = this.attribute;
      const { x, y, width, height } = attribute;
      this._AABBBounds.setValue(x, y, x + width, y + height);
      // 更新bounds之后需要设置父节点，否则tag丢失
      this.parent && this.parent.addChildUpdateBoundTag();
      this.clearUpdateBoundTag();
      return this._AABBBounds;
    } else if (
      this.role === 'body' ||
      this.role === 'row-header' ||
      this.role === 'col-header' ||
      this.role === 'right-frozen' ||
      this.role === 'bottom-frozen' ||
      this.role === 'corner-header' ||
      this.role === 'corner-right-top-header' ||
      this.role === 'corner-right-bottom-header' ||
      this.role === 'corner-left-bottom-header'
    ) {
      // Infinity bounds for manual clip group
      this._AABBBounds.setValue(-Infinity, -Infinity, Infinity, Infinity);
      // 更新bounds之后需要设置父节点，否则tag丢失
      this.parent && this.parent.addChildUpdateBoundTag();
      this.clearUpdateBoundTag();
      return this._AABBBounds;
    }
    return super.doUpdateAABBBounds();
    // _AABBBounds
    // const bounds = graphicService.updateGroupAABBBounds(
    //   attribute,
    //   getTheme(this).group,
    //   this._AABBBounds,
    //   this
    // ) as AABBBounds;

    // const { boundsPadding = groupTheme.boundsPadding } = attribute;
    // const paddingArray = parsePadding(boundsPadding);
    // if (paddingArray) {
    //   bounds.expand(paddingArray);
    // }
    // // 更新bounds之后需要设置父节点，否则tag丢失
    // this.parent && this.parent.addChildUpdateBoundTag();
    // this.clearUpdateBoundTag();

    // this.emit('AAABBBoundsChange');
  }

  // update column group row number
  updateColumnRowNumber(row: number) {
    if (!this.rowNumber) {
      this.rowNumber = row;
    } else {
      this.rowNumber = Math.max(this.rowNumber, row);
    }
  }

  // update column height
  updateColumnHeight(cellHeight: number) {
    if (!this.colHeight) {
      this.colHeight = cellHeight;
    } else {
      this.colHeight += cellHeight;
    }
  }
}

function after(group: Group, selfChange: boolean) {
  if (!group.stage.dirtyBounds) {
    return;
  }
  if (!(group.stage && group.stage.renderCount)) {
    return;
  }
  // group的子元素导致的bounds更新不用做dirtyBounds
  if (group.isContainer && !selfChange) {
    return;
  }
  group.stage.dirty(group.globalAABBBounds);
}
