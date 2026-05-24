import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Target,
  Clock,
  Briefcase,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { useLiveROI } from '@/hooks/useLiveROI';

const BusinessValueBoard: React.FC = () => {
  const stats = useLiveROI();
  const navigate = useNavigate();

  return (
    <Card className="p-4 bg-gradient-to-br from-card to-muted/20 border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">系统业务价值 ROI (实时推演)</h2>
        </div>
        <Badge variant="secondary" className="text-[10px] font-normal animate-pulse bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          ● 实时计算中
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div 
          onClick={() => navigate('/ai-analysis')}
          className="p-3 bg-background rounded-lg border border-border cursor-pointer hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-emerald-600 transition-colors">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">累计节省工时</span>
            </div>
            <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">查看详情 &rarr;</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-foreground tabular-nums group-hover:text-emerald-600 transition-colors">{stats.hoursSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-[10px] text-muted-foreground">小时</span>
          </div>
          <p className="text-[9px] text-emerald-600 mt-1 truncate" title={`基于处理的 ${stats.processedDocs.toLocaleString()} 篇市场长文测算`}>
            ≈ 处理 {stats.processedDocs.toLocaleString()} 篇情报
          </p>
        </div>

        <div 
          onClick={() => navigate('/timeline')}
          className="p-3 bg-background rounded-lg border border-border cursor-pointer hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-emerald-600 transition-colors">
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">发现商机信号</span>
            </div>
            <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">查看详情 &rarr;</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-emerald-600 tabular-nums">{stats.opportunities}</span>
            <span className="text-[10px] text-muted-foreground">项</span>
          </div>
          <p className="text-[9px] text-muted-foreground mt-1 group-hover:text-emerald-600 transition-colors">已采纳 4 项战略动作</p>
        </div>

        <div 
          onClick={() => navigate('/risk-log')}
          className="p-3 bg-background rounded-lg border border-border cursor-pointer hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-amber-600 transition-colors">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">早期风险预警</span>
            </div>
            <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">查看日志 &rarr;</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-amber-600 tabular-nums">{stats.warnings}</span>
            <span className="text-[10px] text-muted-foreground">次</span>
          </div>
          <p className="text-[9px] text-emerald-600 mt-1">平均提前 5.2 天预警</p>
        </div>

        <div 
          onClick={() => navigate('/confidence')}
          className="p-3 bg-background rounded-lg border border-border cursor-pointer hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-blue-600 transition-colors">
              <Target className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">跨市场传导命中率</span>
            </div>
            <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">置信度分析 &rarr;</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-blue-600 tabular-nums">{stats.accuracy.toFixed(1)}%</span>
          </div>
          <p className="text-[9px] text-muted-foreground mt-1 group-hover:text-blue-600 transition-colors">动态回归评估</p>
        </div>
      </div>

      <div 
        onClick={() => navigate('/event/evt-001')}
        className="bg-background rounded-lg border border-border p-3 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold group-hover:text-primary transition-colors">标杆成功案例：跨市场信号传导预测</span>
          </div>
          <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">查看详情 &rarr;</span>
        </div>
        <div className="text-[11px] text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
          <p className="mb-1">
            <span className="text-foreground font-medium">【预测路径】</span>
            美国FTC培育钻石标签政策收紧信号 (T-90天) → 欧盟环保法案跟进 (T-30天) → 成功指导中国出海供应链合规整改。
          </p>
          <p>
            <span className="text-emerald-600 font-medium">【业务收益】</span>
            系统在5月初提前预警美国FTC标签新规草案，指导产品部提早启动全球天然/培育钻石合规SOP，成功避免了北美区大促期间可能面临的百万美元级虚假宣传集体诉讼及下架风险。
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BusinessValueBoard;
