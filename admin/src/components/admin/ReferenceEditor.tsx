"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = "/api/backend";

type Reference = {
    id: number;
    article_id: number;
    title: string;
    url: string;
};

type ReferenceEditorProps = {
    articleId: number;
};

export default function ReferenceEditor({ articleId }: ReferenceEditorProps) {
    const [references, setReferences] = useState<Reference[]>([]);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchReferences();
    }, [articleId]);

    async function fetchReferences() {
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}/references`);

        if (!response.ok) {
            setMessage("参考リンク取得に失敗しました");
            return;
        }

        const data: Reference[] = await response.json();
        setReferences(data);
    }

    async function addReference() {
        if (title.trim() === "" || url.trim() === "") {
            setMessage("titleとurlを入力してください");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/articles/${articleId}/references`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, url }),
        });

        if (!response.ok) {
            setMessage("参考リンク追加に失敗しました");
            return;
        }

        setTitle("");
        setUrl("");
        setMessage("参考リンクを追加しました");
        fetchReferences();
    }

    async function deleteReference(id: number) {
        const response = await fetch(`${API_BASE_URL}/references/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            setMessage("参考リンク削除に失敗しました");
            return;
        }

        setMessage("参考リンクを削除しました");
        fetchReferences();
    }

    return (
        <div className="mb-8 border border-gray-400 bg-gray-50 p-4">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-xl font-bold">
                参考リンク編集
            </h2>

            <div className="mb-4 border border-gray-300 bg-white p-3">
                <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mb-2 w-full border border-gray-400 px-3 py-2"
                    placeholder="title"
                />
                <input
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    className="mb-2 w-full border border-gray-400 px-3 py-2"
                    placeholder="url"
                />
                <button
                    type="button"
                    onClick={addReference}
                    className="border border-gray-500 bg-gray-100 px-4 py-2 hover:bg-gray-200"
                >
                    追加
                </button>
                {message && <span className="ml-3 text-sm text-gray-600">{message}</span>}
            </div>

            <div className="grid gap-3">
                {references.map((reference) => (
                    <div key={reference.id} className="border border-gray-300 bg-white p-3">
                        <div className="font-bold">{reference.title}</div>
                        <div className="break-all text-sm text-gray-600">{reference.url}</div>
                        <button
                            type="button"
                            onClick={() => deleteReference(reference.id)}
                            className="mt-2 border border-red-500 bg-red-50 px-3 py-1 text-sm text-red-700"
                        >
                            削除
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}