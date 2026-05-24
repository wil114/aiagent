/**
 * 战略情报系统Mock数据
 * 模拟多Agent协作的完整输出，覆盖6大Agent、5大市场、3层雷达模型
 */

import type {
  IntelligenceEvent,
  AgentExecution,
  MarketHeatData,
  TimelineNode,
  SystemStatus,
  PushConfig,
  MarketConfig,
} from '@/types/intelligence';

// ==================== 情报事件 ====================

export const mockEvents: IntelligenceEvent[] = [
  {
    id: 'evt-001',
    title: '日本竞品「光輝珠寶」乐天平台降价30%并推出樱花限定款',
    description: '日本本土品牌「光輝珠寶」于5月22日在乐天市场全线下调培育钻石饰品价格30%，同步上线「樱花限定」系列，包含项链、耳环共6个SKU。该品牌在乐天平台的搜索量3天内上涨240%，社交媒体关联词高频出现「限定款」「早割」「母の日ギフト」。',
    category: 'competitor',
    markets: ['japan'],
    confidence: 'confirmed',
    confidenceScore: 92,
    sources: [
      {
        id: 'src-001-1',
        name: '日本乐天市场商品页',
        url: 'https://search.rakuten.co.jp/search/mall/%E5%85%89%E8%BC%9D%E7%8F%A0%E5%AF%B6/',
        publishTime: '2026-05-22T09:00:00+09:00',
        summary: '光輝珠寶乐天旗舰店所有培育钻石饰品价格下调30%，新增樱花限定系列',
        reliability: 95,
      },
      {
        id: 'src-001-2',
        name: 'Twitter/X 日本珠宝话题',
        url: 'https://twitter.com/search?q=%E5%85%89%E8%BC%9D%E7%8F%A0%E5%AF%B6',
        publishTime: '2026-05-22T14:30:00+09:00',
        summary: '用户讨论热度激增，「限定款」「早割」为高频关联词',
        reliability: 80,
      },
      {
        id: 'src-001-3',
        name: '日经MJ消费趋势',
        url: 'https://www.nikkei.com/',
        publishTime: '2026-05-23T07:00:00+09:00',
        summary: '专栏分析日本培育钻石市场竞争加剧，本土品牌采取激进价格策略',
        reliability: 90,
      },
    ],
    impactDimensions: ['pricing', 'marketing', 'product'],
    urgency: 'critical',
    impactScore: 88,
    createdAt: '2026-05-23T06:30:00+08:00',
    detectedAt: '2026-05-23T06:30:00+08:00',
    changes: {
      whatChanged: '日本本土竞品大幅降价30%并推出限定款',
      comparedTo: '5月19日价格，降价幅度从0%突增至30%',
      changeSpeed: '48小时内完成全线上架和价格调整，搜索量3天涨240%',
    },
    crossMarketAnalysis: {
      leadingMarket: 'japan',
      laggingMarkets: ['china', 'korea'],
      windowPeriod: '预计2-3周',
      opportunity: '中国和韩国市场尚未出现类似大幅降价，存在先发制人窗口期',
    },
    actionSuggestions: [
      {
        id: 'act-001-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '评估亚太区域整体防御性价格策略及「限定款」营销概念可复制性。',
        priority: 1,
        expectedOutcome: '防范竞品价格战外溢，维持亚太整体毛利率。',
        deadline: '2026-05-26',
      },
      {
        id: 'act-001-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '日本区域：针对乐天平台策划「早割」防御性促销；中韩区域：加强竞品电商监控。',
        priority: 2,
        expectedOutcome: '挽回日本电商端预计流失的15-20%转化率。',
        deadline: '2026-05-30',
      },
      {
        id: 'act-001-3',
        level: 'store',
        levelLabel: '门店执行',
        text: '日本线下门店重点突出产品设计故事与优质服务，规避单纯价格对比。',
        priority: 3,
        expectedOutcome: '提升线下进店客单价与服务满意度。',
      },
    ],
    impactChain: [
      '日本竞品降价30% → 我们日本电商详情页转化率预计下降15-20%',
      '「樱花限定」系列上线 → 母の日ギフト搜索流量被分流',
      '若跟进降价 → 毛利率压缩约8-12个百分点',
      '若不跟进 → 需强化差异化卖点（品质/服务/设计）',
      '预计影响：日本区5月销售额可能下滑10-15%',
    ],
    reviewStatus: 'confirmed',
    plainExplanation:
      '因为日本乐天平台该品牌搜索量3天上涨240%，且社媒关联词出现「限定款」「早割」，所以判断为激进的季节性新品攻势。这和上周的平静状态形成鲜明对比，变化速度极快。',
    riskFlags: {
      singleSource: false,
      hallucinationRisk: false,
      conflictDetected: false,
      timeoutFallback: false,
    },
  },
  {
    id: 'evt-002',
    title: '美国FTC更新珠宝标签法规，培育钻石须明确标注生产工艺',
    description: '美国联邦贸易委员会（FTC）于5月21日发布珠宝标签法规修订草案，要求所有培育钻石饰品在销售页面和实体标签上明确标注「Lab-Grown」及具体生产工艺（CVD/HPHT）。草案公示期30天，预计6月下旬生效。',
    category: 'regulation',
    markets: ['usa'],
    confidence: 'confirmed',
    confidenceScore: 96,
    sources: [
      {
        id: 'src-002-1',
        name: '美国联邦贸易委员会官网',
        url: 'https://www.ftc.gov/business-guidance/blog/2026/05/jewelry-guides-update',
        publishTime: '2026-05-21T16:00:00-04:00',
        summary: 'FTC发布珠宝指南修订草案，新增培育钻石标签要求',
        reliability: 99,
      },
      {
        id: 'src-002-2',
        name: 'National Jeweler',
        url: 'https://www.nationaljeweler.com/',
        publishTime: '2026-05-22T10:00:00-04:00',
        summary: '行业媒体解读新规对零售商的影响，预计6月下旬生效',
        reliability: 90,
      },
    ],
    impactDimensions: ['compliance', 'marketing', 'supply_chain'],
    urgency: 'high',
    impactScore: 82,
    createdAt: '2026-05-23T06:32:00+08:00',
    detectedAt: '2026-05-23T06:32:00+08:00',
    changes: {
      whatChanged: '美国FTC新增培育钻石标签强制标注要求',
      comparedTo: '现行法规仅要求标注"培育"，新规要求细化到生产工艺',
      changeSpeed: '法规从草案到生效约30天，留给企业的调整窗口较短',
    },
    crossMarketAnalysis: {
      leadingMarket: 'usa',
      laggingMarkets: ['china', 'japan', 'korea'],
      windowPeriod: '预计6-12个月',
      opportunity: '欧盟和亚太市场通常会在6-12个月内跟进美国监管趋势，可提前布局合规',
    },
    actionSuggestions: [
      {
        id: 'act-002-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '法务部联合产品部出台全球培育钻石及天然钻石合规标签标准作业指导书(SOP)。',
        priority: 1,
        expectedOutcome: '确保全球各市场合规，规避潜在的集体诉讼与巨额罚款。',
        deadline: '2026-05-25',
      },
      {
        id: 'act-002-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '美国区域：90天内清查所有线上商城商品详情页及门店实体宣发物料，完成合规替换。',
        priority: 1,
        expectedOutcome: '平稳过渡缓冲期，消除FTC监管风险。',
        deadline: '2026-08-20',
      },
      {
        id: 'act-002-3',
        level: 'store',
        levelLabel: '门店执行',
        text: '美国及跨境门店销售全员：使用最新合规话术应对消费者对生产工艺的问询。',
        priority: 2,
        expectedOutcome: '提升消费者信任度，避免现场虚假宣传投诉。',
      },
    ],
    impactChain: [
      'FTC法规更新 → 美国电商详情页需修改标签文案',
      '供应链需提供CVD/HPHT工艺认证 → 预计影响上架时间2周',
      '若未及时更新 → 面临FTC处罚及平台下架风险',
      '建议在6月15日前完成全部美国区商品标签更新',
    ],
    reviewStatus: 'confirmed',
    plainExplanation:
      '因为FTC官网直接发布了修订草案，且National Jeweler等行业媒体已进行解读，信息来源权威且一致。新规要求比之前更细，企业只有约30天准备时间，时间紧迫。',
    riskFlags: {
      singleSource: false,
      hallucinationRisk: false,
      conflictDetected: false,
      timeoutFallback: false,
    },
  },
  {
    id: 'evt-003',
    title: 'TikTok美国区培育钻石话题播放量单周增长320%',
    description: 'TikTok美国区#labgrowndiamond话题在5月17-23日期间播放量增长320%，从日均120万次跃升至日均500万次。头部达人@jewelryguru（粉丝890万）发布3条测评视频，带动「性价比」「环保」关键词搜索量激增。',
    category: 'social',
    markets: ['usa'],
    confidence: 'confirmed',
    confidenceScore: 85,
    sources: [
      {
        id: 'src-003-1',
        name: 'TikTok Creative Center趋势洞察',
        url: 'https://ads.tiktok.com/business/en-US/solutions/creative-center/',
        publishTime: '2026-05-23T08:00:00+08:00',
        summary: '#labgrowndiamond话题播放量周环比增长320%',
        reliability: 85,
      },
      {
        id: 'src-003-2',
        name: 'Google Trends美国区',
        url: 'https://trends.google.com/trends/explore?geo=US&q=lab+grown+diamond',
        publishTime: '2026-05-23T08:00:00+08:00',
        summary: '"lab grown diamond"搜索量周环比增长280%',
        reliability: 90,
      },
    ],
    impactDimensions: ['marketing', 'product'],
    urgency: 'high',
    impactScore: 75,
    createdAt: '2026-05-23T06:35:00+08:00',
    detectedAt: '2026-05-23T06:35:00+08:00',
    changes: {
      whatChanged: 'TikTok培育钻石话题热度爆发式增长',
      comparedTo: '上周日均120万播放 vs 本周日均500万播放',
      changeSpeed: '5天内增长320%，达人视频带动效应明显',
    },
    crossMarketAnalysis: {
      leadingMarket: 'usa',
      laggingMarkets: ['china', 'southeast_asia'],
      windowPeriod: '预计2-4周',
      opportunity: '抖音和小红书尚未出现同等热度，可提前布局中文和东南亚市场的内容营销',
    },
    actionSuggestions: [
      {
        id: 'act-003-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '市场营销中心：将美国KOL营销策略向「环保/高性价比」话题转移。',
        priority: 2,
        expectedOutcome: '降低整体KOL获客成本约30%，提高品牌真实口碑声量。',
        deadline: '2026-06-15',
      },
      {
        id: 'act-003-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '大中华区市场部：建立监测机制，评估此热点是否向国内小红书传导。',
        priority: 3,
        expectedOutcome: '提前布局国内小红书等平台的新型内容策略。',
      },
      {
        id: 'act-003-3',
        level: 'store',
        levelLabel: '门店执行',
        text: '美国区域门店与客服：在互动中引入TikTok热点话术，强掉「性价比」与「环保」属性。',
        priority: 3,
        expectedOutcome: '迎合目标客群热点认知，提升成交转化率。',
      },
    ],
    impactChain: [
      'TikTok话题爆发 → 美国消费者认知度和兴趣度大幅提升',
      '头部达人带动 → "性价比"和"环保"成为购买决策关键词',
      '若及时借势 → 品牌曝光量和站内搜索量预计增长150%+',
      '若错过窗口 → 竞品可能抢先合作达人，流量成本上升',
    ],
    reviewStatus: 'confirmed',
    plainExplanation:
      '因为TikTok官方趋势数据和Google Trends都显示了同样的暴涨曲线，且有头部达人推动，所以判断为真实的社媒热度爆发，而非短期刷量。',
    riskFlags: {
      singleSource: false,
      hallucinationRisk: false,
      conflictDetected: false,
      timeoutFallback: false,
    },
  },
  {
    id: 'evt-004',
    title: '亚马逊美国站调整珠宝类目佣金率，培育钻石从15%降至12%',
    description: '亚马逊美国站于5月20日发布公告，自6月1日起珠宝首饰类目（含培育钻石）推荐佣金率从15%下调至12%。同时新增「可持续发展标签」流量扶持计划，符合环保认证的商品可获得搜索加权。',
    category: 'platform',
    markets: ['usa'],
    confidence: 'speculated',
    confidenceScore: 68,
    sources: [
      {
        id: 'src-004-1',
        name: '亚马逊卖家中心公告',
        url: 'https://sellercentral.amazon.com/',
        publishTime: '2026-05-20T10:00:00-04:00',
        summary: '珠宝类目佣金率调整公告，新增可持续发展标签计划',
        reliability: 85,
      },
    ],
    impactDimensions: ['pricing', 'marketing'],
    urgency: 'medium',
    impactScore: 65,
    createdAt: '2026-05-23T06:40:00+08:00',
    detectedAt: '2026-05-23T06:40:00+08:00',
    changes: {
      whatChanged: '亚马逊珠宝类目佣金率下调3个百分点',
      comparedTo: '现行15% vs 新费率12%，为近2年首次下调',
      changeSpeed: '公告到生效约10天，调整窗口紧凑',
    },
    actionSuggestions: [
      {
        id: 'act-004-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '评估将主推的培育钻石产品线价格体系进行全局调整的可能性。',
        priority: 2,
        expectedOutcome: '最大化利用佣金下降带来的利润空间。',
      },
      {
        id: 'act-004-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '北美区域：向亚马逊官方申请"可持续发展标签"流量扶持计划资格。',
        priority: 1,
        expectedOutcome: '获取平台流量扶持加权，提升自然搜索排名。',
      },
    ],
    impactChain: [
      '佣金率下调3% → 单品毛利提升约3个百分点',
      '若让利消费者 → 价格竞争力提升，转化率预计提升8-12%',
      '可持续发展标签 → 搜索加权，自然流量预计提升20%+',
    ],
    reviewStatus: 'pending',
    plainExplanation:
      '虽然亚马逊卖家中心发布了公告，但目前仅有单一官方来源，缺少行业媒体的交叉验证。佣金率调整对利润影响明确，但「可持续发展标签」的具体规则尚不清晰，因此标记为待进一步确认。',
    riskFlags: {
      singleSource: true,
      hallucinationRisk: false,
      conflictDetected: false,
      timeoutFallback: false,
    },
  },
  {
    id: 'evt-005',
    title: '韩国首尔江南区出现"培育钻石快闪店"集中开业潮',
    description: '据社交媒体观察，首尔江南区狎鸥亭和新沙洞区域在5月第三周有至少4家培育钻石快闪店同时开业，主打"年轻化"和"定制体验"。Instagram相关帖子 engagement rate 较高，但尚无权威媒体报道。',
    category: 'competitor',
    markets: ['korea'],
    confidence: 'rumor',
    confidenceScore: 45,
    sources: [
      {
        id: 'src-005-1',
        name: 'Instagram韩国本地探店帖',
        url: 'https://www.instagram.com/',
        publishTime: '2026-05-22T12:00:00+09:00',
        summary: '用户发布多张江南区培育钻石快闪店照片，提及4个不同品牌',
        reliability: 50,
      },
    ],
    impactDimensions: ['marketing', 'product'],
    urgency: 'medium',
    impactScore: 55,
    createdAt: '2026-05-23T06:45:00+08:00',
    detectedAt: '2026-05-23T06:45:00+08:00',
    changes: {
      whatChanged: '韩国首尔出现多家培育钻石快闪店集中开业',
      comparedTo: '上月该区域无相关业态，突然出现4家',
      changeSpeed: '一周内集中开业，疑似有组织的营销攻势',
    },
    actionSuggestions: [
      {
        id: 'act-005-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '暂缓对韩国市场追加培育钻石营销预算的决定，等待实地验证。',
        priority: 2,
        expectedOutcome: '避免跟风投资可能导致的不确定性风险。',
      },
      {
        id: 'act-005-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '韩国区域市场部：安排本地团队实地走访狎鸥亭快闪店，验证真实性。',
        priority: 1,
        expectedOutcome: '提供一线真实竞争情报，辅助总部决策。',
      },
    ],
    impactChain: [
      '若属实 → 韩国培育钻石线下零售竞争加剧',
      '「快闪店」模式 → 可能是新品牌试水市场的低成本策略',
      '建议实地验证后再制定应对策略',
    ],
    reviewStatus: 'pending',
    plainExplanation:
      '目前仅有Instagram用户发帖，缺少权威媒体或行业平台的交叉验证。虽然帖子的互动数据较高，但无法排除为品牌营销行为。Validator已将该事件标记为"🔴传闻·单源·待核实"。',
    riskFlags: {
      singleSource: true,
      hallucinationRisk: true,
      conflictDetected: false,
      timeoutFallback: false,
    },
  },
  {
    id: 'evt-006',
    title: '东南亚Shopee宣布Q3珠宝类目流量扶持计划',
    description: 'Shopee官方于5月22日在新加坡卖家峰会宣布，第三季度将加大对珠宝首饰类目的流量扶持，包括首页推荐位、直播带货资源包和跨境物流补贴。培育钻石被列为重点扶持子类目之一。',
    category: 'platform',
    markets: ['southeast_asia'],
    confidence: 'confirmed',
    confidenceScore: 90,
    sources: [
      {
        id: 'src-006-1',
        name: 'Shopee官方卖家峰会直播',
        url: 'https://seller.shopee.sg/',
        publishTime: '2026-05-22T14:00:00+08:00',
        summary: 'Q3珠宝类目流量扶持计划公布，培育钻石为重点子类目',
        reliability: 90,
      },
      {
        id: 'src-006-2',
        name: 'TechInAsia',
        url: 'https://www.techinasia.com/',
        publishTime: '2026-05-23T09:00:00+08:00',
        summary: '报道Shopee Q3战略重点，珠宝类目获得额外资源倾斜',
        reliability: 85,
      },
    ],
    impactDimensions: ['marketing', 'supply_chain'],
    urgency: 'medium',
    impactScore: 72,
    createdAt: '2026-05-23T06:50:00+08:00',
    detectedAt: '2026-05-23T06:50:00+08:00',
    changes: {
      whatChanged: 'Shopee首次将培育钻石列为Q3重点扶持子类目',
      comparedTo: '此前珠宝类目为泛扶持，未有子类目倾斜',
      changeSpeed: '5月公布、7月执行，有6-8周准备窗口',
    },
    crossMarketAnalysis: {
      leadingMarket: 'southeast_asia',
      laggingMarkets: ['china'],
      windowPeriod: '预计3-6个月',
      opportunity: '东南亚市场培育钻石渗透率低于中国，平台扶持期是进入市场的好时机',
    },
    actionSuggestions: [
      {
        id: 'act-006-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '加速探索并在东南亚市场铺设适配Shopee的高性价比饰品产品线。',
        priority: 2,
        expectedOutcome: '提前卡位东南亚电商红利期。',
      },
      {
        id: 'act-006-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '东南亚区域：立即联系Shopee客户经理，确认Q3直播资源包与补贴。',
        priority: 1,
        expectedOutcome: '抢占第一批红利流量，降低获客成本。',
        deadline: '2026-05-30',
      },
      {
        id: 'act-006-3',
        level: 'store',
        levelLabel: '门店执行',
        text: '海外仓及发货中心：自查并发起Shopee专属履约打包SOP优化。',
        priority: 2,
        expectedOutcome: '避免因发货问题错失平台补贴资格。',
      },
    ],
    impactChain: [
      'Shopee流量扶持 → 东南亚市场培育钻石曝光量预计增长200%+',
      '跨境物流补贴 → 降低东南亚市场准入门槛',
      '直播资源包 → 可快速建立品牌认知度',
      '建议Q3前完成入驻，抢占扶持红利期',
    ],
    reviewStatus: 'confirmed',
    plainExplanation:
      '因为Shopee官方卖家峰会直接宣布了该计划，且TechInAsia等科技媒体进行了独立报道，多源信息一致。这是平台战略级的资源倾斜，机会明确。',
    riskFlags: {
      singleSource: false,
      hallucinationRisk: false,
      conflictDetected: false,
      timeoutFallback: false,
    },
  },
];

