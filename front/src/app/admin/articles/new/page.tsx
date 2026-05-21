import ArticleNewForm from "@/components/admin/ArticleNewForm";

export default function AdminArticleNewPage() {
    return (
        <div>
            <h1 className="mb-6 border-b border-gray-300 pb-2 text-2xl font-bold">
                記事新規作成
            </h1>

            <ArticleNewForm />
        </div>
    );
}