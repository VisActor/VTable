// import type { InputEditorConfig } from './input-editor';
// import type { ListEditorConfig } from './list-editor';
// import type { IEditor, Placement, RectProps } from './types';

// //这个考虑下是否还需要 是直接使用IEditor就行的吗？
// export class BaseEditor implements IEditor {
//   editorType: string;
//   editorConfig: ListEditorConfig | InputEditorConfig;
//   element: HTMLElement;
//   container: HTMLElement;
//   constructor() {
//     this.editorType = 'base';
//   }
//   createElement() {
//     // do nothing
//   }
//   setValue(value: string) {
//     // do nothing
//   }
//   getValue() {
//     return '';
//   }
//   beginEditing(container: HTMLElement, referencePosition: { rect: RectProps; placement?: Placement }, value?: string) {
//     // do nothing
//   }
//   targetIsOnEditor(target: HTMLElement) {
//     //
//     return false;
//   }
//   endEditing() {
//     // do nothing
//   }

//   exit(): void {
//     // do nothing
//   }
// }
