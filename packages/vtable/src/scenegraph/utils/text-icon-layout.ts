/* eslint-disable no-undef */
import type { IThemeSpec } from '@src/vrender';
import { RichText, Text } from '@src/vrender';
import { convertInternal } from '../../tools/util';
import type { CellRange, ColumnIconOption } from '../../ts-types';
import { IconFuncTypeEnum, IconPosition } from '../../ts-types';
import { CellContent } from '../component/cell-content';
import type { Group } from '../graphic/group';
import { Icon, TextIcon } from '../graphic/icon';
import type { Scenegraph } from '../scenegraph';
import { getCellMergeInfo } from './get-cell-merge';
import { getHierarchyOffset } from './get-hierarchy-offset';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { isNil, isNumber, isValid, isValidNumber, merge } from '@visactor/vutils';
import { isMergeCellGroup } from './is-merge-cell-group';
import { breakString } from './break-string';
import { CUSTOM_CONTAINER_NAME } from '../component/custom';
import { getTargetCell } from '../../event/util';
// import { createLine } from '@src/vrender';

/**
 * @description: 创建单元格内容
 * cellGroup
 * |-- content
 *      |-- leftContentIcons
 *      |-- rightContentIcons
 *      |-- wrapText / richtext
 * |-- leftIcons
 * |-- rightIcons
 * |-- absoluteIcons
 * @param {ColumnIconOption} icons
 * @param {string} textStr
 * @param {array} padding
 * @param {boolean} autoColWidth
 * @param {boolean} autoRowHeight
 * @param {boolean} autoWrapText
 * @param {number} cellWidth
 * @param {number} cellHeight
 * @param {CanvasTextAlign} textAlign
 * @param {CanvasTextBaseline} textBaseline
 * @return {*}
 */
