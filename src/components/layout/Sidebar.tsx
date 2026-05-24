import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useSystemContext } from '@/contexts/SystemContext';
import {
  Radar,
  BarChart3,
  Clock,
  ShieldCheck,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Brain,
  ShieldAlert,
} from 'lucide-react';

interface NavItem {
  path: string;
  name: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { path: '/', name: '战略简报', icon: Radar },
  { path: '/ai-analysis', name: 'AI情报分析', icon: Brain },
  { path: '/confidence', name: '置信度仪表盘', icon: BarChart3 },
  { path: '/timeline', name: '时间线视图', icon: Clock },
  { path: '/review', name: '人工复核', icon: UserCheck, badge: 2 },
  { path: '/risk-log', name: '风控日志', icon: ShieldAlert },
  { path: '/settings', name: '系统设置', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { errorRate, isCircuitBreakerOpen } = useSystemContext();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-card border-r border-border z-40 flex flex-col"
    >
      {/* Logo区域 */}
      <div className="h-14 flex items-center px-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-sm font-bold whitespace-nowrap text-foreground">
                  战略雷达
                </h1>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                  AI Agent · 海外市场情报
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 导航 */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-full"
                  transition={{ duration: 0.2 }}
                />
              )}
              <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-primary' : ''}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && !collapsed && (
                <span className="ml-auto text-[10px] bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
              {item.badge && collapsed && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[8px] text-destructive-foreground flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 风控状态提示 */}
      <div className="px-2 pb-2">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`border rounded-lg p-2.5 mb-2 ${
                isCircuitBreakerOpen 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {isCircuitBreakerOpen ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-destructive" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span className={`text-xs font-semibold ${isCircuitBreakerOpen ? 'text-destructive' : 'text-emerald-700'}`}>
                  {isCircuitBreakerOpen ? '已触发熔断' : '风控正常'}
                </span>
              </div>
              <p className={`text-[10px] leading-relaxed ${isCircuitBreakerOpen ? 'text-destructive' : 'text-emerald-600'}`}>
                今日错误率 {errorRate}%，{isCircuitBreakerOpen ? '已达到阈值。' : '低于熔断阈值 20%。所有Agent运行正常。'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 折叠按钮 */}
      <div className="h-10 border-t border-border flex items-center justify-center">
        <button
          onClick={onToggle}
          className="w-full h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
