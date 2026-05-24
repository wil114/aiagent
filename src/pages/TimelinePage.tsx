import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MarketBadge from '@/components/common/MarketBadge';
import { mockTimelineNodes } from '@/data/mockData';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

const categoryColors: Record<string, string> = {
  competitor: 'bg-rose-50 text-rose-700 border-rose-200',
  regulation: 'bg-blue-50 text-blue-700 border-blue-200',
  social: 'bg-purple-50 text-purple-700 border-purple-200',
  platform: 'bg-teal-50 text-teal-700 border-teal-200',
};

const categoryLabels: Record<string, string> = {
  competitor: '竞品动态',
  regulation: '法规变化',
  social: '社媒热点',
  platform: '平台政策',
};

const TimelinePage: React.FC = () => {
  const navigate = useNavigate();

  // 按日期分组
  const grouped = mockTimelineNodes.reduce((acc, node) => {
    if (!acc[node.date]) acc[node.date] = [];
    acc[node.date].push(node);
    return acc;
  }, {} as Record<string, typeof mockTimelineNodes>);

  const dates = Object.keys(grouped).sort();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">时间线视图</h1>
        <span className="text-xs text-muted-foreground">本周关键节点</span>
      </div>

      <div className="relative">
        {/* 时间线竖线 */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent rounded-full" />

        <div className="space-y-6">
          {dates.map((date) => (
            <div key={date}>
              {/* 日期标记 */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0 relative z-10">
                  <span className="text-xs font-bold text-primary">
                    {new Date(date).getDate()}日
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    {new Date(date).toLocaleDateString('zh-CN', {
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long',
                    })}
                  </span>
                </div>
              </div>

              {/* 事件卡片 */}
              <div className="ml-12 space-y-2">
                {grouped[date].map((node, i) => {
                  const isWarning = node.title.includes('预警');
                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card
                        className={`p-3 cursor-pointer hover:shadow-sm transition-all border-l-4 ${
                          isWarning ? 'border-l-amber-400' : 'border-l-primary/30'
                        }`}
                        onClick={() => navigate(`/event/${node.eventId}`)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {isWarning && (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                              )}
                              <h3 className={`text-sm font-medium ${isWarning ? 'text-amber-700' : 'text-foreground'}`}>
                                {node.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <MarketBadge region={node.market} size="sm" />
                              <Badge
                                variant="outline"
                                className={`text-[10px] h-5 ${categoryColors[node.category] || ''}`}
                              >
                                {categoryLabels[node.category] || node.category}
                              </Badge>
                            </div>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-muted-foreground opacity-0 hover:opacity-100 transition-opacity" />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TimelinePage;
