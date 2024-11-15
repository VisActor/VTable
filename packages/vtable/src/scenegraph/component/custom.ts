import type { Cursor, ITimeline, Timeline } from '@src/vrender';
import {
  createArc,
  createCircle,
  createLine,
  createRect,
  REACT_TO_CANOPUS_EVENTS,
  Text,
  Group as VGroup
} from '@src/vrender';
import { isArray, isFunction, isObject, isString, isValid } from '@visactor/vutils';
import type {
  CellRange,
  ICustomLayout,
  ICustomRender,
  ICustomRenderElement,
  ICustomRenderElements,
  RectElement
} from '../../ts-types';
import { Icon } from '../graphic/icon';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { percentCalcObj } from '../../render/layout';
import { emptyCustomLayout } from '../../components/react/react-custom-layout';
import { getTargetCell } from '../../event/util';
import type { Group } from '../graphic/group';

export const CUSTOM_MERGE_PRE_NAME = '_custom_';
export const CUSTOM_CONTAINER_NAME = 'custom-container';
export const CUSTOM_MERGE_CONTAINER_NAME = CUSTOM_MERGE_PRE_NAME + '_0';

export function dealWithCustom(
  customLayout: ICustomLayout,
  customRender: ICustomRender,
  col: number,
  row: number,
  width: number,
  height: number,
  autoWidth: boolean,
  autoHeight: boolean,
  padding: [number, number, number, number],
  range: CellRange | undefined,
  table: BaseTableAPI
) {
  let renderDefault = true;
  let enableCellPadding = false;
  let expectedWidth: number;
  let expectedHeight: number;
  let customElements;
  let elementsGroup: VGroup;

  if (customLayout === 'react-custom-layout') {
    // customLayout = table._reactCreateGraphic;
    customLayout = table.reactCustomLayout?.getCustomLayoutFunc(col, row) || emptyCustomLayout;
  }
  if (typeof customLayout === 'function') {
    const arg = {
      col: range?.start.col ?? col,
      row: range?.start.row ?? row,
      dataValue: table.getCellOriginValue(col, row),
      value: table.getCellValue(col, row) || '',
      rect: {
        left: 0,
        top: 0,
        right: width,
        bottom: height,
        width,
        height
      },
      table,
      originCol: col,
      originRow: row
    };
    const customRenderObj = customLayout(arg);
    if (!customRenderObj) {
      return {
        renderDefault: true
      };
    }
    if (customRenderObj.rootContainer) {
      customRenderObj.rootContainer = decodeReactDom(customRenderObj.rootContainer, table.animationManager.timeline);
    }
    // expectedWidth = customRenderObj.expectedWidth;
    // expectedHeight = customRenderObj.expectedHeight;
    if (customRenderObj.rootContainer instanceof VGroup) {
      elementsGroup = customRenderObj.rootContainer;
      elementsGroup.name = CUSTOM_CONTAINER_NAME;
      (elementsGroup as any).col = col;
      (elementsGroup as any).row = row;
      // } else if (customRenderObj.rootContainer) {
      //   customElements = customRenderObj.rootContainer.getElements(undefined, false, false);
    }
    renderDefault = customRenderObj.renderDefault;
    enableCellPadding = customRenderObj.enableCellPadding;
  } else if (typeof customRender === 'function') {
    const arg = {
      col,
      row,
      dataValue: table.getCellOriginValue(col, row),
      value: table.getCellValue(col, row) || '',
      rect: {
        left: 0,
        top: 0,
        right: width,
        bottom: height,
        width,
        height
      },
      table
    };
    const customRenderObj = customRender(arg);
    if (customRenderObj) {
      customElements = customRenderObj.elements;
      renderDefault = customRenderObj.renderDefault;
      expectedWidth = customRenderObj.expectedWidth;
      expectedHeight = customRenderObj.expectedHeight;
    }
  } else if (customRender) {
    expectedWidth = customRender.expectedWidth;
    expectedHeight = customRender.expectedHeight;
    customElements = customRender.elements;
    renderDefault = customRender.renderDefault;
  }

  if (customElements) {
    const value = table.getCellValue(col, row);
    elementsGroup = adjustElementToGroup(
      customElements,
      autoWidth ? expectedWidth : width,
      autoHeight ? expectedHeight : height,
      value
    );
  }

  if (enableCellPadding) {
    elementsGroup.setAttributes({
      x: padding[3],
      y: padding[0],
      width: width - padding[1] - padding[3],
      height: height - padding[0] - padding[2]
    });
  }

  // for percent calc
  dealPercentCalc(elementsGroup, width, height);

  // deal with merge cell attribute update
  if (range && (range.start.col !== range.end.col || range.start.row !== range.end.row)) {
    bindAttributeUpdate(elementsGroup, col, row, 0);
  }

  return {
    elementsGroup,
    renderDefault
  };
}

