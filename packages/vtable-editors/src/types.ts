export interface IEditor {
  /** 编辑器类型 */
  editorType?: string;
  /** 编辑配置 */
  editorConfig: any;
  container: HTMLElement;
  createElement: () => void;
  setValue: (value: string) => void;
  getValue: () => string | number | null;
  beginEditing: (
    container: HTMLElement,
    referencePosition: { rect: RectProps; placement?: Placement },
    value?: string
  ) => void;
  endEditing: () => void;
  exit: () => void;
  targetIsOnEditor: (target: HTMLElement) => boolean;
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
