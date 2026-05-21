export type Article = {
    id: number;
    tags: string[];
    references: {
        title: string;
        url: string;
    }[];
    title: string;  
    text: string;
    created: string;
    updated: string;
}

export const articles: Article[] = [
    {
        id: 1,
        tags: ["Ramen", "Yamaokaya"],
        references : [
            {
                title: "山岡家",
                url: "https://www.yamaokaya.com/"
            },
        ],
        title: "山岡家背脂トッピング",
        text: "## 山岡家は食べ過ぎると腹壊します。\n\n| tokuseimiso |\n| --- |\n| 特製味噌 |\n\n![山岡家のラーメン](https://images.unsplash.com/photo-1569718212165-3a8278d5f624)\n\n背脂トッピングは満足度が高いですが、食べすぎ注意です。\n",
        created: "2025-05-19",
        updated: "2025-05-20",
    },
    {
        id: 2,
        tags: ["Burger", "MCDonald"],
        references : [
            {
                title: "マクドナルド",
                url: "https://www.yamaokaya.com/"
            },
        ],
        title: "ビッグマックセットポテトL",
        text: "マクドナルドは食べ過ぎると胃壊します。\n\nおわかり？",
        created: "2025-05-19",
        updated: "2025-05-20",
    },
]

export async function getArticles() {
    return articles;
}

export async function getArticleById(id: number) {
    return articles.find((article) => article.id === id);
}