export function createCellContent(
  cellGroup: Group,
  icons: ColumnIconOption[] | null,
  textStr: string,
  padding: [number, number, number, number],
  autoColWidth: boolean,
  autoRowHeight: boolean,
  autoWrapText: boolean,
  lineClamp: number | undefined,
  cellWidth: number,
  cellHeight: number,
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  table: BaseTableAPI,
  cellTheme: IThemeSpec,
  range: CellRange | undefined
) {
  // const leftIcons: ColumnIconOption[] = [];
  // const rightIcons: ColumnIconOption[] = [];
  // const contentLeftIcons: ColumnIconOption[] = [];
  // const contentRightIcons: ColumnIconOption[] = [];
  // const inlineFrontIcons: ColumnIconOption[] = [];
  // const inlineEndIcons: ColumnIconOption[] = [];
  // const absoluteLeftIcons: ColumnIconOption[] = [];
  // const absoluteRightIcons: ColumnIconOption[] = [];

  let contentWidth: number;
  let contentHeight: number;
  let leftIconWidth = 0;
  // let leftIconHeight = 0;
  let rightIconWidth = 0;
  // let rightIconHeight = 0;
  // let absoluteLeftIconWidth = 0;
  let absoluteRightIconWidth = 0;

  if (!Array.isArray(icons) || icons.length === 0) {
    if (isValid(textStr)) {
      // 没有icon，cellGroup只添加WrapText
      const { text, moreThanMaxCharacters } = breakString(textStr, table);

      const hierarchyOffset = range
        ? getHierarchyOffset(range.start.col, range.start.row, table)
        : getHierarchyOffset(cellGroup.col, cellGroup.row, table);

      let _contentOffset = 0;
      if (isNumber(table.theme._contentOffset)) {
        if (textAlign === 'left') {
          _contentOffset = table.theme._contentOffset;
        } else if (textAlign === 'right') {
          _contentOffset = -table.theme._contentOffset;
        }
      }
      const attribute = {
        text: text.length === 1 ? text[0] : text,
        moreThanMaxCharacters,
        maxLineWidth: autoColWidth ? Infinity : cellWidth - (padding[1] + padding[3] + hierarchyOffset),
        // fill: true,
        // textAlign: 'left',
        textBaseline: 'top',
        autoWrapText,
        lineClamp,
        wordBreak: 'break-word',
        // widthLimit: autoColWidth ? -1 : colWidth - (padding[1] + padding[3]),
        heightLimit:
          table.options.customConfig?.limitContentHeight === false
            ? -1
            : autoRowHeight && !table.options.customConfig?.multilinesForXTable
            ? -1
            : cellHeight - Math.floor(padding[0] + padding[2]),
        pickable: false,
        dx: (textAlign === 'left' ? hierarchyOffset : 0) + _contentOffset,
        // dy: -1,
        whiteSpace:
          table.options.customConfig?.limitContentHeight === false
            ? 'normal'
            : text.length === 1 && !autoWrapText
            ? 'no-wrap'
            : 'normal',
        keepCenterInLine: true
        // _debug_bounds: true
      };
      const wrapText = new Text(cellTheme.text ? (Object.assign({}, cellTheme.text, attribute) as any) : attribute);
      wrapText.name = 'text';
      (wrapText as any).textBaseline = textBaseline;

      // const height = cellHeight - (padding[0] + padding[2]);
      // const line = createLine({
      //   x: 0,
      //   // y: 0,
      //   y: padding[0] + (height - 18) / 2,
      //   points: [
      //     {
      //       x: 0,
      //       y: 0
      //     },
      //     {
      //       x: 100,
      //       y: 0
      //     }
      //   ],
      //   stroke: 'red'
      // });
      // line.name = 'line';

      // const line1 = createLine({
      //   x: 0,
      //   // y: 0,
      //   y: padding[0] + (height - 18) / 2 + 18,
      //   points: [
      //     {
      //       x: 0,
      //       y: 0
      //     },
      //     {
      //       x: 100,
      //       y: 0
      //     }
      //   ],
      //   stroke: 'red'
      // });
      // line1.name = 'line';

      cellGroup.appendChild(wrapText);
      // cellGroup.appendChild(line);
      // cellGroup.appendChild(line1);

      contentWidth = wrapText.AABBBounds.width();
      contentHeight = wrapText.AABBBounds.height();
    }
  } else {
    // // icon分类
    // icons.forEach(icon => {
    //   switch (icon.positionType) {
    //     case IconPosition.left:
    //       leftIcons.push(icon);
    //       break;
    //     case IconPosition.right:
    //       rightIcons.push(icon);
    //       break;
    //     case IconPosition.contentLeft:
    //       contentLeftIcons.push(icon);
    //       break;
    //     case IconPosition.contentRight:
    //       contentRightIcons.push(icon);
    //       break;
    //     // case IconPosition.absoluteLeft:
    //     //   absoluteLeftIcons.push(icon);
    //     //   break;
    //     case IconPosition.absoluteRight:
    //       absoluteRightIcons.push(icon);
    //       break;
    //     case IconPosition.inlineFront:
    //       inlineFrontIcons.push(icon);
    //       break;
    //     case IconPosition.inlineEnd:
    //       inlineEndIcons.push(icon);
    //       break;
    //   }
    // });

    // // 添加非cell icon & absolute icon
    // leftIcons.forEach(icon => {
    //   const iconMark = dealWithIcon(icon, undefined, cellGroup.col, cellGroup.row, range, table);
    //   iconMark.role = 'icon-left';
    //   iconMark.name = icon.name;
    //   iconMark.setAttribute('x', leftIconWidth + (iconMark.attribute.marginLeft ?? 0));
    //   leftIconWidth +=
    //     iconMark.AABBBounds.width() + (iconMark.attribute.marginLeft ?? 0) + (iconMark.attribute.marginRight ?? 0);
    //   leftIconHeight = Math.max(leftIconHeight, iconMark.AABBBounds.height());
    //   cellGroup.appendChild(iconMark);
    // });

    // rightIcons.forEach(icon => {
    //   const iconMark = dealWithIcon(icon, undefined, cellGroup.col, cellGroup.row, range, table);
    //   iconMark.role = 'icon-right';
    //   iconMark.name = icon.name;
    //   iconMark.setAttribute('x', rightIconWidth + (iconMark.attribute.marginLeft ?? 0));
    //   rightIconWidth +=
    //     iconMark.AABBBounds.width() + (iconMark.attribute.marginLeft ?? 0) + (iconMark.attribute.marginRight ?? 0);
    //   rightIconHeight = Math.max(rightIconHeight, iconMark.AABBBounds.height());
    //   cellGroup.appendChild(iconMark);
    // });

    // absoluteLeftIcons.forEach(icon => {
    //   const iconMark = dealWithIcon(icon, undefined, cellGroup.col, cellGroup.row, range, table);
    //   iconMark.role = 'icon-absolute-left';
    //   iconMark.name = icon.name;
    //   iconMark.setAttribute('x', absoluteLeftIconWidth + (iconMark.attribute.marginLeft ?? 0));
    //   absoluteLeftIconWidth +=
    //     iconMark.AABBBounds.width() + (iconMark.attribute.marginLeft ?? 0) + (iconMark.attribute.marginRight ?? 0);
    //   cellGroup.appendChild(iconMark);
    // });

    // absoluteRightIcons.forEach(icon => {
    //   const iconMark = dealWithIcon(icon, undefined, cellGroup.col, cellGroup.row, range, table);
    //   iconMark.role = 'icon-absolute-right';
    //   iconMark.name = icon.name;
    //   iconMark.setAttribute('x', absoluteRightIconWidth + (iconMark.attribute.marginLeft ?? 0));
    //   absoluteRightIconWidth +=
    //     iconMark.AABBBounds.width() + (iconMark.attribute.marginLeft ?? 0) + (iconMark.attribute.marginRight ?? 0);
    //   cellGroup.appendChild(iconMark);
    // });

    const {
      inlineFrontIcons,
      inlineEndIcons,
      contentLeftIcons,
      contentRightIcons,
      leftIconWidth: layoutLeftIconWidth,
      // leftIconHeight: layoutLeftIconHeight,
      rightIconWidth: layoutRightIconWidth,
      // rightIconHeight: layoutRightIconHeight,
      // absoluteLeftIconWidth: layoutAbsoluteLeftIconWidth,
      absoluteRightIconWidth: layoutAbsoluteRightIconWidth
    } = dealWithIconLayout(icons, cellGroup, range, table);

    leftIconWidth = layoutLeftIconWidth;
    // leftIconHeight = layoutLeftIconHeight;
    rightIconWidth = layoutRightIconWidth;
    // rightIconHeight = layoutRightIconHeight;
    // absoluteLeftIconWidth = layoutAbsoluteLeftIconWidth;
    absoluteRightIconWidth = layoutAbsoluteRightIconWidth;

    // 添加text & content icon & inline icon
    let textMark;
    // 直接添加richtext / wrapText
    if (inlineFrontIcons.length === 0 && inlineEndIcons.length === 0) {
      let _contentOffset = 0;
      if (isNumber(table.theme._contentOffset)) {
        if (textAlign === 'left') {
          _contentOffset = table.theme._contentOffset;
        } else if (textAlign === 'right') {
          _contentOffset = -table.theme._contentOffset;
        }
      }
      const hierarchyOffset = range
        ? getHierarchyOffset(range.start.col, range.start.row, table)
        : getHierarchyOffset(cellGroup.col, cellGroup.row, table);
      const { text, moreThanMaxCharacters } = breakString(textStr, table);

      const attribute = {
        text: text.length === 1 ? text[0] : text,
        moreThanMaxCharacters,
        maxLineWidth: autoColWidth
          ? Infinity
          : cellWidth - (padding[1] + padding[3]) - leftIconWidth - rightIconWidth - hierarchyOffset,
        // fill: true,
        // textAlign: 'left',
        textBaseline: 'top',
        // widthLimit: autoColWidth ? -1 : colWidth - (padding[1] + padding[3]),
        heightLimit:
          table.options.customConfig?.limitContentHeight === false
            ? -1
            : autoRowHeight && !table.options.customConfig?.multilinesForXTable
            ? -1
            : cellHeight - Math.floor(padding[0] + padding[2]),
        pickable: false,
        autoWrapText,
        lineClamp,
        wordBreak: 'break-word',
        whiteSpace:
          table.options.customConfig?.limitContentHeight === false
            ? 'normal'
            : text.length === 1 && !autoWrapText
            ? 'no-wrap'
            : 'normal',
        dx: (textAlign === 'left' ? (!contentLeftIcons.length ? hierarchyOffset : 0) : 0) + _contentOffset,
        keepCenterInLine: true
      };
      const wrapText = new Text(cellTheme.text ? (Object.assign({}, cellTheme.text, attribute) as any) : attribute);
      wrapText.name = 'text';
      textMark = wrapText;
    } else {
      const textOption = Object.assign(
        {
          text: textStr?.toString()
        },
        (cellGroup.parent as Group)?.theme?.userTheme?.text || {}
      );
      if (cellTheme.text) {
        Object.assign(textOption, cellTheme.text);
      }
      textOption.textBaseline = 'middle';
      const textConfig = [
        ...inlineFrontIcons.map(icon => dealWithRichTextIcon(icon)),
        textOption,
        ...inlineEndIcons.map(icon => dealWithRichTextIcon(icon))
      ];
      textConfig[0].textAlign = textAlign;
      const text = new RichText({
        width: autoColWidth ? 0 : cellWidth - (padding[1] + padding[3]) - leftIconWidth - rightIconWidth,
        height: autoRowHeight && autoWrapText ? 0 : Math.ceil(cellHeight - (padding[0] + padding[2])),
        textConfig,
        verticalDirection: autoRowHeight && autoWrapText ? 'top' : (textBaseline as any),

        ellipsis: textOption.ellipsis
        // verticalDirection: textBaseline as any
        // textAlign: textAlign as any,
        // textBaseline: textBaseline as any,
      });
      text.name = 'text';
      textMark = text;
      text.bindIconEvent();

      if (range && (range.start.col !== range.end.col || range.start.row !== range.end.row)) {
        text.onBeforeAttributeUpdate = onBeforeAttributeUpdate as any;
      }
    }

    if (contentLeftIcons.length !== 0 || contentRightIcons.length !== 0) {
      // 创建CellContent处理conten icon；有content icon，cellGroup: CellIcons + cellContent

      const cellContent = new CellContent({
        // x: padding[3] + leftIconWidth,
        // y: padding[0],
        x: 0,
        y: 0,
        fill: false,
        stroke: false,
        pickable: false
      });
      cellContent.name = 'content';

      cellContent.setCellContentOption({
        autoWidth: autoColWidth,
        autoHeight: autoRowHeight,
        cellWidth: cellWidth - (padding[1] + padding[3]) - leftIconWidth - rightIconWidth,
        cellHeight: cellHeight - (padding[0] + padding[2]),
        align: textAlign,
        baseline: textBaseline
      });
      const dealWithIconComputeVar = {
        addedHierarchyOffset: 0
      }; //为了只增加一次indent的缩进值，如果有两个icon都dealWithIcon的话
      contentLeftIcons.forEach(icon => {
        const iconMark = dealWithIcon(
          icon,
          undefined,
          cellGroup.col,
          cellGroup.row,
          range,
          table,
          dealWithIconComputeVar
        );
        iconMark.role = 'icon-content-left';
        iconMark.name = icon.name;
        cellContent.addLeftOccupyingIcon(iconMark);
      });
      contentRightIcons.forEach(icon => {
        const iconMark = dealWithIcon(
          icon,
          undefined,
          cellGroup.col,
          cellGroup.row,
          range,
          table,
          dealWithIconComputeVar
        );
        iconMark.role = 'icon-content-right';
        iconMark.name = icon.name;
        cellContent.addRightOccupyingIcon(iconMark);
      });
      cellContent.addContent(textMark);

      cellGroup.appendChild(cellContent);
      cellContent.layout();

      contentWidth = cellContent.AABBBounds.width();
      contentHeight = cellContent.AABBBounds.height();
    } else {
      // 没有content icon，cellGroup: CellIcons + wrapText/richtext
      // cellGroup.appendChild(textMark);
      if (cellGroup.firstChild) {
        cellGroup.insertBefore(textMark, cellGroup.firstChild);
      } else {
        cellGroup.appendChild(textMark);
      }
      contentWidth = textMark.AABBBounds.width();
      contentHeight = textMark.AABBBounds.height();
    }
  }

  // 内容添加后单元格的宽高
  const width = autoColWidth
    ? leftIconWidth + contentWidth + rightIconWidth // + padding[1] + padding[3]
    : cellWidth - (padding[1] + padding[3]);
  // const height = autoRowHeight
  //   ? Math.max(leftIconHeight, contentHeight, rightIconHeight) // + padding[0] + padding[2]
  //   : cellHeight - (padding[0] + padding[2]);
  const height = cellHeight - (padding[0] + padding[2]);

  // 更新各个部分横向位置
  cellGroup.forEachChildren((child: any) => {
    if (child.role === 'icon-left') {
      child.setAttribute('x', child.attribute.x + padding[3]);
    } else if (child.role === 'icon-right') {
      child.setAttribute('x', child.attribute.x + width - rightIconWidth + padding[3]);
    } else if (child.role === 'icon-absolute-right') {
      child.setAttribute('x', child.attribute.x + width - absoluteRightIconWidth + padding[3] + padding[1]);
    } else if (child.name === 'content' || child.name === 'text') {
      if (textAlign === 'center' && child.type !== 'richtext') {
        child.setAttribute('x', padding[3] + leftIconWidth + (width - leftIconWidth - rightIconWidth) / 2);
      } else if (textAlign === 'right' && child.type !== 'richtext') {
        child.setAttribute('x', padding[3] + width - rightIconWidth);
      } else {
        child.setAttribute('x', padding[3] + leftIconWidth);
      }
    }
  });

  // 更新各个部分纵向位置
  cellGroup.forEachChildren((child: any) => {
    if (child.name === CUSTOM_CONTAINER_NAME) {
      return;
    }
    if (textBaseline === 'middle') {
      child.setAttribute('y', padding[0] + (height - child.AABBBounds.height()) / 2);
    } else if (textBaseline === 'bottom') {
      child.setAttribute('y', padding[0] + height - child.AABBBounds.height());
    } else {
      child.setAttribute('y', padding[0]);
    }
  });

  // 更新cell Group宽高
  cellGroup.setAttributes({
    width: width + padding[1] + padding[3],
    height: height + padding[0] + padding[2]
  } as any);
}

