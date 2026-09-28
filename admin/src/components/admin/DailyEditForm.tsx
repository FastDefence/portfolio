"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import PostDraftEditor from "@/components/admin/PostDraftEditor";
import type { Daily } from "@/lib/dailies";

const API_BASE_URL = "/api/backend";

type DailyEditFormProps = {
  daily: Daily;
};

export default function DailyEditForm({ daily }: DailyEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(daily.title);
  const [text, setText] = useState(daily.text);
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

    const response = await fetch(`${API_BASE_URL}/dailies/${daily.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, text }),
    });

    setIsSaving(false);
    if (!response.ok) {
      setMessage(`保存に失敗しました status=${response.status}`);
      return;
    }

    setMessage("保存しました");
    router.refresh();
  }

  async function handleDelete() {
    if (!window.confirm("この日記を削除しますか？")) {
      return;
    }

    const response = await fetch(`${API_BASE_URL}/dailies/${daily.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setMessage(`削除に失敗しました status=${response.status}`);
      return;
    }

    router.push("/dailies");
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
          {isSaving ? "保存中" : "日記を保存"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="ml-2 border border-red-500 bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100"
        >
          日記削除
        </button>
        {message && <span className="ml-3 text-sm text-gray-600">{message}</span>}
      </div>
    </form>
  );
}
