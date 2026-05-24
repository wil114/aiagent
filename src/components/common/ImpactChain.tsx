import React from 'react';
import { ArrowDown, Lightbulb } from 'lucide-react';

interface ImpactChainProps {
  steps: string[];
  className?: string;
}

const ImpactChain: React.FC<ImpactChainProps> = ({ steps, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        影响链推演
      </h4>
      <div className="relative pl-4">
        <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500/30 rounded-full" />
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-2.5 top-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-100" />
              <p className="text-xs text-muted-foreground leading-relaxed pl-2">
                {step}
              </p>
              {i < steps.length - 1 && (
                <ArrowDown className="w-3 h-3 text-amber-400/50 ml-2 mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactChain;
