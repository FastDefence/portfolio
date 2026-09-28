const API_BASE_URL = process.env.API_BASE_URL ?? "http://api:8080";
const ADMIN_API_KEY_HEADER = "X-Admin-Key";

type ProxyContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxy(request: Request, context: ProxyContext) {
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    return Response.json(
      { message: "admin API authentication is not configured" },
      { status: 503 },
    );
  }

  const { path } = await context.params;
  const requestUrl = new URL(request.url);
  const encodedPath = path.map(encodeURIComponent).join("/");
  const targetUrl = `${API_BASE_URL}/${encodedPath}${requestUrl.search}`;
  const headers = new Headers({
    [ADMIN_API_KEY_HEADER]: adminApiKey,
  });
  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
    redirect: "manual",
  });
  const responseHeaders = new Headers();
  const responseContentType = response.headers.get("content-type");

  if (responseContentType) {
    responseHeaders.set("content-type", responseContentType);
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
};
