export function getBorderLine(
  colWidth: number,
  rowHeight: number,
  top: boolean,
  right: boolean,
  bottom: boolean,
  left: boolean
) {
  const x = left ? -0.5 : 0;
  const y = top ? -0.5 : 0;
  // const detaWidth = left ? 0.5 : right ? -0.5 : 0;
  const detaWidth = left && right ? 0 : left ? 0.5 : right ? -0.5 : 0;
  // const detaHeight = top ? 0.5 : bottom ? -0.5 : 0;
  const detaHeight = top && bottom ? 0 : top ? 0.5 : bottom ? -0.5 : 0;

  const options = [];
  if (top) {
    options.push({
      x,
      y,
      points: [
        { x: 0, y: 0 },
        { x: colWidth + detaWidth, y: 0 }
      ]
    });
  }
  if (right) {
    options.push({
      x,
      y,
      points: [
        { x: colWidth + detaWidth, y: 0 },
        { x: colWidth + detaWidth, y: rowHeight + detaHeight }
      ]
    });
  }
  if (bottom) {
    options.push({
      x,
      y,
      points: [
        { x: colWidth + detaWidth, y: rowHeight + detaHeight },
        { x: 0, y: rowHeight + detaHeight }
      ]
    });
  }
  if (left) {
    options.push({
      x,
      y,
      points: [
        { x: 0, y: rowHeight + detaHeight },
        { x: 0, y: 0 }
      ]
    });
  }

  return options;
}