/**
 * @description: icon option生成icon mark
 * @param {ColumnIconOption} icon
 * @return {*}
 */
export function dealWithIcon(
  icon: ColumnIconOption,
  mark?: Icon,
  col?: number,
  row?: number,
  range?: CellRange,
  table?: BaseTableAPI,
  dealWithIconComputeVar?: {
    addedHierarchyOffset: number;
  }
): Icon | TextIcon {
  // positionType在外部处理
  const iconAttribute = {} as any;

  // 图片内容
  if (icon.type === 'image') {
    if (icon.isGif) {
      iconAttribute.gif = icon.src;
      iconAttribute.image = icon.src;
    } else {
      iconAttribute.image = icon.src;
    }
  } else if (icon.type === 'svg' || 'svg' in icon) {
    iconAttribute.image = icon.svg;
    // } else if (icon.type === 'path') {
    //   // to do: 暂不支持
    // } else if (icon.type === 'font') {
    //   // to do: 暂不支持
  }

  // name
  // iconAttribute.name = icon.name;
  iconAttribute.width = icon.width;
  iconAttribute.height = icon.height;
  iconAttribute.visibleTime = icon.visibleTime ?? 'always';
  iconAttribute.funcType = icon.funcType;
  iconAttribute.interactive = icon.interactive;
  iconAttribute.isGif = (icon as any).isGif;

  let hierarchyOffset = 0;
  if (
    (!dealWithIconComputeVar || dealWithIconComputeVar?.addedHierarchyOffset === 0) &&
    isNumber(col) &&
    isNumber(row) &&
    table &&
    (icon.funcType === IconFuncTypeEnum.collapse ||
      icon.funcType === IconFuncTypeEnum.expand ||
      icon.positionType === IconPosition.contentLeft ||
      icon.positionType === IconPosition.contentRight)
  ) {
    // compute hierarchy offset
    // hierarchyOffset = getHierarchyOffset(col, row, table);
    hierarchyOffset = range
      ? getHierarchyOffset(range.start.col, range.start.row, table)
      : getHierarchyOffset(col, row, table);
    if (dealWithIconComputeVar) {
      dealWithIconComputeVar.addedHierarchyOffset = 1;
    }
  }

  iconAttribute.marginLeft = (icon.marginLeft ?? 0) + hierarchyOffset;
  iconAttribute.marginRight = icon.marginRight ?? 0;

  if (icon.interactive === false) {
    iconAttribute.pickable = false;
  }

  if (icon.hover) {
    iconAttribute.backgroundWidth = icon.hover.width ?? icon.width;
    iconAttribute.backgroundHeight = icon.hover.width ?? icon.width;
    iconAttribute.backgroundColor = icon.hover.bgColor ?? 'rgba(22,44,66,0.2)';
    iconAttribute.hoverImage = icon.hover.image;
  }

  if (icon.cursor) {
    iconAttribute.cursor = icon.cursor;
  }

  if ('shape' in icon && icon.shape === 'circle') {
    iconAttribute.shape = icon.shape;
  }

  if (mark) {
    mark.setAttributes(iconAttribute);
    mark.loadImage(iconAttribute.image);
    mark.tooltip = icon.tooltip;
    mark.name = icon.name;
    return mark;
  }
  // funcType, cursor, tooltip, hover在事件响应阶段处理

  let iconMark: Icon | TextIcon;
  if (icon.type === 'text') {
    iconAttribute.text = icon.content;
    merge(iconAttribute, icon.style);
    iconMark = new TextIcon(iconAttribute);
    iconMark.tooltip = icon.tooltip;
    iconMark.name = icon.name;
  } else {
    iconMark = new Icon(iconAttribute);
    iconMark.tooltip = icon.tooltip;
    iconMark.name = icon.name;
  }

  return iconMark;
}

