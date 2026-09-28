import "./globals.css";
import Link from "next/link";
import { Chewy } from "next/font/google";

const chewy = Chewy({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="flex min-h-screen flex-col">
        <header className="border-b bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold hover:text-amber-400">
              mito.men
            </Link>

            <nav>
              <ul className="flex gap-6">
                <li>
                  <Link href="/about" className="transition hover:text-amber-400">
                    自己紹介
                  </Link>
                </li>
                <li>
                  <Link href="/works" className="transition hover:text-amber-400">
                    制作物
                  </Link>
                </li>
                <li>
                  <Link href="/articles" className="transition hover:text-amber-400">
                    記事
                  </Link>
                </li>
                <li>
                  <Link href="/sns" className="transition hover:text-amber-400">
                    SNS
                  </Link>
                </li>
                <li>
                  <Link href="/dailys" className={`${chewy.className} text-xl tracking-wide transition hover:text-amber-400`}
                  >
                    Mitomen's Dairy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="flex-1 max-w-5xl px-6 py-4">
          {children}
        </div>
      </body>
    </html>
  )
}