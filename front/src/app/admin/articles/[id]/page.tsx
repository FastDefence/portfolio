import { notFound } from "next/navigation";
import { getArticleById } from "@/app/articles/data";
import ArticleEditForm from "@/components/admin/ArticleEditForm";

type AdminArticleEditPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function AdminArticleEditPage({ params }: AdminArticleEditPageProps) {
    const { id } = await params;
    const article = await getArticleById(Number(id));

    if (!article) {
        notFound();
    }

    return (
        <div>
            <h1 className="mb-6 border-b border-gray-300 pb-2 text-2xl font-bold">
                記事編集
            </h1>

            <ArticleEditForm key={article.id} article={article} />

        </div>
    );
}