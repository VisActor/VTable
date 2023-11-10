export interface IEditor {
  /** 编辑器类型 */
  editorType?: string;
  /** 编辑配置 */
  editorConfig: any;
  createElement: () => void;
  setValue: (value: string) => void;
  getValue: () => void;
  beginEditing: () => void;
  endEditing: () => void;
  exit: () => void;
}
