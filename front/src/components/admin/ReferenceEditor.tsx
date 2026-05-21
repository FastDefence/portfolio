"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = "/api/backend";

type Reference = {
    id: number;
    article_id: number;
    title: string;
    url: string;
    created_at: string;
    updated_at: string;
};

type ReferenceEditorProps = {
    articleId: number;
};

export default function ReferenceEditor({ articleId }: ReferenceEditorProps) {
    const [references, setReferences] = useState<Reference[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchReferences();
    }, [articleId]);

    async function fetchReferences() {
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}/references`);

        if (!response.ok) {
            setMessage("リファレンスの取得に失敗しました");
            return;
        }

        const references: Reference[] = await response.json();
        setReferences(references);
    }

    function updateReferenceValue(referenceId: number, field: "title" | "url", value: string) {
        setReferences((currentReferences) =>
            currentReferences.map((reference) =>
                reference.id === referenceId
                    ? { ...reference, [field]: value }
                    : reference
            )
        );
    }

    async function createReference() {
        if (newTitle.trim() === "" || newUrl.trim() === "") {
            setMessage("titleとurlを入力してください");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/articles/${articleId}/references`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: newTitle,
                url: newUrl,
            }),
        });

        if (!response.ok) {
            setMessage("リファレンスの追加に失敗しました");
            return;
        }

        const reference: Reference = await response.json();
        setReferences((currentReferences) => [...currentReferences, reference]);
        setNewTitle("");
        setNewUrl("");
        setMessage("リファレンスを追加しました");
    }

    async function saveReference(reference: Reference) {
        const response = await fetch(`${API_BASE_URL}/references/${reference.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: reference.title,
                url: reference.url,
            }),
        });

        if (!response.ok) {
            setMessage("リファレンスの保存に失敗しました");
            return;
        }

        const updatedReference: Reference = await response.json();

        setReferences((currentReferences) =>
            currentReferences.map((currentReference) =>
                currentReference.id === updatedReference.id ? updatedReference : currentReference
            )
        );

        setMessage("リファレンスを保存しました");
    }

    async function deleteReference(referenceId: number) {
        const response = await fetch(`${API_BASE_URL}/references/${referenceId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            setMessage("リファレンスの削除に失敗しました");
            return;
        }

        setReferences((currentReferences) =>
            currentReferences.filter((reference) => reference.id !== referenceId)
        );

        setMessage("リファレンスを削除しました");
    }

    function preventEnterSubmit(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    }

    return (
        <div className="mb-8 border border-gray-400 bg-gray-50 p-4">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-xl font-bold">
                リファレンス編集
            </h2>

            <div className="mb-4 grid gap-3">
                {references.map((reference) => (
                    <div key={reference.id} className="border border-gray-300 bg-white p-3">
                        <div className="mb-2">
                            <label className="mb-1 block text-sm font-bold">title</label>
                            <input
                                value={reference.title}
                                onKeyDown={preventEnterSubmit}
                                onChange={(event) => updateReferenceValue(reference.id, "title", event.target.value)}
                                className="w-full border border-gray-400 px-3 py-2"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="mb-1 block text-sm font-bold">url</label>
                            <input
                                value={reference.url}
                                onKeyDown={preventEnterSubmit}
                                onChange={(event) => updateReferenceValue(reference.id, "url", event.target.value)}
                                className="w-full border border-gray-400 px-3 py-2"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => saveReference(reference)}
                                className="border border-gray-500 bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                            >
                                保存
                            </button>

                            <button
                                type="button"
                                onClick={() => deleteReference(reference.id)}
                                className="border border-red-500 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100"
                            >
                                削除
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border border-gray-300 bg-white p-3">
                <div className="mb-2 text-sm font-bold">新規追加</div>

                <div className="mb-2">
                    <input
                        value={newTitle}
                        onKeyDown={preventEnterSubmit}
                        onChange={(event) => setNewTitle(event.target.value)}
                        className="w-full border border-gray-400 px-3 py-2"
                        placeholder="title"
                    />
                </div>

                <div className="mb-2">
                    <input
                        value={newUrl}
                        onKeyDown={preventEnterSubmit}
                        onChange={(event) => setNewUrl(event.target.value)}
                        className="w-full border border-gray-400 px-3 py-2"
                        placeholder="url"
                    />
                </div>

                <button
                    type="button"
                    onClick={createReference}
                    className="border border-gray-500 bg-gray-100 px-4 py-2 hover:bg-gray-200"
                >
                    追加
                </button>

                {message && (
                    <span className="ml-3 text-sm text-gray-600">
                        {message}
                    </span>
                )}
            </div>
        </div>
    );
}