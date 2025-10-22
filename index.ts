function handlePreFlightRequest(): Response {
  return new Response("Preflight OK!", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
    },
  });
}

async function handler(_req: Request): Promise<Response> {
  if (_req.method === "OPTIONS") return handlePreFlightRequest();

  const url = new URL(_req.url);
  const userWord = url.searchParams.get("word") || "test";

  const similarityRequestBody = JSON.stringify({
    word1: "centrale",
    word2: userWord,
  });

  try {
    const response = await fetch("https://word2vec.nicolasfley.fr/similarity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: similarityRequestBody,
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
      },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

Deno.serve(handler);
