export interface IEditor {
  /** 编辑器类型 */
  editorType?: string;
  /** 编辑配置 */
  editorConfig: any;
  /* 编辑器挂载的容器 由vtable传入 */
  container: HTMLElement;
  /** 编辑完成后调用。注意如果是（enter键，鼠标点击其他位置）这类编辑完成已有VTable实现，编辑器内部有完成按钮等类似的完成操作需要调用这个方法 */
  successCallback?: Function;
  /** 获取编辑器当前值 */
  getValue: () => string | number | null;
  /** 编辑器进入编辑状态 */
  beginEditing: (
    container: HTMLElement,
    referencePosition: { rect: RectProps; placement?: Placement },
    value?: string
  ) => void;
  /** 编辑器退出编辑状态 */
  exit: () => void;
  /** 判断鼠标点击的target是否属于编辑器内部元素 */
  targetIsOnEditor: (target: HTMLElement) => boolean;
  /** 由VTable调用来传入编辑成功的回调  请将callback赋值到successCallback */
  bindSuccessCallback?: (callback: Function) => void;
}
export interface RectProps {
  left: number;
  top: number;
  width: number;
  height: number;
}
export enum Placement {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right'
}
