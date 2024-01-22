export function calcKeepAspectRatioSize(
  width: number, // image width
  height: number, // image height
  maxWidth: number, // cell width
  maxHeight: number // cell height
): {
  width: number;
  height: number;
} {
  // let newWidth = width;
  // let newHeight = height;
  // if (newWidth > maxWidth) {
  //   newWidth = maxWidth;
  //   newHeight = (newWidth * height) / width;
  // }
  // if (newHeight > maxHeight) {
  //   newHeight = maxHeight;
  //   newWidth = (newHeight * width) / height;
  // }
  // return {
  //   width: newWidth,
  //   height: newHeight
  // };

  const rectWidth = width;
  const rectHeight = height;
  const containerWidth = maxWidth;
  const containerHeight = maxHeight;
  const containerRatio = containerWidth / containerHeight;
  const rectRatio = rectWidth / rectHeight;
  let newWidth;
  let newHeight;
  let offsetX;
  let offsetY;

  if (rectRatio > containerRatio) {
    // 矩形的宽高比较大，以容器的宽度为基准进行缩放
    newWidth = containerWidth;
    newHeight = newWidth / rectRatio;
    offsetX = 0;
    offsetY = (containerHeight - newHeight) / 2;
  } else {
    // 矩形的高宽比较大，以容器的高度为基准进行缩放
    newHeight = containerHeight;
    newWidth = newHeight * rectRatio;
    offsetY = 0;
    offsetX = (containerWidth - newWidth) / 2;
  }

  return {
    width: newWidth,
    height: newHeight
  };
}
