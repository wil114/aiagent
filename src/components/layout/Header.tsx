import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import type { BriefVersion, SystemStatus } from '@/types/intelligence';
import {
  Calendar,
  Clock,
  RefreshCw,
  Layers,
  ChevronDown,
  ShieldAlert,
  Play,
} from 'lucide-react';

interface HeaderProps {
  systemStatus: SystemStatus;
  onVersionChange: (v: BriefVersion) => void;
  onRefresh: () => void;
}

import { useSystemContext } from '@/contexts/SystemContext';

const versionLabels: Record<BriefVersion, string> = {
  full: '完整版',
  compact: '精简版',
  emergency: '应急版',
};

const versionDesc: Record<BriefVersion, string> = {
  full: '包含所有事件与详细分析',
  compact: '仅高优先级事件与核心建议',
  emergency: '仅紧急事件与必要信息',
};

const Header: React.FC<HeaderProps> = ({ systemStatus, onVersionChange, onRefresh }) => {
  const { errorRate, isCircuitBreakerOpen, toggleCircuitBreaker } = useSystemContext();
  const now = new Date();
  const isGenerating = systemStatus.agentExecutions.some((a) => a.status === 'running');

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="font-medium text-foreground">
            {now.toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground hidden sm:flex">
          <Clock className="w-3.5 h-3.5" />
          <span>
            简报生成于{' '}
            {new Date(systemStatus.lastGeneratedAt).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* 演示模式：显式熔断切换按钮 */}
        <Button
          variant={isCircuitBreakerOpen ? 'destructive' : 'outline'}
          size="sm"
          className={`h-8 text-[11px] gap-1.5 px-2.5 transition-colors ${
            !isCircuitBreakerOpen && 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 hover:text-emerald-800'
          }`}
          onClick={toggleCircuitBreaker}
        >
          {isCircuitBreakerOpen ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5" />
              解除熔断
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
              模拟熔断
            </>
          )}
        </Button>

        {/* 熔断状态仪表 */}
        <div 
          className="hidden md:flex items-center gap-2 border border-border rounded-md px-2 h-8"
        >
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">AI错误率</span>
          <Progress value={errorRate} className="w-16 h-1.5" />
          <span className={`text-xs font-bold ${isCircuitBreakerOpen ? 'text-destructive' : 'text-emerald-600'}`}>
            {errorRate}%
          </span>
          {isCircuitBreakerOpen ? (
            <Badge variant="outline" className="text-[9px] h-5 bg-red-50 text-destructive border-red-200 gap-1 ml-1 px-1.5">
              <ShieldAlert className="w-3 h-3" />
              已熔断
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[9px] h-5 bg-emerald-50 text-emerald-700 border-emerald-200 ml-1 px-1.5">
              正常
            </Badge>
          )}
        </div>

        {/* Demo路演模式入口 */}
        <Link to="/demo">
          <Button size="sm" className="h-8 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
            <Play className="w-3.5 h-3.5" />
            演示模式
          </Button>
        </Link>

        {/* 版本切换 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Layers className="w-3.5 h-3.5" />
              {versionLabels[systemStatus.version]}
              <ChevronDown className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="space-y-1">
              {(Object.keys(versionLabels) as BriefVersion[]).map((v) => (
                <button
                  key={v}
                  onClick={() => onVersionChange(v)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${
                    systemStatus.version === v
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{versionLabels[v]}</span>
                    {systemStatus.version === v && (
                      <Badge variant="outline" className="text-[10px] h-5">
                        当前
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{versionDesc[v]}</p>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* 刷新按钮 */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={onRefresh}
          disabled={isGenerating}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? '生成中...' : '重新生成'}
        </Button>
      </div>
    </header>
  );
};

export default Header;
