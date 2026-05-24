import React from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConfidenceBadge from '@/components/common/ConfidenceBadge';
import MarketBadge from '@/components/common/MarketBadge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { IntelligenceEvent } from '@/types/intelligence';
import {
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Shield,
  MessageCircle,
  Lightbulb,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventListProps {
  events: IntelligenceEvent[];
}

const categoryIcons: Record<string, React.ElementType> = {
  competitor: TrendingUp,
  regulation: Shield,
  social: MessageCircle,
  platform: AlertCircle,
  supply_chain: ArrowRight,
  pricing: TrendingUp,
};

const categoryLabels: Record<string, string> = {
  competitor: '竞品动态',
  regulation: '法规变化',
  social: '社媒热点',
  platform: '平台政策',
  supply_chain: '供应链',
  pricing: '价格变动',
};

const urgencyConfig: Record<string, { color: string; label: string }> = {
  critical: { color: 'text-red-600 bg-red-50 border-red-200', label: '紧急' },
  high: { color: 'text-orange-600 bg-orange-50 border-orange-200', label: '重要' },
  medium: { color: 'text-amber-600 bg-amber-50 border-amber-200', label: '一般' },
  low: { color: 'text-slate-600 bg-slate-50 border-slate-200', label: '低' },
};

const EventList: React.FC<EventListProps> = ({ events }) => {
  const navigate = useNavigate();

  // 按优先级排序: 紧急度 * 影响度
  const sorted = [...events].sort((a, b) => {
    const scoreA = (a.urgency === 'critical' ? 4 : a.urgency === 'high' ? 3 : a.urgency === 'medium' ? 2 : 1) * a.impactScore;
    const scoreB = (b.urgency === 'critical' ? 4 : b.urgency === 'high' ? 3 : b.urgency === 'medium' ? 2 : 1) * b.impactScore;
    return scoreB - scoreA;
  });

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">关键事件列表</h3>
        <span className="text-[10px] text-muted-foreground">按影响度×紧急度排序</span>
      </div>

      <div className="space-y-3">
        {sorted.map((event, i) => {
          const CategoryIcon = categoryIcons[event.category] || Lightbulb;
          const urgency = urgencyConfig[event.urgency] || urgencyConfig.medium;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <div
                className="group p-3 rounded-lg border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer bg-card hover:bg-muted/30"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <div className="flex items-start gap-3">
                  {/* 类别图标 */}
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                    <CategoryIcon className="w-4 h-4 text-primary/70" />
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {event.title}
                      </h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${urgency.color}`}>
                        {urgency.label}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {event.markets.map((m) => (
                        <MarketBadge key={m} region={m} size="sm" />
                      ))}
                      <ConfidenceBadge
                        level={event.confidence}
                        score={event.confidenceScore}
                        size="sm"
                      />
                    </div>

                    {/* 行动建议快捷预览 */}
                    {event.actionSuggestions.length > 0 && (
                      <div className="mt-2 flex items-start gap-1.5">
                        <Lightbulb className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          <span className="font-medium text-foreground mr-1">
                            [{event.actionSuggestions[0].levelLabel}]
                          </span>
                          {event.actionSuggestions[0].text}
                        </p>
                      </div>
                    )}

                    {/* 溯源链接 */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-muted-foreground">来源:</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1">
                              {event.sources.map((src, si) => (
                                <a
                                  key={src.id}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[10px] px-1.5 py-0.5 bg-muted/50 hover:bg-muted rounded text-primary transition-colors"
                                >
                                  {si + 1}. {src.name}
                                </a>
                              ))}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">点击直达原始信源</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* 箭头 */}
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default EventList;
