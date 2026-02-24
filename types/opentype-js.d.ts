declare module "opentype.js" {
  export type BoundingBox = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };

  export type Path = {
    toPathData(precision?: number): string;
    getBoundingBox(): BoundingBox;
  };

  export type Glyph = {
    advanceWidth?: number;
    getPath(x: number, y: number, fontSize: number): Path;
  };

  export type Font = {
    unitsPerEm: number;
    stringToGlyphs(text: string): Glyph[];
    getPath(
      text: string,
      x: number,
      y: number,
      fontSize: number,
      options?: { letterSpacing?: number }
    ): Path;
    getAdvanceWidth(text: string, fontSize: number, options?: { letterSpacing?: number }): number;
  };

  export function parse(buffer: ArrayBuffer): Font;
}
