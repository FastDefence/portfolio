import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDailyById } from "../data";

type DailyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DailyPage({ params }: DailyPageProps) {
  const { id } = await params;
  const daily = await getDailyById(Number(id));

  if (!daily) {
    notFound();
  }

  return (
    <div>
      <div className="text-gray-400">
        <div>created: {daily.created}</div>
        <div>updated: {daily.updated}</div>
      </div>
      <div className="my-3" />

      <div className="mb-2 text-4xl font-bold">{daily.title}</div>
      <div className="rounded border border-gray-400 p-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ ...props }) => (
              <h1 {...props} className="mb-4 text-3xl font-bold leading-tight" />
            ),
            h2: ({ ...props }) => (
              <h2 {...props} className="mb-3 mt-6 text-2xl font-bold leading-tight" />
            ),
            p: ({ ...props }) => <p {...props} className="my-4 leading-8" />,
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
              <td {...props} className="border border-gray-500 px-3 py-2" />
            ),
          }}
        >
          {daily.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