function adjustElementToGroup(
  elements: ICustomRenderElements,
  width: number,
  height: number,
  value: any
): VGroup | undefined {
  const customGroup = new VGroup({
    x: 0,
    y: 0,
    width,
    height,
    fill: false,
    stroke: false,
    pickable: false
  });
  customGroup.name = CUSTOM_CONTAINER_NAME;

  const elementsAdjusted = adjustElementsPos(elements, width, height, value);
  elementsAdjusted.forEach(element => {
    if ((element as any).clickable) {
      element.pickable = (element as any).clickable;
    }
    switch (element.type) {
      case 'arc':
        const arc = createArc({
          x: element.x as number,
          y: element.y as number,
          dx: (element.dx ?? 0) as number,
          dy: (element.dy ?? 0) as number,
          fill: element.fill as string,
          stroke: element.stroke as string,
          outerRadius: element.radius as number,
          startAngle: element.startAngle as number,
          endAngle: element.endAngle as number,
          pickable: !!element.pickable,
          cursor: element.cursor as Cursor
        });
        arc.name = element.name;
        customGroup.appendChild(arc);
        break;
      case 'text':
        if (element.background) {
          const expandX = element.background?.expandX ?? 0;
          const expandY = element.background?.expandY ?? 0;
          const textBackRect = createRect({
            x: (element.x as number) - expandX,
            y: (element.y as number) - expandY,
            dx: (element.dx ?? 0) as number,
            dy: (element.dy ?? 0) as number,
            width: element.width + expandX * 2,
            height: element.height + expandY * 2,
            cornerRadius: element.background?.cornerRadius ?? 0,
            // fill: true,
            fill: element.background?.fill ?? '#888'
          });
          customGroup.appendChild(textBackRect);
        }
        const text = new Text(
          Object.assign(
            {
              pickable: !!element.pickable,
              fill: element.color ?? element.fill
            },
            element as any
          )
        );
        text.name = element.name;
        customGroup.appendChild(text);
        break;
      case 'rect':
        const rect = createRect({
          x: element.x as number,
          y: element.y as number,
          dx: (element.dx ?? 0) as number,
          dy: (element.dy ?? 0) as number,
          width: element.width as number,
          height: element.height as number,
          cornerRadius: element.radius as number,
          fill: element.fill as string,
          stroke: element.stroke as string,
          pickable: !!element.pickable,
          cursor: element.cursor as Cursor
        });
        rect.name = element.name;
        customGroup.appendChild(rect);
        break;
      case 'circle':
        const circle = createCircle({
          x: element.x as number,
          y: element.y as number,
          dx: (element.dx ?? 0) as number,
          dy: (element.dy ?? 0) as number,
          radius: element.radius as number,
          fill: element.fill as string,
          stroke: element.stroke as string,
          pickable: !!element.pickable,
          cursor: element.cursor as Cursor
        });
        circle.name = element.name;
        customGroup.appendChild(circle);
        break;
      case 'icon':
        const icon = new Icon({
          x: element.x as number,
          y: element.y as number,
          dx: (element.dx ?? 0) as number,
          dy: (element.dy ?? 0) as number,
          width: element.width as number,
          height: element.height as number,
          image: element.svg as string,
          backgroundWidth: element.hover ? ((element.hover.width ?? element.width) as number) : undefined,
          backgroundHeight: element.hover ? ((element.hover.width ?? element.width) as number) : undefined,
          backgroundColor: element.hover ? element.hover.bgColor ?? 'rgba(22,44,66,0.2)' : undefined,
          pickable: !!element.pickable,
          cursor: element.cursor as Cursor
        });
        icon.name = element.name;
        icon.role = 'icon-custom';
        customGroup.appendChild(icon);
        break;
      case 'image':
        const image = new Icon({
          x: element.x as number,
          y: element.y as number,
          dx: (element.dx ?? 0) as number,
          dy: (element.dy ?? 0) as number,
          width: element.width as number,
          height: element.height as number,
          image: element.src as string,
          backgroundWidth: element.hover ? ((element.hover.width ?? element.width) as number) : undefined,
          backgroundHeight: element.hover ? ((element.hover.width ?? element.width) as number) : undefined,
          backgroundColor: element.hover ? element.hover.bgColor ?? 'rgba(22,44,66,0.2)' : undefined,
          pickable: !!element.pickable,
          cursor: element.cursor as Cursor,
          shape: element.shape
        });
        image.name = element.name;
        image.role = 'image-custom';
        customGroup.appendChild(image);
        break;

      case 'line':
        const line = createLine({
          points: element.points,
          lineWidth: element.lineWidth ?? 1,
          stroke: element.stroke as string,
          pickable: !!element.pickable,
          cursor: element.cursor as Cursor
        });
        line.name = element.name;
        customGroup.appendChild(line);
        break;
    }
  });

  return customGroup;
}

