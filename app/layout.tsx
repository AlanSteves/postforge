import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { PostProvider } from "@/context/post-context";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "PostForge AI - Neubrutalist LinkedIn Content Generator",
  description: "AI-powered LinkedIn post generator for creators and business leaders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${spaceGrotesk.className} bg-[#FAF9F5] text-[#1b1c1a] min-h-screen flex flex-col antialiased`}>
        <PostProvider>
          {children}
        </PostProvider>
      </body>
    </html>
  );
}
