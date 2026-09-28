import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/articles";
import ArticleEditForm from "@/components/admin/ArticleEditForm";

type ArticleEditPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ArticleEditPage({ params }: ArticleEditPageProps) {
    const { id } = await params;
    const article = await getArticleById(Number(id));

    if (!article) {
        notFound();
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">記事編集</h1>
                <p className="text-sm text-gray-500">article id: {article.id}</p>
            </div>

            <ArticleEditForm article={article} />
        </div>
    );
}