function adjustElementsPos(
  originalElements: ICustomRenderElements,
  // rect: RectProps,
  width: number,
  height: number,
  // borderLineWidths: number[],
  value: any
): ICustomRenderElements {
  const result: ICustomRenderElements = [];
  // const { left, top, width, height } = rect;
  const left = 0;
  const top = 0;
  const borderLineWidths = [0, 0, 0, 0];

  for (let i = 0; i < originalElements.length; i++) {
    const originalElement = originalElements[i];
    const element = Object.assign({}, originalElement);
    // 执行相关函数
    for (const name in element) {
      if (element.hasOwnProperty(name) && isFunction(element[name])) {
        element[name] = (element[name] as Function)(value);
      }
    }

    // 转换字符串值（百分比、px）
    const rect = element as RectElement;
    if (isValid(rect.x)) {
      rect.x = isString(rect.x)
        ? transformString((rect as any).x as string, width - borderLineWidths[1])
        : Number(rect.x);
    }
    if (isValid(rect.y)) {
      rect.y = isString(rect.y)
        ? transformString((rect as any).y as string, height - borderLineWidths[2])
        : Number(rect.y);
    }
    if ('width' in element) {
      element.width = isString(element.width)
        ? transformString(element.width as string, width - borderLineWidths[1])
        : Number(element.width);
    }
    if ('height' in element) {
      element.height = isString(element.height)
        ? transformString(element.height as string, height - borderLineWidths[2])
        : Number(element.height);
    }
    if ('radius' in element) {
      element.radius = isString(element.radius)
        ? transformString(element.radius as string, Math.min(width - borderLineWidths[1], height - borderLineWidths[2]))
        : Number(element.radius);
    }
    if ('hover' in element) {
      // 转换字符串值（百分比、px）
      element.hover.x = isString(element.hover.x)
        ? transformString(element.hover.x as string, width - borderLineWidths[1])
        : Number(element.hover.x);
      element.hover.y = isString(element.hover.y)
        ? transformString(element.hover.y as string, height - borderLineWidths[2])
        : Number(element.hover.y);
      element.hover.width = isString(element.hover.width)
        ? transformString(element.hover.width as string, width - borderLineWidths[1])
        : Number(element.hover.width);

      element.hover.height = isString(element.hover.height)
        ? transformString(element.hover.height as string, height - borderLineWidths[2])
        : Number(element.hover.height);
      element.hover.x += left;
      element.hover.y += top;
    }
    // 矫正位置
    rect.x = rect.x + left;
    rect.y = rect.y + top;

    result.push(element as unknown as ICustomRenderElement);
  }

  return result;
}

function transformString(str: string, size?: number): number {
  if (str.endsWith('px')) {
    return parseInt(str, 10);
  } else if (str.endsWith('%') && size) {
    return (parseInt(str, 10) / 100) * size;
  }
  return parseInt(str, 10);
}

