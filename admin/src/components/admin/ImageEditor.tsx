"use client";

import { useEffect, useState, type ChangeEvent } from "react";

const API_BASE_URL = "/api/backend";

type ImageResponse = {
    name: string;
    path: string;
    url: string;
    markdown: string;
};

type ImageListResponse = {
    images: ImageResponse[];
};

type ImageEditorProps = {
    articleId: number;
    onInsertMarkdown: (markdown: string) => void;
};

export default function ImageEditor({ articleId, onInsertMarkdown }: ImageEditorProps) {
    const [images, setImages] = useState<ImageResponse[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageName, setImageName] = useState("");
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchImages();
    }, [articleId]);

    async function fetchImages() {
        const response = await fetch(`${API_BASE_URL}/articles/${articleId}/images`);

        if (!response.ok) {
            setMessage("画像一覧の取得に失敗しました");
            return;
        }

        const data: ImageListResponse = await response.json();
        setImages(data.images);
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            setSelectedFile(null);
            setImageName("");
            return;
        }

        setSelectedFile(file);
        setImageName(file.name);
    }

    async function uploadImage() {
        if (!selectedFile) {
            setMessage("画像ファイルを選択してください");
            return;
        }

        if (imageName.trim() === "") {
            setMessage("画像ファイル名を入力してください");
            return;
        }

        setIsUploading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch(
            `${API_BASE_URL}/articles/${articleId}/images?name=${encodeURIComponent(imageName)}`,
            {
                method: "POST",
                body: formData,
            },
        );

        setIsUploading(false);

        if (!response.ok) {
            const responseText = await response.text();
            setMessage(`画像のアップロードに失敗しました status=${response.status} body=${responseText}`);
            return;
        }

        const image: ImageResponse = await response.json();

        setImages((currentImages) => {
            const filteredImages = currentImages.filter((currentImage) => currentImage.name !== image.name);
            return [...filteredImages, image];
        });

        onInsertMarkdown(image.markdown);

        setSelectedFile(null);
        setImageName("");
        setMessage("画像をアップロードし、Markdown本文に挿入しました");
    }

    async function deleteImage(name: string) {
        const confirmed = window.confirm(`${name} を削除しますか？`);

        if (!confirmed) {
            return;
        }

        const response = await fetch(
            `${API_BASE_URL}/articles/${articleId}/images/${encodeURIComponent(name)}`,
            {
                method: "DELETE",
            },
        );

        if (!response.ok) {
            const responseText = await response.text();
            setMessage(`画像の削除に失敗しました status=${response.status} body=${responseText}`);
            return;
        }

        setImages((currentImages) =>
            currentImages.filter((image) => image.name !== name)
        );

        setMessage("画像を削除しました");
    }

    return (
        <div className="mb-8 border border-gray-400 bg-gray-50 p-4">
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-xl font-bold">
                画像編集
            </h2>

            <div className="mb-4 border border-gray-300 bg-white p-3">
                <div className="mb-2 text-sm font-bold">新規アップロード</div>

                <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="mb-2 w-full border border-gray-400 px-3 py-2"
                />

                <input
                    value={imageName}
                    onChange={(event) => setImageName(event.target.value)}
                    className="mb-2 w-full border border-gray-400 px-3 py-2"
                    placeholder="1.png"
                />

                <button
                    type="button"
                    onClick={uploadImage}
                    disabled={isUploading}
                    className="border border-gray-500 bg-gray-100 px-4 py-2 hover:bg-gray-200 disabled:opacity-50"
                >
                    {isUploading ? "アップロード中" : "画像アップロード"}
                </button>

                {message && <span className="ml-3 text-sm text-gray-600">{message}</span>}
            </div>

            <div className="grid gap-3">
                {images.map((image) => (
                    <div key={image.path} className="border border-gray-300 bg-white p-3">
                        <div className="mb-2 text-sm font-bold">{image.name}</div>

                        <img
                            src={image.url}
                            alt={image.name}
                            className="mb-3 h-auto max-w-xs rounded border border-gray-400"
                        />

                        <div className="mb-2 break-all font-mono text-xs text-gray-700">
                            {image.markdown}
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onInsertMarkdown(image.markdown)}
                                className="border border-gray-500 bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                            >
                                Markdownに挿入
                            </button>

                            <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(image.markdown)}
                                className="border border-gray-500 bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                            >
                                コピー
                            </button>

                            <button
                                type="button"
                                onClick={() => deleteImage(image.name)}
                                className="border border-red-500 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100"
                            >
                                削除
                            </button>
                        </div>
                    </div>
                ))}

                {images.length === 0 && (
                    <div className="border border-gray-300 bg-white p-3 text-sm text-gray-600">
                        この記事に紐づく画像はありません
                    </div>
                )}
            </div>
        </div>
    );
}