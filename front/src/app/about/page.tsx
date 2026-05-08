export default function AboutPage() {
  return (
    <div className="mx-4 rounded-3xl border p-6 shadow-md">
      <div className="mb-4">
        <h2 className="inline-block border-b border-slate-500 text-3xl font-bold text-white transition hover:text-amber-400">
          名前
        </h2>
        <p className="mt-4 text-2xl">
          見留あると
        </p>
      </div>

      <div className="mb-4">
        <h2 className="inline-block border-b border-slate-500 text-3xl font-bold text-white transition hover:text-amber-400">
          所属
        </h2>
        <p className="mt-4 text-2xl">
          長岡技術科学大学 情報・経営システム工学課程 B4
        </p>
        <p className="mt-4 text-2xl">
          羽山研究室
        </p>
      </div>

      <div className="mb-4">
        <h2 className="inline-block border-b border-slate-500 text-3xl font-bold text-white transition hover:text-amber-400">
          趣味
        </h2>
        <p className="mt-4 text-2xl">
          アニメ・音楽・外出（旅行・移動・ドライブ）
        </p>
      </div>

      <div className="mb-4">
        <h2 className="inline-block border-b border-slate-500 text-3xl font-bold text-white transition hover:text-amber-400">
          気になる分野
        </h2>
        <p className="mt-4 text-2xl">
          コンピューターアーキテクチャ・ネットワーク・分散システム・Linux
        </p>
      </div>
    </div>
  );
}