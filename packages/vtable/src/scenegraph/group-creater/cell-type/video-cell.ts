/* eslint-disable no-undef */
import type { Cursor, IImage, IThemeSpec } from '@src/vrender';
import { createRect, createImage } from '@src/vrender';
import * as icons from '../../../icons';
import { Group } from '../../graphic/group';
import { calcKeepAspectRatioSize } from '../../utils/keep-aspect-ratio';
import { Icon } from '../../graphic/icon';
import { calcStartPosition } from '../../utils/cell-pos';
import { _adjustWidthHeight, getCellRange, updateImageDxDy } from './image-cell';
import { getFunctionalProp, getProp } from '../../utils/get-prop';
import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { getCellBorderStrokeWidth } from '../../utils/cell-border-stroke-width';
import { getQuadProps } from '../../utils/padding';
import type { CellRange } from '../../../ts-types';
import { dealWithIconLayout } from '../../utils/text-icon-layout';

const regedIcons = icons.get();

export function createVideoCellGroup(
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
        strokeArrayWidth: strokeArrayWidth,
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
      strokeArrayWidth: strokeArrayWidth,
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

  // video
  const value = table.getCellValue(col, row);
  const video = document.createElement('video');
  video.addEventListener('loadeddata', (): void => {
    if (imageAutoSizing) {
      _adjustWidthHeight(col, row, video.videoWidth, video.videoHeight, table.scenegraph, padding, cellGroup);
    }
    // const width = cellGroup.attribute.width;
    // const height = cellGroup.attribute.height;
    // 更新宽高
    const { width: cellWidth, height: cellHeight, isMerge } = getCellRange(cellGroup, table);
    if (keepAspectRatio) {
      const { width: videoWidth, height: videoHeight } = calcKeepAspectRatioSize(
        video.videoWidth,
        video.videoHeight,
        cellWidth - padding[1] - padding[3],
        cellHeight - padding[0] - padding[2]
      );
      const pos = calcStartPosition(
        0,
        0,
        cellWidth,
        cellHeight,
        videoWidth,
        videoHeight,
        textAlign,
        textBaseline,
        padding
      );

      image.setAttributes({
        width: videoWidth,
        height: videoHeight,
        x: pos.x,
        y: pos.y,
        dx: 0
      });
    } else {
      // const { width: cellWidth, height: cellHeight } = getCellRange(cellGroup, table);
      image.setAttributes({
        x: padding[3],
        y: padding[0],
        width: cellWidth - padding[1] - padding[3],
        height: cellHeight - padding[2] - padding[0],
        dy: 0
      });
    }

    if (isMerge) {
      updateImageDxDy(
        cellGroup.mergeStartCol,
        cellGroup.mergeEndCol,
        cellGroup.mergeStartRow,
        cellGroup.mergeEndRow,
        table
      );
    }

    const left = 0;
    const top = 0;
    // 播放按钮
    // const iconSize = Math.floor(Math.min(width - padding[1] - padding[3], height - padding[2] - padding[0]) / 2);
    // const anchorX =
    //   left + (width > image.attribute.width ? image.attribute.x - left + image.attribute.width / 2 : width / 2);
    // const anchorY =
    //   top + (height > image.attribute.height ? image.attribute.y - top + image.attribute.height / 2 : height / 2);
    const { width, height } = getCellRange(cellGroup, table);
    const iconSize = Math.floor(Math.min(width - padding[1] - padding[3], height - padding[2] - padding[0]) / 2);
    const anchorX =
      left + (width > image.attribute.width ? image.attribute.x - left + image.attribute.width / 2 : width / 2);
    const anchorY =
      top + (height > image.attribute.height ? image.attribute.y - top + image.attribute.height / 2 : height / 2);

    const playIcon: Icon = new Icon({
      x: anchorX - iconSize / 2,
      y: anchorY - iconSize / 2,
      width: iconSize,
      height: iconSize,
      image: (regedIcons.play as any).svg,
      cursor: (regedIcons.play as any).cursor
    });
    playIcon.name = 'play-icon';
    cellGroup.appendChild(playIcon);
    // 触发重绘
    table.scenegraph.updateNextFrame();
  });
  video.onerror = (): void => {
    // image.setAttribute('image', (regedIcons.damage_pic as any).svg);
    (image as any).image = (regedIcons.damage_pic as any).svg;
  };
  video.src = value;
  video.setAttribute('preload', 'auto');

  const image: IImage = createImage({
    x: padding[3],
    y: padding[0],
    width: width - padding[1] - padding[3],
    height: height - padding[2] - padding[0],
    image: video as any,
    cursor: 'pointer' as Cursor
  });
  image.name = 'image';
  image.keepAspectRatio = keepAspectRatio;
  image.textAlign = textAlign;
  image.textBaseline = textBaseline;
  cellGroup.appendChild(image);

  return cellGroup;
}

export type CreateVideoCellGroup = typeof createVideoCellGroup;
