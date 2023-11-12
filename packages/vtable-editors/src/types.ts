export interface IEditor {
  /** 编辑器类型 */
  editorType?: string;
  /** 编辑配置 */
  editorConfig: any;
  createElement: (container: HTMLElement) => void;
  setValue: (value: string) => void;
  getValue: () => void;
  beginEditing: (
    container: HTMLElement,
    rect: { top: number; left: number; width: number; height: number },
    value?: string
  ) => void;
  endEditing: () => void;
  exit: () => void;
}
