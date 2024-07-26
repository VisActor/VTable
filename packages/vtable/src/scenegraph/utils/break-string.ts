import { isString } from '@visactor/vutils';
import { convertInternal } from '../../tools/util';
import type { BaseTableAPI } from '../../ts-types/base-table';

export function breakString(textStr: string, table: BaseTableAPI) {
  let moreThanMaxCharacters = false;
  if (isString(textStr) && textStr.length > (table.options.maxCharactersNumber || 200)) {
    textStr = textStr.slice(0, table.options.maxCharactersNumber || 200);
    textStr += '\u2026';
    moreThanMaxCharacters = true;
  }
  let text;
  if (!table.internalProps.enableLineBreak && !table.options.customConfig?.multilinesForXTable) {
    text = [convertInternal(textStr)];
  } else {
    text = convertInternal(textStr).replace(/\r?\n/g, '\n').replace(/\r/g, '\n').split('\n') || [];
  }

  // clear empty string in array end
  while (text.length && text.length > 1 && !text[text.length - 1]) {
    text.pop();
  }

  if (table.options.customConfig?.multilinesForXTable && !table.internalProps.autoWrapText) {
    // clear empty string in array start;
    // align width xtable display
    while (text.length && text.length > 1 && !text[0]) {
      text.shift();
    }
  }

  return {
    text,
    moreThanMaxCharacters
  };
}
