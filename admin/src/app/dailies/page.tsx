import Link from "next/link";
import { Search } from "lucide-react";
import { getDailies } from "@/lib/dailies";

type DailiesPageProps = {
  searchParams: Promise<{
    keyword?: string;
  }>;
};

export default async function AdminDailiesPage({ searchParams }: DailiesPageProps) {
  const { keyword = "" } = await searchParams;
  const dailies = await getDailies(keyword);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-2xl font-bold">日記管理</div>
        <Link
          href="/dailies/new"
          className="border border-gray-500 bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
        >
          新規作成
        </Link>
      </div>

      <form
        action="/dailies"
        method="get"
        className="mb-6 flex w-full max-w-md items-center rounded-full border border-gray-400 px-4 py-2"
      >
        <Search className="mr-2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          name="keyword"
          defaultValue={keyword}
          placeholder="日記を検索"
          className="w-full bg-transparent outline-none placeholder:text-gray-500"
        />
      </form>

      <div className="mt-6">
        {dailies.map((daily) => (
          <div key={daily.id}>
            <div className="border-t border-gray-400" />
            <div className="mt-2">
              <Link href={`/dailies/${daily.id}`}>
                <h2 className="mr-2 text-xl font-bold hover:text-amber-500">
                  {daily.title}
                </h2>
              </Link>
            </div>
            <p className="text-gray-400">作成日:{daily.created}</p>
            <p className="text-gray-400">更新日:{daily.updated}</p>
            <div className="border-t border-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
