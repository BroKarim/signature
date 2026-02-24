import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Signature",
  description: "Draw or type a signature, preview the animation, and export a motion-ready React component.",
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
