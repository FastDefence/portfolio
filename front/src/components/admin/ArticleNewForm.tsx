"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ArticleDraftEditor from "@/components/admin/ArticleDraftEditor";
import TagSelector, { type Tag } from "@/components/admin/TagSelector";
import ReferenceDraftEditor, { type DraftReference } from "@/components/admin/ReferenceDraftEditor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type CreatedArticle = {
    id: number;
    title: string;
    text: string;
    created_at: string;
    updated_at: string;
};

export default function ArticleNewForm() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [references, setReferences] = useState<DraftReference[]>([]);
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

        const articleResponse = await fetch(`${API_BASE_URL}/articles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                text,
            }),
        });

        if (!articleResponse.ok) {
            setIsSaving(false);
            setMessage("記事の作成に失敗しました");
            return;
        }

        const createdArticle: CreatedArticle = await articleResponse.json();

        const tagResponse = await fetch(`${API_BASE_URL}/articles/${createdArticle.id}/tags`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tag_ids: selectedTags.map((tag) => tag.id),
            }),
        });

        if (!tagResponse.ok) {
            setIsSaving(false);
            router.push(`/admin/articles/${createdArticle.id}`);
            return;
        }

        for (const reference of references) {
            if (reference.title.trim() === "" || reference.url.trim() === "") {
                continue;
            }

            const referenceResponse = await fetch(`${API_BASE_URL}/articles/${createdArticle.id}/references`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: reference.title,
                    url: reference.url,
                }),
            });

            if (!referenceResponse.ok) {
                setIsSaving(false);
                router.push(`/admin/articles/${createdArticle.id}`);
                return;
            }
        }

        setIsSaving(false);
        router.push(`/admin/articles/${createdArticle.id}`);
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit}>
            <TagSelector
                showSaveButton={false}
                onChange={setSelectedTags}
            />

            <ReferenceDraftEditor onChange={setReferences} />

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
                    {isSaving ? "作成中" : "記事を作成"}
                </button>

                {message && (
                    <span className="ml-3 text-sm text-gray-600">
                        {message}
                    </span>
                )}
            </div>
        </form>
    );
}