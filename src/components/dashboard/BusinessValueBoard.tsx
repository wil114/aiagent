import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Target,
  Clock,
  Briefcase,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

const BusinessValueBoard: React.FC = () => {
  return (
    <Card className="p-4 bg-gradient-to-br from-card to-muted/20 border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">系统业务价值 ROI</h2>
        </div>
        <Badge variant="secondary" className="text-[10px] font-normal">
          统计周期: 过去30天
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 bg-background rounded-lg border border-border">
          <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">节省调研时间</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-foreground">1,240</span>
            <span className="text-[10px] text-muted-foreground">小时</span>
          </div>
          <p className="text-[9px] text-emerald-600 mt-1">≈ 节省3名全职分析师产能</p>
        </div>

        <div className="p-3 bg-background rounded-lg border border-border">
          <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">发现商机</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-emerald-600">12</span>
            <span className="text-[10px] text-muted-foreground">项</span>
          </div>
          <p className="text-[9px] text-muted-foreground mt-1">已采纳 4 项战略动作</p>
        </div>

        <div className="p-3 bg-background rounded-lg border border-border">
          <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">早期风险预警</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-amber-600">8</span>
            <span className="text-[10px] text-muted-foreground">次</span>
          </div>
          <p className="text-[9px] text-emerald-600 mt-1">平均提前 5.2 天预警</p>
        </div>

        <div className="p-3 bg-background rounded-lg border border-border">
          <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
            <Target className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">跨市场传导命中率</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-blue-600">85%</span>
          </div>
          <p className="text-[9px] text-muted-foreground mt-1">成功预测 6 起市场波动</p>
        </div>
      </div>

      <div className="bg-background rounded-lg border border-border p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold">标杆成功案例：跨市场信号传导预测</span>
        </div>
        <div className="text-[11px] text-muted-foreground leading-relaxed">
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
