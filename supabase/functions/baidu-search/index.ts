/**
 * 百度AI搜索 Edge Function
 * 对指定话题进行实时全网搜索，SSE流式透传
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let messages: Array<{ role: string; content: string }>;
  let searchRecencyFilter: string | undefined;
  let enableDeepSearch: boolean | undefined;

  try {
    const body = await req.json();
    messages = body.messages;
    searchRecencyFilter = body.search_recency_filter;
    enableDeepSearch = body.enable_deep_search ?? false;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Missing messages");
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Invalid request: ${(err as Error).message}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const apiKey = Deno.env.get("INTEGRATIONS_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const upstreamBody: Record<string, unknown> = {
    messages,
    resource_type_filter: [{ type: "web", top_k: 6 }],
    enable_deep_search: enableDeepSearch,
    enable_reasoning: false,
    enable_followup_queries: false,
    max_completion_tokens: 2000,
  };
  if (searchRecencyFilter) upstreamBody.search_recency_filter = searchRecencyFilter;

  const upstream = await fetch(
    "https://app-btvkxctz25mp-api-DYJwo27V8Qya-gateway.appmiaoda.com/v2/ai_search/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gateway-Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(upstreamBody),
    }
  );

  if (upstream.status === 429 || upstream.status === 402) {
    const errText = await upstream.text();
    return new Response(errText, {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(
      JSON.stringify({ error: `Upstream error: ${upstream.status}` }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(upstream.body, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
});
