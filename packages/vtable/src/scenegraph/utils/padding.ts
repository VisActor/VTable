type PaddingObject = { left?: number; right?: number; top?: number; bottom?: number };

function normalizePaddingArray(values: number[]): [number, number, number, number] {
  if (values.length === 0) {
    return [0, 0, 0, 0];
  }
  if (values.length === 1) {
    return [values[0], values[0], values[0], values[0]];
  }
  if (values.length === 2) {
    return [values[0], values[1], values[0], values[1]];
  }
  if (values.length === 3) {
    return [values[0], values[1], values[2], values[1]];
  }
  return [values[0], values[1], values[2], values[3]];
}

function parsePaddingString(padding: string): [number, number, number, number] {
  const values = padding
    .trim()
    .split(/\s+/)
    .map(token => Number.parseFloat(token))
    .filter(value => Number.isFinite(value));
  return normalizePaddingArray(values);
}

export function getQuadProps(
  paddingOrigin: number | string | number[] | PaddingObject
): [number, number, number, number] {
  if (typeof paddingOrigin === 'number' && Number.isFinite(paddingOrigin)) {
    return [paddingOrigin, paddingOrigin, paddingOrigin, paddingOrigin];
  }

  if (typeof paddingOrigin === 'string') {
    return parsePaddingString(paddingOrigin);
  }

  if (Array.isArray(paddingOrigin)) {
    const values = paddingOrigin
      .map(value => (typeof value === 'number' && Number.isFinite(value) ? value : 0))
      .slice(0, 4);
    return normalizePaddingArray(values);
  }

  if (
    paddingOrigin &&
    typeof paddingOrigin === 'object' &&
    !Array.isArray(paddingOrigin) &&
    (Number.isFinite(paddingOrigin.bottom) ||
      Number.isFinite(paddingOrigin.left) ||
      Number.isFinite(paddingOrigin.right) ||
      Number.isFinite(paddingOrigin.top))
  ) {
    return [paddingOrigin.top ?? 0, paddingOrigin.right ?? 0, paddingOrigin.bottom ?? 0, paddingOrigin.left ?? 0];
  }

  return [0, 0, 0, 0];
}
