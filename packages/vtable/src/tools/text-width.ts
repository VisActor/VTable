const cachedWidths: Map<string, number> = new Map();
export function getWidth(ctx: CanvasRenderingContext2D, content: string): number {
  //缓存文本宽度到列表
  const cachedWidth = cachedWidths.get(`$${content}$${ctx.font}`);
  if (cachedWidth !== undefined && cachedWidth !== null) {
    return cachedWidth;
  }
  const width = ctx.measureText(content).width;
  cachedWidths.set(`$${content}$${ctx.font}`, width);
  return width;
}
