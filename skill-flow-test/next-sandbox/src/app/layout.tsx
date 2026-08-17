import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "InfoManager 5",
  description: "Prototipo operativo de gestion comercial InfoManager 5.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeScript = `
(function() {
  try {
    var key = "infomanager-theme";
    var preference = localStorage.getItem(key) || "system";
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var resolved = preference === "dark" || (preference === "system" && systemDark);
    document.documentElement.classList.toggle("dark", resolved);
    document.documentElement.dataset.theme = preference;
  } catch (error) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="flex h-dvh min-h-dvh flex-col overflow-hidden bg-background">
        <Script
          id="infomanager-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
