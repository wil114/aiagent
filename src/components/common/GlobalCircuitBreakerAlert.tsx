import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useSystemContext } from '@/contexts/SystemContext';
import { Button } from '@/components/ui/button';
import { ShieldAlert, AlertTriangle, ArrowRight, X } from 'lucide-react';

const GlobalCircuitBreakerAlert: React.FC = () => {
  const { isCircuitBreakerOpen, errorRate } = useSystemContext();
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCircuitBreakerOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isCircuitBreakerOpen]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const goToReview = () => {
    setIsVisible(false);
    navigate('/review');
  };

  const goToRiskLog = () => {
    setIsVisible(false);
    navigate('/risk-log');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-background border border-destructive/20 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* 顶部红条 */}
            <div className="h-1.5 w-full bg-destructive" />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 text-destructive animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-destructive">系统已触发熔断保护</h2>
                    <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      当前AI单日错误率飙升至 {errorRate}%
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 mb-6 border border-border">
                <p className="text-sm text-foreground leading-relaxed mb-3">
                  为避免虚假情报污染决策链路，AI情报流水线已被切断。系统已<strong>强制降级</strong>并转入全人工接管模式。
                </p>
                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside pl-1">
                  <li>自动分发与推送通道已冻结</li>
                  <li>新的海外情报已被移入待复核队列</li>
                  <li>请业务负责人尽快评估当前风险</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={goToRiskLog}>
                  查看风控日志
                </Button>
                <Button variant="destructive" className="flex-1 gap-2" onClick={goToReview}>
                  前往人工复核 <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalCircuitBreakerAlert;
