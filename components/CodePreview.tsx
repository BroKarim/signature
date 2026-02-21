"use client";

import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

const getHighlighter = () => {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["ayu-dark"],
      langs: ["tsx"],
    });
  }
  return highlighterPromise;
};

type CodePreviewProps = {
  code: string;
  placeholder?: string;
  className?: string;
};

export default function CodePreview({ code, placeholder, className }: CodePreviewProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let active = true;
    const content = code || placeholder || "";

    (async () => {
      const highlighter = await getHighlighter();
      const rendered = highlighter.codeToHtml(content, {
        lang: "tsx",
        theme: "ayu-dark",
      });
      const normalized = rendered
        .replace('<pre class="shiki"', '<pre class="shiki min-w-full"')
        .replace('style="', 'style="margin:0;background-color:transparent;');
      if (active) {
        setHtml(normalized);
      }
    })();

    return () => {
      active = false;
    };
  }, [code, placeholder]);

  if (!html) {
    return (
      <pre
        className={[
          "mt-3 max-h-[320px] overflow-auto rounded-xl border  p-4 text-[12px] leading-5 text-[#F7F5F3]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <code>{code || placeholder}</code>
      </pre>
    );
  }

  return (
    <div
      className={[
        "mt-3  overflow-auto rounded-xl border p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="text-[12px] leading-5" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
