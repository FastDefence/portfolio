"use client";

import { useEffect, useState } from "react";

export type DraftReference = {
    title: string;
    url: string;
};

type ReferenceDraftEditorProps = {
    onChange: (references: DraftReference[]) => void;
};

export default function ReferenceDraftEditor({ onChange }: ReferenceDraftEditorProps) {
    const [references, setReferences] = useState<DraftReference[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newUrl, setNewUrl] = useState("");

    useEffect(() => {
        onChange(references);
    }, [references, onChange]);

    function addReference() {
        if (newTitle.trim() === "" || newUrl.trim() === "") {
            return;
        }

        setReferences((currentReferences) => [
            ...currentReferences,
            {
                title: newTitle,
                url: newUrl,
            },
        ]);

        setNewTitle("");
        setNewUrl("");
    }

    function removeReference(index: number) {
        setReferences((currentReferences) =>
            currentReferences.filter((_, currentIndex) => currentIndex !== index)
        );
    }

    function updateReference(index: number, field: "title" | "url", value: string) {
        setReferences((currentReferences) =>
            currentReferences.map((reference, currentIndex) =>
                currentIndex === index
                    ? { ...reference, [field]: value }
                    : reference
            )
        );
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
                {references.map((reference, index) => (
                    <div key={`${reference.url}-${index}`} className="border border-gray-300 bg-white p-3">
                        <div className="mb-2">
                            <label className="mb-1 block text-sm font-bold">title</label>
                            <input
                                value={reference.title}
                                onKeyDown={preventEnterSubmit}
                                onChange={(event) => updateReference(index, "title", event.target.value)}
                                className="w-full border border-gray-400 px-3 py-2"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="mb-1 block text-sm font-bold">url</label>
                            <input
                                value={reference.url}
                                onKeyDown={preventEnterSubmit}
                                onChange={(event) => updateReference(index, "url", event.target.value)}
                                className="w-full border border-gray-400 px-3 py-2"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => removeReference(index)}
                            className="border border-red-500 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100"
                        >
                            削除
                        </button>
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
                    onClick={addReference}
                    className="border border-gray-500 bg-gray-100 px-4 py-2 hover:bg-gray-200"
                >
                    追加
                </button>
            </div>
        </div>
    );
}