# Hand Drawn Signature

Hand Drawn Signature is a calm, high‑end signature studio for the web. Draw with a pen‑like canvas or type your name with a signature font, then export a motion‑ready React component.

## Animation Concept

Built with `@motiondotdev`:
- SVG paths rendered with sequential timing + custom easing
- Each stroke animated via `pathLength` (0 → 1)
- Optional ink‑indent base layer for the fill/reveal style
- Text mode uses filled glyphs with a mask‑reveal animation

The export logic lives in `lib/signature/export.ts` and generates clean, drop‑in components.

## Features

- Canvas drawing + Type‑to‑Signature (font) input
- Two animation styles: `Draw` (stroke reveal) and `Fill` (ink‑indent + reveal)
- Live preview + replay
- Export to React `tsx` component
- Copy code with one click

## Ongoing

- [ ] Signature template gallery
- [ ] Public signature showcase
- [ ] Export to MP4 / PNG / SVG
- [ ] Font presets and sizing controls
- [ ] Multi‑line / stacked signatures
- [ ] Custom easing & timing presets

## Development

```bash
pnpm dev
```

Open `http://localhost:3000`.

## License

MIT

---

Made with ❤️ by [BroKarim](https://github.com/BroKarim) & [codex](https://github.com/openai/codex)
