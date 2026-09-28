import Link from "next/link";
import { Search } from "lucide-react";
import { getArticles } from "./data";

type ArticlesPageProps = {
    searchParams: Promise<{
        keyword?: string;
    }>;
};

export default async function Articles({ searchParams }: ArticlesPageProps){
    const { keyword = "" } = await searchParams;
    const articles = await getArticles(keyword);

    return (
        <div>
            <div className="text-3xl font-bold mb-4">
                記事一覧
            </div>
            
            <form action="/articles" method="get" className="mb-6 flex w-full max-w-md items-center rounded-full border border-gray-400 px-4 py-2">
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
                        <div className="flex mt-2 gap-2">
                            <Link href={`/articles/${article.id}`}>
                                <h2 className="text-xl font-bold hover:text-amber-400 mr-2">
                                {article.title}
                                </h2>
                            </Link>
                            {article.tags.map((tag) => (
                                <div key={tag} className="rounded-full border border-gray-400 px-2">{tag}</div>
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