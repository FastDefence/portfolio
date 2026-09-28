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
};

type ApiArticle = {
  id: number;
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
};

type ApiTag = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

type ApiReference = {
  id: number;
  article_id: number;
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
};

const API_BASE_URL = process.env.API_BASE_URL ?? "http://api:8080";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`failed to fetch ${path}`);
  }

  return response.json();
}

export async function getArticles(keyword: string = ""): Promise<Article[]> {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
  const articles = await fetchJson<ApiArticle[]>(`/articles${query}`);

  return Promise.all(
    articles.map(async (article) => {
      const tags = await fetchJson<ApiTag[]>(`/articles/${article.id}/tags`);

      return {
        id: article.id,
        title: article.title,
        text: article.text,
        created: article.created_at,
        updated: article.updated_at,
        tags: tags.map((tag) => tag.name),
        references: [],
      };
    }),
  );
}

export async function getArticleById(id: number): Promise<Article | undefined> {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`failed to fetch article ${id}`);
  }

  const article: ApiArticle = await response.json();

  const [tags, references] = await Promise.all([
    fetchJson<ApiTag[]>(`/articles/${id}/tags`),
    fetchJson<ApiReference[]>(`/articles/${id}/references`),
  ]);

  return {
    id: article.id,
    title: article.title,
    text: article.text,
    created: article.created_at,
    updated: article.updated_at,
    tags: tags.map((tag) => tag.name),
    references: references.map((reference) => ({
      title: reference.title,
      url: reference.url,
    })),
  };
}