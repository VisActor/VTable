import {
  matrixAllocate,
  transformPointForCanvas,
  mapToCanvasPointForCanvas,
  registerGlobalEventTransformer,
  registerWindowEventTransformer,
  vglobal
} from '@visactor/vtable/es/vrender';
import type { BaseTable } from '@visactor/vtable/src/core/BaseTable';
import type { ListTable, pluginsDefinition, BaseTableAPI } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type { TableEvents } from '@visactor/vtable/src/core/TABLE_EVENT_TYPE';
import type { EventArg } from './types';

// Extend the ListTable interface to include the rotation methods
declare module '@visactor/vtable' {
  interface ListTableAll {
    rotate90WithTransform?: (rotateDom: HTMLElement) => void;
    cancelTransform?: (rotateDom: HTMLElement) => void;
    rotateDegree?: number;
  }
}
import type { Matrix } from '@visactor/vutils';
export type IRotateTablePluginOptions = {
  id?: string;
  // // 旋转角度
  // rotate?: number;
};
/**
 * 旋转表格插件。
 * 业务层旋转功能没有使用收系统接口的话，用的transform:'rotate(90deg)'的设置来达到旋转的目的。vtable及vrender都没有进行坐标处理，这样就会导致交互错乱。
 * 所以需要进行坐标转换，将旋转后的坐标转换后作为VRender及VTable逻辑中用到的坐标。
 * 这里使用transform:'rotate(90deg)'的设置来达到旋转的目的。 其他角度应该也是可以实现的，请自行扩展这个插件并兼容
 */
export class RotateTablePlugin implements pluginsDefinition.IVTablePlugin {
  id = `rotate-table`;
  name = 'Rotate Table';
  runTime = [TABLE_EVENT_TYPE.INITIALIZED];
  table: ListTable;
  matrix: Matrix;
  vglobal_mapToCanvasPoint: typeof vglobal.mapToCanvasPoint; // 保存vrender中vglobal的mapToCanvasPoint原方法
  // pluginOptions: IRotateTablePluginOptions;
  constructor(pluginOptions?: IRotateTablePluginOptions) {
    this.id = pluginOptions?.id ?? this.id;
    // this.pluginOptions = pluginOptions;
  }
  run(...args: [EventArg, TableEvents[keyof TableEvents] | TableEvents[keyof TableEvents][], BaseTableAPI]) {
    const table: BaseTableAPI = args[2];
    this.table = table as ListTable;
    //将函数rotate90WithTransform绑定到table实例上，一般情况下插件不需要将api绑定到table实例上，可以直接自身实现某个api功能
    (this.table as any).rotate90WithTransform = rotate90WithTransform.bind(this.table);
    (this.table as any).cancelTransform = cancelTransform.bind(this.table);
  }

  release() {
    // 移除绑定的事件
  }
}

/**
 * 业务层旋转功能没有使用收系统接口的话，用的transform:'rotate(90deg)'的设置来达到旋转的目的。vtable及vrender都没有进行坐标处理，这样就会导致交互错乱。
 * 所以需要进行坐标转换，将旋转后的坐标转换后作为VRender及VTable逻辑中用到的坐标。
 */
export function rotate90WithTransform(this: BaseTable, rotateDom: HTMLElement) {
  this.rotateDegree = 90;
  const rotateCenter =
    rotateDom.clientWidth < rotateDom.clientHeight
      ? Math.max(rotateDom.clientWidth, rotateDom.clientHeight) / 2
      : Math.min(rotateDom.clientWidth, rotateDom.clientHeight) / 2;
  const domRect = this.getElement().getBoundingClientRect();
  const x1 = domRect.left;
  const y1 = domRect.top;
  const x2 = domRect.right;
  const y2 = domRect.bottom;

  rotateDom.style.transform = 'rotate(90deg)';
  rotateDom.style.transformOrigin = `${rotateCenter}px ${rotateCenter}px`;
  const getRect = () => {
    return {
      x1,
      y1,
      x2,
      y2
    };
  };
  // 获取视口尺寸的通用方法
  const getViewportDimensions = () => {
    // 浏览器环境
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
      };
    }
    // 默认使用容器的尺寸
    return rotateDom.getBoundingClientRect();
  };

  const getMatrix = () => {
    const viewPortWidth = getViewportDimensions().width; //获取整个视口的尺寸
    const domRect = this.getElement().getBoundingClientRect(); //TODO 这个地方应该获取窗口的宽高 最好能从vglobal上直接获取
    const x1 = domRect.top;
    const y1 = viewPortWidth - domRect.right;

    const matrix = matrixAllocate.allocate(1, 0, 0, 1, 0, 0);
    matrix.translate(x1, y1);
    const centerX = rotateCenter - x1;
    const centerY = rotateCenter - y1;
    matrix.translate(centerX, centerY);
    matrix.rotate(Math.PI / 2);
    matrix.translate(-centerX, -centerY);
    const rotateRablePlugin = this.pluginManager.getPluginByName('Rotate Table');
    if (rotateRablePlugin) {
      (rotateRablePlugin as RotateTablePlugin).matrix = matrix;
    }
    return matrix;
  };
  registerGlobalEventTransformer(vglobal, this.getElement(), getMatrix, getRect as any, transformPointForCanvas);
  registerWindowEventTransformer(
    this.scenegraph.stage.window,
    this.getElement(),
    getMatrix,
    getRect as any,
    transformPointForCanvas
  );
  const rotateRablePlugin = this.pluginManager.getPluginByName('Rotate Table');
  if (rotateRablePlugin) {
    (rotateRablePlugin as RotateTablePlugin).vglobal_mapToCanvasPoint = vglobal.mapToCanvasPoint;
  }
  vglobal.mapToCanvasPoint = mapToCanvasPointForCanvas;
  //transformPointForCanvas和mapToCanvasPointForCanvas时相对应的
  //具体逻辑在 VRender/packages/vrender-core/src/common/event-transformer.ts中
  // 可以自定义这两个函数 来修改事件属性，transformPointForCanvas中将坐标转换后存放了_canvasX _canvasY，mapToCanvasPointForCanvas中加以利用
  // 在VTable的touch文件中，利用到了_canvasX _canvasY 所以如果自定义上面两个函数也需提供_canvasX _canvasY
}
export function cancelTransform(this: BaseTable, rotateDom: HTMLElement) {
  this.rotateDegree = 0;
  rotateDom.style.transform = 'none';
  rotateDom.style.transformOrigin = 'none';
  const domRect = this.getElement().getBoundingClientRect();
  const x1 = domRect.left;
  const y1 = domRect.top;
  const x2 = domRect.right;
  const y2 = domRect.bottom;

  const getRect = () => {
    return {
      x1,
      y1,
      x2,
      y2
    };
  };
  const getMatrix = () => {
    const matrix = matrixAllocate.allocate(1, 0, 0, 1, 0, 0);
    matrix.translate(x1, y1);
    return matrix;
  };
  registerGlobalEventTransformer(vglobal, this.getElement(), getMatrix, getRect as any, transformPointForCanvas);
  registerWindowEventTransformer(
    this.scenegraph.stage.window,
    this.getElement(),
    getMatrix,
    getRect as any,
    transformPointForCanvas
  );
  const rotateRablePlugin = this.pluginManager.getPluginByName('Rotate Table');
  if (rotateRablePlugin) {
    vglobal.mapToCanvasPoint = (rotateRablePlugin as RotateTablePlugin).vglobal_mapToCanvasPoint;
  }
}
