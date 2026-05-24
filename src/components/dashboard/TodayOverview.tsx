import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import {
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Globe,
  Zap,
  Clock,
} from 'lucide-react';
import type { IntelligenceEvent } from '@/types/intelligence';

interface TodayOverviewProps {
  events: IntelligenceEvent[];
}

const TodayOverview: React.FC<TodayOverviewProps> = ({ events }) => {
  const navigate = useNavigate();
  
  const criticalCount = events.filter((e) => e.urgency === 'critical').length;
  const highCount = events.filter((e) => e.urgency === 'high').length;
  const confirmedCount = events.filter((e) => e.confidence === 'confirmed').length;
  const crossMarketCount = events.filter((e) => e.crossMarketAnalysis).length;
  const pendingReview = events.filter((e) => e.reviewStatus === 'pending').length;

  const stats = [
    {
      label: '关键事件',
      value: events.length,
      sub: `紧急 ${criticalCount} · 重要 ${highCount}`,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      action: () => document.getElementById('event-list-section')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      label: '已核实',
      value: confirmedCount,
      sub: '多源交叉验证通过',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      action: () => navigate('/confidence'),
    },
    {
      label: '跨市场机会',
      value: crossMarketCount,
      sub: '识别出可复制的时差窗口',
      icon: Globe,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      action: () => document.getElementById('risk-radar-section')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      label: '待复核',
      value: pendingReview,
      sub: '需人工确认后发布',
      icon: Clock,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      action: () => navigate('/review'),
    },
  ];

  return (
    <div className="space-y-3">
      {/* 一句话摘要 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/0 border-primary/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">今日核心发现</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                当前视图包含<span className="font-medium text-foreground">{events.length}个关键变化</span>。
                系统核心发现：日本竞品突然降价30%并推出限定款（影响度最高）；
                美国FTC更新珠宝标签法规，要求6月下旬前完成合规。
                其中<span className="font-medium text-emerald-600">{confirmedCount}个事件</span>已通过多源验证。
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card 
                className="p-3 hover:shadow-md transition-all cursor-pointer hover:border-primary/40 hover:-translate-y-0.5 group"
                onClick={stat.action}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-0.5 group-hover:text-primary transition-colors">{stat.value}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center justify-between">
                  <span>{stat.sub}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">点击查看 &rarr;</span>
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayOverview;
