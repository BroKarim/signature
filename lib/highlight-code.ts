import { codeToHtml } from "shiki";

export async function highlightCode(code: string, lang: string = "tsx") {
  const langMap: Record<string, string> = {
    tsx: "tsx",
    jsx: "jsx",
    html: "html",
    css: "css",
    astro: "astro",
    PAGE: "tsx",
    SECTION: "tsx",
    UI_ELEMENT: "tsx",
  };

  const validLang = langMap[lang] || "tsx";

  const html = await codeToHtml(code, {
    lang: validLang,
    theme: "ayu-dark",
    transformers: [
      {
        pre(node) {
          delete node.properties.style;
          node.properties.class =
            "!m-0 !p-0 !bg-transparent min-w-full overflow-x-auto";
        },
        code(node) {
          node.properties.class = "block p-4 text-sm leading-relaxed text-[#F7F5F3]";
        },
        line(node) {
          node.properties.class = "px-1";
        },
      },
    ],
  });

  return html;
}
