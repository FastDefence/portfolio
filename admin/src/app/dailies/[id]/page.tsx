import { notFound } from "next/navigation";
import DailyEditForm from "@/components/admin/DailyEditForm";
import { getDailyById } from "@/lib/dailies";

type DailyEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DailyEditPage({ params }: DailyEditPageProps) {
  const { id } = await params;
  const daily = await getDailyById(Number(id));

  if (!daily) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">日記編集</h1>
        <p className="text-sm text-gray-500">daily id: {daily.id}</p>
      </div>
      <DailyEditForm daily={daily} />
    </div>
  );
}
