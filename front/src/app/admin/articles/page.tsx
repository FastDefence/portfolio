import Link from "next/link";
import { Search } from "lucide-react";
import { getArticles } from "./../../articles/data";

type ArticlesPageProps = {
    searchParams: Promise<{
        keyword?: string;
    }>;
};

export default async function AdminArticlesPage({ searchParams }: ArticlesPageProps) {
    const { keyword = "" } = await searchParams;
    const articles = await getArticles(keyword);

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <div className="text-2xl font-bold">
                    記事管理
                </div>

                <Link href="/admin/articles/new" className="border border-gray-500 bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200">
                    新規作成
                </Link>
            </div>

            <form action="/admin/articles" method="get" className="mb-6 flex w-full max-w-md items-center rounded-full border border-gray-400 px-4 py-2">
                <Search className="mr-2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    name="keyword"
                    defaultValue={keyword}
                    placeholder="記事を検索"
                    className="w-full bg-transparent outline-none placeholder:text-gray-500"
                />
            </form>

            <div className="mt-6">
                {articles.map((article) => (
                    <div key={article.id}>
                        <div className="border-t border-gray-400" />
                        <div className="mt-2 flex gap-2">
                            <Link href={`/admin/articles/${article.id}`}>
                                <h2 className="mr-2 text-xl font-bold hover:text-amber-500">
                                    {article.title}
                                </h2>
                            </Link>
                            {article.tags.map((tag) => (
                                <div key={tag} className="rounded-full border border-gray-400 px-2">
                                    {tag}
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-400">作成日:{article.created}</p>
                        <p className="text-gray-400">更新日:{article.updated}</p>
                        <div className="border-t border-gray-400" />
                    </div>
                ))}
            </div>
        </div>
    );
}