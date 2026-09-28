"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PostDraftEditor from "@/components/admin/PostDraftEditor";

const API_BASE_URL = "/api/backend";

type CreatedDaily = {
  id: number;
};

export default function DailyNewForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
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

    const response = await fetch(`${API_BASE_URL}/dailies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, text }),
    });

    if (!response.ok) {
      setIsSaving(false);
      setMessage("日記の作成に失敗しました");
      return;
    }

    const daily: CreatedDaily = await response.json();
    router.push(`/dailies/${daily.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <PostDraftEditor
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
          {isSaving ? "作成中" : "日記を作成"}
        </button>
        {message && <span className="ml-3 text-sm text-gray-600">{message}</span>}
      </div>
    </form>
  );
}
