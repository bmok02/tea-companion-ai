import type { Metadata } from "next";
import "./globals.css";

// Same Google Fonts CDN request the original static page used — kept as a
// direct <link> (rather than next/font) so the CJK glyphs for Noto Serif SC
// are served in full rather than trimmed to a latin subset.
const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Noto+Serif+SC:wght@300;400&family=IM+Fell+English:ital@0;1&display=swap";

export const metadata: Metadata = {
  title: "茶渊 · Tea Companion",
  description:
    "A warm, mindful brewing companion for Tea Chapter's teas — brewing guidance, heritage, and a guided steep timer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={GOOGLE_FONTS_HREF} rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
