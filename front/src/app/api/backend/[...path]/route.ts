const API_BASE_URL = process.env.API_BASE_URL ?? "http://api:8080";

type ProxyContext = {
    params: Promise<{
        path: string[];
    }>;
};

async function proxy(request: Request, context: ProxyContext) {
    const { path } = await context.params;
    const requestUrl = new URL(request.url);

    const targetUrl = `${API_BASE_URL}/${path.join("/")}${requestUrl.search}`;

    const headers = new Headers();
    const contentType = request.headers.get("content-type");

    if (contentType) {
        headers.set("content-type", contentType);
    }

    const hasBody = request.method !== "GET" && request.method !== "HEAD";

    const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: hasBody ? await request.text() : undefined,
        cache: "no-store",
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