/* eslint-disable no-undef */
import type { Cursor, IImage, IThemeSpec } from '@src/vrender';
import { createImage } from '@src/vrender';
import { Group } from '../../graphic/group';
import { calcStartPosition } from '../../utils/cell-pos';
import { getFunctionalProp } from '../../utils/get-prop';
import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { getCellBorderStrokeWidth } from '../../utils/cell-border-stroke-width';
import { getQuadProps } from '../../utils/padding';
import type { CellRange } from '../../../ts-types';
import { dealWithIconLayout } from '../../utils/text-icon-layout';
import { markCellMedia, removeCellMediaChildren } from './media-cell-helper';

export const audioIconSvg =
  '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="42" height="42" rx="10" fill="#F8FAFF" fill-opacity="0.92"/><rect x="3.75" y="3.75" width="40.5" height="40.5" rx="9.25" stroke="#1D4ED8" stroke-opacity="0.22" stroke-width="1.5"/><path d="M16 30H12C10.8954 30 10 29.1046 10 28V20C10 18.8954 10.8954 18 12 18H16L26 10V38L16 30Z" fill="#EAF1FF" stroke="#0F172A" stroke-opacity="0.24" stroke-width="5.5" stroke-linejoin="round"/><path d="M31.5 18.5C33.3 21.3 33.3 26.7 31.5 29.5" stroke="#0F172A" stroke-opacity="0.24" stroke-width="5.5" stroke-linecap="round"/><path d="M36 15C39.2 20.4 39.2 27.6 36 33" stroke="#0F172A" stroke-opacity="0.24" stroke-width="5.5" stroke-linecap="round"/><path d="M16 30H12C10.8954 30 10 29.1046 10 28V20C10 18.8954 10.8954 18 12 18H16L26 10V38L16 30Z" fill="#EAF1FF" stroke="#2563EB" stroke-width="3.2" stroke-linejoin="round"/><path d="M31.5 18.5C33.3 21.3 33.3 26.7 31.5 29.5" stroke="#2563EB" stroke-width="3.2" stroke-linecap="round"/><path d="M36 15C39.2 20.4 39.2 27.6 36 33" stroke="#2563EB" stroke-width="3.2" stroke-linecap="round"/></svg>';

export function createAudioCellGroup(
  columnGroup: Group,
  xOrigin: number,
  yOrigin: number,
  col: number,
  row: number,
  width: number,
  height: number,
  padding: [number, number, number, number],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  mayHaveIcon: boolean,
  table: BaseTableAPI,
  cellTheme: IThemeSpec,
  range: CellRange | undefined,
  isAsync: boolean
) {
  const headerStyle = table._getCellStyle(col, row);
  const functionalPadding = getFunctionalProp('padding', headerStyle, col, row, table);
  if (table.options.customConfig?.imageMargin) {
    padding = getQuadProps(table.options.customConfig?.imageMargin);
  } else if (isValid(functionalPadding)) {
    padding = functionalPadding;
  }
  if (cellTheme?.text?.textAlign) {
    textAlign = cellTheme.text.textAlign;
  }
  if (cellTheme?.text?.textBaseline) {
    textBaseline = cellTheme.text.textBaseline;
  }

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
        lineWidth: cellTheme?.group?.lineWidth ?? undefined,
        fill: cellTheme?.group?.fill ?? undefined,
        stroke: cellTheme?.group?.stroke ?? undefined,
        strokeArrayWidth,
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
      lineWidth: cellTheme?.group?.lineWidth ?? undefined,
      fill: cellTheme?.group?.fill ?? undefined,
      stroke: cellTheme?.group?.stroke ?? undefined,
      strokeArrayWidth,
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

  let cellLeftIconWidth = 0;
  let cellRightIconWidth = 0;
  if (Array.isArray(cellIcons) && cellIcons.length !== 0) {
    const { leftIconWidth, rightIconWidth, absoluteRightIconWidth } = dealWithIconLayout(
      cellIcons,
      cellGroup,
      range,
      table
    );

    cellLeftIconWidth = leftIconWidth;
    cellRightIconWidth = rightIconWidth;

    cellGroup.forEachChildren((child: any) => {
      if (child.role === 'icon-left') {
        child.setAttribute('x', child.attribute.x + padding[3]);
      } else if (child.role === 'icon-right') {
        child.setAttribute('x', child.attribute.x + width - rightIconWidth - padding[1]);
      } else if (child.role === 'icon-absolute-right') {
        child.setAttribute('x', child.attribute.x + width - absoluteRightIconWidth - padding[1]);
      }
    });

    cellGroup.forEachChildren((child: any) => {
      if (textBaseline === 'middle') {
        child.setAttribute('y', (height - child.AABBBounds.height()) / 2);
      } else if (textBaseline === 'bottom') {
        child.setAttribute('y', height - child.AABBBounds.height() - padding[2]);
      } else {
        child.setAttribute('y', padding[0]);
      }
    });
  }
  (cellGroup as any)._cellLeftIconWidth = cellLeftIconWidth;
  (cellGroup as any)._cellRightIconWidth = cellRightIconWidth;

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
  removeCellMediaChildren(cellGroup);
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

export type CreateAudioCellGroup = typeof createAudioCellGroup;
