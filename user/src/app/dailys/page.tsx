import Link from "next/link";
import { Search } from "lucide-react";
import { getDailies } from "./data";

type DailiesPageProps = {
  searchParams: Promise<{
    keyword?: string;
  }>;
};

export default async function Dailies({ searchParams }: DailiesPageProps) {
  const { keyword = "" } = await searchParams;
  const dailies = await getDailies(keyword);

  return (
    <div>
      <div className="mb-4 text-3xl font-bold">日記一覧</div>

      <form
        action="/dailys"
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
              <Link href={`/dailys/${daily.id}`}>
                <h2 className="mr-2 text-xl font-bold hover:text-amber-400">
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
