/* eslint-disable no-undef */
import type { Cursor, IImage, IThemeSpec } from '@src/vrender';
import { createRect, createImage } from '@src/vrender';
import * as icons from '../../../icons';
import { Group } from '../../graphic/group';
import { calcKeepAspectRatioSize } from '../../utils/keep-aspect-ratio';
import { Icon } from '../../graphic/icon';
import { calcStartPosition } from '../../utils/cell-pos';
import { _adjustWidthHeight } from './image-cell';
import { getFunctionalProp, getProp } from '../../utils/get-prop';
import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../../ts-types/base-table';

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
  } as any);
  cellGroup.role = 'cell';
  cellGroup.col = col;
  cellGroup.row = row;
  // columnGroup?.addChild(cellGroup);
  columnGroup?.addCellGroup(cellGroup);

  // video
  const value = table.getCellValue(col, row);
  const video = document.createElement('video');
  video.addEventListener('loadeddata', (): void => {
    if (imageAutoSizing) {
      _adjustWidthHeight(col, row, video.videoWidth, video.videoHeight, table.scenegraph, padding, cellGroup);
    }
    const width = cellGroup.attribute.width;
    const height = cellGroup.attribute.height;
    // 更新宽高
    if (keepAspectRatio) {
      const { width: videoWidth, height: videoHeight } = calcKeepAspectRatioSize(
        video.videoWidth,
        video.videoHeight,
        width - padding[1] - padding[3],
        height - padding[0] - padding[2]
      );
      const pos = calcStartPosition(0, 0, width, height, videoWidth, videoHeight, textAlign, textBaseline, padding);

      image.setAttributes({
        width: videoWidth,
        height: videoHeight,
        x: pos.x,
        y: pos.y
      });
    } else {
      image.setAttributes({
        x: padding[3],
        y: padding[0],
        width: width - padding[1] - padding[3],
        height: height - padding[2] - padding[0]
      });
    }

    const left = 0;
    const top = 0;
    // 播放按钮
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
  cellGroup.appendChild(image);

  return cellGroup;
}
