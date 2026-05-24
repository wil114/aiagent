import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ConfidenceBadge from '@/components/common/ConfidenceBadge';
import MarketBadge from '@/components/common/MarketBadge';
import SourceLink from '@/components/common/SourceLink';
import ImpactChain from '@/components/common/ImpactChain';
import {
  mockEvents,
} from '@/data/mockData';
import type { IntelligenceEvent } from '@/types/intelligence';
import {
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Globe,
  Clock,
  ShieldAlert,
  Bot,
  RotateCcw,
  History,
  Check,
  MessageSquare,
  X,
  TrendingUp,
} from 'lucide-react';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRiskDemo, setShowRiskDemo] = useState(false);
  const [actionStates, setActionStates] = useState<Record<number, string>>({});
  
  // 模拟版本历史
  const [versions, setVersions] = useState([
    { id: 'v2', time: new Date().toISOString(), desc: '增加日本竞品分析', active: true },
    { id: 'v1', time: new Date(Date.now() - 3600000).toISOString(), desc: '初始版本', active: false }
  ]);

  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">事件未找到</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
          返回首页
        </Button>
      </div>
    );
  }

  const handleActionMark = (index: number, status: string) => {
    setActionStates(prev => ({ ...prev, [index]: status }));
    toast.success(`行动建议已标记为：${status}`);
  };

  const handleRollback = (versionId: string) => {
    setVersions(prev => prev.map(v => ({ ...v, active: v.id === versionId })));
    toast.info(`已回滚至版本 ${versionId}，页面数据已刷新`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-4 max-w-5xl mx-auto"
    >
      {/* 返回 + 标题 */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1">
          <ArrowLeft className="w-4 h-4" />
          返回简报
        </Button>
      </div>

      {/* 事件头部 */}
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {event.markets.map((m) => (
                <MarketBadge key={m} region={m} />
              ))}
              <ConfidenceBadge level={event.confidence} score={event.confidenceScore} showScore />
            </div>
            <h1 className="text-lg font-bold text-foreground leading-snug">{event.title}</h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{event.description}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* 风控标记 */}
        <div className="flex items-center gap-2 flex-wrap">
          {event.riskFlags.singleSource && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              单源信息
            </Badge>
          )}
          {event.riskFlags.hallucinationRisk && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
              <ShieldAlert className="w-3 h-3 mr-1" />
              幻觉风险
            </Badge>
          )}
          {event.riskFlags.conflictDetected && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
              <XCircle className="w-3 h-3 mr-1" />
              信息冲突
            </Badge>
          )}
          {event.riskFlags.timeoutFallback && (
            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              超时降级
            </Badge>
          )}
          {!event.riskFlags.singleSource && !event.riskFlags.hallucinationRisk && (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              通过校验
            </Badge>
          )}
        </div>
      </Card>

      {/* 多源信息对比 */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <ExternalLink className="w-4 h-4 text-primary" />
          多源信息对比
          <span className="text-[10px] text-muted-foreground font-normal">
            ({event.sources.length} 个独立信源)
          </span>
        </h2>
        <div className="space-y-3">
          {event.sources.map((source, i) => (
            <div
              key={source.id}
              className="p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{source.name}</span>
                    <Badge variant="outline" className="text-[10px] h-5">
                      可信度 {source.reliability}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{source.summary}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-muted-foreground">
                      发布时间: {new Date(source.publishTime).toLocaleString('zh-CN')}
                    </span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                    >
                      查看原始来源
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 人话解释 */}
      <Card className="p-5 bg-gradient-to-r from-amber-50/50 to-transparent border-amber-200/50">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-2">
          <Bot className="w-4 h-4 text-amber-600" />
          Agent为什么这么判断？
        </h2>
        <p className="text-sm text-foreground leading-relaxed">{event.plainExplanation}</p>
      </Card>

      {/* L2 洞察层 */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-primary" />
          洞察层分析（L2）
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-[10px] text-muted-foreground mb-1">什么变了</p>
            <p className="text-xs font-medium text-foreground">{event.changes.whatChanged}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-[10px] text-muted-foreground mb-1">和谁比变了</p>
            <p className="text-xs font-medium text-foreground">{event.changes.comparedTo}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-[10px] text-muted-foreground mb-1">变化速度</p>
            <p className="text-xs font-medium text-foreground">{event.changes.changeSpeed}</p>
          </div>
        </div>
      </Card>

      {/* L3 跨市场分析 */}
      {event.crossMarketAnalysis && (
        <Card className="p-5">
          <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-blue-600" />
            跨市场机会时差雷达（L3）
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">领先市场:</span>
                <MarketBadge region={event.crossMarketAnalysis.leadingMarket} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">滞后市场:</span>
                <div className="flex gap-1">
                  {event.crossMarketAnalysis.laggingMarkets.map((m) => (
                    <MarketBadge key={m} region={m} size="sm" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">窗口期:</span>
                <span className="text-xs font-medium text-foreground">
                  {event.crossMarketAnalysis.windowPeriod}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-[10px] text-blue-600 font-medium mb-1">机会分析</p>
              <p className="text-xs text-blue-800 leading-relaxed">
                {event.crossMarketAnalysis.opportunity}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 影响链推演 */}
      <ImpactChain steps={event.impactChain} />

      {/* 行动建议 (三级分发) */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          战略与执行行动分发
        </h2>
        <div className="space-y-3">
          {event.actionSuggestions.map((action, i) => {
            const getLevelColors = (level: string) => {
              if (level === 'hq') return 'bg-destructive/10 text-destructive border-destructive/20';
              if (level === 'regional') return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
              return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            };
            return (
              <div
                key={action.id}
                className="flex flex-col md:flex-row md:items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors bg-card"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`text-[10px] ${getLevelColors(action.level)}`}>
                      {action.levelLabel}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      优先级: P{action.priority}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mb-1.5">{action.text}</p>
                  
                  {action.expectedOutcome && (
                    <div className="text-[11px] bg-muted/30 p-2 rounded border border-border/50 text-muted-foreground mb-2 flex items-start gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-primary/70 shrink-0 mt-0.5" />
                      <span><strong className="font-medium text-foreground/80">预期成果:</strong> {action.expectedOutcome}</span>
                    </div>
                  )}

                  {action.deadline && (
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      建议截止日期: {new Date(action.deadline).toLocaleDateString('zh-CN')}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-row md:flex-col gap-2 shrink-0 md:w-24 mt-2 md:mt-0">
                  {actionStates[i] ? (
                    <Badge variant={actionStates[i] === '已派发' ? 'default' : actionStates[i] === '讨论中' ? 'secondary' : 'outline'} className="text-xs shrink-0 self-start md:w-full md:justify-center">
                      {actionStates[i]}
                    </Badge>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] md:text-xs gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 w-full" onClick={() => handleActionMark(i, '已派发')}>
                        <Check className="w-3 h-3" />已派发
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] md:text-xs gap-1 border-amber-200 text-amber-700 hover:bg-amber-50 w-full" onClick={() => handleActionMark(i, '讨论中')}>
                        <MessageSquare className="w-3 h-3" />讨论中
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] md:text-xs gap-1 border-slate-200 text-slate-700 hover:bg-slate-50 w-full" onClick={() => handleActionMark(i, '暂缓')}>
                        <X className="w-3 h-3" />暂缓
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 版本历史 */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-primary" />
          版本历史
        </h2>
        <div className="space-y-3">
          {versions.map((v) => (
            <div key={v.id} className={`flex items-center justify-between p-3 rounded-lg border ${v.active ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'}`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{v.id}</span>
                  {v.active && <Badge className="h-5 text-[10px] px-1.5">当前版本</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{new Date(v.time).toLocaleString('zh-CN')}</span>
                  <span className="text-xs text-foreground">{v.desc}</span>
                </div>
              </div>
              {!v.active && (
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => handleRollback(v.id)}>
                  <RotateCcw className="w-3 h-3" />
                  回滚至此版本
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 风控演示按钮（仅针对低置信度事件） */}
      {event.confidence === 'rumor' && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-semibold text-red-700">Validator Agent 拦截演示</h3>
          </div>
          <p className="text-xs text-red-600 mb-3">
            此事件被Validator标记为"🔴传闻·单源·待核实"，未进入正式简报。
            点击下方按钮查看Validator的完整风控判断过程。
          </p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-red-300 text-red-700 hover:bg-red-100"
            onClick={() => setShowRiskDemo(true)}
          >
            查看风控拦截详情
          </Button>
        </div>
      )}

      {/* 风控演示弹窗 */}
      <Dialog open={showRiskDemo} onOpenChange={setShowRiskDemo}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              Validator Agent 风控拦截报告
            </DialogTitle>
            <DialogDescription>
              事件 ID: {event.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm font-medium text-red-700">拦截原因</p>
              <ul className="text-xs text-red-600 mt-1 space-y-1">
                <li>• 仅1个独立信源（Instagram用户发帖），未达到≥2个信源门槛</li>
                <li>• 信源可靠性评分仅50%，低于Validator阈值（70%）</li>
                <li>• 内容存在幻觉风险：无法排除品牌营销行为</li>
                <li>• 无权威媒体或行业平台交叉验证</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-sm font-medium text-amber-700">Validator决策链</p>
              <ol className="text-xs text-amber-700 mt-1 space-y-1">
                <li>1. fact_check: 仅发现1个信源，触发单源警报</li>
                <li>2. hallucination_guard: 内容包含推测性描述，标记待核实</li>
                <li>3. confidence_score: 综合评分45分，低于发布阈值（60分）</li>
                <li>4. 结论: 拦截进入简报，转入人工复核队列</li>
              </ol>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-700">
                <strong>建议:</strong> 安排韩国本地团队实地走访验证，或等待权威媒体跟进报道后再做决策。
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EventDetail;
