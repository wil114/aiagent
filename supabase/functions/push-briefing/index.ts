/**
 * 推送简报 Edge Function
 * 支持飞书/钉钉Webhook推送，并记录推送日志到数据库
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BriefingData {
  date: string;
  overview: string;
  topEvents: Array<{
    title: string;
    market: string;
    confidence: string;
    suggestion: string;
  }>;
}

/** 构建飞书富文本卡片消息 */
function buildFeishuMessage(data: BriefingData) {
  const confidenceMap: Record<string, string> = {
    confirmed: "✅ 已确认",
    speculated: "🟡 推测",
    rumor: "🔴 传闻",
  };

  const eventElements = data.topEvents.flatMap((e, i) => [
    {
      tag: "div",
      text: {
        content: `**${i + 1}. ${e.title}**`,
        tag: "lark_md",
      },
    },
    {
      tag: "div",
      text: {
        content: `市场：${e.market} | 置信度：${confidenceMap[e.confidence] ?? e.confidence}`,
        tag: "lark_md",
      },
    },
    {
      tag: "div",
      text: {
        content: `💡 建议：${e.suggestion}`,
        tag: "lark_md",
      },
    },
    { tag: "hr" },
  ]);

  return {
    msg_type: "interactive",
    card: {
      header: {
        title: {
          content: `🌐 企业X战略情报简报 | ${data.date}`,
          tag: "plain_text",
        },
        template: "blue",
      },
      elements: [
        {
          tag: "div",
          text: {
            content: `**今日概览**\n${data.overview}`,
            tag: "lark_md",
          },
        },
        { tag: "hr" },
        {
          tag: "div",
          text: {
            content: "**🔥 Top3关键事件**",
            tag: "lark_md",
          },
        },
        ...eventElements,
        {
          tag: "note",
          elements: [
            {
              tag: "plain_text",
              content: "由AI战略雷达系统自动生成 · 仅供参考，请结合实际情况决策",
            },
          ],
        },
      ],
    },
  };
}

/** 构建钉钉Markdown消息 */
function buildDingtalkMessage(data: BriefingData) {
  const confidenceMap: Record<string, string> = {
    confirmed: "✅已确认",
    speculated: "🟡推测",
    rumor: "🔴传闻",
  };

  const eventLines = data.topEvents
    .map(
      (e, i) =>
        `**${i + 1}. ${e.title}**\n> 市场：${e.market} | ${confidenceMap[e.confidence] ?? e.confidence}\n> 💡 ${e.suggestion}`
    )
    .join("\n\n");

  return {
    msgtype: "markdown",
    markdown: {
      title: `企业X战略情报简报 ${data.date}`,
      text: `## 🌐 企业X战略情报简报\n**${data.date}**\n\n---\n\n### 📋 今日概览\n${data.overview}\n\n---\n\n### 🔥 Top3关键事件\n\n${eventLines}\n\n---\n\n*由AI战略雷达系统自动生成*`,
    },
  };
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let platform: "feishu" | "dingtalk";
  let webhookUrl: string;
  let briefingData: BriefingData;

  try {
    const body = await req.json();
    platform = body.platform;
    webhookUrl = body.webhook_url;
    briefingData = body.briefing_data;
    if (!platform || !webhookUrl || !briefingData) {
      throw new Error("Missing required fields: platform, webhook_url, briefing_data");
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Invalid request: ${(err as Error).message}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // 初始化Supabase客户端记录日志
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 构建推送消息体
  const payload =
    platform === "feishu"
      ? buildFeishuMessage(briefingData)
      : buildDingtalkMessage(briefingData);

  let pushStatus: "success" | "failed" = "failed";
  let errorMsg: string | undefined;

  try {
    const resp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      errorMsg = `HTTP ${resp.status}: ${errText}`;
    } else {
      const result = await resp.json();
      // 飞书: code=0 成功; 钉钉: errcode=0 成功
      if (
        (platform === "feishu" && result.code !== 0) ||
        (platform === "dingtalk" && result.errcode !== 0)
      ) {
        errorMsg = JSON.stringify(result);
      } else {
        pushStatus = "success";
      }
    }
  } catch (err) {
    errorMsg = (err as Error).message;
  }

  // 记录推送日志
  await supabase.from("push_logs").insert({
    platform,
    status: pushStatus,
    payload_summary: `${briefingData.date} | Top${briefingData.topEvents.length}事件`,
    error_msg: errorMsg ?? null,
  });

  return new Response(
    JSON.stringify({
      success: pushStatus === "success",
      platform,
      error: errorMsg,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
