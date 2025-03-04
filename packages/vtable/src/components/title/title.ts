import { Title as TitleComponents } from '@src/vrender';
// eslint-disable-next-line no-duplicate-imports
import type { TitleAttrs } from '@src/vrender';
import type { ITitle } from '../../ts-types/component/title';
import { getQuadProps } from '../../scenegraph/utils/padding';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { isEqual, merge } from '@visactor/vutils';

export interface ITitleComponent {
  new (titleOption: ITitle, table: BaseTableAPI): Title;
}
export class Title {
  table: BaseTableAPI;
  _titleOption: ITitle;
  isReleased: boolean = false;
  private _titleComponent: TitleComponents;
  private _cacheAttrs: TitleAttrs;
  constructor(titleOption: ITitle, table: BaseTableAPI) {
    this.table = table;
    this._titleOption = merge({ orient: 'top' }, titleOption);
    if (titleOption.visible !== false) {
      this._titleComponent = this._createOrUpdateTitleComponent(this._getTitleAttrs());
    }
  }

  private _createOrUpdateTitleComponent(attrs: TitleAttrs): TitleComponents {
    if (this._titleComponent) {
      if (!isEqual(attrs, this._cacheAttrs)) {
        this._titleComponent.setAttributes(attrs);
      }
    } else {
      const title = new TitleComponents(attrs);
      title.name = 'title';
      this.table.scenegraph.stage.defaultLayer.appendChild(title);
      this._titleComponent = title;
      // 代理 title 组件上的事件
      // title.on('*', (event: any, type: string) => this._delegateEvent(title as unknown as INode, event, type));
    }
    // update table size
    this._adjustTableSize(this._titleComponent.attribute);
    return this._titleComponent;
  }

  resize() {
    if (!this._titleComponent) {
      return;
    }
    const padding = getQuadProps(this._titleOption.padding ?? 10);
    const realWidth =
      this._titleOption.width ??
      (this.table.widthMode === 'adaptive'
        ? this.table.tableNoFrameWidth
        : Math.min(this.table.tableNoFrameWidth, this.table.getDrawRange().width)) -
        padding[1] -
        padding[3];
    const realHeight =
      this._titleOption.height ??
      (this.table.heightMode === 'adaptive'
        ? this.table.tableNoFrameHeight
        : Math.min(this.table.tableNoFrameHeight, this.table.getDrawRange().height)) -
        padding[0] -
        padding[2];
    this._titleComponent.setAttributes({
      x:
        this._titleOption.x ?? this._titleOption.orient === 'right'
          ? this.table.tableX + Math.min(this.table.tableNoFrameWidth, this.table.getDrawRange().width)
          : this.table.tableX,
      y:
        this._titleOption.y ?? this._titleOption.orient === 'bottom'
          ? this.table.tableY + this.table.tableNoFrameHeight
          : this.table.tableY,
      // width: realWidth,
      width:
        this._titleOption.orient === 'top' || this._titleOption.orient === 'bottom'
          ? realWidth
          : this._titleOption.width,
      height:
        this._titleOption.orient === 'left' || this._titleOption.orient === 'right'
          ? realHeight
          : this._titleOption.height,
      textStyle: {
        width: realWidth,
        ...this._titleOption.textStyle
      },
      subtextStyle: {
        width: realWidth,
        ...this._titleOption.subtextStyle
      }
    });
    this._adjustTableSize(this._titleComponent.attribute);
  }

