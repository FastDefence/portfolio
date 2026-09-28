import DailyNewForm from "@/components/admin/DailyNewForm";

export default function DailyNewPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">日記新規作成</h1>
      </div>
      <DailyNewForm />
    </div>
  );
}