// ==================== Agent执行记录 ====================

export const mockAgentExecutions: AgentExecution[] = [
  {
    agentName: 'Scout Agent',
    agentRole: '侦察兵 — 采集公开信息',
    status: 'success',
    startTime: '2026-05-23T06:00:00+08:00',
    endTime: '2026-05-23T06:25:00+08:00',
    output: '采集到47条原始信息，覆盖5大市场、4大类别。经去重后保留23条有效信号。',
    progress: 100,
  },
  {
    agentName: 'Parser Agent',
    agentRole: '解析员 — 多语言处理与实体识别',
    status: 'success',
    startTime: '2026-05-23T06:25:00+08:00',
    endTime: '2026-05-23T06:28:00+08:00',
    output: '完成日/韩/英 → 中文语义翻译，识别出12个品牌实体、8条法规条款、5个关键人物。对比昨日数据，提取到6个新增变化。',
    progress: 100,
  },
  {
    agentName: 'Analyst Agent',
    agentRole: '分析师 — 影响评估与跨市场对比',
    status: 'success',
    startTime: '2026-05-23T06:28:00+08:00',
    endTime: '2026-05-23T06:32:00+08:00',
    output: '完成6个事件的impact_matrix评估，识别出2个跨市场机会时差窗口（日本→中韩、美国→中国/东南亚）。',
    progress: 100,
  },
  {
    agentName: 'Validator Agent',
    agentRole: '校验员 — 幻觉检测与多源验证',
    status: 'warning',
    startTime: '2026-05-23T06:32:00+08:00',
    endTime: '2026-05-23T06:38:00+08:00',
    output: '5个事件通过多源印证（≥2个独立信源）。1个事件（evt-005韩国快闪店）仅单源且存在幻觉风险，已拦截并标记为🔴传闻·待核实。1个事件（evt-004亚马逊佣金）仅单源但来源权威，标记为🟡推测。',
    progress: 100,
  },
  {
    agentName: 'Briefing Agent',
    agentRole: '简报员 — 生成结构化日报',
    status: 'success',
    startTime: '2026-05-23T06:38:00+08:00',
    endTime: '2026-05-23T06:42:00+08:00',
    output: '生成完整版日报（6个事件），精简版日报（4个高优先级事件）。按「影响度×紧急度」排序，输出12条行动建议。',
    progress: 100,
  },
  {
    agentName: 'Human Agent',
    agentRole: '人工接管 — 复核与反馈',
    status: 'idle',
    startTime: '2026-05-23T06:42:00+08:00',
    output: '等待人工复核。当前有2个待复核事件（evt-004、evt-005）。',
    progress: 0,
  },
];

