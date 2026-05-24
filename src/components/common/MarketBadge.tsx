import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { MarketRegion } from '@/types/intelligence';

interface MarketBadgeProps {
  region: MarketRegion;
  showName?: boolean;
  size?: 'sm' | 'md';
}

const marketConfig: Record<MarketRegion, { name: string; flag: string; color: string }> = {
  china: { name: '中国', flag: '🇨🇳', color: 'bg-red-50 text-red-700 border-red-200' },
  japan: { name: '日本', flag: '🇯🇵', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  korea: { name: '韩国', flag: '🇰🇷', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  southeast_asia: { name: '东南亚', flag: '🌏', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  usa: { name: '美国', flag: '🇺🇸', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
};

const MarketBadge: React.FC<MarketBadgeProps> = ({ region, showName = true, size = 'md' }) => {
  const config = marketConfig[region];
  const isSmall = size === 'sm';

  return (
    <Badge
      variant="outline"
      className={`${config.color} font-medium ${isSmall ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'} flex items-center gap-1`}
    >
      <span className={isSmall ? 'text-xs' : 'text-sm'}>{config.flag}</span>
      {showName && <span>{config.name}</span>}
    </Badge>
  );
};

export default MarketBadge;
