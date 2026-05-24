import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ConfidenceBadge from '@/components/common/ConfidenceBadge';
import MarketBadge from '@/components/common/MarketBadge';
import { mockEvents } from '@/data/mockData';
import { useSystemContext } from '@/contexts/SystemContext';
import type { IntelligenceEvent } from '@/types/intelligence';
import { toast } from 'sonner';
import {
  UserCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  MessageSquare,
  Clock,
  ShieldAlert,
  Power,
  RotateCcw,
} from 'lucide-react';

type ReviewAction = 'confirmed' | 'questioned' | 'ignored';

interface ReviewRecord {
  eventId: string;
  action: ReviewAction;
  comment: string;
  time: string;
}

const ReviewPage: React.FC = () => {
  const { isCircuitBreakerOpen, errorRate, toggleCircuitBreaker } = useSystemContext();
  const [events, setEvents] = useState<IntelligenceEvent[]>(mockEvents);
  const [reviews, setReviews] = useState<ReviewRecord[]>([
    {
      eventId: 'evt-001',
      action: 'confirmed',
      comment: '信息核实无误，总部已同意应对方案。',
      time: '2026-05-23T08:30:00Z',
    },
    {
      eventId: 'evt-005',
      action: 'questioned',
      comment: '信源仅有Instagram帖子，要求本地团队实地拍照核实后再定。',
      time: '2026-05-23T09:15:00Z',
    }
  ]);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const pendingEvents = events.filter((e) => e.reviewStatus === 'pending');
  const reviewedEvents = events.filter((e) => e.reviewStatus !== 'pending');

  const handleTakeover = () => {
    toast.success(isCircuitBreakerOpen ? '已恢复自动发布' : '已切换为全人工接管模式，AI停止自动发布');
    toggleCircuitBreaker();
  };

  const handleRollback = () => {
    toast.info('已触发回滚，系统正调用更低温度的LLM进行重新生成');
  };

  const handleReview = (eventId: string, action: ReviewAction) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, reviewStatus: action, reviewComment: comment, reviewedAt: new Date().toISOString() }
          : e
      )
    );
    setReviews((prev) => [
      {
        eventId,
        action,
        comment: comment || (action === 'confirmed' ? '信息核实无误' : action === 'questioned' ? '存在疑问，需进一步验证' : '暂不处理'),
        time: new Date().toISOString(),
      },
      ...prev,
    ]);
    setActiveEvent(null);
    setComment('');
    
    if (action === 'questioned') {
      toast.info('已将事件标记为疑问，触发人工跟进工单');
    } else {
      toast.success('复核操作已完成');
    }
  };

  const actionConfig: Record<ReviewAction, { icon: React.ElementType; label: string; color: string }> = {
    confirmed: { icon: CheckCircle, label: '已确认', color: 'text-emerald-600' },
    questioned: { icon: HelpCircle, label: '有质疑', color: 'text-amber-600' },
    ignored: { icon: XCircle, label: '忽略', color: 'text-slate-500' },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">人工复核与风控接管</h1>
          {pendingEvents.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {pendingEvents.length} 待复核
            </Badge>
          )}
        </div>
        
        {/* 熔断器接管面板 */}
        {isCircuitBreakerOpen && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center gap-4 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-1.5 text-destructive">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-bold">系统已熔断 (错误率{errorRate}%)</span>
            </div>
            <Button size="sm" variant="destructive" className="h-7 text-[10px] gap-1 px-2" onClick={handleTakeover}>
              <Power className="w-3 h-3" /> 解除熔断 (恢复自动发布)
            </Button>
          </div>
        )}
      </div>

      {/* 待复核列表 */}
      {pendingEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-500" />
            待复核事件
          </h2>
          <div className="space-y-3">
            {pendingEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    {event.riskFlags.hallucinationRisk && (
                      <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-medium text-foreground">{event.title}</h3>
                        <ConfidenceBadge level={event.confidence} score={event.confidenceScore} size="sm" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {event.markets.map((m) => (
                          <MarketBadge key={m} region={m} size="sm" />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{event.description}</p>

                      <AnimatePresence>
                        {activeEvent === event.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3"
                          >
                            <Textarea
                              placeholder="请输入复核意见（可选）"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="text-xs min-h-[60px]"
                            />
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="sm"
                                className="h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => handleReview(event.id, 'confirmed')}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                确认无误
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                                onClick={() => handleReview(event.id, 'questioned')}
                              >
                                <HelpCircle className="w-3.5 h-3.5" />
                                提出质疑
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs gap-1 border-slate-300 hover:bg-slate-50"
                                onClick={() => handleReview(event.id, 'ignored')}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                忽略
                              </Button>
                              {/* 回滚操作 */}
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 text-xs gap-1 ml-auto"
                                onClick={handleRollback}
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                触发降级回滚
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {activeEvent !== event.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs mt-3"
                          onClick={() => setActiveEvent(event.id)}
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1" />
                          开始复核
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 已复核记录 */}
      {reviews.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            复核记录
          </h2>
          <div className="space-y-2">
            {reviews.map((review, i) => {
              const event = events.find((e) => e.id === review.eventId);
              if (!event) return null;
              const config = actionConfig[review.action];
              const Icon = config.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${config.color}`} />
                          <span className={`text-xs font-medium ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(review.time).toLocaleString('zh-CN')}
                          </span>
                        </div>
                        <p className="text-xs text-foreground mt-1">{event.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {pendingEvents.length === 0 && reviews.length === 0 && (
        <Card className="p-8 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">所有事件已完成复核</p>
        </Card>
      )}
    </motion.div>
  );
};

export default ReviewPage;
