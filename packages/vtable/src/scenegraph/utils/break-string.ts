import { convertInternal } from '../../tools/util';
import type { BaseTableAPI } from '../../ts-types/base-table';

export function breakString(textStr: string, table: BaseTableAPI): string[] {
  let text;
  if (!table.internalProps.enableLineBreak && !table.options.customConfig?.multilinesForXTable) {
    text = [convertInternal(textStr)];
  } else {
    text = convertInternal(textStr).replace(/\r?\n/g, '\n').replace(/\r/g, '\n').split('\n') || [];
  }

  // clear empty string in array end
  while (text.length && !text[text.length - 1]) {
    text.pop();
  }

  return text;
}
