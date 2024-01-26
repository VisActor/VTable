// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IEditor<V = any> {
  /**
   * 当单元格进入编辑状态时调用
   */
  onStart?: (context: EditContext<V>) => void;
  /**
   * 当单元格退出编辑状态时调用
   */
  onEnd?: () => void;
  /**
   * 当单元格处于编辑状态时鼠标点击其他位置时调用。
   *
   * 如果返回值为虚值，则 VTable 将退出编辑状态。
   *
   * 如果不提供此函数，VTable 将不会在点击其他位置时自动退出编辑状态。
   * 你需要使用 `onStart` 提供的 `endEdit` 函数来手动退出编辑状态。
   */
  onClickElsewhere?: (target: HTMLElement) => boolean;
  /**
   * 当单元格退出编辑状态后，VTable 将调用此函数来获取编辑后的值
   */
  getValue: () => V;
  /**
   * 编辑器进入编辑状态
   * @deprecated 请改用 `onStart` 代替。
   */
  beginEditing?: (container: HTMLElement, referencePosition: ReferencePosition, value: V) => void;
  /**
   * @see onEnd
   * @deprecated 请改用 `onEnd` 代替。
   */
  exit?: () => void;
  /**
   * @see onClickElsewhere
   * @deprecated 请改用 `onClickElsewhere` 代替。
   */
  targetIsOnEditor?: (target: HTMLElement) => boolean;
  /**
   * beginEditing 调用时调用，提供一个回调函数，用于结束编辑器编辑状态。
   * @see EditContext#endEdit
   * @deprecated 请改用 `onStart` 代替。
   */
  bindSuccessCallback?: (callback: () => void) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditContext<V = any> {
  /**
   * VTable 所在容器
   */
  container: HTMLElement;
  /**
   * 单元格所在位置
   */
  referencePosition: ReferencePosition;
  /**
   * 单元格当前值
   */
  value: V;
  /**
   * 立即结束编辑器编辑状态。
   *
   * 大多数情况下你并不需要调用这个函数，因为
   * VTable 已经自动对 Enter 键以及
   * 鼠标点击其他位置（`onClickElsewhere`）进行了处理。
   *
   * 但如果你的编辑器内部有自己的完成按钮，或是
   * 像 Tooltip 有外部悬浮元素，不太好或者没有办法
   * 使用 `onClickElsewhere` 进行判断时，你
   * 可以使用这个回调来帮助你处理编辑器的退出逻辑。
   */
  endEdit: () => void;
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

export interface ReferencePosition {
  rect: RectProps;
  placement?: Placement;
}
