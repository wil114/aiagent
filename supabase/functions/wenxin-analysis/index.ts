/**
 * 文心大模型分析 Edge Function
 * 接收用户话题 + 搜索结果，调用ERNIE 4.5 Turbo生成市场情报分析，SSE流式透传
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

  let topic: string;
  let searchContext: string;
  let systemPrompt: string;
  let enableThinking: boolean = false;

  try {
    const body = await req.json();
    topic = body.topic;
    searchContext = body.search_context ?? "";
    enableThinking = body.enable_thinking ?? false;
    systemPrompt = body.system_prompt ?? `你是高级战略情报分析师。请基于提供的市场信息，输出结构化战略情报简报。`;
    
    if (!topic || typeof topic !== "string") throw new Error("Missing topic");
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

  const userContent = searchContext
    ? `分析话题：${topic}\n\n参考信息（来自实时搜索）：\n${searchContext}`
    : `分析话题：${topic}\n\n请基于你的知识库进行分析。`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent },
  ];

  const upstream = await fetch(
    "https://app-btvkxctz25mp-api-zYkZz8qovQ1L-gateway.appmiaoda.com/v2/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gateway-Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ messages, enable_thinking: enableThinking }),
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
