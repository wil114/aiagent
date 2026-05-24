import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail';
import TimelinePage from './pages/TimelinePage';
import ConfidencePage from './pages/ConfidencePage';
import ReviewPage from './pages/ReviewPage';
import SettingsPage from './pages/SettingsPage';
import AiAnalysisPage from './pages/AiAnalysisPage';
import RiskLogPage from './pages/RiskLogPage';
import DemoPage from './pages/DemoPage';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  { name: '路演演示', path: '/demo', element: <DemoPage />, public: true },
  { name: '战略简报', path: '/', element: <Dashboard />, public: true },
  { name: '事件详情', path: '/event/:id', element: <EventDetail />, public: true },
  { name: 'AI情报分析', path: '/ai-analysis', element: <AiAnalysisPage />, public: true },
  { name: '置信度仪表盘', path: '/confidence', element: <ConfidencePage />, public: true },
  { name: '时间线视图', path: '/timeline', element: <TimelinePage />, public: true },
  { name: '人工复核', path: '/review', element: <ReviewPage />, public: true },
  { name: '风控日志', path: '/risk-log', element: <RiskLogPage />, public: true },
  { name: '系统设置', path: '/settings', element: <SettingsPage />, public: true },
];
