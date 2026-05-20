export type Article = {
    id: number;
    tags: string[];
    published: string;
    updated: string;
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
        published: "2026-05-18",
        updated: "2026-05-20",
        references : [
            {
                title: "山岡家",
                url: "https://www.yamaokaya.com/"
            },
        ],
        title: "山岡家背脂トッピング",
        text: "## 山岡家は食べ過ぎると腹壊します。\n\n| tokuseimiso |\n| --- |\n| 特製味噌 |\n\n![山岡家のラーメン](https://images.unsplash.com/photo-1569718212165-3a8278d5f624)\n\n背脂トッピングは満足度が高いですが、食べすぎ注意です。\n",
    },
    {
        id: 2,
        tags: ["Burger", "MCDonald"],
        published: "2026-05-19",
        updated: "2026-05-20",
        references : [
            {
                title: "マクドナルド",
                url: "https://www.yamaokaya.com/"
            },
        ],
        title: "ビッグマックセットポテトL",
        text: "マクドナルドは食べ過ぎると胃壊します。\n\nおわかり？",
    },
]

export async function getArticles() {
    return articles;
}

export async function getArticleById(id: number) {
    return articles.find((article) => article.id === id);
}