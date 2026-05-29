"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ArticleDraftEditorProps = {
    title: string;
    text: string;
    onTitleChange: (title: string) => void;
    onTextChange: (text: string) => void;
};

export default function ArticleDraftEditor({
    title,
    text,
    onTitleChange,
    onTextChange,
}: ArticleDraftEditorProps) {
    return (
        <div className="mb-8 border border-gray-400 bg-gray-50 p-4">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-xl font-bold">
                記事本文編集
            </h2>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-bold">
                    タイトル
                </label>
                <input
                    value={title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    className="w-full border border-gray-400 bg-white px-3 py-2"
                    placeholder="記事タイトル"
                />
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-bold">
                    本文 Markdown
                </label>
                <textarea
                    value={text}
                    onChange={(event) => onTextChange(event.target.value)}
                    className="min-h-[360px] w-full border border-gray-400 bg-white px-3 py-2 font-mono"
                    placeholder="Markdownで本文を書く"
                />
            </div>

            <div className="mt-8">
                <h2 className="mb-3 border-b border-gray-300 pb-1 text-xl font-bold">
                    プレビュー
                </h2>

                <div className="rounded border border-gray-400 bg-white p-4">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ ...props }) => (
                                <h1 {...props} className="mb-4 text-3xl font-bold leading-tight" />
                            ),
                            h2: ({ ...props }) => (
                                <h2 {...props} className="mb-3 mt-6 text-2xl font-bold leading-tight" />
                            ),
                            p: ({ ...props }) => (
                                <p {...props} className="my-4 leading-8" />
                            ),
                            img: ({ ...props }) => (
                                <img
                                    {...props}
                                    className="my-6 h-auto max-w-full rounded-lg border border-gray-500"
                                />
                            ),
                            table: ({ ...props }) => (
                                <table
                                    {...props}
                                    className="my-4 w-full border-collapse border border-gray-500"
                                />
                            ),
                            th: ({ ...props }) => (
                                <th
                                    {...props}
                                    className="border border-gray-500 px-3 py-2 text-left font-bold"
                                />
                            ),
                            td: ({ ...props }) => (
                                <td
                                    {...props}
                                    className="border border-gray-500 px-3 py-2"
                                />
                            ),
                        }}
                    >
                        {text}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}