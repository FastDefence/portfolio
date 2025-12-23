import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "みとめんのポートフォリオ",
  description: "mitomen.netへようこそ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <header className="p-6 border-b flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">mitomen.net</Link>
          <nav className="space-x-4">
            <Link href="/about" className="hover:text-blue-600">About</Link>
            <Link href="/hobbies" className="hover:text-blue-600">Hobbies</Link>
            <Link href="/works" className="hover:text-blue-600">Works</Link>
          </nav>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="p-6 border-t text-center text-gray-500">
          © 2025 mitomen.net
        </footer>
      </body>
    </html>
  );
}
