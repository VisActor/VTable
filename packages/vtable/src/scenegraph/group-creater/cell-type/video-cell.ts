/* eslint-disable no-undef */
import type { Cursor, IImage, IThemeSpec } from '@src/vrender';
import { createRect, createImage } from '@src/vrender';
import * as icons from '../../../icons';
import { Group } from '../../graphic/group';
import { calcKeepAspectRatioSize } from '../../utils/keep-aspect-ratio';
import { Icon } from '../../graphic/icon';
import { calcStartPosition } from '../../utils/cell-pos';
import { _adjustWidthHeight, getCellRange, isDamagePic, updateAutoSizingAndKeepAspectRatio } from './image-cell';
import { getFunctionalProp, getProp } from '../../utils/get-prop';
import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { getCellBorderStrokeWidth } from '../../utils/cell-border-stroke-width';
import { getQuadProps } from '../../utils/padding';
import type { CellRange } from '../../../ts-types';
import { dealWithIconLayout } from '../../utils/text-icon-layout';
import { isAudioUrl } from '../../../tools/media';
import { audioIconSvg } from './audio-cell';
import {
  getCellMediaImage,
  isCellMedia,
  markCellMedia,
  removeCellMediaChildren,
  releaseVideoResource
} from './media-cell-helper';

const regedIcons = icons.get();

function updateVideoMediaDxDy(startCol: number, endCol: number, startRow: number, endRow: number, table: BaseTableAPI) {
  for (let col = startCol; col <= endCol; col++) {
    for (let row = startRow; row <= endRow; row++) {
      const cellGroup = table.scenegraph.getCell(col, row);
      if (cellGroup) {
        cellGroup.forEachChildren((child: any) => {
          if (isCellMedia(child)) {
            child.setAttributes({
              dx: -table.getColsWidth(cellGroup.mergeStartCol, col - 1),
              dy: -table.getRowsHeight(cellGroup.mergeStartRow, row - 1)
            });
          }
        });
      }
    }
  }
}

function getVideoFirstFrameTimeout(table: BaseTableAPI): number {
  const timeout = table.options.customConfig?.videoFirstFrameTimeout;
  return typeof timeout === 'number' && timeout >= 0 ? timeout : 8000;
}

function getVideoFirstFrameMaxCanvasSize(table: BaseTableAPI): number {
  const maxCanvasSize = table.options.customConfig?.videoFirstFrameMaxCanvasSize;
  return typeof maxCanvasSize === 'number' && maxCanvasSize > 0 ? maxCanvasSize : 512;
}

function snapshotVideoFirstFrame(video: HTMLVideoElement, image: IImage, table: BaseTableAPI): boolean {
  const displayWidth = image.attribute.width;
  const displayHeight = image.attribute.height;
  if (
    video.videoWidth <= 0 ||
    video.videoHeight <= 0 ||
    typeof displayWidth !== 'number' ||
    typeof displayHeight !== 'number' ||
    displayWidth <= 0 ||
    displayHeight <= 0
  ) {
    return false;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return false;
  }

  const dpr = Math.min((typeof window === 'undefined' ? 1 : window.devicePixelRatio) || 1, 2);
  const maxSize = getVideoFirstFrameMaxCanvasSize(table);
  const scale = Math.min(dpr, maxSize / Math.max(displayWidth, displayHeight));
  canvas.width = Math.max(1, Math.ceil(displayWidth * scale));
  canvas.height = Math.max(1, Math.ceil(displayHeight * scale));
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;

  try {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    image.setAttributes({ image: canvas as any });
    return true;
  } catch (err) {
    return false;
  }
}