/**
 * @description: icon option生成richtext icon config
 * @param {ColumnIconOption} icon
 * @return {*}
 */
export function dealWithRichTextIcon(icon: ColumnIconOption) {
  // positionType在外部处理
  const config = {} as any;

  // 图片内容
  if (icon.type === 'image') {
    config.image = icon.src;
  } else if (icon.type === 'svg' || 'svg' in icon) {
    config.image = icon.svg;
    // } else if (icon.type === 'path') {
    //   // to do: 暂不支持
    // } else if (icon.type === 'font') {
    //   // to do: 暂不支持
  }

  // name
  config.visibleTime = icon.visibleTime ?? 'always';
  config.funcType = icon.funcType;
  config.id = icon.name;
  config.width = icon.width;
  config.height = icon.height;

  if (icon.marginRight || icon.marginLeft) {
    config.margin = [0, icon.marginRight ?? 0, 0, icon.marginLeft ?? 0];
  }

  if (icon.hover) {
    config.backgroundWidth = icon.hover.width ?? icon.width;
    config.backgroundHeight = icon.hover.height ?? icon.height;
    config.backgroundShowMode = 'hover';
    config.hoverImage = icon.hover.image;
    config.backgroundStroke = false;
    config.backgroundFill = icon.hover.bgColor ?? 'rgba(22,44,66,0.2)';
  }

  if (icon.cursor) {
    config.cursor = icon.cursor;
  }

  config.tooltip = icon.tooltip;

  // funcType, cursor, tooltip在事件响应阶段处理
  return config;
}

