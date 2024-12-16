import { isValid } from '@visactor/vutils';
import type { Group } from '../graphic/group';
import type { Scenegraph } from '../scenegraph';
import type { ColumnIconOption, SortOrder, SvgIcon } from '../../ts-types';
import { IconFuncTypeEnum } from '../../ts-types';
import type { Icon } from '../graphic/icon';
import type { TooltipOptions } from '../../ts-types/tooltip';
import type { IRect } from '@src/vrender';
import { IContainPointMode, createRect } from '@src/vrender';
import { dealWithIcon } from '../utils/text-icon-layout';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { getCellMergeRange } from '../../tools/merge-range';
import { traverseObject } from '../../tools/util';

export function hideHoverIcon(col: number, row: number, scene: Scenegraph) {
  if (col === -1 || row === -1) {
    return;
  }
  // const cellGroup = scene.getCell(col, row);
  // hideIcon(scene, cellGroup, 'mouseenter_cell');

  // hideIcon
  updateCellRangeIcon(
    col,
    row,
    (icon: Icon) => icon.attribute.visibleTime === 'mouseenter_cell',
    (icon: Icon) => {
      icon.setAttribute('opacity', 0);

      const iconBack = icon.parent.getChildByName('icon-back') as IRect;
      if (iconBack) {
        iconBack.setAttribute('visible', false);
      }
    },
    scene
  );
  scene.updateNextFrame();
}

export function showHoverIcon(col: number, row: number, scene: Scenegraph) {
  if (col === -1 || row === -1) {
    return;
  }
  // const cellGroup = scene.getCell(col, row);
  // showIcon(scene, cellGroup, 'mouseenter_cell');

  // showIcon
  updateCellRangeIcon(
    col,
    row,
    (icon: Icon) => icon.attribute.visibleTime === 'mouseenter_cell',
    (icon: Icon) => {
      icon.setAttribute('opacity', 1);
    },
    scene
  );
  scene.updateNextFrame();
}

export function hideClickIcon(col: number, row: number, scene: Scenegraph) {
  if (col === -1 || row === -1) {
    return;
  }
  // const cellGroup = scene.getCell(col, row);
  // hideIcon(scene, cellGroup, 'click_cell');

  // hideIcon
  updateCellRangeIcon(
    col,
    row,
    (icon: Icon) => icon.attribute.visibleTime === 'click_cell',
    (icon: Icon) => {
      icon.setAttribute('opacity', 0);
    },
    scene
  );
  scene.updateNextFrame();
}

export function showClickIcon(col: number, row: number, scene: Scenegraph) {
  if (col === -1 || row === -1) {
    return;
  }
  // const cellGroup = scene.getCell(col, row);
  // showIcon(scene, cellGroup, 'click_cell');

  // showIcon
  updateCellRangeIcon(
    col,
    row,
    (icon: Icon) => icon.attribute.visibleTime === 'click_cell',
    (icon: Icon) => {
      icon.setAttribute('opacity', 1);
    },
    scene
  );
  scene.updateNextFrame();
}

/**
 * @description: 获取指定单元格指定位置的icon mark
 * @param {number} col
 * @param {number} row
 * @param {number} x
 * @param {number} y
 * @return {*}
 */
export function getIconByXY(col: number, row: number, x: number, y: number, scene: Scenegraph): Icon | undefined {
  const cellGroup = scene.getCell(col, row);
  let pickMark;
  cellGroup.forEachChildren((mark: Icon) => {
    if (mark.role && mark.role.startsWith('icon') && mark.containsPoint(x, y, IContainPointMode.GLOBAL)) {
      pickMark = mark;
    }
  });
  return pickMark;
}

/**
 * @description: 将指定icon mark设置为Hover样式
 * @param {Icon} icon
 * @param {number} col
 * @param {number} row
 * @return {*}
 */
