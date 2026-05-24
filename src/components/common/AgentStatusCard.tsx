import React from 'react';
import { Card } from '@/components/ui/card';
import type { AgentStatus } from '@/types/intelligence';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Clock,
} from 'lucide-react';

interface AgentStatusCardProps {
  name: string;
  role: string;
  status: AgentStatus;
  output?: string;
  progress?: number;
  className?: string;
}

const statusConfig: Record<AgentStatus, { icon: React.ElementType; color: string; label: string; bg: string }> = {
  running: {
    icon: Loader2,
    color: 'text-blue-600',
    label: '运行中',
    bg: 'bg-blue-50 border-blue-200',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    label: '已完成',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  warning: {
    icon: AlertCircle,
    color: 'text-amber-600',
    label: '有警告',
    bg: 'bg-amber-50 border-amber-200',
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    label: '异常',
    bg: 'bg-red-50 border-red-200',
  },
  idle: {
    icon: Clock,
    color: 'text-slate-500',
    label: '待机中',
    bg: 'bg-slate-50 border-slate-200',
  },
};

const AgentStatusCard: React.FC<AgentStatusCardProps> = ({
  name,
  role,
  status,
  output,
  progress = 0,
  className = '',
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={`p-3 border ${config.bg} transition-all duration-300 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${config.color}`}>
          <Icon className={`w-4 h-4 ${status === 'running' ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{name}</h4>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
            <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
          </div>
          {output && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{output}</p>
          )}
          {status === 'running' && progress > 0 && (
            <div className="mt-2">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{progress}%</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AgentStatusCard;
