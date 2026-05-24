/**
 * 风控日志页面
 * 展示Validator校验记录、推理链、幻觉检测结果
 * 支持多源评分算法可视化
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Brain,
  GitBranch,
  Activity,
  Filter,
} from 'lucide-react';

const mockErrorStats = {
  dailyRates: [
    { date: '05-18', rate: 12 },
    { date: '05-19', rate: 15 },
    { date: '05-20', rate: 8 },
    { date: '05-21', rate: 5 },
    { date: '05-22', rate: 22 }, // 熔断日
    { date: '05-23', rate: 14 },
  ],
  types: [
    { name: '幻觉/虚假数据', value: 45, color: '#ef4444' },
    { name: '信源冲突', value: 25, color: '#f59e0b' },
    { name: '逻辑矛盾', value: 20, color: '#3b82f6' },
    { name: 'API超时降级', value: 10, color: '#8b5cf6' },
  ]
};

const mockDowngradeEvents = [
  {
    id: 'dg-001',
    time: '2026-05-23T10:15:00+08:00',
    reason: '大模型API响应超时(>30s)',
    strategy: '返回上一次缓存结果并标记为「降级内容」',
    content: '韩国市场某竞品新动作分析（缓存于12小时前）'
  },
  {
    id: 'dg-002',
    time: '2026-05-22T14:22:00+08:00',
    reason: 'Validator检测到高危幻觉(伪造数据)',
    strategy: '系统自动降低置信度至30分，添加警告标签并拦截发布',
    content: '关于欧盟即将出台钻石碳排放税的预测分析'
  }
];

// Mock 风控日志数据（真实场景由Validator Agent写入数据库）
const mockRiskLogs = [
  {
    id: 'rl-001',
    event_title: '日本培育钻石竞品降价30%事件',
    check_result: 'passed',
    source_count: 3,
    confidence_score: 92,
    reasoning_chain: `[输入] 来源数量: 3个独立信源（乐天商品页 + Twitter/X + 日经MJ）
[步骤1] 检查信源独立性：3个信源来源渠道各异，互为独立 → 通过
[步骤2] 检查信息一致性：三方均描述价格下调幅度为30% → 一致性高
[步骤3] 幻觉检测：无绝对化表述，无异常数据 → 通过
[步骤4] 时效性校验：最近信源距今<24h → 通过
[步骤5] 综合评分：(3/8×30) + (90×0.40) + (90×0.30) = 11.25+36+27 = 74.25 → 调整至92（知名信源权重加成）
[结论] 通过校验，标记为🟢已确认`,
    hallucination_type: null,
    created_at: '2026-05-23T06:38:00+08:00',
  },
  {
    id: 'rl-002',
    event_title: '美国FTC拟对培育钻石标注要求升级为法规',
    check_result: 'warning',
    source_count: 1,
    confidence_score: 58,
    reasoning_chain: `[输入] 来源数量: 1个信源（某行业博客）
[步骤1] 检查信源独立性：仅1个信源，无法交叉验证 → 警告
[步骤2] 检查信息一致性：无法对比 → 不适用
[步骤3] 幻觉检测：内容包含"确定将于2026年Q3生效"等确定性表述，但未查到官方文件 → 疑似幻觉
[步骤4] 时效性校验：信息发布时间较新 → 通过
[步骤5] 综合评分：(1/8×30) + (70×0.40) + (50×0.30) = 3.75+28+15 = 46.75 → 调整至58（发布平台权重）
[结论] 标记为⚠️警告，降级为🟡推测，建议补充官方信源`,
    hallucination_type: '过度确定性表述',
    created_at: '2026-05-23T06:35:00+08:00',
  },
  {
    id: 'rl-003',
    event_title: '东南亚Shopee平台疑似封禁培育钻石品类',
    check_result: 'blocked',
    source_count: 1,
    confidence_score: 28,
    reasoning_chain: `[输入] 来源数量: 1个信源（匿名论坛帖子）
[步骤1] 检查信源独立性：匿名来源，无法验证 → 不通过
[步骤2] 检查信息一致性：无法对比 → 不适用
[步骤3] 幻觉检测：检测到"Shopee将100%下架所有培育钻石产品"等绝对化表述 → 触发幻觉拦截
[步骤4] 时效性校验：帖子时间与声称事件时间相差72小时 → 警告
[步骤5] 综合评分：(1/8×30) + (30×0.40) + (20×0.30) = 3.75+12+6 = 21.75 → 调整至28（匿名信源惩罚）
[结论] ❌ 已拦截，标记为🔴传闻，转入人工复核队列
拦截原因：单一匿名信源 + 幻觉检测触发（绝对化表述）`,
    hallucination_type: '绝对化用词',
    created_at: '2026-05-23T06:32:00+08:00',
  },
  {
    id: 'rl-004',
    event_title: '韩国MZ世代培育钻石消费意愿调研',
    check_result: 'passed',
    source_count: 2,
    confidence_score: 78,
    reasoning_chain: `[输入] 来源数量: 2个独立信源（韩国消费者院官方报告 + 小红书韩国用户数据）
[步骤1] 检查信源独立性：2个信源渠道不同，均可追溯 → 通过
[步骤2] 检查信息一致性：数据略有差异（68% vs 72%），属正常调研误差范围 → 通过
[步骤3] 幻觉检测：无绝对化表述 → 通过
[步骤4] 时效性校验：距发布时间3天内 → 通过
[步骤5] 综合评分：(2/8×30) + (85×0.40) + (80×0.30) = 7.5+34+24 = 65.5 → 调整至78（官方机构加成）
[结论] 通过校验，标记为🟢已确认`,
    hallucination_type: null,
    created_at: '2026-05-23T06:30:00+08:00',
  },
];

// 多源评分算法说明
const SCORING_ALGORITHM = {
  title: '多源置信度评分算法 v2.1',
  formula: 'score = (信源数量/8×30%) + (可信度×40%) + (一致性×30%)',
  rules: [
    { label: '信源数量', weight: '30%', rule: '≥3个独立信源满分，按比例计算' },
    { label: '可信度评估', weight: '40%', rule: '官方机构=95分，知名媒体=85分，行业博客=70分，匿名来源=30分' },
    { label: '信息一致性', weight: '30%', rule: '完全一致=90分，误差<10%=75分，存在矛盾=50分，无法验证=50分' },
    { label: '加成/惩罚', weight: '±调整', rule: '知名信源+5~15分，匿名信源-10~20分，绝对化表述-15~25分' },
  ],
};

type CheckResult = 'passed' | 'blocked' | 'warning' | 'all';

const RiskLogPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CheckResult>('all');

  const filtered = filter === 'all'
    ? mockRiskLogs
    : mockRiskLogs.filter((l) => l.check_result === filter);

  const stats = {
    passed: mockRiskLogs.filter((l) => l.check_result === 'passed').length,
    warning: mockRiskLogs.filter((l) => l.check_result === 'warning').length,
    blocked: mockRiskLogs.filter((l) => l.check_result === 'blocked').length,
  };

  const resultConfig = {
    passed: { label: '通过', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    warning: { label: '警告', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    blocked: { label: '已拦截', icon: XCircle, color: 'text-destructive', bg: 'bg-red-50 border-red-200' },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 max-w-5xl mx-auto space-y-4"
    >
      {/* 标题 */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold">风控日志</h1>
          <p className="text-xs text-muted-foreground">Validator Agent 校验记录 · 推理链 · 幻觉检测</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '通过', count: stats.passed, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 },
          { label: '警告', count: stats.warning, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle },
          { label: '已拦截', count: stats.blocked, color: 'text-destructive', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
        ].map((s) => (
          <Card key={s.label} className={`p-3 ${s.bg} ${s.border} border`}>
            <div className="flex items-center gap-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs font-medium text-foreground">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.count}</p>
          </Card>
        ))}
      </div>

      {/* 多源评分算法说明 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">{SCORING_ALGORITHM.title}</h2>
        </div>
        <div className="bg-muted/40 rounded-lg p-3 mb-3">
          <code className="text-xs font-mono text-foreground">{SCORING_ALGORITHM.formula}</code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SCORING_ALGORITHM.rules.map((r) => (
            <div key={r.label} className="flex items-start gap-2 p-2 rounded-lg border border-border bg-card">
              <Badge variant="secondary" className="text-[9px] shrink-0 mt-0.5">{r.weight}</Badge>
              <div>
                <p className="text-xs font-medium">{r.label}</p>
                <p className="text-[10px] text-muted-foreground">{r.rule}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 历史错误统计 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-destructive" />
          <h2 className="text-sm font-semibold">历史错误统计</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[200px]">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 text-center">按日期统计错误率 (%)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockErrorStats.dailyRates} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#333' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[200px]">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 text-center">错误类型分布</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockErrorStats.types}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  style={{ fontSize: '10px' }}
                >
                  {mockErrorStats.types.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* 降级事件记录 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold">降级事件记录</h2>
        </div>
        <div className="space-y-3">
          {mockDowngradeEvents.map((evt) => (
            <div key={evt.id} className="p-3 bg-background border border-border rounded-lg">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">降级触发</Badge>
                  <span className="text-[10px] text-muted-foreground">{new Date(evt.time).toLocaleString('zh-CN')}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <p><span className="text-muted-foreground inline-block w-16">降级内容：</span><span className="font-medium text-foreground">{evt.content}</span></p>
                <p><span className="text-muted-foreground inline-block w-16">降级原因：</span><span className="text-destructive">{evt.reason}</span></p>
                <p><span className="text-muted-foreground inline-block w-16">执行策略：</span><span className="text-emerald-600">{evt.strategy}</span></p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 筛选器 */}
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">筛选：</span>
        {(['all', 'passed', 'warning', 'blocked'] as CheckResult[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {f === 'all' ? '全部' : f === 'passed' ? '通过' : f === 'warning' ? '警告' : '已拦截'}
          </button>
        ))}
      </div>

      {/* 校验记录列表 */}
      <div className="space-y-3">
        {filtered.map((log) => {
          const cfg = resultConfig[log.check_result as keyof typeof resultConfig];
          const Icon = cfg.icon;
          return (
            <Card key={log.id} className="overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`mt-0.5 flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${cfg.bg} border ${cfg.bg.replace('bg-', 'border-')}`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{log.event_title}</p>
                      <Badge className={`text-[9px] shrink-0 ${cfg.bg} ${cfg.color} border`}>
                        {cfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(log.created_at).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {log.source_count}个信源
                      </span>
                      <span className={`text-[10px] font-medium ${
                        log.confidence_score >= 75 ? 'text-emerald-600' :
                        log.confidence_score >= 55 ? 'text-amber-600' : 'text-destructive'
                      }`}>
                        置信度 {log.confidence_score}
                      </span>
                      {log.hallucination_type && (
                        <Badge className="text-[9px] bg-red-50 text-destructive border-red-200 border">
                          幻觉: {log.hallucination_type}
                        </Badge>
                      )}
                    </div>
                    <Progress value={log.confidence_score} className="h-1 mt-2 max-w-[200px]" />
                  </div>
                </div>
                {expandedId === log.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                )}
              </button>

              {expandedId === log.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <Separator />
                  <div className="p-4 bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground">Validator推理链</span>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-3">
                      <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-mono text-foreground">
                        {log.reasoning_chain}
                      </pre>
                    </div>
                    {log.hallucination_type && (
                      <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-200">
                        <Brain className="w-3.5 h-3.5 text-destructive" />
                        <div>
                          <span className="text-xs font-medium text-destructive">幻觉类型：{log.hallucination_type}</span>
                          <p className="text-[10px] text-muted-foreground">
                            Validator已自动拦截，该内容已转入人工复核队列
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RiskLogPage;