/**
 * @description: 更新单元格内容宽度
 * @param {Group} cellGroup
 * @param {number} distWidth
 * @param {boolean} autoRowHeight
 * @return {*}
 */
export function updateCellContentWidth(
  cellGroup: Group,
  distWidth: number,
  cellHeight: number,
  detaX: number,
  autoRowHeight: boolean,
  padding: [number, number, number, number],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  scene: Scenegraph
): boolean {
  if (isValidNumber(cellGroup.contentWidth)) {
    detaX = distWidth - (cellGroup.contentWidth ?? cellGroup.attribute.width);
  }
  let leftIconWidth = 0;
  let leftIconHeight = 0;
  let rightIconWidth = 0;
  let rightIconHeight = 0;
  // let hasIcon = false;
  cellGroup.forEachChildren((iconMark: Icon) => {
    if (iconMark.role === 'icon-left') {
      leftIconWidth +=
        iconMark.AABBBounds.width() + (iconMark.attribute.marginLeft ?? 0) + (iconMark.attribute.marginRight ?? 0);
      leftIconHeight = Math.max(leftIconHeight, iconMark.AABBBounds.height());
    } else if (iconMark.role === 'icon-right') {
      rightIconWidth +=
        iconMark.AABBBounds.width() + (iconMark.attribute.marginLeft ?? 0) + (iconMark.attribute.marginRight ?? 0);
      rightIconHeight = Math.max(rightIconHeight, iconMark.AABBBounds.height());
    }
  });

  // 记录原始内容高度
  let oldTextHeight;
  const textMark = cellGroup.getChildByName('text');
  const cellContent = cellGroup.getChildByName('content') as CellContent;
  let contentHeight: number;
  if (textMark instanceof Text) {
    oldTextHeight = textMark.AABBBounds.height();
    textMark.setAttribute(
      'maxLineWidth',
      distWidth -
        leftIconWidth -
        rightIconWidth -
        (padding[1] + padding[3]) -
        (textMark.attribute.dx ?? 0) -
        (scene.table.theme._contentOffset ?? 0)
    );
    // contentWidth = textMark.AABBBounds.width();
    contentHeight = textMark.AABBBounds.height();
  } else if (textMark instanceof RichText) {
    oldTextHeight = textMark.AABBBounds.height();
    textMark.setAttribute('width', distWidth - leftIconWidth - rightIconWidth - (padding[1] + padding[3]));
    // contentWidth = textMark.AABBBounds.width();
    contentHeight = textMark.AABBBounds.height();
  } else if (cellContent) {
    oldTextHeight = cellContent.AABBBounds.height();
    cellContent.updateWidth(distWidth - leftIconWidth - rightIconWidth - (padding[1] + padding[3]));
    // contentWidth = cellContent.AABBBounds.width();
    contentHeight = cellContent.AABBBounds.height();
  }

  const oldCellHeight = Math.round(Math.max(leftIconHeight, rightIconHeight, oldTextHeight) + padding[0] + padding[2]);

  // 更新x方向位置
  cellGroup.forEachChildren((child: any) => {
    if (child.role === 'icon-left') {
      // do nothing
    } else if (child.role === 'icon-right') {
      child.setAttribute('x', child.attribute.x + detaX);
    } else if (child.role === 'icon-absolute-right') {
      child.setAttribute('x', child.attribute.x + detaX);
    } else if (child.name === 'content' || (child.name === 'text' && child.type !== 'richtext')) {
      const childTextAlign = child.attribute.textAlign ?? textAlign;
      if (childTextAlign === 'center') {
        child.setAttribute(
          'x',
          padding[3] + leftIconWidth + (distWidth - (padding[1] + padding[3]) - leftIconWidth - rightIconWidth) / 2
        );
      } else if (childTextAlign === 'right') {
        child.setAttribute('x', padding[3] + distWidth - (padding[1] + padding[3]) - rightIconWidth);
      } else {
        // left: do nothing
      }
    } else if (child.name === 'mark') {
      child.setAttribute('x', cellGroup.attribute.width);
    }
  });

  // 如果autoRowHeight && 高度改变 更新y方向位置
  if (autoRowHeight) {
    let newHeight = Math.max(leftIconHeight, contentHeight, rightIconHeight); // + padding[0] + padding[2]

    if (isCellHeightUpdate(scene, cellGroup, Math.round(newHeight + padding[0] + padding[2]), oldCellHeight)) {
      // cellGroup.setAttribute('height', newHeight + padding[0] + padding[2]);
      return true;
    }

    newHeight = (cellGroup.contentHeight ?? cellHeight) - (padding[0] + padding[2]);

    cellGroup.forEachChildren((child: any) => {
      if (child.type === 'rect' || child.type === 'chart' || child.name === CUSTOM_CONTAINER_NAME) {
        return;
      }
      if (child.name === 'mark') {
        child.setAttribute('y', 0);
      } else if (textBaseline === 'middle') {
        child.setAttribute('y', padding[0] + (newHeight - child.AABBBounds.height()) / 2);
      } else if (textBaseline === 'bottom') {
        child.setAttribute('y', padding[0] + newHeight - child.AABBBounds.height());
      } else {
        child.setAttribute('y', padding[0]);
      }
    });
  } else if (textBaseline === 'middle' || textBaseline === 'bottom') {
    cellGroup.forEachChildren((child: any) => {
      if (child.type === 'rect' || child.type === 'chart' || child.name === CUSTOM_CONTAINER_NAME) {
        return;
      }
      if (child.name === 'mark') {
        child.setAttribute('y', 0);
      } else if (textBaseline === 'middle') {
        child.setAttribute('y', (cellHeight - padding[2] + padding[0] - child.AABBBounds.height()) / 2);
      } else if (textBaseline === 'bottom') {
        child.setAttribute('y', cellHeight - child.AABBBounds.height() - padding[2]);
      } else {
        child.setAttribute('y', padding[0]);
      }
    });
  }
  return false;
}

