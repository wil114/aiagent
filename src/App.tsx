import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import GlobalCircuitBreakerAlert from '@/components/common/GlobalCircuitBreakerAlert';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { mockSystemStatus } from '@/data/mockData';
import type { BriefVersion } from '@/types/intelligence';
import { SystemContext } from '@/contexts/SystemContext';

import { routes } from './routes';

const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [systemStatus, setSystemStatus] = useState(mockSystemStatus);
  const [isCircuitBreakerOpen, setIsCircuitBreakerOpen] = useState(false);
  const [errorRate, setErrorRate] = useState(8.3);

  const toggleCircuitBreaker = () => {
    setIsCircuitBreakerOpen((prev) => {
      const next = !prev;
      setErrorRate(next ? 22 : 8.3);
      return next;
    });
  };

  const handleVersionChange = (v: BriefVersion) => {
    setSystemStatus((prev) => ({ ...prev, version: v }));
  };

  const handleRefresh = () => {
    // 模拟重新生成
    setSystemStatus((prev) => ({
      ...prev,
      lastGeneratedAt: new Date().toISOString(),
    }));
  };

  return (
    <SystemContext.Provider value={{ 
      version: systemStatus.version,
      errorRate,
      isCircuitBreakerOpen,
      toggleCircuitBreaker
    }}>
      <Router>
        <IntersectObserver />
        <div className="flex min-h-screen bg-background">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((p) => !p)} />
          <div
            className="flex-1 flex flex-col transition-all duration-300"
            style={{ marginLeft: sidebarCollapsed ? 64 : 220 }}
          >
            <Header
              systemStatus={systemStatus}
              onVersionChange={handleVersionChange}
              onRefresh={handleRefresh}
            />
            <main className="flex-grow overflow-y-auto">
              <Routes>
                {routes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster />
        <GlobalCircuitBreakerAlert />
      </Router>
    </SystemContext.Provider>
  );
};

export default App;
