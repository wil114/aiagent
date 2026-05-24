import React from 'react';
import { Card } from '@/components/ui/card';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Label,
} from 'recharts';
import type { IntelligenceEvent } from '@/types/intelligence';

interface OpportunityRadarProps {
  events: IntelligenceEvent[];
  onEventClick?: (eventId: string) => void;
}

// 颜色映射
const urgencyColorMap: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg max-w-[240px]">
        <p className="text-xs font-semibold text-foreground mb-1">{data.name}</p>
        <p className="text-[10px] text-muted-foreground mb-1.5">{data.market}</p>
        <div className="space-y-1 text-[10px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">影响度</span>
            <span className="font-medium">{data.impact}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">紧急度</span>
            <span className="font-medium">{data.urgencyLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">置信度</span>
            <span className="font-medium">{data.confidenceScore}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const OpportunityRadar: React.FC<OpportunityRadarProps> = ({ events, onEventClick }) => {
  const urgencyScoreMap: Record<string, number> = {
    critical: 90,
    high: 70,
    medium: 45,
    low: 20,
  };

  const urgencyLabelMap: Record<string, string> = {
    critical: '紧急',
    high: '重要',
    medium: '一般',
    low: '低',
  };

  const chartData = events.map((e) => ({
    x: e.impactScore,
    y: urgencyScoreMap[e.urgency] || 50,
    name: e.title.length > 20 ? e.title.slice(0, 20) + '...' : e.title,
    fullName: e.title,
    eventId: e.id,
    market: e.markets.map((m) => {
      const names: Record<string, string> = {
        china: '中国', japan: '日本', korea: '韩国',
        southeast_asia: '东南亚', usa: '美国',
      };
      return names[m] || m;
    }).join(' · '),
    impact: e.impactScore,
    urgencyLabel: urgencyLabelMap[e.urgency] || e.urgency,
    confidenceScore: e.confidenceScore,
    urgency: e.urgency,
  }));

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">机会/风险雷达</h3>
          <p className="text-[10px] text-muted-foreground">高影响×高紧急 = 立即行动</p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              type="number"
              dataKey="x"
              name="影响度"
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
            >
              <Label
                value="影响度 →"
                position="bottom"
                offset={10}
                style={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              name="紧急度"
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
            >
              <Label
                value="紧急度 →"
                position="left"
                angle={-90}
                offset={10}
                style={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <ReferenceLine x={50} stroke="hsl(var(--border))" strokeDasharray="5 5" />
            <ReferenceLine y={50} stroke="hsl(var(--border))" strokeDasharray="5 5" />
            <Scatter
              data={chartData}
              onClick={(data: any) => onEventClick?.(data.eventId)}
              cursor="pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={urgencyColorMap[entry.urgency] || '#888'}
                  stroke={urgencyColorMap[entry.urgency] || '#888'}
                  strokeWidth={1}
                  r={8}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* 四象限标签 */}
      <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
        <div className="text-center p-1.5 rounded bg-red-50 text-red-700 border border-red-100">
          <span className="font-medium">高影响 · 高紧急</span>
          <br />
          <span className="opacity-80">立即行动</span>
        </div>
        <div className="text-center p-1.5 rounded bg-amber-50 text-amber-700 border border-amber-100">
          <span className="font-medium">低影响 · 高紧急</span>
          <br />
          <span className="opacity-80">快速处理</span>
        </div>
        <div className="text-center p-1.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
          <span className="font-medium">高影响 · 低紧急</span>
          <br />
          <span className="opacity-80">规划跟进</span>
        </div>
        <div className="text-center p-1.5 rounded bg-slate-50 text-slate-600 border border-slate-100">
          <span className="font-medium">低影响 · 低紧急</span>
          <br />
          <span className="opacity-80">持续关注</span>
        </div>
      </div>
    </Card>
  );
};

export default OpportunityRadar;
