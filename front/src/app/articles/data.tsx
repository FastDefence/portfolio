export type Article = {
    id: number;
    tags: string[];
    published: string;
    references: {
        title: string;
        url: string;
    }[];
    title: string;  
    text: string;
}

export const articles: Article[] = [
    {
        id: 1,
        tags: ["Ramen", "Yamaokaya"],
        published: "2026-05-18T18:53:00+09:00",
        references : [
            {
                title: "山岡家",
                url: "https://www.yamaokaya.com/"
            },
        ],
        title: "山岡家背油トッピング",
        text: "山岡家は食べ過ぎると腹壊します",
    },
    {
        id: 2,
        tags: ["Burger"],
        published: "2026-05-19T18:53:00+09:00",
        references : [
            {
                title: "マクドナルド",
                url: "https://www.yamaokaya.com/"
            },
        ],
        title: "ビッグマックセットポテトL",
        text: "マクドナルドは食べ過ぎると胃がおかしくなります"
    },
]

export async function getArticles() {
    return articles;
}

export async function getArticleById(id: number) {
    return articles.find((article) => article.id === id);
}