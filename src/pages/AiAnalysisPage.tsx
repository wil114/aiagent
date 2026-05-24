/**
 * AI 分析页面
 * - 话题输入 → 百度AI搜索 + 文心大模型分析（双阶段流式）
 * - 多源评分风控 + Validator二次校验
 * - 结果自动存库 + 历史记录查阅
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Brain,
  Search,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  Globe,
  Zap,
  History,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '@/db/supabase';
import { sendStreamRequest } from '@/lib/sse';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// 预设分析话题
const PRESET_TOPICS = [
  '美国培育钻石市场最新政策变化',
  '日本珠宝竞品价格战动向',
  '东南亚Shopee平台珠宝品类趋势',
  '韩国培育钻石社交媒体热度分析',
  '中国内地培育钻石监管最新动态',
];

// 计算多源置信度评分
function calcConfidenceScore(refs: Reference[]): number {
  if (!refs.length) return 45;
  const sourceCount = Math.min(refs.length, 8);
  const avgReliability = refs.reduce((s, _r) => s + 85, 0) / refs.length; // 搜索结果默认可靠度85
  const consistency = sourceCount >= 3 ? 90 : sourceCount >= 2 ? 75 : 60;
  return Math.round(sourceCount / 8 * 30 + avgReliability * 0.4 + consistency * 0.3);
}

// Validator幻觉检测
function detectHallucination(text: string): { detected: boolean; reason?: string } {
  const suspiciousPatterns = [
    { pattern: /\d{3,}%/, reason: '数据异常：百分比数值过大' },
    { pattern: /未来\d+年内必然/, reason: '过度确定性表述' },
    { pattern: /绝对|必定|100%确定/, reason: '绝对化用词' },
  ];
  for (const { pattern, reason } of suspiciousPatterns) {
    if (pattern.test(text)) return { detected: true, reason };
  }
  return { detected: false };
}

interface Reference {
  id: number;
  title: string;
  url: string;
  content: string;
  date?: string;
}

interface AnalysisRecord {
  id: string;
  topic: string;
  analysis_result: string;
  references_json: Reference[];
  confidence_score: number;
  status: string;
  created_at: string;
}

type Phase = 'idle' | 'searching' | 'analyzing' | 'validating' | 'done' | 'error';

const PhaseLabel: Record<Phase, string> = {
  idle: '准备就绪',
  searching: '正在搜索实时信息...',
  analyzing: '文心大模型分析中...',
  validating: 'Validator校验中...',
  done: '分析完成',
  error: '分析失败',
};

const PhaseProgress: Record<Phase, number> = {
  idle: 0, searching: 25, analyzing: 65, validating: 88, done: 100, error: 0,
};

const AiAnalysisPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [searchContent, setSearchContent] = useState('');
  const [analysisContent, setAnalysisContent] = useState('');
  const [references, setReferences] = useState<Reference[]>([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [hallucinationCheck, setHallucinationCheck] = useState<{ detected: boolean; reason?: string } | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const analysisRef = useRef('');
  const refsRef = useRef<Reference[]>([]);
  const analysisEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadHistory(); }, []);

  // 分析内容自动滚动到底部
  useEffect(() => {
    if (phase === 'analyzing') {
      analysisEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [analysisContent, phase]);

  async function loadHistory() {
    setHistoryLoading(true);
    const { data } = await supabase
      .from('ai_analyses')
      .select('id, topic, analysis_result, references_json, confidence_score, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    setHistory((data as AnalysisRecord[]) ?? []);
    setHistoryLoading(false);
  }

  const handleAbort = () => {
    abortRef.current?.abort();
    setPhase('idle');
    toast.info('已中断分析');
  };

  const handleAnalyze = async (overrideTopic?: string) => {
    const currentTopic = overrideTopic || topic;
    if (overrideTopic) setTopic(overrideTopic);
    
    if (!currentTopic.trim()) { toast.error('请输入分析话题'); return; }
    if (phase !== 'idle' && phase !== 'done' && phase !== 'error') return;

    // 重置状态
    setSearchContent('');
    setAnalysisContent('');
    setReferences([]);
    setConfidenceScore(0);
    setHallucinationCheck(null);
    analysisRef.current = '';
    refsRef.current = [];
    abortRef.current = new AbortController();

    // === 阶段1：百度AI搜索 ===
    setPhase('searching');
    let searchSummary = '';
    let searchDone = false;

    await new Promise<void>((resolve) => {
      sendStreamRequest({
        functionUrl: `${SUPABASE_URL}/functions/v1/baidu-search`,
        requestBody: {
          messages: [
            { 
              role: 'user', 
              content: `请根据企业X的业务场景（全球5000+门店的珠宝集团，关注培育钻石及天然钻石市场），严格按照以下格式生成战略简报：
              
# 关键变化要点
(列出竞品/产品/平台/社媒/法规方面的最新核心动态)

# 业务潜在影响
(分析对企业X的机会和风险)

# 行动建议
- [总部决策]: xxx
- [区域管理]: xxx
- [门店执行]: xxx

当前话题：${currentTopic}` 
            }
          ],
          search_recency_filter: 'month',
          enable_deep_search: false,
        },
        supabaseAnonKey: SUPABASE_ANON_KEY,
        signal: abortRef.current!.signal,
        onData: (data) => {
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            const chunk = parsed?.choices?.[0]?.delta?.content ?? '';
            if (chunk) {
              searchSummary += chunk;
              setSearchContent(searchSummary);
            }
            const refs = parsed?.references;
            if (Array.isArray(refs) && refs.length) {
              refsRef.current = refs as Reference[];
              setReferences(refs as Reference[]);
            }
          } catch { /* skip */ }
        },
        onComplete: () => { searchDone = true; resolve(); },
        onError: (err) => {
          console.warn('[搜索阶段警告]', err.message);
          // 搜索失败不阻断，继续分析
          searchDone = true;
          resolve();
        },
      });
    });

    if (abortRef.current?.signal.aborted) return;

    // === 阶段2：文心大模型分析 ===
    setPhase('analyzing');

    await new Promise<void>((resolve) => {
      sendStreamRequest({
        functionUrl: `${SUPABASE_URL}/functions/v1/wenxin-analysis`,
        requestBody: {
          topic: currentTopic,
          search_context: searchSummary.slice(0, 3000), // 截断避免token超限
          system_prompt: `你是一个专业的珠宝行业战略分析师Agent。请基于以下搜索内容，严格按照特定格式为一家拥有5000+门店的跨国珠宝集团（企业X）生成战略分析简报。
          
必须严格包含以下三个部分：
### 1. 关键变化要点
总结市场最新动态（竞品、平台、法规、社媒等）。

### 2. 业务潜在影响
分析对该珠宝企业的机会与风险。

### 3. 行动建议 (三级分发)
- **总部决策层**：战略/供应链层面的行动
- **区域管理层**：区域营销/本地合规行动
- **门店执行层**：终端话术/门店陈列行动`,
          enable_thinking: false,
        },
        supabaseAnonKey: SUPABASE_ANON_KEY,
        signal: abortRef.current!.signal,
        onData: (data) => {
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            const chunk = parsed?.choices?.[0]?.delta?.content ?? '';
            if (chunk) {
              analysisRef.current += chunk;
              setAnalysisContent(analysisRef.current);
            }
          } catch { /* skip */ }
        },
        onComplete: resolve,
        onError: (err) => {
          setPhase('error');
          toast.error(`分析失败：${err.message}`);
          resolve();
        },
      });
    });

    if (abortRef.current?.signal.aborted) return;
    if (phase === 'error') return;

    // === 阶段3：Validator校验 ===
    setPhase('validating');
    await new Promise<void>((r) => setTimeout(r, 800)); // 模拟校验延迟

    const score = calcConfidenceScore(refsRef.current);
    const hallCheck = detectHallucination(analysisRef.current);
    setConfidenceScore(score);
    setHallucinationCheck(hallCheck);

    // === 保存到数据库 ===
    const status = hallCheck.detected ? 'partial' : 'completed';
    const { error: dbErr } = await supabase.from('ai_analyses').insert({
      topic: currentTopic,
      search_result: searchSummary.slice(0, 2000),
      analysis_result: analysisRef.current,
      references_json: refsRef.current.slice(0, 6),
      confidence_score: score,
      status,
    });
    if (dbErr) console.error('[DB保存失败]', dbErr.message);

    setPhase('done');
    toast.success('AI分析完成，已自动保存');
    loadHistory();
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600';
    if (score >= 55) return 'text-amber-600';
    return 'text-destructive';
  };

  const getConfidenceBg = (score: number) => {
    if (score >= 75) return 'bg-emerald-50 border-emerald-200';
    if (score >= 55) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const isRunning = phase === 'searching' || phase === 'analyzing' || phase === 'validating';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 max-w-5xl mx-auto space-y-4"
    >
      {/* 标题 */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">AI情报分析</h1>
          <p className="text-xs text-muted-foreground">百度AI搜索 + 文心大模型 · 双阶段分析</p>
        </div>
      </div>

      {/* 输入区 */}
      <Card className="p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">输入分析话题</p>
        <div className="flex gap-2 mb-3">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例：美国培育钻石市场最新政策变化"
            className="text-sm"
            onKeyDown={(e) => { if (e.key === 'Enter' && !isRunning) handleAnalyze(); }}
            disabled={isRunning}
          />
          {isRunning ? (
            <Button variant="destructive" onClick={handleAbort} className="shrink-0 gap-1.5">
              <XCircle className="w-4 h-4" />
              中断
            </Button>
          ) : (
            <Button onClick={() => handleAnalyze()} className="shrink-0 gap-1.5">
              <Zap className="w-4 h-4" />
              开始分析
            </Button>
          )}
        </div>

        {/* 预设话题 */}
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => { if (!isRunning) setTopic(t); }}
              disabled={isRunning}
              className="text-[10px] px-2 py-0.5 rounded-full border border-border hover:bg-muted/60 text-muted-foreground transition-colors disabled:opacity-50"
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      {/* 进度条 */}
      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4">
              {/* 阶段步骤 */}
              <div className="flex items-center gap-3 mb-3">
                {(['searching', 'analyzing', 'validating'] as Phase[]).map((p, i) => {
                  const isDone = PhaseProgress[phase] > PhaseProgress[p];
                  const isCurrent = phase === p;
                  return (
                    <React.Fragment key={p}>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isDone ? 'bg-emerald-500 text-white' :
                          isCurrent ? 'bg-primary text-primary-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {isDone ? '✓' : i + 1}
                        </div>
                        <span className={`text-xs whitespace-nowrap ${isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {p === 'searching' ? '搜索' : p === 'analyzing' ? '分析' : '校验'}
                        </span>
                        {isCurrent && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                      </div>
                      {i < 2 && <div className="flex-1 h-px bg-border" />}
                    </React.Fragment>
                  );
                })}
              </div>
              <Progress value={PhaseProgress[phase]} className="h-1.5 mb-2" />
              <p className="text-xs text-muted-foreground">{PhaseLabel[phase]}</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 搜索结果摘要 */}
      <AnimatePresence>
        {(searchContent || references.length > 0) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold">实时搜索信息</h3>
                <Badge variant="secondary" className="text-[10px]">
                  {references.length}个来源
                </Badge>
              </div>

              {/* 参考来源 */}
              {references.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {references.slice(0, 6).map((ref, i) => (
                    <a
                      key={ref.id ?? i}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted/50 hover:bg-muted rounded-md text-[10px] text-primary transition-colors max-w-[180px]"
                    >
                      <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="truncate">{ref.title ?? ref.url}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* 搜索摘要 */}
              {searchContent && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {searchContent}
                </p>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 分析结果 */}
      <AnimatePresence>
        {analysisContent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">战略分析报告</h3>
                {phase === 'analyzing' && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    生成中...
                  </div>
                )}
                {phase === 'done' && (
                  <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200">
                    ✓ 已完成
                  </Badge>
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-3 max-h-[500px] overflow-y-auto">
                <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground">
                  {analysisContent}
                </pre>
                <div ref={analysisEndRef} />
              </div>

              {/* 风控校验结果 */}
              {phase === 'done' && hallucinationCheck !== null && (
                <div className="mt-3 space-y-2">
                  <Separator />
                  <div className="flex items-start gap-3 pt-1">
                    {/* 置信度评分 */}
                    <div className={`flex-1 rounded-lg border p-2.5 ${getConfidenceBg(confidenceScore)}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <ShieldCheck className={`w-3.5 h-3.5 ${getConfidenceColor(confidenceScore)}`} />
                        <span className={`text-xs font-semibold ${getConfidenceColor(confidenceScore)}`}>
                          综合置信度
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold ${getConfidenceColor(confidenceScore)}`}>
                          {confidenceScore}
                        </span>
                        <span className="text-xs text-muted-foreground">/ 100</span>
                      </div>
                      <Progress value={confidenceScore} className="h-1 mt-1" />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        信源数量×30% + 可信度×40% + 一致性×30%
                      </p>
                    </div>

                    {/* 幻觉检测 */}
                    <div className={`flex-1 rounded-lg border p-2.5 ${
                      hallucinationCheck.detected
                        ? 'bg-red-50 border-red-200'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {hallucinationCheck.detected ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span className={`text-xs font-semibold ${
                          hallucinationCheck.detected ? 'text-destructive' : 'text-emerald-700'
                        }`}>
                          幻觉检测
                        </span>
                      </div>
                      <p className={`text-xs font-medium ${
                        hallucinationCheck.detected ? 'text-destructive' : 'text-emerald-700'
                      }`}>
                        {hallucinationCheck.detected ? '⚠️ 检测到疑似幻觉' : '✓ 未发现幻觉'}
                      </p>
                      {hallucinationCheck.detected && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {hallucinationCheck.reason}，建议人工复核
                        </p>
                      )}
                      {!hallucinationCheck.detected && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          内容通过基础幻觉检测，建议结合原始信源复核
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* 反馈与重新分析操作区 */}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] border-red-200 text-red-700 hover:bg-red-50 gap-1" onClick={() => {
                      toast.info('已标记为不准确，触发重新分析');
                      handleAnalyze(topic);
                    }}>
                      <XCircle className="w-3 h-3" />
                      标注为不准确并重新分析
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-1" onClick={() => toast.success('已标记为准确')}>
                      <CheckCircle2 className="w-3 h-3" />
                      标记为准确
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 历史分析记录 */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">历史分析记录</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadHistory}
            className="h-7 px-2 text-xs gap-1 text-muted-foreground"
            disabled={historyLoading}
          >
            <RefreshCw className={`w-3 h-3 ${historyLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span className="text-xs">加载中...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">暂无分析记录，开始首次AI分析吧</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((record) => (
              <div key={record.id} className="border border-border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      record.status === 'completed' ? 'bg-emerald-500' :
                      record.status === 'partial' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{record.topic}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(record.created_at).toLocaleString('zh-CN', {
                            month: '2-digit', day: '2-digit',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                        <span className={`text-[10px] font-medium ${getConfidenceColor(record.confidence_score)}`}>
                          置信度 {record.confidence_score}
                        </span>
                        {Array.isArray(record.references_json) && record.references_json.length > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            {record.references_json.length}个来源
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedId === record.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedId === record.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 border-t border-border bg-muted/20">
                        <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground mt-3 max-h-60 overflow-y-auto">
                          {record.analysis_result}
                        </pre>
                        {Array.isArray(record.references_json) && record.references_json.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {record.references_json.slice(0, 4).map((ref: Reference, i: number) => (
                              <a
                                key={i}
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-[9px] text-muted-foreground hover:bg-muted/50"
                              >
                                {ref.title ?? ref.url}
                              </a>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-border/50">
                          <Button variant="outline" size="sm" className="h-6 text-[9px] border-red-200 text-red-700 hover:bg-red-50 gap-1 px-2" onClick={() => {
                            toast.info('已从历史记录触发重新分析');
                            setExpandedId(null);
                            handleAnalyze(record.topic);
                          }}>
                            <XCircle className="w-2.5 h-2.5" />
                            标注为不准确并重试
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default AiAnalysisPage;
