import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Cursor from "./components/Cursor";
import Loader from "./components/Loader";

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
        <link rel="preload" href="/gif/web-dark.gif" as="image" type="image/gif" />
        <link rel="preload" href="/gif/software-dark.gif" as="image" type="image/gif" />
        <link rel="preload" href="/gif/uiux-dark.gif" as="image" type="image/gif" />
        <link rel="preload" href="/projects/EasySave.png" as="image" />
        <link rel="preload" href="/projects/portfolio.png" as="image" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function(){
            var t=localStorage.getItem('theme');
            var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
            if(t==='dark'||(t===null&&d))document.documentElement.classList.add('dark');
          })();
        `}</Script>
        <Loader />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
