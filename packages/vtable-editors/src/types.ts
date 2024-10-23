// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IEditor<V = any> {
  /**
   * Called when cell enters edit mode.
   *
   * Warning will be thrown if you don't provide this function
   * after removal of `beginEditing`.
   */
  onStart: (context: EditContext<V>) => void;
  /**
   * called when cell exits edit mode.
   *
   * Warning will be thrown if you don't provide this function
   * after removal of `exit`.
   */
  onEnd: () => void;
  /**
   * Called when user click somewhere while editor is in edit mode.
   *
   * If returns falsy, VTable will exit edit mode.
   *
   * If returns truthy or not defined, nothing will happen.
   * Which means, in this scenario, you need to call `endEdit` manually
   * to end edit mode.
   */
  isEditorElement?: (target: HTMLElement) => boolean;
  /**
   * Before set new value to table, use it to validate value.
   * If the interface returns true, the value takes effect; otherwise, it does not take effect.
   */
  validateValue?: () => boolean | Promise<boolean>;
  /**
   * Called when editor mode is exited by any means.
   * Expected to return the current value of the cell.
   */
  getValue: () => V;
  /**
   * Called when cell enter edit mode.
   * @deprecated use `onStart` instead.
   */
  beginEditing?: (container: HTMLElement, referencePosition: ReferencePosition, value: V) => void;
  /**
   * @see onEnd
   * @deprecated use `onEnd` instead.
   */
  exit?: () => void;
  /**
   * @see isEditorElement
   * @deprecated use `isEditorElement` instead.
   */
  targetIsOnEditor?: (target: HTMLElement) => boolean;
  /**
   * Called when cell enters edit mode with a callback function
   * that can be used to end edit mode.
   * @see EditContext#endEdit
   * @deprecated callback is provided as `endEdit` in `EditContext`, use `onStart` instead.
   */
  bindSuccessCallback?: (callback: () => void) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditContext<V = any> {
  /** Container element of the VTable instance. */
  container: HTMLElement;
  /** Position info of the cell that is being edited. */
  referencePosition: ReferencePosition;
  /** Cell value before editing. */
  value: V;
  /**
   * Callback function that can be used to end edit mode.
   *
   * In most cases you don't need to call this function,
   * since Enter key click is handled by VTable automatically,
   * and mouse click can be handled by `isEditorElement`.
   *
   * However, if your editor has its own complete button,
   * or you have external elements like Tooltip,
   * you may want to use this callback to help you
   * end edit mode.
   */
  endEdit: () => void;
  col: number;
  row: number;
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
