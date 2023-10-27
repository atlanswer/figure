import { Viewport } from "next";
import "./globals.css";

export const runtime = "edge";

export const metadata = {
  title: "Figure",
  description: "Create publication quality figures.",
};

export const viewport: Viewport = {
  colorScheme: "normal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