export function dealPercentCalc(group: VGroup, parentWidth: number, parentHeight: number) {
  if (!group) {
    return;
  }
  group.forEachChildren((child: VGroup) => {
    if (!child) {
      return;
    }
    if (isObject(child.attribute.width) && (child.attribute.width as percentCalcObj).percent) {
      child.setAttribute(
        'width',
        Math.max(
          0,
          ((child.attribute.width as percentCalcObj).percent / 100) * parentWidth +
            ((child.attribute.width as percentCalcObj).delta ?? 0)
        )
      );
    }

    if (child.attribute.width < 0) {
      child.setAttribute('width', 0);
    }

    if (isObject(child.attribute.height) && (child.attribute.height as percentCalcObj).percent) {
      child.setAttribute(
        'height',
        Math.max(
          0,
          ((child.attribute.height as percentCalcObj).percent / 100) * parentHeight +
            ((child.attribute.height as percentCalcObj).delta ?? 0)
        )
      );
    }

    if (child.attribute.height < 0) {
      child.setAttribute('height', 0);
    }

    if (child.type === 'group') {
      dealPercentCalc(child, child.attribute.width, child.attribute.height);
    }
  });
}

// temp devode for react jsx customLayout
export function decodeReactDom(dom: any, timeline?: ITimeline) {
  if (
    !dom ||
    (!isValid(dom.$$typeof) && // for react
      !isValid(dom.vtype)) // for openinula
  ) {
    // not react or openinula
    return dom;
  }
  const type = dom.type;
  const { attribute, children, stateProxy, animation } = dom.props;
  const g = type({ attribute });
  parseToGraphic(g, dom.props);
  if (stateProxy) {
    g.stateProxy = stateProxy;
  }

  g.id = attribute.id;
  g.name = attribute.name;
  if (isArray(children)) {
    children.forEach((item: any) => {
      const c = decodeReactDom(item, timeline);
      c && c.type && g.add(c);
    });
  } else if (children) {
    g.add(decodeReactDom(children, timeline));
  }

  if (isArray(animation) && timeline) {
    const animate = g.animate();
    animate.setTimeline(timeline);
    animation.forEach((item: any[]) => {
      animate[item[0]](...item.slice(1));
    });
  }
  return g;
}

function parseToGraphic(g: any, props: any) {
  let isGraphic: boolean = false;
  switch (g.type) {
    case 'richtext':
      break;
    // case 'rich/text':
    //   out = g.attribute || {};
    //   childrenList[0] && (out.text = childrenList[0]);
    //   break;
    case 'rich/image':
      break;
    default:
      isGraphic = true;
  }

  if (isGraphic) {
    // childrenList.forEach((c: any) => {
    //   c && g.add(c);
    // });

    Object.keys(props).forEach(k => {
      const en = REACT_TO_CANOPUS_EVENTS[k];
      if (en) {
        g.on(en, props[k]);
      }
    });

    // } else {
    //   if (g.type === 'richtext') {
    //     g.attribute.textConfig = childrenList.map(item => item.attribute).filter(item => item);
    //   }
  }
}

function bindAttributeUpdate(group: VGroup, col: number, row: number, index: number, preId?: string) {
  if (!group) {
    return;
  }
  group.name = `${CUSTOM_MERGE_PRE_NAME}${preId ?? ''}_${index}`;
  group.onBeforeAttributeUpdate = onBeforeAttributeUpdate as any;
  // group.on('afterAttributeUpdate', (e) => {console.log('afterAttributeUpdate', e)})
  if (group.type === 'group' && group.childrenCount) {
    group.forEachChildren((child: VGroup, childIndex: number) => {
      bindAttributeUpdate(child, col, row, childIndex, (preId ?? '') + '_' + index);
    });
  }
}

function onBeforeAttributeUpdate(val: Record<string, any>, attribute: any) {
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
          continue;
        }
        // const cell = table.scenegraph.getCell(col, row);
        const cell = table.scenegraph.highPerformanceGetCell(col, row);
        if (cell.role === 'cell') {
          const target = cell.getChildByName(graphic.name, true);
          if (!target || target.skipAttributeUpdate) {
            continue;
          }
          for (const key in val) {
            // 表格内merge 单元格布局时，会使用dx dy定位，避免重复更新值，属性同步跳过 dx dy
            // console.log(
            //   '[onBeforeAttributeUpdate]',
            //   target._uid,
            //   cellGroup.col,
            //   cellGroup.row,
            //   col,
            //   row,
            //   key,
            //   val[key]
            // );
            if (val[key] !== target.attribute[key] && key !== 'dx' && key !== 'dy') {
              target.setAttribute(key, val[key]);
            }
          }
        }
      }
    }
    graphic.skipAttributeUpdate = undefined;
    // return attribute;
  }
}