export function setIconHoverStyle(baseIcon: Icon, col: number, row: number, cellGroup: Group, scene: Scenegraph) {
  if (baseIcon.attribute.backgroundColor || baseIcon.attribute.hoverImage) {
    updateCellRangeIcon(
      col,
      row,
      // filter
      (icon: Icon) => icon.name === baseIcon.name,
      (icon: Icon) => {
        // hover展示背景
        if (icon.attribute.backgroundColor) {
          let iconBack = icon.parent.getChildByName('icon-back') as IRect;
          if (iconBack) {
            iconBack.setAttributes({
              x:
                (icon.attribute.x ?? 0) +
                // (icon.attribute.dx ?? 0) +
                (icon.AABBBounds.width() - icon.backgroundWidth) / 2,
              y: (icon.attribute.y ?? 0) + (icon.AABBBounds.height() - icon.backgroundHeight) / 2,
              dx: icon.attribute.dx ?? 0,
              dy: icon.attribute.dy ?? 0,
              width: icon.backgroundWidth,
              height: icon.backgroundHeight,
              fill: icon.attribute.backgroundColor,
              cornerRadius: 5,
              visible: true
            });
          } else {
            iconBack = createRect({
              x:
                (icon.attribute.x ?? 0) +
                // (icon.attribute.dx ?? 0) +
                (icon.AABBBounds.width() - icon.backgroundWidth) / 2,
              y: (icon.attribute.y ?? 0) + (icon.AABBBounds.height() - icon.backgroundHeight) / 2,
              dx: icon.attribute.dx ?? 0,
              dy: icon.attribute.dy ?? 0,
              width: icon.backgroundWidth,
              height: icon.backgroundHeight,
              fill: icon.attribute.backgroundColor,
              cornerRadius: 5,
              pickable: false,
              visible: true
            }) as IRect;
            iconBack.name = 'icon-back';
            // cellGroup.appendChild(iconBack);
          }
          icon.parent.insertBefore(iconBack, icon);
        }

        // hover更换图片
        if (icon.attribute.hoverImage && icon.attribute.image !== icon.attribute.hoverImage) {
          icon.image = icon.attribute.hoverImage;
        }
      },
      scene
    );
  }
  // hover展示tooltip
  if (baseIcon.tooltip) {
    const { x1: left, x2: right, y1: top, y2: bottom } = baseIcon.globalAABBBounds;
    const tooltipOptions: TooltipOptions = {
      content: baseIcon.tooltip.title,
      referencePosition: {
        rect: {
          left: left,
          right: right,
          top: top,
          bottom: bottom,
          width: baseIcon.globalAABBBounds.width(),
          height: baseIcon.globalAABBBounds.height()
        },
        placement: baseIcon.tooltip.placement
      },
      disappearDelay: baseIcon.tooltip.disappearDelay,
      style: Object.assign({}, scene.table.internalProps.theme?.tooltipStyle, baseIcon.tooltip?.style)
    };
    if (!scene.table.internalProps.tooltipHandler.isBinded(tooltipOptions)) {
      scene.table.showTooltip(col, row, tooltipOptions);
    }
  }
}

/**
 * @description: 将指定icon mark设置为Normal样式
 * @param {Icon} icon
 * @param {number} col
 * @param {number} row
 * @return {*}
 */
export function setIconNormalStyle(baseIcon: Icon, col: number, row: number, scene: Scenegraph) {
  if (baseIcon.attribute.backgroundColor || baseIcon.attribute.hoverImage) {
    updateCellRangeIcon(
      col,
      row,
      // filter
      (icon: Icon) => icon.name === baseIcon.name,
      (icon: Icon) => {
        const iconBack = icon.parent.getChildByName('icon-back') as IRect;
        if (iconBack) {
          iconBack.setAttribute('visible', false);
        }

        // hover更换图片
        if (icon.attribute.hoverImage && icon.attribute.image !== icon.attribute.originImage) {
          icon.image = icon.attribute.originImage;
        }
      },
      scene
    );
  }
}

export function updateIcon(baseIcon: Icon, iconConfig: ColumnIconOption, col: number, row: number, scene: Scenegraph) {
  // 直接更新mark attribute
  // dealWithIcon(iconConfig, icon);
  // icon.name = iconConfig.name;
  // scene.updateNextFrame();
  const iconName = baseIcon.name;
  updateCellRangeIcon(
    col,
    row,
    // filter
    (icon: Icon) => icon.name === iconName,
    // dealer
    (icon: Icon) => {
      dealWithIcon(iconConfig, icon);
      icon.name = iconConfig.name;
    },
    scene
  );

  scene.updateNextFrame();
}

function resetSortIcon(oldSortCol: number, oldSortRow: number, iconConfig: ColumnIconOption, scene: Scenegraph) {
  const oldSortCell = scene.getCell(oldSortCol, oldSortRow);

  if (
    isValid(oldSortCell.mergeStartCol) &&
    isValid(oldSortCell.mergeStartRow) &&
    isValid(oldSortCell.mergeEndCol) &&
    isValid(oldSortCell.mergeEndRow)
  ) {
    for (let col = oldSortCell.mergeStartCol; col <= oldSortCell.mergeEndCol; col++) {
      for (let row = oldSortCell.mergeStartRow; row <= oldSortCell.mergeEndRow; row++) {
        let oldIconMark: Icon;
        scene.getCell(col, row).forEachChildren((mark: Icon) => {
          if (mark.attribute.funcType === 'sort') {
            oldIconMark = mark;
            return true;
          }
          return false;
        });
        if (oldIconMark) {
          dealWithIcon(iconConfig, oldIconMark);
          oldIconMark.name = iconConfig.name;
        }
      }
    }
  } else {
    let oldIconMark: Icon;

    //oldSortCell.forEachChildren((mark: Icon) => {
    traverseObject(oldSortCell, 'children', (mark: Icon) => {
      if (mark.attribute.funcType === 'sort') {
        oldIconMark = mark;
        return true;
      }
      return false;
    });

    if (oldIconMark) {
      // updateIcon(oldIconMark, oldIcon);
      dealWithIcon(iconConfig, oldIconMark);
      oldIconMark.name = iconConfig.name;
    }
  }
}

