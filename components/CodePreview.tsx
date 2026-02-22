"use client";

import { useEffect, useState } from "react";
import { highlightCode } from "@/lib/highlight-code";

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
      if (!content) {
        if (active) setHtml("");
        return;
      }
      const rendered = await highlightCode(content, "tsx");
      if (active) {
        setHtml(rendered);
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
          "mt-3 min-h-0 overflow-auto rounded-xl  p-4 text-[12px] leading-5 text-[#F7F5F3]",
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
        "mt-3 min-h-0 no-scrollbar overflow-hidden rounded-xl border  ",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="h-full overflow-auto [&>pre]:h-full [&>pre]:overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
