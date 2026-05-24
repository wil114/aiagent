
-- AI分析记录表
CREATE TABLE ai_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  search_result text,
  analysis_result text NOT NULL,
  references_json jsonb DEFAULT '[]',
  confidence_score integer DEFAULT 75,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'partial', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 推送日志表
CREATE TABLE push_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('feishu', 'dingtalk')),
  status text NOT NULL CHECK (status IN ('success', 'failed')),
  payload_summary text,
  error_msg text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 风控日志表
CREATE TABLE risk_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text,
  event_title text NOT NULL,
  check_result text NOT NULL CHECK (check_result IN ('passed', 'blocked', 'warning')),
  reasoning_chain text NOT NULL,
  hallucination_type text,
  source_count integer DEFAULT 0,
  confidence_score integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 开启 Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE ai_analyses;
ALTER PUBLICATION supabase_realtime ADD TABLE push_logs;
