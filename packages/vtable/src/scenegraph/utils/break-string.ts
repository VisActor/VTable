export function breakString(
  ctx: CanvasRenderingContext2D,
  str: string,
  width: number,
  font: string
): string[] | string {
  if (!width) {
    return str;
  }
  str = String(str);
  const multilines = str.replace(/\r?\n/g, '\n').replace(/\r/g, '\n').split('\n');

  // 准备ctx
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = font;

  const strArr = [];
  for (let i = 0; i < multilines.length; i++) {
    let temp = str;
    let widthOrigin = Math.floor(ctx.measureText(str).width);
    if (widthOrigin <= width) {
      strArr.push(temp);
    } else {
      let i = 0;
      while (widthOrigin > width) {
        const index = getStringIndex(ctx, str, width);
        strArr.push(temp.slice(0, index));
        temp = temp.slice(index);
        widthOrigin = Math.floor(ctx.measureText(temp).width);
        if (i++ > 1000) {
          // debugger;
          console.error('breakString over 1000 times');
        }
      }
      strArr.push(temp);
    }
  }

  return strArr;
}

function getStringIndex(ctx: CanvasRenderingContext2D, str: string, width: number) {
  // 测量从头到当前位置宽度以及从头到下一个字符位置宽度
  const widthOrigin = Math.floor(ctx.measureText(str).width);
  if (widthOrigin <= width) {
    return str.length;
  }

  const guessIndex = Math.ceil((width / widthOrigin) * str.length) || 0;
  let index = guessIndex;
  let temp = str.slice(0, index);
  let tempWidth = Math.floor(ctx.measureText(temp).width);

  let tempNext = str.slice(0, index + 1);
  let tempWidthNext = Math.floor(ctx.measureText(tempNext).width);

  // 到当前位置宽度 < width && 到下一个字符位置宽度 > width时，认为找到准确阶段位置
  let i = 0;
  while (tempWidth > width || tempWidthNext <= width) {
    if (tempWidth > width) {
      index--;
    } else {
      index++;
    }

    temp = str.slice(0, index);
    tempWidth = Math.floor(ctx.measureText(temp).width);

    tempNext = str.slice(0, index + 1);
    tempWidthNext = Math.floor(ctx.measureText(tempNext).width);

    if (i++ > 1000) {
      // debugger;
      console.error('getStringIndex over 1000 times');
    }
  }

  return index;
}
