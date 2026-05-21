"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type Tag = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
};

type TagSelectorProps = {
    articleId?: number;
    showSaveButton?: boolean;
    onChange?: (tags: Tag[]) => void;
};

export default function TagSelector({
    articleId,
    showSaveButton,
    onChange,
}: TagSelectorProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [candidateTags, setCandidateTags] = useState<Tag[]>([]);
    const [keyword, setKeyword] = useState("");
    const [message, setMessage] = useState("");

    const shouldShowSaveButton = showSaveButton ?? articleId !== undefined;

    useEffect(() => {
        if (articleId !== undefined) {
            fetchArticleTags();
        }

        fetchTags("");
    }, [articleId]);

    useEffect(() => {
        onChange?.(selectedTags);
    }, [selectedTags, onChange]);

    async function fetchArticleTags() {
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}/tags`);

        if (!response.ok) {
            setMessage("記事タグの取得に失敗しました");
            return;
        }

        const tags: Tag[] = await response.json();
        setSelectedTags(tags);
    }

    async function fetchTags(name: string) {
        const query = name ? `?name=${encodeURIComponent(name)}` : "";
        const response = await fetch(`${API_BASE_URL}/tags${query}`);

        if (!response.ok) {
            setMessage("タグ候補の取得に失敗しました");
            return;
        }

        const tags: Tag[] = await response.json();
        setCandidateTags(tags);
    }

    function addTag(tag: Tag) {
        setSelectedTags((currentTags) => {
            const exists = currentTags.some((currentTag) => currentTag.id === tag.id);

            if (exists) {
                return currentTags;
            }

            return [...currentTags, tag];
        });
    }

    function removeTag(tagId: number) {
        setSelectedTags((currentTags) =>
            currentTags.filter((tag) => tag.id !== tagId)
        );
    }

    async function saveTags() {
        if (articleId === undefined) {
            return;
        }

        const response = await fetch(`${API_BASE_URL}/articles/${articleId}/tags`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tag_ids: selectedTags.map((tag) => tag.id),
            }),
        });

        if (!response.ok) {
            setMessage("タグの保存に失敗しました");
            return;
        }

        const tags: Tag[] = await response.json();
        setSelectedTags(tags);
        setMessage("タグを保存しました");
    }

    function preventEnterSubmit(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
            fetchTags(keyword);
        }
    }

    return (
        <div className="mb-8 border border-gray-400 bg-gray-50 p-4">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-xl font-bold">
                タグ編集
            </h2>

            <div className="mb-4">
                <div className="mb-1 text-sm font-bold">現在のタグ</div>
                <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => removeTag(tag.id)}
                            className="rounded-full border border-gray-400 bg-white px-3 py-1 text-sm hover:bg-gray-200"
                        >
                            {tag.name} ×
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4 flex gap-2">
                <input
                    value={keyword}
                    onKeyDown={preventEnterSubmit}
                    onChange={(event) => setKeyword(event.target.value)}
                    className="w-full border border-gray-400 px-3 py-2"
                    placeholder="タグ検索"
                />
                <button
                    type="button"
                    onClick={() => fetchTags(keyword)}
                    className="border border-gray-500 bg-gray-100 px-4 py-2 hover:bg-gray-200"
                >
                    検索
                </button>
            </div>

            <div className="mb-4">
                <div className="mb-1 text-sm font-bold">タグ候補</div>
                <div className="flex flex-wrap gap-2">
                    {candidateTags.map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => addTag(tag)}
                            className="rounded-full border border-gray-400 bg-white px-3 py-1 text-sm hover:bg-gray-200"
                        >
                            {tag.name} +
                        </button>
                    ))}
                </div>
            </div>

            {shouldShowSaveButton && (
                <button
                    type="button"
                    onClick={saveTags}
                    className="border border-gray-500 bg-gray-100 px-4 py-2 hover:bg-gray-200"
                >
                    タグを保存
                </button>
            )}

            {message && (
                <span className="ml-3 text-sm text-gray-600">
                    {message}
                </span>
            )}
        </div>
    );
}