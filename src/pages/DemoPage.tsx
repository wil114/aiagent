import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  ArrowRight,
  ArrowLeft,
  X,
  Target,
  Cpu,
  Brain,
  TrendingUp,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useLiveROI } from '@/hooks/useLiveROI';
import { Badge } from '@/components/ui/badge';

const ROIStepContent = () => {
  const stats = useLiveROI();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground leading-relaxed">
          系统不是成本中心，而是利润中心。基于本月真实拦截数据的<strong className="text-emerald-400">实时推演</strong>：
        </p>
        <span className="text-[10px] text-emerald-400/80 border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-card border border-border p-4 rounded-lg text-center shadow-none relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <p className="text-3xl font-black text-emerald-500 mb-1 tabular-nums transition-all duration-300">
            {stats.hoursSaved.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            <span className="text-sm font-normal text-muted-foreground ml-1">小时</span>
          </p>
          <p className="text-xs text-muted-foreground">累计节省人工调研工时</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg text-center shadow-none relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <p className="text-3xl font-black text-blue-500 mb-1 tabular-nums transition-all duration-300">
            {stats.processedDocs.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-1">篇</span>
          </p>
          <p className="text-xs text-muted-foreground">处理跨市场深层情报数</p>
        </div>
      </div>
    </div>
  );
};

const demoSteps = [
  {
    id: 'pain-point',
    title: '行业痛点：信息噪音与跨市场迟滞',
    icon: Target,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          全球化消费企业每天面对海量市场信号。传统人工调研模式存在三大痛点：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <Card className="p-3 bg-red-500/10 border-red-500/20 shadow-none">
            <h4 className="text-xs font-bold text-red-400 mb-1">⏳ 极度耗时</h4>
            <p className="text-[10px] text-muted-foreground">一篇包含多语种的跨市场简报，人工平均需要4-6小时。</p>
          </Card>
          <Card className="p-3 bg-amber-500/10 border-amber-500/20 shadow-none">
            <h4 className="text-xs font-bold text-amber-400 mb-1">🌫️ 幻觉与噪音</h4>
            <p className="text-[10px] text-muted-foreground">通用大模型常常编造不存在的法规，或被单一水军帖误导。</p>
          </Card>
          <Card className="p-3 bg-blue-500/10 border-blue-500/20 shadow-none">
            <h4 className="text-xs font-bold text-blue-400 mb-1">📉 错失窗口期</h4>
            <p className="text-[10px] text-muted-foreground">日本市场降价了，美国合规收紧了，这些信号往往在两周后才传导到国内总部。</p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'solution',
    title: '解决方案：三层雷达与多Agent协作',
    icon: Layers,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          我们不是做一个简单的"AI总结工具"，而是打造一个<strong>战略智能引擎</strong>：
        </p>
        <div className="relative border border-border rounded-lg p-4 bg-muted/10 overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="shrink-0 w-12 justify-center border-indigo-500/30 bg-indigo-500/10 text-indigo-300">L3 决策</Badge>
              <span className="text-xs font-medium text-foreground">跨市场信号传导预测（预测日本变化对美国的影响）</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="shrink-0 w-12 justify-center border-indigo-500/30 bg-indigo-500/10 text-indigo-300">L2 洞察</Badge>
              <span className="text-xs font-medium text-foreground">动态对比历史，识别变化速率与幅度</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="shrink-0 w-12 justify-center border-indigo-500/30 bg-indigo-500/10 text-indigo-300">L1 信号</Badge>
              <span className="text-xs font-medium text-foreground">6大专属Agent（侦察/解析/分析/简报/校验/接管）实时采集多国信号</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'tech',
    title: '技术护城河：工业级风控与熔断',
    icon: Cpu,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          解决企业对AI"不可靠"的担忧，我们实现了工业级的风控机制：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="bg-muted/10 border border-border rounded-lg p-3">
            <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 多源印证算法
            </h4>
            <p className="text-[10px] text-muted-foreground">
              <code>Score = 信源数量×30% + 可信度×40% + 一致性×30%</code><br/>
              单一孤证将被自动降级为"传闻"。
            </p>
          </div>
          <div className="bg-muted/10 border border-border rounded-lg p-3">
            <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-destructive" /> 20% 自动熔断器
            </h4>
            <p className="text-[10px] text-muted-foreground">
              当幻觉拦截率超过20%，系统自动切断自动发布，强制降级为"全人工复核"模式，提供一键接管按钮。
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'roi',
    title: '商业价值：直接创造业务 ROI',
    icon: TrendingUp,
    content: <ROIStepContent />
  },
  {
    id: 'action',
    title: '眼见为实：开始体验',
    icon: Briefcase,
    content: (
      <div className="space-y-4 flex flex-col items-center text-center py-6">
        <Brain className="w-12 h-12 text-primary mb-2 opacity-80" />
        <h3 className="text-base font-bold text-foreground">欢迎体验 AI 战略情报雷达</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          接下来，您将看到针对业务负责人的「今日行动卡片」、实时风控大屏，以及流式的多模态分析流程。
        </p>
      </div>
    ),
  },
];

const DemoPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigate('/');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const StepIcon = demoSteps[currentStep].icon;

  return (
    <div className="min-h-screen bg-slate-950 dark text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
      
      <Button 
        variant="ghost" 
        className="absolute top-6 right-6 text-slate-400 hover:text-white"
        onClick={() => navigate('/')}
      >
        <X className="w-5 h-5" />
      </Button>

      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-2 mb-8 justify-center">
          {demoSteps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-8 bg-indigo-500' : 
                  idx < currentStep ? 'w-4 bg-indigo-500/50' : 'w-4 bg-slate-800'
                }`}
              />
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                      <StepIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100">
                      <span className="text-indigo-400 mr-2">{currentStep + 1}.</span>
                      {demoSteps[currentStep].title}
                    </h2>
                  </div>
                  
                  <div className="text-slate-300">
                    {demoSteps[currentStep].content}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800">
                <Button 
                  variant="outline" 
                  onClick={handlePrev} 
                  disabled={currentStep === 0}
                  className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> 上一步
                </Button>
                
                <Button 
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                >
                  {currentStep === demoSteps.length - 1 ? (
                    <>进入系统 <Play className="w-4 h-4 ml-2" /></>
                  ) : (
                    <>下一步 <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DemoPage;