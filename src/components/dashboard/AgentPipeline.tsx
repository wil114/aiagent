import React from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import AgentStatusCard from '@/components/common/AgentStatusCard';
import type { AgentExecution } from '@/types/intelligence';
import { ArrowRight, Bot } from 'lucide-react';

interface AgentPipelineProps {
  executions: AgentExecution[];
}

const AgentPipeline: React.FC<AgentPipelineProps> = ({ executions }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">多Agent协作流水线</h3>
        </div>
        <span className="text-[10px] text-muted-foreground">今日 06:00 - 06:42</span>
      </div>

      <div className="relative">
        {/* 连接线 */}
        <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-300 via-blue-300 to-amber-300/50 rounded-full hidden sm:block" />

        <div className="space-y-3">
          {executions.map((exec, i) => (
            <motion.div
              key={exec.agentName}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="relative"
            >
              <AgentStatusCard
                name={exec.agentName}
                role={exec.agentRole}
                status={exec.status}
                output={exec.output}
                progress={exec.progress}
              />
              {i < executions.length - 1 && (
                <div className="hidden sm:flex absolute -bottom-3 left-[15px] z-10">
                  <ArrowRight className="w-3 h-3 text-muted-foreground rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 流程说明 */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>信号采集</span>
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>解析分析</span>
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>验证输出</span>
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>人工复核</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AgentPipeline;
