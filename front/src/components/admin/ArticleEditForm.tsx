"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/app/articles/data";
import ArticleDraftEditor from "@/components/admin/ArticleDraftEditor";
import TagSelector from "@/components/admin/TagSelector";
import ReferenceEditor from "@/components/admin/ReferenceEditor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type ArticleEditFormProps = {
    article: Article;
};

export default function ArticleEditForm({ article }: ArticleEditFormProps) {
    const router = useRouter();

    const [title, setTitle] = useState(article.title);
    const [text, setText] = useState(article.text);
    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (title.trim() === "" || text.trim() === "") {
            setMessage("タイトルと本文を入力してください");
            return;
        }

        setIsSaving(true);
        setMessage("");

        const response = await fetch(`${API_BASE_URL}/articles/${article.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                text,
            }),
        });

        setIsSaving(false);

        if (!response.ok) {
            const responseText = await response.text();
            setMessage(`保存に失敗しました status=${response.status} body=${responseText}`);
            return;
        }

        setMessage("保存しました");
        router.refresh();
    }

    async function handleDelete() {
        const confirmed = window.confirm("この記事を削除しますか？");

        if (!confirmed) {
            return;
        }

        const response = await fetch(`${API_BASE_URL}/articles/${article.id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const responseText = await response.text();
            setMessage(`削除に失敗しました status=${response.status} body=${responseText}`);
            return;
        }

        router.push("/admin/articles");
        router.refresh();
    }

    return (
        <div>
            <TagSelector articleId={article.id} />

            <ReferenceEditor articleId={article.id} />

            <form onSubmit={handleSubmit}>
                <ArticleDraftEditor
                    title={title}
                    text={text}
                    onTitleChange={setTitle}
                    onTextChange={setText}
                />

                <div className="my-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="border border-gray-500 bg-gray-100 px-4 py-2 hover:bg-gray-200 disabled:opacity-50"
                    >
                        {isSaving ? "保存中" : "記事本文を保存"}
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="ml-2 border border-red-500 bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100"
                    >
                        記事削除
                    </button>

                    {message && (
                        <span className="ml-3 text-sm text-gray-600">
                            {message}
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}