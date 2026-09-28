import ArticleNewForm from "@/components/admin/ArticleNewForm";

export default function ArticleNewPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">記事新規作成</h1>
            </div>

            <ArticleNewForm />
        </div>
    );
}