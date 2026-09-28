import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { getArticleById } from "./../data";

type ArticlePageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ArticlesID({ params }: ArticlePageProps){
    const { id } = await params;
    const article = await getArticleById(Number(id));
    
    if (!article) {
        notFound();
    }

    return(
        <div>
            <div className="text-gray-400">
                <div className="flex mr-2">
                    <p>tags:</p>
                    {article.tags.map((tag) => (
                        <div key={tag} className="rounded-full border border-gray-400 px-2">{tag}</div>
                    ))}
                </div>
                <div className="mr-2">created: {article.created}</div>
                <div className="mr-2">updated: {article.updated}</div>
                <div className="flex">
                    <p className="mr-2">references:</p>
                    <ul>
                        {article.references.map((reference) => (
                            <li key={reference.url}>
                                <a href={reference.url} target="_blank" rel="noreferrer" className="hover:underline">{reference.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="my-3"> </div>
            
            <div className="text-4xl font-bold mb-2">{article.title}</div>
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
                    {article.text}
                </ReactMarkdown>
            </div>
        </div>
    )
}