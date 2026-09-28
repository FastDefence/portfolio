"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = "/api/backend";

export type Tag = {
    id: number;
    name: string;
};

type TagSelectorProps = {
    articleId?: number;
    showSaveButton?: boolean;
    onChange?: (tags: Tag[]) => void;
};

export default function TagSelector({
    articleId,
    showSaveButton = true,
    onChange,
}: TagSelectorProps) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        if (articleId) {
            fetchArticleTags(articleId);
        }
    }, [articleId]);

    useEffect(() => {
        onChange?.(selectedTags);
    }, [selectedTags, onChange]);

    async function fetchTags() {
        const response = await fetch(`${API_BASE_URL}/tags`);
        if (!response.ok) {
            setMessage("タグ一覧の取得に失敗しました");
            return;
        }

        const data: Tag[] = await response.json();
        setTags(data);
    }

    async function fetchArticleTags(id: number) {
        const response = await fetch(`${API_BASE_URL}/articles/${id}/tags`);
        if (!response.ok) {
            setMessage("記事タグの取得に失敗しました");
            return;
        }

        const data: Tag[] = await response.json();
        setSelectedTags(data);
    }

    function toggleTag(tag: Tag) {
        setSelectedTags((currentTags) => {
            const exists = currentTags.some((currentTag) => currentTag.id === tag.id);

            if (exists) {
                return currentTags.filter((currentTag) => currentTag.id !== tag.id);
            }

            return [...currentTags, tag];
        });
    }

    async function saveTags() {
        if (!articleId) {
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

        setMessage("タグを保存しました");
    }

    return (
        <div className="mb-8 border border-gray-400 bg-gray-50 p-4">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-xl font-bold">
                タグ編集
            </h2>

            <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((tag) => {
                    const selected = selectedTags.some((selectedTag) => selectedTag.id === tag.id);

                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`rounded-full border px-3 py-1 text-sm ${
                                selected
                                    ? "border-amber-600 bg-amber-100"
                                    : "border-gray-400 bg-white"
                            }`}
                        >
                            {tag.name}
                        </button>
                    );
                })}
            </div>

            {showSaveButton && (
                <button
                    type="button"
                    onClick={saveTags}
                    className="border border-gray-500 bg-gray-100 px-4 py-2 hover:bg-gray-200"
                >
                    タグ保存
                </button>
            )}

            {message && <span className="ml-3 text-sm text-gray-600">{message}</span>}
        </div>
    );
}