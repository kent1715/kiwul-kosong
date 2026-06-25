import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple Storyboard Studio",
  description:
    "A lighter storyboard studio: VO + Image upload + Video generate (WAN 2.2 i2v).",
  keywords: [
    "storyboard",
    "video generation",
    "WAN 2.2",
    "Next.js",
    "shadcn/ui",
  ],
  authors: [{ name: "Simple Storyboard Studio" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Sonner richColors closeButton position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
