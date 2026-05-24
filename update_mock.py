import re

with open('/workspace/app-btvkxctz25mp/src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# For evt-001
content = content.replace('''    actionSuggestions: [
      {
        text: '本周内召开日本区竞品对标会议，评估是否需要跟进价格策略',
        priority: 1,
        deadline: '2026-05-26',
      },
      {
        text: '监测中国和韩国电商平台，预判是否会出现类似降价潮',
        priority: 2,
        deadline: '2026-05-30',
      },
      {
        text: '评估「限定款」策略在亚太其他市场的可复制性',
        priority: 3,
      },
    ],''', '''    actionSuggestions: [
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
    ],''')

# For evt-002
content = content.replace('''    actionSuggestions: [
      {
        text: '法务部立即启动美国联邦贸易委员会(FTC)新规自查',
        priority: 1,
        deadline: '2026-05-25',
      },
      {
        text: '美国线上商城与实体店物料在90天缓冲期内完成合规替换',
        priority: 1,
        deadline: '2026-08-20',
      },
      {
        text: '公关部门准备应对消费者关于培育钻石定义的问询话术',
        priority: 2,
      },
    ],''', '''    actionSuggestions: [
      {
        id: 'act-002-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '法务部联合产品部，出台全球培育钻石及天然钻石合规标签标准作业指导书(SOP)。',
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
        text: '美国及跨境门店销售全员：使用最新合规话术应对消费者对培育钻石的问询。',
        priority: 2,
        expectedOutcome: '提升消费者信任度，避免现场虚假宣传投诉。',
      },
    ],''')

# For evt-003
content = content.replace('''    actionSuggestions: [
      {
        text: '电商部门需在5月25日前提交Shopee合规经营自查报告',
        priority: 1,
        deadline: '2026-05-25',
      },
      {
        text: '关注平台流量分配规则变化，评估可能带来的流量获取成本上升',
        priority: 2,
        deadline: '2026-06-01',
      },
      {
        text: '探索TikTok Shop等其他平台作为补充渠道的可能性',
        priority: 2,
      },
    ],''', '''    actionSuggestions: [
      {
        id: 'act-003-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '加速探索TikTok Shop、Lazada等平台，降低对单一平台的渠道依赖。',
        priority: 2,
        expectedOutcome: '分散电商渠道风险，保障东南亚区域整体营收稳定。',
        deadline: '2026-06-01',
      },
      {
        id: 'act-003-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '东南亚电商部：5月25日前提交Shopee珠宝类目合规资质复审报告，测算履约成本。',
        priority: 1,
        expectedOutcome: '避免店铺被限流或下架，保障大促季正常报名。',
        deadline: '2026-05-25',
      },
      {
        id: 'act-003-3',
        level: 'store',
        levelLabel: '门店执行',
        text: '海外仓/国内直邮履约中心：自查并优化包装与发货流程，符合新的商家履约考核标准。',
        priority: 2,
        expectedOutcome: '避免因物流履约超时引发的平台高额扣分。',
      },
    ],''')

# For evt-004
content = content.replace('''    actionSuggestions: [
      {
        text: '人工复核事件真实性',
        priority: 1,
      },
      {
        text: '暂停相关应对策略的制定，等待更多信源确认',
        priority: 2,
      },
    ],''', '''    actionSuggestions: [
      {
        id: 'act-004-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '风控委员会：持续监控韩国珍珠关税政策，暂缓战略性调整。',
        priority: 2,
        expectedOutcome: '避免因不实传闻导致战略误判与资金浪费。',
      },
      {
        id: 'act-004-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '韩国区域采购部：进行实地供应商摸底，人工复核关税调整传闻。',
        priority: 1,
        expectedOutcome: '查清事实真相，为总部决策提供一线情报支撑。',
      },
    ],''')

# For evt-005
content = content.replace('''    actionSuggestions: [
      {
        text: '市场部评估KOL合作性价比，考虑引入微型KOL矩阵策略',
        priority: 2,
        deadline: '2026-06-15',
      },
      {
        text: '监测该趋势是否会向中国一二线城市传导',
        priority: 3,
      },
    ],''', '''    actionSuggestions: [
      {
        id: 'act-005-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '市场营销中心：将美国KOL营销策略向「微型KOL/KOC种草」模式转移。',
        priority: 2,
        expectedOutcome: '降低整体KOL获客成本约30%，提高品牌真实口碑声量。',
        deadline: '2026-06-15',
      },
      {
        id: 'act-005-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '大中华区市场部：建立监测机制，评估「反滤镜」趋势是否向中国一二线城市传导。',
        priority: 3,
        expectedOutcome: '提前布局国内小红书等平台的新型内容策略。',
      },
      {
        id: 'act-005-3',
        level: 'store',
        levelLabel: '门店执行',
        text: '美国门店及线上客服：在社交媒体互动中减少过度精修内容，采用更贴近日常的实拍图。',
        priority: 3,
        expectedOutcome: '迎合目标客群审美偏好，提升互动率。',
      },
    ],''')

# For evt-006
content = content.replace('''    actionSuggestions: [
      {
        text: '国内采购团队加快黄金原料备货进度',
        priority: 1,
        deadline: '2026-05-24',
      },
      {
        text: '关注黄金相关期货对冲策略',
        priority: 2,
      },
    ],''', '''    actionSuggestions: [
      {
        id: 'act-006-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '供应链中心：即刻启动黄金原料紧急备货，同时联合财务部调整黄金期货对冲比例。',
        priority: 1,
        expectedOutcome: '锁定原材料成本，防避金价大幅波动导致的毛利暴跌。',
        deadline: '2026-05-24',
      },
      {
        id: 'act-006-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '各海外区域：暂缓终端一口价黄金饰品大型促销活动，等待总部最新成本核算。',
        priority: 1,
        expectedOutcome: '避免促销击穿成本线，保证正常利润。',
      },
      {
        id: 'act-006-3',
        level: 'store',
        levelLabel: '门店执行',
        text: '全球终端门店：强化按克计价类金饰的「保值/避险」销售话术。',
        priority: 2,
        expectedOutcome: '利用金价上涨心理预期，促进按克计价类金饰成交。',
      },
    ],''')

with open('/workspace/app-btvkxctz25mp/src/data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated mockData.ts successfully.")
