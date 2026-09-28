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

    useEffect(() => {
        onChange(references);
    }, [references, onChange]);

    function addReference() {
        setReferences((currentReferences) => [
            ...currentReferences,
            {
                title: "",
                url: "",
            },
        ]);
    }

    function updateReference(index: number, key: keyof DraftReference, value: string) {
        setReferences((currentReferences) =>
            currentReferences.map((reference, currentIndex) =>
                currentIndex === index
                    ? {
                          ...reference,
                          [key]: value,
                      }
                    : reference,
            ),
        );
    }

    function deleteReference(index: number) {
        setReferences((currentReferences) =>
            currentReferences.filter((_, currentIndex) => currentIndex !== index),
        );
    }

    return (
        <div className="mb-8 border border-gray-400 bg-gray-50 p-4">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-xl font-bold">
                参考リンク
            </h2>

            <div className="grid gap-3">
                {references.map((reference, index) => (
                    <div key={index} className="border border-gray-300 bg-white p-3">
                        <input
                            value={reference.title}
                            onChange={(event) => updateReference(index, "title", event.target.value)}
                            className="mb-2 w-full border border-gray-400 px-3 py-2"
                            placeholder="title"
                        />
                        <input
                            value={reference.url}
                            onChange={(event) => updateReference(index, "url", event.target.value)}
                            className="mb-2 w-full border border-gray-400 px-3 py-2"
                            placeholder="url"
                        />
                        <button
                            type="button"
                            onClick={() => deleteReference(index)}
                            className="border border-red-500 bg-red-50 px-3 py-1 text-sm text-red-700"
                        >
                            削除
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addReference}
                className="mt-3 border border-gray-500 bg-gray-100 px-4 py-2 hover:bg-gray-200"
            >
                参考リンク追加
            </button>
        </div>
    );
}