/**
 * @description: 更新单元格内容宽度
 */
export function updateCellContentHeight(
  cellGroup: Group,
  distHeight: number,
  detaY: number,
  autoRowHeight: boolean,
  padding: [number, number, number, number],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  table: BaseTableAPI
) {
  const newHeight = distHeight - Math.floor(padding[0] + padding[2]);

  const textMark = cellGroup.getChildByName('text');

  if (textMark instanceof Text && !autoRowHeight) {
    textMark.setAttributes({
      heightLimit: table.options.customConfig?.limitContentHeight === false ? -1 : newHeight
    } as any);
  } else if (textMark instanceof RichText && !autoRowHeight) {
    textMark.setAttributes({
      height: newHeight
    });
  } else if (cellGroup.getChildByName('content')) {
    const cellContent = cellGroup.getChildByName('content') as CellContent;
    cellContent.updateHeight(newHeight);
  }

  // 更新y方向位置
  cellGroup.forEachChildren((child: any) => {
    child.setAttribute('dy', 0);
    if (child.type === 'rect' || child.type === 'chart' || child.name === CUSTOM_CONTAINER_NAME) {
      // do nothing
    } else if (child.name === 'mark') {
      child.setAttribute('y', 0);
    } else if (textBaseline === 'middle') {
      child.setAttribute('y', padding[0] + (newHeight - child.AABBBounds.height()) / 2);
    } else if (textBaseline === 'bottom') {
      child.setAttribute('y', padding[0] + newHeight - child.AABBBounds.height());
    } else {
      child.setAttribute('y', padding[0]);
    }
  });
}

