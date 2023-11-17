import type { Cursor } from '@visactor/vrender';
import { createArc, createCircle, createLine, createRect, Group as VGroup } from '@visactor/vrender';
import { isFunction, isObject, isString, isValid } from '@visactor/vutils';
import type {
  ICustomLayout,
  ICustomRender,
  ICustomRenderElement,
  ICustomRenderElements,
  RectElement
} from '../../ts-types';
import { Group } from '../graphic/group';
import { Icon } from '../graphic/icon';
import { WrapText } from '../graphic/text';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { percentCalcObj, Rect } from '../../render/layout';

export function dealWithCustom(
  customLayout: ICustomLayout,
  customRender: ICustomRender,
  col: number,
  row: number,
  width: number,
  height: number,
  autoWidth: boolean,
  autoHeight: boolean,
  table: BaseTableAPI
) {
  let renderDefault = true;
  let expectedWidth: number;
  let expectedHeight: number;
  let customElements;
  let elementsGroup: VGroup;

  if (typeof customLayout === 'function') {
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
    const customRenderObj = customLayout(arg);
    if (customRenderObj.rootContainer) {
      customRenderObj.rootContainer = decodeReactDom(customRenderObj.rootContainer);
    }
    // expectedWidth = customRenderObj.expectedWidth;
    // expectedHeight = customRenderObj.expectedHeight;
    if (customRenderObj.rootContainer instanceof VGroup) {
      elementsGroup = customRenderObj.rootContainer;
      elementsGroup.name = 'custom-container';
      // } else if (customRenderObj.rootContainer) {
      //   customElements = customRenderObj.rootContainer.getElements(undefined, false, false);
    }
    renderDefault = customRenderObj.renderDefault;
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

  // for percent calc
  dealPercentCalc(elementsGroup, width, height);

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
  customGroup.name = 'custom-container';

  const elementsAdjusted = adjustElementsPos(elements, width, height, value);
  elementsAdjusted.forEach(element => {
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
          pickable: !!element.clickable,
          cursor: element.cursor as Cursor
        });
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
        const text = new WrapText(
          Object.assign(
            {
              pickable: !!element.clickable,
              fill: element.color ?? element.fill
            },
            element as any
          )
        );
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
          pickable: !!element.clickable,
          cursor: element.cursor as Cursor
        });
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
          pickable: !!element.clickable,
          cursor: element.cursor as Cursor
        });
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
          pickable: !!element.clickable,
          cursor: element.cursor as Cursor
        });
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
          pickable: !!element.clickable,
          cursor: element.cursor as Cursor,
          shape: element.shape
        });
        image.role = 'image-custom';
        customGroup.appendChild(image);
        break;

      case 'line':
        const line = createLine({
          points: element.points,
          stroke: element.stroke as string,
          pickable: !!element.clickable,
          cursor: element.cursor as Cursor
        });
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
    if (isObject(child.attribute.width) && (child.attribute.width as percentCalcObj).percent) {
      child.setAttribute(
        'width',
        ((child.attribute.width as percentCalcObj).percent / 100) * parentWidth +
          ((child.attribute.width as percentCalcObj).delta ?? 0)
      );
    }

    if (isObject(child.attribute.height) && (child.attribute.height as percentCalcObj).percent) {
      child.setAttribute(
        'height',
        ((child.attribute.height as percentCalcObj).percent / 100) * parentHeight +
          ((child.attribute.height as percentCalcObj).delta ?? 0)
      );
    }

    if (child.type === 'group') {
      dealPercentCalc(child, child.attribute.width, child.attribute.height);
    }
  });
}

// temp devode for react jsx customLayout
export function decodeReactDom(dom: any) {
  if (!dom.$$typeof) {
    // not react
    return dom;
  }
  const type = dom.type;
  const { attribute, children } = dom.props;
  const g = type({ attribute });
  g.id = attribute.id;
  g.name = attribute.name;
  children &&
    children.length &&
    children.forEach((item: any) => {
      const c = decodeReactDom(item);
      g.add(c);
    });
  return g;
}