  _adjustTableSize(attrs: TitleAttrs) {
    // 调整位置
    const width = isFinite(this._titleComponent?.AABBBounds.width()) ? this._titleComponent.AABBBounds.width() : 0;
    const height = isFinite(this._titleComponent?.AABBBounds.height()) ? this._titleComponent.AABBBounds.height() : 0;
    // const rectWidth = this.table.tableNoFrameWidth;
    // const rectHeight = this.table.tableNoFrameHeight;
    // const padding = getQuadProps((attrs.padding as number | number[]) ?? this._titleOption.padding ?? 10);

    // let x = 0;
    // let y = 0;
    // if (this._titleOption.orient === 'left') {
    //   x = padding[3];
    //   y = 0;
    //   // width += padding[1] + padding[3];
    // } else if (this._titleOption.orient === 'top') {
    //   x = 0;
    //   y = padding[0];
    //   // height += padding[0] + padding[2];
    // } else if (this._titleOption.orient === 'right') {
    //   x = rectWidth - width - padding[1];
    //   y = 0;
    //   width += padding[1] + padding[3];
    // } else if (this._titleOption.orient === 'bottom') {
    //   x = 0;
    //   y = rectHeight - height - padding[2];
    //   // height += padding[0] + padding[2];
    // }
    if (this._titleOption.orient === 'left') {
      this.table.tableNoFrameWidth = this.table.tableNoFrameWidth - Math.ceil(width);
      this.table.tableX += Math.ceil(width);
    } else if (this._titleOption.orient === 'top') {
      this.table.tableNoFrameHeight = this.table.tableNoFrameHeight - Math.ceil(height);
      this.table.tableY += Math.ceil(height);
    } else if (this._titleOption.orient === 'right') {
      this.table.tableNoFrameWidth = this.table.tableNoFrameWidth - Math.ceil(width);
    } else if (this._titleOption.orient === 'bottom') {
      this.table.tableNoFrameHeight = this.table.tableNoFrameHeight - Math.ceil(height);
    }
    this._cacheAttrs = attrs;
    if (this._titleOption.orient === 'right' || this._titleOption.orient === 'bottom') {
      this._titleComponent.setAttributes({
        x:
          this._titleOption.x ?? this._titleOption.orient === 'right'
            ? this.table.tableX + this.table.tableNoFrameWidth
            : this.table.tableX,
        y:
          this._titleOption.y ?? this._titleOption.orient === 'bottom'
            ? this.table.tableY + this.table.tableNoFrameHeight
            : this.table.tableY
      });
    }
  }

  release(): void {
    this._titleComponent && this.table.scenegraph.stage.defaultLayer.removeChild(this._titleComponent);
    this._titleComponent = null;
    this.isReleased = true;
  }
  private _getTitleAttrs() {
    const defaultPadding = this._titleOption.text || this._titleOption.subtext ? 10 : 0;
    const padding = getQuadProps(this._titleOption.padding ?? defaultPadding);
    const realWidth =
      this._titleOption.width ??
      Math.min(this.table.tableNoFrameWidth, this.table.getDrawRange().width) - padding[1] - padding[3];
    const realHeight =
      this._titleOption.height ??
      Math.min(this.table.tableNoFrameHeight, this.table.getDrawRange().height) - padding[0] - padding[2];
    return {
      text: this._titleOption.text ?? '',
      subtext: this._titleOption.subtext ?? '',
      x:
        this._titleOption.x ?? this._titleOption.orient === 'right'
          ? this.table.tableX + Math.min(this.table.tableNoFrameWidth, this.table.getDrawRange().width)
          : this.table.tableX,
      y:
        this._titleOption.y ?? this._titleOption.orient === 'bottom'
          ? this.table.tableY + this.table.tableNoFrameHeight
          : this.table.tableY,
      width:
        this._titleOption.orient === 'top' || this._titleOption.orient === 'bottom'
          ? realWidth
          : this._titleOption.width,
      height:
        this._titleOption.orient === 'left' || this._titleOption.orient === 'right'
          ? realHeight
          : this._titleOption.height,
      minWidth: this._titleOption.minWidth,
      maxWidth: this._titleOption.maxWidth,
      minHeight: this._titleOption.minHeight,
      maxHeight: this._titleOption.maxHeight,
      padding: this._titleOption.padding,
      align: this._titleOption.align ?? 'left',
      verticalAlign: this._titleOption.verticalAlign ?? 'top',
      textStyle: {
        width: realWidth,
        ...this._titleOption.textStyle
      },
      subtextStyle: {
        width: realWidth,
        ...this._titleOption.subtextStyle
      },
      dx: this._titleOption.dx ?? 0,
      dy: this._titleOption.dy ?? 0
    } as TitleAttrs;
  }

  getComponentGraphic() {
    return this._titleComponent;
  }
}