/**
 * @description: 自适应行高模式下，判断当前单元格是否需要更新行高
 * @param {Scenegraph} scene
 * @param {Group} cellGroup
 * @param {number} newHeight
 * @param {number} oldHeight
 * @return {*}
 */
function isCellHeightUpdate(scene: Scenegraph, cellGroup: Group, newHeight: number, oldHeight: number): boolean {
  const table = scene.table;
  const mergeInfo = getCellMergeInfo(table, cellGroup.col, cellGroup.row);

  // let rowHeight: number = 0;
  if (mergeInfo && mergeInfo.end.row - mergeInfo.start.row) {
    oldHeight = oldHeight / (mergeInfo.end.row - mergeInfo.start.row + 1);
    newHeight = newHeight / (mergeInfo.end.row - mergeInfo.start.row + 1);
    for (let rowIndex = mergeInfo.start.row; rowIndex <= mergeInfo.end.row; rowIndex++) {
      const rowHeight = table.getRowHeight(rowIndex);

      if (rowHeight === oldHeight && newHeight !== rowHeight) {
        // 当前行的自适应行高，是由本单元格撑起；如果当前单元格高度发生变化，则更新行高
        return true;
      } else if (newHeight > rowHeight) {
        // 如果当前单元格高度超过目前所在行的行高，则更新行高
        return true;
      }
    }
  } else {
    const rowHeight = table.getRowHeight(cellGroup.row);

    if (rowHeight === oldHeight && newHeight !== rowHeight) {
      // 当前行的自适应行高，是由本单元格撑起；如果当前单元格高度发生变化，则更新行高
      return true;
    } else if (newHeight > rowHeight) {
      // 如果当前单元格高度超过目前所在行的行高，则更新行高
      return true;
    }
  }

  return false;
}

