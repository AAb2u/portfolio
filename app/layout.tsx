import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "lenis/dist/lenis.css";
import "./globals.css";
import Cursor from "./components/Cursor";
import Loader from "./components/Loader";
import SmoothScroll from "./components/SmoothScroll";
import SoundLayer from "./components/SoundLayer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Digital Designer",
  description: "Web Design, UX/UI, Webflow, and Front End Development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preload" href="/gif/web-111.gif" as="image" type="image/gif" />
        <link rel="preload" href="/gif/software-111.gif" as="image" type="image/gif" />
        <link rel="preload" href="/gif/uiux-111.gif" as="image" type="image/gif" />
        <link rel="preload" href="/projects/EasySave.png" as="image" />
        <link rel="preload" href="/projects/portfolio.png" as="image" />
      </head>
      {/* clip, not hidden: a hidden body turns into a scroll container when <html>
          is scroll-locked (menu, contact form) and the sticky sections jump */}
      <body className="min-h-full flex flex-col bg-background text-foreground" style={{ overflowX: "clip" }}>
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function(){
            var t=localStorage.getItem('theme');
            var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
            if(t==='dark'||(t===null&&d))document.documentElement.classList.add('dark');
          })();
        `}</Script>
        <SmoothScroll />
        <Loader />
        <Cursor />
        <SoundLayer />
        {children}
      </body>
    </html>
  );
}
