import Link from "next/link";

type AdminLayoutProps = {
    children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-200 text-gray-900">
            <div className="border-b border-gray-500 bg-gray-800 px-6 py-3 text-white">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">
                        Portfolio CMS
                    </div>
                    <Link href="/" className="text-sm text-gray-300 hover:text-white">
                        サイトへ戻る
                    </Link>
                </div>
            </div>

            <div className="flex min-h-[calc(100vh-52px)]">
                <aside className="w-56 border-r border-gray-400 bg-gray-100">
                    <div className="border-b border-gray-400 bg-gray-300 px-4 py-2 font-bold">
                        管理メニュー
                    </div>

                    <nav className="p-3 text-sm">
                        <div className="mb-4">
                            <div className="mb-1 border-b border-gray-300 pb-1 font-bold text-gray-600">
                                Contents
                            </div>
                            <Link href="/admin/articles" className="block px-2 py-1 hover:bg-gray-300">
                                記事管理
                            </Link>
                            <Link href="/admin/dailies" className="block px-2 py-1 hover:bg-gray-300">
                                日記管理
                            </Link>
                            <Link href="/admin/works" className="block px-2 py-1 hover:bg-gray-300">
                                制作物管理
                            </Link>
                        </div>

                        <div className="mb-4">
                            <div className="mb-1 border-b border-gray-300 pb-1 font-bold text-gray-600">
                                System
                            </div>
                            <Link href="/admin/tags" className="block px-2 py-1 hover:bg-gray-300">
                                タグ管理
                            </Link>
                        </div>
                    </nav>
                </aside>

                <main className="flex-1 p-6">
                    <div className="mb-4 border border-gray-400 bg-white px-4 py-2">
                        <div className="text-sm text-gray-500">
                            Admin Console
                        </div>
                    </div>

                    <div className="border border-gray-400 bg-white p-6 shadow-sm">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}