import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { mockEvents, mockSystemStatus } from '@/data/mockData';
import { useSystemContext } from '@/contexts/SystemContext';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  Bot,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConfidencePage: React.FC = () => {
  const navigate = useNavigate();
  const { errorRate, isCircuitBreakerOpen, toggleCircuitBreaker } = useSystemContext();
  const confirmed = mockEvents.filter((e) => e.confidence === 'confirmed').length;
  const speculated = mockEvents.filter((e) => e.confidence === 'speculated').length;
  const rumor = mockEvents.filter((e) => e.confidence === 'rumor').length;

  const confidenceData = [
    { name: '已确认', value: confirmed, color: '#10b981' },
    { name: '推测', value: speculated, color: '#f59e0b' },
    { name: '传闻', value: rumor, color: '#ef4444' },
  ];

  const sourceData = mockEvents.map((e) => ({
    name: e.title.length > 10 ? e.title.slice(0, 10) + '...' : e.title,
    sources: e.sources.length,
    reliability: Math.round(e.sources.reduce((s, src) => s + src.reliability, 0) / e.sources.length),
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-4 max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">置信度仪表盘</h1>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{confirmed}</p>
              <p className="text-xs text-muted-foreground">已确认事件（多源印证）</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{speculated}</p>
              <p className="text-xs text-muted-foreground">推测事件（待确认）</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{rumor}</p>
              <p className="text-xs text-muted-foreground">传闻事件（已拦截）</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 错误率监控 */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-primary" />
          错误率监控
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">今日错误率</span>
              <span className={`text-sm font-bold ${errorRate > 20 ? 'text-red-600' : 'text-emerald-600'}`}>
                {errorRate}%
              </span>
            </div>
            <Progress value={errorRate} max={50} className="h-2" />
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">0%</span>
              <span className="text-[10px] text-red-500 font-medium">熔断阈值 20%</span>
              <span className="text-[10px] text-muted-foreground">50%</span>
            </div>
          </div>
          <div className="shrink-0">
            {isCircuitBreakerOpen ? (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                已触发熔断
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <ShieldCheck className="w-3 h-3 mr-1" />
                正常运行
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* 熔断器状态面板 */}
      <Card className="p-4 bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            熔断器状态与风控日志
          </h2>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => navigate('/risk-log')}>
            查看历史错误
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 bg-background border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isCircuitBreakerOpen ? 'bg-destructive animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-sm font-medium">当前状态：{isCircuitBreakerOpen ? '已触发熔断 (人工接管)' : '正常运行 (自动执行)'}</span>
            </div>
            {isCircuitBreakerOpen ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                  触发原因：单日错误率达到 {errorRate}% (≥20%)
                </span>
                <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={toggleCircuitBreaker}>解除熔断</Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={toggleCircuitBreaker}>模拟触发熔断</Button>
            )}
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">最近熔断记录</h3>
            <div className="space-y-2">
              <div className="text-xs flex items-center justify-between p-2 bg-background border border-border rounded">
                <span className="text-muted-foreground">2026-05-18 14:30:00</span>
                <span>单日幻觉率突增至 22%</span>
                <span className="text-amber-600">持续 2小时15分</span>
              </div>
              <div className="text-xs flex items-center justify-between p-2 bg-background border border-border rounded">
                <span className="text-muted-foreground">2026-04-20 09:15:00</span>
                <span>上游API接口大面积超时</span>
                <span className="text-amber-600">持续 45分钟</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 置信度分布饼图 */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-3">置信度分层统计</h2>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 多源印证柱状图 */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-3">事件信源数量与平均可信度</h2>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="sources" name="信源数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Agent风控日志 */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Bot className="w-4 h-4 text-primary" />
          Validator Agent 风控日志
        </h2>
        <div className="space-y-2">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{event.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {event.sources.length} 个信源
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    平均可信度 {Math.round(event.sources.reduce((s, src) => s + src.reliability, 0) / event.sources.length)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {event.riskFlags.singleSource && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                    单源
                  </span>
                )}
                {event.riskFlags.hallucinationRisk && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-700 rounded border border-red-200">
                    幻觉风险
                  </span>
                )}
                {!event.riskFlags.singleSource && !event.riskFlags.hallucinationRisk && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                    通过
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default ConfidencePage;
