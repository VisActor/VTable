/* eslint-disable no-undef */
import type { Cursor, IImage, Image, IThemeSpec } from '@src/vrender';
import { createImage } from '@src/vrender';
import * as icons from '../../../icons';
import { Group } from '../../graphic/group';
import { calcKeepAspectRatioSize } from '../../utils/keep-aspect-ratio';
import { calcStartPosition } from '../../utils/cell-pos';
import type { Scenegraph } from '../../scenegraph';
import { getProp, getFunctionalProp } from '../../utils/get-prop';
import { isValid } from '@visactor/vutils';
import { getQuadProps } from '../../utils/padding';
import { getCellBorderStrokeWidth } from '../../utils/cell-border-stroke-width';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import type { CellRange } from '../../../ts-types';
import { dealWithIconLayout } from '../../utils/text-icon-layout';

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
  mayHaveIcon: boolean,
  table: BaseTableAPI,
  cellTheme: IThemeSpec,
  range: CellRange | undefined,
  isAsync: boolean
) {
  const headerStyle = table._getCellStyle(col, row); // to be fixed
  const functionalPadding = getFunctionalProp('padding', headerStyle, col, row, table);
  // const margin = getProp('padding', headerStyle, col, row, table);
  if (table.options.customConfig?.imageMargin) {
    padding = getQuadProps(table.options.customConfig?.imageMargin);
  } else if (isValid(functionalPadding)) {
    padding = functionalPadding;
  }
  if (cellTheme?.text?.textAlign) {
    textAlign = cellTheme?.text?.textAlign;
  }
  if (cellTheme?.text?.textBaseline) {
    textBaseline = cellTheme?.text?.textBaseline;
  }

  // cell
  const strokeArrayWidth = getCellBorderStrokeWidth(col, row, cellTheme, table);

  let cellGroup: Group;
  if (isAsync) {
    cellGroup = table.scenegraph.highPerformanceGetCell(col, row, true);
    if (cellGroup && cellGroup.role === 'cell') {
      cellGroup.setAttributes({
        x: xOrigin,
        y: yOrigin,
        width,
        height,
        // 背景相关，cell背景由cellGroup绘制
        lineWidth: cellTheme?.group?.lineWidth ?? undefined,
        fill: cellTheme?.group?.fill ?? undefined,
        stroke: cellTheme?.group?.stroke ?? undefined,
        strokeArrayWidth: strokeArrayWidth ?? undefined,
        strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
        cursor: (cellTheme?.group as any)?.cursor ?? undefined,
        lineDash: cellTheme?.group?.lineDash ?? undefined,
        lineCap: 'butt',
        clip: true,
        cornerRadius: cellTheme.group.cornerRadius
      } as any);
    }
  }
  if (!cellGroup || cellGroup.role !== 'cell') {
    cellGroup = new Group({
      x: xOrigin,
      y: yOrigin,
      width,
      height,
      // 背景相关，cell背景由cellGroup绘制
      lineWidth: cellTheme?.group?.lineWidth ?? undefined,
      fill: cellTheme?.group?.fill ?? undefined,
      stroke: cellTheme?.group?.stroke ?? undefined,
      strokeArrayWidth: strokeArrayWidth ?? undefined,
      strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
      cursor: (cellTheme?.group as any)?.cursor ?? undefined,
      lineDash: cellTheme?.group?.lineDash ?? undefined,
      lineCap: 'butt',
      clip: true,
      cornerRadius: cellTheme.group.cornerRadius
    } as any);
    cellGroup.role = 'cell';
    cellGroup.col = col;
    cellGroup.row = row;
    columnGroup?.addCellGroup(cellGroup);
  }

  let cellIcons;
  if (mayHaveIcon) {
    let iconCol = col;
    let iconRow = row;
    if (range) {
      iconCol = range.start.col;
      iconRow = range.start.row;
    }
    cellIcons = table.getCellIcons(iconCol, iconRow);
  }

  let iconWidth = 0;
  let cellLeftIconWidth = 0;
  let cellRightIconWidth = 0;
  if (Array.isArray(cellIcons) && cellIcons.length !== 0) {
    const { leftIconWidth, rightIconWidth, absoluteLeftIconWidth, absoluteRightIconWidth } = dealWithIconLayout(
      cellIcons,
      cellGroup,
      range,
      table
    );

    iconWidth = leftIconWidth + rightIconWidth;
    cellLeftIconWidth = leftIconWidth;
    cellRightIconWidth = rightIconWidth;

    // 更新各个部分横向位置
    cellGroup.forEachChildren((child: any) => {
      if (child.role === 'icon-left') {
        child.setAttribute('x', child.attribute.x + padding[3]);
      } else if (child.role === 'icon-right') {
        child.setAttribute('x', child.attribute.x + width - rightIconWidth - padding[1]);
      } else if (child.role === 'icon-absolute-right') {
        child.setAttribute('x', child.attribute.x + width - absoluteRightIconWidth - padding[1]);
      }
    });

    // 更新各个部分纵向位置
    cellGroup.forEachChildren((child: any) => {
      if (textBaseline === 'middle') {
        child.setAttribute('y', (height - child.AABBBounds.height()) / 2);
      } else if (textBaseline === 'bottom') {
        child.setAttribute('y', height - child.AABBBounds.height() - padding[2]);
      } else {
        child.setAttribute('y', padding[0]);
      }
    });

    (cellGroup as any)._cellLeftIconWidth = cellLeftIconWidth;
    (cellGroup as any)._cellRightIconWidth = cellRightIconWidth;
  }

  // image
  const value = table.getCellValue(col, row);
  const image: IImage = createImage({
    x: padding[3],
    y: padding[0],
    width: width - padding[1] - padding[3] - iconWidth,
    height: height - padding[0] - padding[2],
    image: value, //?? (regedIcons.damage_pic as any).svg,
    cursor: 'pointer' as Cursor
  });
  image.name = 'image';
  image.keepAspectRatio = keepAspectRatio;
  image.textAlign = textAlign;
  image.textBaseline = textBaseline;
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
      updateImageCellContentWhileResize(cellGroup, col, row, 0, 0, table);
    } else {
      image.successCallback = () => {
        updateImageCellContentWhileResize(cellGroup, col, row, 0, 0, table);
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

export type CreateImageCellGroup = typeof createImageCellGroup;

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

export function updateImageCellContentWhileResize(
  cellGroup: Group,
  col: number,
  row: number,
  deltaX: number,
  deltaY: number,
  table: BaseTableAPI
) {
  const image = cellGroup.getChildByName('image') as Image;
  if (!image) {
    return;
  }
  const originImage =
    (typeof image.attribute.image !== 'string' && image.attribute.image) ||
    image.resources?.get(image.attribute.image as string).data;

  if (!originImage) {
    return;
  }

  const headerStyle = table._getCellStyle(col, row); // to be fixed
  const textAlign = getProp('textAlign', headerStyle, col, row, table) ?? 'left';
  const textBaseline = getProp('textBaseline', headerStyle, col, row, table) ?? 'middle';
  let padding: [number, number, number, number];
  if (table.options.customConfig?.imageMargin) {
    padding = getQuadProps(table.options.customConfig?.imageMargin);
  } else {
    padding = getQuadProps(getProp('padding', headerStyle, col, row, table)) ?? [0, 0, 0, 0];
  }

  const { width: cellWidth, height: cellHeight, isMerge } = getCellRange(cellGroup, table);
  const colStart = cellGroup.mergeStartCol ?? cellGroup.col;
  const rowStart = cellGroup.mergeStartRow ?? cellGroup.row;
  const colEnd = cellGroup.mergeEndCol ?? cellGroup.col;
  const rowEnd = cellGroup.mergeEndCol ?? cellGroup.row;

  const leftIconWidth = (cellGroup as any)._cellLeftIconWidth ?? 0;
  const rightIconWidth = (cellGroup as any)._cellRightIconWidth ?? 0;

  if ((image as any).keepAspectRatio) {
    const { width: imageWidth, height: imageHeight } = calcKeepAspectRatioSize(
      originImage.width || (originImage as any).videoWidth,
      originImage.height || (originImage as any).videoHeight,
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

    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const cellGroup = table.scenegraph.getCell(col, row);
        const image = cellGroup.getChildByName('image') as Image;
        image?.setAttributes({
          x: pos.x,
          y: pos.y,
          width: imageWidth,
          height: imageHeight
        });
      }
    }
  } else {
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const cellGroup = table.scenegraph.getCell(col, row);
        const image = cellGroup.getChildByName('image') as Image;
        image?.setAttributes({
          x: leftIconWidth + padding[3],
          y: padding[0],
          // width: cellGroup.attribute.width - padding[1] - padding[3],
          // height: cellGroup.attribute.height - padding[0] - padding[2]
          width: cellWidth - padding[1] - padding[3] - rightIconWidth - leftIconWidth,
          height: cellHeight - padding[0] - padding[2]
        });
      }
    }
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

    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const cellGroup = table.scenegraph.getCell(col, row);
        const playIcon = cellGroup.getChildByName('play-icon') as Image;
        playIcon.setAttributes({
          x: anchorX - iconSize / 2,
          y: anchorY - iconSize / 2,
          width: iconSize,
          height: iconSize
        });
      }
    }
  }

  // 更新x方向位置
  cellGroup.forEachChildren((child: any) => {
    if (child.role === 'icon-left') {
      // do nothing
    } else if (child.role === 'icon-right') {
      child.setAttribute('x', child.attribute.x + deltaX);
    } else if (child.role === 'icon-absolute-right') {
      child.setAttribute('x', child.attribute.x + deltaX);
    }
  });

  // 更新y方向位置
  cellGroup.forEachChildren((child: any) => {
    if (child.type !== 'rect' && (!child.role || !child.role.startsWith('icon'))) {
      // do nothing
    } else if (textBaseline === 'middle') {
      child.setAttribute('y', padding[0] + (cellHeight - padding[0] - padding[2] - child.AABBBounds.height()) / 2);
    } else if (textBaseline === 'bottom') {
      child.setAttribute('y', padding[0] + cellHeight - padding[0] - padding[2] - child.AABBBounds.height());
    } else {
      child.setAttribute('y', padding[0]);
    }
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

export function getCellRange(cellGroup: Group, table: BaseTableAPI) {
  if (
    cellGroup.role === 'cell' &&
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

export function updateImageDxDy(
  startCol: number,
  endCol: number,
  startRow: number,
  endRow: number,
  table: BaseTableAPI
) {
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
        const playIcon = cellGroup.getChildByName('play-icon');
        if (playIcon) {
          playIcon.setAttributes({
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
  image: IImage,
  cellGroup: Group,
  table: BaseTableAPI
) {
  const originImage = image.resources.get(image.attribute.image as string).data;
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
