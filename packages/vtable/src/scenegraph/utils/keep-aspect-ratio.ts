export function calcKeepAspectRatioSize(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): {
  width: number;
  height: number;
} {
  let newWidth = width;
  let newHeight = height;
  if (newWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = (newWidth * height) / width;
  }
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (newHeight * width) / height;
  }
  return {
    width: newWidth,
    height: newHeight
  };
}
