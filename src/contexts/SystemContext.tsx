import React, { createContext, useContext } from 'react';
import type { BriefVersion } from '@/types/intelligence';

interface SystemContextType {
  version: BriefVersion;
  errorRate: number;
  isCircuitBreakerOpen: boolean;
  toggleCircuitBreaker: () => void;
}

export const SystemContext = createContext<SystemContextType>({ 
  version: 'compact',
  errorRate: 8.3,
  isCircuitBreakerOpen: false,
  toggleCircuitBreaker: () => {},
});

export const useSystemContext = () => useContext(SystemContext);
