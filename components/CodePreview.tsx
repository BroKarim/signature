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
      if (active) setHtml(rendered);
    })();

    return () => {
      active = false;
    };
  }, [code, placeholder]);

  const base = ["mt-3 min-h-0 rounded-xl p-4 text-[12px] leading-5", "overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden", className].filter(Boolean).join(" ");

  if (!html) {
    return (
      <pre className={`${base} text-[#F7F5F3]`}>
        <code>{code || placeholder}</code>
      </pre>
    );
  }

  return (
    <div className={["mt-3 min-h-0 rounded-xl border", "overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden", className].filter(Boolean).join(" ")}>
      <div className="[&>pre]:overflow-auto [&>pre]:[scrollbar-width:none] [&>pre]:[-ms-overflow-style:none] [&>pre]:[&::-webkit-scrollbar]:hidden" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
