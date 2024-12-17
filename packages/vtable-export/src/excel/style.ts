import type ExcelJS from 'exceljs';
import { colorStringToRGB, rgbaToHex } from '../util/color';
import type { CellStyle, CellType, LineDashsDef } from '../util/type';

export function getCellFont(cellStyle: CellStyle, cellType: CellType): Partial<ExcelJS.Font> {
  return {
    name: getFirstFontFromFontFamily(cellStyle.fontFamily as string) || 'Arial', // only one font family name
    size: cellStyle.fontSize || 10,
    // bold: cellStyle.fontWeight === 'bold', // only bold or not
    bold: isFontBold(cellStyle.fontWeight), // only bold or not
    italic: cellStyle.fontStyle === 'italic', // only italic or not
    color: getColor(cellType === 'link' ? (cellStyle._linkColor as string) : (cellStyle.color as string)),
    underline: cellStyle.underline
  };
}

function isFontBold(fontWeight: string | number) {
  if (typeof fontWeight === 'number') {
    return fontWeight >= 600;
  }
  if (Number(fontWeight) >= 600) {
    return true;
  }
  return fontWeight === 'bold';
}

function getFirstFontFromFontFamily(fontFamily: string) {
  const fonts = fontFamily.split(',').map(font => font.trim());
  return fonts[0];
}

export function getCellFill(cellStyle: CellStyle): ExcelJS.Fill {
  return {
    type: 'pattern',
    pattern: 'solid',
    fgColor: getColor(cellStyle.bgColor as string)
  };
}

export function getCellBorder(cellStyle: CellStyle): Partial<ExcelJS.Borders> {
  const { borderColor, borderLineWidth, borderLineDash, _strokeArrayWidth, _strokeArrayColor } = cellStyle;
  if (_strokeArrayColor || _strokeArrayWidth) {
    const border: Partial<ExcelJS.Borders> = {};
    if (!((_strokeArrayColor && !_strokeArrayColor[0]) || (_strokeArrayWidth && !_strokeArrayWidth[0]))) {
      border.top = {
        style: getBorderStyle((_strokeArrayWidth?.[0] as number) ?? (borderLineWidth as number), borderLineDash),
        color: getColor((_strokeArrayColor?.[0] as string) ?? (borderColor as string))
      };
    }
    if (!((_strokeArrayColor && !_strokeArrayColor[1]) || (_strokeArrayWidth && !_strokeArrayWidth[1]))) {
      border.right = {
        style: getBorderStyle((_strokeArrayWidth?.[1] as number) ?? (borderLineWidth as number), borderLineDash),
        color: getColor((_strokeArrayColor?.[1] as string) ?? (borderColor as string))
      };
    }
    if (!((_strokeArrayColor && !_strokeArrayColor[2]) || (_strokeArrayWidth && !_strokeArrayWidth[2]))) {
      border.bottom = {
        style: getBorderStyle((_strokeArrayWidth?.[2] as number) ?? (borderLineWidth as number), borderLineDash),
        color: getColor((_strokeArrayColor?.[2] as string) ?? (borderColor as string))
      };
    }
    if (!((_strokeArrayColor && !_strokeArrayColor[3]) || (_strokeArrayWidth && !_strokeArrayWidth[3]))) {
      border.left = {
        style: getBorderStyle((_strokeArrayWidth?.[3] as number) ?? (borderLineWidth as number), borderLineDash),
        color: getColor((_strokeArrayColor?.[3] as string) ?? (borderColor as string))
      };
    }
    return border;
  }

  if (borderLineWidth === 0) {
    return {};
  }
  const border = {
    style: getBorderStyle(borderLineWidth as number, borderLineDash),
    color: getColor(borderColor as string)
  };
  return {
    top: border,
    left: border,
    bottom: border,
    right: border
  };
}

function getBorderStyle(lineWidth: number, borderLineDash: LineDashsDef): ExcelJS.BorderStyle {
  // hair：0.5
  // thin：1
  // medium：2.0
  // thick：3.0
  if (borderLineDash && borderLineDash.length) {
    if (lineWidth <= 2) {
      return 'dashed';
    }
    return 'mediumDashed';
  }
  if (lineWidth <= 0.5) {
    return 'hair';
  } else if (lineWidth <= 1) {
    return 'thin';
  } else if (lineWidth <= 2) {
    return 'medium';
  }
  return 'thick';
}

export function getCellAlignment(cellStyle: CellStyle, indent: number): Partial<ExcelJS.Alignment> {
  return {
    horizontal: cellStyle.textAlign || 'left',
    vertical: cellStyle.textBaseline || 'middle',
    wrapText: cellStyle.autoWrapText || false,
    indent: indent || 0
  } as any;
}

function getColor(color: string) {
  // to do: support gradient color
  return {
    argb: rgbaToHex(colorStringToRGB(color))
  };
}