// ==================== 市场热力数据 ====================

export const mockMarketHeatData: MarketHeatData[] = [
  {
    region: 'usa',
    regionName: '美国',
    intensity: 78,
    eventCount: 3,
    changeCount: 3,
    topEvents: ['FTC法规更新', 'TikTok话题爆发', '亚马逊佣金调整'],
  },
  {
    region: 'japan',
    regionName: '日本',
    intensity: 92,
    eventCount: 1,
    changeCount: 1,
    topEvents: ['竞品大幅降价+限定款'],
  },
  {
    region: 'korea',
    regionName: '韩国',
    intensity: 45,
    eventCount: 1,
    changeCount: 1,
    topEvents: ['快闪店集中开业（待核实）'],
  },
  {
    region: 'southeast_asia',
    regionName: '东南亚',
    intensity: 62,
    eventCount: 1,
    changeCount: 1,
    topEvents: ['Shopee流量扶持计划'],
  },
  {
    region: 'china',
    regionName: '中国',
    intensity: 35,
    eventCount: 0,
    changeCount: 0,
    topEvents: ['暂无重大变化'],
  },
];

// ==================== 时间线节点 ====================

export const mockTimelineNodes: TimelineNode[] = [
  {
    id: 'tl-001',
    date: '2026-05-19',
    title: '日本竞品价格稳定期结束',
    market: 'japan',
    category: 'competitor',
    eventId: 'evt-001',
  },
  {
    id: 'tl-002',
    date: '2026-05-20',
    title: '亚马逊珠宝类目佣金调整公告',
    market: 'usa',
    category: 'platform',
    eventId: 'evt-004',
  },
  {
    id: 'tl-003',
    date: '2026-05-21',
    title: '美国FTC发布珠宝标签法规修订草案',
    market: 'usa',
    category: 'regulation',
    eventId: 'evt-002',
  },
  {
    id: 'tl-004',
    date: '2026-05-22',
    title: 'Shopee新加坡卖家峰会宣布Q3扶持计划',
    market: 'southeast_asia',
    category: 'platform',
    eventId: 'evt-006',
  },
  {
    id: 'tl-005',
    date: '2026-05-22',
    title: '日本「光輝珠寶」全线下调价格30%',
    market: 'japan',
    category: 'competitor',
    eventId: 'evt-001',
  },
  {
    id: 'tl-006',
    date: '2026-05-23',
    title: 'TikTok美国区培育钻石话题播放量暴增',
    market: 'usa',
    category: 'social',
    eventId: 'evt-003',
  },
  {
    id: 'tl-007',
    date: '2026-05-25',
    title: '【预警】美国FTC法规公示期截止提醒',
    market: 'usa',
    category: 'regulation',
    eventId: 'evt-002',
  },
  {
    id: 'tl-008',
    date: '2026-05-30',
    title: '【预警】日本区竞品对标会议截止',
    market: 'japan',
    category: 'competitor',
    eventId: 'evt-001',
  },
];

