import type { Font, Glyph, Path, BoundingBox } from "opentype.js";
import * as opentype from "opentype.js";

const FONT_FILES: Record<string, string> = {
  BrittanySignature: "/fonts/BrittanySignature.ttf",
  AmsterdamSignature: "/fonts/Amsterdam Signature.ttf",
};

const fontCache = new Map<string, Promise<Font>>();

export async function loadSignatureFont(fontName: string): Promise<Font> {
  const file = FONT_FILES[fontName];
  if (!file) {
    throw new Error(`Unknown font "${fontName}".`);
  }

  const cached = fontCache.get(file);
  if (cached) return cached;

  const loader = (async () => {
    if (typeof window === "undefined") {
      throw new Error("loadSignatureFont() must be called in the browser.");
    }
    const res = await fetch(file);
    if (!res.ok) {
      throw new Error(`Failed to load font "${fontName}" from ${file}.`);
    }
    const buffer = await res.arrayBuffer();
    return opentype.parse(buffer);
  })();

  fontCache.set(file, loader);
  return loader;
}

type ConvertOptions = {
  fontSize?: number;
  letterSpacing?: number;
  split?: "glyph" | "word" | "line";
};

function glyphPathToData(path: Path) {
  return path.toPathData(2);
}

function splitWords(text: string) {
  return text.split(/\s+/).filter(Boolean);
}

function mergeBounds(bounds: BoundingBox | null, next: BoundingBox | null) {
  if (!next) return bounds;
  if (!bounds) return { ...next };
  return {
    x1: Math.min(bounds.x1, next.x1),
    y1: Math.min(bounds.y1, next.y1),
    x2: Math.max(bounds.x2, next.x2),
    y2: Math.max(bounds.y2, next.y2),
  };
}

function toViewBox(bounds: BoundingBox | null) {
  if (!bounds) return "0 0 300 120";
  const width = Math.max(bounds.x2 - bounds.x1, 1);
  const height = Math.max(bounds.y2 - bounds.y1, 1);
  return `${bounds.x1.toFixed(2)} ${bounds.y1.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)}`;
}

export async function convertTextToPaths(
  text: string,
  fontName: string,
  options: ConvertOptions = {}
): Promise<string[]> {
  const font = await loadSignatureFont(fontName);
  const fontSize = options.fontSize ?? 128;
  const letterSpacing = options.letterSpacing ?? 0;
  const split = options.split ?? "glyph";

  if (!text.trim()) return [];

  if (split === "word") {
    let cursorX = 0;
    return splitWords(text).map((word) => {
      const path = font.getPath(word, cursorX, 0, fontSize, {
        letterSpacing,
      });
      cursorX += font.getAdvanceWidth(word, fontSize, { letterSpacing });
      return glyphPathToData(path);
    });
  }

  if (split === "line") {
    const path = font.getPath(text, 0, 0, fontSize, { letterSpacing });
    return [glyphPathToData(path)];
  }

  const glyphs: Glyph[] = font.stringToGlyphs(text);
  let x = 0;
  return glyphs
    .map((glyph) => {
      const path = glyph.getPath(x, 0, fontSize);
      x += glyph.advanceWidth ? (glyph.advanceWidth * fontSize) / font.unitsPerEm + letterSpacing : 0;
      return glyphPathToData(path);
    })
    .filter((d) => d.length > 0);
}

export async function convertTextToSignature(
  text: string,
  fontName: string,
  options: ConvertOptions = {}
): Promise<{ paths: string[]; viewBox: string }> {
  const font = await loadSignatureFont(fontName);
  const fontSize = options.fontSize ?? 128;
  const letterSpacing = options.letterSpacing ?? 0;
  const split = options.split ?? "glyph";

  if (!text.trim()) {
    return { paths: [], viewBox: "0 0 300 120" };
  }

  let bounds: BoundingBox | null = null;

  if (split === "word") {
    let cursorX = 0;
    const words = splitWords(text);
    const paths = words.map((word) => {
      const path = font.getPath(word, cursorX, 0, fontSize, {
        letterSpacing,
      });
      const box = path.getBoundingBox();
      bounds = mergeBounds(bounds, box);
      cursorX += font.getAdvanceWidth(word, fontSize, { letterSpacing });
      return glyphPathToData(path);
    });
    return { paths, viewBox: toViewBox(bounds) };
  }

  if (split === "line") {
    const path = font.getPath(text, 0, 0, fontSize, { letterSpacing });
    bounds = mergeBounds(bounds, path.getBoundingBox());
    return { paths: [glyphPathToData(path)], viewBox: toViewBox(bounds) };
  }

  const glyphs: Glyph[] = font.stringToGlyphs(text);
  let x = 0;
  const paths = glyphs
    .map((glyph) => {
      const path = glyph.getPath(x, 0, fontSize);
      const box = path.getBoundingBox();
      bounds = mergeBounds(bounds, box);
      x += glyph.advanceWidth ? (glyph.advanceWidth * fontSize) / font.unitsPerEm + letterSpacing : 0;
      return glyphPathToData(path);
    })
    .filter((d) => d.length > 0);

  return { paths, viewBox: toViewBox(bounds) };
}