function getSvgSize(svg: string): { width: number; height: number } | undefined {
  const svgTag = svg.match(/<svg\b[^>]*>/i)?.[0];
  if (!svgTag) {
    return undefined;
  }

  const widthMatch = svgTag.match(/\bwidth=["']?([\d.]+)/i);
  const heightMatch = svgTag.match(/\bheight=["']?([\d.]+)/i);
  const width = widthMatch ? Number(widthMatch[1]) : undefined;
  const height = heightMatch ? Number(heightMatch[1]) : undefined;
  if (width > 0 && height > 0) {
    return { width, height };
  }

  const viewBoxMatch = svgTag.match(/\bviewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
  const viewBoxWidth = viewBoxMatch ? Number(viewBoxMatch[1]) : undefined;
  const viewBoxHeight = viewBoxMatch ? Number(viewBoxMatch[2]) : undefined;
  if (viewBoxWidth > 0 && viewBoxHeight > 0) {
    return { width: viewBoxWidth, height: viewBoxHeight };
  }

  return undefined;
}

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
    cellGroup = columnGroup?.addCellGroup(cellGroup) ?? cellGroup;
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
  removeCellMediaChildren(cellGroup);
  if (isAudioUrl(value)) {
    const availableWidth = Math.max(1, width - padding[1] - padding[3] - cellLeftIconWidth - cellRightIconWidth);
    const availableHeight = Math.max(1, height - padding[0] - padding[2]);
    const iconSize = Math.max(1, Math.min(availableWidth, availableHeight, 32));
    const pos = calcStartPosition(
      cellLeftIconWidth,
      0,
      width - cellLeftIconWidth - cellRightIconWidth,
      height,
      iconSize,
      iconSize,
      textAlign,
      textBaseline,
      padding
    );
    const image: IImage = markCellMedia(
      createImage({
        x: pos.x,
        y: pos.y,
        width: iconSize,
        height: iconSize,
        image: audioIconSvg,
        cursor: 'pointer' as Cursor
      }),
      'image'
    );
    image.name = 'image';
    image.keepAspectRatio = true;
    (image as any).isAudioIcon = true;
    image.textAlign = textAlign;
    image.textBaseline = textBaseline;
    cellGroup.appendChild(image);
    return cellGroup;
  }
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  const shouldSnapshot = table.options.customConfig?.videoFirstFrameSnapshot === true;
  let loadTimer: ReturnType<typeof setTimeout> | undefined;
  let videoReleased = false;

  const clearVideoLoadTimer = (): void => {
    if (loadTimer !== undefined) {
      clearTimeout(loadTimer);
      loadTimer = undefined;
    }
  };
  const releaseCurrentVideo = (): void => {
    if (videoReleased) {
      return;
    }
    videoReleased = true;
    clearVideoLoadTimer();
    releaseVideoResource(video);
  };
  const isCurrentImage = (): boolean => getCellMediaImage(cellGroup) === image;
  const setVideoDamageImage = (): void => {
    const regedIcons = icons.get();
    const damageIcon = regedIcons.video_damage_pic || regedIcons.damage_pic;
    const damageImage = (damageIcon as any).svg;
    image.setAttributes({
      image: damageImage
    } as any);
    const originImage = image.resources?.get(damageImage)?.data;
    const svgSize = typeof damageImage === 'string' ? getSvgSize(damageImage) : undefined;
    const originWidth = originImage?.width || (damageIcon as any).width || svgSize?.width || 24;
    const originHeight = originImage?.height || (damageIcon as any).height || svgSize?.height || 24;
    const { width: cellWidth, height: cellHeight, isMerge } = getCellRange(cellGroup, table);
    const availableWidth = cellWidth - padding[1] - padding[3];
    const availableHeight = cellHeight - padding[0] - padding[2];

    if (originWidth > 0 && originHeight > 0 && availableWidth > 0 && availableHeight > 0) {
      const { width: imageWidth, height: imageHeight } = calcKeepAspectRatioSize(
        originWidth,
        originHeight,
        availableWidth,
        availableHeight
      );
      const pos = calcStartPosition(
        0,
        0,
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

      if (isMerge) {
        updateVideoMediaDxDy(
          cellGroup.mergeStartCol,
          cellGroup.mergeEndCol,
          cellGroup.mergeStartRow,
          cellGroup.mergeEndRow,
          table
        );
      }
    }
  };
  const handleVideoLoadFail = (): void => {
    if (videoReleased) {
      return;
    }
    if (isCurrentImage()) {
      setVideoDamageImage();
      table.scenegraph.updateNextFrame();
    }
    if (shouldSnapshot) {
      releaseCurrentVideo();
    }
  };
  video.addEventListener('loadeddata', (): void => {
    clearVideoLoadTimer();
    if (videoReleased) {
      return;
    }
    if (!isCurrentImage()) {
      releaseCurrentVideo();
      return;
    }
    const scenegraph = table.scenegraph;
    if (!scenegraph) {
      return;
    }
    if (video.videoWidth <= 0 || video.videoHeight <= 0) {
      handleVideoLoadFail();
      return;
    }
    if (imageAutoSizing) {
      _adjustWidthHeight(col, row, video.videoWidth, video.videoHeight, scenegraph, padding, cellGroup);
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
      updateVideoMediaDxDy(
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

    // get dx dy of image graphic for merge cell
    const { dx, dy } = image.attribute;

    const playIcon: Icon = new Icon({
      x: anchorX - iconSize / 2,
      y: anchorY - iconSize / 2,
      width: iconSize,
      height: iconSize,
      image: (regedIcons.play as any).svg,
      cursor: (regedIcons.play as any).cursor,
      dx,
      dy
    });
    markCellMedia(playIcon, 'play-icon');
    playIcon.name = 'play-icon';
    cellGroup.appendChild(playIcon);
    if (shouldSnapshot && snapshotVideoFirstFrame(video, image, table)) {
      releaseCurrentVideo();
    }
    // 触发重绘
    scenegraph.updateNextFrame();
  });
  video.addEventListener('error', handleVideoLoadFail);
  video.addEventListener('abort', handleVideoLoadFail);

  const image: IImage = markCellMedia(
    createImage({
      x: padding[3],
      y: padding[0],
      width: Math.max(1, width - padding[1] - padding[3]),
      height: Math.max(1, height - padding[2] - padding[0]),
      image: video as any,
      cursor: 'pointer' as Cursor
    }),
    'image'
  );
  image.name = 'image';
  image.keepAspectRatio = keepAspectRatio;
  image.textAlign = textAlign;
  image.textBaseline = textBaseline;
  cellGroup.appendChild(image);
  image.successCallback = () => {
    const scenegraph = table.scenegraph;
    if (!scenegraph) {
      return;
    }
    //补丁处理，上面loadeddata已经有一些尺寸处理，对应image-cell中updateAutoSizingAndKeepAspectRatio处理，
    //image重新赋值为损坏的图片的资源地址后，successCallback回调处理
    //仿照image-cell.ts中的处理方法updateAutoSizingAndKeepAspectRatio
    if (isDamagePic(image)) {
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
      scenegraph.updateNextFrame();
    }
  };

  video.setAttribute('preload', 'auto');
  video.src = value;
  const timeout = getVideoFirstFrameTimeout(table);
  if (shouldSnapshot && timeout > 0) {
    loadTimer = setTimeout(handleVideoLoadFail, timeout);
  }
  return cellGroup;
}

export type CreateVideoCellGroup = typeof createVideoCellGroup;
