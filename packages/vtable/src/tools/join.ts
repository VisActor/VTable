export function join(strArr: string[], joinChar: string) {
  // return strArr.join(joinChar);
  let str = '';
  for (let i = 0; i < strArr.length; i++) {
    str += strArr[i];
    if (i !== strArr.length - 1) {
      str += joinChar;
    }
  }

  return str;
}
