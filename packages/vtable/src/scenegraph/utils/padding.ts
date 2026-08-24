type PaddingObject = { left?: number; right?: number; top?: number; bottom?: number };
type Quad = [any, any, any, any];

function normalizeQuadArray(values: any[]): Quad {
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

function parseStringQuad(padding: string): Quad {
  const tokens = padding.trim().split(/\s+/);
  const values = tokens.map(token => Number.parseFloat(token)).filter(value => Number.isFinite(value));

  if (values.length === tokens.length && values.length > 0) {
    return normalizeQuadArray(values);
  }

  return [padding, padding, padding, padding];
}

function normalizePaddingObject(paddingOrigin: PaddingObject): Quad {
  if (
    Number.isFinite(paddingOrigin.bottom) ||
    Number.isFinite(paddingOrigin.left) ||
    Number.isFinite(paddingOrigin.right) ||
    Number.isFinite(paddingOrigin.top)
  ) {
    return [paddingOrigin.top ?? 0, paddingOrigin.right ?? 0, paddingOrigin.bottom ?? 0, paddingOrigin.left ?? 0];
  }
  return [0, 0, 0, 0];
}

export function getQuadProps(paddingOrigin: number | string | any[] | PaddingObject): Quad {
  if (Array.isArray(paddingOrigin)) {
    return normalizeQuadArray(paddingOrigin.slice(0, 4));
  }

  if (typeof paddingOrigin === 'number' && Number.isFinite(paddingOrigin)) {
    return [paddingOrigin, paddingOrigin, paddingOrigin, paddingOrigin];
  }

  if (typeof paddingOrigin === 'string') {
    return parseStringQuad(paddingOrigin);
  }

  if (paddingOrigin && typeof paddingOrigin === 'object') {
    return normalizePaddingObject(paddingOrigin);
  }

  return [0, 0, 0, 0];
}
