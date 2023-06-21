// @ts-nocheck
/* eslint-disable no-undef */
import type { IImage, Image, IThemeSpec } from '@visactor/vrender';
import { createImage } from '@visactor/vrender';
import type { BaseTableAPI } from '../../../ts-types';
import * as icons from '../../../icons';
import { Group } from '../../graphic/group';
import { calcKeepAspectRatioSize } from '../../utils/keep-aspect-ratio';
import { calcStartPosition } from '../../utils/cell-pos';
import type { Scenegraph } from '../../scenegraph';
import { getProp, getFunctionalProp } from '../../utils/get-prop';
import { getCellTheme } from './text-cell';
import { isValid } from '../../../tools/util';
import { getPadding } from '../../utils/padding';

const regedIcons = icons.get();

export function createImageCellGroup(
  columnGroup: Group,
  xOrigin: number,
  yOrigin: number,
  col: number,
  row: number,
  width: number,
  height: number,
  keepAspectRatio: boolean,
  imageAutoSizing: boolean,
  padding: [number, number, number, number],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  table: BaseTableAPI,
  cellTheme?: IThemeSpec
) {
  cellTheme = getCellTheme(table, col, row, cellTheme);
  const headerStyle = table._getCellStyle(col, row); // to be fixed
  const functionalPadding = getFunctionalProp('padding', headerStyle, col, row, table);
  // const margin = getProp('padding', headerStyle, col, row, table);
  if (isValid(functionalPadding)) {
    padding = functionalPadding;
  }
  if (cellTheme?.text?.textAlign) {
    textAlign = cellTheme?.text?.textAlign;
  }
  if (cellTheme?.text?.textBaseline) {
    textBaseline = cellTheme?.text?.textBaseline;
  }

  // cell
  const cellGroup = new Group({
    x: xOrigin,
    y: yOrigin,
    width,
    height,
    // childrenPickable: false,

    // 背景相关，cell背景由cellGroup绘制
    lineWidth: cellTheme?.group?.lineWidth ?? undefined,
    fill: cellTheme?.group?.fill ?? undefined,
    stroke: cellTheme?.group?.stroke ?? undefined,
    strokeArrayWidth: (cellTheme?.group as any)?.strokeArrayWidth ?? undefined,
    strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
    cursor: (cellTheme?.group as any)?.cursor ?? undefined,

    lineCap: 'square',

    clip: true
  });
  cellGroup.role = 'cell';
  cellGroup.col = col;
  cellGroup.row = row;
  columnGroup.addChild(cellGroup);

  // image
  const value = table.getCellValue(col, row);
  const image: IImage = createImage({
    x: padding[3],
    y: padding[0],
    width: width - padding[1] - padding[3],
    height: height - padding[0] - padding[2],
    image: value ?? (regedIcons.damage_pic as any).svg,
    cursor: 'pointer' as Cursor
  });
  image.name = 'image';
  image.keepAspectRatio = keepAspectRatio;
  if (keepAspectRatio || imageAutoSizing) {
    image.successCallback = () => {
      const originImage = image.resources.get(image.attribute.image).data;

      if (imageAutoSizing) {
        _adjustWidthHeight(
          col,
          row,
          (originImage as HTMLImageElement).width,
          (originImage as HTMLImageElement).height,
          table.scenegraph,
          padding
        );
      }

      if (keepAspectRatio) {
        const { width: imageWidth, height: imageHeight } = calcKeepAspectRatioSize(
          originImage.width,
          originImage.height,
          cellGroup.attribute.width - padding[1] - padding[3],
          cellGroup.attribute.height - padding[0] - padding[2]
        );

        // const left = 0;
        // const top = 0;
        const pos = calcStartPosition(
          0,
          0,
          cellGroup.attribute.width,
          cellGroup.attribute.height,
          imageWidth,
          imageHeight,
          textAlign,
          textBaseline,
          padding
        );

        image.setAttributes({
          x: pos.x,
          y: pos.y,
          width: imageWidth,
          height: imageHeight
        });
      }

      table.scenegraph.updateNextFrame();
    };
  } else {
    image.successCallback = () => {
      updateImageCellContentWhileResize(cellGroup, col, row, table);
    };
  }
  (image as any).failCallback = () => {
    const regedIcons = icons.get();
    // image.setAttribute('image', (regedIcons.damage_pic as any).svg);
    (image as any).image = (regedIcons.damage_pic as any).svg;
  };
  cellGroup.appendChild(image);

  return cellGroup;
}

