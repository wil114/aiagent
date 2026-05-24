import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import TodayOverview from '@/components/dashboard/TodayOverview';
import MarketHeatmap from '@/components/dashboard/MarketHeatmap';
import OpportunityRadar from '@/components/dashboard/OpportunityRadar';
import EventList from '@/components/dashboard/EventList';
import AgentPipeline from '@/components/dashboard/AgentPipeline';
import BusinessValueBoard from '@/components/dashboard/BusinessValueBoard';
import ExecutiveActionCard from '@/components/dashboard/ExecutiveActionCard';
import { useSystemContext } from '@/contexts/SystemContext';
import { ShieldAlert } from 'lucide-react';
import {
  mockEvents,
  mockMarketHeatData,
  mockAgentExecutions,
} from '@/data/mockData';

const Dashboard: React.FC = () => {
  const { version, isCircuitBreakerOpen } = useSystemContext();
  const [events] = useState(mockEvents);
  const [marketHeat] = useState(mockMarketHeatData);
  const [agentExecs] = useState(mockAgentExecutions);

  const handleEventClick = useCallback((eventId: string) => {
    window.location.href = `/event/${eventId}`;
  }, []);

  const handleMarketClick = useCallback((region: string) => {
    // 可以扩展为筛选对应市场的事件
    console.log('筛选市场:', region);
  }, []);

  // 根据版本筛选事件
  const filteredEvents = version === 'full' 
    ? events 
    : version === 'compact' 
    ? events.filter(e => e.urgency === 'critical' || e.urgency === 'high')
    : events.filter(e => e.urgency === 'critical');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 p-4 max-w-7xl mx-auto"
    >
      {/* 熔断提示横幅 */}
      {isCircuitBreakerOpen && (
        <div className="w-full bg-destructive text-destructive-foreground px-4 py-3 rounded-md flex items-center justify-center gap-2 shadow-sm font-medium">
          <ShieldAlert className="w-5 h-5" />
          系统已触发熔断，当前为人工审核模式
        </div>
      )}

      {/* 业务负责人视角：每日行动指令 */}
      {version !== 'emergency' && <ExecutiveActionCard />}

      {/* 业务价值看板 ROI */}
      {version === 'full' && (
        <div id="business-value-section">
          <BusinessValueBoard />
        </div>
      )}

      {/* 今日概览 */}
      <TodayOverview events={filteredEvents} />

      {/* 中间行：热力图 + 雷达图 */}
      {version !== 'emergency' && (
        <div id="risk-radar-section" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MarketHeatmap data={marketHeat} onMarketClick={handleMarketClick} />
          <OpportunityRadar events={filteredEvents} onEventClick={handleEventClick} />
        </div>
      )}

      {/* 底部行：事件列表 + Agent流水线 */}
      <div id="event-list-section" className={`grid grid-cols-1 ${version === 'full' ? 'lg:grid-cols-5' : ''} gap-4`}>
        <div className={version === 'full' ? 'lg:col-span-3' : 'w-full'}>
          <EventList events={filteredEvents} />
        </div>
        {version === 'full' && (
          <div className="lg:col-span-2">
            <AgentPipeline executions={agentExecs} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