// ==================== 系统状态 ====================

export const mockSystemStatus: SystemStatus = {
  version: 'full',
  errorRate: 8.3,
  totalEvents: 6,
  pendingReview: 2,
  agentExecutions: mockAgentExecutions,
  lastGeneratedAt: '2026-05-23T06:42:00+08:00',
  nextScheduledAt: '2026-05-24T08:00:00+08:00',
  humanReviewMode: false,
};

// ==================== 推送配置 ====================

export const mockPushConfig: PushConfig = {
  enabled: true,
  time: '08:00',
  channels: ['web', 'feishu'],
  version: 'compact',
};

// ==================== 市场配置 ====================

export const mockMarketConfigs: MarketConfig[] = [
  {
    region: 'china',
    enabled: true,
    categories: ['competitor', 'regulation', 'social', 'platform'],
    keywords: ['培育钻石', '实验室钻石', '人工钻石'],
  },
  {
    region: 'japan',
    enabled: true,
    categories: ['competitor', 'regulation', 'social', 'platform'],
    keywords: ['ラボグロウンダイヤモンド', '合成ダイヤ', '光輝珠寶'],
  },
  {
    region: 'korea',
    enabled: true,
    categories: ['competitor', 'social', 'platform'],
    keywords: ['랩그로운다이아몬드', '합성다이아몬드'],
  },
  {
    region: 'southeast_asia',
    enabled: true,
    categories: ['platform', 'competitor'],
    keywords: ['lab grown diamond', 'Shopee', 'Lazada'],
  },
  {
    region: 'usa',
    enabled: true,
    categories: ['regulation', 'social', 'platform', 'competitor'],
    keywords: ['lab grown diamond', 'FTC', 'TikTok jewelry'],
  },
];

// ==================== 辅助函数 ====================

export function getEventById(id: string): IntelligenceEvent | undefined {
  return mockEvents.find((e) => e.id === id);
}

export function getEventsByConfidence(level: string): IntelligenceEvent[] {
  return mockEvents.filter((e) => e.confidence === level);
}

export function getEventsByMarket(region: string): IntelligenceEvent[] {
  return mockEvents.filter((e) => e.markets.includes(region as any));
}

export function getPendingReviewEvents(): IntelligenceEvent[] {
  return mockEvents.filter((e) => e.reviewStatus === 'pending');
}

export function getConfirmedEvents(): IntelligenceEvent[] {
  return mockEvents.filter((e) => e.confidence === 'confirmed');
}
