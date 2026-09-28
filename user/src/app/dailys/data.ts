export type Daily = {
  id: number;
  title: string;
  text: string;
  created: string;
  updated: string;
};

type ApiDaily = {
  id: number;
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
};

const API_BASE_URL = process.env.API_BASE_URL ?? "http://api:8080";

function toDaily(daily: ApiDaily): Daily {
  return {
    id: daily.id,
    title: daily.title,
    text: daily.text,
    created: daily.created_at,
    updated: daily.updated_at,
  };
}

export async function getDailies(keyword = ""): Promise<Daily[]> {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
  const response = await fetch(`${API_BASE_URL}/dailies${query}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("failed to fetch dailies");
  }

  const dailies: ApiDaily[] = await response.json();
  return dailies.map(toDaily);
}

export async function getDailyById(id: number): Promise<Daily | undefined> {
  const response = await fetch(`${API_BASE_URL}/dailies/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return undefined;
  }
  if (!response.ok) {
    throw new Error(`failed to fetch daily ${id}`);
  }

  return toDaily(await response.json());
}