/**
 * 调整某个图片资源所在行列的行高列宽 之后重绘
 * @param col
 * @param row
 * @param img
 * @param table
 * @returns 行高或者列宽是否进行了调整
 */
export function _adjustWidthHeight(
  col: number,
  row: number,
  // img: HTMLImageElement,
  width: number,
  height: number,
  scene: Scenegraph,
  padding: [number, number, number, number]
): boolean {
  // const { width, height } = img as any;
  // const currentContext = context.toCurrentContext();

  let needInvalidate = false;
  let targetWidth: number = null;
  let targetHeight: number = null;
  if (scene.table.getColWidth(col) < width + padding[1] + padding[3]) {
    targetWidth = width + padding[1] + padding[3];
    needInvalidate = true;
  }
  if (scene.table.getRowHeight(row) < height + padding[2] + padding[0]) {
    targetHeight = height + padding[2] + padding[0];
    needInvalidate = true;
  }
  if (needInvalidate) {
    if (typeof targetWidth === 'number') {
      // table.setColWidth(col, targetWidth, true);
      scene.setColWidth(col, targetWidth);
    }
    if (typeof targetHeight === 'number') {
      // table.setRowHeight(row, targetHeight, true);
      scene.setRowHeight(row, targetHeight);
    }
    // table.updateCanvasScroll();
    // // table.throttleInvalidate(); // 这里会造成每一张图加载后就重绘 造成多次绘制问题！节流绘制
    // table.invalidate(); //节流绘制改回及时绘制 节流绘制在图片加载过程中的效果不太好

    scene.component.updateScrollBar();
    // scene.updateNextFrame();
    return true;
  }
  return false;
}

export function updateImageCellContentWhileResize(cellGroup: Group, col: number, row: number, table: BaseTableAPI) {
  const image = cellGroup.getChildByName('image') as Image;
  const originImage =
    (typeof image.attribute.image !== 'string' && image.attribute.image) ||
    image.resources.get(image.attribute.image).data;

  if (!originImage) {
    return;
  }

  const headerStyle = table._getCellStyle(col, row); // to be fixed
  const textAlign = getProp('textAlign', headerStyle, col, row, table) ?? 'left';
  const textBaseline = getProp('textBaseline', headerStyle, col, row, table) ?? 'middle';
  const padding = getPadding(getProp('padding', headerStyle, col, row, table)) ?? [0, 0, 0, 0];

  if (image.keepAspectRatio) {
    const { width: imageWidth, height: imageHeight } = calcKeepAspectRatioSize(
      originImage.width || originImage.videoWidth,
      originImage.height || originImage.videoHeight,
      cellGroup.attribute.width - (padding[1] + padding[3]),
      cellGroup.attribute.height - (padding[0] + padding[2])
    );

    const pos = calcStartPosition(
      0,
      0,
      cellGroup.attribute.width,
      cellGroup.attribute.height,
      imageWidth,
      imageHeight,
      textAlign,
      textBaseline,
      padding
    );

    image.setAttributes({
      x: pos.x,
      y: pos.y,
      width: imageWidth,
      height: imageHeight
    });
  } else {
    image.setAttributes({
      x: padding[3],
      y: padding[0],
      width: cellGroup.attribute.width - padding[1] - padding[3],
      height: cellGroup.attribute.height - padding[0] - padding[2]
    });
  }

  // update video play icon
  const playIcon = cellGroup.getChildByName('play-icon');
  if (playIcon) {
    const left = 0;
    const top = 0;
    const width = cellGroup.attribute.width;
    const height = cellGroup.attribute.height;
    const iconSize = Math.floor(Math.min(width - padding[1] - padding[3], height - padding[2] - padding[0]) / 2);
    const anchorX =
      left + (width > image.attribute.width ? image.attribute.x - left + image.attribute.width / 2 : width / 2);
    const anchorY =
      top + (height > image.attribute.height ? image.attribute.y - top + image.attribute.height / 2 : height / 2);

    playIcon.setAttributes({
      x: anchorX - iconSize / 2,
      y: anchorY - iconSize / 2,
      width: iconSize,
      height: iconSize
    });
  }
}
