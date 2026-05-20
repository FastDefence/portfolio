import Link from "next/link";
import { getArticles } from "./data";

export default async function Articles(){
    const articles = await getArticles();

    return (
        <div>
            <div className="text-3xl font-bold">
                記事一覧
            </div>
            
            <div className="mt-6">
                {articles.map((article) => (
                    <div key="{article.id}">
                        <div className="border-t border-gray-400"></div>
                        <div className="flex mt-2">
                            <Link href={`/articles/${article.id}`}>
                                <h2 className="text-xl font-bold hover:text-amber-400 mr-2">
                                {article.title}
                                </h2>
                            </Link>
                            {article.tags.map((tag) => (
                                <div key="{tag.id}" className="rounded-full border border-gray-400 px-2">{tag}</div>
                            ))}
                        </div>
                        <p className="text-gray-400 mb-2">作成日:{article.published}</p>
                        <p className="text-gray-400 mb-2">更新日:{article.updated}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}