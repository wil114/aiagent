import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { InformationSource } from '@/types/intelligence';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SourceLinkProps {
  source: InformationSource;
  index?: number;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source, index }) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/50 hover:bg-muted rounded-md text-xs text-primary transition-colors group"
          >
            {index !== undefined && (
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                {index + 1}
              </span>
            )}
            <span className="font-medium truncate max-w-[120px]">{source.name}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          <div className="space-y-1">
            <p className="font-medium text-sm">{source.name}</p>
            <p className="text-xs text-muted-foreground">{source.summary}</p>
            <div className="flex items-center gap-2 text-xs">
              <span>可信度: {source.reliability}%</span>
              <span className="text-muted-foreground">
                {new Date(source.publishTime).toLocaleString('zh-CN')}
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SourceLink;
