/**
 * 战略情报系统类型定义
 * 模拟多Agent协作输出的数据结构
 */

// 置信度等级
export type ConfidenceLevel = 'confirmed' | 'speculated' | 'rumor';

// 市场区域
export type MarketRegion = 'china' | 'japan' | 'korea' | 'southeast_asia' | 'usa';

// 事件类别
export type EventCategory = 'competitor' | 'regulation' | 'social' | 'platform' | 'supply_chain' | 'pricing';

// 影响维度
export type ImpactDimension = 'product' | 'supply_chain' | 'marketing' | 'compliance' | 'pricing';

// 紧急度
export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

// Agent状态
export type AgentStatus = 'running' | 'success' | 'warning' | 'error' | 'idle';

// 简报版本
export type BriefVersion = 'full' | 'compact' | 'emergency';

// 信息来源
export interface InformationSource {
  id: string;
  name: string;
  url: string;
  publishTime: string;
  summary: string;
  reliability: number; // 0-100
}

// 情报事件
export interface IntelligenceEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  markets: MarketRegion[];
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0-100
  sources: InformationSource[];
  impactDimensions: ImpactDimension[];
  urgency: UrgencyLevel;
  impactScore: number; // 0-100
  createdAt: string;
  detectedAt: string;
  // L2 洞察层
  changes: {
    whatChanged: string;
    comparedTo: string;
    changeSpeed: string;
  };
  // L3 决策层
  crossMarketAnalysis?: {
    leadingMarket: MarketRegion;
    laggingMarkets: MarketRegion[];
    windowPeriod: string;
    opportunity: string;
  };
  // 行动建议
  actionSuggestions: {
    id: string;
    level: 'hq' | 'regional' | 'store';
    levelLabel: '总部决策' | '区域管理' | '门店执行';
    text: string;
    priority: number;
    expectedOutcome?: string;
    deadline?: string;
    status?: 'accepted' | 'pending' | 'n/a';
  }[];
  // 影响链推演
  impactChain: string[];
  // 人工复核
  reviewStatus?: 'pending' | 'confirmed' | 'questioned' | 'ignored';
  reviewComment?: string;
  reviewedAt?: string;
  // 风控标记
  riskFlags: {
    singleSource: boolean;
    hallucinationRisk: boolean;
    conflictDetected: boolean;
    timeoutFallback: boolean;
  };
  // 人话解释
  plainExplanation: string;
}

// Agent执行记录
export interface AgentExecution {
  agentName: string;
  agentRole: string;
  status: AgentStatus;
  startTime: string;
  endTime?: string;
  output?: string;
  error?: string;
  progress: number; // 0-100
}

// 市场热力数据
export interface MarketHeatData {
  region: MarketRegion;
  regionName: string;
  intensity: number; // 0-100
  eventCount: number;
  changeCount: number;
  topEvents: string[];
}

// 时间线节点
export interface TimelineNode {
  id: string;
  date: string;
  title: string;
  market: MarketRegion;
  category: EventCategory;
  eventId: string;
}

// 系统状态
export interface SystemStatus {
  version: BriefVersion;
  errorRate: number; // 百分比
  totalEvents: number;
  pendingReview: number;
  agentExecutions: AgentExecution[];
  lastGeneratedAt: string;
  nextScheduledAt: string;
  humanReviewMode: boolean;
}

// 推送配置
export interface PushConfig {
  enabled: boolean;
  time: string;
  channels: ('web' | 'feishu' | 'dingtalk' | 'wecom')[];
  version: BriefVersion;
}

// 市场配置
export interface MarketConfig {
  region: MarketRegion;
  enabled: boolean;
  categories: EventCategory[];
  keywords: string[];
}
