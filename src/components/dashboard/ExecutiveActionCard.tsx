import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExecutiveActionCard: React.FC = () => {
  return (
    <Card className="p-4 bg-primary/5 border-primary/20">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">👋</span>
            <h2 className="text-base font-bold text-primary">早安，管理者！今日核心洞察与行动建议</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            <strong className="text-foreground">昨日大白话总结：</strong>
            美国市场培育钻石标签法规收紧且线上社交热度激增；同时日本某本土竞品大幅降价抢份额；另外Shopee在东南亚释放了Q3类目红利。这些变化要求我们在营销、合规和产品定价上快速响应。
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => document.getElementById('event-list-section')?.scrollIntoView({ behavior: 'smooth' })}>
              查看完整简报
            </Button>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('business-value-section')?.scrollIntoView({ behavior: 'smooth' })}>
              查看业务价值
            </Button>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('risk-radar-section')?.scrollIntoView({ behavior: 'smooth' })}>
              查看风险预警
            </Button>
          </div>
        </div>

        <div className="flex-shrink-0 w-full md:w-auto bg-background rounded-lg border border-border p-3 shadow-sm">
          <h3 className="text-xs font-semibold mb-2 text-foreground flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            今日应做出的核心决策
          </h3>
          <ul className="space-y-2 mb-3">
            <li className="text-[11px] flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1 shrink-0" />
              <span>
                <strong className="text-foreground">总部：</strong>
                统一全球天然/培育钻石合规标签SOP，评估亚太防御性价格策略。
              </span>
            </li>
            <li className="text-[11px] flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
              <span>
                <strong className="text-foreground">区域：</strong>
                北美自查所有宣发物料合规；日本策划"早割"防御促销；东南亚对接Shopee资源。
              </span>
            </li>
          </ul>
          <Link to="/event/evt-001">
            <Button size="sm" className="w-full h-7 text-xs gap-1">
              查看首要事件详情 <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ExecutiveActionCard;
