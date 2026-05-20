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
                        <div key="{tag.id}" className="rounded-full border border-gray-400 px-2">{tag}</div>
                    ))}
                </div>
                <div className="mr-2">published: {article.published}</div>
                <div className="flex">
                    <p className="mr-2">references:</p>
                    <ul>
                        {article.references.map((reference) => (
                            <li key="{reference.url}">
                                <a href={reference.url} target="_blank" rel="noreferrer" className="hover:underline">{reference.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="my-3"> </div>
            <div className="text-4xl font-bold mb-2">{article.title}</div>
            <div className="rounded border border-gray-400 p-4">{article.text}</div>
        </div>
    )
}