export function dealWithIconLayout(
  icons: ColumnIconOption[],
  cellGroup: Group,
  range: CellRange | undefined,
  table: BaseTableAPI
) {
  const leftIcons: ColumnIconOption[] = [];
  const rightIcons: ColumnIconOption[] = [];
  const contentLeftIcons: ColumnIconOption[] = [];
  const contentRightIcons: ColumnIconOption[] = [];
  const inlineFrontIcons: ColumnIconOption[] = [];
  const inlineEndIcons: ColumnIconOption[] = [];
  const absoluteLeftIcons: ColumnIconOption[] = [];
  const absoluteRightIcons: ColumnIconOption[] = [];

  let leftIconWidth = 0;
  let leftIconHeight = 0;
  let rightIconWidth = 0;
  let rightIconHeight = 0;
  let absoluteLeftIconWidth = 0;
  let absoluteRightIconWidth = 0;

  // icon分类
  icons.forEach(icon => {
    switch (icon.positionType) {
      case IconPosition.left:
        leftIcons.push(icon);
        break;
      case IconPosition.right:
        rightIcons.push(icon);
        break;
      case IconPosition.contentLeft:
        contentLeftIcons.push(icon);
        break;
      case IconPosition.contentRight:
        contentRightIcons.push(icon);
        break;
      // case IconPosition.absoluteLeft:
      //   absoluteLeftIcons.push(icon);
      //   break;
      case IconPosition.absoluteRight:
        absoluteRightIcons.push(icon);
        break;
      case IconPosition.inlineFront:
        inlineFrontIcons.push(icon);
        break;
      case IconPosition.inlineEnd:
        inlineEndIcons.push(icon);
        break;
    }
  });

  // 添加非cell icon & absolute icon
  leftIcons.forEach(icon => {
    const iconMark = dealWithIcon(icon, undefined, cellGroup.col, cellGroup.row, range, table);
    iconMark.role = 'icon-left';
    iconMark.name = icon.name;
    iconMark.setAttribute('x', leftIconWidth + (iconMark.attribute.marginLeft ?? 0));
    leftIconWidth +=
      iconMark.AABBBounds.width() + (iconMark.attribute.marginLeft ?? 0) + (iconMark.attribute.marginRight ?? 0);
    leftIconHeight = Math.max(leftIconHeight, iconMark.AABBBounds.height());
    cellGroup.appendChild(iconMark);
  });

  rightIcons.forEach(icon => {
    const iconMark = dealWithIcon(icon, undefined, cellGroup.col, cellGroup.row, range, table);
    iconMark.role = 'icon-right';
    iconMark.name = icon.name;
    iconMark.setAttribute('x', rightIconWidth + (iconMark.attribute.marginLeft ?? 0));
    rightIconWidth +=
      iconMark.AABBBounds.width() + (iconMark.attribute.marginLeft ?? 0) + (iconMark.attribute.marginRight ?? 0);
    rightIconHeight = Math.max(rightIconHeight, iconMark.AABBBounds.height());
    cellGroup.appendChild(iconMark);
  });

  absoluteLeftIcons.forEach(icon => {
    const iconMark = dealWithIcon(icon, undefined, cellGroup.col, cellGroup.row, range, table);
    iconMark.role = 'icon-absolute-left';
    iconMark.name = icon.name;
    iconMark.setAttribute('x', absoluteLeftIconWidth + (iconMark.attribute.marginLeft ?? 0));
    absoluteLeftIconWidth +=
      iconMark.AABBBounds.width() + (iconMark.attribute.marginLeft ?? 0) + (iconMark.attribute.marginRight ?? 0);
    cellGroup.appendChild(iconMark);
  });

  absoluteRightIcons.forEach(icon => {
    const iconMark = dealWithIcon(icon, undefined, cellGroup.col, cellGroup.row, range, table);
    iconMark.role = 'icon-absolute-right';
    iconMark.name = icon.name;
    iconMark.setAttribute('x', absoluteRightIconWidth + (iconMark.attribute.marginLeft ?? 0));
    absoluteRightIconWidth +=
      iconMark.AABBBounds.width() + (iconMark.attribute.marginLeft ?? 0) + (iconMark.attribute.marginRight ?? 0);
    cellGroup.appendChild(iconMark);
  });

  return {
    leftIcons,
    rightIcons,
    contentLeftIcons,
    contentRightIcons,
    inlineFrontIcons,
    inlineEndIcons,
    absoluteLeftIcons,
    absoluteRightIcons,
    leftIconWidth,
    leftIconHeight,
    rightIconWidth,
    rightIconHeight,
    absoluteLeftIconWidth,
    absoluteRightIconWidth
  };
}

function onBeforeAttributeUpdate(val: Record<string, any>, attribute: any) {
  if (val.hasOwnProperty('hoverIconId')) {
    // @ts-ignore
    const graphic = this as any;
    if (graphic.skipMergeUpdate) {
      return;
    }

    const cellGroup = getTargetCell(graphic) as Group;
    if (!cellGroup || !cellGroup.stage) {
      return;
    }
    const table = ((cellGroup as any).stage as any).table as BaseTableAPI;
    graphic.skipAttributeUpdate = true;
    const { mergeStartCol, mergeEndCol, mergeStartRow, mergeEndRow } = cellGroup;
    if (
      isValid(mergeStartCol) &&
      isValid(mergeEndCol) &&
      isValid(mergeStartRow) &&
      isValid(mergeEndRow) &&
      (mergeStartCol !== mergeEndCol || mergeStartRow !== mergeEndRow)
    ) {
      for (let col = mergeStartCol; col <= mergeEndCol; col++) {
        for (let row = mergeStartRow; row <= mergeEndRow; row++) {
          if (col === cellGroup.col && row === cellGroup.row) {
            // update icon state
            if (val.hoverIconId !== graphic.attribute.hoverIconId) {
              const icon = graphic._frameCache.icons.get(val.hoverIconId);
              graphic.updateHoverIconState(icon);
            }
            continue;
          }
          // const cell = table.scenegraph.getCell(col, row);
          const cell = table.scenegraph.highPerformanceGetCell(col, row);
          if (cell.role === 'cell') {
            const target = cell.getChildByName(graphic.name, true);
            if (!target || target.skipAttributeUpdate) {
              continue;
            }
            if (val.hoverIconId !== target.attribute.hoverIconId) {
              target.setAttribute('hoverIconId', val.hoverIconId);
              cell.addUpdateBoundTag();
            }
          }
        }
      }
      graphic.skipAttributeUpdate = undefined;
    }
  }
}
