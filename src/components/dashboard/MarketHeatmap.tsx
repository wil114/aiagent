import React from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import type { MarketHeatData } from '@/types/intelligence';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MarketHeatmapProps {
  data: MarketHeatData[];
  onMarketClick?: (region: string) => void;
}

const regionMeta: Record<string, { flag: string; name: string }> = {
  china: { flag: '🇨🇳', name: '中国' },
  japan: { flag: '🇯🇵', name: '日本' },
  korea: { flag: '🇰🇷', name: '韩国' },
  southeast_asia: { flag: '🌏', name: '东南亚' },
  usa: { flag: '🇺🇸', name: '美国' },
};

function getHeatColor(intensity: number): string {
  if (intensity >= 80) return 'bg-red-500';
  if (intensity >= 60) return 'bg-orange-400';
  if (intensity >= 40) return 'bg-amber-400';
  if (intensity >= 20) return 'bg-yellow-300';
  return 'bg-slate-200';
}

function getHeatLabel(intensity: number): string {
  if (intensity >= 80) return '剧烈变化';
  if (intensity >= 60) return '显著变化';
  if (intensity >= 40) return '中度变化';
  if (intensity >= 20) return '轻微变化';
  return '平静';
}

const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ data, onMarketClick }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">市场热力图</h3>
        <span className="text-[10px] text-muted-foreground">今日变化剧烈程度</span>
      </div>

      <div className="space-y-3">
        {data.map((market, i) => {
          const meta = regionMeta[market.region];
          const heatColor = getHeatColor(market.intensity);
          const heatLabel = getHeatLabel(market.intensity);

          return (
            <TooltipProvider key={market.region} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="cursor-pointer group"
                    onClick={() => onMarketClick?.(market.region)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-24 flex items-center gap-1.5 shrink-0">
                        <span className="text-base">{meta.flag}</span>
                        <span className="text-xs font-medium">{meta.name}</span>
                      </div>

                      <div className="flex-1 h-8 bg-muted/50 rounded-md overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${market.intensity}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                          className={`h-full ${heatColor} rounded-md relative`}
                        >
                          <div className="absolute inset-0 bg-white/10 rounded-md" />
                        </motion.div>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-foreground/80">
                          {market.intensity}%
                        </span>
                      </div>

                      <span className={`text-[10px] font-medium w-14 text-right ${
                        market.intensity >= 80 ? 'text-red-600' :
                        market.intensity >= 60 ? 'text-orange-600' :
                        market.intensity >= 40 ? 'text-amber-600' :
                        'text-muted-foreground'
                      }`}>
                        {heatLabel}
                      </span>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{meta.flag}</span>
                      <span className="font-medium">{meta.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${heatColor} text-white`}>
                        {heatLabel}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      事件数: {market.eventCount} · 变化数: {market.changeCount}
                    </p>
                    <div className="text-xs space-y-0.5">
                      {market.topEvents.map((e, j) => (
                        <p key={j} className="text-foreground">• {e}</p>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
        <span className="text-[10px] text-muted-foreground">图例:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-slate-200 rounded" />
          <span className="text-[10px] text-muted-foreground">平静</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-yellow-300 rounded" />
          <span className="text-[10px] text-muted-foreground">轻微</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-amber-400 rounded" />
          <span className="text-[10px] text-muted-foreground">中度</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-orange-400 rounded" />
          <span className="text-[10px] text-muted-foreground">显著</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-[10px] text-muted-foreground">剧烈</span>
        </div>
      </div>
    </Card>
  );
};

export default MarketHeatmap;
