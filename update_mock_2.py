import re

with open('/workspace/app-btvkxctz25mp/src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace actionSuggestions for evt-002
content = re.sub(
    r"actionSuggestions:\s*\[[\s\S]*?\]\s*,\s*impactChain:\s*\[\s*'要求销售页面和实体标签明确标注生产工艺",
    r'''actionSuggestions: [
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
      '要求销售页面和实体标签明确标注生产工艺''',
    content
)

# Replace actionSuggestions for evt-003
content = re.sub(
    r"actionSuggestions:\s*\[[\s\S]*?\]\s*,\s*impactChain:\s*\[\s*'TikTok美国区培育钻石话题播放量暴增",
    r'''actionSuggestions: [
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
      'TikTok美国区培育钻石话题播放量暴增''',
    content
)

# Replace actionSuggestions for evt-004
content = re.sub(
    r"actionSuggestions:\s*\[[\s\S]*?\]\s*,\s*impactChain:\s*\[\s*'亚马逊珠宝类目推荐佣金率下调",
    r'''actionSuggestions: [
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
      '亚马逊珠宝类目推荐佣金率下调''',
    content
)

# Replace actionSuggestions for evt-005
content = re.sub(
    r"actionSuggestions:\s*\[[\s\S]*?\]\s*,\s*impactChain:\s*\[\s*'韩国首尔江南区培育钻石快闪店集中开业",
    r'''actionSuggestions: [
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
      '韩国首尔江南区培育钻石快闪店集中开业''',
    content
)

# Replace actionSuggestions for evt-006
content = re.sub(
    r"actionSuggestions:\s*\[[\s\S]*?\]\s*,\s*impactChain:\s*\[\s*'Shopee加大对珠宝首饰类目流量扶持",
    r'''actionSuggestions: [
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
      'Shopee加大对珠宝首饰类目流量扶持''',
    content
)

with open('/workspace/app-btvkxctz25mp/src/data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated all actionSuggestions successfully.")
