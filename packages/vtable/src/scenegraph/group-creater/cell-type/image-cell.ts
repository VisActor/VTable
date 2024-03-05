// @ts-nocheck
/* eslint-disable no-undef */
import type { IImage, Image, IThemeSpec } from '@src/vrender';
import { createImage } from '@src/vrender';
import type { BaseTableAPI } from '../../../ts-types';
import * as icons from '../../../icons';
import { Group } from '../../graphic/group';
import { calcKeepAspectRatioSize } from '../../utils/keep-aspect-ratio';
import { calcStartPosition } from '../../utils/cell-pos';
import type { Scenegraph } from '../../scenegraph';
import { getProp, getFunctionalProp } from '../../utils/get-prop';
import { isValid } from '@visactor/vutils';
import { getQuadProps } from '../../utils/padding';

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
  cellTheme: IThemeSpec
) {
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
    lineDash: cellTheme?.group?.lineDash ?? undefined,

    lineCap: 'square',

    clip: true,

    cornerRadius: cellTheme.group.cornerRadius
  });
  cellGroup.role = 'cell';
  cellGroup.col = col;
  cellGroup.row = row;
  // columnGroup?.addChild(cellGroup);
  columnGroup?.addCellGroup(cellGroup);

  // image
  const value = table.getCellValue(col, row);
  const image: IImage = createImage({
    x: padding[3],
    y: padding[0],
    width: width - padding[1] - padding[3],
    height: height - padding[0] - padding[2],
    image: value, //?? (regedIcons.damage_pic as any).svg,
    cursor: 'pointer' as Cursor
  });
  image.name = 'image';
  image.keepAspectRatio = keepAspectRatio;
  if (keepAspectRatio || imageAutoSizing) {
    if (
      image.resources &&
      image.resources.has(image.attribute.image) &&
      image.resources.get(image.attribute.image).state === 'success'
    ) {
      setTimeout(() => {
        updateAutoSizingAndKeepAspectRatio(
          imageAutoSizing,
          keepAspectRatio,
          padding,
          textAlign,
          textBaseline,
          image,
          cellGroup,
          table
        );
      }, 0);
    } else {
      image.successCallback = () => {
        updateAutoSizingAndKeepAspectRatio(
          imageAutoSizing,
          keepAspectRatio,
          padding,
          textAlign,
          textBaseline,
          image,
          cellGroup,
          table
        );
        table.scenegraph.updateNextFrame();
      };
    }
  } else {
    if (
      image.resources &&
      image.resources.has(image.attribute.image) &&
      image.resources.get(image.attribute.image).state === 'success'
    ) {
      updateImageCellContentWhileResize(cellGroup, col, row, table);
    } else {
      image.successCallback = () => {
        updateImageCellContentWhileResize(cellGroup, col, row, table);
      };
    }
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
  padding: [number, number, number, number],
  cellGroup: Group
): boolean {
  // const { width, height } = img as any;
  // const currentContext = context.toCurrentContext();

  let needInvalidate = false;
  let targetWidth: number = null;
  let targetHeight: number = null;
  // const cellGroup = scene.getCell(col, row, true);
  const { width: cellWidth, height: cellHeight, isMerge } = getCellRange(cellGroup, scene.table);

  if (cellWidth < width + padding[1] + padding[3]) {
    targetWidth = width + padding[1] + padding[3];
    needInvalidate = true;
  }
  if (cellHeight < height + padding[2] + padding[0]) {
    targetHeight = height + padding[2] + padding[0];
    needInvalidate = true;
  }
  if (needInvalidate) {
    if (typeof targetWidth === 'number') {
      // table.setColWidth(col, targetWidth, true);
      if (isMerge) {
        for (let col = cellGroup.mergeStartCol; col <= cellGroup.mergeEndCol; col++) {
          scene.setColWidth(col, targetWidth / (cellGroup.mergeEndCol - cellGroup.mergeStartCol + 1));
        }
      } else {
        scene.setColWidth(col, targetWidth);
      }
    }
    if (typeof targetHeight === 'number') {
      // table.setRowHeight(row, targetHeight, true);
      if (isMerge) {
        for (let row = cellGroup.mergeStartRow; row <= cellGroup.mergeEndRow; row++) {
          scene.setRowHeight(row, targetHeight / (cellGroup.mergeEndRow - cellGroup.mergeStartRow + 1));
        }
      } else {
        scene.setRowHeight(row, targetHeight);
      }
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
  if (!image) {
    return;
  }
  const originImage =
    (typeof image.attribute.image !== 'string' && image.attribute.image) ||
    image.resources?.get(image.attribute.image).data;

  if (!originImage) {
    return;
  }

  const headerStyle = table._getCellStyle(col, row); // to be fixed
  const textAlign = getProp('textAlign', headerStyle, col, row, table) ?? 'left';
  const textBaseline = getProp('textBaseline', headerStyle, col, row, table) ?? 'middle';
  const padding = getQuadProps(getProp('padding', headerStyle, col, row, table)) ?? [0, 0, 0, 0];

  if (image.keepAspectRatio) {
    const { width: cellWidth, height: cellHeight } = getCellRange(cellGroup, table);

    const { width: imageWidth, height: imageHeight } = calcKeepAspectRatioSize(
      originImage.width || originImage.videoWidth,
      originImage.height || originImage.videoHeight,
      // cellGroup.attribute.width - (padding[1] + padding[3]),
      // cellGroup.attribute.height - (padding[0] + padding[2])
      cellWidth - (padding[1] + padding[3]),
      cellHeight - (padding[0] + padding[2])
    );

    const pos = calcStartPosition(
      0,
      0,
      // cellGroup.attribute.width,
      // cellGroup.attribute.height,
      cellWidth,
      cellHeight,
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
    const { width: cellWidth, height: cellHeight } = getCellRange(cellGroup, table);

    image.setAttributes({
      x: padding[3],
      y: padding[0],
      // width: cellGroup.attribute.width - padding[1] - padding[3],
      // height: cellGroup.attribute.height - padding[0] - padding[2]
      width: cellWidth - padding[1] - padding[3],
      height: cellHeight - padding[0] - padding[2]
    });
  }

  // update video play icon
  const playIcon = cellGroup.getChildByName('play-icon');
  if (playIcon) {
    const left = 0;
    const top = 0;
    // const width = cellGroup.attribute.width;
    // const height = cellGroup.attribute.height;
    const { width, height } = getCellRange(cellGroup, table);
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

function getCellRange(cellGroup: Group, table: BaseTableAPI) {
  if (
    isValid(cellGroup.mergeStartCol) &&
    isValid(cellGroup.mergeEndCol) &&
    isValid(cellGroup.mergeStartRow) &&
    isValid(cellGroup.mergeEndRow)
  ) {
    return {
      width: table.getColsWidth(cellGroup.mergeStartCol, cellGroup.mergeEndCol),
      height: table.getRowsHeight(cellGroup.mergeStartRow, cellGroup.mergeEndRow),
      isMerge: true
    };
  }
  return {
    width: cellGroup.attribute.width,
    height: cellGroup.attribute.height,
    isMerge: false
  };
}

function updateImageDxDy(startCol, endCol, startRow, endRow, table) {
  for (let col = startCol; col <= endCol; col++) {
    for (let row = startRow; row <= endRow; row++) {
      const cellGroup = table.scenegraph.getCell(col, row);
      if (cellGroup) {
        const image = cellGroup.getChildByName('image');
        if (image) {
          image.setAttributes({
            dx: -table.getColsWidth(cellGroup.mergeStartCol, col - 1),
            dy: -table.getRowsHeight(cellGroup.mergeStartRow, row - 1)
          });
        }
      }
    }
  }
}

function updateAutoSizingAndKeepAspectRatio(
  imageAutoSizing: boolean,
  keepAspectRatio: boolean,
  padding: [number, number, number, number],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  image: Image,
  cellGroup: Group,
  table: BaseTableAPI
) {
  const originImage = image.resources.get(image.attribute.image).data;
  const { col, row } = cellGroup;

  if (imageAutoSizing && !isDamagePic(image)) {
    _adjustWidthHeight(
      col,
      row,
      (originImage as HTMLImageElement).width,
      (originImage as HTMLImageElement).height,
      table.scenegraph,
      padding,
      cellGroup
    );
  }
  if (keepAspectRatio || isDamagePic(image)) {
    const { width: cellWidth, height: cellHeight, isMerge } = getCellRange(cellGroup, table);

    const { width: imageWidth, height: imageHeight } = calcKeepAspectRatioSize(
      originImage.width,
      originImage.height,
      // cellGroup.attribute.width - padding[1] - padding[3],
      // cellGroup.attribute.height - padding[0] - padding[2]
      cellWidth - padding[1] - padding[3],
      cellHeight - padding[0] - padding[2]
    );

    // const left = 0;
    // const top = 0;
    const pos = calcStartPosition(
      0,
      0,
      // cellGroup.attribute.width,
      // cellGroup.attribute.height,
      cellWidth,
      cellHeight,
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
      // dx: isMerge ? -table.getColsWidth(cellGroup.mergeStartCol, col - 1) : 0,
      // dy: isMerge ? -table.getRowsHeight(cellGroup.mergeStartRow, row - 1) : 0
    });

    if (isMerge) {
      updateImageDxDy(
        cellGroup.mergeStartCol,
        cellGroup.mergeEndCol,
        cellGroup.mergeStartRow,
        cellGroup.mergeEndRow,
        table
      );
    }
  }
}

function isDamagePic(image: IImage) {
  const regedIcons = icons.get();
  return image.attribute.image === (regedIcons.damage_pic as any).svg;
}
