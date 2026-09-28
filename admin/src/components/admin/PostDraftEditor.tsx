"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PostDraftEditorProps = {
    title: string;
    text: string;
    onTitleChange: (title: string) => void;
    onTextChange: (text: string) => void;
};

export default function PostDraftEditor({
    title,
    text,
    onTitleChange,
    onTextChange,
}: PostDraftEditorProps) {
    return (
        <div>
            <div className="mb-4">
                <label className="mb-1 block font-bold">タイトル</label>
                <input
                    value={title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    className="w-full border border-gray-400 px-3 py-2"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-1 block font-bold">Markdown</label>
                    <textarea
                        value={text}
                        onChange={(event) => onTextChange(event.target.value)}
                        className="h-[640px] w-full border border-gray-400 px-3 py-2 font-mono"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-bold">Preview</label>
                    <div className="h-[640px] overflow-auto border border-gray-400 bg-white p-4">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                img: ({ ...props }) => (
                                    <img
                                        {...props}
                                        className="my-6 block h-auto w-auto max-w-full rounded-lg border border-gray-500"
                                    />
                                ),
                            }}
                        >
                            {text}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
