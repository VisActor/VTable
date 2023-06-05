/* eslint-disable no-undef */
export function calcStartPosition(
  left: number,
  top: number,
  width: number,
  height: number,
  contentWidth: number,
  contentHeight: number,
  textAlign: CanvasTextAlign = 'left',
  textBaseline: CanvasTextBaseline = 'middle',
  margin = [0, 0, 0, 0],
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0
): { x: number; y: number } {
  const right = left + width;
  const bottom = top + height;
  let x = left + margin[3] + paddingLeft;
  if (textAlign === 'right' || textAlign === 'end') {
    x = right - contentWidth - margin[1] - paddingRight;
  } else if (textAlign === 'center') {
    x = left + (width - contentWidth + paddingLeft - paddingRight) / 2;
  }
  let y = top + margin[0] + paddingTop;
  if (textBaseline === 'bottom' || textBaseline === 'alphabetic' || textBaseline === 'ideographic') {
    y = bottom - contentHeight - margin[2] - paddingBottom;
  } else if (textBaseline === 'middle') {
    y = top + (height - contentHeight + paddingTop - paddingBottom) / 2;
  }
  return { x, y };
}
