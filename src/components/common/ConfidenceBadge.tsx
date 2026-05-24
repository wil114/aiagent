import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ConfidenceLevel } from '@/types/intelligence';
import { CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md';
}

const config = {
  confirmed: {
    label: '已确认',
    shortLabel: '已核实',
    icon: CheckCircle,
    variant: 'default' as const,
    className: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/25',
    dotColor: 'bg-emerald-500',
    tooltip: '≥2个独立信源确认，通过幻觉检测',
  },
  speculated: {
    label: '推测',
    shortLabel: '待确认',
    icon: AlertTriangle,
    variant: 'outline' as const,
    className: 'bg-amber-500/15 text-amber-700 border-amber-500/30 hover:bg-amber-500/25',
    dotColor: 'bg-amber-500',
    tooltip: '单一信源或部分验证，建议人工复核',
  },
  rumor: {
    label: '传闻',
    shortLabel: '待核实',
    icon: HelpCircle,
    variant: 'outline' as const,
    className: 'bg-red-500/15 text-red-700 border-red-500/30 hover:bg-red-500/25',
    dotColor: 'bg-red-500',
    tooltip: '未验证或存在矛盾信息，不建议作为决策依据',
  },
};

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  level,
  score,
  showScore = false,
  size = 'md',
}) => {
  const c = config[level];
  const Icon = c.icon;
  const isSmall = size === 'sm';

  const badge = (
    <Badge
      variant={c.variant}
      className={`${c.className} font-medium ${isSmall ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2.5 py-0.5'} flex items-center gap-1.5 cursor-help`}
    >
      <span className={`${c.dotColor} rounded-full ${isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
      <Icon className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{isSmall ? c.shortLabel : c.label}</span>
      {showScore && score !== undefined && (
        <span className="opacity-70">({score})</span>
      )}
    </Badge>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{c.label}</p>
            <p className="text-xs text-muted-foreground">{c.tooltip}</p>
            {score !== undefined && (
              <p className="text-xs">置信度评分: {score}/100</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConfidenceBadge;
