import {
  matrixAllocate,
  transformPointForCanvas,
  mapToCanvasPointForCanvas,
  registerGlobalEventTransformer,
  registerWindowEventTransformer,
  vglobal
} from '@visactor/vtable/es/vrender';
import type { BaseTable } from '@visactor/vtable/src/core/BaseTable';
import * as VTable from '@visactor/vtable';
import type { TableEvents } from '@visactor/vtable/src/core/TABLE_EVENT_TYPE';
import type { EventArg } from './types';
// export type IRotateTablePluginOptions = {
//   // 旋转角度
//   rotate?: number;
// };
/**
 * 旋转表格插件。
 * 业务层旋转功能没有使用收系统接口的话，用的transform:'rotate(90deg)'的设置来达到旋转的目的。vtable及vrender都没有进行坐标处理，这样就会导致交互错乱。
 * 所以需要进行坐标转换，将旋转后的坐标转换后作为VRender及VTable逻辑中用到的坐标。
 * 这里使用transform:'rotate(90deg)'的设置来达到旋转的目的。 其他角度应该也是可以实现的，请自行扩展这个插件并兼容
 */
export class RotateTablePlugin implements VTable.plugins.IVTablePlugin {
  id = 'rotate-table';
  runTime = [VTable.TABLE_EVENT_TYPE.INITIALIZED];
  table: VTable.ListTable;
  vglobal_mapToCanvasPoint: any; // 保存vrender中vglobal的mapToCanvasPoint原方法
  // pluginOptions: IRotateTablePluginOptions;
  constructor() {
    // this.pluginOptions = pluginOptions;
  }
  run(...args: [EventArg, TableEvents[keyof TableEvents] | TableEvents[keyof TableEvents][], VTable.BaseTableAPI]) {
    const table: VTable.BaseTableAPI = args[2];
    this.table = table as VTable.ListTable;
    //将函数rotate90WithTransform绑定到table实例上
    this.table.rotate90WithTransform = rotate90WithTransform.bind(this.table);
    this.table.cancelTransform = cancelTransform.bind(this.table);
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
  const rotateCenter = Math.min(rotateDom.clientWidth, rotateDom.clientHeight) / 2;
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
  const getMatrix = () => {
    const matrix = matrixAllocate.allocate(1, 0, 0, 1, 0, 0);
    matrix.translate(x1, y1);
    const centerX = rotateCenter - x1;
    const centerY = rotateCenter - y1;
    matrix.translate(centerX, centerY);
    matrix.rotate(Math.PI / 2);
    matrix.translate(-centerX, -centerY);
    return matrix;
  };
  registerGlobalEventTransformer(vglobal, this.getElement(), getMatrix, getRect, transformPointForCanvas);
  registerWindowEventTransformer(
    this.scenegraph.stage.window,
    this.getElement(),
    getMatrix,
    getRect,
    transformPointForCanvas
  );
  this.vglobal_mapToCanvasPoint = vglobal.mapToCanvasPoint;
  vglobal.mapToCanvasPoint = mapToCanvasPointForCanvas;
  //transformPointForCanvas和mapToCanvasPointForCanvas时相对应的
  //具体逻辑在 VRender/packages/vrender-core/src/common/event-transformer.ts中
  // 可以自定义这两个函数 来修改事件属性，transformPointForCanvas中将坐标转换后存放了_canvasX _canvasY，mapToCanvasPointForCanvas中加以利用
  // 在VTable的touch文件中，利用到了_canvasX _canvasY 所以如果自定义上面两个函数也需提供_canvasX _canvasY
}
export function cancelTransform(this: BaseTable, rotateDom: HTMLElement) {
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
  registerGlobalEventTransformer(vglobal, this.getElement(), getMatrix, getRect, transformPointForCanvas);
  registerWindowEventTransformer(
    this.scenegraph.stage.window,
    this.getElement(),
    getMatrix,
    getRect,
    transformPointForCanvas
  );
  vglobal.mapToCanvasPoint = this.vglobal_mapToCanvasPoint;
}
