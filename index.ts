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
  if (_req.method == "OPTIONS") {
    handlePreFlightRequest();
  }

  // ✅ 1. Extraire le mot depuis l'URL
  const url = new URL(_req.url);
  const userWord = url.searchParams.get("word") || "default";
  console.log("Mot reçu depuis l’URL :", userWord);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const similarityRequestBody = JSON.stringify({
    word1: userWord, // mot saisi par l'utilisateur dans l'URL
    word2: "supelec", // mot fixe
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: similarityRequestBody,
    redirect: "follow",
  };

  try {
    const response = await fetch("https://word2vec.nicolasfley.fr/similarity", requestOptions);

    if (!response.ok) {
      console.error(`Error: ${response.statusText}`);
      return new Response(`Error: ${response.statusText}`, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "content-type",
        },
      });
    }

    const result = await response.json();

    console.log(result);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

Deno.serve(handler);