function checkSameCell(col1: number, row1: number, col2: number, row2: number, table: BaseTableAPI) {
  const range1 = table.getCellRange(col1, row1);
  const range2 = table.getCellRange(col2, row2);
  if (
    range1.start.col === range2.start.col &&
    range1.start.row === range2.start.row &&
    range1.end.col === range2.end.col &&
    range1.end.row === range2.end.row
  ) {
    return true;
  }
  return false;
}

export function updateSortIcon(options: {
  col: number;
  row: number;
  iconMark: Icon;
  order: SortOrder;
  oldSortCol: number;
  oldSortRow: number;
  oldIconMark: Icon | undefined;
  scene: Scenegraph;
}) {
  const { col, row, iconMark, order, oldSortCol, oldSortRow, oldIconMark, scene } = options;
  // 更新icon
  const icon = scene.table.internalProps.headerHelper.getSortIcon(order, scene.table, col, row);
  if (iconMark) {
    updateIcon(iconMark, icon, col, row, scene);
  }

  // 更新旧frozen icon
  if (!checkSameCell(col, row, oldSortCol, oldSortRow, scene.table)) {
    const oldIcon = scene.table.internalProps.headerHelper.getSortIcon('normal', scene.table, oldSortCol, oldSortRow);
    if (oldIconMark) {
      updateIcon(oldIconMark, oldIcon, oldSortCol, oldSortRow, scene);
    } else {
      resetSortIcon(oldSortCol, oldSortRow, oldIcon, scene);
    }
  }
}

export function updateFrozenIcon(scene: Scenegraph) {
  // 依据新旧冻结列确定更新范围
  for (let col = 0; col < scene.table.colCount; col++) {
    for (let row = 0; row < scene.table.columnHeaderLevelCount; row++) {
      updateCellRangeIcon(
        col,
        row,
        // filter
        (icon: Icon) => icon.attribute.funcType === 'frozen',
        // dealer
        (icon: Icon) => {
          const iconConfig = scene.table.internalProps.headerHelper.getFrozenIcon(col, row);
          dealWithIcon(iconConfig, icon);
          icon.name = iconConfig.name;
        },
        scene
      );
    }
  }
}

export function updateHierarchyIcon(col: number, row: number, scene: Scenegraph) {
  let iconConfig: SvgIcon;
  if (scene.table.isHeader(col, row)) {
    iconConfig = scene.table.internalProps.headerHelper.getHierarchyIcon(col, row);
  } else {
    iconConfig = scene.table.internalProps.bodyHelper.getHierarchyIcon(col, row);
  }

  updateCellRangeIcon(
    col,
    row,
    // filter
    (icon: Icon) =>
      icon.attribute.funcType === IconFuncTypeEnum.collapse || icon.attribute.funcType === IconFuncTypeEnum.expand,
    // dealer
    (icon: Icon) => {
      dealWithIcon(iconConfig, icon);
      icon.name = iconConfig.name;
    },
    scene
  );
}

export function updateCellGroupIcon(cellGroup: Group, filter: (icon: Icon) => boolean, dealer: (icon: Icon) => void) {
  if (!cellGroup || cellGroup.role === 'empty') {
    return;
  }
  cellGroup.forEachChildren((child: any) => {
    if (child.type === 'group') {
      updateCellGroupIcon(child, filter, dealer);
    } else if (filter(child)) {
      dealer(child);
    }
  });
}

export function updateCellRangeIcon(
  col: number,
  row: number,
  filter: (icon: Icon) => boolean,
  dealer: (icon: Icon) => void,
  scene: Scenegraph
) {
  const cellGroup = scene.getCell(col, row);
  if (
    cellGroup.role === 'cell' &&
    isValid(cellGroup.mergeStartCol) &&
    isValid(cellGroup.mergeStartRow) &&
    isValid(cellGroup.mergeEndCol) &&
    isValid(cellGroup.mergeEndRow)
  ) {
    const { colStart, colEnd, rowStart, rowEnd } = getCellMergeRange(cellGroup, scene);
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        updateCellGroupIcon(scene.highPerformanceGetCell(col, row), filter, dealer);
      }
    }
  } else {
    updateCellGroupIcon(cellGroup, filter, dealer);
  }
}

export function residentHoverIcon(col: number, row: number, scene: Scenegraph) {
  updateCellRangeIcon(
    col,
    row,
    // filter
    (icon: Icon) => icon.attribute.funcType === IconFuncTypeEnum.dropDown,
    // dealer
    (icon: Icon) => {
      (icon as any).oldVisibleTime = icon.attribute.visibleTime;
      icon.setAttribute('visibleTime', 'always');
      icon.setAttribute('opacity', 1);
    },
    scene
  );
}

export function resetResidentHoverIcon(col: number, row: number, scene: Scenegraph) {
  updateCellRangeIcon(
    col,
    row,
    // filter
    (icon: Icon) => icon.attribute.funcType === IconFuncTypeEnum.dropDown,
    // dealer
    (icon: Icon) => {
      (icon as any).oldVisibleTime && icon.setAttribute('visibleTime', (icon as any).oldVisibleTime);
      icon.setAttribute('opacity', icon.attribute.visibleTime === 'always' ? 1 : 0);
    },
    scene
  );
}
